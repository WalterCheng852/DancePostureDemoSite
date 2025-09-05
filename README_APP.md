# Dance Posture Recognition App
## 跳舞姿勢識別應用程式

### How to Use / 使用方法

1. **Open the App** / **開啟應用程式**
   - Open `index.html` in your web browser
   - 在瀏覽器中開啟 `index.html` 檔案

2. **Upload Reference Video** / **上載參考影片**
   - Click "Choose Video File" and select a dance video (MP4 format)
   - 點擊 "Choose Video File" 並選擇一段跳舞影片（MP4 格式）
   - The video can be of a robot or human dancer
   - 影片可以係機械人或者真人跳舞

3. **Mark Key Poses** / **標記關鍵姿勢**
   - Use the video scrubber to find the first pose you want to practice
   - 用影片滑桿找到第一個想要練習的姿勢
   - Click "Mark as Pose 1" - the system will run real AI pose detection on that frame
   - 點擊 "Mark as Pose 1" - 系統會在該幀運行真實 AI 姿勢檢測
   - Find the second pose and click "Mark as Pose 2"
   - 找到第二個姿勢並點擊 "Mark as Pose 2"
   - You can mark up to 2 poses for practice with real MediaPipe detection
   - 您最多可以標記2個姿勢來練習，使用真實 MediaPipe 檢測

4. **Start Camera** / **啟動相機**
   - Click "Start Camera" to begin pose detection
   - 點擊 "Start Camera" 開始姿勢檢測
   - If you have marked poses, automatically enters practice mode
   - 如果您已標記姿勢，會自動進入練習模式
   - Left panel shows target pose skeleton, right panel shows your pose
   - 左面板顯示目標姿勢骨架，右面板顯示您嘅姿勢
   - Use "Show Pose 1" / "Show Pose 2" buttons to switch between target poses
   - 使用 "Show Pose 1" / "Show Pose 2" 按鈕切換目標姿勢

5. **View Individual Pose Scores** / **查看個別姿勢分數**
   - **Pose 1 Score**: Shows how well you match the first marked pose
   - **Pose 2 Score**: Shows how well you match the second marked pose
   - **姿勢1分數**：顯示您同第一個標記姿勢的匹配度
   - **姿勢2分數**：顯示您同第二個標記姿勢的匹配度
   - Green (80-100): Excellent match! 🟢
   - Orange (60-79): Good progress! 🟠
   - Red (<60): Keep practicing! 🔴

6. **Additional Controls** / **額外控制**
   - **Play/Pause Reference**: Control the reference video playback
   - **Mirror View**: Toggle mirrored camera view for easier following
   - **Clear All**: Remove all marked poses and start over
   - **Show Details**: View detailed information and visual preview of marked poses
   - **播放/暫停參考影片**：控制參考影片播放
   - **鏡像視圖**：切換鏡像相機視圖，更容易跟隨
   - **清除全部**：移除所有標記姿勢並重新開始
   - **顯示詳情**：查看標記姿勢的詳細信息同視覺預覽

### Browser Requirements / 瀏覽器要求
- Modern web browser with camera support
- 支援相機功能嘅現代瀏覽器
- Chrome, Firefox, Safari, or Edge recommended
- 建議使用 Chrome、Firefox、Safari 或 Edge

### Features / 功能特色
- **Real MediaPipe Pose Detection**: Both reference video and live camera use AI-powered pose detection
- **真實 MediaPipe 姿勢檢測**：參考影片同實時相機都使用 AI 驅動的姿勢檢測
- **Individual Pose Scoring**: See real-time scores for each marked pose
- **個別姿勢評分**：查看每個標記姿勢的即時分數
- **Video Scrubbing Controls**: Precise control over video playback
- **影片拖曳控制**：精確控制影片播放
- **Dynamic Pose Display**: Left panel shows target pose landmarks for reference
- **動態姿勢顯示**：左面板顯示目標姿勢關鍵點供參考
- **Interactive Pose Switching**: Switch between marked poses during practice
- **互動姿勢切換**：練習時可在標記姿勢間切換
- **Real-time Visual Feedback**: See target pose while performing
- **即時視覺回饋**：表演時同時看到目標姿勢
- **Real-time Posture Detection**: Using MediaPipe for accurate pose tracking
- **即時姿勢檢測**：使用 MediaPipe 進行準確姿勢追蹤
- **Color-coded Feedback**: Green (excellent), Orange (good), Red (practice more)
- **顏色編碼回饋**：綠色（優秀），橙色（良好），紅色（多練習）
- **Interactive Controls**: Play/pause, mirror view, clear poses
- **互動控制**：播放/暫停、鏡像視圖、清除姿勢
- **Responsive Design**: Works on desktop and mobile devices
- **響應式設計**：適用於桌面同手機裝置
- **Visual Pose Preview**: See exactly what poses you've marked with skeleton overlay
- **姿勢視覺預覽**：查看標記姿勢的精確外觀，包含骨架疊加
- **Detailed Pose Information**: View landmark count, timestamp, and current scores
- **詳細姿勢信息**：查看關鍵點數量、時間戳同目前分數
- **Elderly-friendly Interface**: Large buttons and clear feedback
- **長者友善介面**：大按鈕同清晰回饋

### Troubleshooting / 疑難排解
- If camera doesn't work, check browser permissions
- 如果相機唔運作，檢查瀏覽器權限
- Make sure you're using HTTPS or localhost for camera access
- 確保使用 HTTPS 或 localhost 以存取相機
- Try refreshing the page if you encounter issues
- 如果遇到問題，試吓重新整理頁面

### Technical Notes / 技術說明
- Runs entirely in the browser (no server required)
- 完全在瀏覽器中運行（無需伺服器）
- Uses MediaPipe's pre-trained pose estimation model
- 使用 MediaPipe 嘅預訓練姿勢估計模型
- Processes video frames at ~30 FPS for smooth detection
- 以 ~30 FPS 處理影片幀以獲得流暢檢測
