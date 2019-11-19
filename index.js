const SlackBot = require('slackbots');
const translate = require('@k3rn31p4nic/google-translate-api');

const botToken = 'xoxb-94313697859-783296825408-XN7dDIU39UAyjHl7CYIAEJsW';
const botName = 'C3PO';


const channel = 'game-developers-translations';
const tipMessage = 'Hello! I am C3PO, human cyborg relations... \n*Use @C3PO translate KEY {sentence to translate}* (without {}) and I will translate it to *Spanish, Italian, French and Portuguese*.\nRemember to write the sentence parameter in English.\nFor example: *@C3PO translate HELLO_WORLD hello world*\nwill return: *HELLO_WORLD,,hello world,hola mundo,ciao mondo,bonjour le monde,óla mundo*';

const bot = new SlackBot({
  token: botToken,
  name: botName
});

function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}

// Start Handler
bot.on('start', () => {
  console.log('bot started');
  SendWelcome();
});

// Error Handler
bot.on('error', (err) => {
  console.log(err);
});

// Message Handler
bot.on('message', data => {
  if (data.type !== 'message') {
    return;
  }

  var author = getUserById(data.user);
  handleMessage(data.text, author);
});

function getUserById(id) {
  return bot.users.filter(function (user) {
      return user.id == id;
  })[0];
}

// ------------------------------------------------------------------------
// ------------------------------------------------------------------------

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (text) {
  if (text.includes('answer'))
  {
    var split = text.split(' | ');

    if ((split.length > 2) && split[0] == 'answer')
    {
      if (split[1] == 'channel')
      {
        bot.postMessageToChannel(split[2], split[3]);
      }
      else (split[1] == 'user')
      {
        bot.postMessageToUser(split[2], split[3]);
      }
    }
  }
});

// ------------------------------------------------------------------------
// ------------------------------------------------------------------------

// Response to data
function handleMessage(message, author) {
  console.log(author.name + ': ' + message);
  var split = message.split(' ');

  var command = false;
  var sentence = '';
  var key = '';

  for (var i = 0; i < split.length; i++)
  {
    if (i == 1)
    {
      if (split[i] == 'translate')
        command = true;
    }
    else if (i == 2)
    {
      key = split[i];
    }
    else if (i > 2)
    {
      if (i == split.length - 1)
      {
        sentence += split[i];
      } 
      else
      {
        sentence += split[i] + ' ';
      }
    }
  }

  if (command)
  {
    console.log('------------ Starting translation ------------');
    console.log('Key: ' + key);

    sentence = sentence.replace('Spike', '{0}');

    console.log('Source: ' + sentence);

    var result = key + ',,' + sentence;
    
    translate(sentence, { to: 'es' }).then(res => {
      console.log('Spanish: ' + res.text);
      result += ',' + res.text;

      translate(sentence, { to: 'it' }).then(res2 => {
        console.log('Italian: ' + res2.text);
        result += ',' + res2.text;
  
        translate(sentence, { to: 'fr' }).then(res3 => {
          console.log('French: ' + res3.text);
          result += ',' + res3.text;
    
          translate(sentence, { to: 'pt' }).then(res4 => {
            console.log('Portuguese: ' + res4.text);
            result += ',' + res4.text;

            console.log('----------------------------------------------');
      
            bot.postMessageToChannel(channel, result);
          }).catch(err4 => {
            console.error(err);
            bot.postMessageToChannel(channel, 'Error translating to Portuguese: ' + err4);
            SendTip();
          });
        }).catch(err3 => {
          console.error(err);
          bot.postMessageToChannel(channel, 'Error translating to French: ' + err3);
          SendTip();
        });
      }).catch(err2 => {
        console.error(err);
        bot.postMessageToChannel(channel, 'Error translating to Italian: ' + err2);
        SendTip();
      });
    }).catch(err => {
      console.error(err);
      bot.postMessageToChannel(channel, 'Error translating to Spanish: ' + err);
      SendTip();
    });
  }
}

function SendWelcome()
{
  bot.postMessageToChannel(channel, tipMessage);
}

function SendTip()
{
  bot.postMessageToChannel(channel, tipMessage);
}