var app = getApp()
Page({
  data: {
    userInfo: {},
    
    isPhone: false,
    
  },
  //事件处理函数
  toOrder: function () {
    wx.navigateTo({
      url: ''
    })
  },
  paycheck: function () {
    wx.navigateTo({
      url: '../paycheck/paycheck'
    })
  },
  record: function () {
    wx.navigateTo({
      url: ''
    })
  },
  onLoad: function () {
    var that = this

    wx.getStorage({
      key: 'person_info',
      success: function (res) {
        // if (res.data.isPhone == 1) {
        //   that.setData({ isPhone: true })
        // }else{
        //   wx.redirectTo({
        //     url: '../faceverification/faceverification',
        //   })
        // }
      }
    })

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
     
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  start: function () {
    wx.navigateTo({
      url: '../mineset/mineset',
    })
  },
  profile: function () {
    wx.navigateTo({
      url: '../profile/profile',
    })
  },
  feedback: function () {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  faceverification: function () {
    wx.navigateTo({
      url: '../faceverification/faceverification',
    })
  },
  renlain: function () {
    wx.navigateTo({
      url: '../renlain/renlain',
    })
  },
  payment: function () {
    wx.navigateTo({
      url: '../payment/payment',
    })
  },

})