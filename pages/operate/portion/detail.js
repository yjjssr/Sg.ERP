const app = getApp()
const ajax = require('../../common/ajax.js')
const config = require('../../common/config.js')
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
let getAutoPartsDetail = function(param) {
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
let updateAutoPartsPic = function(param) {
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
    apaId: '', //从前一个页面获取
    barCode: '', //从前一个页面获取,
    detailObj: null, //详情
    picturesList: [] //图片列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    const {
      apaId,
      barCode
    } = options
    _this.setData({
      apaId,
      barCode
    })
    getAutoPartsDetail({
      "APA_ID": _this.data.apaId
    }).then(data => {
      let picturesList = getPictureList(data)
      _this.setData({
        picturesList,
        detailObj:data
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.isReLaunchToIndex() //判断openId是否过期，如果过期跳转到index
  },
  ViewImage: function(e) {
    wx.previewImage({
      urls: this.data.picturesList,
      current: e.currentTarget.dataset.url
    });
  },
  ChooseImage(e) {
    let _this = this
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: (res) => {
        wx.uploadFile({
          url: config.host + '/api/Staff/UploadFile', //仅为示例，非真实的接口地址
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            'program': 'logs'
          },
          success(res) {
            if (res.statusCode != 200) {
              Toast.fail("图片上传失败")
              return
            }
            const result = JSON.parse(res.data)
            if (result.state != 1) {
              Toast.fail("图片上传失败")
              return
            }
            const url = result.data.path
            if (_this.data.picturesList.length != 0) {
              _this.data.picturesList.splice(e.currentTarget.dataset.index, 1, url)
              _this.setData({
                picturesList: _this.data.picturesList
              })

            } else {
              _this.setData({
                picturesList: [url]
              })
            }
            //do something
          }
        })
      }
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '确认框',
      content: '确定要删除这张照片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.picturesList.splice(e.currentTarget.dataset.index, 1, '');
          this.setData({
            picturesList: this.data.picturesList
          })
        }
      }
    })
  },
  Update() {
    let param = {
      Barcode: this.data.barCode
    }
    let picturesList = this.data.picturesList
    for(let i=0;i<9;i++){
      let key = `Pic${i+1}`
      if (i<picturesList.length){
        let url = picturesList.find((item,index)=>{
          return i==index
        })
        if (!param[key]) {
          param[key] = url
        }
       
      }else{
        param[key] = ''
      }
      
    }
    updateAutoPartsPic(param)
  },
  copyText(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
    })
  }


})