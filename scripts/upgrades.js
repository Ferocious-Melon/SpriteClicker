import gameState from "./gameState.js";


/**
 * Upgrade class that represents a purchasable upgrade in the game.
 */
class upgrade {
    constructor() {
        this.owned = 0; //amount of upgrade owned
        this.cps;
        this.basePrice; //Base price of item
        this.pmult; //Multiplier per upgrade
        this.name;
        this.imageSrc;
        this.scoreboardTarget = null;
        this.scoreIcon = null;
    }

    /**
     * Current price of the upgrade.
     */
    get price() {
        return Math.floor(this.basePrice * Math.pow(this.pmult, this.owned));
    }

    /**
     * Total clicks per second contributed by this upgrade type.
     */
    get totalCps() {
        return Math.floor(this.cps * this.owned);
    }

    /**
     * Generates the HTML representation of the upgrade
     */
    toHTML() {

        //Creating the container for the upgrade
        const container = document.createElement("div");
        container.classList.add("upgrade");
        container.innerHTML = "";

        const iconContainer = document.createElement("div");
        iconContainer.classList.add("icon-container");
        const icon = new Image();
        icon.src = this.imageSrc;
        icon.style.height = "100px";
        icon.classList.add("icon");

        iconContainer.appendChild(icon);

        //Creating the text content for the upgrade
        const text = document.createElement("div");
        text.classList.add("upgrade-text");

        const name = document.createElement("h2");
        name.textContent = this.name;
        const owned = document.createElement("p");
        owned.textContent = `Owned: ${this.owned}`;
        const price = document.createElement("p");
        price.textContent = `Price: ${this.price}`;

        text.appendChild(name);
        text.appendChild(owned);
        text.appendChild(price);

        //Creating the buy button for the upgrade
        const buyButton = document.createElement("button");
        buyButton.classList.add("buy-button");
        buyButton.textContent = "Buy";
        buyButton.addEventListener("click", (event) => {
            if (gameState.balance >= this.price) {
                console.log("happened")
                event.target.classList.add("available");
                gameState.removeBal(this.price);
                this.owned += 1;
                owned.textContent = `Owned: ${this.owned}`;
                price.textContent = `Price: ${this.price}`;
                updateCPS();

                if (this.scoreboardTarget && this.scoreIcon) {
                    addIcon(this.scoreIcon, this.scoreboardTarget, this.iconHeight);
                }
            }
        })

        //Adding both elements to the container and returning it
        container.appendChild(iconContainer);
        container.appendChild(text);
        container.appendChild(buyButton);

        return container;
    }


}

//Basic upgrade
export class tapper extends upgrade {
    constructor() {
        super();
        this.basePrice = 10;
        this.pmult = 1.1;
        this.cps = 1;
        this.name = "Ponyo";
        this.imageSrc = "assets/images/ponyo1.png";

        this.scoreboardTarget = "ponyo-upgrades";
        this.scoreIcon = "randomPonyo";
        this.iconHeight = 40;
    }
}

//Slightly fancier upgrade oooooo
export class worker extends upgrade {
    constructor() {
        super();
        this.basePrice = 100;
        this.pmult = 1.3;
        this.cps = 10;
        this.name = "Totoro";
        this.imageSrc = "assets/images/Totoro.png"

        this.scoreboardTarget = "totoro-upgrades";
        this.scoreIcon = "assets/images/Totoro.png";
        this.iconHeight = 80;
    }
}

export class factory extends upgrade {
    constructor() {
        super();
        this.basePrice = 10000;
        this.pmult = 1.3;
        this.cps = 500;
        this.name = "Haku";
        this.imageSrc = "assets/images/haku.png";

        this.scoreboardTarget = "haku-upgrades";
        this.scoreIcon = "assets/images/haku.png";
        this.iconHeight = 120;
    }
}

let upgradeElement, scoreboardElement;

const upgrades = [new tapper(), new worker(), new factory()];

function updateCPS() {
    let runningCPS = 0;

    for (let u of upgrades) {
        runningCPS += u.totalCps;
    }
    gameState.setCps(runningCPS);
}

function upgradesToHTML() {
    //Create a div to store all the elements
    const container = document.createElement("div");
    container.id = "upgrade-list";

    //Iterate through all upgrades and append their html element
    for (let u of upgrades) {
        container.appendChild(u.toHTML());
    }

    return container;
}

function upgradesToCanvas() {
    const container = document.createElement("div");
    container.id = "upgrade-canvases";

    for (let u of upgrades) {
        container.appendChild(u.toCanvas());
    }

    return container;
}

//ponyo upgrade icons
const ponyoIcons = [
    "assets/images/ponyo1.png",
    "assets/images/ponyo2.png",
    "assets/images/ponyo3.png",
    "assets/images/ponyo4.png",
    "assets/images/ponyo5.png",
];

/**
 * Adds an icon to the scoreboard.
 */
function addIcon(icon, scoreboard, height=40) {
    const holder = document.getElementById(scoreboard);

    if (!holder) return;

    const src = (icon === "randomPonyo")
    ? ponyoIcons[Math.floor(Math.random() * ponyoIcons.length)]
    : icon;

    const img = document.createElement("img");
    img.src = src;
    img.alt = "upgrade icon";
    img.style.height =  height + "px";

    holder.appendChild(img);

    // trigger fade-in
    requestAnimationFrame(() => img.classList.add("show"));
}

function updateUpgrades() {
    upgradeElement.innerHTML = "";
    upgradeElement.appendChild(upgradesToHTML());
}

export function setUp(ue, se) {
    upgradeElement = ue;
    scoreboardElement = se;

    updateUpgrades();
}