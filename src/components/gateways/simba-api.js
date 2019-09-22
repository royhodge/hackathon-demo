import axios from 'axios'

const HTTP = axios.create({
  baseURL: 'https://api.simbachain.com/v1/bkc2/',
  headers: {
    'APIKEY': 'bd1778befa1733cdff7d3e752826268e49841ffb295fe5eb617c21ff661bf42c'
  }
})

export default {
  getData (name) {
    HTTP.defaults.headers.common['Content-Type'] = 'multipart/form-data'
    return HTTP.get(name)
  },
  postData (name, data) {
    HTTP.defaults.headers.common['Content-Type'] = 'multipart/form-data'
    return HTTP.post(name, data)
  },
  signTxn (name, data) {
    HTTP.defaults.headers.common['Content-Type'] = 'application/json'
    return HTTP.post(name, data)
  }
}
