const app = getApp()
const ajax = require('../../common/ajax.js')
import Tools from '../../common/tools.js'
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
let getVehicleList = function (param) {
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/GetVehicleList', param).then(res => {
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
    loadModal:false,//提示弹窗的显示控制
    isSerachModal:false,//显示弹窗的显示文字
    searchParam: {//搜索条件
      PageIndex:1,//当前页
      PageSize:12,//每页数据条数
      PlateNo:'',//车牌号码
      State:'all',//状态
      VIN:'',//VIN码
      TimeStart:'',//开始时间
      TimeEnd:''//结束时间
    },
    stateList:[{
        name: '全部',
        code: 'all',
      },
      {
        name: '待报价',
        code: 'dbj',
      },
      {
        name: '已报价',
        code: 'ybj',
      },
      {
        name: '已完成',
        code: 'ywc',
    }],
    stateIndex:0,
    previewList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'searchParam.TimeStart':Tools.getCurrentMonthFirst(),
      'searchParam.TimeEnd': Tools.getCurrentMonthLast()
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.isReLaunchToIndex()//判断openId是否过期，如果过期跳转到index
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let _this = this
    _this.data.searchParam.PageIndex += 1
    _this.setData({
      loadModal: true,
      isSerachModal: true
    })
    getVehicleList({ ..._this.data.searchParam}).then(data => {
      if (data.length == 0) {
        Toast.fail('没有更多的数据')
      }
      _this.setData({
        loadModal: false,
        isSerachModal: false,
        previewList: _this.data.previewList.length!=0?_this.data.previewList.concat(data):[data]
      })
    })
  },
  submitForm:function(){
    let _this=this
    _this.setData({
      loadModal:true,
      isSerachModal:true
    })
  },
  bindStatePicker:function(e){
    let index = e.detail.value
    let state = this.data.stateList[index].code
    this.setData({
      stateIndex:index,
      "searchParam.State":state
    })
  },
  onVinScan:function(){
    let _this = this
    wx.scanCode({
      success: (res) => {
        _this.setData({
          "searchParam.VIN": res.result
        })
      }
    })
  },
  changeParam(e){
    let {key} = e.currentTarget.dataset
    let value = e.detail.value
    this.setData({
      [`searchParam.${key}`]:value
    })
  },
  submitForm(){
    let _this=this
    _this.setData({
      loadModal:true,
      isSerachModal:true
    })
    getVehicleList({..._this.data.searchParam, PageIndex:1}).then(data=>{
      if(data.length==0){
       Toast.fail('暂无数据')
      }
      _this.setData({
        loadModal: false,
        isSerachModal:false,
        previewList:data
      })
    })

  },
  navigatorToDetail(e){
    let _this=this
    _this.setData({
      loadModal: true
    })
    let { vrfqid, statusname } = e.currentTarget.dataset
    wx.navigateTo({
      url: `./detail?vrfqId=${vrfqid}&statusName=${statusname}`,
      success:function(){
        _this.setData({
          loadModal: false
        })
      }
    })
  }
  
})