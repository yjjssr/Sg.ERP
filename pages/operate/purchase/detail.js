const app = getApp()
const ajax = require('../../common/ajax.js')
const config = require('../../common/config.js')
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
let beforeVPO=function(param){
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/BeforeVPO', param).then(res => {
      if (res.state == 1) {
        resolve(res.data)
      } else {
        Toast.fail({
          message: res.data,
          zIndex: 2000
        })
      }
    })
  })
}
let getAutoPartsDetail = function (param) {
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/GetAutoPartsDetail', param).then(res => {
      if (res.state == 1) {
        resolve(res.data)
      } else {
        Toast.fail({
          message: res.data,
          zIndex: 2000
        })
      }
    })
  })
}
let driveCardRecognize=function(){//上传的行驶证识别
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/DriveCardRecognize', param).then(res => {
      if (res.state == 1) {
        resolve(res.data)
      } else {
        Toast.fail({
          message: res.data,
          zIndex: 2000
        })
      }
    })
  })
}
let updateAutoPartsPic = function (param) {
  ajax.post('/api/Staff/UpdateAutoPartsPic', param).then(res => {
    if (res.state == 1) {
      Toast.success({
        message: '更新成功',
        zIndex: 2000
      })
    } else {
      Toast.fail({
        message: res.data,
        zIndex: 2000
      })
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdd:false,//判断采购单是新增还是修改
    vpoid:'',//从之前页面获取
    statusname:'',//从之前页面获取
    orgId:'',
    basicObj:null,//仓库,供应商列表所在对象
    picturesList: ['https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg']

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this
    let { vpoid, statusname}=options
    let isAdd = Object.keys(options).length == 0?true:false
    let orgId=wx.getStorageSync("orgId")
    this.setData({
      isAdd,
      vpoid,
      statusname,
      orgId
    })
    beforeVPO({ OrgID: orgId}).then(data=>{
      _this.setData({
        basicObj:data
      })
      console.log(_this.data.basicObj)
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.isReLaunchToIndex() //判断openId是否过期，如果过期跳转到index
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

 
})