
# Dance Posture Recognition App

A web-based application that helps users learn dance movements by comparing their real-time camera feed with reference dance videos. The app uses MediaPipe pose detection to analyze and score dance postures in real-time.

## Features

- **Dual Mode Support**:
  - **Video Mode**: Upload dance videos and mark specific frames for practice (original)
  - **Photo Mode**: Upload 5 different pose photos and select which ones to practice (new)

- **Real-time Pose Detection**: Uses MediaPipe to detect human poses from both video frames and photos
- **Multi-Pose Practice**: Practice multiple poses sequentially with timer
- **Live Camera Feed**: Capture your movements through webcam
- **Instant Scoring**: Get real-time feedback on how well you match the reference pose
- **Pose Selection**: Choose which detected poses to include in your practice session
- **Photo Preview**: Click photo thumbnails to view enlarged versions in modal popup
- **Processing Progress**: Real-time progress indicators during photo analysis
- **Automatic Timer Practice**: Practice multiple poses sequentially with 10-second timer per pose
- **In-Camera Animations**: Smooth countdown animations appear only in your camera area
- **Integrated Score Display**: Real-time scores shown directly in practice area for better visibility
- **Persistent Practice Interface**: Practice area stays visible after completion with restart button
- **Enhanced Photo Preview**: Click photo thumbnails for enlarged modal view
- **Improved Progress Feedback**: Real-time processing progress with detailed status
- **Mirror Mode**: Toggle between normal and mirrored view

## How It Works

### Video Mode (Original)
1. **Upload Reference Video**: Upload a dance video containing the movements you want to learn
2. **Mark Target Poses**: Scrub through the video and mark specific poses you want to practice
3. **Start Practice**: Activate your camera and follow the target poses
4. **Get Feedback**: Receive real-time scores and feedback on your performance

### Photo Mode (New)
1. **Upload 5 Photos**: Upload 5 different dance pose photos
2. **Auto Detection**: System automatically detects poses from each photo with progress feedback
3. **Photo Preview**: Click any photo thumbnail to view enlarged version
4. **Select Poses**: Choose which poses to include in your practice session
5. **Manual Practice**: Practice poses manually by clicking next/previous buttons
6. **In-Camera Animation**: Smooth 2-second countdown appears only in your camera area
7. **Horizontal Layout**: Pose info, scores, and controls all displayed in clean horizontal lines
8. **Smart Progression**: Single pose ends practice, multiple poses advance to next
9. **Real-time Score Display**: Live scoring during practice with integrated controls
10. **Easy Restart**: Click "✅ 結束練習" to immediately reselect poses and start again

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

#### Video Mode (Original Method)

**Step 1: Upload Reference Video**
- Click "Choose File" to upload a dance video (MP4 format recommended)
- Use the video scrubber to navigate to the desired pose
- Click "標記為姿勢1" (Mark as Pose 1) to capture the pose at the current frame

**Step 2: Start Practice**
- Click "啟動相機" (Start Camera) to begin live pose detection
- The left panel shows your target pose (blue skeleton)
- The right panel shows your live camera feed with pose overlay (green skeleton)

**Step 3: Follow and Improve**
- Match your pose to the target pose shown on the left
- Watch your real-time score update (0-100%)
- Use "鏡像視圖" (Mirror View) to see yourself mirrored if needed

#### Photo Mode (New Method)

**Step 1: Choose Photo Mode**
- Click "照片模式 (新功能)" to switch to photo mode
- You'll be redirected to the photo mode page

**Step 2: Upload 5 Photos**
- Click "Choose File" to select exactly 5 dance pose photos
- Watch the processing progress bar as each photo is analyzed
- View the detected poses in the preview grid with processing status

**Step 3: Select Poses to Practice**
- Review all detected poses (shown as small preview images)
- **Click any photo to view enlarged version** in a modal popup
- Check the boxes next to poses you want to practice
- Click "全選" to select all or "全唔選" to deselect all
- Click "開始練習" when ready

**Step 4: Manual Practice**
- **Manual progression**: Click "下一個姿勢" / "上一個姿勢" buttons to navigate between poses
- **Self-paced practice**: Take as much time as you need to match each pose
- **Smart progression**:
  - Single pose selected → Click "✅ 結束練習" to end practice
  - Multiple poses → Click "下一個姿勢" to advance to next pose
- **In-camera animation**: Smooth countdown animation (2 seconds) appears only in your camera area
- **Unified control panel**: Camera and practice controls grouped together in one area
- **Clear landmark display**: White background for better pose landmark visibility
- **Clean pose display**: Pose names shown below video panels without overlaying landmarks
- Left panel shows current target pose (blue skeleton)
- Right panel shows your live camera feed with pose overlay (green skeleton)
- Use "上一個姿勢" / "下一個姿勢" in the control panel to manually navigate between poses

**Step 5: End Practice & Restart**
- **Click "✅ 結束練習"** to immediately return to pose selection
- **No intermediate screens** - directly back to selecting poses
- **All checkboxes reset** - can reselect any poses you want
- **Camera stops automatically** - ready for next practice session
- **Start over anytime** - practice the same poses or try different ones

### Controls

#### Video Mode Controls
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

#### Photo Mode Controls
| Control | Description |
|---------|-------------|
| **Photo Upload** | Select exactly 5 pose photos (multiple selection) |
| **Processing Progress** | Watch real-time progress as photos are analyzed |
| **Photo Preview** | Click any photo thumbnail to view enlarged version in modal |
| **Select All** | Check all detected poses for practice |
| **Deselect All** | Uncheck all poses |
| **Start Practice** | Begin practice with selected poses |
| **Manual Control** | Click next/previous buttons to navigate poses |
| **In-Camera Animation** | 2-second countdown appears only in your camera area |
| **Unified Controls** | Camera and practice controls in one area |
| **Real-time Scores** | Live score display during practice |
| **Prev/Next Pose** | Manually navigate between poses during practice |
| **✅ 結束練習** | End practice and return to pose selection to choose again |
| **Start/Stop Camera** | Begin or end live pose detection |
| **Mirror Toggle** | Switch between normal and mirrored view |
| **Back to Video Mode** | Return to original video mode |

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
