import gameState from "./gameState.js";

class upgrade {
    constructor(basePrice, pmult, cps) {
        this.basePrice = basePrice; //Base price of item
        this.pmult = pmult;         //Multiplier per upgrade
        this.owned = 0;             //amount of upgrade owned
        this.cps = cps;
        this.name;
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
}


//Basic upgrade
export class tapper extends upgrade {
    constructor() {
        super(10,1.1,1);
        this.name = "Helper";
    }
}

export class worker extends upgrade {
    constructor() {
        super(100,1.1,10);
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

    const container = document.createElement("div");
    container.id = "upgrade-list";

    for (let u of upgrades){
        container.appendChild(u.toHTML());
    }

    return container;
}