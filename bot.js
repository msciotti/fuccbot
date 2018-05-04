const Discord = require('discord.js');
const fetch = require('snekfetch');
const Settings = require('./settings.json');
const textCommands = require('./textcommands.json');
const client = new Discord.Client();
const sqlite3 = require('sqlite3');
let db;

client.login(Settings.BOT_TOKEN);

client.on('ready', () => {
  db = new sqlite3.Database('../dbs/my.db', sqlite3.OPEN_READWRITE, e => {
    e ? console.log(e.message) : console.log('Connected to db');
  });
});

client.on('message', message => {
  searchForAyy(message);
  searchForCommand(message);
});

client.on('error', error => {
  console.log(error.message);
});

function searchForAyy(message) {
  if (message.content.toLowerCase().includes('ayy')) {
    message.channel.send(PickAnAyy());
  }
}

function PickAnAyy() {
  let ayys = ['lmao', 'macarena', 'esse', '<:Jebaited:297176518268813314>', 'jis'];
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
  const name = message.content.split('!mtg ')[1];
  db.get(
    'select card_url, card_name from mtgcards where card_name=$name',
    {
      $name: name,
    },
    (e, row) => {
      let card;
      if (row == null) {
        const url = getCard(name, url => {
          db.run(
            'insert into mtgcards values($url, $name)',
            {
              $url: url,
              $name: name,
            },
            () => {
              sendImage(message.channel, url);
            }
          );
        });
      } else {
        sendImage(message.channel, row.card_url);
      }
    }
  );
}

function getCard(name, callback) {
  const query = name.replace(/ /g, '+');
  fetch.get(`https://magiccards.info/query?q=${query}&v=card&s=cname`).then(r => {
    const page = r.body.toString('utf8');
    const imageUrl = page.match('scans/en/[a-zA-Z0-9_.-]*/[a-zA-Z0-9_.-]*.jpg')[0];
    callback(`https://magiccards.info/${imageUrl}`);
  });
}

function sendImage(channel, attachment) {
  channel.send({
    files: [attachment],
  });
}
