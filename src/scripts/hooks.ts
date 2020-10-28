import LuckForRolls from "./LuckForRolls";
import Settings from "./Settings";
import {evaluate} from "./DiceEvaluateHijack";


Hooks.on("init", () => {
    Settings.registerSettings()
    LuckForRolls.modifyRolls.bind(LuckForRolls);
    // @ts-ignore
    DiceTerm.prototype.evaluate = evaluate;
});

//Hooks.on('preCreateChatMessage', LuckForRolls.preCreateChatMessage.bind(LuckForRolls));