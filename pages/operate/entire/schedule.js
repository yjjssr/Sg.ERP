const app = getApp()
const ajax = require('../../common/ajax.js')
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import Tools from '../../common/tools.js'
let getScheduleList = function(param) {
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/RFQScheduleByVin', param).then(res => {
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
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vin: '', //从前一个页面得到的参数
    timeLineList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    let {entries } = Object;
    let map = {}
    let list=[]
    _this.setData({
      vin: options.vin
    })
    getScheduleList({
      "Vin": _this.data.vin
    }).then(data => {
      if(data.length==0){
       Toast.fail('暂无进度')
      
       return
      }
      for (let item of data) {
        let list = item.DTime.split(/\s+/)
        let date = list[0]
        let time = list[1]
        if(date){
          if (!map[date]){
            map[date] = [{ title: item.Title, time }]
          }else{
            map[date].push({ title: item.Title, time }) 
          }
         
        }
      }
      for (let [key, value] of entries(map)) {
        list.push({date:key,detail:value})
      }
      _this.setData({
        timeLineList: list.sort(Tools.decDateStringCompare('date'))
      })
      console.log(map)
      console.log(list)
      console.log(list.sort(Tools.decDateStringCompare('date')))
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.isReLaunchToIndex() //判断openId是否过期，如果过期跳转到index
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

  }
})