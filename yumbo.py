import asyncio
import os
import random
import re
from dotenv import load_dotenv
import discord

PORTMANTO_BAR = 3
SONGS = {
	'beans':      ["bean", "spill", "eating", "fucking insane", "life is strange"],
	'mii':        ["mii", "doot", "yumbo", "music"],
	'iim':        ["justin", "jason", "nosaj", "nitsuj", "natsuji", "galactic ketchup", "kate"],
	'yahaha':     ["korok", "yahaha", "seed", "lol", "heh", "lift rock"],
	'heartbreak': ["sad", "death", "broken", "determination", "rip"],
	'cat':        ["feed", "dying", "charger", "hungry", "cat"],
	'dog':        ["dog", "cute", "annoying", "toby fox", "woof"],
	'noting':     ["noting"],
	'laugh':      ["muaha", "flowey", "kill"],
	'aisunao':    ["japan", "naoshima", "restaurant", "aisunao"],
	'hello':      ["hello", "hear me", "hear you", "you still there", "anyone there"],
	'photograph': ["photograph", "look at this", "it makes me laugh"],
	'objection':  ["objection", "hold it", "not so fast", "stop right there", "lies"],
	'why':        ["why"],
}
REACTIONS = {
	r'\br\.?i\.?p\b': '🇫',
	r'long\s?long': '🎷',
	r'loo+ng': '🎷',
}

load_dotenv()

client = discord.Client()
client.ready_to_play = True
client.blacklist = []

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

def no_double_consonants(s):
	for k in range(0, len(s) - 1):
		if s[k] == s[k + 1] and s[k] not in "aeiouy":
			return False
	return True

@client.event
async def on_ready():
	print("junbe!")

@client.event
async def on_message(message):
	if message.author.bot: # don't respond to yourself or other bots
		return
	if message.content.startswith('!'): # and don't fight with Rhythm
		return

	if client.user in message.mentions: # respond to direct messages
		print("go ga mi!")
		await message.channel.send("It me.")

	content = message.content

	words = content.lower().split() # make combinacion puns
	for i in range(max(0, len(words) - 16), len(words) - 1): # if it's near the end of the message
		first, twoth = words[i], words[i+1]
		if re.fullmatch(r'[a-z]+', first) and re.fullmatch(r'[a-z]+', twoth): # and both components are purely alphabetical
			for j in range(1, len(first) - PORTMANTO_BAR):
				if first[j:j + PORTMANTO_BAR] in twoth: # and you sense a portman
					portmanto = first[:j] + twoth[twoth.index(first[j:j + PORTMANTO_BAR]):]
					if (len(portmanto) >= len(first) or len(portmanto) >= len(twoth)) and \
						no_double_consonants(first[j:j + PORTMANTO_BAR]): # and there are no double letters in the shared part
						if portmanto not in first and portmanto not in twoth and \
								lev_dist(first, portmanto) > 1 and lev_dist(twoth, portmanto) > 0: # and it's sufficiently distant from its components
							print(f"epick pun detected: {first} + {twoth} = {portmanto}")
							if random.random() < 1/3:
								await message.channel.send(f"{portmanto.capitalize()}, if you will.")
							break

	if content == '$roll' or content == '$2d6': # if someone says "/roll" or something of the sort, return a random number [1, 37)
		await message.channel.send("(sound of rolling dies)")
		with open('./res/faces.txt', 'r') as f:
			faces = [line.strip() for line in f]
		await message.channel.send(random.choice(faces))

	elif content == '$line': # if someone asks for a line, give them one
		with open('./res/lines.txt', 'r') as f:
			lines = {line.strip() for line in f}
		for line in client.blacklist:
			lines.remove(line) # make sure it's not one that's come up recently
		choice = random.choice(list(lines))
		client.blacklist.append(choice)
		if len(client.blacklist) > 18:
			client.blacklist = client.blacklist[1:]
		await message.channel.send(f"||{choice}||")

	with open('./res/scripts.txt', 'r') as f: # if someone says "understand", tell them about how heir soul will transform this world
		matched, groups = False, []
		for line in f: # look thru the scripts
			line = line.strip()
			if matched: # if the last line was a match
				if len(line) > 0:
					print('sensa retrologe da "{}"'.format(line))
					for i, group in enumerate(groups): # fill in any groups from that match
						line = line.replace(f'${i + 1}', group)
					try:
						await message.channel.send(line) # and send this one
					except AttributeError:
						print("oh sad, I can't send messages to voice channel text channels.")
				break
			elif len(line) > 0:
				if line.startswith('/') and line.endswith('/'):
					bare_content = re.sub(r'[.,;:!?‽\-_\/\'’"“”*>)(]', '', content)
					bare_line = line[1:-1]
					match = re.search(bare_line, bare_content, re.IGNORECASE) # if this line matches via regex
					if match:
						matched = True
						groups = match.groups() # mark it and save the groops
				else:
					bare_content = re.sub(r'[.,;:!?\-_\/\'’"“”*>)( ]', '', content.lower())
					bare_line = re.sub(r'[.,;:!?‽\-_\/\'’"“”*>)( ]', '', line.lower())
					if bare_content == bare_line or (len(bare_line) >= 7 and bare_content.endswith(bare_line)): # if this line matches normally
						matched = True # mark it
						groups = []
						print('sensa retrologe da "{}"'.format(line))

	for key, reaction in REACTIONS.items():
		if re.search(key, content, re.IGNORECASE):
			await message.add_reaction(reaction)

	for song, triggers in SONGS.items(): # if someone says "beans", play the beans song
		for trigger in triggers:
			if client.ready_to_play and re.search(fr"\b{trigger}", content, re.IGNORECASE):
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

client.run(os.getenv('TOKEN'))
