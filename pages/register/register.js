// pages/register/register.js
const ajax = require('../common/ajax.js')
const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
let isCertification = function(_this) {
  if (app.globalData.loginInfo){
    _this.setData({
      isCertification: app.globalData.loginInfo.isAuthentication
    })
  }else{
    ajax.post('/api/Staff/Login', { //根据login的返回结果来决定是否需要跳转到登录
      OpenID: wx.getStorageSync("openId")
    }).then(res => {
      if (res.state == 1) {
        let resData = res.data
        _this.setData({
          isCertification: resData.isAuthentication
        })
      
      } else {
        Toast.fail(res.data);
        
      }
    })
  }
 


}
let certification = function(_this) {
  if (!_this.data.isCertification) {
    let paramObj = {
      "OpenID": wx.getStorageSync("openId"),
      "PhoneNO": _this.data.phoneNumber
    }
    ajax.post('/api/Staff/Certificate', paramObj).then(res => {
      if (res.state == 1) {
        wx.reLaunch({
          url: '../index/index',
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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
      hasUserInfo: true
    })
    app.globalData.encryptedData = e.detail.encryptedData
    app.globalData.iv = e.detail.iv
    app.globalData.userInfo = e.detail.userInfo
    let paramObj = {
      "encryptedData": app.globalData.encryptedData,
      "iv": app.globalData.iv,
    }
    if (wx.getStorageSync("session_key")) {
      paramObj.session_key = wx.getStorageSync("session_key")
      ajax.post("/api/WX/Decrypt", paramObj).then(res => {
        if (res.state == 1) {
          app.globalData.unionId = res.data.unionId
          certification(_this)
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
            certification(_this)
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