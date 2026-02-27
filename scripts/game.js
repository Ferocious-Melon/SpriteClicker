import * as Upgrades from "./upgrades.js";
import gameState from "./gameState.js";
import { initRewards } from "./rewards.js";


window.addEventListener("load", () => {

  const CPS_TIME_INTERVAL = 10; //Interval clicks per second are added to the balance

  const balElement = document.getElementById("bal");          //element storing text balance
  const clickCount = document.getElementById("click");        //element storing click amount
  const cpsElement = document.getElementById("cps");          //element storing cps as text
  const clickValElement = document.getElementById("click-val"); //element w/ value of click
  const clicker = document.getElementById("click-button");    //element with le button in it
  const upgradesElement = document.getElementById("upgrades-container"); //element which will store the upgrades for purchase
  const scoreboardElement = document.getElementById("scoreboard-container");
  const starElement = document.getElementById("stars");

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
      classList.add("animate-star");
    })
    star.addEventListener("animationend",()=>{
      this.remove();
    })
    return star;
  }

  initRewards();
  Upgrades.setUp(upgradesElement,scoreboardElement);

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
    clickValElement.textContent = clickVal;
  })

  // //Actions to be done on click
  clicker.addEventListener("click", (e) => {
    clicker.classList.remove("animated");
    clicker.classList.add("animated");
    starElement.appendChild(createStar(e.clientX, e.clientY));
    gameState.addClick();
  });

  // //End animation events to remove the animation classes
  clicker.addEventListener("animationend", () => {
    clicker.classList.remove("animated");
  });

  //Set up an interval to add the appropriate amount of money based on the current CPS every 100ms
  const CPSInterval = setInterval(() => {
    gameState.addBal(gameState.cps * (CPS_TIME_INTERVAL / 1000));
  }, CPS_TIME_INTERVAL);
});
