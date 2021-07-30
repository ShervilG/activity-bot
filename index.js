/*----------------------------Imports---------------------------------------------------------*/

const Constant = require('./common/constant');
const Discord = require("discord.js");
const cron = require("node-cron");
const dotenv = require("dotenv");
const activityCountData = require('./activity-count.json');
const fileHelper = require('./helper/file-helper');
const couponService = require('./service/coupon-service');

/*----------------------------Constants-------------------------------------------------------*/

const client = new Discord.Client();

let CLIENT_TOKEN = process.env.TOKEN;
if (CLIENT_TOKEN === undefined) {
	dotenv.config();
	CLIENT_TOKEN = process.env.TOKEN;
}

const activityMap = new Map(Object.entries(activityCountData));

/*----------------------------Important Variables---------------------------------------------*/

let channels = null;
let server = null;

/*----------------------------Helper Methods--------------------------------------------------*/

const getRandomBoredMessage = () => {
	let randomIndex = parseInt(Constant.BORED_MESSAGES.length * Math.random());
	return Constant.BORED_MESSAGES[randomIndex];
}

const handleCommands = (message) => {
	console.log(message.author);
	let command = message.content.split(Constant.COMMAND_PREFIX)[1];
	console.log(command);
	switch (command) {
		case "ping":
			message.channel.send("pong !");
			break;
		default:
			message.channel.send(";__; wtf");
			break;
	}
}

const getLatestMessageFromChannel = async(channel) => {
	let messages = await channel.messages.fetch({limit : 1});
	return messages.first();
}

/*----------------------------Main Logic------------------------------------------------------*/

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	const test_chanel = client.channels.fetch(Constant.CHANNEL_MAP.get("bot-tests"));
	test_chanel.then((channel) => {
		channel.send("Imma alive !");
	}).catch((error) => {
		console.log('could not find channel by id : ' + Constant.CHANNEL_MAP.get("bot-tests"));
	});
});

client.on('message', (message) => {
	if (message.author == client.user || !message.content.startsWith(Constant.COMMAND_PREFIX)) {
		return;
	}
	handleCommands(message);
});

client.login(CLIENT_TOKEN);

/*----------------------------Scheduled Tasks-------------------------------------------------*/

cron.schedule(Constant.TASK_CRON_MAP.get('CHECK_LAST_MESSAGE').toString(), () => {
	console.log('Check last message cron job running ->');
	Constant.CHANNEL_MAP.forEach((channelId, channelName) => {
		let channelPromise = client.channels.fetch(channelId);
		channelPromise.then((channel) => {
			getLatestMessageFromChannel(channel).then((message) => {
				console.log('last message : ' + message.content);
				if (Date.parse(message.createdAt) <= Date.now() - Constant.THREE_HOUR_DIFF) {
					channel.send(getRandomBoredMessage());
				}
			}).catch((error) => {
				console.log('error : ' + error);
			});
		}).catch((error) => {
			console.log('could not find channel : ' + channelName);
		});
	});
});

cron.schedule(Constant.TASK_CRON_MAP.get('DELETE_OLD_ACTIVITY_COUNT').toString(), () => {
	console.log('Delete old activity count cron job running ->');
	couponService.disburseCouponToMostActiveUser(client, activityMap).then((data) => {
		//fileHelper.writeDataToFileSync({}, '../activity-count.json');
	}).catch((error) => {
		console.log("Error " + error + " while deleting old activity count !");
	});
	
});