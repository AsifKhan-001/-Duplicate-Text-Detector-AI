// Mobile Navigation Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Scroll fade-in animation
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => observer.observe(el));

// Prediction API
const predictBtn = document.getElementById('predictBtn');
const btnText = predictBtn.querySelector('.btn-text');
const btnLoader = predictBtn.querySelector('.btn-loader');
const resultArea = document.getElementById('result');
const resultBadge = document.getElementById('resultBadge');
const resultDuplicate = document.getElementById('resultDuplicate');
const resultScore = document.getElementById('resultScore');
const resultLabel = document.getElementById('resultLabel');
const resultMessage = document.getElementById('resultMessage');

// Sweet messages for duplicate
const duplicateMessages = [
    "These two questions are basically twins separated at birth!",
    "Great minds think alike — these questions share the same soul.",
    "Looks like someone asked the same thing in different words!",
    "Two questions, one meaning — they're definitely duplicates.",
    "These questions are mirror images of each other in meaning."
];

// Sweet messages for not duplicate
const notDuplicateMessages = [
    "These questions are on completely different wavelengths!",
    "Nope, these two are as different as chalk and cheese.",
    "Unique vibes only — these questions have their own identity.",
    "Different questions, different intent — not duplicates at all.",
    "Each question has its own story to tell. They're unique!"
];

function getRandomMessage(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

predictBtn.addEventListener('click', async () => {
    const q1 = document.getElementById('q1').value.trim();
    const q2 = document.getElementById('q2').value.trim();

    if (!q1 || !q2) {
        showError('Please enter both questions.');
        return;
    }

    // Show loading
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    predictBtn.disabled = true;
    resultArea.classList.add('hidden');

    try {
        const response = await fetch('http://100.54.255.9:8000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q1: q1,
                q2: q2
            })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        // Determine duplicate status
        const isDuplicate = data.prediction === 1 || data.prediction === 'duplicate' || data.is_duplicate === true;
        const score = data.probability || data.score || data.similarity_score || data.confidence || null;

        // Show result
        resultArea.classList.remove('hidden');

        // Badge
        resultBadge.textContent = isDuplicate ? 'Duplicate' : 'Not Duplicate';
        resultBadge.className = 'result-badge';
        resultBadge.classList.add(isDuplicate ? 'duplicate' : 'not-duplicate');

        // is_duplicate
        resultDuplicate.textContent = isDuplicate ? 'true' : 'false';
        resultDuplicate.className = 'result-value';
        resultDuplicate.classList.add(isDuplicate ? 'true-val' : 'false-val');

        // Confidence Score
        if (score !== null) {
            resultScore.textContent = (score * 100).toFixed(1) + '%';
        } else {
            resultScore.textContent = 'N/A';
        }

        // Label
        resultLabel.textContent = isDuplicate ? 'Duplicate' : 'Not Duplicate';

        // Sweet Message
        resultMessage.textContent = isDuplicate
            ? getRandomMessage(duplicateMessages)
            : getRandomMessage(notDuplicateMessages);

    } catch (error) {
        showError(`Could not reach the prediction server. ${error.message}`);
    } finally {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        predictBtn.disabled = false;
    }
});

function showError(text) {
    resultArea.classList.remove('hidden');
    resultBadge.textContent = 'Error';
    resultBadge.className = 'result-badge';
    resultDuplicate.textContent = '—';
    resultDuplicate.className = 'result-value';
    resultScore.textContent = '—';
    resultLabel.textContent = '—';
    resultMessage.textContent = text;
}

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '';
    }
});
