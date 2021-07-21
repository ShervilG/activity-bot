/*----------------------------Imports---------------------------------------------------------*/

const Discord = require("discord.js");
const cron = require("node-cron");
const dotenv = require("dotenv");

/*----------------------------Constants-------------------------------------------------------*/

const client = new Discord.Client();
const COMMAND_PREFIX = "--";
let CLIENT_TOKEN = process.env.TOKEN;
if (CLIENT_TOKEN === undefined) {
	dotenv.config();
	CLIENT_TOKEN = process.env.TOKEN;
}
const BORED_MESSAGES = [
	"Knock Knock ! Anyone here ?",
	"Casually Moans*",
	"Jaagte raho !!"
];

const TASK_CRON_MAP = new Map();
TASK_CRON_MAP.set(
	"CHECK_LAST_MESSAGE" , "* * * * *"
);

const CHANNEL_MAP = new Map();
CHANNEL_MAP.set(
	"bot-tests", "866237805020839946"
);

const THREE_HOUR_DIFF = (3 * 60 * 60 * 1000);
const ONE_MINUTE_DIFF = (1 * 60 * 1000);

/*----------------------------Important Variables---------------------------------------------*/

let channels = null;
let server = null;

/*----------------------------Helper Methods--------------------------------------------------*/

const getRandomBoredMessage = () => {
	let randomIndex = parseInt(BORED_MESSAGES.length * Math.random());
	return BORED_MESSAGES[randomIndex];
}

const handleCommands = (message) => {
	let command = message.content.split(COMMAND_PREFIX)[1];
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
	const test_chanel = client.channels.fetch(CHANNEL_MAP.get("bot-tests"));
	test_chanel.then((channel) => {
		channel.send("Imma alive !");
	}).catch((error) => {
		console.log('could not find channel by id : ' + CHANNEL_MAP.get("bot-tests"));
	});
});

client.on('message', (message) => {
	if (message.author == client.user || !message.content.startsWith(COMMAND_PREFIX)) {
		return;
	}
	handleCommands(message);
});


client.login(CLIENT_TOKEN);

/*----------------------------Scheduled Tasks-------------------------------------------------*/

cron.schedule(TASK_CRON_MAP.get('CHECK_LAST_MESSAGE').toString(), () => {
	console.log('Check last message cron job running ->');
	CHANNEL_MAP.forEach((channelId, channelName) => {
		let channelPromise = client.channels.fetch(channelId);
		channelPromise.then((channel) => {
			getLatestMessageFromChannel(channel).then((message) => {
				console.log('last message : ' + message.content);
				if (Date.parse(message.createdAt) <= Date.now() - THREE_HOUR_DIFF) {
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