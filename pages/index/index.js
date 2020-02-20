//index.js
//获取应用实例
const app = getApp()
const ajax = require('../common/ajax.js')
let isRelaunchToRegister = function() {
  wx.getSetting({
    success: res => {
      if (!res.authSetting['scope.userInfo']) {
        wx.reLaunch({
          url: '../register/register'
        })
      } else {
        if (app.globalData.loginInfo) {
          let resData = app.globalData.loginInfo
          if (!resData.isRegister) {
            if (app.globalData.userInfo) {
              registerMember(app.globalData.userInfo).then(() => {
                if (!resData.isAuthentication) {
                  wx.reLaunch({
                    url: '../register/register'
                  })
                }
              })

            } else if (this.data.canIUse) {
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              app.userInfoReadyCallback = res => {
                registerMember(res.userInfo).then(() => {
                  if (!resData.isAuthentication) {
                    wx.reLaunch({
                      url: '../register/register'
                    })
                  }
                })
              }
            } else {
              wx.getUserInfo({
                success: res => {
                  app.globalData.userInfo = res.userInfo
                  registerMember(res.userInfo).then(() => {
                    if (!resData.isAuthentication) {
                      wx.reLaunch({
                        url: '../register/register'
                      })
                    }
                  })
                  // this.setData({
                  //   userInfo: res.userInfo,
                  //   hasUserInfo: true
                  // })
                }
              })
            }
          } else if (!resData.isAuthentication) {
            wx.reLaunch({
              url: '../register/register'
            })
          }
        } else {
          ajax.post('/api/Staff/Login', { //根据login的返回结果来决定是否需要跳转到登录
            OpenID: wx.getStorageSync("openId")
          }).then(res => {
            if (res.state == 1) {
              app.globalData.loginInfo = resData
              let resData = res.data
              if (!resData.isRegister) {
                if (app.globalData.userInfo) {
                  registerMember(app.globalData.userInfo).then(() => {
                    if (!resData.isAuthentication) {
                      wx.reLaunch({
                        url: '../register/register'
                      })
                    }
                  })

                } else if (this.data.canIUse) {
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  app.userInfoReadyCallback = res => {
                    registerMember(res.userInfo).then(() => {
                      if (!resData.isAuthentication) {
                        wx.reLaunch({
                          url: '../register/register'
                        })
                      }
                    })
                  }
                } else {
                  wx.getUserInfo({
                    success: res => {
                      app.globalData.userInfo = res.userInfo
                      registerMember(res.userInfo).then(() => {
                        if (!resData.isAuthentication) {
                          wx.reLaunch({
                            url: '../register/register'
                          })
                        }
                      })
                    }
                  })
                }
              } else if (!resData.isAuthentication) {
                wx.reLaunch({
                  url: '../register/register'
                })
              }
            } else {
              console.log("登录失败")
            }
          })
        }

      }
    }
  })
}
let registerMember = function(userInfo) {
  return new Promise((resolve, rject) => {
    let paramObj = {
      "OpenID": wx.getStorageSync("openId"),
      "Avatar": userInfo.avatarUrl,
      "Nickname": userInfo.nickName,
      "Gender": userInfo.gender,
      "Province": userInfo.province,
      "City": userInfo.city,
    }
    if (app.globalData.unionId) {
      paramObj.UnionID = app.globalData.unionId
      ajax.post('/api/Staff/RegisterMember', paramObj).then(res => {
        if (res.state == 1) {
          resolve(res)
        } else {
          console.log(注册失败)
          rject(res)
        }

      })
    } else {
      app.unionIdReadyCallback = res => {
        paramObj.UnionID = res.unionId
        ajax.post('/api/Staff/RegisterMember', paramObj).then(res => {
          if (res.state == 1) {
            resolve(res)
          } else {
            console.log(注册失败)
            rject(res)
          }
        })

      }
    }
  })
}
let getCustomInfo = function() {
  let paramObj = {
    OpenID: wx.getStorageSync("openId")
  }
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/GetPersonalInfo', paramObj).then(res => {
      if (res.state == 1) {
        app.globalData.customInfo = res.data
        if (!wx.getStorageSync("orgId")){
          wx.setStorageSync("orgId", res.data.reList[0].Org_ID) //设置默认的orgId以便接口调用
        }
        
        // console.log(wx.getStorageSync("orgId"))
        // if (app.customReadyCallBack) {
        //   app.customReadyCallBack(app.globalData)
        // }
        resolve()
      } else {
        console.log("获取用户信息失败")

      }
    })
  })



}



Page({
  data: {
    userInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    PageCur: 'basics',
  },
  onLoad: function() {
    let _this=this
    wx.removeStorageSync("orgIdChanged")//重新编译的时候要改变orgId的缓存,以此为标志来决定orgId是取初始化的还是改变后的，wx.getStorageSync不随重新编译而改变
    if (wx.getStorageInfoSync().keys.find(key => key == "openId")) {
      isRelaunchToRegister()
      // getCustomInfo().then(()=>{
      //   verifyCheck(_this.data.elements).then(data => {
      //     _this.setData({
      //       elements: data
      //     })
      //     console.log("elements的值为:")
      //     console.log(_this.data.elements)
      //   })
      // })
      getCustomInfo()
      
    } else {
      app.openIdAndKeyReadyCallback = res => {
        isRelaunchToRegister()
        getCustomInfo()
        // getCustomInfo().then(() => {
        //   verifyCheck(_this.data.elements).then(data => {
        //     _this.setData({
        //       elements: data
        //     })
        //   })
        // })
      }
    }
  },
  onShow: function() {
    app.checkSession()//这一步非常重要，不可删除 
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },


})