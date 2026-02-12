// Global Variables
let yourName = '';
let valentineName = '';
let loveMeterValue = 0;
const maxLoveMeter = 100;
let clickableHeartsCount = 5;
let isReceiverMode = false;

const pickupLines = [
    "Are you a magician? You made everyone else disappear!",
    "Do you have a map? I got lost in your eyes.",
    "Are you a parking ticket? Because you have FINE written all over you.",
    "Do you believe in love at first sight, or should I walk by again?",
    "If you were a vegetable, you would be a cute-cumber."
];

// Pickup line display
let pickupDisplay = null;

function initPickupLineDisplay() {
    if (pickupDisplay) return;
    pickupDisplay = document.createElement('div');
    pickupDisplay.id = 'pickupLineDisplay';
    pickupDisplay.style.position = 'fixed';
    pickupDisplay.style.bottom = '20px';
    pickupDisplay.style.left = '50%';
    pickupDisplay.style.transform = 'translateX(-50%)';
    pickupDisplay.style.backgroundColor = 'rgba(255, 105, 180, 0.9)';
    pickupDisplay.style.color = 'white';
    pickupDisplay.style.padding = '15px 30px';
    pickupDisplay.style.borderRadius = '25px';
    pickupDisplay.style.fontSize = '16px';
    pickupDisplay.style.fontWeight = 'bold';
    pickupDisplay.style.textAlign = 'center';
    pickupDisplay.style.maxWidth = '500px';
    pickupDisplay.style.opacity = '0';
    pickupDisplay.style.transition = 'opacity 0.5s ease-in-out';
    pickupDisplay.style.pointerEvents = 'none';
    pickupDisplay.style.zIndex = '1000';
    document.body.appendChild(pickupDisplay);
}

function showPickupLine(lineText) {
    if (!pickupDisplay) {
        initPickupLineDisplay();
    }
    pickupDisplay.textContent = lineText;
    pickupDisplay.style.opacity = '1';
    
    setTimeout(() => {
        pickupDisplay.style.opacity = '0';
    }, 3000);
}

// Function to read URL parameters
function getURLParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
}

// Function to check if visiting via shared link
function checkReceiverMode() {
    const senderName = getURLParameter('from');
    
    if (senderName) {
        yourName = decodeURIComponent(senderName);
        isReceiverMode = true;
        return true;
    }
    return false;
}

// Generate shareable URL
function generateShareURL(senderName) {
    const baseURL = window.location.origin + window.location.pathname;
    const shareURL = baseURL + '?from=' + encodeURIComponent(senderName);
    return shareURL;
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied! ✅';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        alert('Failed to copy. Please copy manually: ' + text);
    });
}

// Create pickup line display at bottom (removed - no longer needed)

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initBackgroundHearts();
    
    // Check if visiting via shared link
    if (checkReceiverMode()) {
        // Show receiver name input scene
        setTimeout(() => {
            changeScene('bookScene', 'receiverScene');
        }, 500);
    }
    
    initScenes();
});

// Background Floating Hearts
function initBackgroundHearts() {
    const container = document.querySelector('.bg-hearts-container');
    const heartSymbols = ['💖', '💕', '💗', '💓', '💝'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'bg-heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (5 + Math.random() * 5) + 's';
        heart.style.fontSize = (15 + Math.random() * 15) + 'px';
        container.appendChild(heart);
        
        setTimeout(() => heart.remove(), 8000);
    }, 500);
}

// Scene Management
function initScenes() {
    // Scene 1: Book Opening
    const magicBook = document.getElementById('magicBook');
    magicBook.addEventListener('click', openBook);
    
    // Scene 2: Sender Name Input
    document.getElementById('namesSubmit').addEventListener('click', submitSenderName);
    
    // Scene 2.5: Share Link
    document.getElementById('copyBtn').addEventListener('click', () => {
        const shareUrl = document.getElementById('shareUrl').value;
        copyToClipboard(shareUrl);
    });
    document.getElementById('startAgainBtn').addEventListener('click', restartApp);
    
    // Scene 3: Receiver Name Input
    document.getElementById('receiverSubmit').addEventListener('click', submitReceiverName);
    
    // Scene 3.5: Love Meter
    initLoveMeter();
    
    // Scene 4: Valentine Question
    document.getElementById('yesBtn').addEventListener('click', handleYes);
    const noBtn = document.getElementById('noBtn');
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleNoClick();
    });
    
    // Scene 5: Celebration
    document.getElementById('continueBtn').addEventListener('click', showCertificate);
    
    // Scene 6: Certificate
    document.getElementById('downloadBtn').addEventListener('click', downloadCertificate);
    document.getElementById('restartBtn').addEventListener('click', restartApp);
}

