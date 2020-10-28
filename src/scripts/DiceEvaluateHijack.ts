import LuckForRolls from "./LuckForRolls";
import Settings from "./Settings";

// @ts-nocheck

function evaluate({minimize = false, maximize = false} = {}) {
    if (this._evaluated) {
        throw new Error(`This ${this.constructor.name} has already been evaluated and is immutable`);
    }

    let critChance = Settings.getCritChances();
    const observedDie = Settings.getSetting("observedDie");

    // Roll the initial number of dice
    for (let n = 1; n <= this.number; n++) {
        this.roll({minimize, maximize});
        const ret = LuckForRolls.modifyRolls(this.results[n - 1], this.faces, game.userId, critChance);
        this.results[n - 1] = ret.roll;
        critChance = ret.crit;
    }

    if (observedDie === this.faces) Settings.setCritChances(critChance);

    // Apply modifiers
    this._evaluateModifiers();

    // Return the evaluated term
    this._evaluated = true;
    return this;
}

export {
    evaluate
}