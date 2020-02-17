const app = getApp()
const ajax = require('../../common/ajax.js')
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
let beforeARB = function() {
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/BeforeARB', {}).then(res => {
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
let getARBList = function(param) {
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/GetARBList', param).then(res => {
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
let confirmReceive = function(param) {
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/ConfirmReceive', param).then(res => {
      if (res.state == 1) {
        resolve()
      } else {
        reject(res)
      }
    })
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadModal: false,
    isSerachModal: true,
    radioModal: false,
    paymentList: [], //付款方式列表
    searchParam: { //搜索参数
      Keywords: '',
      PageIndex: 1,
      PageSize: 12
    },
    previewList: [], //预览列表
    confirmParam: {
      OpenID: '',
      ARB_ID: '',
      VersionNo: '',
      ReceiveTypeCode: '',
      ReceiveTypeName: ''
    }, //确认收款参数
    username:''//点击确认已收款弹出的对话确认框需要

  },
  onLoad: function() {
    this.setData({
      "confirmParam.OpenID": wx.getStorageSync("openId")
    })
    beforeARB().then(data => {
      this.setData({
        paymentList: data.ss
      })
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
    _this.data.searchParam.PageIndex += 1
    _this.setData({
      loadModal: true
    })
    getARBList(_this.data.searchParam).then(data => {
      _this.setData({
        loadModal: false
      })
      if (data.length == 0) {
        Toast.fail('没有更多数据');
      } else {
        _this.setData({
          previewList: _this.data.previewList.concat(data)
        })

      }

    })

  },
  onChange: function(e) {
    this.setData({
      "searchParam.Keywords": e.detail
    })
  },
  onSerach: function() {
    return new Promise((resolve, reject) => {
      let _this = this
      let param = _this.data.searchParam
      param.PageIndex = 1
      getARBList(param).then(data => {
        if (data.length == 0) {
          Toast.fail("暂无数据")
          return
        }
        _this.setData({
          previewList: data
        })
        resolve()

      })
    })


  },

  onConfirm: function(e) {
    let _this = this
    let {
      arb_id,
      arb_versionno,
      receivetypecode,
      username

    } = e.currentTarget.dataset
    let {
      paymentList
    } = _this.data
    for (let item of paymentList) { //清空选中状态
      item.checked = false
    }
    let ReceiveTypeName = paymentList.find(item => {
      if (item.Code == receivetypecode) {
        item.checked = true
        return true
      }
      return false
    }).Text
    if (!ReceiveTypeName) { //未从数据库带出初始的付款code，此时需要设置默认初始值
      for (let item of paymentList) {
        if (item.Code == 'Others') {
          item.checked = true
        }
      }
    }
    _this.setData({
      radioModal: true,
      "confirmParam.ARB_ID": arb_id,
      "confirmParam.ARB_VersionNo": arb_versionno,
      "confirmParam.ReceiveTypeCode": receivetypecode,
      "confirmParam.ReceiveTypeName": ReceiveTypeName,
      paymentList, //更新弹窗单选框的选中状态，此步复制不可省略  
      username   
    })

  },
  radioChange: function(e) {
    let ReceiveTypeCode = e.detail.value
    let {
      text
    } = e.currentTarget.dataset
    this.setData({
      "confirmParam.ReceiveTypeCode": ReceiveTypeCode,
      "confirmParam.ReceiveTypeName": text
    })
    console.log("----------")
    console.log(this.data.confirmParam)

  },
  // hideModal(e) {

  // },
  onSubmit() {
    let _this = this
    let {username}=_this.data
    wx.showModal({
      title: '提示',
      content: '已收到' + username+ '的全额款项?',
      success: function (res) {
        if (res.confirm) {
          let {
            confirmParam
          } = _this.data
          _this.setData({
            loadModal: true,
            isSerachModal: false

          })
          confirmReceive(confirmParam).then(() => {
            return _this.onSerach()
          }, (res) => {
            _this.setData({
              loadModal: false,
              radioModal: false,
            })
            Toast.fail({
              message: res.data,
              zIndex: 10000
            })
            return Promise.reject()
          }).then(() => {
            _this.setData({
              radioModal: false,
              loadModal: false,
              isSerachModal: true
            })
            Toast.success("确认成功")
          })
        }
      }
    })
  
  },
  hideModal() {
    this.setData({
      radioModal: false
    })
  }



})