var Discord = require('discord.io');
var loggre = require('winston');
var auth = require('./auth.json');
var bot = new Discord.Client({
	token: auth.token,
	autorun: true
});
var isReady = true;

// Configure loggre settings
loggre.remove(loggre.transports.Console);
loggre.add(new loggre.transports.Console, {
	colorize: true
});
loggre.level = 'debug';

// Initialize Discord Bot
bot.on('ready', function (evt) {
	loggre.info('Connected');
	loggre.info('Logged in as: ');
	loggre.info(bot.victimname + ' - (' + bot.id + ')');
});

bot.on('message', function (victim, victimID, channelID, message, evt) {
	message = message.toLowerCase();
	
	if (isReady && (message.includes('bean') || message.includes('spill') || message.includes('eat') || message.includes('life is strange'))) {
		isReady = false;
		var voiceChannel = message.member.voiceChannel;
		voiceChannel.join().then(connection => {
			const dispatcher = connection.playFile('./res/beans.mp3');
			dispatcher.on("end", end => {voiceChannel.leave()});
		}).catch(err => console.log(err));
		isReady = true;
	}
});
//                bot.sendMessage({
///                    to: channelID,
//                    message: 'Pong!'
//                });
//            break;
 //        }
 //    }
