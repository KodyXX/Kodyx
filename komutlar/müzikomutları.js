const Discord = require('discord.js');

exports.run = async(client, message) => {

    const rules = new Discord.RichEmbed()
    
      .setColor('RED')
      .addField(`**Komutlarım**`, [`
      
     **!p !play => Müzik Çalma Komutu**
     
     **!s !stop => Çalan Müziği Durdur**
     
     **!geç !skip => Sıradaki Şarkıya Geçer**
  
     **!r !resume => Duraklatılmış Şarkıyı Devam Ettirir**

     **!dis !disconnect => Çalan Şarkıyı Kapatır**

      `])

       message.delete();
      //message.react("🔴");

    return message.channel.send(rules).then(keleS => keleS.react("🔴"));

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['rules'],
    permLevel: 0
}

exports.help = {
    name : 'müzikkomutları',
    description: 'Hazır kuralları kanalınıza atar.',
    usage: '<prefix>kurallar/rules'
}