// pages/operate/entire/entire.js
const app = getApp()
const ajax = require('../../common/ajax.js')
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
let searchVehicleArchiveList = function(param) {
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/SearchVehicleArchiveList', param).then(res => {
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
    searchParam: {
      "FamilyName": "",
      "BrandName": "",
      "VIN": "",
      "PageSize": 12,
      "PageIndex": 1
    },
    previewList: [], //预览列表
    timelineList: [], //时间轴列表
    loadModal:false,
    isSerachModal:false


  },
  onShow() {
    app.isReLaunchToIndex() //判断openId是否过期，如果过期跳转到index
  },
  onReachBottom(){
    let _this=this
    _this.data.searchParam.PageIndex+=1
    _this.setData({
      loadModal: true
    })
    searchVehicleArchiveList(_this.data.searchParam).then(data => {
      _this.setData({
        loadModal: false
      })
      if (data.length == 0){
        Toast.fail('没有更多数据');
      }else{
        for (let item of data) {
          item.VA_PlateNo = item.VA_PlateNo ? `(${item.VA_PlateNo})` : ''
        }
        
        _this.setData({
          previewList: _this.data.previewList.concat(data)
        })
        console.log(_this.data.previewList)
      }
      
    })

  },

  onVinScan() {
    let _this = this

    wx.scanCode({
      success: (res) => {
        _this.setData({
          "searchParam.VIN": res.result
        })
      }
    })
  },
  formSubmit(e) {
    let _this = this
    let param = { ..._this.data.searchParam, ...e.detail.value, PageIndex:1}
    _this.setData({
      searchParam: param,
      loadModal:true,
      isSerachModal:true
    })
    
    searchVehicleArchiveList(_this.data.searchParam).then(data => {
      if (data.length == 0) {
        Toast.fail('暂无数据');
      }
      for(let item of data){
        item.VA_PlateNo = item.VA_PlateNo ? `(${item.VA_PlateNo})`:''
      }

      _this.setData({
        previewList:data,
        loadModal:false,
        isSerachModal:false//默认为加载中...而不是查询中...
      })
    })

  },
  navigatorToDetail(e){
    let _this=this
    _this.setData({
      loadModal: true
    })
    let vin = e.currentTarget.dataset.vin
    wx.navigateTo({
      url: `./detail?vin=${vin}`,
      success:function(){
        _this.setData({
          loadModal: false
        })
      }
    })
  },
  onSchedule(e){
    let _this = this
    _this.setData({
      loadModal: true
    })
    let vin = e.currentTarget.dataset.vin
    wx.navigateTo({
      url: `./schedule?vin=${vin}`,
      success: function () {
        _this.setData({
          loadModal: false
        })
      }
    })
  }










})