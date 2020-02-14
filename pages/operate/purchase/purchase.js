const app = getApp()
const ajax = require('../../common/ajax.js')
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
let getVPOList = function(param) {
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/GetVPOList', param).then(res => {
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
    loadModal: false, //是否显示弹窗
    searchParam: {
      "OrgID": "",
      "Keywords": "",
      "PageIndex": 1,
      "PageSize": 12,
    },
    previewList: [],
    isNav: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      "searchParam.OrgID": wx.getStorageSync("orgId")
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.isReLaunchToIndex() //判断openId是否过期，如果过期跳转到index
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let _this = this
    _this.setData({
      loadModal: true
    })
    let param = _this.data.searchParam
    param.PageIndex += 1
    let previewList = _this.data.previewList
    getVPOList(param).then(data => {
      if (data.length == 0) {
        Toast.fail("没有更多数据了")
        return
      }
      previewList = previewList.length == 0 ? [data] : previewList.concat(data)

      console.log(previewList)
      _this.setData({
        previewList,
        loadModal: false
      })


    })
  },
  onChange: function(e) {
    this.setData({
      "searchParam.Keywords": e.detail
    })
  },
  onSerach: function() {
    let _this = this
    let param = _this.data.searchParam
    param.PageIndex = 1
    getVPOList(param).then(data => {
      if (data.length == 0) {
        Toast.fail("暂无数据")
        return
      }
      _this.setData({
        previewList: data
      })

    })

  },
  onDetail(e) {
    let _this = this
    _this.setData({
      loadModal: true,
      isNav: true
    })
    let url
    if (e.currentTarget.id == 'add') {
      url = './detail'
    } else {
      let {
        vpoid,
        statusname
      } = e.currentTarget.dataset
      url = `./detail?vpoid=${vpoid}&statusname=${statusname}`
    }
    wx.navigateTo({
      url,
      success: function() {
        _this.setData({
          loadModal: false,
          isNav: false
        })
      }
    })

   

  }


})