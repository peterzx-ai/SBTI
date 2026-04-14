import { questions } from './data.js';
import { getRandomQuestions, getPersonality } from './logic.js';

let currentQuestions = [];
let currentIndex = 0;
let userAnswers = [];

const pages = {
    home: document.getElementById('home-page'),
    quiz: document.getElementById('quiz-page'),
    result: document.getElementById('result-page')
};

const dom = {
    startBtn: document.getElementById('start-btn'),
    themeToggle: document.getElementById('theme-toggle'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    progressBar: document.getElementById('progress-bar'),
    questionIndexDisplay: document.getElementById('question-index'),
    resultName: document.getElementById('result-name'),
    resultImage: document.getElementById('result-image'),
    resultDesc: document.getElementById('result-desc'),
    restartBtn: document.getElementById('restart-btn'),
    shareBtn: document.getElementById('share-btn')
};

// 主题切换逻辑
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const sunIcon = dom.themeToggle.querySelector('.sun');
    const moonIcon = dom.themeToggle.querySelector('.moon');
    if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}

dom.themeToggle.onclick = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
};

initTheme();

function switchPage(pageId) {

    Object.values(pages).forEach(p => p.classList.remove('active'));
    pages[pageId].classList.add('active');
}

function startQuiz() {
    currentQuestions = getRandomQuestions(questions);
    currentIndex = 0;
    userAnswers = [];
    renderQuestion();
    switchPage('quiz');
}

function renderQuestion() {
    const q = currentQuestions[currentIndex];
    dom.questionText.innerText = q.text;
    dom.optionsContainer.innerHTML = '';
    
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.text;
        btn.onclick = () => selectOption(opt);
        dom.optionsContainer.appendChild(btn);
    });

    // 更新进度
    const progress = ((currentIndex + 1) / currentQuestions.length) * 100;
    dom.progressBar.style.width = `${progress}%`;
    dom.questionIndexDisplay.innerText = `${currentIndex + 1} / ${currentQuestions.length}`;
}

function selectOption(opt) {
    userAnswers.push(opt);
    if (currentIndex < currentQuestions.length - 1) {
        currentIndex++;
        renderQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    const result = getPersonality(userAnswers);
    dom.resultName.innerText = result.name;
    dom.resultImage.src = result.image;
    dom.resultDesc.innerText = result.desc;
    switchPage('result');
}

dom.startBtn.onclick = startQuiz;
dom.restartBtn.onclick = startQuiz;
dom.shareBtn.onclick = () => {
    alert('长按图片可保存并分享给朋友！');
};

// 预加载图片防止白屏
Object.values(questions).forEach(q => {
    // 题目无图片，此处略
});
