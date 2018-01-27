// pages/feedback/feedback.js

var api = require('../../comm/script/fetch.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  formSubmit: function (e) {
    var that = this
    if (e.detail.value.feedback.length == 0) {
      wx.showModal({
        title: '提示',
        content: '反馈不能为空',
        showCancel: false
      })
    } else {
      wx.showLoading({
        title: '加载中...',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)

      api.addFeedBack(e.detail.value.feedback, function (result) {
        wx.hideLoading()
        if (result && result.errcode == 1) {
          wx.showModal({
            title: '提示',
            content: '感谢提出宝贵建议',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack()
              }
            }
          })
        }
      })
    }
  }
})