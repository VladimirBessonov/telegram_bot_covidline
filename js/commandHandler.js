const { updateData } = require("./updateData.js");
const Extra = require('telegraf/extra')
const Keyboards = require('../Keyboards/inlineKeyboards')

// const { numRounding } = require("./numRounding.js");
// const { emoji } = require("./emoji.js")
// const { quiz } = require("./quiz.js")

module.exports.commandHandler = bot => {
  // /start

  bot.start(ctx =>
    ctx.reply(`Hello, ${ctx.from.first_name} !\nFor more info see /help`)
  );

  // /help

  bot.help(ctx => ctx.reply(`Hello, ${ctx.from.first_name}, I can help you to find Covid 19 test locations in your city.
I use free API <a href="https://covid-19-apis.postman.com/covid-19-testing-locations/"><b>COVID-19 Testing Locations</b></a>
/testlocations - will show locations filtered by state
/savedlocations - will show you the locations you saved
or you can simply type <u>find cityname </u> and I will display you the locations
I find`, Extra.HTML())
  );

  bot.command('testlocations', async ctx => {
        ctx.reply('What state you are? type or select, see by states or just type your city', Extra.HTML().markup( m => Keyboards.inlineStates(m)) )
      }

  )

  bot.command('savedlocations', async ctx => {
    if (ctx.dynamoSession.locations) {
      if (ctx.dynamoSession.locations.length > 0) {
        ctx.reply(`Your previously saved locations`)
        ctx.dynamoSession.locations.forEach(location => {
              ctx.reply(`${location}`)
            }
        )
      } else {
        ctx.reply(`Your list is empty, type <i>find cityName</i> and save it`, Extra.HTML())
      }
    } else {
      ctx.reply(`Your list is empty, type <i>find cityName</i> and save it`, Extra.HTML())
    }

  })

  bot.command('empty', async ctx =>
      {
        if (ctx.dynamoSession.locations) {
          if (ctx.dynamoSession.locations.length > 0) {
            ctx.dynamoSession.locations = []
            ctx.reply(`Your list is empty now`)
          } else {
            ctx.reply(`Your list is empty, safe something first before emptying it`, Extra.HTML())
          }
        }
      }
  )


  // // /top10 - List of TOP 10 cryptocurrency
  //
  // bot.command("top10", async ctx => {
  //   await commandTop10(ctx);
  // });
  //
  // // /top50 - List of TOP 50 cryptocurrency
  //
  // bot.command("top50", async ctx => {
  //   await commandTop50(ctx);
  // });
  //
  // // /quiz - Crypto Quiz Game
  //
  // bot.command("quiz", async ctx => {
  //   await quiz(ctx);
  // });

};

const commandTop10 = async ctx => {
  let data = await updateData();
  data = data.data.slice(0, 10);
  let replyMsg = "";

  data.forEach((element, index) => {
    let price = numRounding(element.quote.USD.price);
    let change24 = numRounding(element.quote.USD.percent_change_24h);

    replyMsg =
      replyMsg +
      `${index + 1} _${element.name}_ : *${price}$* _Change 24h_ : *${change24}%*${emoji(change24)}\n\n`;
  });

  ctx.replyWithMarkdown(replyMsg);
};

const commandTop50 = async ctx => {
  let data = await updateData();
  data = data.data.slice(0, 50);
  let replyMsg = "";

  data.forEach((element, index) => {
    let price = numRounding(element.quote.USD.price);
    let change24 = numRounding(element.quote.USD.percent_change_24h);

    replyMsg =
      replyMsg +
      `${index + 1} _${
        element.name
      }_ : *${price}$* _Change 24h_ : *${change24}%*\n`;
  });

  ctx.replyWithMarkdown(replyMsg);
};
