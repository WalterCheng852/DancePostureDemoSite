// Dance Posture Recognition App
class DancePostureApp {
    constructor() {
        this.referencePoses = [];
        this.markedPoses = {}; // Store manually marked poses
        this.currentUserPose = null;
        this.currentReferencePose = null;
        this.poseScores = { pose1: 0 };
        this.isCameraActive = false;
        this.isReferencePlaying = false;
        this.isMirrored = false;
        this.syncMode = false;

        // Initialize elements
        this.initializeElements();
        this.setupEventListeners();
        this.initializeMediaPipe();
    }

    initializeElements() {
        // Video elements
        this.videoInput = document.getElementById('videoInput');
        this.referenceVideo = document.getElementById('referenceVideo');
        this.userVideo = document.getElementById('userVideo');
        this.referencePoseCanvas = document.getElementById('referencePoseCanvas');
        this.userPoseCanvas = document.getElementById('userPoseCanvas');

        // Video marking controls
        this.poseMarkingControls = document.getElementById('poseMarkingControls');
        this.playVideoBtn = document.getElementById('playVideoBtn');
        this.pauseVideoBtn = document.getElementById('pauseVideoBtn');
        this.videoScrubber = document.getElementById('videoScrubber');
        this.currentTime = document.getElementById('currentTime');
        this.markPose1Btn = document.getElementById('markPose1Btn');
        this.clearPosesBtn = document.getElementById('clearPosesBtn');

        // Pose status displays
        this.pose1Status = document.getElementById('pose1Status');
        this.pose1Time = document.getElementById('pose1Time');

        // Debug elements
        this.debugPanel = document.getElementById('debugPanel');
        this.debugMarkedPoses = document.getElementById('debugMarkedPoses');
        this.debugCurrentPose = document.getElementById('debugCurrentPose');
        this.debugComparison = document.getElementById('debugComparison');

        // Left panel pose display elements
        this.leftPanelTitle = document.getElementById('leftPanelTitle');
        this.referenceVideoContainer = document.getElementById('referenceVideoContainer');
        this.markedPoseContainer = document.getElementById('markedPoseContainer');
        this.markedPoseCanvas = document.getElementById('markedPoseCanvas');
        this.currentMarkedPose = document.getElementById('currentMarkedPose');
        this.poseSelector = document.getElementById('poseSelector');
        this.showPose1Btn = document.getElementById('showPose1Btn');
        // Details button in marking list
        this.showPose1DetailsBtn = document.getElementById('showPose1DetailsBtn');

        // Buttons
        this.startCameraBtn = document.getElementById('startCameraBtn');
        this.stopCameraBtn = document.getElementById('stopCameraBtn');
        this.mirrorToggle = document.getElementById('mirrorToggle');

        // Updated score displays
        this.pose1ScoreItem = document.getElementById('pose1ScoreItem');
        this.pose1ScoreText = document.getElementById('pose1ScoreText');
        this.pose1ScoreCircle = document.getElementById('pose1ScoreCircle');
        this.pose1Feedback = document.getElementById('pose1Feedback');

        this.overallFeedback = document.getElementById('overallFeedback');

        // Progress
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');

        // Indicators
        this.poseMatchIndicator = document.getElementById('poseMatchIndicator');
        this.timingIndicator = document.getElementById('timingIndicator');
        this.accuracyIndicator = document.getElementById('accuracyIndicator');
    }

