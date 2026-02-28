import gameState from "./gameState.js";


/**
 * Upgrade class that represents a purchasable upgrade in the game.
 */
class character {
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
export class tapper extends character {
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
export class worker extends character {
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

export class factory extends character {
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

class upgrade {
    constructor(name, price, img, description) {
        this.name = name;
        this.price = price;
        this.bought = false;
        this.visible = true;
        this.imgSrc = img;
        this.description = description;
        this.effect;
    }

    toHTML() {
        const container = document.createElement("div");
        container.classList.add("mini-upgrade");

        const icon = new Image();
        icon.src = this.imgSrc;

        const blurb = document.createElement("div");
        blurb.classList.add("upgrade-blurb");

        blurb.append(document.createElement("h3"));
        blurb.lastChild.textContent = this.name;
        blurb.lastChild.classList.add("blurb-name");
        blurb.append(document.createElement("p"));
        blurb.lastChild.textContent = this.description;
        blurb.appendChild(document.createElement("p"));
        blurb.lastChild.textContent = `Price: ${this.price}`;

        container.appendChild(icon);
        container.appendChild(blurb);

        container.addEventListener("mousemove",(event) => {
            console.log("happened");
            blurb.style["display"] = "block";
            blurb.style["left"] = `${event.clientX}px`;
            blurb.style["right"] = `${event.clientY}px`;
        });
        container.addEventListener("mouseleave",(event) => {blurb.style={}})

        container.addEventListener("click", (event) => {
            if(gameState.balance > this.price && !this.bought){
                gameState.removeBal(this.price);
                container.classList.add("bought");
                this.bought = true;
                this.effect();
            }
        })

        gameState.addBalanceListener((bal) =>{
            if (bal < this.price){
                container.classList.add("unafordable");
            }
            else{
                container.classList.remove("unafordable");
            }
        })

        return container;
    }
}

class rawIncrease extends upgrade {
    constructor(name, price, img, description, amount){
        super(name, price, img, description);
        this.increase = amount;
    }
    effect(){
        gameState.addModifier((cps) => {
            return cps + this.increase;
        });
    }
}

class percentOfIncrease extends upgrade {
    constructor(name, price, img, description, reference, percent){
        super(name, price, img, description);
        this.reference = reference;
        this.percent = percent;
    }
    effect() {
        gameState.addModifier((cps) => {
            let increment
            if  (this.reference == gameState)
                increment = gameState.cps*this.percent;
            else
                increment = this.reference.totalCps*this.percent;
            return cps + increment;
        })
    }
}

const poyo = new tapper();
const totoro = new worker();
const haku = new factory();


const basicUpgrade = new rawIncrease("Stronger Sprites",500,"assets/images/star1.png","Your sprites are nimbler and draw other sprites to them. Gain 10 sprites per click.",9);
const firstPercent = new percentOfIncrease("Poyo's Assistance",1000,"assets/images/star2.png","Poyo! Your poyos assist you in collecting sprites. Gain 5% of their total cps as click value",poyo, 0.05);
const secondPercent = new percentOfIncrease("Haku's Presence", 20000,"assets/images/star3.png","Haku's presence increases the efficiency of all cps sources. Gain +10% total cps as click value",gameState, 0.1);


const upgrades = [poyo, totoro, haku];
const miniupgrades = [basicUpgrade, firstPercent, secondPercent];

let upgradeElement, miniUpgradeElement;

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

function miniUpgradesToHTML(){
    const container = document.createElement("div");
    container.id="mini-upgrade-list";

    for (let u of miniupgrades) {
        container.appendChild(u.toHTML())
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

function updateMiniUpgrades() {
    miniUpgradeElement.innerHTML = "";
    miniUpgradeElement.appendChild(miniUpgradesToHTML());
}

export function setUp(ue, me) {
    upgradeElement = ue;
    miniUpgradeElement = me;

    updateUpgrades();
    updateMiniUpgrades();
}