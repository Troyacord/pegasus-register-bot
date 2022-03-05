onst { Client, Collection, Intents } = require("discord.js");
const allIntents = new Intents(32509);
allIntents.add(Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS);
const client = new Client({
    intents: allIntents,
    allowedMentions: { parse: ["everyone", "roles", "users"], repliedUser: true},
    partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"]
});

const { MessageEmbed } = require("discord.js");
const ayarlar = (global.ayarlar = require("./ayarlar.json")); 
const moment = require("moment"); 
const fs = require("fs"); 
const db = require("quick.db"); 
require("./util/eventLoader.js")(client);

const log = message => { console.log(message) }

client.Commands = new Collection();
client.Aliases = new Collection(); 

fs.readdir("./Commands/", (err, files) => {
  if (err) console.error(err);
  
  log(`Yüklenecek komut sayısı: ${files.length}.`); 
  
  files.forEach(js => {
    let cmds = require(`./komutlar/${js}`); 
    log(`Yüklenen komut: ${cmds.name}.`); 
    client.Commands.set(files.name, files); 
    
    cmds.aliases.forEach(alias => {
      client.Aliases.set(alias, cmds.name); 
    });
    
  });
});

//DATE FORMAT SYSTEM

client.tarihHesapla = date => {
  const startedAt = Date.parse(date);
  var msecs = Math.abs(Date.now() - date);

  const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
  msecs -= years * 1000 * 60 * 60 * 24 * 365;
  const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
  msecs -= months * 1000 * 60 * 60 * 24 * 30;
  const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
  msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
  const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
  msecs -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(msecs / (1000 * 60 * 60));
  msecs -= hours * 1000 * 60 * 60;
  const mins = Math.floor(msecs / (1000 * 60));
  msecs -= mins * 1000 * 60;
  const secs = Math.floor(msecs / 1000);
  msecs -= secs * 1000;

  var string = "";
  if (years > 0) string += `${years} yıl ${months} ay`;
  else if (months > 0)
    string += `${months} ay ${weeks > 0 ? weeks + " hafta" : ""}`;
  else if (weeks > 0)
    string += `${weeks} hafta ${days > 0 ? days + " gün" : ""}`;
  else if (days > 0)
    string += `${days} gün ${hours > 0 ? hours + " saat" : ""}`;
  else if (hours > 0)
    string += `${hours} saat ${mins > 0 ? mins + " dakika" : ""}`;
  else if (mins > 0)
    string += `${mins} dakika ${secs > 0 ? secs + " saniye" : ""}`;
  else if (secs > 0) string += `${secs} saniye`;
  else string += `saniyeler`;

  string = string.trim();
  return `${string} önce`;
};

Array.prototype.chunk = function(chunk_size) {
  let myArray = Array.from(this);
  let tempArray = [];
  for (let index = 0; index < myArray.length; index += chunk_size) {
    let chunk = myArray.slice(index, index + chunk_size);
    tempArray.push(chunk);
  }
  return tempArray;
};

//-----------------------LOGİN----------------------\\

client.login(process.env.token);
