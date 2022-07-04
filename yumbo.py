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
	'photograph': ["photograph", "lookatthis", "itmakesmelaugh"],
	'objection':  ["objection", "holdit", "notsofast", "stoprightthere", "lies"],
	'why':        ["why"],
}

load_dotenv()

client = discord.Client()
client.ready_to_play = True

def lev_dist(first, twoth, memo={}):
	if (first, twoth) not in memo:
		if len(first) == 0:
			dist = len(twoth)
		elif len(twoth) == 0:
			dist = len(first)
		elif first[0] == twoth[0]:
			dist = lev_dist(first[1:], twoth[1:])
		else:
			dist = 1 + min(min(
				lev_dist(first[1:], twoth),
				lev_dist(first, twoth[1:])),
				lev_dist(first[1:], twoth[1:]))
		memo[(first, twoth)] = dist
	return memo[(first, twoth)]

@client.event
async def on_ready():
	print("redi!")

@client.event
async def on_message(message):
	if message.author.bot: # don't respond to yourself or other bots
		return
	if message.content.startswith('!'): # and don't fight with Rhythm
		return

	if client.user in message.mentions: # respond to direct messages
		print("le me!")
		await message.channel.send("It me.")

	content = message.content.lower()

	words = content.split() # make combinacion puns
	for i in range(len(words) - 1):
		first, twoth = words[i], words[i+1]
		if re.fullmatch(r'[a-z]+', first) and re.fullmatch(r'[a-z]+', twoth):
			for j in range(1, len(first) - 4):
				if first[j:j+4] in twoth[:-1]:
					portmanto = first[:j] + twoth[twoth.index(first[j:j+4]):]
					if lev_dist(first, portmanto) > 1 and lev_dist(twoth, portmanto) > 0:
						print(f"epick pun detected: {first} + {twoth} = {portmanto}")
						await message.channel.send(f"{portmanto.capitalize()}, if you will.")
						break
					else:
						print(f"passing on {portmanto} because it's too close to its components")

	if content == '$roll' or content == '$2d6': # if someone says "/roll" or something of the sort, return a random number [1, 37)
		await message.channel.send("(sound of rolling dies)")
		with open('./res/faces.txt', 'r') as f:
			faces = [line.strip() for line in f]
			await message.channel.send(random.choice(faces))

	content = re.sub(r'[ .,;:!?\-_/\'"“”]', '', content)

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
						break

	with open('./res/scripts.txt', 'r') as f: # if someone says "understand", tell them about how heir soul will transform this world
		matched, groups = False, []
		for line in f: # look thru the scripts
			line = line.strip()
			if matched: # if the last line was a match
				if len(line) > 0:
					for i, group in enumerate(groups): # fill in any groups from that match
						line = line.replace(f'${i + 1}', group)
					await message.channel.send(line) # and send this one
				break
			elif len(line) > 0:
				bare_line = re.sub(r'[.,;:!?-_\'’"“”* ]', '', line.lower())
				if content == bare_line or (len(bare_line) >= 7 and content.endswith(bare_line)): # if this line matches normally
					matched = True # mark it
					groups = []
					print('sensa retrologe da "{}"'.format(line))
				elif line.startswith('/') and line.endswith('/')
					bare_line = re.sub(r'[.,;:!?-_\'’“”*]', '', line[1:-1])
					match = re.search(bare_line, content, re.IGNORECASE) # if this line matches via regex
					if match:
						matched = True
						groups = line_match.groups() # mark it and save the groops
						print('sensa retrologe da "{}"'.format(line))

	if content == 'rip':
		await message.add_reaction('🇫')
	if 'long long' in content or re.match(r'loo+ng', content):
		await message.add_reaction('🎷')

client.run(os.getenv('TOKEN'))
