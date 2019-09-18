const SlackBot = require('slackbots');
const translate = require('@k3rn31p4nic/google-translate-api');

const botToken = 'xoxb-755822931329-761825468228-LfTpeRnPxa6RX3oxrnMvyiSl';
const botName = 'JARVIS';

const channel = 'slack-tools';
const welcomeMessage = 'Buenos días, señor!';
const response = 'Es el 30 de septiembre, señor.';

const bot = new SlackBot({
  token: botToken,
  name: botName
});

// Start Handler
bot.on('start', () => {
  bot.postMessageToChannel(channel, welcomeMessage);
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
  if (message.includes(' cumple')) {
    Send(channel, response);
  }
}

// Send message to channel
function Send(channel, response)
{
  translate('Mi nombre es Victor', { to: 'en' }).then(res => {
    console.log(res.text);
    bot.postMessageToChannel(channel, res.text);
  }).catch(err => {
    console.error(err);
    bot.postMessageToChannel(channel, err);
  });
}