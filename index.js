const Discord = require('discord.js');
const auth = require('./auth.json');
const client = new Discord.Client();
var isReady = true;

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	content = message.content.toLowerCase();
	
	if (isReady && (content.includes('bean') || content.includes('spill') || content.includes('eat') || content.includes('life is strange'))) {
		isReady = false;
		var voiceChannel = message.member.voiceChannel;
		voiceChannel.join().then(connection => {
			const dispatcher = connection.playFile('./res/beans.mp3');
			dispatcher.on("end", end => {voiceChannel.leave()});
		}).catch(err => console.log(err));
		isReady = true;
	}
});

client.login(auth.token);
