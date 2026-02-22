import * as Upgrades from "./upgrades.js";

window.addEventListener("load",() => {


    let balance = 0;

    const test = new Upgrades.tapper();

    const balElement = document.getElementById("bal");
    const clicker = document.getElementById("click-button");

    clicker.addEventListener("click", () => {
        clicker.classList.remove("animated");
        clicker.classList.add("animated");
        balance += 1;
        balElement.textContent = balance;
    })
    clicker.addEventListener("animationend", () => {
        clicker.classList.remove("animated");
    })

});