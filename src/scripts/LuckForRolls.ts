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

    private _getRandomNumber(max: number) {
        return Math.floor(Math.random() * max);
    }

    private _criticalPrevention (rolledValue: number): number {
        const critPrevention = Settings.getSetting("critPrevention");
        const critValue = Settings.getSetting("critValue");

        if (critPrevention && rolledValue === critValue){
            rolledValue = this._getRandomNumber(critValue);
            Utils.debug(`A crit has been prevented`);
        }

        return rolledValue;
    }

    private _transformRollToCrit (rolledValue: number, critChance: number): number {
        const critValue = Settings.getSetting("critValue");
        const allowRange = Settings.getSetting("allowRange");
        const maxRange = Settings.getSetting("rangeMax");

        if (this._shouldCrit(critChance) && (!allowRange || rolledValue <= maxRange)) {
            Utils.debug(`A ${rolledValue} has been modified`);
            rolledValue = critValue;
        }
        return rolledValue
    }

    private _modifyCriticalHit(rolledValue: number, critChance: number): number {
        const critValue = Settings.getSetting("critValue");
        const lowIncrement = Settings.getSetting("lowIncrement");
        const maxRange = Settings.getSetting("rangeMax");

        if (rolledValue === critValue) critChance = this._getStartingChance();
        else if (!lowIncrement || rolledValue <= maxRange) critChance = this._increaseCritChance(critChance);
        return critChance;
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

    private _modifyRolls(rolls: any, user: string) {
        let updatedTotal = 0;
        let critChance = Settings.getCritChances();
        if (!critChance[user]) critChance[user] = this._getStartingChance();
        const observedDie = Settings.getSetting("observedDie");

        rolls.terms.forEach((roll) => {
            if (roll.faces !== observedDie) return;
            const results = roll.results;
            results.forEach((result) => {
                const prePrevention = result.result;
                result.result = this._criticalPrevention(result.result);
                updatedTotal += result.result - prePrevention;

                const preTransform = result.result;
                result.result = this._transformRollToCrit(result.result, critChance[user]);
                updatedTotal += result.result - preTransform;

                critChance[user] = this._modifyCriticalHit(result.result, critChance[user]);
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
            message.roll = this._modifyRolls(rollJson, message.user);
            return message;
        } catch (e) {
            return;
        }
    }

}

export default LuckForRolls.getInstance();