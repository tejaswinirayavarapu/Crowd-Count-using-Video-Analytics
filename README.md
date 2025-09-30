
## Overview

This project is a **smart video analytics system** designed to monitor and manage crowd levels in real time. It combines computer vision, deep learning, and secure user management to deliver a full-stack solution for intelligent crowd monitoring.

With this system, users can:

* Log in securely with authentication and session management.
* Upload video streams and define custom monitoring zones.
* Track and count people in each zone using AI-based detection and tracking.
* Visualize live crowd data through charts, heatmaps, and video overlays.
* Receive alerts when a crowd exceeds safe thresholds.

The solution is applicable to **malls, events, stadiums, transport hubs, or public safety environments** where crowd control is critical.

## Features

### Secure User Management

* Registration and login system with session handling.
* Passwords are hashed with **SHA-256** before storage.
* **JWT-based authentication** for secure and scalable sessions.

### Zone Management

* Upload videos and **draw, edit, save, and manage zones**.
* Zone data and thresholds are persisted in the database.

### Real-Time Analytics

* **Live Dashboard** with zone-wise crowd counts, updated in real time.
* **Unique ID Tracking** with **YOLO + DeepSORT** to avoid double counting.
* **Line Charts** for visualizing population trends.
* **Heatmap Overlays** highlighting dense areas on the video feed.
* **Smart Alerts** triggered when thresholds are exceeded.

### Technical Highlights

* **Backend:** Flask with real-time updates.
* **Frontend:** HTML, CSS, JavaScript (interactive charts & alerts).
* **Computer Vision:** OpenCV, YOLO for detection, DeepSORT for tracking.
* **Database:** SQLite for users, zones, thresholds, and logs.
* **Security:** SHA-256 hashing and JWT session tokens.

## Project Workflow

1. **User Authentication** – Secure login/registration with hashed passwords & JWT sessions.
2. **Video Upload & Zone Creation** – Define multiple zones by drawing on uploaded video frames.
3. **Real-Time Crowd Monitoring** – Live updates with persistent unique IDs per person.
4. **Visualization Tools** – Line charts, heatmaps, and video overlays with tracked IDs.
5. **Smart Alerts** – Zone-specific threshold notifications for safety and control.

## Getting Started

### Prerequisites

* Python 3.9+
* pip (Python package manager)
* Git

### Installation

1. **Clone the repository**
git clone [https://github.com/your-username/crowd-count-video-analytics.git](https://github.com/tejaswinirayavarapu/Crowd-Count-using-Video-Analytics)
cd crowd-count-video-analytics

2. **Create and activate a virtual environment**
python -m venv venv
# On Windows
venv\Scripts\activate
# On Mac/Linux
source venv/bin/activate

3. **Install dependencies**

pip install -r requirements.txt

5. **Run the application**

python app.py

6. **Access the app**
   Open (http://localhost:5000) in your browser.
## Output Screenshots
When the dashboard opens, the user can see a Zone Manipulation button in 
the sidebar. Clicking this button reveals several options: 
 Use Webcam   
 Upload Video   
 Draw Zones   
 Preview Zones   
 Edit Zones   
 Delete Zones 
<img width="1917" height="1004" alt="Screenshot 2025-09-28 162400" src="https://github.com/user-attachments/assets/ab5597ce-85d1-44c9-8fed-319193238590" />

1. Upload Video or Use Webcam   
 The user can choose either "Use Webcam" or "Upload Video."  
 If Upload Video is selected, the user can pick a video file and click the 
Upload button. Once uploaded, the video will be displayed on the 
screen.
<img width="1918" height="995" alt="Screenshot 2025-09-28 162453" src="https://github.com/user-attachments/assets/773f8ca8-7790-4c0e-91c8-8858befe74ca" />

2. Draw Zones 
 After uploading the video, the user can click Draw Zones to mark specific 
areas on the video.   
 Once zones are drawn, the user can preview them using the Preview 
Zones option. 
<img width="1919" height="1022" alt="Screenshot 2025-09-28 162533" src="https://github.com/user-attachments/assets/b75b8ea5-106d-4e68-a168-53c36f732429" />
<img width="1919" height="992" alt="Screenshot 2025-09-28 162556" src="https://github.com/user-attachments/assets/d0e5341e-ba3b-41c1-9d8c-b83bbd03fc36" />

3. Preview Zones 
 Users can visualize all zones they have created overlaid on videos.
<img width="1919" height="1020" alt="Screenshot 2025-09-28 162709" src="https://github.com/user-attachments/assets/784a53b7-d44e-4148-8617-8f6b99c0a99e" />

4. tracking people id
user can see the people tracking by click on Track id button 
<img width="1912" height="1020" alt="Screenshot 2025-09-28 162819" src="https://github.com/user-attachments/assets/4ccd1b46-5853-4fbb-a17e-cfde9bc99145" />

5.Edit Zones 
 The user can then click Edit Zones to rename existing zones or add new names to them. 
 <img width="1919" height="987" alt="Screenshot 2025-09-28 162846" src="https://github.com/user-attachments/assets/e511a27a-44ed-46f4-9ad4-87449189826d" />

6. Delete Zones 
Specific zones can be deleted by selecting them from a dropdown 
menu under the Delete Zones option. 
<img width="1918" height="1004" alt="Screenshot 2025-09-28 163040" src="https://github.com/user-attachments/assets/0c524dfb-2a65-48a7-a73e-0d68c955e633" />

7. When the user clicks on the Live Dashboard, they can view: 
 Real-time population counts for each zone 
 Threshold settings to define the maximum allowed count per zone 
 Line chart visualizations showing zone-wise population trends 
 Heatmap overlays on the live video feed to highlight crowded areas 
 An alert system that notifies the user when any zone exceeds its set threshold
<img width="1901" height="1020" alt="Screenshot 2025-09-28 163140" src="https://github.com/user-attachments/assets/92f885b3-f7e9-45db-9c1a-62c2443b7266" />

## Tech Stack

* **Languages:** Python, JavaScript
* **Frameworks:** Flask
* **Computer Vision:** OpenCV, YOLO, DeepSORT
* **Database:** SQLite
* **Security:** SHA-256, JWT

## Future Scope

* Integration with **live CCTV feeds** for deployment in real-world environments.
* **Cloud-based dashboards** for centralized monitoring across multiple sites.
* **Predictive analytics** for crowd flow forecasting and resource planning.
