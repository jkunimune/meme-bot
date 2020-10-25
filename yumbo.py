import asyncio
import os
import random
import re
from dotenv import load_dotenv
import discord

SONGS = {
	'beans':      ["bean", "spill", "eating", "fuckinginsane", "lifeisstrange"],
	'mii':        ["mii", "doot", "yumbo", "music"],
	'iim':        ["justin", "jason", "nosaj", "nitsuj", "natsuji", "galacticketchup", "kate"],
	'yahaha':     ["korok", "yahaha", "seed", "lol", "hahaha", "heh", "liftrock"],
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
client.ready_to_play = True

@client.event
async def on_ready():
	print("redi!")

@client.event
async def on_message(message):
	if message.author == client.user: # don't respond to yourself
		return
	if message.content.startswith('!'): # and don't fight with Rhythm
		return

	if client.user in message.mentions: # respond to direct messages
		print("le me!")
		await message.channel.send("It me.")

	content = re.sub(r'[.,;:!?-_\'"“” ]', '', message.content.lower())

	for song, triggers in SONGS.items(): # if someone says "beans", play the beans song
		for trigger in triggers:
			if client.ready_to_play and trigger in content:
				if message.author.voice is not None and message.author.voice.channel is not None:
					voice_channel = message.author.voice.channel
					if voice_channel is not None:
						client.ready_to_play = False
						print("zayo sonda {}.mp3".format(song))
						voice_client = await voice_channel.connect()
						voice_client.play(discord.FFmpegPCMAudio('./res/{}.mp3'.format(song)))
						while voice_client.is_playing():
							await asyncio.sleep(1)
						await voice_client.disconnect()
						print("lewo sonda {}.mp3".format(song))
						client.ready_to_play = True

	with open('./res/scripts.txt', 'r') as f: # if someone says "understand", tell them about how heir soul will transform this world
		matched = False
		for line in f:
			if matched: # if the last line was a match
				if len(line) > 1:
					await message.channel.send(line)
				break
			elif len(line) > 1:
				quote = re.sub(r'[.,;:!?-_\'"“” ]', '', line.strip().lower())
				if content == quote or (len(quote) >= 7 and content.endswith(quote)):
					matched = True
					print('sensa retrologe da "{}"'.format(line.strip()))

	if content == '$roll' or content == '$2d6': # if someone says "/roll" or something of the sort, return a random number [1, 37)
		await message.channel.send("(sound of rolling dies)")
		with open('./res/faces.txt', 'r') as f:
			faces = [line.strip() for line in f]
			await message.channel.send(random.choice(faces))

client.run(os.getenv('TOKEN'))
