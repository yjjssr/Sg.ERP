const app = getApp()
const ajax = require('../../common/ajax.js')
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
let getVehicleArchiveDetail = function(param) {
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/VehicleArchiveDetail', param).then(res => {
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
let getPictureList = function(param) {
  let {
    entries
  } = Object;
  let list = []
  for (let [key, value] of entries(param)) {
    if (/^pic\d$/.test(key)) {
      list.push(value)
    }

  }
  return list
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vin: '',//从前一个页面得到的参数
    detailObj:null,
    picturesList:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    _this.setData({
      vin: options.vin
    })
    getVehicleArchiveDetail({
      "Vin": _this.data.vin
    }).then(data => {
      let picturesList= getPictureList(data)
      this.setData({
        detailObj:data,
        picturesList: picturesList
      })
      console.log(this.data.detailObj)
      console.log(this.data.picturesList)
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.isReLaunchToIndex() //判断openId是否过期，如果过期跳转到index
  },
  previewImage:function(e){
    let _this=this
    wx.previewImage({
      current: e.currentTarget.dataset.cur, // 当前显示图片的http链接
      urls: _this.data.picturesList // 需要预览的图片http链接列表
    })
    
  }





 
})