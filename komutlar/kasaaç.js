const Discord = require('discord.js');

exports.run = (client, message) => {
    let csgopng = "https://i.imgyukle.com/2020/06/17/CxMJi1.jpg"
    var kasadancikanlar = [
         "Glock-18 'Solgun' (**Fabrikadan Yeni Çıkmış**) \nPrice:**298.88$**",
        "Karambit Doppler (**Fabrikadan Yeni Çıkmış**) \nPrice:**3775.85$**",
        "AK-47 Fire Serpent (**Fabrikadan Yeni Çıkmış**) \nPrice:**622.62$**",
        "M4A4 Uluma (**Fabrikadan Yeni Çıkmış**) \nPrice:**1713.9$**",
        "M4A1-S Şövalye (**Fabrikadan Yeni Çıkmış**) \nPrice:**272.69$**",
        "M4A1-S Sıcak Güç (**Fabrikadan Yeni Çıkmış**) \nPrice:**150,18$**",
        "AWP Medusa (**Fabrikadan Yeni Çıkmış**) \nPrice:**1582.05$**",
        "AWP Dragon Lore (**Fabrikadan Yeni Çıkmış**) \nPrice:**1813.93$**",
        "Bayonet 'Slaugther' (**Fabrikadan Yeni Çıkmış**) \nPrice:**230.6$**",
        "M9 Bayonet 'Slaughter' (**Fabrikadan Yeni Çıkmış**) \nPrice:**321.3$**",
        "Karambit 'Case Hardened' (**Fabrikadan Yeni Çıkmış**) \nPrice:**450.54$**",
        "M9 Bayonet 'Marble Fade' (**Fabrikadan Yeni Çıkmış**) \nPrice:**413.2$**",
        "Bayonet 'Marble Fade' (**Fabrikadan Yeni Çıkmış**) \nPrice:**288.19$**",
        "M9 Bayonet 'Bright Water' (**Fabrikadan Yeni Çıkmış**) \nPrice:**150.5$**",
        "Karambit 'Lore' (**Fabrikadan Yeni Çıkmış**) \nPrice:**1262.28$**",
        "Gut Knife 'Gamma Doppler' (**Fabrikadan Yeni Çıkmış**) \nPrice:**110.56$**",
        "Gut Knife 'Freehand' (**Fabrikadan Yeni Çıkmış**) \nPrice:**73.97$**",
        "MAC-10 | Disco Tech' (**Az Aşınmış**) \nPrice:**12,27$**",
        "M4A4 Poseidon (**Az Aşınmış**) \nPrice:**198.88$**",
        "M4A4 Poseidon (**Görevde Kullanılmış**) \nPrice:**172.92$**",
        "AK-47 Fire Serpent (**Az Aşınmış**) \nPrice:**252.21$**",
        "AK-47 Fire Serpent (**Görevde Kullanılmış**) \nPrice:**183.56$**",
        "AK-47 Fire Serpent (**Az Aşınmış**) \nPrice:**170.69$**",
        "AWP | Yaban Ateşi (**Savaş Görmüş**) \nPrice:**27,61$**",
        "M4A4 Howl (**Az Aşınmış**) \nPrice:**1335.36$**",
        "M4A4 Howl (**Görevde Kullanılmış**) \nPrice:**801.08$**",
        "M4A4 Howl (**Az Aşınmış**) \nPrice:**880$**",
        "M4A1-S Knight (**Az Aşınmış**) \nPrice:**330.01$**",
        "M4A1-S Hot Rod (**Az Aşınmış**) \nPrice:**77.73$**",
        "AWP Medusa (**Az Aşınmış**) \nPrice:**798$**",
        "AWP Medusa (**Görevde Kullanılmış**) \nPrice:**677.15$**",
        "AWP Medusa (**Az Aşınmış**) \nPrice:**592.69$**",
        "AWP Medusa (**Savaş Görmüş**) \nPrice:**580.01$**",
        "AWP Dragon Lore (**Az Aşınmış**) \nPrice:**1608.97$**",
        "AWP Dragon Lore (**Görevde Kullanılmış**) \nPrice:**1043.44$**",
        "AWP | Asiimov (**Az Aşınmış**) \nPrice:**39,30$**",
        "AWP Dragon Lore (**Savaş Görmüş**) \nPrice:**915.29$**",
        "Bayonet 'Slaughter' (**Az Aşınmış**) \nPrice:**187.48$**",
        "Bayonet 'Slaughter' (**Görevde Kullanılmış**) \nPrice:**140.1$**",
        "M9 Bayonet 'Slaughter' (**Az Aşınmış**) \nPrice:**234.07$**",
        "M9 Bayonet 'Slaughter' (**Görevde Kullanılmış**) \nPrice:**190.26    $**",
        "Karambit 'Case Hardened' (**Az Aşınmış**) \nPrice:**257.58$**",
        "Karambit 'Case Hardened' (**Görevde Kullanılmış**) \nPrice:**228.7    $**",
        "Karambit 'Case Hardened' (**Az Aşınmış**) \nPrice:**195.68    $**",
        "Karambit 'Case Hardened' (**Savaş Görmüş**) \nPrice:**182.71$**",
        "M9 Bayonet 'Marble Fade' (**Az Aşınmış**) \nPrice:**498.15$**",
        "Bayonet 'Marble Fade' (**Az Aşınmış**) \nPrice:**297.6$**",
        "M9 Bayonet 'Bright Water' (**Az Aşınmış**) \nPrice**136.4$**",
        "M9 Bayonet 'Bright Water' (**Görevde Kullanılmış**) \nPrice**115.63    $**",
        "M9 Bayonet 'Bright Water' (**Az Aşınmış**) \nPrice**102.13$**",
        "USP-S | Orman Yaprakları' (**Fabrikadan Yeni Çıkmış**) \nPrice**1,17$**",
        "Karambit 'Lore' (**Az Aşınmış**) \nPrice:**748.02$**",
        "Karambit 'Lore' (**Görevde Kullanılmış**) \nPrice:**347.65$**",
        "M4A4 | Tenha Boşluk' (**Görevde Kullanılmış**) \nPrice:**34.77$**",
        "Karambit 'Lore' (**Savaş Görmüş**) \nPrice:**244.97$**",
        "M4A4 | Zalim Daimyo' (**Fabrikadan Yeni Çıkmış**) \nPrice:**7,30$**",
        "M4A1-S | Player Two' (**Fabrikadan Yeni Çıkmış**) \nPrice:**175,29$**",
        "M4A1-S | Cyrex' (**Fabrikadan Yeni Çıkmış**) \nPrice:**14,32$**",
        "MAC-10 | Elma Şekeri' (**Fabrikadan Yeni Çıkmış**) \nPrice:**0,15$**",
        "AWP | Safari Ağı' (**Az Aşınmış**) \nPrice:**0,29$**",
        "AWP | Safari Ağı' (**Fabrikadan Yeni Çıkmış**) \nPrice:**2,19$**",

    ]
    var kasadancikanlar = kasadancikanlar[Math.floor(Math.random(1) * kasadancikanlar.length)]
    const embed  = new Discord.RichEmbed()
    .setImage("https://cdn.wallpapersafari.com/40/16/8rTMh6.jpg")
    .setAuthor('Gaben Case', csgopng)
    .setDescription(`${kasadancikanlar}`)
    .setFooter(`Kasayı açan (${message.author.username}) | Kasa Fiyatı: 40$ | `)
    .setColor("'FF0000'")
    return message.channel.sendEmbed(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['csgokasa', 'kasaaç'],
  permLevel: 0
};

exports.help = {
  name: 'kasaaç',
  description: 'CS:GO kasa açma simülasyonu',
  usage: 'kasaaç'
};
