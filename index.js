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
		['heartbreak', ['sad', 'die', 'broken', 'determination', 'rip']],
		['cat', ['feed', 'dying', 'charger', 'hungry', 'cat']],
		['dog', ['dog', 'cute', 'annoying', 'toby fox']],
		['noting', ['absolutely noting', 'absolutelynoting', ':noting:']],
		['aisunao', ['japan', 'naoshima', 'restaurant','aisunao']],
	];
	
	songs.forEach(songInfo => {
		const song = songInfo[0];
		const triggers = songInfo[1];
		triggers.forEach(trigger => {
			if (isReady && content.includes(trigger)) {
				var voiceChannel = message.member.voiceChannel;
				if (voiceChannel) {
					isReady = false;
					console.log('Playing '+song+'.mp3');
					voiceChannel.join().then(connection => {
						const dispatcher = connection.playFile('./res/'+song+'.mp3');
						dispatcher.on('end', end => {
							voiceChannel.leave();
							console.log('Done playing '+song+'.mp3');
							isReady = true;
						});
					}).catch(err => {
						console.log(err)
						isReady = true;
					});
				}
			}
		});
	});
});

client.login(auth.token);
