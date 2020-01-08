// pages/operate/home/home.js
Component({
  options: {
    addGlobalClass: true,
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
    elements: [{
      title: '预评估',
      name:'evaluate',
      color: 'cyan',
      icon: 'evaluate'
    }, {
      title: '查整车',
      color: 'blue',
      icon: 'explore'
    }, {
      title: '查配件',
      color: 'purple',
      icon: 'explore'
    }, {
      title: '查询价',
      color: 'mauve',
      icon: 'explore'
    }, {
      title: '采购单',
      color: 'pink',
      icon: 'list'
    }, {
      title: '财务审核',
      color: 'brown',
      icon: 'refund'
    }],
    cardCur: 0,
    swiperList: [{
      url:'../../../images/swiper/back.jpg'
    },{
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
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
    show: function () {
      this.towerSwiper('swiperList');
    },
    hide: function () { },
    resize: function () { },
  },
})