const Discord = require('discord.js');
const auth = require('./auth.json');
const client = new Discord.Client();
var isReady = true;

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	content = message.content.toLowerCase();
	
	songs = [
		['beans', ['bean','spill','eat','fucking insane','life is strange']],
		['mii', ['mii','doot','yumbo','music']],
		['iim', ['justin', 'jason', 'nosaj', 'nitsuj', 'natsuji', 'galactic ketchup']],
		['yahaha', ['korok', 'yahaha', 'seed', 'ha']],
		['heartbreak', ['sad', 'die', 'broken', 'determination']],
		['cat', ['feed', 'dying', 'charger', 'hungry']],
		['dog', ['dog', 'cute', 'annoying', 'toby fox']],
	];
	
	songs.forEach(songInfo => {
		const song = songInfo[0];
		const triggers = songInfo[1];
		triggers.forEach(trigger => {
			if (isReady && content.includes(trigger)) {
				isReady = false;
				var voiceChannel = message.member.voiceChannel;
				voiceChannel.join().then(connection => {
					const dispatcher = connection.playFile('./res/'+song+'.mp3');
					dispatcher.on('end', end => {
						voiceChannel.leave();
						isReady = true;
					});
				}).catch(err => console.log(err));
			}
		});
	});
});

client.login(auth.token);
