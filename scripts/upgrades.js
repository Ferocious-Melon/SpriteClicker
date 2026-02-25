import gameState from "./gameState.js";

class upgrade {
    constructor() {
        this.owned = 0;             //amount of upgrade owned
        this.cps;
        this.basePrice; //Base price of item
        this.pmult;         //Multiplier per upgrade
        this.name;
        this.imageSrc;
    }

    get price() {
        return Math.floor(this.basePrice * Math.pow(this.pmult,this.owned));
    }

    get totalCps() {
        return Math.floor(this.cps*this.owned);
    }

    toHTML() {

        //Creating the container for the upgrade
        const container = document.createElement("div");
        container.classList.add("upgrade");
        container.innerHTML = "";

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
                event.target.classList.add("available");
                gameState.removeBal(this.price);
                this.owned += 1;
                owned.textContent = `Owned: ${this.owned}`;
                price.textContent = `Price: ${this.price}`;

                updateCPS();
            }
        })

        //Adding both elements to the container and returning it
        container.appendChild(text);
        container.appendChild(buyButton);

        return container;
    }

    toCanvas() {

        const canvas = document.createElement("canvas");
        canvas.width =  document.getElementById("scoreboard").offsetWidth;
        canvas.height = 200;
        canvas.classList.add("upgrade-canvas");

        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "red";
        ctx.fillRect(50, 100,100,100);

        return canvas;

    }
}


//Basic upgrade
export class tapper extends upgrade {
    constructor() {
        this.basePrice = 10;
        this.pmult = 1.1;
        this.cps = 1;
        this.name = "Helper";
        this.imageSrc = "assets/images/totoro.png";
    }
}

//Slightly fancier upgrade oooooo
export class worker extends upgrade {
    constructor() {
        this.basePrice= 100;
        this.pmult = 1.3;
        this.cps = 10;
        this.name = "Chef";
    }
}


function updateCPS (){
    let runningCPS = 0;

    for(let u of upgrades){
        runningCPS += u.totalCps;
    }
    gameState.setCps(runningCPS);
}

const upgrades = [new tapper(), new worker()];

export function upgradesToHTML() {
    //Create a div to store all the elements
    const container = document.createElement("div");
    container.id = "upgrade-list";

    //Iterate through all upgrades and append their html element
    for (let u of upgrades){
        container.appendChild(u.toHTML());
    }

    return container;
}

export function upgradesToCanvas() {
    const container = document.createElement("div");
    container.id = "upgrade-canvases";

    for (let u of upgrades){
        container.appendChild(u.toCanvas());
    }

    return container;
}