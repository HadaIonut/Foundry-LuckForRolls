import LuckForRolls from "./LuckForRolls";

Hooks.on('preCreateChatMessage', LuckForRolls.preCreateChatMessage.bind(LuckForRolls));