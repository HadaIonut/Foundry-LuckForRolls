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
        Utils.debug(`Critical chance has been reset`);
        return Settings.getSetting("defaultCritChance");
    }

    private _getIncrementalCrit() {
        return Settings.getSetting("incrementalCritValue");
    }

    private _increaseCritChance(critChance: number) {
        const critCap = Settings.getSetting("critCap");
        const critIncrement = this._getIncrementalCrit();
        if (critChance >= critCap) return critChance;
        critChance += critIncrement;
        Utils.debug(`Critical chance has increased to ${critChance}`);
        return critChance;
    }

    private _shouldCrit(critChance: number): boolean {
        const random = Math.floor(Math.random() * 101);
        Utils.debug(`The current critical chance is ${critChance}`);
        return random < critChance;
    }

    private _parseRolls(rolls: any, user: string) {
        let updatedTotal = 0;
        let critChance = Settings.getCritChances();
        if (!critChance[user]) critChance[user] = this._getStartingChance();
        const observedDie = Settings.getSetting("observedDie");
        const critValue = Settings.getSetting("critValue");

        rolls.terms.forEach((roll) => {
            if (roll.faces !== observedDie) return;
            const results = roll.results;
            results.forEach((result) => {
                if (this._shouldCrit(critChance[user])) {
                    updatedTotal += critValue - result.result;
                    result.result = critValue;
                    Utils.debug(`This roll has been modified`);
                }
                if (result.result === critValue) critChance[user] = this._getStartingChance();
                else critChance[user] = this._increaseCritChance(critChance[user]);
            })
        })

        Settings.setCritChances(critChance);
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