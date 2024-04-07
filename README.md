# chatgpt-whatsapp-bot
chatgpt integration into a whatsapp bot

**Do not use your main account/phone number as the bot account. You will be banned eventually**.

https://icantsec.com/?p=92

npm i --save venom-bot openai


**For the basic functionality**, after updating the openAI api key and bot's phone number it'll work, just run it, scan the QR code, and add it to a group chat. Interact with it by tagging the bot at the beginning of the message ("@phone_number_here"), and it will "reply" to your message. For more fun, adjust the system message and add descriptions of each person in the group chat so that it can provide personalized messages like so:
![image](https://github.com/icantsec/chatgpt-whatsapp-bot/assets/128331200/5d9ff8b5-2a17-444d-a19e-cbd9be00e579)



**For the full functionality version (full_feature.js), the following functionality is added:**
1. Context
2. Per-group system instruction
3. Hard-coded phone-name map

**Context**:
Takes into account previous messages in the reply chain. I set this to 4 and it seems to work pretty well (ChatGPT tends to summarize what was previously said when responding, so a 2 levels of context should also be fine)

**Per-group system instruction**:
You can add group IDs to check for to change the system instructions, for cases such as different personalities per group, or different user descriptions per group, etc, as well as a default system instruction.

**Phone-name map:**
Adds the user's name to the end of the message (hard-coded phone number to name map) so that it can provide personalized responses by knowing who asked the question. It tends to focus a lot on this and can get old, so feel free to remove it.

Enjoy
