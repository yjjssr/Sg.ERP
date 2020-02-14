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
let driveCardRecognize=function(param){//上传的行驶证识别
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
    submitParam:{
      VLMPic: '',//行驶证正面
      VLSPic: '',//行驶证反面
      VehicleOwnerPic_Front:'',//车主身份证正面
      VehicleOwnerPic_Back:'',//车主身份证反面
      AgentPic_Front:'',//代办人身份证正面
      AgentPic_Back:'',//代办人身份证反面
      LFPic:'',//左前45
      VINPic:'',//车架号
      VINCutPic:'',//车架切割
      EnginePic:'',//发动机整体
      EngineNoPic:'',//发动机号
      RearAxlePic:'',//后桥
      OverviewPic:'',//情况说明
      UndertakingPic:'',//承诺书
      CertificateofDestructionPic:'',//解体证明
      RecoveryCertificatePic: '',//回收证明
      CancellationApplicationPic:'',//注册申请表
      RegisterCertificatePic:'',//登记证书
      TrafficAccidentsCertPic:'',//事故认定书
      
    },
    information:null,//驾驶证正面解析得到的信息
    informationBack: null,//驾驶证背面面解析得到的信息
   

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
  ChooseImage:function(e){
    let _this = this
    let {key} = e.currentTarget.dataset
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
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
            _this.setData({
              [`submitParam.${key}`]:url
            })
           
            if (key == 'VLMPic' || key == 'VLSPic'){//当上传行驶证的时候需要调用接口解析得到相应信息
              let config = key == 'VLMPic'?'face':'back'
              driveCardRecognize({ Url: url, Config: config }).then(data => {
                _this.setData({
                    [key == 'VLMPic' ? 'information' : 'informationBack']: data.Data
                })
              })
            }
            console.log(_this.data.submitParam)
          }
        })
      }
    });
  },
  DelImg(e){
    let _this = this
    let { key } = e.currentTarget.dataset
    wx.showModal({
      title: '确认框',
      content: '确定要删除这张照片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.setData({
            [`submitParam.${key}`]:''
          })
        }
      }
    })
  },
  ViewImage(e){
    let _this = this
    let { url } = e.currentTarget.dataset
    wx.previewImage({
      urls: [url],
      current: 0
    });
  }
  

 
})