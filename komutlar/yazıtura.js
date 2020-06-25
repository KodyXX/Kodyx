const Discord = require('discord.js');
 
var hd = [
    "Tura",
    "Yazı"
];
 
module.exports.run = async (bot, message, args) => {
 
  message.channel.send(message.author.toString() + " Yazı mı Tura mı : " + (hd[Math.floor(Math.random() * hd.length)]));
}
 
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['yazıtura','turayazı','paraçevir','paradöndür'],
  permLevel: 0
};
 
exports.help = {
  name: 'yazı-tura',
  description: 'Yazı Tura Oynamanıza Yarar.',
  usage: 'yazı-tura'
};