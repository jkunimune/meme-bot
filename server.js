// server.js
// where your node app starts

const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const Discord = require('discord.js'); // imports
const math = require('mathjs');
const lineReader = require('line-reader');
const client = new Discord.Client(); // Discord client
var isReady = true;

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.mentions.users.has(client.user)) {
		console.log('It me!'); // respond to direct mentions with "It me!"
		message.channel.send('It me.'); // this doesnt work, but I don't care enough to find a non-obnoxious way to search a Map's values
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
	const songs = [
		['beans', ['bean','spill','eating','fucking insane','life is strange']],
		['mii', ['mii','doot','yumbo','music']],
		['iim', ['justin', 'jason', 'nosaj', 'nitsuj', 'natsuji', 'galactic ketchup', 'kate']],
		['yahaha', ['korok', 'yahaha', 'seed', 'lol', 'hahaha', 'heh', 'lift rock']],
		['heartbreak', ['sad', 'die', 'broken', 'determination', 'rip']],
		['cat', ['feed', 'dying', 'charger', 'hungry', 'cat']],
		['dog', ['dog', 'cute', 'annoying', 'toby fox', 'woof']],
		['noting', ['absolutely noting', 'absolutelynoting', ':noting:']],
		['laugh', ['muaha', 'flowey', 'kill']],
		['aisunao', ['japan', 'naoshima', 'restaurant','aisunao']],
		['hello', ['hello', 'can you hear me', 'are you still there', 'is anyone there']],
	]; // list of songs and triggers
  const urls = {
    'aisunao':    "aisunao.mp3?v=1591189250649",
    'beans':      "beans.mp3?v=1591189264539",
    'cat':        "cat.mp3?v=1591189268209",
    'dog':        "dog.mp3?v=1591189270581",
    'heartbreak': "heartbreak.mp3?v=1591189273653",
    'hello':      "hello.mp3?v=1591189276620",
    'iim':        "iim.mp3?v=1591189280104",
    'laugh':      "laugh.mp3?v=1591189282924",
    'mii':        "mii.mp3?v=1591189287522",
    'noting':     "noting.mp3?v=1591189292120",
    'undertale':  "undertale.mp3?v=1591189296609",
    'wheredidyougo': "wheredidyougo.mp3?v=1591189300775",
    'yahaha':     "yahaha.mp3?v=1591189304364"
  };

	var content = message.content.toLowerCase();
	songs.forEach(songInfo => {
		const song = songInfo[0];
		const triggers = songInfo[1];
		triggers.forEach(trigger => {
			if (isReady && content.includes(trigger)) { // if someone says a trigger
				var voiceChannel = message.member.voice.channel; // find the voice channel on which they are
				if (voiceChannel) {
					isReady = false;
					console.log('Playing '+song+'.mp3');
					voiceChannel.join().then(connection => { // join the that channel
						connection.play('https://cdn.glitch.com/caa03758-39d9-48f5-830a-9a9fcd91a964%2F'+urls[song]).on('finish', () => { // and play the song
							voiceChannel.leave(); // when it's over, leave the channel
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
	if (message.author.bot)
		return 0; // ignore things I and other bots say

	const saidThing = message.content.toLowerCase().replace(/[.,;:!?-_'"“” ]/g, ''); // remove punctuation

	let matched = false;
	lineReader.eachLine('./res/scripts.txt', function(line) { // for each line of the script
    if (matched) { // if the last line was a match
			if (line.length > 1)
				message.channel.send(line); // send a message with this line
			matched = false;
		}
		if (line.length > 1) {
			const quotedThing = line.toLowerCase().replace(/[.,;:!?-_'" ]/g, '');
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

client.login(process.env.TOKEN);