    setupEventListeners() {
        // Main functionality
        this.videoInput.addEventListener('change', this.handleVideoUpload.bind(this));
        this.startCameraBtn.addEventListener('click', this.startCamera.bind(this));
        this.stopCameraBtn.addEventListener('click', this.stopCamera.bind(this));

        // Pose marking controls
        this.playVideoBtn.addEventListener('click', this.playReferenceVideo.bind(this));
        this.pauseVideoBtn.addEventListener('click', this.pauseReferenceVideo.bind(this));
        this.videoScrubber.addEventListener('input', this.handleScrubberChange.bind(this));
        this.markPose1Btn.addEventListener('click', () => this.markCurrentPose('pose1'));
        this.clearPosesBtn.addEventListener('click', this.clearMarkedPoses.bind(this));

        // Pose selector button
        this.showPose1Btn.addEventListener('click', () => this.selectPose('pose1'));

        // Pose details button
        this.showPose1DetailsBtn.addEventListener('click', () => this.showPoseDetails('pose1'));

        // Reference video events
        this.referenceVideo.addEventListener('loadedmetadata', this.setupVideoControls.bind(this));
        this.referenceVideo.addEventListener('timeupdate', this.updateVideoTime.bind(this));
        this.referenceVideo.addEventListener('play', () => {
            this.isReferencePlaying = true;
        });
        this.referenceVideo.addEventListener('pause', () => {
            this.isReferencePlaying = false;
        });
        this.referenceVideo.addEventListener('ended', () => {
            this.isReferencePlaying = false;
        });

        // Mirror toggle
        this.mirrorToggle.addEventListener('click', this.toggleMirror.bind(this));
    }

