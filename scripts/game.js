import * as Upgrades from "./upgrades.js";
import gameState from "./gameState.js";
import { initRewards } from "./rewards.js";
import { updateGoalDisplay } from "./rewards.js";


window.addEventListener("load", () => {

  const UPDATE_TIME_INTERVAL = 1000/60; //updates at 60 frames per second

  const balElement = document.getElementById("bal");          //element storing text balance
  const clickCount = document.getElementById("click");        //element storing click amount
  const cpsElement = document.getElementById("cps");          //element storing cps as text
  const clickValElement = document.getElementById("click-val"); //element w/ value of click
  const clicker = document.getElementById("click-button");    //element with le button in it
  const upgradesElement = document.getElementById("upgrades-container"); //element which will store the upgrades for purchase
  const miniUpgradesElement = document.getElementById("mini-upgrades");
  const starElement = document.getElementById("stars");
  const helpButton = document.getElementById("help-button");
  const helpWindow = document.getElementById("help-window");
  const closeHelp = document.getElementById("close-button");

  const starSrcs = [
    "assets/images/star1.png"
   ,"assets/images/star2.png"
   ,"assets/images/star3.png"
   ,"assets/images/star4.png"
  ];


  function createStar(x,y){
    const star = document.createElement("img");
    star.src = starSrcs[Math.floor(Math.random() * starSrcs.length)];
    star.classList.add("star");
    star.addEventListener("load", () => {
      star.style["left"] = `${x}px`;
      star.style["top"] = `${y}px`;
      star.classList.add("animate-star");
      star.addEventListener("animationend",()=>{
        star.remove();
      });
    })
    return star;
  }

  let friction = 0.95;//how much rotation slows each tick
  let clickForce = 1.5;
  let rotspeed = 1; // degrees per second;
  const maxSpeed = 600;
  let currAngle = 0;
  let ishovered = false;

  function animateClicker() {
      currAngle += rotspeed/1000 * UPDATE_TIME_INTERVAL;
      rotspeed = Math.ceil(rotspeed*friction);
      gameState.setClickValMult(Math.ceil((rotspeed+50)/(maxSpeed/5)));
      clicker.style["transform"] = `rotate(${currAngle}deg)`;
  }

  function speedUpClicker() {
    rotspeed = Math.min(maxSpeed, (rotspeed)*clickForce + 60);
  }

  initRewards();
  updateGoalDisplay();

  Upgrades.setUp(upgradesElement,miniUpgradesElement);

  //add a listener to update the balance element whenever it changes
  gameState.addBalanceListener((newbal) => {
    balElement.textContent = Math.floor(newbal);
  });

  //add a listener to update the click element whenever it changes
  gameState.addClickListener((clickCount) => {
    click.textContent = clickCount;
  });

  //add a listener to update total cps element whenever it changes
  gameState.addCPSListener((newcps) => {
    cpsElement.textContent = Math.floor(newcps);
  });

  gameState.addClickValueListener((clickVal) => {
    clickValElement.textContent = `${gameState.clickValue} x ${gameState.clickValMult}`;
  })

  // //Actions to be done on click
  clicker.addEventListener("click", (e) => {
    clicker.classList.remove("animated");
    clicker.classList.add("animated");
    starElement.appendChild(createStar(e.clientX, e.clientY));
    gameState.addClick();
    speedUpClicker();
  });

  // //End animation events to remove the animation classes
  clicker.addEventListener("animationend", () => {
    clicker.classList.remove("animated");
  });

  clicker.addEventListener("mouseenter", () => { ishovered = true; });
  clicker.addEventListener("mouseleave", () => { ishovered = false; });

  closeHelp.addEventListener("click", () => {
    helpWindow.style["display"] = "none";
  })

  helpButton.addEventListener("click", () => {
    helpWindow.style["display"] = "flex";
  })

  //Set up an interval to add the appropriate amount of money based on the current CPS every 100ms
  const updateInterval = setInterval(() => {
    animateClicker();
    gameState.addBal(gameState.cps * (UPDATE_TIME_INTERVAL / 1000));
  }, UPDATE_TIME_INTERVAL);
});
