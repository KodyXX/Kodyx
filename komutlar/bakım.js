const Discord = require('discord.js');
const data = require('quick.db')
exports.run = async (client, message, args) => {// chimp#0110
const emb = new Discord.RichEmbed()
.setAuthor(client.user.username, client.user.avatarURL)
.setFooter(`Bakım Modu`)
.setTimestamp()
.setColor('RED')

const embed2 = new Discord.RichEmbed()
.setAuthor(client.user.username, client.user.avatarURL)
.setFooter(`Bakım Modu`)
.setTimestamp()
.setColor('GREEN')

if(!args[0]) return message.channel.send(emb.setDescription(`Bakım modunu kullanmak için \`aç\` veya \`kapat\` yazmalısın.`))
  
if(args[0] === 'aç') {
const dsd = await data.fetch(`bakim.modu.${client.user.id}`)
if(dsd) return message.channel.send(emb.setDescription(`Bakım modu zaten açık.`))

data.set(`bakim.modu.${client.user.id}`, 'codare')
message.channel.send(embed2.setDescription(`Bakım modu açılmıştır.`))}
  
if(args[0] === 'kapat') {
const dsd = await data.fetch(`bakim.modu.${client.user.id}`)
if(!dsd) return message.channel.send(emb.setDescription(`Bakım modu zaten kapalı.`))

data.delete(`bakim.modu.${client.user.id}`)
message.channel.send(embed2.setDescription(`Bakım modu kapatılmıştır.`))}
  
}
exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['bakım-mode', 'bakımmodu'],
	permLevel: 4, // sadece sahip
}

exports.help = {
	name: 'bakımmodu'
}