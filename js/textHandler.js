const { updateData } = require("./updateData.js");
const querystring = require('querystring');
const config = require('../config')
const Keyboards = require('../Keyboards/inlineKeyboards')
const Extra = require('telegraf/extra')
const { asyncForEach } = require('../lib/utilities')
const { capitalize} = require('../lib/utilities')

module.exports.textHandler = bot => {
  bot.on("text", async ctx => {
    let textMsg = ctx.message.text.toLowerCase()
    await findLocation(ctx, textMsg)

  })
};

const findLocation = async (ctx, textMsg) => {
  if (textMsg.includes('find')) {
    let data = []
    let states = Object.values(config.states)
    let msg = textMsg.replace('find', '').trim();

    msg = capitalize(msg)
    ctx.reply(`Looking for ${msg}`)
    ctx.reply('Loading the data...')

    data = await asyncForEach(states, updateData)

    let cityAdreeses = []

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
    ctx.reply('Filtering ...')
    let queryFound;

    if (cityAdreeses.length > 0) {
      queryFound = true
      ctx.reply('List of test locations:')
      onSuccess(cityAdreeses, ctx)
    }

    if (!queryFound) {
      ctx.reply('Can\'t find data\nSee /help');
    }
  }

}

const onSuccess =   (addresses, ctx )=> {

  for (const element of addresses) {
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

    ctx.replyWithHTML(`${html}`, Extra.HTML().markup(m => Keyboards.inlineLocation(m)))
  }

//   addresses.forEach( element => {
//
//     let name = element.name
//     let description = element.description
//     let address = element.physical_address[0].address_1
//     let city = element.physical_address[0].city
//     let telephone = element.phones.number
//     let ext = element.phones.extension
//     let queryCity = querystring.escape(`${city}`)
//     let queryAddress = querystring.escape(`${address}`)
//     let state = element.physical_address[0].state_province
//     let googleUrl = `https://maps.google.com/?q=${state}+${queryCity}+${queryAddress}`
//
//     let html =  `Name: <b>${name}</b>
// Description: <i>${description}</i>
// Address: <u>${city} ${address}</u>
// Phone: <u>${telephone || "None"}</u> Ext: <u>${ext || "None"}</u>
// <a href="${googleUrl}">Map URL</a>`;
//
//     ctx.replyWithHTML(`${html}`, Extra.HTML().markup(m => Keyboards.inlineLocation(m)))
//   })

};