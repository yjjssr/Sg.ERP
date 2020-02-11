// pages/about/home/home.js
const app = getApp()
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: null,
    CustomBar: app.globalData.CustomBar,
    StatusBar: app.globalData.StatusBar,
    index: 0,
    organizationPicker:[]
    
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      if (app.globalData.userInfo){
        this.setData({
          userInfo: app.globalData.userInfo
        })
      }else{
        app.userInfoReadyCallback=res=>{
          this.setData({
            userInfo: res.userInfo
          })
        }
      } 
      if (app.globalData.customInfo){
        
        this.setData({
          customInfo: app.globalData.customInfo,
          organizationPicker: app.globalData.customInfo.reList
        })
      }else{
        customReadyCallBack=res=>{
          this.setData({
            customInfo: res.customInfo,
            organizationPicker: res.customInfo.reList
          })
        
        }
      }
     }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModal(e) {
      this.setData({
        modalName:true
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    PickerChange(e) {
      let _this=this
      this.setData({
        index: e.detail.value
      })
      this.data.organizationPicker.filter((item,index)=>{
        if(index==_this.data.index){
          wx.setStorageSync("orgId", item.Org_ID)//根据picker的结果改变orgId的缓存
        }
       
      })
    }
  }
})