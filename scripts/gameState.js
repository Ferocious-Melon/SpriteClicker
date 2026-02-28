class GameState {
    constructor() {
        this.balance = 0;
        this.clicks = 0;
        this.baseClickValue = 1;
        this.clickValMult =  1;
        this.cps = 0;

        this.balListeners = [];
        this.cpsListeners = [];
        this.clickListeners = [];
        this.clickValueListeners = [];
    }

    get clickValue() {
        return this.baseClickValue*this.clickValMult;
    }

    set clickValue(value) {
        this.baseClickValue = value;
        this.notifyClickValueListeners();
    }

    setClickValMult(value) {
        this.clickValMult = value;
        this.notifyClickValueListeners();
    }

    setCps(newCps) {
        this.cps = newCps;
        this.notifyCPSListeners();
    }

    //Adds the value of a click to the balance
    addClick() {
        this.clicks++;
        this.addBal(this.clickValue);
        this.notifyClickListeners();

        console.log(this.clicks);
    }

    //Add a raw amount to the balance
    addBal (amount) {
        this.balance += amount;
        this.notifyBalanceListeners();
    }

    //Remove a raw amount from the balance
    removeBal (amount) {
        this.balance -= amount;
        this.notifyBalanceListeners();
    }

    //------------------Listener logic begins below ------------------------

    addBalanceListener(listener) {this.balListeners.push(listener);}

    notifyBalanceListeners() {
        //Run the function associated with a change in balance for all
        //listeners provided
        this.balListeners.forEach((listener) => listener(this.balance));
    }

    addCPSListener(listener) {this.cpsListeners.push(listener);}

    notifyCPSListeners() {
        //Run the function associated with a change in cps for all
        //listeners provided
        this.cpsListeners.forEach((listener) => listener(this.cps));
    }

    addClickListener(listener) {this.clickListeners.push(listener);}

    notifyClickListeners() {
        //Run the function associated with a click for all
        //listeners provided
        this.clickListeners.forEach((listener) => listener(this.clicks));
    }

    addClickValueListener(listener){this.clickValueListeners.push(listener)}

    notifyClickValueListeners() {
        //Run the functions associated with a change in click value for all
        //listeners provided
        this.clickValueListeners.forEach((listener) => listener(this.clickValue));
    }
}

const gameState = new GameState();
export default gameState;