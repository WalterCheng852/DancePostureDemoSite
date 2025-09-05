

## Overview
- You want to create an easy, quick demo for a posture recognition system focused on dance.
- The system involves a small, human-like robot or a human as the reference dancer, and elderly users following the movements.
- The demo will be implemented as a web app or phone app with an updated workflow.

## Workflow
1. **User Uploads a Video**:
   - The user uploads a short video (e.g., MP4 format) of either a robot or a human performing a dance routine.
   - The system processes this video to extract the dancer's (robot or human) postures as a "standard template," with no restriction on the subject being only a robot—human dancers are also accepted.

2. **Camera Activation for Elderly**:
   - The app opens the device's camera (webcam or phone camera) to capture the elderly user's real-time dance movements.
   - The elderly user follows the dance routine as shown in the uploaded video (performed by either a robot or human).

3. **Real-Time Detection and Scoring**:
   - The system uses real-time posture detection to compare the elderly user's movements with the template postures from the uploaded video.
   - It provides instant feedback by assigning marks based on the similarity between the elderly user's posture and the reference dancer's (robot or human) posture.
   - The score is displayed on the app interface.

## Technical Assumptions
- **Dancer Characteristics**:
  - The reference dancer can be a small, human-like robot (e.g., similar to NAO or Pepper) or a human.
  - For robots, the human-like structure allows MediaPipe to detect postures effectively.
  - For humans, MediaPipe's pre-trained Pose Estimation is well-suited, ensuring compatibility.

- **Technology Stack**:
  - The demo will use HTML, JavaScript, and MediaPipe JS for a web-based or mobile-friendly solution.
  - A simple similarity comparison (e.g., cosine similarity) will be used instead of complex machine learning models to keep the demo quick and easy.

- **User Experience**:
  - The interface will be minimal, featuring video upload, camera activation, and real-time score display.
  - No support for adding new postures in this demo (can be added later with further development).
  - The system should handle both robot and human video inputs seamlessly.

## Constraints
- You have zero coding experience but will use AI assistance (e.g., Grok, ChatGPT) to guide the development.
- The goal is an easy, quick demo, prioritizing simplicity and speed over full functionality.
- The system should run locally on a browser, avoiding cloud dependencies for simplicity.

## Next Steps
- I will provide a detailed plan, time estimate, and cost estimate based on this updated understanding.
- I will avoid generating code until you request it, focusing on planning and clarification first.
- Please confirm if this aligns with your vision or if you have additional requirements (e.g., specific features, mobile-only preference).

---

## Update (2025-09-05)
### Current Behavior / 目前行為
- **Real MediaPipe on Reference Video**: Reference video frames are processed by MediaPipe Pose in real time; left panel shows blue pose landmarks only (no video in comparison area).
- **Single Pose Only**: The app now supports marking and practicing only one pose (`Pose 1`). All Pose 2 UI and logic have been removed.
- **Marking Flow**: Upload video → scrub to target time → click "標記為姿勢1" → a real MediaPipe detection runs on that frame and stores landmarks.
- **Practice Mode**: Start camera → left shows target pose skeleton; right shows your camera with green skeleton and live score.

### How to Run Locally / 本地運行方式
1. Open terminal and start a local server:
   - `python3 -m http.server 5500 --directory /Users/chauwacheng/Desktop/dance_posture`
2. Open the app in a browser:
   - `http://localhost:5500/index.html`
3. Steps:
   - Upload a dance video → mark Pose 1 → Start Camera → practice.

### Controls / 控制
- Upload: choose video file
- Scrubber: fine-tune video time; Play / Pause buttons control the upload video
- Mark: `標記為姿勢1` to capture pose at current frame
- Camera: `啟動相機` / `停止相機`
- Mirror: `鏡像視圖`
- Clear: `清除全部`
- Details: `顯示詳情` shows a modal with pose preview and info

### Notes / 注意
- Camera works on `localhost` or HTTPS only.
- Scoring uses a simple landmark distance similarity; good (≥80), average (≥60), poor (<60).
- Reference panel in comparison area draws landmarks only; the actual video is visible in the upload section for marking.
