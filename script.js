const wordContainer = document.querySelector(".words");
const input = document.querySelector(".word-input");
const wordBtn = document.querySelector(".word-btn");
const result = document.querySelector(".result");
let count = 60;
let started;
let Timer;
let wordCount = 0;
generateWords(true);
function generateWords(addActive = false, length = 100) {
  for (let i = 0; i < length; i++) {
    wordContainer.insertAdjacentHTML(
      "beforeend",
      `<li class="word ${addActive && i === 0 ? "active" : ""}">${createrandom(
        5
      )}</li>`
    );
  }
}
const TimerEnd = new Event("TimerEnd");
wordBtn.addEventListener("click", () => {
  if (!started) {
    result.classList.add("hidden");
    wordContainer.innerHTML = "";
    generateWords();
    changeActiveWord(wordContainer.children[0]);
    wordContainer.classList.remove("hidden");
    input.classList.remove("hidden");
    input.parentElement.nextElementSibling.classList.add("start");
    input.focus();
    wordBtn.textContent = "1:00";
    started = true;
    Timer = setInterval(countTimer, 1000);
  }
});
function countTimer() {
  if (started) {
    count--;
    wordBtn.textContent = `${count}`;
  } else {
    clearInterval(Timer);
    document.dispatchEvent(TimerEnd);
  }
  if (count == 0) {
    started = false;
    count = 60;
    wordBtn.textContent = "Start Typing";
  }
}
function getActiveWord() {
  return [...wordContainer.children].find((e) =>
    e.classList.contains("active")
  );
}
function changeActiveWord(elem) {
  if (!elem) return;
  try {
    [...wordContainer.children]
      .find((e) => e.classList.contains("active"))
      .classList.remove("active");
  } catch (error) {}
  let actindex = [...wordContainer.children].indexOf(elem);

  if (wordContainer.children.length - (actindex - 1) <= 10) {
    generateWords(false, 50);
  }
  elem.classList.add("active");
  elem.scrollIntoView();
}
document.addEventListener("TimerEnd", () => {
  let errors = document.querySelectorAll(".err").length;
  input.classList.add("hidden");
  input.parentElement.nextElementSibling.classList.remove("start");
  result.innerHTML = "";
  result.insertAdjacentHTML(
    "beforeend",
    `
    <h2>Results</h2>
      <div class="head" role="row">
        <li role="columnheader">
          <strong>Speed</strong> <abbr title="Word Per Minute">(WPM)</abbr>
        </li>
        <li role="columnheader" title="Errors"><strong>Errors</strong></li>
        <li role="columnheader" title="Total"><strong>Total</strong> <abbr title="Word Per Minute">(WPM)</abbr></li>
      </div>
      <div class="row" role="row">
        <li role="cell">${wordCount}</li>
        <li role="cell">${errors}</li>
        <li role="cell">${wordCount - errors}</li>
      </div>

  `
  );
  result.classList.remove("hidden");
  input.value = "";
  wordCount = 0;
});
input.addEventListener("keyup", (e) => {
  let activeWord = getActiveWord();
  if (started) {
    if (e.key == " ") {
      if (input.value.length - 1 !== getActiveWord().textContent.length) {
        getActiveWord().classList.add("err");
      }
      input.value = "";
      getActiveWord().textContent.startsWith(input.value)
        ? getActiveWord().classList.add("correct")
        : getActiveWord().classList.add("err") &&
          getActiveWord().classList.remove("correct");
      wordCount++;
      changeActiveWord(activeWord.nextElementSibling);
    }
    if (getActiveWord().textContent.startsWith(input.value)) {
      getActiveWord().classList.remove("err");
    } else {
      getActiveWord().classList.add("err");
    }
  }
});
input.addEventListener("keydown", (e) => {
  if (e.key == "") {
    input.value.replace(" ", "");
  }
});
function createrandom(length) {
  var consonants = "bcdfghjklmnpqrstvwxyz",
    vowels = "aeiou",
    rand = function (limit) {
      return Math.floor(Math.random() * limit);
    },
    i,
    word = "",
    length = parseInt(length, 10),
    consonants = consonants.split(""),
    vowels = vowels.split("");
  for (i = 0; i < length / 2; i++) {
    var randConsonants = consonants[rand(consonants.length)],
      randVowels = vowels[rand(vowels.length)];
    word += randConsonants;
    word += i * 2 < length - 1 ? randVowels : "";
  }
  return word;
}
