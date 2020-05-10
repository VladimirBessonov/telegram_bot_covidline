const config = require('../config')
const {getData} = require('./getData')

const states = Object.values(config.states)

const init = () => {
    states.forEach( state => {
        getData(state)
    })
}

module.exports = {init}
