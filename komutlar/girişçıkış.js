const Discord = require('discord.js')
const fs = require('fs');
const ayarlar = require('../ayarlar.json');
let kanal = JSON.parse(fs.readFileSync("./ayarlar/gç.json", "utf8"));
 
exports.run = async (client, message, args) => {
if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`Bu Komutu Kullanabilmek İçin **Yönetici** İznine Sahip Olmalısın!`);
 
  let channel = message.mentions.channels.first()
    if (!channel) {
        message.channel.send(`:x: | Kullanım: **${ayarlar.prefix}giriş-çıkış-ayarla #kanal**`)
        return
    }
    if(!kanal[message.guild.id]){
        kanal[message.guild.id] = {
   resim: channel.id
        };
    }
    fs.writeFile("./ayarlar/gç.json", JSON.stringify(kanal), (err) => {
        console.log(err)
    })
    message.channel.send(`:white_check_mark: | ** Resimli Hoşgeldin - Güle Güle kanalı ${channel} Olarak Ayarlandı.** `)
}
   
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["gç-ayarla"],
    permLevel: 0
}
 
exports.help = {
    name: 'giriş-çıkış-ayarla',
    description: 'Giriş Çıkış Kanalını Ayarlar.',
    usage: 'gç-ayarla <#kanal>'
}