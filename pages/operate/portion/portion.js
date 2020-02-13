// pages/operate/portion/portion.js
const app = getApp()
const ajax = require('../../common/ajax.js')
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
let getAutoPartsList = function (param) {
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/GetAutoPartsList', param).then(res => {
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
    repertoryList:[{name:'有',value:'1'},{name:'无',value:'0'}],//库存Picker列表
    repertoryIndex:0,
    loadModal: false,
    searchParam:{//查询条件
      OrgID:'',
      PageIndex: 1,
      PageSize: 12,
      PartName:'',//配件名称
      Keywords:'',//车辆俗称
      VIN:'',//条码
      isZeorQty:'1'//1表示有库存，0表示无库存
    },
    previewList:[]
  },
  onLoad:function(){
    this.setData({
      "searchParam.OrgID": wx.getStorageSync("orgId")
    })
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.isReLaunchToIndex()//判断openId是否过期，如果过期跳转到index
  },
  onReachBottom:function(){
    let _this = this
    _this.data.searchParam.PageIndex += 1
    _this.setData({
      loadModal: true
    })
    getAutoPartsList(_this.data.searchParam).then(data=>{
      _this.setData({
        loadModal: false
      })
      if (data.length == 0) {
        Toast.fail('没有更多数据');
      } else {
        _this.setData({
          previewList: _this.data.previewList.concat(data)
        })
        console.log(_this.data.previewList)
      }
    })
    
  
  },
  changeParam(e){
    let _this=this
    let {key}= e.currentTarget.dataset
    let value=e.detail.value
    _this.setData({
      [`searchParam.${key}`]:value
    })
    
  },
  bindPickerChange(e){
    let _this=this
    _this.setData({
      repertoryIndex: e.detail.value
    })
    _this.formSubmit()

    
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
  formSubmit(e){
    let _this = this
    _this.setData({
      loadModal: true
    })
    let isZeorQty = _this.data.repertoryList[_this.data.repertoryIndex].value
    // let param = { ..._this.data.searchParam, ...e.detail.value, PageIndex: 1, isZeorQty}
    let param = { ..._this.data.searchParam, PageIndex: 1, isZeorQty }
    _this.setData({
      searchParam: param
    })
    getAutoPartsList(param).then(data=>{
      if(data.length==0){
        Toast.fail('暂无数据');
      }
      _this.setData({
        previewList:data,
        loadModal:false
      })
    })
  },
  navigatorToDetail(e){
    let _this=this
    _this.setData({
      loadModal: true
    })
    let { apaid, barcode}= e.currentTarget.dataset
    wx.navigateTo({
      url: `./detail?apaId=${apaid}&barCode=${barcode}`,
      success: function () {
        _this.setData({
          loadModal: false
        })
      }
    })
  }
})