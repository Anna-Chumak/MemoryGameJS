//grid variables
let grid = document.querySelector(".grid");
let score = 0;
let cellArray = [];
let level = 1;
let colorCount = 0;
let clickedCount = 0;
let row = 0;
let col = 0;
let win = true;

//color variables
let colorBackground = "cornflowerblue";
let colorForCells = "rgb(255, 134, 134)";
let pageBackColor = "";
let gridBackColor = "";
let gridBorderColor = "";
let menuBaclColor = "";
let menuTextColor = "";
let pageTextColor = "";

//mode variables
let defaultModes = [];
let dark = {};
let bright = {};
let light = {};

//user variables
let userName = "";
let userAge = "";
let userEmail = "";
let highestScore = 0;
let scores = [];

//hides all modal windows, but the user registraiton form and sets their background colors
$(() => {
  $(".modal").hide();
  $(".modal").css("color", `${menuTextColor}`);
  $(".modal").css("background-color", `${menuBaclColor}`);
  $(".registration").show();
});

//adds event listener for start function in reg form and checks input
$(".start").click(function (e) {
  e.preventDefault();
  checkInput();
});

//functions that makes sure that all the input is correct using regex
function checkInput() {
  let regexName = /^[a-zA-Z]+\s+[a-zA-Z]+$/;
  let regexEmail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (regexName.test($("#userName").val())) {
    if ($("#userAge").val() > 0) {
      if (regexEmail.test($("#userEmail").val())) {
        userName = $("#userName").val();
        userAge = $("#userAge").val();
        userEmail = $("#userEmail").val();
        $(".registration").hide();
      } else {
        alert("Invalid input");
      }
    } else {
      alert("Invalid input");
    }
  } else {
    alert("Invalid input");
  }
}

//general function for sending requests and receiving data
function getAjax(method, url, func) {
  let request;
  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  } else {
    request = new ActiveXObject("Microsoft.XMLHTTP");
  }
  request.open(method, url);
  request.onload = function () {
    if (request.status === 200) {
      func(request.responseText);
    }
  };
  request.send();
}

//event listener that sets modes and scores as soon as the document is loaded
document.addEventListener("DOMContentLoaded", function () {
  let url = "../js/modes.json";
  let url2 = "../js/scores.json";
  getAjax("GET", url, setDefualtMode);
  getAjax("GET", url2, setScores);
});

//Sets default modes to variables that will be used later at the custom page
function setDefualtMode(data) {
  defaultModes = JSON.parse(data);
  dark = defaultModes[2]["dark"];
  bright = defaultModes[0]["bright"];
  light = defaultModes[1]["light"];
  setMode();
}

//sets the defualt mode or the mode that is stored in local storage if there is one
function setMode() {
  if (window.localStorage) {
    let mode = JSON.parse(localStorage.getItem("mode")) || null;
    if (mode) {
      setGivenMode(mode);
    } else {
      setGivenMode(light);
    }
  }
}

//sets scores taken from JSON file or from local storage if there is one
function setScores(data) {
  if (window.localStorage) {
    scores = JSON.parse(localStorage.getItem("scores")) || null;
    if (scores) {
      setScoreBoard();
    } else {
      scores = JSON.parse(data);
      setScoreBoard();
    }
  }
}

//sets the scoreboard and refreshes it every time something is changed
function setScoreBoard() {
  document.querySelector(".score-board").innerHTML = "";
  document.querySelector(".score-board").innerHTML += " <h2>Score Board</h2>";
  for (let i = 0; i < scores.length; i++) {
    let scoreLine = document.createElement("div");
    scoreLine.classList = "scoreLine";
    let pName = document.createElement("p");
    pName.classList = "user";
    pName.innerHTML = `${scores[i]["userName"]}`;
    scoreLine.append(pName);
    let pScore = document.createElement("p");
    pScore.classList = "score";
    pScore.innerHTML = `${scores[i]["score"]}`;
    scoreLine.append(pScore);
    document.querySelector(".score-board").append(scoreLine);
  }
}

