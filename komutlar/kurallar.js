const Discord = require('discord.js');

exports.run = async(client, message) => {

    const rules = new Discord.RichEmbed()
    
      .setColor('RED')
      .addField(`Kurallar`, [`
      
      Sunucumuza Hoşgeldiniz :slight_smile: 
Burası Kodyx Discord Sunucusu Bu Sunucuda Arkdaşlarınızla Oyun Oynarken Hiç Bir Lag , Ping Yükselmesi Olmadan Konuşabilirsiniz. Ama Tabikide Bunları Yaparken Aşağıdaki Sunucu Kurallarına Uyulmalıdır O Zaman Hadi Başlayalım

-KURALLAR
-1. Argo kelimeler, küfür vb. şeyler **yasaktır**.
-2. Spam yapmak **yasaktır**.
-3. Reklam yapmak **yasaktır**.
-4. Herkes birbirine saygılı **davranmalıdır**.
-5. Başkalarını rahatsız edecek davranışlarda bulunmak **yasaktır**.
-6. Ahlaka karşı davranışlar sergilemek **yasaktır**.
-7. Oynuyor.. kısmına küfür, reklam vb. içerikler yazmak **yasaktır**.
-8. Twitch kanalıma Steam hesabıma !twitch !steam yazarak **ulaşabilirsiniz**.
-9. Sonrasında ise !destek yazarak bizden her konuda yardım **alabilirsiniz**.
-10. **İyi Eğlenceler**...
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
    name : 'kurallar',
    description: 'Hazır kuralları kanalınıza atar.',
    usage: '<prefix>kurallar/rules'
}