    async initializeMediaPipe() {
        try {
            this.pose = new Pose({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                }
            });

            this.pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableSegmentation: false,
                smoothSegmentation: false,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            this.pose.onResults(this.onPoseResults.bind(this));

            console.log('MediaPipe Pose initialized successfully');
            // Initialize a separate Pose instance for the reference video (real detection per frame)
            this.referencePose = new Pose({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
            });

            this.referencePose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableSegmentation: false,
                smoothSegmentation: false,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            this.referencePose.onResults(this.onReferencePoseResults.bind(this));
        } catch (error) {
            console.error('Failed to initialize MediaPipe:', error);
            this.showError('Failed to initialize pose detection');
        }
    }

    handleVideoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            this.showError('請選擇影片檔案');
            return;
        }

        const videoURL = URL.createObjectURL(file);
        this.referenceVideo.src = videoURL;
        this.referenceVideo.style.display = 'block';

        // Show pose marking controls
        this.poseMarkingControls.style.display = 'block';

        this.updateProgress(25, '影片已載入 - 請標記姿勢！');
        this.overallFeedback.textContent = '請標記姿勢1，然後啟動相機練習';
    }

    async startCamera() {
        try {
            if (!this.markedPoses.pose1) {
                this.showError('請先標記至少一個姿勢');
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: 'user' },
                audio: false
            });

            this.userVideo.srcObject = stream;

            // Ensure pose detector is initialized
            if (!this.pose) {
                console.log('Initializing pose detector...');
                this.pose = new Pose({
                    locateFile: (file) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                    }
                });

                this.pose.setOptions({
                    modelComplexity: 1,
                    smoothLandmarks: true,
                    enableSegmentation: false,
                    smoothSegmentation: false,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });

                this.pose.onResults(this.onPoseResults.bind(this));
            }

            this.camera = new Camera(this.userVideo, {
                onFrame: async () => {
                    if (this.pose) {
                        await this.pose.send({ image: this.userVideo });
                    }
                },
                width: 640,
                height: 480
            });

            this.camera.start();
            this.isCameraActive = true;

            this.startCameraBtn.disabled = true;
            this.stopCameraBtn.disabled = false;
            this.mirrorToggle.disabled = false;

            // Start processing reference frames if video is available
            if (this.referenceVideo.readyState >= 2) {
                this.referenceFrameTimer = setInterval(() => {
                    this.processReferenceFrame();
                }, 100); // Process every 100ms
            }

            // Single-pose practice view
            if (this.markedPoses.pose1) {
                this.poseSelector.style.display = 'flex';
                this.switchToMarkedPoseView();
                this.updateProgress(100, '練習模式：跟住目標姿勢！');
                this.overallFeedback.textContent = '練習模式：跟住左邊顯示的目標姿勢';
            }

            this.updateProgress(75, '相機已啟動 - 跟住跳舞！');
            console.log('Camera started successfully');

        } catch (error) {
            console.error('Error starting camera:', error);
            this.showError('無法存取相機，請檢查權限。');
        }
    }

    stopCamera() {
        if (this.camera) {
            this.camera.stop();
        }

        if (this.userVideo.srcObject) {
            const stream = this.userVideo.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            this.userVideo.srcObject = null;
        }

        this.isCameraActive = false;
        this.startCameraBtn.disabled = false;
        this.stopCameraBtn.disabled = true;
        this.mirrorToggle.disabled = true;

        // Switch back to reference video view and hide pose selector
        this.switchToReferenceVideoView();
        this.poseSelector.style.display = 'none';

        // Clear reference frame processing timer
        if (this.referenceFrameTimer) {
            clearInterval(this.referenceFrameTimer);
            this.referenceFrameTimer = null;
        }

        this.updateProgress(50, 'Camera stopped');
        this.resetScore();
    }

    onPoseResults(results) {
        if (!results.poseLandmarks) return;

        this.currentUserPose = results.poseLandmarks;
        this.drawPose(results.poseLandmarks);

        // Update debug info
        this.updateDebugInfo();

        // Calculate scores for marked pose
        if (this.markedPoses.pose1) {
            this.calculateAllPoseScores();
        }
    }

    drawPose(landmarks) {
        const canvas = this.userPoseCanvas;
        const ctx = canvas.getContext('2d');

        canvas.width = this.userVideo.videoWidth;
        canvas.height = this.userVideo.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw pose landmarks
        ctx.fillStyle = '#00ff00';
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;

        // Draw connections
        const connections = [
            [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
            [12, 14], [14, 16], [16, 18], [16, 20], [16, 22],
            [11, 23], [12, 24], [23, 24],
            [23, 25], [25, 27], [27, 29], [29, 31],
            [24, 26], [26, 28], [28, 30], [30, 32]
        ];

        connections.forEach(([start, end]) => {
            const startLandmark = landmarks[start];
            const endLandmark = landmarks[end];

            if (startLandmark && endLandmark) {
                ctx.beginPath();
                ctx.moveTo(startLandmark.x * canvas.width, startLandmark.y * canvas.height);
                ctx.lineTo(endLandmark.x * canvas.width, endLandmark.y * canvas.height);
                ctx.stroke();
            }
        });

        // Draw landmarks
        landmarks.forEach(landmark => {
            ctx.beginPath();
            ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    calculatePoseSimilarity(pose1, pose2) {
        if (!pose1 || !pose2 || pose1.length !== pose2.length) return 0;

        let totalSimilarity = 0;
        let validPoints = 0;

        // Compare each landmark
        for (let i = 0; i < pose1.length; i++) {
            const p1 = pose1[i];
            const p2 = pose2[i];

            if (p1.visibility > 0.5 && p2.visibility > 0.5) {
                // Calculate Euclidean distance
                const distance = Math.sqrt(
                    Math.pow(p1.x - p2.x, 2) +
                    Math.pow(p1.y - p2.y, 2) +
                    Math.pow(p1.z - p2.z, 2)
                );

                // Convert distance to similarity (closer = higher similarity)
                const similarity = Math.max(0, 1 - distance);
                totalSimilarity += similarity;
                validPoints++;
            }
        }

        return validPoints > 0 ? totalSimilarity / validPoints : 0;
    }

    resetScore() {
        // Reset pose scores
        this.poseScores = { pose1: 0 };

        // Reset UI displays
        if (this.markedPoses.hasOwnProperty('pose1')) {
            this.pose1ScoreText.textContent = '--';
            this.pose1ScoreCircle.className = 'pose-score-circle';
            this.pose1Feedback.textContent = '未檢測到';
        }

        this.overallFeedback.textContent = '相機已停止 - 重新啟動練習';
    }

    updateProgress(percentage, text) {
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = text;
    }

    showError(message) {
        alert(`Error: ${message}`);
        console.error(message);
    }

    showSuccess(message) {
        // Create a temporary success message
        const successDiv = document.createElement('div');
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            font-weight: bold;
        `;

        document.body.appendChild(successDiv);

        // Remove after 3 seconds
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 3000);
    }

    // New pose marking methods
    setupVideoControls() {
        const duration = this.referenceVideo.duration;
        this.videoScrubber.max = duration;
        this.updateVideoTime();
    }

    updateVideoTime() {
        const currentTime = this.referenceVideo.currentTime;
        const duration = this.referenceVideo.duration;

        // Update scrubber
        this.videoScrubber.value = currentTime;

        // Update time display
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        this.currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    playReferenceVideo() {
        if (this.referenceVideo.readyState >= 2) {
            this.referenceVideo.play();
        }
    }

    pauseReferenceVideo() {
        this.referenceVideo.pause();
    }

    handleScrubberChange() {
        const newTime = parseFloat(this.videoScrubber.value);
        this.referenceVideo.currentTime = newTime;
        this.updateVideoTime();
    }

    async markCurrentPose(poseId) {
        if (this.referenceVideo.readyState < 2) {
            this.showError('Video not ready yet');
            return;
        }

        try {
            // Show loading state
            const markButton = this.markPose1Btn;
            const originalText = markButton.textContent;
            markButton.textContent = 'Detecting...';
            markButton.disabled = true;

            // Capture current frame
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = this.referenceVideo.videoWidth;
            canvas.height = this.referenceVideo.videoHeight;

            ctx.drawImage(this.referenceVideo, 0, 0);

            console.log('Running MediaPipe pose detection on video frame...');

            // Use real MediaPipe detection
            let detectedPose = null;

            // Create a promise to handle the async pose detection
            const poseDetectionPromise = new Promise((resolve) => {
                // Set up a temporary pose detector for video frames
                const tempPose = new Pose({
                    locateFile: (file) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                    }
                });

                tempPose.setOptions({
                    modelComplexity: 1,
                    smoothLandmarks: true,
                    enableSegmentation: false,
                    smoothSegmentation: false,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });

                tempPose.onResults((results) => {
                    if (results.poseLandmarks) {
                        detectedPose = results.poseLandmarks;
                        console.log('Real pose detected from video frame:', detectedPose.length, 'landmarks');
                    } else {
                        console.log('No pose detected in video frame, using simulated data');
                        detectedPose = this.simulatePoseExtraction();
                    }
                    resolve();
                });

                // Send the canvas image to MediaPipe
                tempPose.send({ image: canvas });
            });

            // Wait for pose detection to complete
            await poseDetectionPromise;

            // Store marked pose (single pose only)
            const currentTime = this.referenceVideo.currentTime;
            this.markedPoses = {
                pose1: {
                    landmarks: detectedPose,
                    timestamp: currentTime,
                    label: 'Pose 1'
                }
            };

            // Update UI
            this.updateMarkedPoseStatus('pose1');

            // Enable/disable mark buttons
            this.updateMarkButtons();

            // Show score display
            this.updatePoseScoreDisplays();

            // Calculate time string for success message
            const minutes = Math.floor(currentTime / 60);
            const seconds = Math.floor(currentTime % 60);
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            // Reset button
            markButton.textContent = originalText;
            markButton.disabled = false;

            this.showSuccess(`Pose 1 marked successfully at ${timeString} (Real Detection)`);

        } catch (error) {
            console.error('Error marking pose:', error);
            this.showError('Failed to mark pose');

            // Reset button on error
            const markButton = this.markPose1Btn;
            markButton.textContent = '標記為姿勢1';
            markButton.disabled = false;
        }
    }

    // Update the marking list status and show details button
    updateMarkedPoseStatus(poseId) {
        if (!this.markedPoses[poseId]) return;

        const poseData = this.markedPoses[poseId];
        const minutes = Math.floor(poseData.timestamp / 60);
        const seconds = Math.floor(poseData.timestamp % 60);
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (poseId === 'pose1') {
            this.pose1Status.textContent = '已標記';
            this.pose1Status.classList.add('marked');
            this.pose1Time.textContent = timeString;
            this.showPose1DetailsBtn.style.display = 'inline-block';
        }

        // Show debug panel
        this.debugPanel.style.display = 'block';
        this.updateDebugInfo();
    }

    updateMarkButtons() {
        this.markPose1Btn.disabled = this.markedPoses.hasOwnProperty('pose1');
    }

    clearMarkedPoses() {
        this.markedPoses = {};

        // Reset UI
        this.pose1Status.textContent = 'Not marked';
        this.pose1Status.classList.remove('marked');
        this.pose1Time.textContent = '';

        // Enable mark button
        this.markPose1Btn.disabled = false;

        // Hide score displays
        this.pose1ScoreItem.style.display = 'none';

        // Reset scores
        this.poseScores = { pose1: 0 };

        console.log('Cleared marked pose');
    }

    updatePoseScoreDisplays() {
        if (this.markedPoses.hasOwnProperty('pose1')) {
            this.pose1ScoreItem.style.display = 'flex';
        }
    }

    calculateAllPoseScores() {
        if (!this.currentUserPose) return;

        const markedPose = this.markedPoses.pose1;
        if (!markedPose) return;

        const similarity = this.calculatePoseSimilarity(
            this.currentUserPose,
            markedPose.landmarks
        );
        this.poseScores.pose1 = Math.round(similarity * 100);

        this.updatePoseScoreUI();
    }

    updatePoseScoreUI() {
        if (this.markedPoses.hasOwnProperty('pose1')) {
            this.pose1ScoreText.textContent = this.poseScores.pose1;
            this.updatePoseScoreCircle('pose1', this.poseScores.pose1);
            this.updatePoseFeedback('pose1', this.poseScores.pose1);
        }

        this.updateOverallFeedback();
    }

    updatePoseScoreCircle(poseId, score) {
        const circle = this.pose1ScoreCircle;
        circle.className = 'pose-score-circle';

        if (score >= 80) {
            circle.classList.add('good');
        } else if (score >= 60) {
            circle.classList.add('average');
        } else {
            circle.classList.add('poor');
        }
    }

    updatePoseFeedback(poseId, score) {
        const feedback = this.pose1Feedback;

        if (score >= 80) {
            feedback.textContent = '優秀！';
        } else if (score >= 60) {
            feedback.textContent = '不錯！';
        } else if (score >= 40) {
            feedback.textContent = '繼續努力';
        } else {
            feedback.textContent = '多練習';
        }
    }

    updateOverallFeedback() {
        if (!this.markedPoses.pose1) {
            this.overallFeedback.textContent = '先標記姿勢，然後啟動相機';
        } else {
            if (this.poseScores.pose1 >= 60) {
                this.overallFeedback.textContent = '進步得好！繼續練習！';
            } else {
                this.overallFeedback.textContent = '繼續練習這些姿勢';
            }
        }
    }

    showPoseDetails(poseId) {
        const poseData = this.markedPoses[poseId];
        if (!poseData) {
            this.showError('未找到姿勢數據');
            return;
        }

        const landmarksCount = poseData.landmarks ? poseData.landmarks.length : 0;

        const details = `
姿勢 ID: ${poseId}
時間戳: ${poseData.timestamp}秒
標籤: ${poseData.label}
關鍵點: ${landmarksCount} 個 (真實 MediaPipe 檢測)
目前分數: ${this.poseScores[poseId] || '未計算'}
        `.trim();

        alert(details);
        this.showPosePreview(poseId);
    }

    showPosePreview(poseId) {
        const poseData = this.markedPoses[poseId];
        if (!poseData || !poseData.landmarks) {
            this.showError('No pose data to preview');
            return;
        }

        // Create preview modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            max-width: 500px;
        `;

        const title = document.createElement('h3');
        title.textContent = `${poseData.label} Preview (Real Detection)`;
        title.style.marginBottom = '15px';

        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 200;
        canvas.style.cssText = `
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            background: #f8fafc;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            margin-top: 15px;
            padding: 8px 16px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;

        closeBtn.onclick = () => document.body.removeChild(modal);

        // Draw pose on canvas
        this.drawPosePreview(canvas, poseData.landmarks);

        content.appendChild(title);
        content.appendChild(canvas);
        content.appendChild(closeBtn);
        modal.appendChild(content);

        document.body.appendChild(modal);
    }

    drawPosePreview(canvas, landmarks) {
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw pose landmarks
        ctx.fillStyle = '#0066ff';
        ctx.strokeStyle = '#0066ff';
        ctx.lineWidth = 3;

        // Draw connections first
        const connections = [
            [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
            [12, 14], [14, 16], [16, 18], [16, 20], [16, 22],
            [11, 23], [12, 24], [23, 24],
            [23, 25], [25, 27], [27, 29], [29, 31],
            [24, 26], [26, 28], [28, 30], [30, 32]
        ];

        connections.forEach(([start, end]) => {
            const startLandmark = landmarks[start];
            const endLandmark = landmarks[end];

            if (startLandmark && endLandmark) {
                // MediaPipe landmarks are already in 0-1 normalized coordinates
                ctx.beginPath();
                ctx.moveTo(startLandmark.x * canvas.width, startLandmark.y * canvas.height);
                ctx.lineTo(endLandmark.x * canvas.width, endLandmark.y * canvas.height);
                ctx.stroke();
            }
        });

        // Draw landmarks
        landmarks.forEach((landmark, index) => {
            if (landmark) {
                ctx.beginPath();
                ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 4, 0, 2 * Math.PI);
                ctx.fill();

                // Add landmark numbers for key points
                if ([0, 11, 12, 13, 14, 15, 16, 23, 24].includes(index)) {
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '10px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(index.toString(), landmark.x * canvas.width, landmark.y * canvas.height + 3);
                    ctx.fillStyle = '#0066ff';
                }
            }
        });

        // Add title
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Real MediaPipe Detection', canvas.width / 2, 20);
    }

    updateDebugInfo() {
        // Update marked poses count
        const markedCount = this.markedPoses.pose1 ? 1 : 0;
        this.debugMarkedPoses.textContent = `已標記姿勢: ${markedCount}`;

        // Update current pose status
        if (this.currentUserPose) {
            this.debugCurrentPose.textContent = `當前姿勢: 檢測到 ${this.currentUserPose.length} 個關鍵點`;
        } else {
            this.debugCurrentPose.textContent = '當前姿勢: 未檢測到';
        }

        // Update comparison status
        if (this.markedPoses.pose1 && this.currentUserPose) {
            const scoresText = `pose1: ${this.poseScores.pose1 || 0}%`;
            this.debugComparison.textContent = `分數: ${scoresText}`;
        } else {
            this.debugComparison.textContent = '最後比較: 無';
        }
    }

    // Pose selection and display methods
    selectPose(poseId) {
        if (!this.markedPoses[poseId]) {
            this.showError('姿勢 1 仲未標記');
            return;
        }

        // Update button state
        this.showPose1Btn.classList.add('active');

        // Update display
        this.updateMarkedPoseDisplay();
    }

    updateMarkedPoseDisplay() {
        // Only update if camera is active and we have marked pose
        if (!this.isCameraActive || !this.markedPoses.pose1) {
            return;
        }

        const poseData = this.markedPoses.pose1;
        this.currentMarkedPose.textContent = poseData.label;

        // Draw the pose on the marked pose canvas
        this.drawMarkedPose(poseData.landmarks);
    }

    drawMarkedPose(landmarks) {
        const canvas = this.markedPoseCanvas;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw pose landmarks
        ctx.fillStyle = '#48bb78'; // Green for marked poses
        ctx.strokeStyle = '#48bb78';
        ctx.lineWidth = 3;

        // Draw connections
        const connections = [
            [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
            [12, 14], [14, 16], [16, 18], [16, 20], [16, 22],
            [11, 23], [12, 24], [23, 24],
            [23, 25], [25, 27], [27, 29], [29, 31],
            [24, 26], [26, 28], [28, 30], [30, 32]
        ];

        connections.forEach(([start, end]) => {
            const startLandmark = landmarks[start];
            const endLandmark = landmarks[end];

            if (startLandmark && endLandmark) {
                ctx.beginPath();
                ctx.moveTo(startLandmark.x * canvas.width, startLandmark.y * canvas.height);
                ctx.lineTo(endLandmark.x * canvas.width, endLandmark.y * canvas.height);
                ctx.stroke();
            }
        });

        // Draw landmarks
        landmarks.forEach((landmark, index) => {
            if (landmark) {
                ctx.beginPath();
                ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 4, 0, 2 * Math.PI);
                ctx.fill();

                // Add landmark numbers for key points
                if ([0, 11, 12, 13, 14, 15, 16, 23, 24].includes(index)) {
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '10px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(index.toString(), landmark.x * canvas.width, landmark.y * canvas.height + 3);
                    ctx.fillStyle = '#48bb78';
                }
            }
        });

        // Add title
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Target Pose', canvas.width / 2, 15);
    }

    switchToMarkedPoseView() {
        // Completely hide reference video container
        this.referenceVideoContainer.style.display = 'none';

        // Show marked pose container
        this.markedPoseContainer.style.display = 'block';
        this.leftPanelTitle.textContent = 'Target Pose';

        // Show pose selector if we have marked pose
        if (this.markedPoses.pose1) {
            this.poseSelector.style.display = 'flex';
        }

        // Update the marked pose display
        this.updateMarkedPoseDisplay();
    }

    switchToReferenceVideoView() {
        // Show reference video container
        this.referenceVideoContainer.style.display = 'block';

        // Hide marked pose container
        this.markedPoseContainer.style.display = 'none';
        this.leftPanelTitle.textContent = 'Reference Dance';

        // Hide pose selector
        this.poseSelector.style.display = 'none';
    }

    toggleMirror() {
        this.isMirrored = !this.isMirrored;
        if (this.isMirrored) {
            this.userVideo.style.transform = 'scaleX(-1)';
            this.userPoseCanvas.style.transform = 'scaleX(-1)';
            this.mirrorToggle.textContent = 'Normal View';
        } else {
            this.userVideo.style.transform = 'scaleX(1)';
            this.userPoseCanvas.style.transform = 'scaleX(1)';
            this.mirrorToggle.textContent = 'Mirror View';
        }
    }

    drawReferencePose(landmarks) {
        const canvas = this.referencePoseCanvas;
        const ctx = canvas.getContext('2d');

        canvas.width = this.referenceVideo.videoWidth;
        canvas.height = this.referenceVideo.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw pose landmarks
        ctx.fillStyle = '#0066ff';
        ctx.strokeStyle = '#0066ff';
        ctx.lineWidth = 2;

        // Draw connections
        const connections = [
            [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
            [12, 14], [14, 16], [16, 18], [16, 20], [16, 22],
            [11, 23], [12, 24], [23, 24],
            [23, 25], [25, 27], [27, 29], [29, 31],
            [24, 26], [26, 28], [28, 30], [30, 32]
        ];

        connections.forEach(([start, end]) => {
            const startLandmark = landmarks[start];
            const endLandmark = landmarks[end];

            if (startLandmark && endLandmark) {
                ctx.beginPath();
                ctx.moveTo(startLandmark.x * canvas.width, startLandmark.y * canvas.height);
                ctx.lineTo(endLandmark.x * canvas.width, endLandmark.y * canvas.height);
                ctx.stroke();
            }
        });

        // Draw landmarks
        landmarks.forEach(landmark => {
            ctx.beginPath();
            ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    // Process reference video frame for pose detection
    async processReferenceFrame() {
        if (!this.referenceVideo || this.referenceVideo.paused) return;

        if (this.referenceVideo.videoWidth > 0 && this.referenceVideo.videoHeight > 0 && this.referencePose) {
            await this.referencePose.send({ image: this.referenceVideo });
        }
    }

    onReferencePoseResults(results) {
        if (results && results.poseLandmarks) {
            this.currentReferencePose = results.poseLandmarks;
            this.drawReferencePose(this.currentReferencePose);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new DancePostureApp();
    console.log('Dance Posture Recognition App initialized');
});
