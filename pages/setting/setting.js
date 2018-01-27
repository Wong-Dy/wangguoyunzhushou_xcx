// pages/setting/setting.js

const app = getApp()

var api = require('../../comm/script/fetch.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    ddAheadNotice: '',
    userMoney:0
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
        that.setData({ phone: result.data.phone, ddAheadNotice: result.data.ddAheadNotice })
      }
    })

    wx.getStorage({
      key: 'person_info',
      success: function (res) {
        if (res.data && res.data.money){
          that.setData({ userMoney: res.data.money})
        }
      }
    })

  },
  formSubmit: function (e) {
    var that = this
    if (e.detail.value.mobile.length == 0) {
      wx.showModal({
        title: '提示',
        content: '通知手机号不能为空',
        showCancel: false
      })
    } else {
      wx.showLoading({
        title: '加载中...',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)

      api.modifySystem(e.detail.value.mobile, e.detail.value.ddAheadNotice, function (result) {
        wx.hideLoading()
        if (result && result.errcode == 1) {
          wx.showModal({
            title: '提示',
            content: '设置成功',
            showCancel: false,
            success: function (res) {
              app.refreshUser()
              if (res.confirm) {
                wx.navigateBack()
              }
            }
          })
        }
      })
    }
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