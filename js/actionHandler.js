const { updateData } = require("./updateData.js");
const querystring = require('querystring');
const Extra = require('telegraf/extra')
const Keyboards = require('../Keyboards/inlineKeyboards')
const { actions } = require("./actionList");
const config = require('../config')

module.exports.actionHandler = bot => {

    const states = Object.values(config.states)
  // bot.action([/answer[0-3]/, /next/, /quit/], ctx => {
  //   actions(ctx, ctx.match[0]);
  // })
  bot.action('states', ctx => {ctx.editMessageText('What state you are? Select below or type your city',
      Extra.HTML().markup( m => Keyboards.inlineStates(m))) }
  )

  bot.action('cancel', ctx => {
        ctx.deleteMessage( ctx.update.callback_query.message.message_id )
      }
  )
    bot.action(states, async ctx => {
            let state = ctx.match

            let data = await updateData(state);
            data.shift();
            let html = '';
              data.forEach(element => {
                  element.physical_address.forEach( address => {
                      let name = element.name
                      let description = element.description
                      let address1 = address.address_1
                      let city = address.city
                      let telephone = element.phones.number
                      let ext = element.phones.extension
                      let queryCity = querystring.escape(`${city}`)
                      let queryAddress = querystring.escape(`${address1}`)
                      let googleUrl = `https://maps.google.com/?q=${state}+${queryCity}+${queryAddress}`
                      html = `Name: <b>${name}</b>
Description: <i>${description}</i>
Address: <u>${city} ${address1}</u>
Phone: <u>${telephone || "None"}</u> Ext: <u>${ext || "None"}</u>
<a href="${googleUrl}">Map URL</a>`
                                    }
                                )
                  ctx.replyWithHTML(`${html}`, Extra.HTML().markup(m => Keyboards.inlineLocation(m)))
                  }


              )

        }
    )

    bot.action('savelocation', ctx => {
        let text = ctx.callbackQuery.message.text
        if (!ctx.dynamoSession.locations) ctx.dynamoSession.locations = []; // Initialization for new users
        if(ctx.dynamoSession.locations.indexOf(text) !== -1){
            ctx.reply('This location is already saved')
        } else {
            ctx.dynamoSession.locations.push( text )
            console.log(ctx.dynamoSession.locations.length)
            ctx.reply('This location was successfully saved')

        }


    })

}

function* getList(data, maxNumber) {

    while (data)
        yield index++;
}

function displyList(data) {
    let html = ''
    data.forEach( function (element) {
        element.physical_address.forEach( address => {
            let name = element.name
            let description = element.description
            let address1 = address.address_1
            let city = address.city
            let telephone = element.phones.number
            let ext = element.phones.extension
            let queryCity = querystring.escape(`${city}`)
            let queryAddress = querystring.escape(`${address1}`)
            let googleUrl = `https://maps.google.com/?q=${queryCity}+${queryAddress}`
            html += `<i>************</i>
Name: <b>${name}</b>
Description: <i>${description}</i>
Address: <u>${city} ${address1}</u>
Phone: <u>${telephone || "None"}</u> Ext: <u>${ext || "None"}</u>
<a href="${googleUrl}">Map URL</a>`
        }
        )
    }

    )
    return html

}