// Scene 1: Book Opening
function openBook() {
    const book = document.getElementById('magicBook');
    book.classList.add('opening');
    
    setTimeout(() => {
        changeScene('bookScene', 'nameScene');
    }, 1500);
}

// Scene 2: Submit Sender Name
function submitSenderName() {
    const yourNameInput = document.getElementById('yourName').value.trim();
    
    if (!yourNameInput) {
        alert('Please enter your name! 💕');
        return;
    }
    
    yourName = yourNameInput;
    
    // Generate shareable URL
    const shareURL = generateShareURL(yourName);
    document.getElementById('shareUrl').value = shareURL;
    
    changeScene('nameScene', 'shareScene');
}

// Scene 3: Submit Receiver Name
function submitReceiverName() {
    const receiverNameInput = document.getElementById('receiverName').value.trim();
    
    if (!receiverNameInput) {
        alert('Please enter your name! 💕');
        return;
    }
    
    valentineName = receiverNameInput;
    
    // Go to love meter scene
    changeScene('receiverScene', 'loveMeterScene');
    createClickableHearts();
}

// Scene 3.5: Love Meter
function initLoveMeter() {
    // Hearts will be created when scene is shown
}

function createClickableHearts() {
    const container = document.getElementById('clickableHearts');
    container.innerHTML = '';
    loveMeterValue = 0;
    
    for (let i = 0; i < clickableHeartsCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'clickable-heart';
            heart.textContent = '💖';
            heart.style.left = (10 + Math.random() * 80) + '%';
            heart.style.top = (10 + Math.random() * 80) + '%';
            heart.style.animationDelay = Math.random() * 2 + 's';
            heart.style.cursor = 'pointer';
            heart.dataset.lineIndex = i;
            
            heart.addEventListener('click', () => clickHeart(heart, i));
            heart.addEventListener('touchstart', (e) => {
                e.preventDefault();
                clickHeart(heart, i);
            });
            
            container.appendChild(heart);
        }, i * 200);
    }
}

function clickHeart(heart, lineIndex) {
    if (heart.classList.contains('clicked')) return;
    
    heart.classList.add('clicked');
    loveMeterValue += (100 / clickableHeartsCount);
    
    // Show pickup line at bottom
    showPickupLine(pickupLines[lineIndex]);
    
    // Update meter
    const meterFill = document.getElementById('meterFill');
    const meterPercent = document.getElementById('meterPercent');
    meterFill.style.width = Math.min(loveMeterValue, 100) + '%';
    meterPercent.textContent = Math.round(Math.min(loveMeterValue, 100));
    
    // Check if meter is full
    if (loveMeterValue >= maxLoveMeter) {
        setTimeout(() => {
            changeScene('loveMeterScene', 'questionScene');
        }, 1000);
    }
}

// Scene 4: Valentine Question
function handleYes() {
    changeScene('questionScene', 'celebrationScene');
    startCelebration();
}

function handleNoClick() {
    const message = document.getElementById('escapeMessage');
    message.classList.add('show');
}

// Scene 5: Celebration
function startCelebration() {
    createConfetti();
    createHeartsExplosion();
    createSparklesAnimation();
}

function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#ff5e78', '#d6336c', '#ffd700', '#ff69b4', '#fff'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            container.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

function createHeartsExplosion() {
    const container = document.getElementById('heartsExplosion');
    const heartSymbols = ['💖', '💕', '💗', '💓', '💝'];
    
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.className = 'explosion-heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = '50%';
        heart.style.top = '50%';
        
        const angle = (Math.PI * 2 * i) / 30;
        const distance = 200 + Math.random() * 200;
        heart.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        heart.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
        
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 2000);
    }
}

function createSparklesAnimation() {
    const container = document.getElementById('sparklesContainer');
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.setProperty('--tx', (Math.random() - 0.5) * 100 + 'px');
            sparkle.style.setProperty('--ty', (Math.random() - 0.5) * 100 + 'px');
            container.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 800);
        }, i * 50);
    }
}

