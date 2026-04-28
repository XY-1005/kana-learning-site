const kanaData = [
  [
    { hiragana: "あ", katakana: "ア", romaji: "a" },
    { hiragana: "い", katakana: "イ", romaji: "i" },
    { hiragana: "う", katakana: "ウ", romaji: "u" },
    { hiragana: "え", katakana: "エ", romaji: "e" },
    { hiragana: "お", katakana: "オ", romaji: "o" }
  ],
  [
    { hiragana: "か", katakana: "カ", romaji: "ka" },
    { hiragana: "き", katakana: "キ", romaji: "ki" },
    { hiragana: "く", katakana: "ク", romaji: "ku" },
    { hiragana: "け", katakana: "ケ", romaji: "ke" },
    { hiragana: "こ", katakana: "コ", romaji: "ko" }
  ],
  [
    { hiragana: "さ", katakana: "サ", romaji: "sa" },
    { hiragana: "し", katakana: "シ", romaji: "shi" },
    { hiragana: "す", katakana: "ス", romaji: "su" },
    { hiragana: "せ", katakana: "セ", romaji: "se" },
    { hiragana: "そ", katakana: "ソ", romaji: "so" }
  ],
  [
    { hiragana: "た", katakana: "タ", romaji: "ta" },
    { hiragana: "ち", katakana: "チ", romaji: "chi" },
    { hiragana: "つ", katakana: "ツ", romaji: "tsu" },
    { hiragana: "て", katakana: "テ", romaji: "te" },
    { hiragana: "と", katakana: "ト", romaji: "to" }
  ],
  [
    { hiragana: "な", katakana: "ナ", romaji: "na" },
    { hiragana: "に", katakana: "ニ", romaji: "ni" },
    { hiragana: "ぬ", katakana: "ヌ", romaji: "nu" },
    { hiragana: "ね", katakana: "ネ", romaji: "ne" },
    { hiragana: "の", katakana: "ノ", romaji: "no" }
  ],
  [
    { hiragana: "は", katakana: "ハ", romaji: "ha" },
    { hiragana: "ひ", katakana: "ヒ", romaji: "hi" },
    { hiragana: "ふ", katakana: "フ", romaji: "fu" },
    { hiragana: "へ", katakana: "ヘ", romaji: "he" },
    { hiragana: "ほ", katakana: "ホ", romaji: "ho" }
  ],
  [
    { hiragana: "ま", katakana: "マ", romaji: "ma" },
    { hiragana: "み", katakana: "ミ", romaji: "mi" },
    { hiragana: "む", katakana: "ム", romaji: "mu" },
    { hiragana: "め", katakana: "メ", romaji: "me" },
    { hiragana: "も", katakana: "モ", romaji: "mo" }
  ],
  [
    { hiragana: "や", katakana: "ヤ", romaji: "ya" },
    null,
    { hiragana: "ゆ", katakana: "ユ", romaji: "yu" },
    null,
    { hiragana: "よ", katakana: "ヨ", romaji: "yo" }
  ],
  [
    { hiragana: "ら", katakana: "ラ", romaji: "ra" },
    { hiragana: "り", katakana: "リ", romaji: "ri" },
    { hiragana: "る", katakana: "ル", romaji: "ru" },
    { hiragana: "れ", katakana: "レ", romaji: "re" },
    { hiragana: "ろ", katakana: "ロ", romaji: "ro" }
  ],
  [
    { hiragana: "わ", katakana: "ワ", romaji: "wa" },
    null,
    null,
    null,
    { hiragana: "を", katakana: "ヲ", romaji: "wo" }
  ],
  [
    null,
    null,
    { hiragana: "ん", katakana: "ン", romaji: "n" },
    null,
    null
  ]
];

const allKana = kanaData.flat().filter(Boolean);

const tableBody = document.querySelector("#kanaTableBody");
const navButtons = document.querySelectorAll(".nav-btn");
const heroButtons = document.querySelectorAll(".hero-actions button");
const pages = document.querySelectorAll(".page-section");

const modeButtons = document.querySelectorAll(".mode-btn");
const modeTitle = document.querySelector("#modeTitle");
const questionCount = document.querySelector("#questionCount");
const questionType = document.querySelector("#questionType");
const questionText = document.querySelector("#questionText");
const options = document.querySelector("#options");
const feedback = document.querySelector("#feedback");
const progressFill = document.querySelector("#progressFill");
const roundResult = document.querySelector("#roundResult");
const restartBtn = document.querySelector("#restartBtn");

let currentMode = "hiragana";
let currentQuestion = null;
let currentAnswer = "";
let currentQuestionIndex = 0;
let score = 0;
let isLocked = false;
let currentQuestionKind = "kanaToRomaji";

