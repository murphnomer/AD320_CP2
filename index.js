/**
 * 
 */
"use strict";

(function() {

    const TIMER_START = 30;

    const LANGUAGES = ["None","English","Spanish","German","Russian","Chinese"];
    const COLOR_NAMES = ["blue","red","yellow","black","purple","green","orange"];

    const COLOR_WORDS = [["███","███","███","███","███","███","███"],
                         ["BLUE","RED","YELLOW","BLACK","PURPLE","GREEN","ORANGE"],
                         ["AZUL","ROJO","AMARILLO","NEGRO","MORADO","VERDE","ANARANJADO"],
                         ["BLAU","ROT","GELB","SCHWARZ","PURPUR","GRÜN","ORANGE"],
                         ["СИНИЙ","КРАСНЫЙ","ЖЁЛТЫЙ","ЧЕРНЫЙ","ФИОЛЕТОВЫЙ","ЗЕЛЁНЫЙ","ОРАНЖЕВЫЙ"],
                         ["蓝","红","黄","黑","紫","绿","橙"]];

    const ONE_SECOND = 1000;
    const SECONDS_IN_MINUTE = 60;

    let source_lang;
    let response_lang;

    let timer = null;
    let clickTime;
    let remainingTime = TIMER_START;
    let totalResponseTime = 0;
    let numCorrect = 0;
    let numWrong = 0;

    let curItemLang;
    let curResponseLang;
    let curItem;

    let score = 0;

  /**
   * Add a function that will be called when the window is loaded.
   */
  window.addEventListener("load", init);

  function init() {

    id("start").addEventListener("click",start);
    let buttons = qsa(".response_btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click",processResponse);
    }
  }

  function start() {
    timer = setInterval(tick, ONE_SECOND);
    source_lang = id("source_lang").value;
    response_lang = id("response_lang").value;
    clickTime = Date.now();
    generateItem();
    randomizeButtons();
  }

  function generateItem() {
    let item = gen("p");
    let word = Math.floor(Math.random() * COLOR_NAMES.length);
    let color = word;
    while (color===word) {
        color = Math.floor(Math.random() * COLOR_NAMES.length);
    }
    item.textContent = COLOR_WORDS[source_lang][word];
    item.classList.add(COLOR_NAMES[color]);
    item.id = color;

    const BOARD_STYLE = window.getComputedStyle(id("board"));

    item.style.top = (60 + Math.floor(Math.random() * (BOARD_STYLE.height.replace('px','') - 55))) + 'px';
    item.style.left = (15 + Math.floor(Math.random() * (BOARD_STYLE.width.replace('px','') - 270))) + 'px';
    id("board").appendChild(item);
    
  }

  function randomizeButtons() {
    let buttons = qsa(".response_btn");
    let rndOrder = shuffle([...Array(buttons.length).keys()]);
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].textContent = COLOR_WORDS[response_lang][rndOrder[i]];
        buttons[i].id = rndOrder[i];
    }
  }

  function processResponse() {
    totalResponseTime += Date.now() - clickTime;
    let item = qs("#board p");
    if (this.id == item.id) {
        numCorrect++;
    } else {
        numWrong++;
    }
    item.remove();
    generateItem();
    clickTime = Date.now();
    updateScoreDisplay();

  }

  function tick() {
    updateTimeDisplay();
    if (remainingTime===0) {
        clearInterval(timer);
        timer = null;
        updateResults();
    }
  }

  function updateScoreDisplay() {
    id("num_correct").textContent = numCorrect;
    id("num_wrong").textContent = numWrong;
    id("response_time").textContent = Math.floor(totalResponseTime / (numCorrect + numWrong)) + ' ms';
  }

  function updateTimeDisplay() {
    remainingTime--;
    let secondsDisplay = remainingTime % SECONDS_IN_MINUTE;
    secondsDisplay = (remainingTime < 10 ? "0" : "") + remainingTime;
    let minutesDisplay = Math.floor(remainingTime / SECONDS_IN_MINUTE);
    id("timer").textContent = minutesDisplay + ":" + secondsDisplay;
  }

  function updateResults(){
    qs("#board p").remove();
  }

  /**
   * Randomizes the order of elements in an array.  From StackOverflow:
   * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
   * @param {*} array the array to randomize
   * @returns the randomized array
   */
  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  /** ------------------------------ Helper Functions  ------------------------------ */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }


})();