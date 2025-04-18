const questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "Berlin", "Madrid", "Rome"],
    answer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Mars", "Venus", "Jupiter", "Saturn"],
    answer: "Mars"
  },
  {
    question: "What does HTML stand for?",
    options: ["HyperText Markup Language", "Hotmail", "Hyper Transfer Machine Language", "Home Tool Markup Language"],
    answer: "HyperText Markup Language"
  }
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const resultBox = document.getElementById("result-box");
const scoreText = document.getElementById("score-text");
const restartBtn = document.getElementById("restart-btn");

function loadQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "block w-full bg-gray-200 hover:bg-blue-200 px-4 py-2 rounded";
    btn.onclick = () => checkAnswer(opt, q.answer);
    optionsEl.appendChild(btn);
  });

  nextBtn.classList.add("hidden");
}

function checkAnswer(selected, correct) {
  const allButtons = optionsEl.querySelectorAll("button");
  allButtons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) {
      btn.classList.add("bg-green-300");
    } else if (btn.textContent === selected) {
      btn.classList.add("bg-red-300");
    }
  });

  if (selected === correct) score++;
  nextBtn.classList.remove("hidden");
}

nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
};

restartBtn.onclick = () => {
  currentQuestion = 0;
  score = 0;
  resultBox.classList.add("hidden");
  document.getElementById("quiz-box").classList.remove("hidden");
  loadQuestion();
};

function showResult() {
  document.getElementById("quiz-box").classList.add("hidden");
  resultBox.classList.remove("hidden");
  scoreText.textContent = `You scored ${score} out of ${questions.length}`;

  // Send score to bot
  if (window.Telegram.WebApp) {
    Telegram.WebApp.sendData(JSON.stringify({
      type: "quiz_result",
      score: score
    }));
    Telegram.WebApp.close(); // Optional: auto close after sending
  }
}

// Init
window.addEventListener("DOMContentLoaded", () => {
  loadQuestion();
  Telegram.WebApp.ready(); // initialize Telegram Mini App API
});
