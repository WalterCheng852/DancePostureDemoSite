// Photo Mode Dance Posture Recognition App
class PhotoModeApp {
    constructor() {
        // Photo storage
        this.uploadedPhotos = [];
        this.detectedPoses = [];
        this.selectedPoses = [];

        // Practice state
        this.currentPracticeIndex = 0;
        this.isCameraActive = false;

        // Manual progression mode

        // Current user pose for scoring
        this.currentUserPose = null;

        // MediaPipe options
        this.poseOptions = {
            modelComplexity: 2,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: false,
            minDetectionConfidence: 0.3,
            minTrackingConfidence: 0.3
        };

        this.initializeElements();
        this.setupEventListeners();
        this.initializeMediaPipe();

        // Debug: Check if elements are found
        console.log('Photo input element:', this.photoInput);
        console.log('Progress elements:', this.progressFill, this.progressText);
    }

    initializeElements() {
        // Photo upload elements
        this.photoInput = document.getElementById('photoInput');
        this.photoPreviewGrid = document.getElementById('photoPreviewGrid');
        this.photoGrid = document.getElementById('photoGrid');

        // Pose selection elements
        this.poseSelectionSection = document.getElementById('poseSelectionSection');
        this.detectedPosesGrid = document.getElementById('detectedPosesGrid');
        this.selectAllPoses = document.getElementById('selectAllPoses');
        this.deselectAllPoses = document.getElementById('deselectAllPoses');
        this.startPracticeBtn = document.getElementById('startPracticeBtn');

        // Practice elements
        this.practiceSection = document.getElementById('practiceSection');
        this.currentPoseLabel = document.getElementById('currentPoseLabel');
        this.currentPoseIndex = document.getElementById('currentPoseIndex');
        this.totalPoses = document.getElementById('totalPoses');
        this.targetPoseCanvas = document.getElementById('targetPoseCanvas');
        this.poseNameDisplay = document.getElementById('poseNameDisplay');

        // Camera controls
        this.startCameraBtn = document.getElementById('startCameraBtn');
        this.stopCameraBtn = document.getElementById('stopCameraBtn');
        this.userVideo = document.getElementById('userVideo');
        this.userPoseCanvas = document.getElementById('userPoseCanvas');
        this.mirrorToggle = document.getElementById('mirrorToggle');

        // Practice controls
        this.unifiedControls = document.getElementById('unifiedControls');
        this.prevPoseBtn = document.getElementById('prevPoseBtn');
        this.nextPoseBtn = document.getElementById('nextPoseBtn');
        this.finishPracticeBtn = document.getElementById('finishPracticeBtn');

        // Score elements (inline with pose info)
        this.practiceScoreCircle = document.getElementById('practiceScoreCircle');
        this.practiceScoreText = document.getElementById('practiceScoreText');
        this.practiceFeedback = document.getElementById('practiceFeedback');
        this.practiceOverallFeedback = document.getElementById('practiceOverallFeedback');

        // Score elements (full section - for compatibility)
        this.currentScoreText = document.getElementById('currentScoreTextFull');
        this.currentFeedback = document.getElementById('currentFeedbackFull');
        this.currentScoreCircle = document.getElementById('currentScoreCircleFull');
        this.overallFeedback = document.getElementById('overallFeedback');
        this.overallScores = document.getElementById('overallScores');
        this.scoresGrid = document.getElementById('scoresGrid');

        // Progress
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');

        // Photo processing progress
        this.processingProgress = document.getElementById('processingProgress');
        this.photoProgressFill = document.getElementById('photoProgressFill');
        this.photoProgressText = document.getElementById('photoProgressText');
        this.photoCount = document.getElementById('photoCount');

        // Practice controls
        this.restartPracticeBtn = document.getElementById('restartPracticeBtn');

        // Modal elements
        this.photoModal = document.getElementById('photoModal');
        this.modalBackdrop = document.getElementById('modalBackdrop');
        this.modalImage = document.getElementById('modalImage');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalInfo = document.getElementById('modalInfo');
        this.modalClose = document.getElementById('modalClose');

        // Transition animation elements
        this.poseTransition = document.getElementById('poseTransition');
        this.countdownNumber = document.getElementById('countdownNumber');
        this.transitionText = document.querySelector('.transition-text');

        // Indicators

        // Navigation
        this.backToVideoMode = document.getElementById('backToVideoMode');
    }

