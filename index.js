/*----------------------------Imports---------------------------------------------------------*/

const Discord = require("discord.js");
const cron = require("node-cron");
const dotenv = require("dotenv");

/*----------------------------Constants-------------------------------------------------------*/

const client = new Discord.Client();
let CLIENT_TOKEN = process.env.TOKEN;
if (CLIENT_TOKEN === undefined) {
	dotenv.config();
	CLIENT_TOKEN = process.env.TOKEN;
}
const BORED_MESSAGES = [
	"Knock Knock ! Anyone here ?",
	"Casually Moans*"
];
const TASK_CRON_MAP = new Map();
TASK_CRON_MAP.set(
	"CHECK_LAST_MESSAGE" , "* * * * *"
);

/*----------------------------Important Variables---------------------------------------------*/

let channels = null;
let server = null;

/*----------------------------Helper Methods--------------------------------------------------*/

const getAllChannels = (channels) => {
	let channelMap = channels.cache;
	channelMap.forEach((key, value) => {
		console.log(key);
	});	
}

const getRandomBoredMessage = () => {
	let randomIndex = parseInt(BORED_MESSAGES.length * Math.random());
	return BORED_MESSAGES[randomIndex];
}

/*----------------------------Main Logic------------------------------------------------------*/

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	channels = client.channels;
	getAllChannels(channels);
});



client.login(CLIENT_TOKEN);

/*----------------------------Scheduled Tasks-------------------------------------------------*/

cron.schedule(TASK_CRON_MAP.get('CHECK_LAST_MESSAGE').toString(), () => {
	console.log('cron job running');
});