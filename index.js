const Discord = require('discord.js');
const auth = require('./auth.json');
const client = new Discord.Client();
var isReady = true;

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	playSongs(message);
	makeReferences(message);
});

function playSongs(message) {
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
	
	content = message.content.toLowerCase();
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
}

function makeReferences(content) {
	saidThing = message.content.toLowerCase();
	saidThing = saidThing.replace('!','').replace(',','').replace('?','').replace('.','').replace('\'','').replace(' ','').replace('_','').replace('-','');
	var reader = new FileReader();
	reader.onload = function(progressEvent) {
		var lines = this.result.split('\n');
		for (var line = 0; line < lines.length; line ++) {
			if (lines[line].length > 0) {
				quotedThing = lines[line].toLowerCase();
				quotedThing = quotedThing.replace('!','').replace(',','').replace('?','').replace('.','').replace('\'','').replace(' ','').replace('_','').replace('-','');
				if (saidThing.endswith(quotedThing) && lines[line+1].length > 0)
					message.channel.send(lines[line+1]);
			}
		}
	};
	reader.readAsText(file);
}

client.login(auth.token);