//adds event listener to Memory Game title to show scoreboard when clicked
$("#name").click(() => {
  $(".score-board").show();
});
//creating the grid and divs within the grid and adding style to them
function createGrid() {
  for (let i = 0; i < row; i++) {
    for (j = 0; j < col; j++) {
      let div = document.createElement("div");
      div.classList.add("cell");
      div.setAttribute("data-column", `${j}`);
      div.setAttribute("data-row", `${i}`);
      grid.append(div);
    }
  }
  grid.style.cssText = `display: grid;
  width: 500px;
  grid-template-columns: repeat(${col}, ${500 / col}px);
  grid-template-rows: repeat(${row}, ${500 / col}px);
  background-color: ${gridBackColor}`;
  $("#blocks").text(`${clickedCount}/${colorCount}`);
}

//coloring the cells for the pattern and then covering it after 0,5 second
function colorCells() {
  for (item of document.querySelectorAll(".cell")) {
    if (cellArray[item.dataset.row][item.dataset.column].status === 1) {
      item.style.cssText = `background-color: ${colorForCells};`;
    }
  }
  setTimeout(coverGrid, 2000);
}

//sets the size of the grid depending on the level the player is on
function setGridSize() {
  //setting rows, cols and number of colored cells depending on the level
  colorCount = level + 3;
  switch (level) {
    case 1:
    case 2:
      row = 3;
      col = 3;
      break;
    case 3:
    case 4:
      row = 3;
      col = 4;
      break;
    case 5:
    case 6:
      row = 4;
      col = 5;
      break;
    case 7:
    case 8:
      row = 5;
      col = 5;
      break;
    case 9:
    case 10:
      row = 6;
      col = 6;
      break;
    default:
      break;
  }
}

//creates random patters and sets values to status to 1 if they should be chosen and colored
function createPattern() {
  //populates the array with default values
  for (let i = 0; i < row; i++) {
    let currentRow = [];
    for (j = 0; j < col; j++) {
      currentRow.push({ status: 0, clicked: 0, row: i, col: j });
    }
    cellArray.push(currentRow);
  }
  //sets a given amount of colored patterns
  let count = 0;
  while (count < colorCount) {
    let i = Math.floor(Math.random() * row);
    let j = Math.floor(Math.random() * col);
    if (cellArray[i][j].status === 0) {
      cellArray[i][j].status = 1;
      count++;
    }
  }
}

//colors all the grid back to default color
function coverGrid() {
  for (item of document.querySelectorAll(".cell")) {
    item.style.cssText = `background-color: ${gridBackColor};`;
  }
  $(".cell").click(setClicked);
}

//keeps track of the clicked items and checks if they are the part of the pattern or not
function setClicked(e) {
  clickedCount++;
  $("#blocks").text(`${clickedCount}/${colorCount}`);
  if (cellArray[e.target.dataset.row][e.target.dataset.column].status === 1) {
    cellArray[e.target.dataset.row][e.target.dataset.column].clicked = 1;
    e.target.style.cssText = `background-color: ${colorForCells};`;
    score += 10;
  } else {
    e.target.style.cssText = "background-color: red;";

    setTimeout(() => {
      e.target.style.cssText = `background-color: ${gridBackColor};`;
      win = false;
    }, 500);
  }
  if (clickedCount === colorCount) {
    $(".cell").off("click");
    setTimeout(checkPass, 2000);
  }
}

//checks if the player passed this level and if they did moves to the next one
function checkPass() {
  if (win) {
    if (level < 10) {
      level++;
      resetGrid();
    }
  } else if (level === 10) {
    if (highestScore < score) {
      highestScore = score;
    }
    checkScoreBoard();
    winWindow();
  } else {
    if (highestScore < score) {
      highestScore = score;
    }
    checkScoreBoard();
    level = 1;
    score = 0;

    lost();
  }
}

