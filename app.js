//app.js
const ajax = require('./pages/common/ajax.js')
App({
  globalData: {
    encryptedData: '',
    userInfo: null,//微信授权后获取的用户信息
    iv: '',////微信授权后获取的秘钥
    unionId: '',//调用接口解析得到的unionId
    customInfo:null,//调用获取用户信息接口返回信息
    loginInfo:null//调用登录接口之后返回的信息
  },
  onLaunch: function() {
    let _this = this
    wx.getSystemInfo({ //自定义导航栏尺寸不可删除
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        if (custom){
          this.globalData.Custom = custom;
          this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        }else{
           this.globalData.CustomBar=e.statusBarHeight+50;
        }
    
      }
    })
    wx.login({
      success(res) {
        if (res.code) {
          ajax.post('/api/WX/GetOpenID', {
            Code: res.code
          }).then(res => {
            if (res.state == 1) {
              let resData = res.data
              wx.setStorageSync("openId", resData.openid) //缓存openId
              wx.setStorageSync("session_key", resData.session_key) //缓存session_key
              if (_this.openIdAndKeyReadyCallback) {
                _this.openIdAndKeyReadyCallback(resData)
              }
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                      success: res => {
                        // wx.setStorageSync("userInfo", res.userInfo)
                        _this.globalData.encryptedData = res.encryptedData
                        _this.globalData.iv = res.iv
                        _this.globalData.userInfo = res.userInfo
                        if (_this.userInfoReadyCallback) {
                          _this.userInfoReadyCallback(_this.globalData)
                        }
                        let paramObj = {
                          "encryptedData": _this.globalData.encryptedData,
                          "iv": _this.globalData.iv,
                          "session_key": wx.getStorageSync("session_key")
                        }
                        ajax.post("/api/WX/Decrypt", paramObj).then(res => {
                          if (res.state == 1) {
                            _this.globalData.unionId = res.data.unionId
                            if (_this.unionIdReadyCallback) {
                              _this.unionIdReadyCallback(_this.globalData)
                            }
                          } else {
                            console.log("解码unionId失败")
                          }
                        })
                      }
                    })
                  }
                }
              })
            } else {
              console.log("获取openId失败")
            }
          })
        } else {
          console.log("获取code失败")
        }
      }
    })
  },
  checkSession: function() {
    wx.checkSession({
      fail() {
        wx.login({
          success(res) {
            if (res.code) {
              ajax.post('/api/WX/GetOpenID', {
                Code: res.code
              }).then(res => {
                if (res.state == 1) {
                  let resData = res.data
                  wx.setStorageSync("openId", resData.openid) //缓存openId
                  wx.setStorageSync("session_key", resData.session_key) //缓存session_key
                  if (_this.openIdAndKeyReadyCallback) {
                    _this.openIdAndKeyReadyCallback(resData)
                  }
                  wx.getSetting({
                    success: res => {
                      if (res.authSetting['scope.userInfo']) {
                        wx.getUserInfo({
                          success: res => {
                            // wx.setStorageSync("userInfo", res.userInfo)
                            _this.globalData.encryptedData = res.encryptedData
                            _this.globalData.iv = res.iv
                            _this.globalData.userInfo = res.userInfo
                            if (_this.userInfoReadyCallback) {
                              _this.userInfoReadyCallback(_this.globalData)
                            }
                            let paramObj = {
                              "encryptedData": _this.globalData.encryptedData,
                              "iv": _this.globalData.iv,
                              "session_key": wx.getStorageSync("session_key")
                            }
                            ajax.post("/api/WX/Decrypt", paramObj).then(res => {
                              if (res.state == 1) {
                                _this.globalData.unionId = res.data.unionId
                                if (_this.unionIdReadyCallback) {
                                  _this.unionIdReadyCallback(_this.globalData)
                                }
                              } else {
                                console.log("解码unionId失败")
                              }
                            })
                          }
                        })
                      }
                    }
                  })
                } else {
                  console.log("获取openId失败")
                }
              })
            } else {
              console.log("获取code失败")
            }
          }
        })
      }
    })
  },
  isReLaunchToIndex: function() {
    wx.checkSession({
      fail() {
        wx.reLaunch({
          url: './pages/index/index',
        })
      }
    })
  }
})