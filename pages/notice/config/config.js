const app = getApp()

var api = app.api
var message = app.message

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    ddAheadNotice: '',
    maintenanceAhead : '',
    userMoney: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    wx.showLoading({
      title: '拼命加载中...',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)

    api.getUserSystem(function (result) {
      wx.hideLoading()
      if (result && result.errcode == 1) {
        that.setData({ ddAheadNotice: result.data.ddAheadNotice, maintenanceAhead: result.data.maintenanceAhead })
      }
    })

    

  },
  formSubmit: function (e) {
    var that = this
    
    message.loading()
    api.modifySystem(e.detail.value.ddAheadNotice, e.detail.value.maintenanceAhead, function (result) {
      message.loaded()
      if (result && result.errcode == 1) {
        wx.showModal({
          title: '提示',
          content: '设置成功',
          showCancel: false,
          success: function (res) {
            app.refreshUser()
            wx.navigateBack()
          }
        })
      }
    })
  },
  feedbackTap: function (e) {
    wx.navigateTo({
      url: '../feedback/feedback'
    })
  },
  rechargeTap: function (e) {
    wx.navigateTo({
      url: '../recharge/recharge'
    })
  }
})