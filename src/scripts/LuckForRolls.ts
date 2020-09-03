import Settings from "./Settings";
import Utils from "./Utils";

class LuckForRolls {

    private static _instance: LuckForRolls;

    private constructor() {
    }

    public static getInstance(): LuckForRolls {
        if (!LuckForRolls._instance) LuckForRolls._instance = new LuckForRolls();
        return LuckForRolls._instance;
    }

    private _getStartingChance() {
        return Settings.getSetting("defaultCritChance");
    }

    private _getIncrementalCrit() {
        return Settings.getSetting("incrementalCritValue");
    }

    private _resetCritChange(user: string) {
        const critChances = Settings.getCritChances();
        critChances[user] = this._getStartingChance();
        Settings.setCritChances(critChances);
        Utils.debug(`${user}'s critical chance has been reseted`);
    }

    private _increaseCritChance(user: string) {
        const critCap = Settings.getSetting("critCap");
        const critChances = Settings.getCritChances();
        const critIncrement = this._getIncrementalCrit();
        if (critChances[user] >= critCap) return;
        critChances[user] += critIncrement;
        Settings.setCritChances(critChances);
        Utils.debug(`${user}'s critical chance has increased to ${critChances[user]}`);
    }

    private _getCurrentThreshold(user: string) {
        const critChances = Settings.getCritChances();
        if (!critChances[user]) {
            critChances[user] = this._getStartingChance();
            Settings.setCritChances(critChances);
        } else return critChances[user];
    }

    private _shouldCrit(user: string): boolean {
        const random = Math.floor(Math.random() * 101);
        const currentThreshold = this._getCurrentThreshold(user);
        Utils.debug(`${user}'s current critical threshold is ${currentThreshold}`);
        return random < currentThreshold;

    }

    private _parseRolls(rolls: any, user: string) {
        let updatedTotal = 0;
        rolls.terms.forEach((roll) => {
            if (roll.faces !== 20) return;
            const results = roll.results;
            results.forEach((result) => {
                if (this._shouldCrit(user)) {
                    updatedTotal += 20 - result.result;
                    result.result = 20;
                    Utils.debug(`This roll has been modified`);
                }
                if (result.result === 20) this._resetCritChange(user);
                else this._increaseCritChance(user);

            })
        })
        rolls.total += updatedTotal;
        return JSON.stringify(rolls);
    }

    public preCreateChatMessage(message: any) {
        if (!message) return;
        try {
            const rollJson = JSON.parse(message.roll);
            message.roll = this._parseRolls(rollJson, message.user);
            return message;
        } catch (e) {
            return;
        }

    }

}

export default LuckForRolls.getInstance();