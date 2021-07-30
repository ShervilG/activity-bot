const TASK_CRON_MAP = new Map();
TASK_CRON_MAP.set(
	"CHECK_LAST_MESSAGE" , "* * * * *"
);
TASK_CRON_MAP.set(
	"DELETE_OLD_ACTIVITY_COUNT", "* * * * *"
);

module.exports = TASK_CRON_MAP;