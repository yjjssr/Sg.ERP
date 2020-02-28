// pages/operate/evaluate/evaluate.js
const app = getApp()
const ajax = require('../../common/ajax.js')
const config = require('../../common/config.js')
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import Tools from '../../common/tools.js'
let queryBasicInfo = function(param) {
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/GetVehicleInfo', param).then(res => {
      if (res.state == 1) {
        resolve(res.data)
      } else {
        Toast.fail({
          message: res.data,
          zIndex: 2000,
          onClose: () => {
            wx.reLaunch({
              url: '../../index/index'
            })
          }
        })
      }
    })
  })
}
let queryStoreHouse = function(param) {
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/GetWarehouse', param).then(res => {
      if (res.state == 1) {
        resolve(res.data)
      } else {
        Toast.fail(res.data)
      }
    })
  })
}
let uploadPictures = function(param) {
  ajax.post('/api/Staff/UpdateVehiclePicByVin', param).then(res => {
    if (res.state == 1) {
      Toast.success('上传成功')
    } else {
      Toast.fail(res.data)
    }
  })
}
let queryDisaTempList = function(param) {
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/GetVehicleValuationTemplate', param).then(res => {
      if (res.state == 1) {
        resolve(res.data)
      } else {
        Toast.fail(res.data)
      }
    })
  })
}
let queryDisaDetailList = function(param) {
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/GetVehicleValuationInfo', param).then(res => {
      if (res.state == 1) {
        resolve(res.data)
      } else {
        Toast.fail(res.data)
      }
    })
  })
}
let queryStoreType = function(param) {
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/GetWarehouseBin', param).then(res => {
      if (res.state == 1) {
        resolve(res.data)
      } else {
        Toast.fail(res.data)
      }
    })
  })
}
let getDisplayTreeList = function(param, statePickerArray) {


  for (let item of param) {
    if (!item.Level) {
      for (let [index, stateItem] of statePickerArray.entries()) {
        if (item.StateCode&&stateItem.code == item.StateCode) {
          item.stateIndex = index
        }
      }
    }
  }
  for(let item of param){
    if (!item.Level && !item.stateIndex){
      item.stateIndex = 0
    }
  
  }
  
  return param
}
let updateVehicleValuationInfo = function(param) {
  return new Promise((resolve,reject)=>{
    ajax.post('/api/Staff/UpdateVehicleValuationInfo', param).then(res => {
     
      if (res.state == 1) {
        resolve()
        // Toast.success('保存成功')
      } else {
        Toast.fail(res.data)
      }
    })
  })
  

}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadModal: false, //加载弹窗
    show: false, //用于解决内容闪烁的问题
    sideBarActive: 0, //侧边导航的初始值
    collapseActive: '', //折叠面板的初始值
    subCollapseActive: [], //嵌套的内层折叠面板的初始值
    check: false, //每次弹出template Radio弹窗时清除上一次的操作记录
    orgId: "",
    // orgId:app.globalData.customInfo.reList[0].Org_ID,
    searchValue: '', //车架号
    movableAreaShow: false, //movableArea是否显示
    x: 0, //movableArea的x坐标
    y: 0, //movableArea的y坐标
    modalName: null, //弹出的dialog名称
    TabCur: 0, //默认的当前tab
    scrollLeft: 0, //默认tab的scrllo-veiw的的起始左滑距离
    storeList: [], //仓库列表
    storeTypeList: [], //根据仓库列表获取到的仓位列表
    basicInfo: null, //车辆详情
    pictureList: [], //从车辆详情中提炼出的图片列表
    disaTempList: [], //拆解模板列表
    disaDetailObj: null, //根据选择的拆解模板获得的拆解详情
    copyedDisaStructureList: [], //复制接口返回的拆解structure数组以便在页面上显示
    // disaDetailStructureTreeList: [], //解析得到的拆解部位的树形列表
    displayDisaDetailStructureTreeList: [], //展示在页面上的树形列表
    residualCarHandleType: [{ //残车处理方式
      name: '报废',
    }, {
      name: '入库',
      code: 'RK'
    }],
    scrapType: [{
      name: '直接',
      code: 'ZJBF'
    }, {
      name: '破拆',
      code: 'PCBF'
    }, {
      name: '拆解',
      code: 'BF'
    }],

    saleType: [{ //残车入库后的售卖方式
      name: '★',
      code: 'DB'
    }, {
      name: '▲',
      code: 'LS'
    }],
    residualCarAndSaleMultiArray: [], //残车处理与销售的二级picker列表
    residualCarAndSaleMultiIndex: [], //残车处理与销售的二级picker colum的下标值
    storeAndTypeMultiArray: [], //仓库及仓位的二级picker里列表
    storeAndTypeMultiIndex: [], //仓库及仓位的二级picker colum的下标值
    disaDetailSearchValue: '', //构件搜索输入框的值
    disDetailSwitchValue: false, //构件搜索状态开关的值
    statePickerArray: [{
      state: '未评估',
      code: 'WPG'
    }, {
      state: '破损',
      code: 'PSZ'
    }, {
      state: '待拆',
      code: 'DCK'
    }],
    // index: 0
    saveStructureList: [], //保存时所要用到的数组
    allCheckStatus: [], //底部全选的按钮的选中状态
    TemplateCode: '', //所选择的模板的code
    errMessage:'',
    totalPrice:0,//总价格
  },
  onLoad: function() {
    let _this = this
    _this.setData({
      orgId: wx.getStorageSync("orgId")
    })
    console.log(_this.data.orgId)
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          x: res.screenWidth - 50,
          y: res.screenHeight - 180
        })
      }
    })

    // let orgId = wx.getStorageSync("orgId")
    queryStoreHouse({ //获取仓库列表
      OrgID: _this.data.orgId
    }).then(res => {
      _this.setData({
        storeList: res
      })
    })
    queryDisaTempList({ //获取模板列表
      OrgID: _this.data.orgId
    }).then(res => {
      _this.setData({
        disaTempList: res
      })
    })
    let multiArray = [_this.data.residualCarHandleType]
    _this.setData({
      residualCarAndSaleMultiArray: multiArray
    })
  },
  onReady: function() {
    // let _this = this
    // if (_this.data.searchValue) {

    // }

    // this.setData({
    //   container: () => wx.createSelectorQuery().select('#container')
    // });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.isReLaunchToIndex() //判断openId是否过期，如果过期跳转到index
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    if (this.data.TabCur == 2) {
      this.setData({
        modalName: 'disaTempModal'
      })
    }
  },
  onChange(e) {
    this.setData({
      searchValue: e.detail
    });
  },
  onSearch(e) {

    let _this = this
    let pictureList = []
    if (this.data.searchValue) {
      this.setData({
        movableAreaShow: true
      })
      queryBasicInfo({
        Vin: _this.data.searchValue
      }).then(res => {
        _this.setData({
          basicInfo: res
        })
        if (!res.VA_IsProved) {
          _this.setData({
            show: true
          })
        }
        for (let [k, v] of Object.entries(_this.data.basicInfo)) {
          if (/^pic\d+$/.test(k) && v) {
            pictureList.push(v)
          }
        }
        _this.setData({
          pictureList
        })
        if (_this.data.movableAreaShow) {
          _this.hideModal()
        }
      })
      if (e.currentTarget.dataset.type == "modal") {
        _this.setData({
          TabCur: 0,
          scrollLeft: (0 - 1) * 60,
          check: false //每次点击车辆拆解时清除模板radio的选中状态，非常重要不可删除
        })

      }

      // wx.showToast({
      //   title: '搜索：' + this.data.searchValue,
      //   icon: 'none'
      // });
    }
  },
  onClick() {
    let _this = this
    wx.scanCode({
      success: (res) => {
        _this.setData({
          searchValue: res.result
        })
        _this.onSearch()

      }
    })
  },
  deletePicture(event) {
    const {
      index
    } = event.detail;
    let fileList = this.data.pictureList.splice(index, 1);
    this.setData({
      pictureList: fileList
    });
  },
  openScanDialog() {
    this.setData({
      modalName: 'scanModal'

    })
  },
  openSelectDialog() {
    this.setData({
      modalName: 'disaTempModal'
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.pictureList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除图片',
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.pictureList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            pictureList: this.data.pictureList
          })
        }
      }
    })
  },
  ChooseImage(e) {
    let _this = this
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
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
           
            // if (_this.data.picturesList.length != 0) {
            //   _this.data.picturesList.splice(e.currentTarget.dataset.index, 1, url)
            //   _this.setData({
            //     picturesList: _this.data.picturesList
            //   })

            // } else {
            //   _this.setData({
            //     picturesList: [url]
            //   })
            // }

            if (_this.data.pictureList.length != 0) {
              _this.setData({
                pictureList: _this.data.pictureList.concat(url)
              })
            } else {
              _this.setData({
                pictureList: [url]
              })
            }
            //do something
          }
        })

       
       


      }
    });
  },
  uploadImage() {
    let _this = this
    if (_this.data.pictureList.length != 0) {
      let paramObj = {
        Vin: _this.data.searchValue
      }
      for (let [index, elem] of _this.data.pictureList.entries()) {
        paramObj[`Pic${index + 1}`] = elem
      }
      uploadPictures(paramObj)
    }
  },
  disaTempChnage(event) {
    let _this = this
    _this.setData({
      loadModal: true,
      TemplateCode: event.detail.value
    })
    let param = {
      OrgID: _this.data.orgId,
      TemplateCode: event.detail.value,
      Vin: _this.data.searchValue
    }
    queryDisaDetailList(param).then(res => {
      // let copyedDisaStructureList = Tools.deepCopy(res.res)//不可用是因为返回的个数太多导致报错
      let copyedDisaStructureList = JSON.parse(JSON.stringify(res.res)) //复制返回的数组
      let indexedDisaStructureList = getDisplayTreeList(copyedDisaStructureList, _this.data.statePickerArray) //为数组添加picker下标
      let treeList = Tools.parseTreeData(indexedDisaStructureList, "StructureID", "ParentID", "StructureName") //将数组解析为树形    
      for (let levelOne of treeList) {
        let dckNumber = 0
        if (levelOne.children.length != 0) {
          for (let levelTwo of levelOne.children) {
            if (levelTwo.children.length != 0) {
              let levelThree = levelTwo.children
              dckNumber = levelThree.reduce(function (prev, cur, index, arr) {
                return cur.StateCode == 'DCK' ? ++prev : prev;
             }, dckNumber)
              // dckNumber += number
            }
          }

        }
        levelOne.dckInfo = dckNumber

      }
      
      // let treeList = Tools.parseTreeData(res.res, "StructureID", "ParentID", "StructureName")
      _this.setData({
        disaDetailObj: res,
        // disaDetailStructureTreeList: treeList
        copyedDisaStructureList,
        displayDisaDetailStructureTreeList: treeList
      })
      if (_this.data.disaDetailObj.VVB_Warehouse) {
        return queryStoreType({   //获取仓位
          WB_ID: _this.data.disaDetailObj.VVB_Warehouse
        })
      }else{
        return queryStoreType({   //获取仓位
          WB_ID: _this.data.storeList[0].WH_ID
        })
      }


    }).then(res => {

      _this.setData({
        storeTypeList: res
      })
      
      let handleTypeIndex = []
      let {residualCarAndSaleMultiArray}=_this.data
      
      // for (let [index, item] of _this.data.residualCarHandleType.entries()) {
      //   if (item.code == _this.data.disaDetailObj.VVB_TypeCode) {
      //     handleTypeIndex.push(index)
      //     break;
      //   }
      // }
      // _this.setData({
      //   "disaDetailObj.VVB_TypeCode":"",
      //   "disaDetailObj.VVB_Warehouse":""
      // })
      if (_this.data.disaDetailObj.VVB_TypeCode){
        if ("RK" != _this.data.disaDetailObj.VVB_TypeCode) {//残车处理方式一级为入库时
          handleTypeIndex[0] = 0
          for (let [index, item] of _this.data.scrapType.entries()) {
            if (item.code == _this.data.disaDetailObj.VVB_TypeCode) {
              handleTypeIndex[1] = index
              break;
            }
          }
          residualCarAndSaleMultiArray[1] = _this.data.scrapType
        } else {//参数处理方式一级为报废时
          handleTypeIndex[0] = 1
          for (let [index, item] of _this.data.saleType.entries()) {
            if (item.code == _this.data.disaDetailObj.VA_SaleTypeCode) {
              handleTypeIndex[1] = index
              break;
            }
          }
          residualCarAndSaleMultiArray[1] = _this.data.saleType
        }


        _this.setData({ //获取残车处理方式的二级picker初始值
          residualCarAndSaleMultiIndex: handleTypeIndex,
          residualCarAndSaleMultiArray
        })
      }else{
        residualCarAndSaleMultiArray[1] = _this.data.scrapType//若VVB_TypeCode为空时的默认值
        _this.setData({ 
          residualCarAndSaleMultiIndex: [0,2],
          residualCarAndSaleMultiArray
        })
      }
      
      let storeAndTypeMultiIndex = []
      
      if (_this.data.disaDetailObj.VVB_Warehouse){
       
        for (let [index, item] of _this.data.storeList.entries()) {
          if (item.WH_ID == _this.data.disaDetailObj.VVB_Warehouse) {
            storeAndTypeMultiIndex.push(index)
            break
          }
        }
      }else{
        storeAndTypeMultiIndex[0]=0
      }
      if (_this.data.disaDetailObj.VVB_Bin){
        for (let [index, item] of _this.data.storeTypeList.entries()) {
          if (item.WHB_ID == _this.data.disaDetailObj.VVB_Bin) {
            storeAndTypeMultiIndex.push(index)
            break
          }
          // if (item.WHB_Code == _this.data.disaDetailObj.VVB_Bin) {
          //   storeAndTypeMultiIndex.push(index)
          //   break
          // }
          
        }
      }else{
        storeAndTypeMultiIndex[1] = 0
      }

      _this.setData({ //获取仓库及仓位的二级picker初始值
        storeAndTypeMultiIndex: storeAndTypeMultiIndex
      })
      // let multiPickerStoreTypeList
      if (_this.data.storeTypeList){
        let multiPickerStoreTypeList = _this.data.storeTypeList.map(item => {
          item.WH_Name = item.WHB_Name
          return item
        })
        _this.setData({
          storeAndTypeMultiArray: [_this.data.storeList, multiPickerStoreTypeList]
        })
      }else{
        _this.setData({
          storeAndTypeMultiArray: [_this.data.storeList,[]]
        })
      }
      
      _this.setData({
        loadModal: false
      })
    })
  },
  moveHandle() {
    return;
  },

  // tapHandle() {
  //   return
  // }
  MultiColumnChange(e) {
    let _this = this
    // let data = {
    //   residualCarAndSaleMultiArray: this.data.residualCarAndSaleMultiArray,
    //   residualCarAndSaleMultiIndex: this.data.residualCarAndSaleMultiIndex
    // }
    let { residualCarAndSaleMultiArray, residualCarAndSaleMultiIndex}=_this.data
    residualCarAndSaleMultiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
       residualCarAndSaleMultiIndex[1] = 0
        // switch (data.residualCarAndSaleMultiIndex[0]) {
        //   case 0:
        //     data.residualCarAndSaleMultiArray[1] = []
        //     break;
        //   case 1:
        //     // let saleTypeArray = _this.data.saleType.map(item => item.name)
        //     data.residualCarAndSaleMultiArray[1] = _this.data.saleType
        //     break;
        // }
        switch (e.detail.value) {
          case 0:
            residualCarAndSaleMultiArray[1] = _this.data.scrapType
            break;
          case 1:
            // let saleTypeArray = _this.data.saleType.map(item => item.name)
            residualCarAndSaleMultiArray[1] = _this.data.saleType
            break;
        }
       
       
    }
    _this.setData({
      residualCarAndSaleMultiIndex,
      residualCarAndSaleMultiArray

    })
    // this.setData(data)
  },
  MultiChange(e) {
    let { residualCarAndSaleMultiArray, residualCarAndSaleMultiIndex, disaDetailObj}=this.data
    if (residualCarAndSaleMultiIndex[0] == 0) {
      disaDetailObj.VVB_TypeCode = residualCarAndSaleMultiArray[1][residualCarAndSaleMultiIndex[1]].code 
    } else {
      disaDetailObj.VVB_TypeCode = residualCarAndSaleMultiArray[0][residualCarAndSaleMultiIndex[0]].code
    }
    
    this.setData({
     
      residualCarAndSaleMultiIndex: e.detail.value,
      disaDetailObj
    })
  },
  StoreTypeMultiColumnChange(e) {
    let _this = this
    // let data = {
    //   storeAndTypeMultiArray: this.data.storeAndTypeMultiArray,
    //   storeAndTypeMultiIndex: this.data.storeAndTypeMultiIndex
    // }
    let { storeAndTypeMultiArray, storeAndTypeMultiIndex}=_this.data
    storeAndTypeMultiIndex[e.detail.column] = e.detail.value
    if (e.detail.column == 0) {
      storeAndTypeMultiIndex[1] = 0
      queryStoreType({
        WB_ID: storeAndTypeMultiArray[0][e.detail.value].WH_ID
      }).then(res => {
        _this.setData({
          storeTypeList: res
        })
     
        let storeTypeList = _this.data.storeTypeList.map(item => {
          item.WH_Name = item.WHB_Name
          return item
        })
        storeAndTypeMultiArray[1] = storeTypeList
        _this.setData({//array的赋值只能放在这，否则容易因为异步的问题导致出现自己不想要的结果
          storeAndTypeMultiArray
        })
        // storeAndTypeMultiArray = [storeAndTypeMultiArray[0], storeTypeList]
        // _this.setData(data)
       
      })  
    }
  
    _this.setData({
      storeAndTypeMultiIndex
    
    })
    


  },
  StoreTypeMultiChange(e) {
    let { disaDetailObj, storeAndTypeMultiArray, storeAndTypeMultiIndex}=this.data
    disaDetailObj.VVB_Warehouse=storeAndTypeMultiArray[0][storeAndTypeMultiIndex[0]].WH_ID
    this.setData({
     
      storeAndTypeMultiIndex: e.detail.value,
      disaDetailObj
    })
  },
  textareaBInput(e) {
    this.setData({
      remark: e.detail.value
    })

  },
  onDisaDetailChange(e) { //获取搜索构件的搜索值

    this.setData({
      disaDetailSearchValue: e.detail
    });

  },

  onDisDetailSwitchChange(e) {
    this.setData({
      disDetailSwitchValue: e.detail.value
    })


  },
  onDisaDetailSearch() { //过滤数据得到搜索结果
    let _this = this
    _this.setData({
      loadModal:true
    })
    
    let searchValue = _this.data.disaDetailSearchValue
    console.log("searchValue的值为:" + searchValue)
    let originalStructureList = _this.data.disaDetailObj.res
    // let cur_displayDisaDetailStructureTreeList = _this.data.displayDisaDetailStructureTreeList
    // let cur_copyedDisaStructureList = _this.data.copyedDisaStructureList
    let new_copyedDisaStructureList = JSON.parse(JSON.stringify(originalStructureList)) //复制返回的数组
    let filter_new_copyedList = []
    let map = {}
    new_copyedDisaStructureList.forEach(item => {
      item.label = item.StructureName
      if (!map[item.StructureID] && item.StructureID) {
        map[item.StructureID] = item
      }
    })
    if (_this.data.disDetailSwitchValue) { //当已评估按钮打开时搜索时应该不包含未评估的选项，否则应该包含未评估和已评估两种情况
      new_copyedDisaStructureList = [...new_copyedDisaStructureList].filter(item => {
        if (!item.Level) {
          // return item.StateCode != 'WPG'
          return item.StateCode == 'YCJ' || item.StateCode == 'DCK'
        }
        return true

      })
    }
    filter_new_copyedList = [...new_copyedDisaStructureList].filter(item => {
      if (!item.Level) {
        return item.PieceName.indexOf(searchValue) != -1
      } else {
        return item.StructureName.indexOf(searchValue) != -1
      }
    })
    for (let filterItem of filter_new_copyedList) {
      if (!filterItem.Level) { //为三级时需要补全其对应的二级与一级，为由底向上添加children 
        Tools.addParent(filterItem, 'ParentID', 'PieceCode', map, 'Level') //为三级列表添加二级父元素的
        for (let levelTwoItem of new_copyedDisaStructureList) {
          if (levelTwoItem.addPrent) {
            Tools.addParent(levelTwoItem, 'ParentID', 'StructureID', map) //为三级列表添加的二级父列表添加一级父元素
          }
        }
      } else if (filterItem.Level == 2) {
        for (let threeLevelItem of new_copyedDisaStructureList) { //补全二级的三级
          if (threeLevelItem.ParentID == filterItem.StructureID) {
            Tools.addParent(threeLevelItem, 'ParentID', 'PieceCode', map)
          }
        }
        Tools.addParent(filterItem, 'ParentID', 'StructureID', map) //为二级列表添加父级
      } else {
        for (let twoLevelItem of new_copyedDisaStructureList) {
          if (twoLevelItem.ParentID == filterItem.StructureID) {
            Tools.addParent(twoLevelItem, 'ParentID', 'StructureID', map, 'Level')

          }
        }
        for (let twoLevelItem of new_copyedDisaStructureList) {
          if (twoLevelItem.addChildren) {
            for (let threeLevelItem of new_copyedDisaStructureList) {
              if (threeLevelItem.ParentID == twoLevelItem.StructureID) {
                Tools.addParent(threeLevelItem, 'ParentID', 'PieceCode', map)

              }

            }

          }

        }

      }
    }


    for (let item of new_copyedDisaStructureList) { //如果二级没有child则在其对应的一级children中删除它
      let hasChild = item.children && item.children.length
      if (item.Level == 2 && !hasChild) {
        if (map[item.ParentID].children) {
          map[item.ParentID].children = map[item.ParentID].children.filter(twoLevelItem => twoLevelItem.StructureID != item.StructureID)
        }

        // map[item.ParentID].removeChild=true
      }
    }
    let displayDisaDetailStructureTreeList = new_copyedDisaStructureList.filter(item => {
      if (!item.ParentID && item.children && item.children.length != 0) { //取出有子元素的一级
        return item;
      }
    })
    let indexedFilterList = getDisplayTreeList(new_copyedDisaStructureList, _this.data.statePickerArray)

    _this.setData({
      copyedDisaStructureList: indexedFilterList,
      displayDisaDetailStructureTreeList,
      sideBarActive: 0,
      loadModal:false
    })
    
    console.log("displayDisaDetailStructureTreeList的值为:")
    console.log(displayDisaDetailStructureTreeList)

  },
  sideBarChange(e) {
    let allCheckStatus = this.data.allCheckStatus
    if (allCheckStatus.length < e.detail + 1) {
      allCheckStatus[e.detail] = false //保留上次点击的状态
    }

    this.setData({
      sideBarActive: e.detail,
      collapseActive: '',
      subCollapseActive: [],
      allCheckStatus
    });
    console.log(allCheckStatus)
    // console.log("sideBar的当前值为:" + e.detail)
    // console.log(e)

  },
  callapseChange(e) {
    // this.setData({
    //   loadModal:true,
    //   callapseModal:true
    // })
    
    let subCollapseActive = []
    // let { displayDisaDetailStructureTreeList, sideBarActive } = this.data
    // if (`${e.detail}`){
    //   let levelOneList = displayDisaDetailStructureTreeList[sideBarActive]
    //   let levelTwoList = levelOneList.children[e.detail]
    //   let levelThreeList = levelTwoList.children
    //   for (let i = 0; i < levelThreeList.length; i++) {
    //     subCollapseActive.push(i)
    //   }
      
    // }
    this.setData({
      collapseActive: e.detail,
      subCollapseActive,
      // loadModal: false,
      // callapseModal: false
    });
  
    // console.log("collapse的当前值为:" + e.detail)
    // console.log(e)
  },
  subCallapseChange(e) {
    this.setData({
      subCollapseActive: e.detail
    });
    // console.log("-----callapseSub--------")
    // console.log("sub的id为:" + e.currentTarget.id)
  },
  checkAllStructure(e) {
    let _this = this
    let array = []
    let displayDisaDetailStructureTreeList = _this.data.displayDisaDetailStructureTreeList //数据结构为copyedDisaStructureList的精简版
    let copyedDisaStructureList = _this.data.copyedDisaStructureList //操作copyedDisaStructureList就相当于操作displayDisaDetailStructureTreeList
    let displayIndex = _this.data.sideBarActive //侧边导航条的下标
    let saveStructureList = [] //提交的列表
    let allCheckStatus = _this.data.allCheckStatus //垂直导航条下各自的全选按钮状态
    let sideIndex = _this.data.sideBarActive //当前垂直导航条的下标
    if (e.detail.value.length != 0 && e.detail.value[0]) { //为选中状态
      allCheckStatus[sideIndex] = true
      console.log(displayDisaDetailStructureTreeList[displayIndex])
      let obj_1 = displayDisaDetailStructureTreeList[displayIndex]
      if (Reflect.has(obj_1, "children")) {
        let array_2 = obj_1.children
        for (let item of array_2) {
          item.checkStatus = true
          if (Reflect.has(item, "children")) {
            let array_3 = item.children
            for (let subItem of array_3) {
              subItem.checkStatus = true
              saveStructureList.push(subItem)
            }

          }

        }
      }
      let unionArray = []
      let map = {}
      for (let item of saveStructureList) {
        if (!map[item.PieceCode]) {
          map[item.PieceCode] = true
          unionArray.push(item)
        }
      }
      saveStructureList = unionArray
      console.log("添加时")
      console.log(saveStructureList)
    } else { //为非选中状态
      allCheckStatus[sideIndex] = false
      copyedDisaStructureList = [...copyedDisaStructureList].map(item => {
        item.checkStatus = false
        return item
      })
      console.log("删除时")
      console.log(saveStructureList)

    }
    let totalPrice = 0
    for (let item of saveStructureList) {
      if (item.Price) {
        totalPrice += item.Price * item.ValNum
      }

    }

    _this.setData({
      totalPrice,
      saveStructureList,
      displayDisaDetailStructureTreeList
    })
    // _this.setData({
    //   loadModal: false
    // })

  },
  checkAllSubStructure(e) {
    let _this = this
    let array = []
    let obj = {}
    let displayDisaDetailStructureTreeList = _this.data.displayDisaDetailStructureTreeList //数据结构为copyedDisaStructureList的精简版,操作copyedDisaStructureList就相当于操作displayDisaDetailStructureTreeList
    let saveStructureList = _this.data.saveStructureList
    obj = _this.data.copyedDisaStructureList.find(item => item.Level == 2 && item.StructureID == e.currentTarget.id)
    array = obj.children
    if (e.detail.value.length != 0 && e.detail.value[0]) {
      // array=[...array].map(item=>{
      //   item.checkStatus=true
      //   return item
      // })
      obj.checkStatus = true
      for (let item of array) {
        item.checkStatus = true
      }
      if (saveStructureList.length != 0) {
        saveStructureList.push.apply(saveStructureList, array);
      } else {
        saveStructureList = array
      }
      // 数组去重
      let unionArray = []
      let map = {}
      for (let item of saveStructureList) {
        if (!map[item.PieceCode]) {
          map[item.PieceCode] = true
          unionArray.push(item)
        }
      }
      saveStructureList = unionArray

      console.log("添加时")
      console.log(saveStructureList)
      console.log(saveStructureList.length)
    } else {
      obj.checkStatus = false
      for (let item of array) {
        item.checkStatus = false
      }
      if (saveStructureList.length != 0) {
        // array = [...array].map(item => {
        //   item.checkStatus = false
        //   return item
        // })
        for (let item of array) {
          saveStructureList = [...saveStructureList].filter(saveItem => {
            if (saveItem.PieceCode != item.PieceCode) {
              return saveItem
            }

          })


        }

      }
      console.log("删除时")
      console.log(saveStructureList)
      console.log(saveStructureList.length)
    }
    
   
   
   

    
    let totalPrice=0
    for (let item of saveStructureList) {
      if (item.Price) {
        totalPrice += item.Price * item.ValNum
      }

    }
    _this.setData({
      totalPrice,
      saveStructureList,
      displayDisaDetailStructureTreeList //因为由copyedDisaStructureList解析而来并且对象之间通过指针
    })

    // _this.data.copyedDisaStructureList.find(item => item.Level==2 && item.StructureID == e.currentTarget.id)
  },
  checkStructure(e) {
    let _this = this
    let obj = {}
    let displayDisaDetailStructureTreeList = _this.data.displayDisaDetailStructureTreeList
    let saveStructureList = _this.data.saveStructureList
    obj = _this.data.copyedDisaStructureList.find(item => !item.Level && item.PieceCode == e.currentTarget.id)
    if (e.detail.value.length != 0 && e.detail.value[0]) {
      obj.checkStatus = true
      saveStructureList.push(obj)
      // if (saveStructureList.length != 0) {
      //   saveStructureList.push.apply(saveStructureList, obj);
      // } else {
      //   saveStructureList = array
      // }
      console.log("添加时")
      console.log(saveStructureList)
      console.log(saveStructureList.length)
    } else {
      obj.checkStatus = false
      if (saveStructureList.length != 0) {
        saveStructureList = [...saveStructureList].filter(item => {
          if (item.PieceCode != obj.PieceCode) {
            return item
          }
        })
      }

      console.log("删除时")
      console.log(saveStructureList)
      console.log(saveStructureList.length)
    }
    // let {totalPrice}=_this.data
    let totalPrice=0
    for (let item of saveStructureList){
      if (item.Price){
        totalPrice += item.Price * item.ValNum
      }

    }

    _this.setData({
      saveStructureList,
      displayDisaDetailStructureTreeList,
      totalPrice
    })



  },
  submitDisa(e) {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确定要保存吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          _this.setData({
            loadModal:true,
            errMessage:''
          })
          // let test1 = _this.data.statePickerArray
          // let test2 = _this.data.saveStructureList
         
          // if(_this.data.saveStructureList.some(item => !item.stateIndex && item.stateIndex!=0)){
          //   _this.setData({
          //     loadModal: false
          //   })
          //   Toast.fail({
          //     message: '请先选择类型',
          //     zIndex: 2000
          //   })
           
          //   return
          // }
          try{
            let { residualCarAndSaleMultiIndex, residualCarAndSaleMultiArray, disaDetailObj} = _this.data
            if (!disaDetailObj.VVB_TypeCode){
              _this.setData({
                loadModal: false
              })
              Toast.fail({
                message: '请选择处理方式',
                zIndex: 2000
              })
              return
            }
            if (!disaDetailObj.VVB_Warehouse) {
              _this.setData({
                loadModal: false
              })
              Toast.fail({
                message: '请选择仓库仓位',
                zIndex: 2000
              })
              return
            }
            let DealType
            let SaleType
            if (residualCarAndSaleMultiIndex[0] == 0) {
              DealType = residualCarAndSaleMultiArray[1][residualCarAndSaleMultiIndex[1]].code
              SaleType = ""
            } else {
              DealType = residualCarAndSaleMultiArray[0][residualCarAndSaleMultiIndex[0]].code
              SaleType = residualCarAndSaleMultiArray[1][residualCarAndSaleMultiIndex[1]].code
            }
            if (DealType != 'ZJBF' && DealType != 'PCBF') {
              if (_this.data.saveStructureList.length == 0) {
                _this.setData({
                  loadModal: false
                })
                Toast.fail({
                  message: '请至少勾选一条数据',
                  zIndex: 2000
                })

                return
              }
              if (_this.data.saveStructureList.some(item => !item.Price)) {
                _this.setData({
                  loadModal: false
                })
                Toast.fail({
                  message: '价格不能为空或0',
                  zIndex: 2000
                })

                return
              }
            }
            let qList = _this.data.saveStructureList.map(item => {
              let obj = {
                APA_ID: '',
                APN_Barcode: item.PieceCode,
                APN_ID: '',
                APN_Name: item.PieceName,
                UnitCostPrice: item.Price,
                UnitCostNumber: item.ValNum,
                StatusCode: item.stateIndex || item.stateIndex == 0 ? _this.data.statePickerArray[item.stateIndex].code : item.StateCode,
              }
              return obj
            })
            // let DealType = _this.data.residualCarHandleType[_this.data.residualCarAndSaleMultiIndex[0]].code
            // let SaleType = DealType != "BF" ? _this.data.saleType[_this.data.residualCarAndSaleMultiIndex[1]].code : ''
            let param = {
              "JsonText": JSON.stringify({
                qList
              }),
              "Remark": _this.data.remark,
              "DealType": DealType,
              "SaleType": SaleType,
              "WH_ID": _this.data.storeList[_this.data.storeAndTypeMultiIndex[0]].WH_ID,
              "WHB_ID": _this.data.storeTypeList[_this.data.storeAndTypeMultiIndex[1]].WHB_ID,
              "ScanTime": _this.data.basicInfo.ScanTime,
              "OpenID": wx.getStorageSync('openId'),
              "Vin": _this.data.searchValue,
              "OrgID": wx.getStorageSync('orgId'),
              "TemplateCode": _this.data.TemplateCode,
            }
            
            updateVehicleValuationInfo(param).then(() => {

              _this.setData({
                loadModal: false,
                movableAreaShow: false,
                saveStructureList: [],//清除上次的选中数据
                TabCur: 0,
                TemplateCode: '',//清除上次模板选择弹窗的记录
                check: false,//清除上次模板选择弹窗的选中状态
                searchValue: ''//清除搜索框的车架号
              })
              Toast.success("提交成功")
            })
          }catch(err){
           _this.setData({
            
             errMessage: err.message
           })
            // Toast.fail(err.message)
          }
        }
      }
    })




  },
  preventBubble() {
    return
  },
  statePickChange(e) {
    let _this = this
    let displayDisaDetailStructureTreeList = _this.data.displayDisaDetailStructureTreeList
    let copyedDisaStructureList = _this.data.copyedDisaStructureList
    let checkedStructure = copyedDisaStructureList.find(item => {
      return !item.Level && item.PieceCode == e.currentTarget.id
    })
    checkedStructure.stateIndex = e.detail.value
    _this.setData({
      displayDisaDetailStructureTreeList
    })
  },
  onPriceInput(e) {
    let copyedDisaStructureList = this.data.copyedDisaStructureList
    let checkedStructure = copyedDisaStructureList.find(item => {
      return !item.Level && item.PieceCode == e.currentTarget.id
    })
    checkedStructure.Price = e.detail.value
    let totalPrice = 0
    for (let item of copyedDisaStructureList){
    
      if (item.checkStatus&&item.Price) {
        totalPrice += item.Price * item.ValNum
      }
    }
    this.setData({
      totalPrice
    })
    // console.log(this.data.displayDisaDetailStructureTreeList)
    // console.log(this.data.copyedDisaStructureList)
    // console.log(this.data.saveStructureList)

  },
  onNumriceInput(e) {
    let copyedDisaStructureList = this.data.copyedDisaStructureList
    let checkedStructure = copyedDisaStructureList.find(item => {
      return !item.Level && item.PieceCode == e.currentTarget.id
    })
    // checkedStructure.ValNum = e.detail.value
    checkedStructure.ValNum = e.detail
    let totalPrice = 0
    for (let item of copyedDisaStructureList) {
      if (item.checkStatus&&item.Price) {
        totalPrice += item.Price * item.ValNum
      }
    }
    this.setData({
      totalPrice
    })
    // console.log(this.data.displayDisaDetailStructureTreeList)
    // console.log(this.data.saveStructureList)


  }
})