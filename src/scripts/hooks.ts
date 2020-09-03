import LuckForRolls from "./LuckForRolls";
import Settings from "./Settings";

Hooks.on("init", Settings.registerSettings.bind(Settings));

Hooks.on('preCreateChatMessage', LuckForRolls.preCreateChatMessage.bind(LuckForRolls));