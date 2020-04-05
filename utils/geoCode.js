const NodeGeocoder = require('node-geocoder');
const log = require('../utils/log');

  const options = {
      provider: 'mapquest',
      httpAdpter: 'https',
      apiKey: process.env.MAP_API_KEY,
      formatter: null
    };

  module.exports = {
    geoLocation: async(address)=>{
      const geoCoder = NodeGeocoder(options);
      return geoCoder.geocode(address);
    }
  }
  
 


