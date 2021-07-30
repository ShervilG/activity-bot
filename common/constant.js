// Populate cron map
let cronMap = new Map();
cronMap.set(
	"CHECK_LAST_MESSAGE" , "* * * * *"
);
cronMap.set(
	"DELETE_OLD_ACTIVITY_COUNT", "* * * * *"
);

// Populate channel map
const channelMap = new Map();
channelMap.set(
	"bot-tests", "866237805020839946"
);

const Constant = {
    COMMAND_PREFIX: "--",
    BORED_MESSAGES: [
        "Knock Knock ! Anyone here ?",
        "Casually Moans*",
        "Jaagte raho !!"
    ],
    TASK_CRON_MAP: cronMap,
    THREE_HOUR_DIFF: (3 * 60 * 60 * 1000),
    ONE_MINUTE_DIFF: (1 * 60 * 1000),
    CHANNEL_MAP: channelMap

};

module.exports = Constant;
