const app = getApp()
const ajax = require('../../common/ajax.js')
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
let getVehicleDetail = function (param) {
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/GetVehicleDetail', param).then(res => {
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
let updatePrice=function(param){
  ajax.post('/api/Staff/UpdatePrice', param).then(res => {
    if (res.state == 1) {
      Toast.success({
        message: '价格更新成功',
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
let getPictureList = function (param) {
  let {
    entries
  } = Object;
  let list = []
  for (let [key, value] of entries(param)) {
    if (/^VRFQ_Pic\d$/.test(key)&&value) {
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
    vrfqId:'', 
    statusName:'',
    loadModal:false,
    isSerachModal:false,
    detailObj:null,
    picturesList:[],
    openId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this
    let { vrfqId, statusName,isCanPrice}=options
    _this.setData({
      vrfqId,
      statusName,
      openId: wx.getStorageSync("openId"),
      loadModal:true,
      isSerachModal:true,
      isCanPrice: isCanPrice === "false" ? false : true
    })
    let param={
      OpenID: _this.data.openId,
      VRFQ_ID: vrfqId
    }
    getVehicleDetail(param).then(data=>{
      let picturesList = getPictureList(data)
      _this.setData({
        picturesList,
        detailObj:data,
        loadModal: false,
        isSerachModal:false
       
      })
    })
  
  },
  onUnload:function(){
   if(this.data.statusName=='待报价'&&this.data.isCanPrice){
     let pages = getCurrentPages();
     if (pages.length > 1) { //说明有上一页存在
       //上一个页面实例对象
       let prePage = pages[pages.length - 2];
      
       prePage.submitForm()
     }
   }
  },
  previewImage: function (e) {
    let _this = this
    wx.previewImage({
      current: e.currentTarget.dataset.cur, // 当前显示图片的http链接
      urls: _this.data.picturesList // 需要预览的图片http链接列表
    })

  },
  changePrice(e){
   this.setData({
     "detailObj.VRFQ_TotalAmount":e.detail.value
   })
  },
  submitForm(){
    let _this=this
    let price = _this.data.detailObj.VRFQ_TotalAmount
    if (!price){
      Toast.fail("价格不可为空或0")
      return
    }
    let { vrfqId, openId}=_this.data
    let param={
      "VRFQ_ID": vrfqId,
      "OpenID": openId,
      "Price": price
    }
    updatePrice(param)
  }

 


 

 

  

 

})