const config = require('./config.js');
let ajaxObj = {
  get: function(manualhost,url, param) {
    let urlStr = ''
    let queryStr = ''
    if (param) {
      let query = ''
      for (let [k, v] of Object.entries(param)) {
        query += `&${k}=${v}`
      }
      queryStr = query.replace(/\&/, "?")
    }
    urlStr = manualhost ? `${config.host}/${url}${queryStr}` : `${url}${queryStr}`
    // urlStr = `${config.host}/${url}${queryStr}`
    return new Promise((resolve, reject) => {
      wx.request({
        url: urlStr, //仅为示例，并非真实的接口地址
        complete(res) {
          if (res.statusCode != 200){
            wx.showToast({
              title: '接口调用失败',
              // icon: 'success',
              image:'../../images/fail.png',
              duration: 2000
            })
            reject(res)
          }
          resolve(res)
          // res.statusCode == 200 ?  resolve(res) : reject(res)
        }
      })
    })
  },
  post: function(url, param) {
    let urlStr = `${config.host}${url}`
    return new Promise((resolve, reject) => {
      wx.request({
        url: urlStr, //仅为示例，并非真实的接口地址
        data: param,
        method: 'POST',
        complete(res){
          if (res.statusCode != 200) {
            wx.showToast({
              title: '接口调用失败',
              image: '../../images/fail.png',
              duration: 2000
            })
            reject(res)
          }
          resolve(res.data)
        }
      })
    })

  }
}

module.exports = ajaxObj;