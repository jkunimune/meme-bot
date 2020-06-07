import os
import random
from dotenv import load_dotenv
import discord

SONGS = {
	'beans': ["bean", "spill", "eating", "fuckinginsane", "lifeisstrange"],
	'mii':   ["mii", "doot", "yumbo", "music"],
	'iim':   ["justin", "jason", "nosaj", "nitsuj", "natsuji", "galacticketchup", "kate"],
	'yahaha':["korok", "yahaha", "seed", "lol", "hahaha", "heh", "liftrock"],
	'heartbreak': ["sad", "death", "broken", "determination", "rip"],
	'cat':        ["feed", "dying", "charger", "hungry", "cat"],
	'dog':        ["dog", "cute", "annoying", "tobyfox", "woof"],
	'noting':     ["noting"],
	'laugh':      ["muaha", "flowey", "kill"],
	'aisunao':    ["japan", "naoshima", "restaurant", "aisunao"],
	'hello':      ["hello", "hearme", "hearyou", "youstillthere", "anyonethere"],
}

load_dotenv()

client = discord.Client()

@client.event
async def on_ready():
	print("redi!")

@client.event
async def on_message(message):
	if message.author == client.user: # don't respond to yourself
		return

	if client.user in message.mentions.users: # respond to direct messages
		print("le me!")
		message.channel.send("It me.")

	content = re.sub(r'[.,;:!?-_\'"“” ]', '', message.content.lower())

	for song, triggers in SONGS.values(): # if someone says "beans", play the beans song
		for trigger in triggers:
			if isReady and trigger in content:
				voiceChannel = message.member.voice.channel
				if voiceChannel is not None:
					isReady = False
					print("zayo sonda {}.mp3".format(song))
					voiceChannel.join()
					voiceChannel.play('./res/{}.mp3'.format(song))
					print("lewo sonda {}.mp3".format(song))
					voiceChannel.leave()
					isReady = True

	with open('./res/scripts.txt', 'r') as f: # if someone says "understand", tell them about how heir soul will transform this world
		matched = False
		for line in f:
			if matched: # if the last line was a match
				if len(line) > 1:
					message.channel.send(line)
				break
			elif len(line) > 1:
				quote = re.sub(r'[.,;:!?-_\'"“” ]', '', line.content.lower())
				if content == quote or (len(line) >= 7 and quote.endswith(line)):
					matched = True
					print('sensa retrologe da "{}"'.format(line))

	if content == '$roll' or content == '$2d6': # if someone says "/roll" or something of the sort, return a random number [1, 37)
		message.channel.send("(sound of rolling dies)")
		with open('./res/faces.txt', 'r') as f:
			faces = [line.strip() for line in f]
			message.channel.send(random.choice(faces))

client.run(os.getenv('TOKEN'))
