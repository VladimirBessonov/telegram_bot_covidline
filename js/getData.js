const config = require('../config')
const rp = require('request-promise')
const { writeS3 } = require('./s3.js')

const requestOptions = (state) => {
    return {
        method: 'GET',
        uri: `https://covid-19-testing.github.io/locations/${state}/complete.json`,
        qs: {
            start: 1,
            limit: 5000,
            // convert: 'USD'
        },
        // headers: {
        //     'X-CMC_PRO_API_KEY': process.env.API_KEY
        // },
        json: true,
        gzip: true
    }
}

const getData = async (state) => {
    try {
        let response = await rp(requestOptions(state));
        response.unshift({timestamp: new Date().getUTCMilliseconds()})
        await writeS3(response, state);
        return response;
    } catch (err) {
        console.log("API call error: ", err.message);
    }
}


module.exports = {
    getData
};

