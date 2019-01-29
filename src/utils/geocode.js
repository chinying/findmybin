import axios from 'axios'

let search = function(searchTerm) {
  let token = process.env.MAPBOX_ACCESS_TOKEN;
  let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchTerm}.json?access_token=${token}&bbox=103.6182, 1.1158, 104.4085, 1.4706`
  return axios.get(url)
}

export { search }