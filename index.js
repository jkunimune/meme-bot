const Discord = require('discord.js'); // imports
const math = require('mathjs');
const auth = require('./auth.json');
const lineReader = require('line-reader');

const client = new Discord.Client(); // Discord client
var isReady = true;

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.isMentioned(client.user) && message.cleanContent.length < 15) {
		console.log('It me!'); // respond to direct mentions with "It me!"
		message.channel.send('It me.');
	}
	playSongs(message);
	makeReferences(message);
	if (message.content.startsWith('$roll') || message.content.startsWith('$2d6'))
		rollADie(message);
});

/**
 * If someone says "beans", play the beans song.
 */
function playSongs(message) {
	songs = [
		['beans', ['bean','spill','eating','fucking insane','life is strange']],
		['mii', ['mii','doot','yumbo','music']],
		['iim', ['justin', 'jason', 'nosaj', 'nitsuj', 'natsuji', 'galactic ketchup', 'kate']],
		['yahaha', ['korok', 'yahaha', 'seed', 'lol', 'hahaha', 'heh', 'lift rock']],
		['heartbreak', ['sad', 'die', 'broken', 'determination', 'rip']],
		['cat', ['feed', 'dying', 'charger', 'hungry', 'cat']],
		['dog', ['dog', 'cute', 'annoying', 'toby fox', 'woof']],
		['noting', ['absolutely noting', 'absolutelynoting', ':noting:']],
		['flowey', ['muaha', 'flowey', 'kill']],
		['aisunao', ['japan', 'naoshima', 'restaurant','aisunao']],
		['hello', ['hello', 'can you hear me', 'are you still there', 'is anyone there']],
	]; // list of songs and triggers

	var content = message.content.toLowerCase();
	songs.forEach(songInfo => {
		const song = songInfo[0];
		const triggers = songInfo[1];
		triggers.forEach(trigger => {
			if (isReady && content.includes(trigger)) { // if someone says a trigger
				var voiceChannel = message.member.voiceChannel; // find the voice channel on which they are
				if (voiceChannel) {
					isReady = false;
					console.log('Playing '+song+'.mp3');
					voiceChannel.join().then(connection => { // join the that channel
						const dispatcher = connection.playFile('./res/'+song+'.mp3'); // and play the song
						dispatcher.on('end', end => { // when it's over
							voiceChannel.leave(); // leave the channel
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

/**
 * If someone says "understand", tell them about how their soul will transform this world.
 */
function makeReferences(message) {
	if (message.member.user.bot)
		return 0; // ignore things I and other bots say

	var saidThing = message.content.toLowerCase().replace(/[.,;:!?-_'"“” ]/g, ''); // remove punctuation

	var matched = false;
	lineReader.eachLine('/home/ubuntu/meme-bot/res/scripts.txt', function(line) { // for each line of the script
		if (matched) { // if the last line was a match
			if (line.length > 1)
				message.channel.send(line); // send a message with this line
			matched = false;
		}
		if (line.length > 1) {
			var quotedThing = line.toLowerCase().replace(/[.,;:!?-_'" ]/g, '');
			if (saidThing == quotedThing || (quotedThing.length >= 7 && saidThing.endsWith(quotedThing))) { // if someone said something that matches this line
				matched = true; // make a note so we can reply with the next line
				console.log('Detected reference to "'+line+'"');
			}
		}
	});
}

/**
 * If someone says "/roll" or something of the sort, return a random number [1, 21)
 */
function rollADie(message) {
	message.channel.send('(die rolling sound)')
	var num = math.randomInt(50);
	var i = 0;
	lineReader.eachLine('/home/ubuntu/meme-bot/res/faces.txt', function(line) { // for each line of the script
		if (i == num)
			message.channel.send(line);
		i ++;
	});
}

client.login(auth.token);
