const venom = require('venom-bot');//https://github.com/orkestral/venom
const OpenAI = require("openai");

const phone_number = "@11111111111"//bot phone number here (with the @)

const openai = new OpenAI({apiKey: "your-openai-key"});


venom
  .create({
    session: 'session-name'
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage((message) => {
    console.log(message);
    if (message.body.startsWith(phone_number)) {
        message_text = message.body.split(phone_number)[1]//message without the "@bot"
        get_response(message_text)
        .then((resp) =>
            send_message(client, message, resp)
        )
        .catch(error => console.log(error));
    }
  });
}

function send_message(client, responding_to, response) {
    client
    .reply(responding_to.from, response, responding_to.id)//change to .sendText(responding_to.from, resp) if you dont want it to "reply" directly to the message
    .then((result) => {
        console.log('Result: ', result);
    })
    .catch((erro) => {
        console.error('Error when sending: ', erro);
    })
}

async function get_response(user_message) {
    
    const completion = await openai.chat.completions.create({

      model: "gpt-3.5-turbo",
      messages: [
        {
        role: "system",
        content: "You are a funny addition to a group chat where you will respond to questions satirically in order to fit in."
        },
        {
        role: "user",
        content: user_message,
      }],
    });
    
    return completion.choices[0].message.content;

  }
