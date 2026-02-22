class upgrade {
    constructor(basePrice, pmult) {
        this.basePrice = basePrice; //Base price of item
        this.pmult = pmult;     //Multiplier per upgrade
        this.owned = 0;     //amount of upgrade owned
    }

    get price() {
        return this.basePrice * Math.pow(this.pmult,this.owned);
    }
}


export class tapper extends upgrade {
    constructor() {
        super(10,1.1);
    }
}

export class worker extends upgrade {
    constructor() { 
        super(100,1.1); 
    }
}