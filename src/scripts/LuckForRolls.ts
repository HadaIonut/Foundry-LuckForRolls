class LuckForRolls {

    private static _instance: LuckForRolls;

    private constructor() {
    }

    public static getInstance(): LuckForRolls {
        if (!LuckForRolls._instance) LuckForRolls._instance = new LuckForRolls();
        return LuckForRolls._instance;
    }

    public createCritRolls (rolls) {
        rolls.results[0] = 20;
        rolls.terms[0].results[0].result = 20;
        rolls.total = rolls.results.length*20;
        return JSON.stringify(rolls);
    }

    public preCreateChatMessage (message: any) {
        if (!message) return ;
        message.roll = this.createCritRolls(JSON.parse(message.roll));
        console.log(message);
        return message;
    }

}

export default LuckForRolls.getInstance();