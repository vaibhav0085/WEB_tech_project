const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const browseBtn = document.getElementById('browse-btn');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');
const statusText = document.getElementById('scanning-status');
const resultsCard = document.getElementById('results-card');
const resetBtn = document.getElementById('reset-btn');

// UI Elements for Resuls
const statusBadge = document.getElementById('status-badge');
const threatScoreDisplay = document.getElementById('threat-score');
const needle = document.getElementById('needle');
const detailIcon = document.querySelector('.detail-item i');
const detailTitle = document.querySelector('.detail-item h4');
const detailText = document.querySelector('.detail-item p');

// Drag & Drop Events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropZone.classList.add('dragover');
}

function unhighlight() {
    dropZone.classList.remove('dragover');
}

dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// File Input Events
browseBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', function () {
    handleFiles(this.files);
});

function handleFiles(files) {
    if (files.length > 0) {
        uploadFile(files[0]);
    }
}

function uploadFile(file) {
    // Reset UI
    resultsCard.classList.add('hidden');
    progressContainer.classList.remove('hidden');
    progressFill.style.width = '0%';
    progressPercent.innerText = '0%';
    statusText.innerText = `Scanning ${file.name}...`;

    // Simulate Scanning Process
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 5 + 1;
        if (progress > 100) progress = 100;

        progressFill.style.width = `${progress}%`;
        progressPercent.innerText = `${Math.floor(progress)}%`;

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                showResults();
            }, 500);
        }
    }, 100);
}

function showResults() {
    progressContainer.classList.add('hidden');
    resultsCard.classList.remove('hidden');

    // Randomly determine result for demo purposes (30% chance of threat)
    const isThreat = Math.random() < 0.3;
    const threatScore = isThreat ? Math.floor(Math.random() * 40 + 60) : Math.floor(Math.random() * 10); // 60-100 for threat, 0-10 for safe

    updateResultUI(isThreat, threatScore);
}

function updateResultUI(isThreat, score) {
    // Animate Needle
    // -90deg is 0, 90deg is 100
    const degrees = (score / 100) * 180 - 90;
    setTimeout(() => {
        needle.style.transform = `rotate(${degrees}deg)`;
    }, 100);

    // Animate Score Counter
    let currentScore = 0;
    const scoreInterval = setInterval(() => {
        if (currentScore < score) {
            currentScore++;
            threatScoreDisplay.innerText = currentScore;
        } else {
            clearInterval(scoreInterval);
        }
    }, 20);

    if (isThreat) {
        resultsCard.classList.add('danger');
        statusBadge.innerText = 'Critical';
        statusBadge.style.color = 'var(--status-danger)';
        statusBadge.style.backgroundColor = 'rgba(255, 71, 87, 0.1)';
        statusBadge.style.borderColor = 'var(--status-danger)';

        detailIcon.className = 'fa-solid fa-triangle-exclamation';
        detailTitle.innerText = 'Malicious Signature Found';
        detailText.innerText = 'Heuristic analysis detected potential ransomware behavior.';
    } else {
        resultsCard.classList.remove('danger');
        statusBadge.innerText = 'Safe';
        statusBadge.style.color = 'var(--status-safe)';
        statusBadge.style.backgroundColor = 'rgba(0, 255, 157, 0.1)';
        statusBadge.style.borderColor = 'var(--status-safe)';

        detailIcon.className = 'fa-solid fa-file-shield';
        detailTitle.innerText = 'No Threats Detected';
        detailText.innerText = 'File is clean and safe to use.';
    }
}

resetBtn.addEventListener('click', () => {
    resultsCard.classList.add('hidden');
    needle.style.transform = 'rotate(-90deg)';
    threatScoreDisplay.innerText = '0';
});
