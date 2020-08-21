const express = require("express");
const app = express();
const http = require("http");
app.get("/", (request, response) => {
  console.log(`[PING] Açık tutuyorum...`);
  response.sendStatus(200);
});
    app.listen(process.env.PORT);
    setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    }, 280000);
const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const ms = require('ms');
const moment = require('moment');
const Jimp = require('jimp');
const db = require('quick.db');
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const youtube = new YouTube("AIzaSyCkT_L10rO_NixDHNjoAixUu45TVt0ES-s");
const queue = new Map();
const { promisify } = require("util");
require('./util/eventLoader')(client);


var prefix = ayarlar.prefix;

const log = message => {
    console.log(`${message}`);
};




client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);
client.on("voiceStateUpdate", (old, neww) => {
  let ses = old.voiceChannel;
  if (!neww.voiceChannel) {
    if (neww.id === client.user.id) {
      console.log(`BOT: Bot yeniden başlatılıyor...`);
      process.exit(0);
      console.clear();
    }
  }
});
client.on("message", async msg => {
  const args = msg.content.split(" ");
  const searchString = args.slice(1).join(" ");
  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
  const serverQueue = queue.get(msg.guild.id);
  let command = msg.content.toLowerCase().split(" ")[0];
  command = command.slice(prefix.length);
  if (msg.content.startsWith("m!çal")) {
    console.log("mesaj çalışıyor");
    let mesaj2 =
      "**Komutu kullanabilmek için bir ses kanalında bulunmalısınız.**"; // hata neden var onu bulmak için yapıyorum

    const voiceChannel = msg.member.voiceChannel;
    let send = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setDescription(mesaj2)
      .setTimestamp()
      .setFooter("Müzik", "");
    console.log(mesaj2); 
    if (!voiceChannel) return msg.channel.sendEmbed(send);

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlis(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
        await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }
      return msg.channel
        .sendEmbed(new Discord.RichEmbed())
        .setTitle(`**\`${playlist.title}\` adlı şarkı kuyruğa eklendi.**`);
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
        try {
          var videos = await youtube.searchVideos(searchString, 10);
          let index = 0;

          msg.channel.sendEmbed(
            new Discord.RichEmbed()
              .setTitle("Şarkı Seçimi")
              .setDescription(
                `${videos
                  .map(video2 => `**${++index} -** ${video2.title}`)
                  .join("\n")}`
              )
              .setFooter(
                "**__1__-__10__ arasında bir sayı belirtmelisin. Belirtmezsen 10 saniye içinde komut iptal edilecektir.**"
              )
              .setFooter("Örnek kullanım: 1")
              .setColor("0x36393E")
          );
          msg.delete(5000);
          try {
            var response = await msg.channel.awaitMessages(
              msg2 => msg2.content > 0 && msg2.content < 11,
              {
                maxMatches: 1,
                time: 10000,
                errors: ["time"]
              }
            );
          } catch (err) {
            console.error(err);
            return msg.channel.sendEmbed(
              new Discord.RichEmbed()
                .setColor("0x36393E")
                .setDescription(
                  "**10 saniye boyunca bir şarkı seçmediğiniz için komut iptal edildi.**."
                )
            );
          }
          const videoIndex = parseInt(response.first().content);
          var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
        } catch (err) {
          console.error(err);
          return msg.channel.sendEmbed(
            new Discord.RichEmbed()
              .setColor("0x36393E")
              .setDescription(`**YouTube'da böyle bir şarkı mevcut değil!**`)
          );
        }
      }
      return handleVideo(video, msg, voiceChannel);
    }
  } else if (command === "gir") {
    return new Promise((resolve, reject) => {
      const voiceChannel = msg.member.voiceChannel;
      if (!voiceChannel || voiceChannel.type !== "voice")
        return msg.reply(
          "**Kanalda kimse bulunmadığı için kanalda durmama gerek yok. Bu yüzden kanaldan ayrıldım.**"
        );
      voiceChannel
        .join()
        .then(connection => resolve(connection))
        .catch(err => reject(err));
    });
  } else if (command === "geç") {
    if (!msg.member.voiceChannel)
      if (!msg.member.voiceChannel)
        return msg.channel.sendEmbed(
          new Discord.RichEmbed()
            .setColor("RANDOM")
            .setDescription(
              "**Komutu kullanabilmek için bir ses kanalında bulunmalısınız.**"
            )
        );
    if (!serverQueue)
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setDescription("**Şuanda herhangi bir şarkı zaten oynatılmıyor.**")
      );
    serverQueue.connection.dispatcher.end("**Sıradaki Şarkıya Geçildi!**");
    return undefined;
  } else if (command === "dur") {
    if (!serverQueue || !serverQueue.playing)
      return msg.channel.send("**Şuanda zaten bir şarkı oynatılmıyor.");

    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle("**Şarkı Durduruldu!**")
          .setColor("RANDOM")
      );
    }
  } else if (command === "volume") {
    if (!msg.member.voiceChannel)
      if (!msg.member.voiceChannel)
        return msg.channel.sendEmbed(
          new Discord.RichEmbed()
            .setColor("RANDOM")
            .setDescription(
              "**Komutu kullanabilmek için bir ses kanalında bulunmalısınız.**"
            )
        );

    
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle(
            "**Herhangi bir şarkı oynatılmadığı için sesini ayarlayamam!**"
          )
      );

    if (args[1] > 200)
      return msg.reply("**Ses seviyesi 200'den fazla olamaz.**");

    

    serverQueue.volume = args[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    return msg.channel.sendEmbed(
      new Discord.RichEmbed()
        .setTitle(`:loud_sound: Ses Seviyesi Ayarlanıyor: **${args[1]}**`)
        .setColor("RANDOM")
    );
  } else if (command === "çalan") {
    if (!serverQueue)
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle("**Şuan herhangi bir şarkı çalınmıyor.")
          .setColor("RANDOM")
      );
    return msg.channel.sendEmbed(
      new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("Çalan")
        .addField(
          "Başlık",
          `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`,
          true
        )
        .addField(
          "Süre",
          `${serverQueue.songs[0].durationm}:${serverQueue.songs[0].durations}`,
          true
        )
    );
  } else if (msg.content.startsWith === prefix + "list") {
    let index = 0;
    if (!serverQueue)
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle("**Herhangi bir şarkı sıraya eklenmemiş.**")
          .setColor("RANDOM")
      );
    return msg.channel
      .sendEmbed(
        new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("Şarkı Kuyruğu")
          .setDescription(
            `${serverQueue.songs
              .map(song => `**${++index} -** ${song.title}`)
              .join("\n")}`
          )
      )
      .addField("Şu Anda Çalınan: " + `${serverQueue.songs[0].title}`);
  } else if (command === "duraklat") {
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle("**:pause_button: Şarkı Durduruldu!**")
          .setColor("RANDOM")
      );
    }
    return msg.channel.send("**Şuanda herhangi bir şarkı oynatılmıyor.**");
  } else if (command === "devam") {
    if (serverQueue && serverQueue.playing)
      return msg.reply("**Zaten şarkı oynatılıyor.**");

    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle("**:arrow_forward: **Şarkı, çalınmaya devam ediyor.**")
          .setColor("RANDOM")
      );
    }
    return msg.channel.sendEmbed(
      new Discord.RichEmbed()
        .setTitle("**Şuanda herhangi bir şarkı oynatılmıyor.**")
        .setColor("RANDOM")
    );
  }

  return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
  const serverQueue = queue.get(msg.guild.id);
  console.log(video);
  const song = {
    id: video.id,
    title: video.title,
    url: `https://www.youtube.com/watch?v=${video.id}`,
    durationh: video.duration.hours,
    durationm: video.duration.minutes,
    durations: video.duration.seconds,
    views: video.views
  };
  if (!serverQueue) {
    const queueConstruct = {
      textChannel: msg.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };
    queue.set(msg.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(msg.guild, queueConstruct.songs[0]);
    } catch (error) {
      console.error(
        `❎ | **Şarkı Sisteminde Problem Var Hata Nedeni: ${error}**`
      );
      queue.delete(msg.guild.id);
      return msg.channel.sendEmbed(
        new Discord.RichEmbed()
          .setTitle(
            `❎ | **Şarkı Sisteminde Problem Var Hata Nedeni: ${error}**`
          )
          .setColor("RANDOM")
      );
    }
  } else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    if (playlist) return undefined;
    return msg.channel.sendEmbed(
      new Discord.RichEmbed()
        .setTitle(`**\`${song.title}\` adlı şarkı kuyruğa eklendi!**`)
        .setColor("RANDOM")
    );
  }
  return undefined;
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  console.log(serverQueue.songs);

  const dispatcher = serverQueue.connection
    .playStream(ytdl(song.url))
    .on("end", reason => {
      if (reason === "**Yayın Akış Hızı yeterli değil.**")
        console.log("Şarkı Bitti.");
      else console.log(reason);
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  serverQueue.textChannel.sendEmbed(
    new Discord.RichEmbed()
      .setColor("RANDOM")
      .setColor("RANDOM")
      .setTitle(
        "** :gem: Şarkı Başladı :gem:   **"
      )
      .setThumbnail(
        `https://i.ytimg.com/vi/${song.id}/default.jpg?width=80&height=60`
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/645797096842199051/649361326992523274/efekt.gif"
      )

      .addField(
        " Discord : [MB] Asreaper ✭#4920\n\n",
        `[${song.title}](${song.url})`,
        true
      )
      .setColor(0xdf01a5)

      .addField("Destek Sunucusu!", `[Tıkla!](https://discord.gg/pYdEvNf)`)

      .addField(
        "Bot Davet Et!",
        `[Tıkla!](https://discordapp.com/oauth2/authorize?client_id=655768847303049216&scope=bot&permissions=8)`,
        true
      )
      .addField("\nSes Seviyesi", `${serverQueue.volume}%`, true)

      .addField("Süre", `${song.durationm}:${song.durations}`, true)
      .setColor("RANDOM")
  );
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//Sunucu Üye Sayısı

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);

client.on("message", msg => {
  if (msg.content.toLowerCase() === "<@394427304048197632>") {
    const id = "394427304048197632";
    const an = msg.guild.member(id);
    an.send(
      `${msg.author}(${msg.author.username},${msg.author.id}) kişisi **${msg.guild}**(${msg.guild.id}) sunucusunda seni etiketledi.`
    );
  }
});
client.on("ready", async msg => {
  var gecikme = setInterval(function() {
    client.channels
      .get("432170942123212814")
      .setTopic(
        "Sunucumuzda " +
          client.guilds
            .get("432170942123212812")
            .members.filter(mb => !mb.user.bot).size +
          " Kişiyiz ve " +
          client.guilds
            .get("432170942123212812")
            .members.filter(m => m.presence.status != "offline" && !m.user.bot)
            .size +
          " Aktif Var"
      );
  }, 30 * 1000);
});
//hoşgeldin

client.on("guildMemberAdd", member => {
  const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setTitle("SUNUCUMUZA HOŞGELDİN")
    .setDescription("KodyX Discord Sunucusu");
  member.send(embed);
});


//emojili as

client.on("message", async msg => {
  if (msg.content.toLowerCase() === "Sa") {
    await msg.react("🇦");
    await msg.react("🇸");
  }
});

//emojili as

client.on("message", async msg => {
  if (msg.content.toLowerCase() === "sa") {
    await msg.react("🇦");
    await msg.react("🇸");
  }
});

//emojili as

client.on("message", async msg => {
  if (msg.content.toLowerCase() === "selamın akeyküm") {
    await msg.react("🇦");
    await msg.react("🇸");
  }
});

client.on("message", msg => {
  if (msg.content.toLowerCase() === "sa") {
    msg.reply("Aleyküm selam, Hoş geldiniz");
  }
});

client.on("message", msg => {
  if (msg.content.toLowerCase() === "Sa") {
    msg.reply("Aleyküm selam, Hoş geldiniz");
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "selamın aleyküm") {
    msg.reply("Aleyküm selam, Hoş geldiniz");
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "sea") {
    msg.reply("Aleyküm selam, Hoş geldiniz");
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "selam bebek") {
    msg.reply("Aleyküm selam, Hoş geldiniz");
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "Günaydın") {
    msg.reply("Günaydınlar Efenimmm");
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "günaydın") {
    msg.reply("Günaydınlar Efenimmm");
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "günaydınn") {
    msg.reply("Günaydınlar Efenimmm");
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "günaydınnn") {
    msg.reply("Günaydınlar Efenimmm");
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "iyi geceler.") {
    msg.reply("İyi Geceler Efenimmm");
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "iyi geceler") {
    msg.reply("İyi Geceler Efenimmm");
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "İyi geceler.") {
    msg.reply("İyi Geceler Efenimmm");
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "İyi geceler") {
    msg.reply("İyi Geceler Efenimmm");
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "ii gclr") {
    msg.reply("İyi Geceler Efenimmm");
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "İyi geceler gençler") {
    msg.reply("İyi Geceler Efenimmm");
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "iyi geceler gençler") {
    msg.reply("İyi Geceler Efenimmm");
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "İyi geceler arkadaşlar.") {
    msg.reply("İyi Geceler Efenimmm");
  }
});


///Resimli Giriş Çıkış

client.on("guildMemberRemove", async member => {
  let resimkanal = JSON.parse(fs.readFileSync("./ayarlar/gç.json", "utf8"));
  const canvaskanal = member.guild.channels.get(
    resimkanal[member.guild.id].resim
  );
  if (!canvaskanal) return;
 
  const request = require("node-superfetch");
  const Canvas = require("canvas"),
    Image = Canvas.Image,
    Font = Canvas.Font,
    path = require("path");
 
  var randomMsg = ["Sunucudan Ayrıldı."];
  var randomMsg_integer =
    randomMsg[Math.floor(Math.random() * randomMsg.length)];
 
  let msj = await db.fetch(`cikisM_${member.guild.id}`);
  if (!msj) msj = `{uye}, ${randomMsg_integer}`;
 
  const canvas = Canvas.createCanvas(640, 360);
  const ctx = canvas.getContext("2d");
 
  const background = await Canvas.loadImage(
    "https://i.imgyukle.com/2020/06/12/CkQgD6.jpg"
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
 
  ctx.strokeStyle = "#74037b";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
 
  ctx.fillStyle = `#D3D3D3`;
  ctx.font = `37px "Warsaw"`;
  ctx.textAlign = "center";
  ctx.fillText(`${member.user.username}`, 300, 342);
 
  let avatarURL = member.user.avatarURL || member.user.defaultAvatarURL;
  const { body } = await request.get(avatarURL);
  const avatar = await Canvas.loadImage(body);
 
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.arc(250 + 55, 55 + 55, 55, 0, 2 * Math.PI, false);
  ctx.clip();
  ctx.drawImage(avatar, 250, 55, 110, 110);
 
  const attachment = new Discord.Attachment(
    canvas.toBuffer(),
    "ro-BOT-güle-güle.png"
  );
 
    canvaskanal.send(attachment);
    canvaskanal.send(
      msj.replace("{uye}", member).replace("{sunucu}", member.guild.name)
    );
    if (member.user.bot)
      return canvaskanal.send(`? Bu bir bot, ${member.user.tag}`);
 
});
 
client.on("guildMemberAdd", async member => {
  let resimkanal = JSON.parse(fs.readFileSync("./ayarlar/gç.json", "utf8"));
  const canvaskanal = member.guild.channels.get(
    resimkanal[member.guild.id].resim
  );
  if (!canvaskanal) return;
  const request = require("node-superfetch");
  const Canvas = require("canvas"),
    Image = Canvas.Image,
    Font = Canvas.Font,
    path = require("path");
 
  var randomMsg = ["Sunucuya Katıldı."];
  var randomMsg_integer =
    randomMsg[Math.floor(Math.random() * randomMsg.length)];
 
  let paket = await db.fetch(`pakets_${member.id}`);
  let msj = await db.fetch(`cikisM_${member.guild.id}`);
  if (!msj) msj = `{uye}, ${randomMsg_integer}`;
 
  const canvas = Canvas.createCanvas(640, 360);
  const ctx = canvas.getContext("2d");
 
  const background = await Canvas.loadImage(
    "https://i.imgyukle.com/2020/06/12/CkQBgM.jpg"
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
 
  ctx.strokeStyle = "#74037b";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = `#D3D3D3`;
  ctx.font = `37px "Warsaw"`;
  ctx.textAlign = "center";
  ctx.fillText(`${member.user.username}`, 300, 342);
 
  let avatarURL = member.user.avatarURL || member.user.defaultAvatarURL;
  const { body } = await request.get(avatarURL);
  const avatar = await Canvas.loadImage(body);
 
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.arc(250 + 55, 55 + 55, 55, 0, 2 * Math.PI, false);
  ctx.clip();
  ctx.drawImage(avatar, 250, 55, 110, 110);
 
  const attachment = new Discord.Attachment(
    canvas.toBuffer(),
    "ro-BOT-hosgeldin.png"
  );
 
  canvaskanal.send(attachment);
  canvaskanal.send(
    msj.replace("{uye}", member).replace("{sunucu}", member.guild.name)
  );
  if (member.user.bot)
    return canvaskanal.send(`? Bu bir bot, ${member.user.tag}`);
});



////////////////KÜFÜR/////////////////


client.on("message", async msg => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;

  let i = await db.fetch(`küfürFiltre_${msg.guild.id}`);
  if (i == "acik") {
    const küfür = [
      "amcık",
      "yarrak",
      "orospu",
      "piç",
      "sikerim",
      "sikik",
      "amına",
      "pezevenk",
      "yavşak",
      "ananı",
      "anandır",
      "orospu",
      "evladı",
      "göt",
      "pipi",
      "sokuk",
      "yarak",
      "bacını",
      "karını",
      "amk",
      "aq",
      "mk",
      "anaskm"
    ];
    if (küfür.some(word => msg.content.toLowerCase().includes(word))) {
      try {
        if (!msg.member.hasPermission("MANAGE_WEBHOOKS")) {
          msg.delete();
          let embed = new Discord.RichEmbed()
            .setColor(0xffa300)
            .setFooter("RedDeveloper Küfür Sistemi", client.user.avatarURL)
            .setAuthor(
              msg.guild.owner.user.username,
              msg.guild.owner.user.avatarURL
            )
            .setDescription(
              "RedDeveloper, " +
                `***${msg.guild.name}***` +
                " adlı sunucunuzda küfür yakaladım."
            )
            .addField(
              "Küfür Eden Kişi",
              "Kullanıcı: " + msg.author.tag + "\nID: " + msg.author.id,
              true
            )
            .addField("Engellenen mesaj", msg.content, true)
            .setTimestamp();
          msg.guild.owner.user.send(embed);
          return msg.channel
            .send(
              `${msg.author}, Küfür Etmek Yasak! Senin Mesajını Özelden Kurucumuza Gönderdim.`
            )
            .then(msg => msg.delete(25000));
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});


///////////////SADECE RESİM KANALI////////////////////////

client.on("message", m => {
  if (m.channel.id !== "746118203150827531") { //buraya o kanalın ID'si yazılacak.
    return;
  }
  if (m.author.id === m.guild.ownerID) return;
  if (m.attachments.size < 1) {
    m.delete();
  }
});
  
