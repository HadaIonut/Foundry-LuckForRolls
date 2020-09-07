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

    /**
     * Returns the starting critical chance from the user settings
     *
     * @private
     */
    private _getStartingChance() {
        Utils.debug(`Critical chance has been reset`);
        return Settings.getSetting("defaultCritChance");
    }

    /**
     * Returns the incremental value of the crit chance
     *
     * @private
     */
    private _getIncrementalCrit() {
        return Settings.getSetting("incrementalCritValue");
    }

    /**
     * Returns a random number up to a max value
     *
     * @param max - the maximum value that can be generated by the random function
     * @private
     */
    private _getRandomNumber(max: number) {
        return Math.floor(Math.random() * max);
    }

    /**
     * Prevents critical hits rolled by the Foundry RNG and not by this module's RNG
     *
     * @param rolledValue - the value of the roll
     * @private
     */
    private _criticalPrevention (rolledValue: number): number {
        const critPrevention = Settings.getSetting("critPrevention");
        const critValue = Settings.getSetting("critValue");

        if (critPrevention && rolledValue === critValue){
            rolledValue = this._getRandomNumber(critValue);
            Utils.debug(`A crit has been prevented`);
        }

        return rolledValue;
    }

    /**
     * Modifies the rolledValue based on the user settings and the random number generated
     *
     * @param rolledValue - the value rolled that is to be modified
     * @param critChance - the chance for a roll to be modified into a crit
     * @private
     */
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

    /**
     * Decides which way to modify the critical hit chance based on the roll value
     * @example if rolledValue:20 and critChance:20 => critChance = defaultCrit
     *
     * @param rolledValue
     * @param critChance
     * @private
     */
    private _modifyCriticalHit(rolledValue: number, critChance: number): number {
        const critValue = Settings.getSetting("critValue");
        const lowIncrement = Settings.getSetting("lowIncrement");
        const maxRange = Settings.getSetting("rangeMax");

        if (rolledValue === critValue) critChance = this._getStartingChance();
        else if (!lowIncrement || rolledValue <= maxRange) critChance = this._increaseCritChance(critChance);
        return critChance;
    }

    /**
     * Increases crit chance by the increment used in settings
     *
     * @param critChance - current crit chance
     * @private
     */
    private _increaseCritChance(critChance: number) {
        const critCap = Settings.getSetting("critCap");
        const critIncrement = this._getIncrementalCrit();
        if (critChance >= critCap) return critChance;
        critChance += critIncrement;
        Utils.debug(`Critical chance has increased to ${critChance}`);
        return critChance;
    }

    /**
     * Returns true or false if the randomly generated number is bellow the crit chance
     *
     * @param critChance - current critical chance
     * @private
     */
    private _shouldCrit(critChance: number): boolean {
        const random = Math.floor(Math.random() * 101);
        Utils.debug(`The current critical chance is ${critChance}`);
        return random < critChance;
    }

    /**
     * Modifies all the rolls
     *
     * @param rolls - the message.rolls element of the message structure
     * @param user - owner of the message
     * @private
     */
    private _modifyRolls(rolls: any, user: string) {
        let updatedTotal = 0;
        let critChance = Settings.getCritChances();
        if (!critChance[user]) critChance[user] = this._getStartingChance();
        const observedDie = Settings.getSetting("observedDie");

        rolls.terms.forEach((roll) => {
            if (roll.faces !== observedDie) return;
            const results = roll.results;
            results.forEach((result) => {
                //Applies crit prevention
                const prePrevention = result.result;
                result.result = this._criticalPrevention(result.result);
                updatedTotal += result.result - prePrevention;

                //Applies general transformation to rolls
                const preTransform = result.result;
                result.result = this._transformRollToCrit(result.result, critChance[user]);
                updatedTotal += result.result - preTransform;

                //Modifies critical chance
                critChance[user] = this._modifyCriticalHit(result.result, critChance[user]);
            })
        })

        Settings.setCritChances(critChance);
        rolls.total += updatedTotal;
        return JSON.stringify(rolls);
    }

    /**
     * Receives the message and starts the modification process if it is possible
     *
     * @param message - the message structure
     */
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