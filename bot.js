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
  searchForMagicCard(message);
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
    message.channel.send(textCommands[command]);
  }
}

function searchForMagicCard(message) {
  const regex = /(?:\[\[(([a-zA-Z]+\s*)+)\]\])/g;
  while ((m = regex.exec(message.content)) != null) {
    var name = m[1];
    db.get(
      'select card_url, card_name from mtgcards where card_name=$name',
      {
        $name: name,
      },
      (e, row) => {
        if (row == null) {
          getCard(name, url => {
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
}

function getCard(name, callback) {
  const query = name.replace(/ /g, '+');
  fetch.get(`https://api.scryfall.com/cards/named?fuzzy=${query}`).then(r => {
    if (r.body['object'] === 'card') {
      var imageUrl = r.body['image_uris']['border_crop'];
      callback(imageUrl);
    } else {
      return;
    }
  });
}

function sendImage(channel, attachment) {
  fetch.get(attachment).then(r => {
    channel.send({
      files: [r.body],
    });
  });
}
