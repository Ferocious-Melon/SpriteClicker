import gameState from "./gameState.js";

class upgrade {
    constructor() {
        this.owned = 0;             //amount of upgrade owned
        this.cps;
        this.basePrice; //Base price of item
        this.pmult;         //Multiplier per upgrade
        this.name;
        this.imageSrc;
        this.bg = null
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
                addRandomScoreIcon();
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

        const draw = (bgImg, iconImg) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        
            if (bgImg) {
              ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
            }
        
            if (iconImg) {
              const newWidth = 90;
              const aspect = iconImg.width / iconImg.height;
              const newHeight = newWidth / aspect;
              ctx.drawImage(iconImg, 20, (canvas.height - newHeight) / 2, newWidth, newHeight);
            }
          };
        
          // Load images (background + icon), then draw once both are ready
          let bgImg = null;
          let iconImg = null;
          let loaded = 0;
          const need = (this.bg ? 1 : 0) + (this.imageSrc ? 1 : 0);
        
          const doneOne = () => {
            loaded++;
            if (loaded >= need) draw(bgImg, iconImg);
          };
        
          if (this.bg) {
            bgImg = new Image();
            bgImg.src = this.bg;
            bgImg.addEventListener("load", doneOne);
          }
        
          if (this.imageSrc) {
            iconImg = new Image();
            iconImg.src = this.imageSrc;
            iconImg.addEventListener("load", doneOne);
          }
        
          // If there are no images, still draw something
          if (need === 0) draw(null, null);
        
          return canvas;
        }

        // ctx.fillStyle = "red";
        // ctx.fillRect(50, 100,100,100);

    //     if (this.imageSrc) {
    //         const img = new Image();
    //         img.src = this.imageSrc;

    //         const aspectRatio = img.width/img.height;
    //         const newWidth = 70;
    //         const newHeight = newWidth*(1/aspectRatio);

    //         img.addEventListener("load", () => {
    //             ctx.drawImage(img,0,0, newWidth, newHeight);
    //         })
    //     }

    //     return canvas;

    // }
}


//Basic upgrade
export class tapper extends upgrade {
    constructor() {
        super();
        this.basePrice = 10;
        this.pmult = 1.1;
        this.cps = 1;
        this.name = "Helper";
        this.bg = "assets/images/scoreboard1.jpg";
        this.imageSrc = "assets/images/totoro.png";
    }
}

//Slightly fancier upgrade oooooo
export class worker extends upgrade {
    constructor() {
        super();
        this.basePrice= 100;
        this.pmult = 1.3;
        this.cps = 10;
        this.name = "Chef";
        this.bg = "assets/images/scoreboard2.jpg";
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

const scoreIconPool = [
    "assets/images/ponyo1.png",
    "assets/images/ponyo2.png",
    "assets/images/ponyo3.png",
    "assets/images/ponyo4.png",
    "assets/images/ponyo5.png",
    // add as many as you want
  ];
  
  function addRandomScoreIcon() {
    const holder = document.getElementById("score-icons");
    if (!holder) return;
  
    const src = scoreIconPool[Math.floor(Math.random() * scoreIconPool.length)];
  
    const img = document.createElement("img");
    img.src = src;
    img.alt = "upgrade icon";
  
    holder.appendChild(img);
  
    // trigger fade-in
    requestAnimationFrame(() => img.classList.add("show"));
  }