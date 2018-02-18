const Discord = require('discord.js');
const Settings = require('./settings.json');
const textCommands = require('./textcommands.json');
const client = new Discord.Client();

client.login(Settings.BOT_TOKEN);

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  searchForAyy(message);
  searchForCommand(message);
});

function searchForAyy(message) {
  if (message.content.toLowerCase().includes('ayy')) {
    message.channel.send(PickAnAyy());
  }
}

function PickAnAyy() {
  let ayys = ['lmao', 'macarena', 'esse', '<:Jebaited:297176518268813314>'];
  let randomNumber = Math.floor(Math.random() * ayys.length);
  return ayys[randomNumber];
}

function searchForCommand(message) {
  const re = /(?:^|[ ])!([a-zA-Z]+)/gm;
  let m;
  while ((m = re.exec(message.content)) != null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    let text = m[0].toLowerCase();
    let command = text.trim();
    message.channel.send(textCommands[command]);
  }
}
