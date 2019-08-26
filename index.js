const Discord = require('discord.js');
const auth = require('./auth.json');
const lineReader = require('line-reader');

const client = new Discord.Client();
var isReady = true;

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.isMentioned(client.user) && message.cleanContent.length < 9) {
		console.log('It me!');
		message.channel.send('It me.');
	}
	playSongs(message);
	makeReferences(message);
});

function playSongs(message) {
	songs = [
		['beans', ['bean','spill','eat','fucking insane','life is strange']],
		['mii', ['mii','doot','yumbo','music']],
		['iim', ['justin', 'jason', 'nosaj', 'nitsuj', 'natsuji', 'galactic ketchup']],
		['yahaha', ['korok', 'yahaha', 'seed', 'lol']],
		['heartbreak', ['sad', 'die', 'broken', 'determination', 'rip']],
		['cat', ['feed', 'dying', 'charger', 'hungry', 'cat']],
		['dog', ['dog', 'cute', 'annoying', 'toby fox']],
		['noting', ['absolutely noting', 'absolutelynoting', ':noting:']],
		['flowey', ['muaha', 'flowey', 'kill']],
		['aisunao', ['japan', 'naoshima', 'restaurant','aisunao']],
	];

	var content = message.content.toLowerCase();
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
						console.log(err);
						isReady = true;
					});
				}
			}
		});
	});
}

function makeReferences(message) {
	if (message.member.user.bot)
		return 0; // ignore things I and other bots say

	var saidThing = message.content.toLowerCase();
	saidThing = saidThing.replace('!','').replace(',','').replace('?','').replace('.','').replace('\'','').replace(' ','').replace('_','').replace('-','');
	console.log(saidThing);

	var matched = false;
	lineReader.eachLine('/home/ubuntu/meme-bot/res/scripts.txt', function(line) {
		if (matched) {
			if (line.length > 1)
				message.channel.send(line);
			matched = false;
		}
		if (line.length > 1) {
			var quotedThing = line.toLowerCase();
			quotedThing = quotedThing.replace('!','').replace(',','').replace('?','').replace('.','').replace('\'','').replace(' ','').replace('_','').replace('-','');
			if (saidThing == quotedThing || (quotedThing.length >= 10 && saidThing.endsWith(quotedThing))) {
				matched = true;
				console.log('Detected reference to "'+line+'"');
			}
		}
	});
}

client.login(auth.token);