//resets the grid for the appropriate level
function resetGrid() {
  $(() => {
    $(".modal").hide();
  });
  grid.innerHTML = "";
  coverGrid();
  $("#score").text(`Score: ${score}`);
  $("#level").text(`Level: ${level}`);
  cellArray = [];
  colorCount = 0;
  clickedCount = 0;
  row = 0;
  col = 0;
  win = true;
  setGridSize();
  createGrid();
  createPattern();
  colorCells();
}

setGridSize();
createGrid();

$("#play").click(() => {
  $("#play").hide();
  createPattern();
  colorCells();
});

function winWindow() {
  $(".win").show();
  $(".win-score").append(`${score}`);
  $(".modal").css("color", `${menuTextColor}`);
  $(".modal").css("background-color", `${menuBaclColor}`);
}

function lost() {
  $(".lost").show();
  $(".modal").css("color", `${menuTextColor}`);
  $(".modal").css("background-color", `${menuBaclColor}`);
}

function checkScoreBoard() {
  for (let i = 0; i < scores.length; i++) {
    if (scores[i]["score"] < highestScore) {
      for (let j = scores.length - 1; j > i; j--) {
        scores[j] = scores[j - 1];
      }
      let obj = { userName: `${userName}`, score: highestScore };
      scores[i] = obj;
      break;
    }
  }
  localStorage.setItem("scores", JSON.stringify(scores));
  setScoreBoard();
}

$(".play-again").click(resetGrid);
//customize page!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

$(".colorpicker").change(setColor);
$("#colorMode").change(setModeOnPage);
function setColor(e) {
  let color = e.target.value;
  if (e.target.id === "pageBack") {
    setPageBackground(color);
  } else if (e.target.id === "gridBack") {
    setGridBackground(color);
  } else if (e.target.id === "borderBack") {
    setGridBorderColor(color);
  } else if (e.target.id === "menuBack") {
    setMenuColor(color);
  } else if (e.target.id === "menuTextolor") {
    setMenuTextColor(color);
  } else if (e.target.id === "textColor") {
    setTextColor(color);
  }
}
function setPageBackground(color) {
  pageBackColor = color;
  document.querySelector("body").style.cssText += `background-color: ${color};`;
  setCustomMode();
}

function setGridBackground(color) {
  gridBackColor = color;
  $(".cell").css("background-color", `${color}`);
  setCustomMode();
}

function setMenuColor(color) {
  menuBaclColor = color;
  $("menu").css("background-color", `${color}`);
  setCustomMode();
}

function setGridBorderColor(color) {
  gridBorderColor = color;
  $(".cell").css("border-color", `${color}`);
  $(".grid").css("border-color", `${color}`);
  $(".grid").css("background-color", `${color}`);
  setCustomMode();
}

function setMenuTextColor(color) {
  menuTextColor = color;
  $("menu").css("color", `${color}`);
  $("a").css("color", `${color}`);
  setCustomMode();
}
function setTextColor(color) {
  pageTextColor = color;
  $(".custom-container").css("color", `${color}`);
  setCustomMode();
}

function setGivenMode(item) {
  setPageBackground(item.pageBackColor);
  setGridBackground(item.gridBackColor);
  setGridBorderColor(item.gridBorderColor);
  setMenuColor(item.menuBaclColor);
  setMenuTextColor(item.menuTextColor);
  setTextColor(item.pageTextColor);
}

function setModeOnPage(e) {
  if (e.target.value === "dark") {
    setGivenMode(dark);
    localStorage.setItem("mode", JSON.stringify(dark));
  } else if (e.target.value === "light") {
    localStorage.setItem("mode", JSON.stringify(light));
    setGivenMode(light);
  } else if (e.target.value === "bright") {
    localStorage.setItem("mode", JSON.stringify(bright));
    setGivenMode(bright);
  }
}

function setCustomMode() {
  let custom = {
    pageBackColor: `${pageBackColor}`,
    gridBackColor: `${gridBackColor}`,
    gridBorderColor: `${gridBorderColor}`,
    menuBaclColor: `${menuBaclColor}`,
    menuTextColor: `${menuTextColor}`,
    pageTextColor: `${pageTextColor}`,
  };
  localStorage.setItem("mode", JSON.stringify(custom));
}
