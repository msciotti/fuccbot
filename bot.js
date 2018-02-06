const Discord = require('discord.js');
const Settings = require('./settings.json');
const textCommands = require('./textcommands.json');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  searchForAyy(message);
  searchForCommand(message);
});

client.login(Settings.BOT_TOKEN);

function PickAnAyy() {
  var ayys = ['lmao', 'macarena', 'esse', '<:Jebaited:297176518268813314>'];
  var randomNumber = Math.floor(Math.random() * ayys.length);
  return ayys[randomNumber];
}

function searchForAyy(message) {
  if (message.content.toLowerCase().includes('ayy')) {
    message.channel.send(PickAnAyy());
  }
}

function searchForCommand(message) {
  const re = /(?:^|[ ])!([a-zA-Z]+)/gm;
  let m;
  while ((m = re.exec(message.content)) != null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    for (var i = 0, len = m.length; i < len; i++) {
      var text = m[i].toLowerCase();
      var command = text.trim();
      message.channel.send(textCommands[command]);
    }
  }
}
