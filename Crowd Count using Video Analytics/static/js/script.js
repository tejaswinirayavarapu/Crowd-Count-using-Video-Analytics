document.addEventListener('DOMContentLoaded', () => {
    const zoneManipulationBtn = document.getElementById('zone-manipulation-btn');
    const subOptions = document.getElementById('sub-options');
    const sections = document.querySelectorAll('.content-area .section');

    const webcamBtn = document.getElementById('webcam-btn');
    const uploadVideoBtn = document.getElementById('upload-video-btn');
    const drawZonesBtn = document.getElementById('draw-zones-btn');
    const previewZonesBtn = document.getElementById('preview-zones-btn');
    const trackIdsBtn = document.getElementById('track-ids-btn');
    const editZonesBtn = document.getElementById('edit-zones-btn');
    const deleteZoneBtn = document.getElementById('delete-zone-btn');

    const uploadForm = document.getElementById('upload-form');
    const videoFileInput = document.getElementById('video-file-input');
    const videoPlayerSection = document.getElementById('video-player-section');
    const videoPlayer = document.getElementById('video-player');
    const videoSource = document.getElementById('video-source');
    const zoneCanvas = document.getElementById('zone-canvas');
    let trackingPreviewImg;
    const webcamFeed = document.getElementById('webcam-feed');
    const webcamCanvas = document.getElementById('webcam-canvas');

    let currentZones = [];
    let isDrawing = false;
    let startX, startY;
    let activeCanvas = null;
    let webcamStream = null;

    // Modified to show a single section and hide others
    function showSection(id) {
        sections.forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(id).style.display = 'block';
    }

    // Toggles visibility of sub-options
    zoneManipulationBtn.addEventListener('click', () => {
        const isVisible = subOptions.style.display === 'block';
        subOptions.style.display = isVisible ? 'none' : 'block';
    });

    uploadVideoBtn.addEventListener('click', () => {
        stopWebcamIfRunning();
        clearVideoIfAny();
        showSection('upload-section');
    });

    webcamBtn.addEventListener('click', () => {
        clearVideoIfAny();
        showSection('webcam-section');
        startWebcam();
    });

    // Handle video file upload
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = videoFileInput.files[0];
        if (!file) {
            alert('Please select a video file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('video', file);

        try {
            const response = await fetch('/upload-video', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                videoSource.src = result.video_path;
                videoPlayer.load();
                showSection('video-player-section');
                activeCanvas = zoneCanvas;
                
                videoPlayer.onloadedmetadata = () => {
                    // Match container and canvas to the video's natural size so
                    // zone coordinates remain identical between preview and tracking.
                    const container = videoPlayer.parentElement;
                    const natW = videoPlayer.videoWidth;
                    const natH = videoPlayer.videoHeight;
                    if (natW && natH) {
                        container.style.width = natW + 'px';
                        container.style.height = natH + 'px';
                    }
                    activeCanvas.width = natW;
                    activeCanvas.height = natH;
                    videoPlayer.play();
                    fetchZonesFromServer();
                };
            } else {
                alert('Video upload failed.');
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            alert('An error occurred during upload.');
        }
    });

    // Start DeepSORT ID tracking preview using uploaded video
    trackIdsBtn && trackIdsBtn.addEventListener('click', async () => {
        if (!videoSource.src) {
            alert('Upload a video first.');
            return;
        }
        try {
            await fetch('/zm_start_tracking', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ video_path: new URL(videoSource.src).pathname }) });
            // Create preview image overlay if not exists
            if (!trackingPreviewImg) {
                trackingPreviewImg = document.createElement('img');
                trackingPreviewImg.style.position = 'absolute';
                trackingPreviewImg.style.top = '0';
                trackingPreviewImg.style.left = '0';
                // Match the video's natural size to keep zones aligned
                const natW = videoPlayer.videoWidth || 0;
                const natH = videoPlayer.videoHeight || 0;
                const container = videoPlayer.parentElement;
                if (natW && natH) {
                    container.style.width = natW + 'px';
                    container.style.height = natH + 'px';
                }
                trackingPreviewImg.style.width = '100%';
                trackingPreviewImg.style.height = '100%';
                trackingPreviewImg.style.objectFit = 'fill';
                trackingPreviewImg.style.pointerEvents = 'none';
                container.appendChild(trackingPreviewImg);
            }
            trackingPreviewImg.src = '/zm_feed';
            showSection('video-player-section');
            videoPlayer.pause();
        } catch (err) {
            console.error('Failed to start tracking preview', err);
            alert('Failed to start tracking.');
        }
    });

    function startWebcam() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    webcamStream = stream;
                    webcamFeed.srcObject = stream;
                    webcamFeed.onloadedmetadata = () => {
                        webcamFeed.play();
                        webcamCanvas.width = webcamFeed.videoWidth;
                        webcamCanvas.height = webcamFeed.videoHeight;
                        activeCanvas = webcamCanvas;
                        fetchZonesFromServer();
                    };
                })
                .catch(err => {
                    console.error('Could not start webcam:', err);
                    alert('Could not access the webcam. Please ensure your camera is enabled.');
                });
        }
    }

    function stopWebcamIfRunning() {
        if (webcamStream) {
            webcamStream.getTracks().forEach(t => t.stop());
            webcamStream = null;
        }
        if (webcamFeed) {
            webcamFeed.pause();
            webcamFeed.srcObject = null;
        }
    }

    function clearVideoIfAny() {
        if (videoPlayer && !videoPlayer.paused) videoPlayer.pause();
        if (videoSource) {
            videoSource.src = '';
            videoPlayer.load();
        }
    }

    function setupDrawing(canvas) {
        if (!canvas) {
            alert("No active video or webcam feed. Please upload a video or start the webcam.");
            return;
        }
        
        // Ensure the correct section is visible before drawing
        if (canvas === zoneCanvas) {
            showSection('video-player-section');
            videoPlayer.pause();
        } else if (canvas === webcamCanvas) {
            showSection('webcam-section');
            webcamFeed.pause();
        }

        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        canvas.onmousedown = (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
        };

        canvas.onmousemove = (e) => {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawAllZones(canvas);
            ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);
        };

        canvas.onmouseup = (e) => {
            if (isDrawing) {
                isDrawing = false;
                const rect = canvas.getBoundingClientRect();
                const endX = e.clientX - rect.left;
                const endY = e.clientY - rect.top;

                const label = prompt("Enter a name for this zone:");
                if (label) {
                    const newZone = {
                        label: label,
                        topLeftX: Math.min(startX, endX),
                        topLeftY: Math.min(startY, endY),
                        bottomRightX: Math.max(startX, endX),
                        bottomRightY: Math.max(startY, endY)
                    };
                    currentZones.push(newZone);
                    drawAllZones(canvas);
                    saveZoneToServer(newZone);
                } else {
                    drawAllZones(canvas);
                }
            }
        };
    }

    function drawAllZones(canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);

        currentZones.forEach(zone => {
            const width = zone.bottomRightX - zone.topLeftX;
            const height = zone.bottomRightY - zone.topLeftY;
            ctx.strokeRect(zone.topLeftX, zone.topLeftY, width, height);
            ctx.fillStyle = 'red';
            ctx.font = '16px Arial';
            ctx.fillText(zone.label, zone.topLeftX + 5, zone.topLeftY + 20);
        });
    }

    async function saveZoneToServer(zone) {
        try {
            const video_path = activeCanvas === zoneCanvas ? videoSource.src : 'webcam_feed';

            const payload = { ...zone, video_path: video_path };

            const response = await fetch('/save_zone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (!response.ok) {
                alert(`Error saving zone: ${result.error}`);
            } else {
                console.log('Zone saved to server:', result.message);
            }
        } catch (error) {
            console.error('Failed to save zone:', error);
            alert('An error occurred while saving the zone.');
        }
    }

    drawZonesBtn.addEventListener('click', () => {
        if (activeCanvas) {
            // First, make sure the video/webcam section is visible
            if (activeCanvas === zoneCanvas) {
                showSection('video-player-section');
            } else if (activeCanvas === webcamCanvas) {
                showSection('webcam-section');
            }
            // Then, enable drawing
            setupDrawing(activeCanvas);
            alert("Drawing mode enabled. Click and drag on the video to draw a zone.");
        } else {
            alert("Please first upload a video or start the webcam.");
        }
    });

    previewZonesBtn.addEventListener('click', () => {
        if (activeCanvas) {
            // First, make sure the video/webcam section is visible
            if (activeCanvas === zoneCanvas) {
                showSection('video-player-section');
                videoPlayer.play();
            } else if (activeCanvas === webcamCanvas) {
                showSection('webcam-section');
                webcamFeed.play();
            }
            // Then, fetch and draw the zones
            fetchZonesFromServer();
            // Prime tracker in the background so Track IDs shows instantly
            if (videoSource && videoSource.src) {
                try {
                    fetch('/zm_start_tracking', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ video_path: new URL(videoSource.src).pathname })
                    });
                } catch (e) {
                    console.warn('Tracker warmup failed (non-blocking):', e);
                }
            }
        } else {
            alert("Please first upload a video or start the webcam.");
        }
    });

    async function fetchZonesFromServer() {
        try {
            const response = await fetch('/get_zones');
            if (response.ok) {
                currentZones = await response.json();
                if (activeCanvas) {
                    drawAllZones(activeCanvas);
                }
            } else {
                console.error('Failed to fetch zones.');
            }
        } catch (error) {
            console.error('Error fetching zones:', error);
        }
    }

    // --- Edit and Delete Functionality (Corrected for proper section switching) ---
    editZonesBtn.addEventListener('click', () => {
        // Hide the video/webcam section when showing the edit form
        if (activeCanvas === zoneCanvas) {
            videoPlayerSection.style.display = 'none';
        } else if (activeCanvas === webcamCanvas) {
            document.getElementById('webcam-section').style.display = 'none';
        }

        showSection('edit-section');
        populateZoneSelect('edit-zone-select');
    });

    deleteZoneBtn.addEventListener('click', () => {
        // Hide the video/webcam section when showing the delete form
        if (activeCanvas === zoneCanvas) {
            videoPlayerSection.style.display = 'none';
        } else if (activeCanvas === webcamCanvas) {
            document.getElementById('webcam-section').style.display = 'none';
        }
        showSection('delete-section');
        populateZoneSelect('zone-select');
    });

    // ... (rest of the functions are the same as before) ...
    async function populateZoneSelect(selectId) {
        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = '';
        try {
            const response = await fetch('/get_zones');
            const zones = await response.json();
            if (zones.length > 0) {
                zones.forEach(zone => {
                    const option = document.createElement('option');
                    option.value = zone.label;
                    option.textContent = zone.label;
                    selectElement.appendChild(option);
                });
            } else {
                const option = document.createElement('option');
                option.textContent = 'No zones found';
                selectElement.appendChild(option);
            }
        } catch (error) {
            console.error('Failed to fetch zones for select list:', error);
        }
    }
    
    document.getElementById('confirm-edit-btn').addEventListener('click', async () => {
        const oldLabel = document.getElementById('edit-zone-select').value;
        const newLabel = document.getElementById('new-label-input').value;
    
        if (!oldLabel || !newLabel) {
            alert('Please select a zone and enter a new name.');
            return;
        }
    
        try {
            const response = await fetch('/edit_zone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ old_label: oldLabel, new_label: newLabel })
            });
    
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                populateZoneSelect('edit-zone-select');
                fetchZonesFromServer();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Failed to edit zone:', error);
            alert('An error occurred while editing the zone.');
        }
    });
    
    document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
        const labelToDelete = document.getElementById('zone-select').value;
    
        if (!labelToDelete) {
            alert('Please select a zone to delete.');
            return;
        }
    
        try {
            const response = await fetch('/delete_zone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ label: labelToDelete })
            });
    
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                populateZoneSelect('zone-select');
                // Refresh zones and clear canvas to show updated list
                await fetchZonesFromServer();
                if (activeCanvas) {
                    drawAllZones(activeCanvas);
                }
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Failed to delete zone:', error);
            alert('An error occurred while deleting the zone.');
        }
    });
});