# Crowd Count Using Video Analytics

![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python\&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-Web_Framework-black?logo=flask)
![OpenCV](https://img.shields.io/badge/OpenCV-Computer_Vision-green?logo=opencv)
![YOLO](https://img.shields.io/badge/YOLO-Object_Detection-red)
![Status](https://img.shields.io/badge/Status-Active-success)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## 📌 Overview

**Crowd Count Using Video Analytics** is a smart video analytics system designed to monitor and manage crowd levels in real time. The project integrates **computer vision**, **secure user management** to deliver a full-stack solution for intelligent crowd monitoring.

With this system, users can:

* Securely log in with authentication and session management
* Manage personal user profiles with additional details
* Upload video streams and define custom monitoring zones
* Track and count people in each zone using AI-based detection and tracking
* Visualize live crowd data through charts, heatmaps, and video overlays
* Receive alerts when crowd levels exceed safe thresholds

This solution is applicable to **malls, events, stadiums, transport hubs, and public safety environments** where crowd control is critical.


## ✨ Features

### 🔐 Secure User Management & Profiles

* **Secure Authentication**: Robust registration and login system for controlled user access
* **User Profile Page**: Dedicated page to view account details (username, email) and manage personal information such as date of birth, age, place, and gender
* **Password Security**: Passwords are never stored in plain text and are securely hashed
* **Session Management**: JWT-based authentication ensures secure and scalable user sessions


### 📍 Zone Management

* **Interactive Zone Creation**: Upload videos and draw, edit, save, and manage zones directly on video frames
* **Persistent Storage**: Zone data and custom thresholds are stored securely in a database for each user


### 📊 Real-Time Analytics

* **Live Dashboard**: A comprehensive dashboard displaying zone-wise crowd counts in real time
* **Unique ID Tracking**: Uses **YOLO + DeepSORT** to assign persistent IDs, preventing double counting
* **Data Visualization**: Line charts for population trends and heatmap overlays to highlight crowd density
* **Smart Alerts**: Automatic alerts when crowd levels exceed user-defined thresholds

## 🔄 Project Workflow

1. **User Onboarding**  
   New users register through a simple sign-up page, while existing users log in securely.

2. **Profile Management**  
   Users can view and update personal information through their profile page after logging in.

3. **Video & Zone Setup**  
   Users upload a video or use a webcam feed, then draw custom zones to define monitoring areas.

4. **Real-Time Monitoring**  
   Individuals are tracked using unique IDs, counted within each zone, and displayed on a live dashboard.

5. **Visualization & Alerts**  
   Crowd trends are visualized using charts and heatmaps, with alerts triggered when zone capacity limits are exceeded.


## 🚀 Getting Started

### Prerequisites

* Python 3.9+
* pip (Python package manager)
* Git


### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tejaswinirayavarapu/Crowd-Count-using-Video-Analytics.git
   cd Crowd-Count-using-Video-Analytics
   ```

2. **Create and activate a virtual environment**

   ```bash
   python -m venv venv
   ```

   * On Windows:

     ```bash
     venv\Scripts\activate
     ```
   * On macOS/Linux:

     ```bash
     source venv/bin/activate
     ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**

   ```bash
   python app.py
   ```

5. **Access the application**

   Open your browser and navigate to:

   ```
   http://127.0.0.1:5000
   ```


## 🧭 Application Walkthrough

### 1. Login & Registration

The application starts with a **Login Page**. New users can register by providing a username, email, and password. Existing users can log in securely.


### 2. User Profile

After logging in, users can access the **User Information** page from the sidebar to:

* View registration details
* Add or update personal information such as date of birth, age, and gender


### 3. Zone Manipulation Dashboard

The main dashboard provides a **Zone Manipulation** menu with the following options:

* Upload a video or use a webcam feed
* Draw rectangular zones over the video for monitoring
* Preview zones and track individuals with unique IDs
* Edit or delete existing zones


### 4. Live Dashboard

The **Live Dashboard** enables users to:

* View real-time population counts for each zone
* Analyze population trends through line charts
* Observe activity heatmaps over the video feed
* Receive alerts when any zone exceeds its defined capacity


## 🛠️ Tech Stack

* **Languages**: Python, JavaScript
* **Framework**: Flask
* **Computer Vision**: OpenCV, YOLO, DeepSORT
* **Database**: SQLite
* **Security**: Password Hashing, JWT Authentication

