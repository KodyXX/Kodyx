const Discord = require('discord.js');
const superagent = require('superagent');
exports.run = async(client, message, args) => {
    if(!args[0]) return message.channel.send(`:x: Bir şehir girmelisin.`)
    let {body} = await superagent 
    .get(`https://namazapi.glitch.me/namaz?sehir=${args[0]}`);
    if(!{body}) return message.channel.send(`Görünüşe göre bir sorun var, lütfen daha sonra tekrar dene.`)
    if(body.hata) return message.channel.send(`Olamaz! Bir sorun oluştu. Geçerli bir şehir girmelisin.`)
    const embed = new Discord.RichEmbed()
    .setColor('GREEN')
    .setAuthor(client.user.username, client.user.avatarURL)
    .setDescription(`:mosque: **${args[0]}** konumu için namaz vakitleri aşağıda yer almaktadır.`)
    .addField(`**İmsak**`, body.İmsak, true)
    .addField(`**Güneş**`, body.Güneş, true)
    .addField(`**Öğle**`, body.Öğle, true)
    .addField(`**İkindi**`, body.İkindi, true) 
    .addField(`**Akşam**`, body.Akşam, true)
    .addField(`**Yatsı**`, body.Yatsı, true)
    .setFooter(`API Sahibi: BYKodyx.`, message.author.avatarURL)
    .setTimestamp()
    message.channel.send(embed)
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['namazvakti', 'nv'],
    permLevel: 0
};

exports.help = {
    name: 'namaz',
    description: 'Namaz vakitlerini gösterir.',
    usage: 'namaz'
};