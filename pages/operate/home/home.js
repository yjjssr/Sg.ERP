// pages/operate/home/home.js
const ajax = require('../../common/ajax.js')
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
// let checkValRight = function (param) {
//   return new Promise((resolve, reject) => {
//     ajax.post('/api/Staff/CheckValRight', param).then(res => {
//       if (res.state == 1) {
//         resolve(res.data)
//       } else {
//         Toast.fail({
//           message: res.data,
//           zIndex: 2000
//         })
//       }
//     })
//   })
// }
// let rightCheck = function (param) {
//   return new Promise((resolve, reject) => {
//     ajax.post('/api/Staff/RightCheck', param).then(res => {
//       if (res.state == 1) {
//         resolve(res.data)
//       } else {
//         Toast.fail({
//           message: res.data,
//           zIndex: 2000
//         })
//       }
//     })
//   })
// }
// let rightCheckVPO = function (param) {
//   return new Promise((resolve, reject) => {
//     ajax.post('/api/Staff/RightCheckVPO', param).then(res => {
//       if (res.state == 1) {
//         resolve(res.data)
//       } else {
//         Toast.fail({
//           message: res.data,
//           zIndex: 2000
//         })
//       }
//     })
//   })
// }
// let rightCheckARB = function (param) {
//   return new Promise((resolve, reject) => {
//     ajax.post('/api/Staff/RightCheckARB', param).then(res => {
//       if (res.state == 1) {
//         resolve(res.data)
//       } else {
//         Toast.fail({
//           message: res.data,
//           zIndex: 2000
//         })
//       }
//     })
//   })
// }
let allRightCheck=function(param){
  return new Promise((resolve, reject) => {
    ajax.post('/api/Staff/AllRightCheck', param).then(res => {
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
let verifyCheck = function (list) {

  let param = {
    OpenID: wx.getStorageSync("openId"),
    OrgID: wx.getStorageSync("orgId")
  }
 
  // let p1 = checkValRight(param).then(data => {
  //   if (data.isCanVal) {
  //     list = list.concat({
  //       title: '预评估',
  //       name: 'evaluate',
  //       color: 'cyan',
  //       icon: 'evaluate',
  //       index: 0
  //     })
  //   }
  // })
  // let p2 = rightCheck(param).then(data => {
  //   if (data.isCanEnter) {
  //     list = list.concat({
  //       title: '查询价',
  //       name: 'enquiry',
  //       color: 'mauve',
  //       icon: 'explore',
  //       index: 3,
  //       query: `?isCanPrice=${data.isCanPrice}`
  //     })

  //   }
  // })
  // let p3 = rightCheckVPO(param).then(data => {
  //   if (data.isCanMakeVPO) {
  //     list = list.concat({
  //       title: '采购单',
  //       name: 'purchase',
  //       color: 'pink',
  //       icon: 'list',
  //       index: 4
  //     })

  //   }
  // })
  // let p4 = rightCheckARB(param).then(data => {
  //   if (data.isCanDealARB) {
  //     list = list.concat({
  //       title: '财务审核',
  //       name:'examine',
  //       color: 'brown',
  //       icon: 'refund',
  //       index: 5
  //     })

  //   }
  // })
 

  return new Promise((resolve, reject) => {
    // Promise.all([p1, p2, p3, p4]).then(() => {
    //   list = list.sort(function (a, b) {
    //     return a.index - b.index
    //   })
    //   console.log("opetate home.js********")
    //   console.log(list)
    //   resolve(list)
      
    // })
    allRightCheck(param).then(data => {
      
      if (data.isCanVal) {
        list = list.concat({
          title: '预评估',
          name: 'evaluate',
          color: 'cyan',
          icon: 'evaluate',
          index: 0
        })
      }
      if (data.isCanEnter) {
        list = list.concat({
          title: '查询价',
          name: 'enquiry',
          color: 'mauve',
          icon: 'explore',
          index: 3,
          query: `?isCanPrice=${data.isCanPrice}`
         
        })

      }
      if (data.isCanMakeVPO) {
        list = list.concat({
          title: '采购单',
          name: 'purchase',
          color: 'pink',
          icon: 'list',
          index: 4
        })

      }
      if (data.isCanDealARB) {
        list = list.concat({
          title: '财务审核',
          name: 'examine',
          color: 'brown',
          icon: 'refund',
          index: 5
        })

      }
      list = list.sort(function (a, b) {
        return a.index - b.index
      })
      
      resolve(list)
    })
    

  })


}
Component({
  options: {
    addGlobalClass: true,
    
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // elements:{
    //   type:Array,
    //   default:[{}]
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {
    elements: [{
      title: '查整车',
      name: 'entire',
      color: 'blue',
      icon: 'explore',
      index: 1
    }, {
      title: '查配件',
      name: 'portion',
      color: 'purple',
      icon: 'explore',
      index: 2
    }],
    cardCur: 0,
    swiperList: [{
      url: '../../../images/swiper/back.jpg'
    }]
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    towerSwiper(name) {
      let list = this.data[name];
      for (let i = 0; i < list.length; i++) {
        list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
        list[i].mLeft = i - parseInt(list.length / 2)
      }
      this.setData({
        swiperList: list
      })
    },
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    },

  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {
      // console.log("operate home.js------------")
      // console.log(wx.getStorageSync("orgId"))
      this.towerSwiper('swiperList');
    }
    
  },
  lifetimes:{
    ready:function(){
      console.log(wx.getStorageSync("orgId")+"-----------------")
      let _this = this
      verifyCheck(_this.data.elements).then(data => {
        _this.setData({
          elements: data
        })
      })
      // if (wx.getStorageSync("orgIdChanged")) {
      //   verifyCheck(_this.data.elements).then(data => {
      //     _this.setData({
      //       elements: data
      //     })
      //   })
      // }
    }

   
  }
})