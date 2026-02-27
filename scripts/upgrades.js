import gameState from "./gameState.js";

class upgrade {
    constructor(basePrice, cps, pmult, name, imageSrc) {
        this.owned = 0;             //amount of upgrade owned
        this.cps = cps;
        this.basePrice = basePrice; //Base price of item
        this.pmult = pmult;         //Multiplier per upgrade
        this.name = name;

        this.imageSrc = imageSrc;
        this.imageLoaded = false;
        this.img;

        this.canvas;
        this.ctx;

        this.loadImage();
    }

    get price() {
        return Math.floor(this.basePrice * Math.pow(this.pmult,this.owned));
    }

    get totalCps() {
        return Math.floor(this.cps*this.owned);
    }

    loadImage() {
        this.img = new Image();
        this.img.src = this.imageSrc;
        this.img.addEventListener("load",() => {this.imageLoaded = true});
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
                this.drawNew();
            }
        })

        //Adding both elements to the container and returning it
        container.appendChild(text);
        container.appendChild(buyButton);

        return container;
    }

    setUpCanvas() {

        this.canvas = document.createElement("canvas");
        this.canvas.width =  document.getElementById("scoreboard").offsetWidth;
        this.canvas.height = 200;
        this.canvas.classList.add("upgrade-canvas");

        this.ctx = this.canvas.getContext("2d");

        this.ctx.fillStyle = "red";
        this.ctx.fillRect(50, 100,100,100);

        if (this.imageLoaded) {
            for(let i = 0; i < this.owned; i++){
                this.drawNew();
            }
        }

        return this.canvas;

    }

    drawNew() {
        if (this.ctx && this.imageLoaded){

            const aspectRatio = this.img.width/this.img.height;
            const newWidth = 70;
            const newHeight = newWidth*(1/aspectRatio);


            const x = Math.random()*(this.canvas.width-newWidth);
            const y = Math.random()*(this.canvas.height-newHeight)

            console.log(`drawn: (${x},${y})`);

            this.ctx.drawImage(this.img,x,y,newWidth, newHeight);
        }
    }

}


//Basic upgrade
export class tapper extends upgrade {
    constructor() {
        super(10
             ,1
             ,1.1
             ,"Helper",
              "assets/images/totoro.png"
        );
    }
}

//Slightly fancier upgrade oooooo
export class worker extends upgrade {
    constructor() {
        super(100
             ,10
             ,1.3
             ,"Chef"
             ,"assets/images/star1.png"
            );
    }
}

let upgradeElement, scoreboardElement;

function updateCPS (){
    let runningCPS = 0;

    for(let u of upgrades){
        runningCPS += u.totalCps;
    }
    gameState.setCps(runningCPS);
}

const upgrades = [new tapper(), new worker()];

function upgradesToHTML() {
    //Create a div to store all the elements
    const container = document.createElement("div");
    container.id = "upgrade-list";

    //Iterate through all upgrades and append their html element
    for (let u of upgrades){
        container.appendChild(u.toHTML());
    }

    return container;
}

function upgradesToCanvas() {
    const container = document.createElement("div");
    container.id = "upgrade-canvases";

    for (let u of upgrades){
        container.appendChild(u.setUpCanvas());
    }

    return container;
}

function updateScoreboard(){
    scoreboardElement.innerHTML = "";
    scoreboardElement.appendChild(upgradesToCanvas())
}

function updateUpgrades(){
    upgradeElement.innerHTML = "";
    upgradeElement.appendChild(upgradesToHTML());
}

export function setUp(ue, se) {
    upgradeElement = ue;
    scoreboardElement = se;

    updateScoreboard();
    updateUpgrades();
}
