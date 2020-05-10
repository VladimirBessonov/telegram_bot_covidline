const { updateData } = require("./updateData.js");
const querystring = require('querystring');
const config = require('../config')
const Keyboards = require('../Keyboards/inlineKeyboards')
const Extra = require('telegraf/extra')
const { asyncForEach } = require('../lib/utilities')
const { capitalize} = require('../lib/utilities')

module.exports.inlineHandler = bot => {
  bot.on('inline_query', async ctx => {
    ctx.answerInlineQuery( await resultConstructor(ctx) )
  })

}

async function resultConstructor(ctx) {
  let textMsg = ctx.inlineQuery.query.toLowerCase()
  console.log(textMsg)
  await findLocation(ctx, textMsg)
}


const onFailure = async (ctx) => {
  let user = ctx.inlineQuery.from
  let id = ctx.inlineQuery.id
  let query = ctx.inlineQuery.query
  let apiUrl = "https://covid-19-apis.postman.com/covid-19-testing-locations"
  return [{
    type: 'article',
        id: Math.random().toString(),
      title: `Covid19 Test Locations in ${query}`,
      description: `You seatch test locations with Bot at ${query}`,
      thumb_url: ``,
      input_message_content: {
    message_text: `${user.first_name}, unfortunately no locations was found using <a href="${apiUrl}"> this course</a>`,
        parse_mode: 'HTML'
  }
  }]
}

const onSuccess = async (addresses, ctx )=> {
  addresses.forEach( element => {

    let name = element.name
    let description = element.description
    let address = element.physical_address[0].address_1
    let city = element.physical_address[0].city
    let telephone = element.phones.number
    let ext = element.phones.extension
    let queryCity = querystring.escape(`${city}`)
    let queryAddress = querystring.escape(`${address}`)
    let state = element.physical_address[0].state_province
    let googleUrl = `https://maps.google.com/?q=${state}+${queryCity}+${queryAddress}`

    let html =  `Name: <b>${name}</b>
        Description: <i>${description}</i>
        Address: <u>${city} ${address}</u>
        Phone: <u>${telephone || "None"}</u> Ext: <u>${ext || "None"}</u>
        <a href="${googleUrl}">Map URL</a>`;

    // ctx.replyWithHTML(`${html}`, Extra.HTML().markup(m => Keyboards.inlineLocation(m)))
  })

};
// how to improve search time?
const findLocation = async (ctx, textMsg) => {
  if (textMsg.includes('find')) {
    let data = []
    let states = Object.values(config.states)
    let msg = textMsg.replace('find', '').replace('location', '').trim();

    msg = capitalize(msg)
    // ctx.reply(`Looking for ${msg}`)
    // ctx.reply('Loading the data...')
    data = await asyncForEach(states, updateData)

    let cityAdreeses = []
    console.log(typeof data)
    data.forEach(state => {

      state.forEach(record => {
        if (record.physical_address) {
          record.physical_address.forEach(address => {
            if (address.city == msg) {
              cityAdreeses.push(record)
            }
          })
        }
      })
    })
    // ctx.reply('Filtering ...')
    let queryFound;
    // ctx.reply('List of test locations:')
    if (cityAdreeses.length > 0) {
      queryFound = true

      await onSuccess(cityAdreeses, ctx)
    }

    if (!queryFound) {
     await onFailure(ctx)
    }
  }

}
