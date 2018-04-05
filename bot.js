const Discord = require('discord.js');
const fetch = require('snekfetch');
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
    if (command === '!mtg') {
      findMagicCard(message);
      return;
    }
    message.channel.send(textCommands[command]);
  }
}

function findMagicCard(message) {
  const text = message.content.split('!mtg ');
  const card = text[1].replace(/ /g, '+');
  fetch.get(`https://magiccards.info/query?q=${card}&v=card&s=cname`).then(r => {
    const page = r.body.toString('utf8');
    const imageUrl = page.match('/scans/en/[a-zA-Z0-9_.-]*/[a-zA-Z0-9_.-]*.jpg')[0];
    message.channel.send({
      files: [
        {
          attachment: `https://magiccards.info${imageUrl}`,
          name: 'card.jpg',
        },
      ],
    });
  });
  return;
}
