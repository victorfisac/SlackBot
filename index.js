const SlackBot = require('slackbots');
const translate = require('@k3rn31p4nic/google-translate-api');

const botToken = 'xoxb-94313697859-783296825408-XN7dDIU39UAyjHl7CYIAEJsW';
const botName = 'C3PO';

// const botToken = 'xoxb-755822931329-761825468228-LfTpeRnPxa6RX3oxrnMvyiSl';
// const botName = 'JARVIS';

const channel = 'game-developers-translations';
const welcomeMessage = 'Hello! I am C3PO, human cyborg relations... \n*Use @C3PO translate KEY {sentence to translate}* (without {}) and I will translate it to *Spanish, Italian, French and Portuguese*.\nRemember to write the sentence parameter in English.\nFor example: *@C3PO translate HELLO_WORLD hello world*\nwill return: *HELLO_WORLD,,hello world,hola mundo,ciao mondo,bonjour le monde,óla mundo*';

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

  handleMessage(data.text);
});

// Response to data
function handleMessage(message) {
  
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

  console.log('Is Translate Command? - ' + command);

  if (command)
  {
    console.log('Key: ' + key);

    sentence = sentence.replace('Spike', '{0}');

    console.log('Source text: ' + sentence);

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

function SendTip()
{
  bot.postMessageToChannel(channel, welcomeMessage);
}