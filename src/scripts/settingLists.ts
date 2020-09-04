export default {
    SETTINGS: [
        {
            key: "critChances",
            data: {
                type: String,
                default: "{}",
                scope: "world",
                config: false,
                restricted: true,
            },
        },
        {
            key: "defaultCritChance",
            data: {
                name: "Starting Chance for Critical Hits:",
                hint: "The initial chance for a critical roll.",
                type: Number,
                default: 5,
                scope: "world",
                config: true,
                restricted: true,
            },
        },
        {
            key: "incrementalCritValue",
            data: {
                name: "Value to Increase Critical Chance:",
                hint: "Number to increase the critical chance after each non-crit roll.",
                type: Number,
                default: 1,
                scope: "world",
                config: true,
                restricted: true,
            },
        },
        {
            key: "critCap",
            data: {
                name: "Maximum Critical Chance:",
                hint: "The maximum critical chance (set this to 100 if you don't want a cap).",
                type: Number,
                default: 30,
                scope: "world",
                config: true,
                restricted: true,
            },
        },
        {
            key: "observedDie",
            data: {
                name: "Dice to Observe:",
                hint: "Number of faces of the die to have luck added to.",
                type: Number,
                default: 20,
                scope: "world",
                config: true,
                restricted: true,
            },
        },
        {
            key: "critValue",
            data: {
                name: "Number Considered a Critical Hit:",
                hint: "Number that is considered a critical humber.",
                type: Number,
                default: 20,
                scope: "world",
                config: true,
                restricted: true,
            },
        },
        {
            key: "allowRange",
            data: {
                name: "Enable luck only for low rolls:",
                hint: "Check this box if you want only low rolls to have a chance to be replaced.",
                type: Boolean,
                default: false,
                scope: "world",
                config: true,
                restricted: true,
            },
        },
        {
            key: "rangeMax",
            data: {
                name: "Highest value that should be replaced:",
                hint: "If the above box is checked this number represents the highest number that should be considered a \"low roll\".",
                type: Number,
                default: 10,
                scope: "world",
                config: true,
                restricted: true,
            },
        },
        {
            key: "lowIncrement",
            data: {
                name: "Only Low Rolls Increase Critical Chance: ",
                hint: "Check this box if you want only low rolls increase critical chance.",
                type: Boolean,
                default: false,
                scope: "world",
                config: true,
                restricted: true,
            },
        },
        {
            key: "critPrevention",
            data: {
                name: "Removes the chance for critical rolls to happen independent of the luck algorithm: ",
                hint: "Check this box if you want the chance for critical rolls to be determined only by the current crit chance.",
                type: Boolean,
                default: false,
                scope: "world",
                config: true,
                restricted: true,
            },
        }
    ]
}