    setupEventListeners() {
        // Photo upload
        if (this.photoInput) {
            this.photoInput.addEventListener('change', this.handlePhotoUpload.bind(this));
            console.log('Photo input event listener attached');
        } else {
            console.error('Photo input element not found!');
        }

        // Pose selection
        this.selectAllPoses.addEventListener('click', this.selectAll.bind(this));
        this.deselectAllPoses.addEventListener('click', this.deselectAll.bind(this));
        this.startPracticeBtn.addEventListener('click', this.startPractice.bind(this));

        // Camera controls
        this.startCameraBtn.addEventListener('click', this.startCamera.bind(this));
        this.stopCameraBtn.addEventListener('click', this.stopCamera.bind(this));

        // Practice controls
        this.prevPoseBtn.addEventListener('click', this.previousPose.bind(this));
        this.nextPoseBtn.addEventListener('click', this.nextPose.bind(this));
        this.restartPracticeBtn.addEventListener('click', this.restartPractice.bind(this));
        this.finishPracticeBtn.addEventListener('click', this.finishPractice.bind(this));

        // Modal events
        if (this.modalClose) {
            this.modalClose.addEventListener('click', this.closeModal.bind(this));
        }
        if (this.modalBackdrop) {
            this.modalBackdrop.addEventListener('click', this.closeModal.bind(this));
        }

        // Navigation
        this.backToVideoMode.addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // Mirror toggle
        this.mirrorToggle.addEventListener('click', this.toggleMirror.bind(this));

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.photoModal.style.display === 'block') {
                this.closeModal();
            }
        });
    }

    async initializeMediaPipe() {
        try {
            this.pose = new Pose({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                }
            });

            this.pose.setOptions(this.poseOptions);
            this.pose.onResults(this.onPoseResults.bind(this));

            console.log('Photo Mode: MediaPipe Pose initialized successfully');
        } catch (error) {
            console.error('Failed to initialize MediaPipe:', error);
            this.showError('Failed to initialize pose detection');
        }
    }

    handlePhotoUpload(event) {
        const files = Array.from(event.target.files);
        console.log(`Photo upload triggered with ${files.length} files`);

        if (files.length !== 5) {
            this.showError('請上載正好 5 張照片');
            return;
        }

        console.log('Processing 5 photos...');
        this.uploadedPhotos = files;

        // Show processing progress
        this.showProcessingProgress();
        this.updateProgress(10, '準備處理照片...');
        this.processPhotos();
    }

    async processPhotos() {
        console.log('processPhotos called');
        this.detectedPoses = [];

        for (let i = 0; i < this.uploadedPhotos.length; i++) {
            const photoFile = this.uploadedPhotos[i];
            console.log(`Processing photo ${i + 1}/${this.uploadedPhotos.length}`);
            this.updatePhotoProgress(i + 1, 5, `處理照片 ${i + 1}/5...`);
            await this.processSinglePhoto(photoFile, i + 1);
        }

        console.log('All photos processed, showing previews');
        this.hideProcessingProgress();
        this.showPhotoPreviews();
        this.showPoseSelection();
        this.updateProgress(50, '照片處理完成！請選擇要練習的姿勢');
    }

    async processSinglePhoto(photoFile, index) {
        return new Promise((resolve) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Create a temporary pose detector for this photo
                const tempPose = new Pose({
                    locateFile: (file) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                    }
                });

                tempPose.setOptions(this.poseOptions);

                tempPose.onResults((results) => {
                    if (results.poseLandmarks) {
                        console.log(`Photo ${index}: Pose detected with ${results.poseLandmarks.length} landmarks`);

                        this.detectedPoses.push({
                            id: `pose${index}`,
                            label: `姿勢 ${index}`,
                            landmarks: results.poseLandmarks,
                            imageData: canvas.toDataURL(),
                            originalImage: img
                        });
                    } else {
                        console.log(`Photo ${index}: No pose detected`);
                        this.detectedPoses.push({
                            id: `pose${index}`,
                            label: `姿勢 ${index}`,
                            landmarks: null,
                            imageData: canvas.toDataURL(),
                            originalImage: img
                        });
                    }
                    resolve();
                });

                // Send image to MediaPipe
                tempPose.send({ image: canvas });
            };

            img.src = URL.createObjectURL(photoFile);
        });
    }

    showPhotoPreviews() {
        this.photoGrid.innerHTML = '';

        for (let i = 0; i < 5; i++) {
            const slot = document.createElement('div');
            slot.className = 'photo-slot';

            const number = document.createElement('div');
            number.className = 'photo-slot-number';
            number.textContent = i + 1;

            if (this.detectedPoses[i]) {
                const img = document.createElement('img');
                img.src = this.detectedPoses[i].imageData;
                slot.appendChild(img);

                const status = document.createElement('div');
                status.className = 'pose-detection-status';
                status.textContent = this.detectedPoses[i].landmarks ? '✓ 已檢測' : '✗ 檢測失敗';
                slot.appendChild(status);

                // Add click event for modal
                slot.addEventListener('click', () => {
                    const pose = this.detectedPoses[i];
                    const title = `照片 ${i + 1} - ${pose.label}`;
                    const info = pose.landmarks ? '姿勢已成功檢測' : '姿勢檢測失敗，請嘗試其他照片';
                    this.showModal(title, pose.imageData, info);
                });
            } else {
                slot.className = 'photo-slot empty';
                slot.textContent = `等待照片 ${i + 1}`;
            }

            slot.appendChild(number);
            this.photoGrid.appendChild(slot);
        }

        this.photoPreviewGrid.style.display = 'block';
    }

    showPoseSelection() {
        this.detectedPosesGrid.innerHTML = '';

        this.detectedPoses.forEach((pose, index) => {
            const poseItem = document.createElement('div');
            poseItem.className = 'detected-pose-item';
            poseItem.dataset.poseId = pose.id;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'pose-checkbox';
            checkbox.id = `pose-${pose.id}`;

            const label = document.createElement('label');
            label.htmlFor = `pose-${pose.id}`;

            const canvas = document.createElement('canvas');
            canvas.className = 'pose-preview-small';
            canvas.width = 200;
            canvas.height = 120;

            if (pose.landmarks) {
                this.drawPosePreview(canvas, pose.landmarks);
            } else {
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ff6b6b';
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('檢測失敗', canvas.width / 2, canvas.height / 2);
            }

            const labelText = document.createElement('div');
            labelText.className = 'pose-label-text';
            labelText.textContent = pose.label;

            label.appendChild(canvas);
            label.appendChild(labelText);
            poseItem.appendChild(checkbox);
            poseItem.appendChild(label);

            this.detectedPosesGrid.appendChild(poseItem);
        });

        this.poseSelectionSection.style.display = 'block';

        // Add event listeners for checkboxes
        const checkboxes = this.detectedPosesGrid.querySelectorAll('.pose-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', this.updateSelection.bind(this));
        });
    }

    updateSelection() {
        const checkboxes = this.detectedPosesGrid.querySelectorAll('.pose-checkbox');
        this.selectedPoses = [];

        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                this.selectedPoses.push(this.detectedPoses[index]);
            }

            // Update visual feedback
            const poseItem = checkbox.closest('.detected-pose-item');
            if (checkbox.checked) {
                poseItem.classList.add('selected');
            } else {
                poseItem.classList.remove('selected');
            }
        });

        this.startPracticeBtn.disabled = this.selectedPoses.length === 0;
        this.updateProgress(this.selectedPoses.length * 15 + 50, `已選擇 ${this.selectedPoses.length} 個姿勢`);
    }

    selectAll() {
        const checkboxes = this.detectedPosesGrid.querySelectorAll('.pose-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        this.updateSelection();
    }

    deselectAll() {
        const checkboxes = this.detectedPosesGrid.querySelectorAll('.pose-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        this.updateSelection();
    }

    startPractice() {
        if (this.selectedPoses.length === 0) {
            this.showError('請至少選擇一個姿勢來練習');
            return;
        }

        this.currentPracticeIndex = 0;
        this.poseSelectionSection.style.display = 'none';
        this.practiceSection.style.display = 'block';

        // Initialize score display
        this.updateScoreDisplay('--');

        this.startPracticePose();
        this.updateProgress(75, '開始練習模式！');
    }

    startPracticePose() {
        const currentPose = this.selectedPoses[this.currentPracticeIndex];

        if (!currentPose) {
            this.finishPractice();
            return;
        }

        // Update UI
        this.currentPoseLabel.textContent = currentPose.label;
        this.currentPoseIndex.textContent = this.currentPracticeIndex + 1;
        this.totalPoses.textContent = this.selectedPoses.length;
        this.poseNameDisplay.textContent = currentPose.label;

        // Draw target pose
        if (currentPose.landmarks) {
            this.drawPosePreview(this.targetPoseCanvas, currentPose.landmarks);
        }

        // Setup manual progression mode
        // No timer - user controls progression with buttons

        // Show unified controls
        if (this.unifiedControls) {
            this.unifiedControls.style.display = 'block';
        }
        this.prevPoseBtn.disabled = this.currentPracticeIndex === 0;
        this.nextPoseBtn.disabled = this.currentPracticeIndex === this.selectedPoses.length - 1;

        // Start camera if not already active
        if (!this.isCameraActive) {
            this.startCamera();
        }

        this.updateOverallFeedback(null, this.practiceOverallFeedback);
    }

    nextPose() {
        if (this.currentPracticeIndex < this.selectedPoses.length - 1) {
            this.currentPracticeIndex++;
            this.startPracticePose();
        } else {
            this.finishPractice();
        }
    }

    // Advance to next pose with transition animation
    nextPoseWithTransition() {
        if (this.currentPracticeIndex < this.selectedPoses.length - 1) {
            this.currentPracticeIndex++;
            this.startPracticePose();
        } else {
            this.finishPractice();
        }
    }

    previousPose() {
        if (this.currentPracticeIndex > 0) {
            this.currentPracticeIndex--;
            this.startPracticePose();
        }
    }

    finishPractice() {
        this.stopCamera();

        // Keep practice section visible, just show completion state
        this.showPracticeSummary();
        this.updateProgress(100, '練習完成！查看你的成績');

        // Update UI to show completion state
        if (this.currentPoseLabel) {
            this.currentPoseLabel.textContent = '練習完成！';
        }
        if (this.poseNameDisplay) {
            this.poseNameDisplay.textContent = '所有姿勢練習完成';
        }


        // Show restart button and hide finish button
        if (this.restartPracticeBtn) {
            this.restartPracticeBtn.style.display = 'inline-block';
            this.restartPracticeBtn.textContent = '🔄 重新練習';
        }
        if (this.finishPracticeBtn) {
            this.finishPracticeBtn.style.display = 'none';
        }

        // Hide unified controls
        if (this.unifiedControls) {
            this.unifiedControls.style.display = 'none';
        }

        // Update overall feedback
        this.updateOverallFeedback(null, this.practiceOverallFeedback);
    }

    showPracticeSummary() {
        this.overallScores.style.display = 'block';

        // This would show final scores for each pose
        // For now, just show completion message
        this.scoresGrid.innerHTML = `
            <div class="pose-final-score">
                <h4>練習完成！</h4>
                <p>你已經完成了 ${this.selectedPoses.length} 個姿勢的練習！</p>
                <p>恭喜你的進步！🎉</p>
            </div>
        `;

        this.overallFeedback.textContent = '練習完成！繼續努力！';
    }

    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: 'user' },
                audio: false
            });

            this.userVideo.srcObject = stream;

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

            console.log('Photo Mode: Camera started successfully');

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

    }

    onPoseResults(results) {
        if (!results.poseLandmarks) return;

        this.currentUserPose = results.poseLandmarks;
        this.drawPose(results.poseLandmarks);


        // Calculate score with current target pose
        const currentPose = this.selectedPoses[this.currentPracticeIndex];
        if (currentPose && currentPose.landmarks) {
            const similarity = this.calculatePoseSimilarity(
                this.currentUserPose,
                currentPose.landmarks
            );
            const score = Math.round(similarity * 100);

            this.updateScoreDisplay(score);

        }
    }





    // Show pose transition animation with countdown
    showPoseTransition() {
        if (this.poseTransition && this.countdownNumber) {
            this.poseTransition.style.display = 'flex';

            // Start countdown from 2
            let count = 2;
            this.countdownNumber.textContent = count;

            const countdownInterval = setInterval(() => {
                count--;
                this.countdownNumber.textContent = count;

                if (count <= 0) {
                    clearInterval(countdownInterval);
                    this.poseTransition.style.display = 'none';
                }
            }, 1000);
        }
    }

    drawPose(landmarks) {
        this.userPoseCanvas.width = this.userVideo.videoWidth;
        this.userPoseCanvas.height = this.userVideo.videoHeight;
        this.drawPoseEnhanced(this.userPoseCanvas, landmarks, '#00ff00');

    }

    drawPosePreview(canvas, landmarks) {
        const ctx = canvas.getContext('2d');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw pose landmarks
        ctx.strokeStyle = '#0066ff';
        ctx.fillStyle = '#0066ff';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

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

            if (startLandmark && endLandmark &&
                startLandmark.visibility > 0.5 && endLandmark.visibility > 0.5) {
                ctx.beginPath();
                ctx.moveTo(startLandmark.x * canvasWidth, startLandmark.y * canvasHeight);
                ctx.lineTo(endLandmark.x * canvasWidth, endLandmark.y * canvasHeight);
                ctx.stroke();
            }
        });

        // Draw landmarks
        landmarks.forEach((landmark, index) => {
            if (landmark && landmark.visibility > 0.5) {
                ctx.beginPath();
                ctx.arc(
                    landmark.x * canvasWidth,
                    landmark.y * canvasHeight,
                    4, 0, 2 * Math.PI
                );
                ctx.fill();
            }
        });
    }

    drawPoseEnhanced(canvas, landmarks, color = '#00ff00', showNumbers = false, title = '') {
        const ctx = canvas.getContext('2d');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Calculate pose bounding box for adaptive scaling
        const validLandmarks = landmarks.filter(l => l && l.visibility > 0.5);
        if (validLandmarks.length === 0) return;

        const xs = validLandmarks.map(l => l.x);
        const ys = validLandmarks.map(l => l.y);

        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const poseWidth = maxX - minX;
        const poseHeight = maxY - minY;

        // Scale to fit canvas with padding
        const scale = Math.min(
            (canvasWidth - 40) / poseWidth,
            (canvasHeight - 40) / poseHeight
        );

        const offsetX = (canvasWidth - poseWidth * scale) / 2 - minX * scale;
        const offsetY = (canvasHeight - poseHeight * scale) / 2 - minY * scale;

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

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

            if (startLandmark && endLandmark &&
                startLandmark.visibility > 0.5 && endLandmark.visibility > 0.5) {
                ctx.beginPath();
                ctx.moveTo(
                    startLandmark.x * scale + offsetX,
                    startLandmark.y * scale + offsetY
                );
                ctx.lineTo(
                    endLandmark.x * scale + offsetX,
                    endLandmark.y * scale + offsetY
                );
                ctx.stroke();
            }
        });

        // Draw landmarks
        landmarks.forEach((landmark, index) => {
            if (landmark && landmark.visibility > 0.5) {
                ctx.beginPath();
                ctx.arc(
                    landmark.x * scale + offsetX,
                    landmark.y * scale + offsetY,
                    4, 0, 2 * Math.PI
                );
                ctx.fill();
            }
        });

        // Add title if provided
        if (title) {
            ctx.fillStyle = '#333';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(title, canvasWidth / 2, 20);
        }
    }

    calculatePoseSimilarity(pose1, pose2) {
        if (!pose1 || !pose2 || pose1.length !== pose2.length) return 0;

        let totalSimilarity = 0;
        let validPoints = 0;

        for (let i = 0; i < pose1.length; i++) {
            const p1 = pose1[i];
            const p2 = pose2[i];

            if (p1.visibility > 0.5 && p2.visibility > 0.5) {
                const distance = Math.sqrt(
                    Math.pow(p1.x - p2.x, 2) +
                    Math.pow(p1.y - p2.y, 2) +
                    Math.pow(p1.z - p2.z, 2)
                );

                const similarity = Math.max(0, 1 - distance);
                totalSimilarity += similarity;
                validPoints++;
            }
        }

        return validPoints > 0 ? totalSimilarity / validPoints : 0;
    }

    updateScoreDisplay(score) {
        // Update practice area scores (primary display)
        if (this.practiceScoreText) this.practiceScoreText.textContent = score;
        if (this.practiceScoreCircle) this.updateScoreCircle(this.practiceScoreCircle, score);
        if (this.practiceFeedback) this.updateFeedback(score, this.practiceFeedback);
        if (this.practiceOverallFeedback) this.updateOverallFeedback(score, this.practiceOverallFeedback);

        // Update full section scores (shown after practice)
        if (this.currentScoreText) this.currentScoreText.textContent = score;
        if (this.currentScoreCircle) this.updateScoreCircle(this.currentScoreCircle, score);
        if (this.currentFeedback) this.updateFeedback(score, this.currentFeedback);
        if (this.overallFeedback) this.updateOverallFeedback(score, this.overallFeedback);
    }

    updateScoreCircle(circle, score) {
        circle.className = 'pose-score-circle';

        if (score >= 80) {
            circle.classList.add('good');
        } else if (score >= 60) {
            circle.classList.add('average');
        } else {
            circle.classList.add('poor');
        }
    }

    updateFeedback(score, element = null) {
        const targetElement = element || this.currentFeedback;
        if (targetElement) {
            if (score >= 80) {
                targetElement.textContent = '優秀！';
            } else if (score >= 60) {
                targetElement.textContent = '不錯！';
            } else if (score >= 40) {
                targetElement.textContent = '繼續努力';
            } else {
                targetElement.textContent = '多練習';
            }
        }
    }

    updateOverallFeedback(score = null, element = null) {
        const targetElement = element || this.overallFeedback;
        if (targetElement) {
            if (score === null) {
                // Default behavior for video mode
                if (!this.markedPoses.pose1) {
                    targetElement.textContent = '先標記姿勢，然後啟動相機';
                } else {
                    if (this.poseScores.pose1 >= 60) {
                        targetElement.textContent = '進步得好！繼續練習！';
                    } else {
                        targetElement.textContent = '繼續練習這些姿勢';
                    }
                }
            } else {
                // Photo mode behavior based on current score
                if (score >= 80) {
                    targetElement.textContent = '做得好！準備好就點擊下一個姿勢！';
                } else if (score >= 60) {
                    targetElement.textContent = '不錯！準備好就點擊下一個姿勢！';
                } else if (score >= 40) {
                    targetElement.textContent = '繼續努力！';
                } else {
                    targetElement.textContent = '跟住目標姿勢做！';
                }
            }
        }
    }

    updateProgress(percentage, text) {
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = text;
    }

    showError(message) {
        alert(`Error: ${message}`);
        console.error(message);
    }

    toggleMirror() {
        const isMirrored = this.userVideo.style.transform === 'scaleX(-1)';
        if (isMirrored) {
            this.userVideo.style.transform = 'scaleX(1)';
            this.userPoseCanvas.style.transform = 'scaleX(1)';
            this.mirrorToggle.textContent = '鏡像視圖';
        } else {
            this.userVideo.style.transform = 'scaleX(-1)';
            this.userPoseCanvas.style.transform = 'scaleX(-1)';
            this.mirrorToggle.textContent = '正常視圖';
        }
    }

    // Processing progress methods
    showProcessingProgress() {
        if (this.processingProgress) {
            this.processingProgress.style.display = 'block';
        }
    }

    hideProcessingProgress() {
        if (this.processingProgress) {
            this.processingProgress.style.display = 'none';
        }
    }

    updatePhotoProgress(current, total, status) {
        if (this.photoProgressFill && this.photoProgressText) {
            const percentage = (current / total) * 100;
            this.photoProgressFill.style.width = `${percentage}%`;
            this.photoProgressText.textContent = status;
        }
        if (this.photoCount) {
            this.photoCount.textContent = `(${current}/${total})`;
        }
    }

    // Modal methods
    showModal(title, imageSrc, info) {
        if (this.photoModal && this.modalImage) {
            this.modalTitle.textContent = title;
            this.modalImage.src = imageSrc;
            this.modalInfo.textContent = info || '點擊照片可以查看細節。練習時可以手動切換姿勢。';
            this.photoModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }

    closeModal() {
        if (this.photoModal) {
            this.photoModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }

    // Restart practice
    restartPractice() {
        this.currentPracticeIndex = 0;
        this.practiceSection.style.display = 'none';
        this.poseSelectionSection.style.display = 'block';
        this.overallScores.style.display = 'none';

        // Reset button visibility
        if (this.restartPracticeBtn) {
            this.restartPracticeBtn.style.display = 'none';
        }
        if (this.finishPracticeBtn) {
            this.finishPracticeBtn.style.display = 'inline-block';
        }

        // Reset camera if active
        if (this.isCameraActive) {
            this.stopCamera();
        }

        this.updateProgress(50, '準備重新練習...');
        this.overallFeedback.textContent = '選擇姿勢開始重新練習';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PhotoModeApp();
    console.log('Photo Mode Dance Posture Recognition App initialized');
});
