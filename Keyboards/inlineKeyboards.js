const states = require('../config').states
const utils = require('../lib/utilities')

let inlineStates = (m) => {
    let statesArr = Object.entries(states)
    let buttonArray = utils.listToMatrixKeyboard(statesArr, 5, m.callbackButton)
    return m.inlineKeyboard( buttonArray)
}
let inlineLocation = (m) => m.inlineKeyboard(
    [
        [m.callbackButton('Return to States', 'states'),m.callbackButton('Save location', 'savelocation')],
    ]
)

module.exports = {
    inlineStates,
    inlineLocation: inlineLocation
}