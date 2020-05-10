const { readS3 } = require('./s3.js')
const { getData } = require('./getData.js')
require('dotenv').config()


module.exports.updateData = async (state) => {

  console.log('Data checking updates...')
  let data;
  try {
    data = await readS3(state)
    data = JSON.parse(data.data.Body.toString())
  } catch (e) {
    console.log('not succesful data read from S3')
    console.log(e)
  }
  if (data.statusCode == '200') {
    let now = Date.parse(new Date())
    let dataTimestamp = Date.parse(data[0].timestamp)
    let deltaTime = (now - dataTimestamp)/60000 ; // Result in min
    if (deltaTime > process.env.maxDeltaTime) { // deltaTime > process.env.maxDeltaTime
      console.log('Updating data...');
      return await getData(state)
    }
    return data
  } else {
    // Create data.json
    console.log('call getData')
    return await getData(state)
  }


}

