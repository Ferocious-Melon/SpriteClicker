import * as Upgrades from "./upgrades.js";
import gameState from "./gameState.js";

window.addEventListener("load",() => {

    const CPS_TIME_INTERVAL = 100;

    const balElement = document.getElementById("bal");
    const cpsElement = document.getElementById("cps");
    const clicker = document.getElementById("click-button");
    const upgradesElement = document.getElementById("upgrades-container");

    gameState.addBalanceListener((newbal) =>{
        balElement.textContent = Math.floor(newbal);
    });

    gameState.addCPSListener((newcps) => {
        cpsElement.textContent = Math.floor(newcps);
    })


    clicker.addEventListener("click", () => {
        clicker.classList.remove("animated");
        clicker.classList.add("animated");
        gameState.addClick();
    })
    clicker.addEventListener("animationend", () => {
        clicker.classList.remove("animated");
    })

    function updateUpgrades() {
        upgradesElement.innerHTML = "";
        upgradesElement.appendChild(Upgrades.upgradesToHTML());
    }

    updateUpgrades();

    //Set up an interval to add the appropriate amount of money based on the current CPS every 100ms
    const CPSInterval = setInterval(() => {
        gameState.addBal(gameState.cps*(CPS_TIME_INTERVAL/1000));
    }, CPS_TIME_INTERVAL);

});