
# Dance Posture Recognition App

A web-based application that helps users learn dance movements by comparing their real-time camera feed with reference dance videos. The app uses MediaPipe pose detection to analyze and score dance postures in real-time.

## Features

- **Video Upload**: Upload dance reference videos (MP4 format)
- **Real-time Pose Detection**: Uses MediaPipe to detect human poses from video frames
- **Live Camera Feed**: Capture your movements through webcam
- **Instant Scoring**: Get real-time feedback on how well you match the reference pose
- **Pose Marking**: Mark specific poses from uploaded videos for practice
- **Mirror Mode**: Toggle between normal and mirrored view

## How It Works

1. **Upload Reference Video**: Upload a dance video containing the movements you want to learn
2. **Mark Target Poses**: Scrub through the video and mark specific poses you want to practice
3. **Start Practice**: Activate your camera and follow the target poses
4. **Get Feedback**: Receive real-time scores and feedback on your performance

## Technology

- **Frontend**: HTML5, CSS3, JavaScript
- **Pose Detection**: MediaPipe Pose (WebAssembly)
- **Camera Access**: WebRTC getUserMedia API
- **Scoring**: Landmark distance similarity comparison

## Getting Started

### Prerequisites
- Modern web browser with camera access
- Local web server (required for camera access)

### Installation & Setup

1. **Clone or Download** this repository to your local machine

2. **Start a Local Server**:
   ```bash
   # Navigate to the project directory
   cd /path/to/dance_posture
   
   # Start a local server (choose one method):
   
   # Method 1: Python
   python3 -m http.server 5500
   
   # Method 2: Node.js (if you have it installed)
   npx http-server -p 5500
   
   # Method 3: PHP (if you have it installed)
   php -S localhost:5500
   ```

3. **Open the App**:
   - Navigate to `http://localhost:5500` in your browser
   - Allow camera access when prompted

### Usage Guide

#### Step 1: Upload Reference Video
- Click "Choose File" to upload a dance video (MP4 format recommended)
- Use the video scrubber to navigate to the desired pose
- Click "標記為姿勢1" (Mark as Pose 1) to capture the pose at the current frame

#### Step 2: Start Practice
- Click "啟動相機" (Start Camera) to begin live pose detection
- The left panel shows your target pose (blue skeleton)
- The right panel shows your live camera feed with pose overlay (green skeleton)

#### Step 3: Follow and Improve
- Match your pose to the target pose shown on the left
- Watch your real-time score update (0-100%)
- Use "鏡像視圖" (Mirror View) to see yourself mirrored if needed

### Controls

| Control | Description |
|---------|-------------|
| **Video Upload** | Choose video file to use as reference |
| **Play/Pause** | Control reference video playback |
| **Scrubber** | Fine-tune video position for precise pose marking |
| **Mark Pose** | Capture pose at current video frame |
| **Start/Stop Camera** | Begin or end live pose detection |
| **Mirror Toggle** | Switch between normal and mirrored view |
| **Clear All** | Reset all marked poses |
| **Show Details** | View pose information and preview |

### Scoring System

- **Excellent (80-100%)**: 優秀！Great job!
- **Good (60-79%)**: 不錯！Keep it up!
- **Needs Practice (40-59%)**: 繼續努力 - Keep practicing
- **Poor (0-39%)**: 多練習 - More practice needed

### Troubleshooting

**Camera not working?**
- Ensure you're accessing the app via `localhost` or `https://`
- Check browser permissions for camera access
- Try refreshing the page

**No pose detected?**
- Make sure you're using videos with clear human figures
- Ensure good lighting in your camera view
- Try different video frames if pose detection fails

**Performance issues?**
- Close other browser tabs to free up resources
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Ensure stable internet connection for MediaPipe loading

### Technical Notes

- **Pose Detection**: Uses MediaPipe Pose for real-time human pose estimation
- **Scoring**: Based on landmark distance similarity comparison
- **Browser Support**: Works on modern browsers with WebAssembly support
- **Camera Requirements**: Requires HTTPS or localhost for camera access
