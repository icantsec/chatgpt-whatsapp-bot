//this one includes 'context' (previous messages in the reply chain), per-group personality adjustment, and per-user personalized messages

const venom = require('venom-bot');//https://github.com/orkestral/venom
const OpenAI = require("openai");

const phone_number = "@11111111111"//bot phone number here (with the @)

const openai = new OpenAI({apiKey: "your-openai-key"});

//number of previous messages to include as context, context meaning each message in the current chain of "replying"
const context_layers = 4;//Since ChatGPT tends to summarize key points when responding, 4 is plenty for most cases.

const use_context = true;

const system_message_crooai = {//system instructions for group chat "A"
        role: "system",
        content: "You are a funny addition to a group chat where you will respond to questions satirically in order to fit in."
}
const system_message_gymbro = {//system instructions for group chat "B"
        role: "system",
        content: "My name is GymAI. You love working out and giving solid workout advice." +//ChatGPT gets buggy if you don't use the "My" and "You"'s as shown here, even though they are inconsistent.
        ""
}

const gym_chat = "XXX@g.us";//group chat ID of group chat "B" (print 'message.from' on a received message to find it)


var system_message = system_message_crooai;//default to group chat "A" system instructions

const phone_map = {//map known phone numbers to names, you can add details about each person in the system instructions to get personalized responses
    "1xxx": "Name1",
    "2xxx": "Name2",
}

/*
create the venom session
this will run whatsapp web in a headless browser by default, and provide you a QR code to scan in the terminal
*/
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
    //console.log(message);//helpful for getting group info
    if (message.body.includes(phone_number)) {//only respond if they @ the bot
        if(message.from == gym_chat) {//set to the correct system instructions
            system_message = system_message_gymbro;
        } else {
            system_message = system_message_crooai;
        }
        message_send = get_context(message)//get the context that the bot is replying to
        get_response(message_send)
        .then((resp) =>
            send_message(client, message, resp)
        )
        .catch(error => console.log(error));
    }
  });
}

function get_context(message) {
    context = [];
    obj = message;
    layers_deep = 0;
    //check if there is another message in the chain and if we reached our context limit
    while("quotedMsg" in obj && layers_deep < context_layers) {
       
        obj = obj.quotedMsg;//previous message in the chain
      
        from = "unknown"
        if("sender" in obj && "id" in obj.sender) {
            from = obj.sender.id.split("@")[0]//get phone number
        } else {
            from = phone_number;//if there isn't an ID, its our (bot's) message
        }
        if("@"+from == phone_number || from == phone_number) {//message is from ourselves (the bot), so we indicate that using the 'assistant' role
            context.push({
                role: "assistant",
                content: obj.body
            })
        } else {
            cleaned_message = clean_usr_message(obj.body, from);//remove the '@bot' from the message and check the phone map to see if we know this user
            context.push({
                role: "user",//indicate this is a user prompt
                content: cleaned_message
            })
        }
        layers_deep++;
    }
    context.push(system_message);
    context.reverse();//oops wrong way

    newest = clean_usr_message(message.body, message.author.split("@")[0]);//latest message

    context.push({
       role: "user",
       content: newest 
    });

    return context;
}

function clean_usr_message(message, from) {//remove phone # and add name from phone map if exists
    message = message.replace(phone_number, "");
    
    if(from in phone_map) {

        message = phone_map[from] + ": " + message;
    }
    return message;
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

async function get_response(user_context) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: user_context,
    });
    return completion.choices[0].message.content;
  }
