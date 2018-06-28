// pages/wxauth/wxauth.js

const app = getApp()
var message = app.message

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
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    app.getUserInfo()

    message.loading()

    setTimeout(function () {
      message.loaded()
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }, 100)

  }

})