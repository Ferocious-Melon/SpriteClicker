import * as Upgrades from "./upgrades.js";
import gameState from "./gameState.js";
import { initRewards } from "./rewards.js";


window.addEventListener("load", () => {

  const CPS_TIME_INTERVAL = 10; //Interval clicks per second are added to the balance

  const balElement = document.getElementById("bal");          //element storing text balance
  const cpsElement = document.getElementById("cps");          //element storing cps as text
  const clicker = document.getElementById("click-button");    //element with le button in it
  const upgradesElement = document.getElementById("upgrades-container"); //element which will store the upgrades for purchase
  const scoreboardElement = document.getElementById("scoreboard-container");

  const clickValElement = document.getElementById("click-val"); //element w/ value of click
  clickValElement["inert"] = true;                              //make it unselectable as it shows underneath player cursor

  initRewards();

  function updateUpgrades() {
    upgradesElement.innerHTML = "";
    upgradesElement.appendChild(Upgrades.upgradesToHTML());

    scoreboardElement.innerHTML = "";
    scoreboardElement.appendChild(Upgrades.upgradesToCanvas())
  }

  updateUpgrades();


  function moveClickValue(x,y) {
    clickValElement.textContent = `+${gameState.clickValue}`;
    clickValElement.style["left"] = `${x}px`;
    clickValElement.style["top"] = `${y}px`;

    clickValElement.classList.remove("fading");
    clickValElement.classList.add("fading");

  }

  //add a listener to update the balance element whenever it changes
  gameState.addBalanceListener((newbal) => {
    balElement.textContent = Math.floor(newbal);
  });

  //add a listener to update total cps element whenever it changes
  gameState.addCPSListener((newcps) => {
    cpsElement.textContent = Math.floor(newcps);
  });

  //Actions to be done on click
  clicker.addEventListener("click", (e) => {

    //Move the click value element
    moveClickValue(e.clientX, e.clientY);

    clicker.classList.remove("animated");
    clicker.classList.add("animated");
    gameState.addClick(); 
  });

  //End animation events to remove the animation classes
  clicker.addEventListener("animationend", () => {
    clicker.classList.remove("animated");
  });

  clickValElement.addEventListener("animationend", () => {
      clickValElement.classList.remove("fading");
  });

  //Set up an interval to add the appropriate amount of money based on the current CPS every 100ms
  const CPSInterval = setInterval(() => {
    gameState.addBal(gameState.cps * (CPS_TIME_INTERVAL / 1000));
  }, CPS_TIME_INTERVAL);

});
