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
                type: Number,
                default: 1,
                scope: "world",
                config: true,
                restricted: true,
            },
        }
    ]
}