// Scene 6: Certificate
function showCertificate() {
    changeScene('celebrationScene', 'certificateScene');
    generateCertificate();
}

// Restart the app
function restartApp() {
    // Reset variables
    yourName = '';
    valentineName = '';
    loveMeterValue = 0;
    isReceiverMode = false;
    
    // Clear input fields
    document.getElementById('yourName').value = '';
    document.getElementById('receiverName').value = '';
    
    // Determine current scene and go back to bookScene
    const scenes = document.querySelectorAll('.scene');
    scenes.forEach(scene => scene.classList.remove('active'));
    
    // Show book scene
    document.getElementById('bookScene').classList.add('active');
}

// Scene 3: Love Meter
// (Removed - no longer part of flow)

function generateCertificate() {
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#fff0f5');
    gradient.addColorStop(1, '#ffe4e1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Border
    ctx.strokeStyle = '#d6336c';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 760, 560);
    
    // Inner border with hearts pattern
    ctx.strokeStyle = '#ff5e78';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, 720, 520);
    
    // Title
    ctx.fillStyle = '#d6336c';
    ctx.font = 'bold 48px serif';
    ctx.textAlign = 'center';
    ctx.fillText('💖 Valentine\'s Certificate 💖', 400, 100);
    
    // Subtitle
    ctx.font = 'italic 24px serif';
    ctx.fillStyle = '#666';
    ctx.fillText('This certifies that', 400, 160);
    
    // Names
    ctx.font = 'bold 36px serif';
    ctx.fillStyle = '#ff5e78';
    ctx.fillText(yourName, 400, 220);
    
    ctx.font = 'italic 28px serif';
    ctx.fillStyle = '#666';
    ctx.fillText('and', 400, 260);
    
    ctx.font = 'bold 36px serif';
    ctx.fillStyle = '#ff5e78';
    ctx.fillText(valentineName, 400, 310);
    
    // Message
    ctx.font = 'italic 24px serif';
    ctx.fillStyle = '#666';
    ctx.fillText('are officially', 400, 370);
    
    ctx.font = 'bold 40px serif';
    ctx.fillStyle = '#d6336c';
    ctx.fillText('VALENTINES', 400, 420);
    
    // Forever message
    ctx.font = 'italic 28px serif';
    ctx.fillStyle = '#ff5e78';
    ctx.fillText('Forever & Always', 400, 480);
    
    // Date
    ctx.font = '20px serif';
    ctx.fillStyle = '#999';
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    ctx.fillText(currentDate, 400, 530);
    
    // Decorative hearts
    ctx.font = '40px serif';
    const heartPositions = [
        [100, 80], [700, 80], [100, 520], [700, 520],
        [150, 300], [650, 300], [400, 50]
    ];
    
    heartPositions.forEach(([x, y]) => {
        ctx.fillText('💖', x, y);
    });
    
    // Sparkles
    ctx.fillStyle = '#ffd700';
    for (let i = 0; i < 20; i++) {
        const x = 60 + Math.random() * 680;
        const y = 60 + Math.random() * 480;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function downloadCertificate() {
    const canvas = document.getElementById('certificateCanvas');
    const link = document.createElement('a');
    link.download = `valentine-certificate-${yourName}-${valentineName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Utility: Change Scenes
function changeScene(currentSceneId, nextSceneId) {
    const currentScene = document.getElementById(currentSceneId);
    const nextScene = document.getElementById(nextSceneId);
    if (!currentScene || !nextScene) return;

    // Show the next scene immediately so there is no invisible gap,
    // then fade out the current scene after the transition delay.
    nextScene.classList.add('active');

    setTimeout(() => {
        currentScene.classList.remove('active');
    }, 300);
}

// Music Toggle
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
let musicPlaying = false;

musicToggle.addEventListener('click', function() {
    const icon = this.querySelector('.music-icon');
    if (musicPlaying) {
        backgroundMusic.pause();
        icon.textContent = '🔇';
        musicPlaying = false;
    } else {
        backgroundMusic.play().catch(err => console.log('Auto-play prevented:', err));
        icon.textContent = '🔊';
        musicPlaying = true;
    }
});

// Auto-play music when page loads (may be blocked by browser)
window.addEventListener('load', () => {
    backgroundMusic.play().catch(err => console.log('Auto-play prevented:', err));
    musicToggle.querySelector('.music-icon').textContent = '🔊';
    musicPlaying = true;
});
