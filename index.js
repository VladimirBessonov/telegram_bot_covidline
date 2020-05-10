require('dotenv').config()
const express = require('express')
const serverless = require('serverless-http')
const Telegraf = require('telegraf')
const DynamoDBSession = require('telegraf-session-dynamodb');
const session = require("telegraf/session");
const axios = require('axios')
const { commandHandler } = require("./js/commandHandler.js");
const { actionHandler } = require("./js/actionHandler")
const { textHandler } = require("./js/textHandler")
const { inlineHandler } = require("./js/inlineHandler")

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(Telegraf.log())
const dynamoDBSession = new DynamoDBSession({
    property: "dynamoSession",
    dynamoDBConfig: {
        params: {
            TableName: process.env.AWS_DYNAMODB_TABLE
        },
        region: process.env.AWS_REGION
    }
});

bot.use(dynamoDBSession.middleware()); // ctx.dynamoSession
bot.use(session())
// Inline Handler
inlineHandler(bot);

// Command Handler
commandHandler(bot);

// Text Handler
textHandler(bot);

// Action Handler
actionHandler(bot);

const IS_LOCAL = process.env.IS_LOCAL;

if (IS_LOCAL) {
    bot.launch();
    console.log('Bot running locally')
} else {
    bot.telegram.setWebhook(`${process.env.GW_URL}/bot${process.env.BOT_TOKEN}`);
    bot.startWebhook(`/bot${process.env.BOT_TOKEN}`);

    console.log(`Bot running on ${process.env.GW_URL}`)
    const app = express();
    app.get('/', (req, res) => res.send(`Bot running on ${process.env.GW_URL}`));
    app.use(bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));
    module.exports.handler = serverless(app);
}
//