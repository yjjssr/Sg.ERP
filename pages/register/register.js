// pages/register/register.js
const ajax = require('../common/ajax.js')
const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
let login = function(param) {
  return new Promise((resolve,rject)=>{
    ajax.post('/api/Staff/Login', { //根据login的返回结果来决定是否需要跳转到登录
      OpenID: wx.getStorageSync("openId")
    }).then(res => {
      if (res.state == 1) {
        let resData = res.data
        app.globalData.loginInfo = resData
        resolve()

      } else {
        Toast.fail(res.data);

      }
    })
  })
  
}
let isCertification = function(_this) {
  return new Promise((resolve, rject) => {
    if (app.globalData.loginInfo) {
      // app.globalData.loginInfo.isAuthentication = false

      _this.setData({
        isCertification: app.globalData.loginInfo.isAuthentication
      })
      // console.log(_this.data)
    } else {
      ajax.post('/api/Staff/Login', { //根据login的返回结果来决定是否需要跳转到登录
        OpenID: wx.getStorageSync("openId")
      }).then(res => {
        if (res.state == 1) {
          let resData = res.data
          app.globalData.loginInfo = resData
          // res.data.isAuthentication=false
          _this.setData({
            isCertification: resData.isAuthentication
          })
          resolve()

          // console.log(_this.data)

        } else {
          Toast.fail(res.data);

        }
      })
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
let certification = function(_this) {
  if (!_this.data.isCertification) {
    let paramObj = {
      "OpenID": wx.getStorageSync("openId"),
      "PhoneNO": _this.data.phoneNumber
    }
    ajax.post('/api/Staff/Certificate', paramObj).then(res => {
      if (res.state == 1) {
        login().then(()=>{
          wx.reLaunch({
            url: '../index/index',
          })
        })
        
      } else {
        Toast.fail(res.data);
      }
    })
  } else {
    wx.reLaunch({
      url: '../index/index',
    })
  }



}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    phoneNumber: '',
    phoneErrorMessage: '',
    isCertification: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    if (wx.getStorageSync("openId")) {
      isCertification(_this)
    } else {
      app.openIdAndKeyReadyCallback = res => {
        isCertification(_this)
      }
    }
    console.log(_this.data)
  },

  onPhoneChange: function(e) {
    let phoneNumber = e.detail
    let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (phoneNumber.length >= 11 && !phoneReg.test(phoneNumber)) {
      this.setData({
        phoneErrorMessage: "手机号格式错误"
      })
    } else {
      this.setData({
        phoneErrorMessage: "",
        phoneNumber
      })
    }
  },
  getUserInfo: function(e) {
    let _this = this
    this.setData({
      userInfo: e.detail.userInfo,
      // hasUserInfo: true
    })
    app.globalData.encryptedData = e.detail.encryptedData
    app.globalData.iv = e.detail.iv
    app.globalData.userInfo = e.detail.userInfo
    console.log(app.globalData)
    let paramObj = {
      "encryptedData": app.globalData.encryptedData,
      "iv": app.globalData.iv,
    }
    if (wx.getStorageSync("session_key")) {
      paramObj.session_key = wx.getStorageSync("session_key")
      ajax.post("/api/WX/Decrypt", paramObj).then(res => {
        if (res.state == 1) {
          app.globalData.unionId = res.data.unionId
          if (!app.globalData.loginInfo.isRegister) {
            registerMember(app.globalData.userInfo).then(() => {
              certification(_this)
             
            })
          }else{
            wx.reLaunch({
              url: '../index/index',
            })
          }

        } else {
          console.log("解码unionId失败")
        }
      })

    } else {
      app.openIdAndKeyReadyCallback = res => {
        paramObj.session_key = res.session_key
        ajax.post("/api/WX/Decrypt", paramObj).then(res => {
          if (res.state == 1) {
            app.globalData.unionId = res.data.unionId
            if (!app.globalData.loginInfo.isRegister) {
              registerMember(app.globalData.userInfo).then(() => {
                certification(_this)
              })
            }else{
              wx.reLaunch({
                url: '../index/index',
              })
            }
            // certification(_this)
          } else {
            console.log("解码unionId失败")
          }
        })
      }
    }
  },
  registerAndCheck: function() {
    certification(this)
  }
})