function renderKanaTable() {
  tableBody.innerHTML = "";

  kanaData.forEach((row) => {
    const tr = document.createElement("tr");

    row.forEach((item) => {
      const td = document.createElement("td");

      if (!item) {
        td.classList.add("empty-cell");
        td.innerHTML = "—";
      } else {
        td.innerHTML = `
          <div class="kana-pair">
            <span class="hira">${item.hiragana}</span>
            <span class="kata">${item.katakana}</span>
          </div>
          <div class="romaji">${item.romaji}</div>
        `;
      }

      tr.appendChild(td);
    });

    tableBody.appendChild(tr);
  });
}

function switchPage(pageName) {
  pages.forEach((page) => {
    page.classList.toggle("active", page.id === pageName);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.page === pageName);
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getRandomKana() {
  const index = Math.floor(Math.random() * allKana.length);
  return allKana[index];
}

function createOptions(correctValue, type) {
  const optionSet = new Set();
  optionSet.add(correctValue);

  while (optionSet.size < 3) {
    const randomKana = getRandomKana();

    if (type === "romaji") {
      optionSet.add(randomKana.romaji);
    } else {
      optionSet.add(randomKana[currentMode]);
    }
  }

  return shuffleArray([...optionSet]);
}

function startRound() {
  currentQuestionIndex = 0;
  score = 0;
  isLocked = false;
  feedback.textContent = "";
  feedback.className = "feedback";
  roundResult.textContent = "";
  restartBtn.classList.add("hidden");
  updateProgress();
  nextQuestion();
}

function nextQuestion() {
  if (currentQuestionIndex >= 10) {
    finishRound();
    return;
  }

  isLocked = false;
  feedback.textContent = "";
  feedback.className = "feedback";
  options.innerHTML = "";

  currentQuestion = getRandomKana();
  currentQuestionKind = Math.random() > 0.5 ? "kanaToRomaji" : "romajiToKana";

  if (currentQuestionKind === "kanaToRomaji") {
    questionType.textContent = "请选择正确读音";
    questionText.textContent = currentQuestion[currentMode];
    currentAnswer = currentQuestion.romaji;

    const optionList = createOptions(currentAnswer, "romaji");
    renderOptions(optionList);
  } else {
    questionType.textContent = "请选择正确假名";
    questionText.textContent = currentQuestion.romaji;
    currentAnswer = currentQuestion[currentMode];

    const optionList = createOptions(currentAnswer, "kana");
    renderOptions(optionList);
  }

  questionCount.textContent = currentQuestionIndex;
  updateProgress();
}

function renderOptions(optionList) {
  optionList.forEach((item) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.textContent = item;

    button.addEventListener("click", () => {
      checkAnswer(button, item);
    });

    options.appendChild(button);
  });
}

function checkAnswer(button, selectedAnswer) {
  if (isLocked) return;

  isLocked = true;
  const optionButtons = document.querySelectorAll(".option-btn");

  if (selectedAnswer === currentAnswer) {
    score++;
    feedback.textContent = "恭喜！";
    feedback.classList.add("good");
    button.classList.add("correct");
  } else {
    feedback.textContent = "再接再厉！";
    feedback.classList.add("bad");
    button.classList.add("wrong");

    optionButtons.forEach((optionButton) => {
      if (optionButton.textContent === currentAnswer) {
        optionButton.classList.add("correct");
      }
    });
  }

  currentQuestionIndex++;
  questionCount.textContent = currentQuestionIndex;
  updateProgress();

  setTimeout(() => {
    nextQuestion();
  }, 850);
}

function finishRound() {
  options.innerHTML = "";
  questionType.textContent = "本轮完成";
  questionText.textContent = `${score} / 10`;
  feedback.textContent = "";
  feedback.className = "feedback";
  roundResult.textContent = `本轮答对 ${score} 题，继续保持！`;
  restartBtn.classList.remove("hidden");
  questionCount.textContent = "10";
  progressFill.style.width = "100%";
}

function updateProgress() {
  const percent = (currentQuestionIndex / 10) * 100;
  progressFill.style.width = `${percent}%`;
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switchPage(button.dataset.page);
  });
});

heroButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switchPage(button.dataset.page);
  });
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentMode = button.dataset.mode;

    modeButtons.forEach((btn) => {
      btn.classList.toggle("active", btn === button);
    });

    modeTitle.textContent =
      currentMode === "hiragana" ? "平假名测试" : "片假名测试";

    startRound();
  });
});

restartBtn.addEventListener("click", () => {
  startRound();
});

renderKanaTable();
startRound();
