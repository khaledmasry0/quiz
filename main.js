let countspan = document.querySelector(".count span");
let bulletspan = document.querySelector(".bullets .spans");
let quizarea = document.querySelector(".quiz-area");
let ansarea = document.querySelector(".answers-area");
let submit = document.querySelector(".submit");
let bulletsall = document.querySelector(".bullets");
let resultbox = document.querySelector(".results");
let countdowndiv = document.querySelector(".countdown");
let currentindex = 0;
let countdownnum;
let rightanswers = 0;
function getfile() {
  let myrequest = new XMLHttpRequest();
  myrequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let req = JSON.parse(this.responseText);
      let reqlength = req.length;

      createbullets(reqlength);

      addquestiondata(req[currentindex], reqlength);

      countdown(5, reqlength); //countdown #######################################

      submit.onclick = function () {
        let ranswer = req[currentindex].ra;
        currentindex++;

        checkanswer(ranswer, reqlength);

        quizarea.innerHTML = "";
        ansarea.innerHTML = "";

        clearInterval(countdownnum);
        countdown(5, reqlength); //countdown ######################################

        addquestiondata(req[currentindex], reqlength);

        handlebullets();

        showresults(reqlength);
      };
    }
  };
  myrequest.open("GET", "ob.json", true);
  myrequest.send();
}
getfile();

function createbullets(n) {
  countspan.innerHTML = n;
  //create bullets
  for (let i = 0; i < n; i++) {
    let bullet = document.createElement("span");
    if (i === 0) {
      bullet.className = "on";
    }
    bulletspan.appendChild(bullet);
  }
}

function addquestiondata(obj, count) {
  if (currentindex < count) {
    let qtitle = document.createElement("h2");
    let qtxt = document.createTextNode(obj.question);
    qtitle.appendChild(qtxt);
    quizarea.appendChild(qtitle);
    for (i = 1; i < 5; i++) {
      let maindiv = document.createElement("div");
      maindiv.className = "answer";
      let radioinput = document.createElement("input");
      radioinput.name = "question";
      radioinput.type = "radio";
      radioinput.id = `ans_${i}`;
      radioinput.dataset.answer = obj[`ans_${i}`];

      if (i === 1) {
        radioinput.checked = true;
      }

      let label = document.createElement("label");

      label.htmlFor = `ans_${i}`;

      let labeltxt = document.createTextNode(obj[`ans_${i}`]);

      label.appendChild(labeltxt);

      maindiv.appendChild(radioinput);
      maindiv.appendChild(label);

      ansarea.appendChild(maindiv);
    }
  }
}

function checkanswer(ranswer, count) {
  let answers = document.getElementsByName("question");
  let choosenanswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenanswer = answers[i].dataset.answer;
    }
  }
  if (ranswer === choosenanswer) {
    rightanswers++;
  }
}
function handlebullets() {
  let bulletspans = document.querySelectorAll(".bullets .spans span");
  let array = Array.from(bulletspans);
  array.forEach((span, index) => {
    if (currentindex === index) {
      span.className = "on";
    }
  });
}

function showresults(count) {
  let results;
  if (currentindex === count) {
    quizarea.remove();
    ansarea.remove();
    submit.remove();
    bulletsall.remove();

    if (rightanswers > count / 2 && rightanswers < count) {
      results = `<span class = "good"> Good </span>, ${rightanswers} from ${count} is good`;
    } else if (rightanswers === count) {
      results = `<span class = "perfect"> Perfect </span>, ALL answers is Right`;
    } else {
      results = `<span class = "bad"> Bad </span>, ${rightanswers} from ${count} is bad`;
    }
    resultbox.innerHTML = results;
    let addword = document.createElement("div");
    addword.className = "resultWord";
    let word = document.createTextNode("RESULTS");
    addword.appendChild(word);
    resultbox.prepend(addword);
    resultbox.style.cssText = "padding:15px";
  }
}
function countdown(duration, count) {
  if (currentindex < count) {
    let min, sec;
    countdownnum = setInterval(function () {
      min = parseInt(duration / 60);
      sec = parseInt(duration % 60);

      min = min < 10 ? ` 0 ${min} ` : min;
      sec = sec < 10 ? ` 0 ${sec} ` : sec;

      countdowndiv.innerHTML = `${min}:${sec}`;

      if (--duration < 0) {
        clearInterval(countdownnum);
        submit.click();
      }
    }, 1000);
  }
}
