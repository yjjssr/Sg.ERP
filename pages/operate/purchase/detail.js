const app = getApp()
const ajax = require('../../common/ajax.js')
const config = require('../../common/config.js')
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
let beforeVPO = function(param) {
  return new Promise((resolve, reject) => { //获取仓库，仓位，供应商类型，供应商
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
let getVPODetail = function(param) { //获取采购单详情
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/GetVPODetail', param).then(res => {
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
let driveCardRecognize = function(param) { //上传的行驶证识别
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
let updateAutoPartsPic = function(param) { //更新采购单
  return new Promise((resolve,reject)=>{
    ajax.post('/api/Staff/UpdateAutoPartsPic', param).then(res => {
      if (res.state == 1) {
        resolve()
        // Toast.success({
        //   message: '更新成功',
        //   zIndex: 2000
        // })
      } else {
        reject(res.data)
        // Toast.fail({
        //   message: res.data,
        //   zIndex: 2000
        // })
      }
    })
  })
  
}
let addVPO = function(param) { //新增采购单
  return new Promise((resolve,reject)=>{
    ajax.post('/api/Staff/AddVPO', param).then(res => {
      if (res.state == 1) {
        resolve()
        // Toast.success({
        //   message: '新增成功',
        //   zIndex: 2000
        // })
      } else {
        reject(res.data)
        // Toast.fail({
        //   message: res.data,
        //   zIndex: 2000
        // })
      }
    })
  })
 
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadModal:false,
    isSubmit:false,
    isAdd: false, //判断采购单是新增还是修改
    vpoid: '', //从之前页面获取
    statusname: '', //从之前页面获取
    orgId: '',
    basicObj: null, //仓库,供应商列表所在对象
    submitParam: {
      OrgID: '',
      VLMPic: '', //行驶证正面
      VLSPic: '', //行驶证反面
      VehicleOwnerPic_Front: '', //车主身份证正面
      VehicleOwnerPic_Back: '', //车主身份证反面
      AgentPic_Front: '', //代办人身份证正面
      AgentPic_Back: '', //代办人身份证反面
      LFPic: '', //左前45
      VINPic: '', //车架号
      VINCutPic: '', //车架切割
      EnginePic: '', //发动机整体
      EngineNoPic: '', //发动机号
      RearAxlePic: '', //后桥
      OverviewPic: '', //情况说明
      UndertakingPic: '', //承诺书
      CertificateofDestructionPic: '', //解体证明
      RecoveryCertificatePic: '', //回收证明
      CancellationApplicationPic: '', //注册申请表
      RegisterCertificatePic: '', //登记证书
      TrafficAccidentsCertPic: '', //事故认定书
      WH_ID: '', //仓库id
      WH_Name: '', //仓库名称
      WHA_ID: '', //仓位id
      WHA_Name: '', //仓位名称
      SupplierName: '', //供应商名称
      // SupplierType: '',
      SupplierTypeCode: '', //供应商类型code
      SupplierTypeName: '' //供应商类型名称



    },
    information: {}, //驾驶证正面解析得到的信息
    informationBack: {}, //驾驶证背面面解析得到的信息
    detailObj: null, //编辑时的详情
    supplierTypeArray: [{
        code: 'BXGS',
        name: '保险公司',
      },
      {
        code: 'PTGS',
        name: '平台公司'
      },
      {
        code: 'CZ',
        name: '车主'
      },
      {
        code: 'CLDBR',
        name: '车辆代办人'
      }
    ],
    allStoreAreaArray: [], //map之后的全部仓位列表
    storePickerArray: [], //仓库仓位的picker
    storePickerIndex: [0, 0], //仓库仓位picker的默认选中值
    supplierPickerArray: [], //供应商二级Picker数组
    supplierPickerIndex: [0, 0], //供应商的picer默认选中值
    pcMapArray: [], //平台公司map的列表
    icMapArray: [] //保险公司map的列表
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    let {
      vpoid,
      statusname
    } = options
    let isAdd = Object.keys(options).length == 0 ? true : false
    let orgId = wx.getStorageSync("orgId")
    this.setData({
      isAdd,
      vpoid,
      statusname,
      orgId
    })
    beforeVPO({
      OrgID: orgId
    }).then(data => {
      let storeArray = data.relist.map(item => { //仓库的列表
        return {
          id: item.WH_ID,
          code: item.WH_Code,
          name: item.WH_Name
        }
      })
      let allStoreAreaArray = data.waList.map(item => {
        return {
          id: item.WHA_ID,
          parentId: item.WHA_WH_ID,
          code: item.WHA_Code,
          name: item.WHA_Name
        }
      })
      let storeAreaArray = allStoreAreaArray.filter(item => {
        return item.parentId == storeArray[0].id
      })
      let storePickerArray = [storeArray, storeAreaArray]
      let {
        submitParam,
        storePickerIndex,
        supplierPickerIndex
      } = _this.data
      submitParam.WH_ID = storePickerArray[0][storePickerIndex[0]].id
      submitParam.WH_Name = storePickerArray[0][storePickerIndex[0]].name
      submitParam.WHA_ID = storePickerArray[1][storePickerIndex[1]].id
      submitParam.WHA_Name = storePickerArray[1][storePickerIndex[1]].name

      let supplierTypeArray = _this.data.supplierTypeArray
      let supplierType = _this.data.supplierTypeArray[0]
      let icMapArray = data.icList.map(item => {
        return {
          code: item.IC_Code,
          id: item.IC_ID,
          name: item.IC_ShortName,
          // shortName: item.IC_ShortName
        }
      })
      let pcMapArray = data.pcList.map(item => {
        return {
          code: item.PC_Code,
          id: item.PC_ID,
          name: item.PC_ShortName,
          // shortName: item.PC_ShortName
        }
      })
      let supplierArray = []
      if (supplierType.code != "CZ" || supplierType.code != "CLDBR") {
        if (supplierType.code == "BXGS") {
          supplierArray = icMapArray
        } else if (supplierType.code == "PTGS") {
          supplierArray = pcMapArray
        }
      }
      let supplierPickerArray = [supplierTypeArray, supplierArray]
      submitParam.SupplierTypeCode = supplierPickerArray[0][supplierPickerIndex[0]].code
      submitParam.SupplierTypeName = supplierPickerArray[0][supplierPickerIndex[0]].name
      submitParam.SupplierId = supplierPickerArray[1][supplierPickerIndex[1]].id
      submitParam.SupplierName = supplierPickerArray[1][supplierPickerIndex[1]].name

      _this.setData({
        basicObj: data,
        storePickerArray,
        allStoreAreaArray, //map之后的全部仓位列表
        supplierPickerArray,
        pcMapArray,
        icMapArray,
        submitParam
      })
      return Promise.resolve()
    }).then(()=>{
      if (!isAdd) {
        let { allStoreAreaArray, storePickerIndex,storePickerArray, supplierTypeArray,icMapArray,pcMapArray,supplierPickerIndex,supplierPickerArray} = _this.data
        getVPODetail({
          VPO_ID: vpoid
        }).then(data => {
          let param = {
            Vin: data.VPO_VIN,
            Price: data.VPO_PPrice,
            VLMPic: data.VP_VLMPic, //行驶证正面
            VLSPic: data.VP_VLSPic, //行驶证反面
            VehicleOwnerPic_Front: data.VP_OwnerIdFPic, //车主身份证正面
            VehicleOwnerPic_Back: data.VP_OwnerIdOPic, //车主身份证反面
            AgentPic_Front: data.Vag_FrontPic, //代办人身份证正面
            AgentPic_Back: data.Vag_BackPic, //代办人身份证反面
            LFPic: data.VP_LFPic, //左前45
            VINPic: data.VP_VINPic, //车架号
            VINCutPic: data.VP_VINCutPic, //车架切割
            EnginePic: data.VP_EnginePic, //发动机整体
            EngineNoPic: data.VP_EngineNoPic, //发动机号
            RearAxlePic: data.VP_RearAxlePic, //后桥
            OverviewPic: data.VP_OverviewPic, //情况说明
            UndertakingPic: data.VP_UndertakingPic, //承诺书
            CertificateofDestructionPic: data.VP_CertificateofDestructionPic, //解体证明
            RecoveryCertificatePic: data.VP_RecoveryCertificatePic, //回收证明
            CancellationApplicationPic: data.VP_CancellationApplicationPic, //注册申请表
            RegisterCertificatePic: data.VP_RegisterCertificatePic, //登记证书
            TrafficAccidentsCertPic: data.VP_TrafficAccidentsCertPic, //事故认定书
            WH_ID: data.VPO_WH_ID,
            WH_Name: data.VPO_WH_Name,
            WHA_ID: data.VPO_WHA_ID,
            WHA_Name: data.VPO_WHA_Name,
            SupplierTypeCode: data.VPO_SupplierTypeCode,
            SupplierTypeName: data.VPO_SupplierTypeName,
            SupplierId:data.VPO_SupplierId,
            SupplierName: data.VPO_SupplierName,
            MainIsReUpload:0,//行驶证正面是否更新,0-未更新,1-已更新
            ViceIsReUpload: 0//行驶证背面是否更新,0-未更新,1-已更新
            
          }
          for (let i = 0; i < storePickerArray[0].length;i++){
            if (storePickerArray[0][i].id == data.VPO_WH_ID){
              storePickerIndex[0]=i
              break
             }
          }
          
          storePickerArray[1] = allStoreAreaArray.filter(item => item.parentId == data.VPO_WH_ID)
          for (let i = 0; i < storePickerArray[1].length; i++) {
            if (storePickerArray[1][i].id == data.VPO_WHA_ID) {
              storePickerIndex[1] = i
              break
            }
          }
         
          for (let i = 0; i < supplierTypeArray.length;i++){
            if (supplierTypeArray[i].code == data.VPO_SupplierTypeCode){
              supplierPickerIndex[0]=i
              break
            }
          }
          if (data.VPO_SupplierTypeCode =="PTGS"){
            supplierPickerArray[1] = pcMapArray
            for (let i = 0; i < pcMapArray.length;i++){
              if (pcMapArray[i].id == data.VPO_SupplierId){
                supplierPickerIndex[1] = i
                break;
              }
              
            }

          } else if (data.VPO_SupplierTypeCode == "BXGS"){
            supplierPickerArray[1]=icMapArray
            for (let i = 0; i < icMapArray.length;i++) {
              if (icMapArray[i].id == data.VPO_SupplierId) {
                supplierPickerIndex[1] = i
                break;
              }
            }
          }       
          _this.setData({
            detailObj: data,
            submitParam: {
              ..._this.data.submitParam,
              ...param
            },
            storePickerIndex,
            storePickerArray,
            supplierPickerIndex,
            supplierPickerArray
          })



        })
      }
    })
   

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.isReLaunchToIndex() //判断openId是否过期，如果过期跳转到index
  },
  ChooseImage: function(e) {
    let _this = this
    let {
      key
    } = e.currentTarget.dataset
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
              [`submitParam.${key}`]: url
              
            })

            if (key == 'VLMPic' || key == 'VLSPic') { //当上传行驶证的时候需要调用接口解析得到相应信息
              let config = key == 'VLMPic' ? 'face' : 'back'
              if(!_this.data.isAdd){
                _this.setData({
                  [`submitParam.${key == 'VLMPic' ? 'MainIsReUpload' :'ViceIsReUpload'}`]:1
              })
              }
              
              driveCardRecognize({
                Url: url,
                Config: config
              }).then(data => {
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
  DelImg(e) {
    let _this = this
    let {
      key
    } = e.currentTarget.dataset
    wx.showModal({
      title: '确认框',
      content: '确定要删除这张照片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.setData({
            [`submitParam.${key}`]: ''
          })
        }
      }
    })
  },
  ViewImage(e) {
    let _this = this
    let {
      url
    } = e.currentTarget.dataset
    wx.previewImage({
      urls: [url],
      current: 0
    });
  },
  onInput:function(e){
    let _this=this
   let {name}=e.currentTarget.dataset
   let {submitParam}=_this.data
   _this.setData({
     [`submitParam.${name}`]: e.detail.value
   })

  },
  onSubmit(e) {
    let _this = this
    _this.setData({
      loadModal:true,
      isSubmit:true
    })
    let {
      Vin,
      Price
    } = e.detail.value
    let {
      information,
      informationBack,
      submitParam
    } = _this.data
    Vin = Vin.replace(/\s+/g, '')
    if (Vin.length!=17){
      _this.setData({
        loadModal: false,
        isSubmit: false
      })
      Toast.fail("请输入17位Vin码")
      return
    }
    if (!/^\d+(\.\d+)?$/.test(Price)){
      _this.setData({
        loadModal: false,
        isSubmit: false
      })
      Toast.fail("价格只能包含数字和小数点")
      return
    }
    // if (!information) {
    //   Toast.fail("请上传行驶证正面")
    //   return
    // }
    // if (!informationBack) {
    //   Toast.fail("请上传行驶证反面")
    //   return
    // }

    let param = {
      OrgID: _this.data.orgId,
    }
    if (_this.data.isAdd) {
      let addParam = {
        OpenID: wx.getStorageSync("openId"),
        "Owner": information.owner,
        "Use_character": information.use_character,
        "FileNo": information.file_no,
        "PlateNo": information.plate_num,
        "VehicleType": information.vehicle_type,
        "Model": information.model,
        "Address": information.addr,
        "EngineNO": information.engine_num,
        "RegisterDate": information.register_date,
        "IssueDate": information.issue_date,
        "Appproved_passenger_capacity": informationBack.appproved_passenger_capacity,
        "Gross_mass": informationBack.gross_mass,
        "Unladen_mass": informationBack.unladen_mass,
        "Traction_mass": informationBack.traction_mass,
        "Approved_load": informationBack.approved_load,
        "Inspection_record": informationBack.inspection_record,
        "Overall_dimension": informationBack.overall_dimension,
      }
      submitParam = { ...submitParam,
        ...param,
        ...addParam
      }
      addVPO(submitParam).then(() => {
        _this.setData({
          loadModal: false,
          isSubmit: false
        })
        Toast.success({
          message: '新增成功',
          zIndex: 2000
        })
      }).catch((data)=>{
        _this.setData({
          loadModal: false,
          isSubmit: false
        })
        Toast.fail({
          message: data,
          zIndex: 2000
        })
      })
      
    }else{
      let updateParam={
        VPO_ID: _this.data.detailObj.VPO_ID,
        "BankNo": "",
        "BankOwner": "",
        "BankName": "",
        "SupplierType": ""
      }
      submitParam = {
        ...submitParam,
        ...param,
        ...updateParam
      }
      updateAutoPartsPic(submitParam).then(()=>{
        _this.setData({
          loadModal: false,
          isSubmit: false
        })
        Toast.success({
          message: '更新成功',
          zIndex: 2000
        })
      }).catch(data=>{
        _this.setData({
          loadModal: false,
          isSubmit: false
        })
        Toast.fail({
          message: data,
          zIndex: 2000
        })
      })
    }

    

  },
  StoreColumnChange(e) { //仓位仓库二级picker列监听器
    let _this = this
    let {
      storePickerArray,
      storePickerIndex,
      allStoreAreaArray
    } = _this.data
    storePickerIndex[e.detail.column] = e.detail.value
    if (e.detail.column == 0) {
      let store = storePickerArray[0][e.detail.value]
      let storeAreaArray = allStoreAreaArray.filter(item => item.parentId == store.id)
      storePickerArray[1] = storeAreaArray
      _this.setData({
        storePickerIndex,
        storePickerArray
      })
    }

  },
  StoreChange(e) {
    let _this = this
    let storePickerIndex = e.detail.value
    let {
      storePickerArray,
      submitParam
    } = _this.data
    submitParam.WH_ID = storePickerArray[0][storePickerIndex[0]].id
    submitParam.WH_Name = storePickerArray[0][storePickerIndex[0]].name
    submitParam.WHA_ID = storePickerArray[1][storePickerIndex[1]].id
    submitParam.WHA_Name = storePickerArray[1][storePickerIndex[1]].name

    _this.setData({
      storePickerIndex,
      submitParam
    })
  },
  SupplierColumnChange(e) {
    let _this = this
    let {
      supplierPickerArray,
      supplierPickerIndex,
      icMapArray,
      pcMapArray
    } = _this.data
    supplierPickerIndex[e.detail.column] = e.detail.value
    if (e.detail.column == 0) {
      let supplierType = supplierPickerArray[0][e.detail.value]
      let supplierArray = []
      if (supplierType.code == "BXGS") {
        supplierArray = icMapArray
      } else if (supplierType.code == "PTGS") {
        supplierArray = pcMapArray
      }
      supplierPickerArray[1] = supplierArray
      _this.setData({
        supplierPickerIndex,
        supplierPickerArray
      })

    }
  },
  SupplierChange(e) {
    let _this = this
    let supplierPickerIndex = e.detail.value
    let {
      supplierPickerArray,
      submitParam
    } = _this.data
    submitParam.SupplierTypeCode = supplierPickerArray[0][supplierPickerIndex[0]].code
    submitParam.SupplierTypeName = supplierPickerArray[0][supplierPickerIndex[0]].name
    submitParam.SupplierId = supplierPickerArray[1].length != 0 ? supplierPickerArray[1][supplierPickerIndex[1]].id : ""
    submitParam.SupplierName = supplierPickerArray[1].length != 0 ? supplierPickerArray[1][supplierPickerIndex[1]].name : ""
    this.setData({
      supplierPickerIndex: e.detail.value,
      submitParam
    })
  }




})