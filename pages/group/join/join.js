// pages/group/join/join.js

const app = getApp()
var api = app.api
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
  formSubmit: function (e) {
    var that = this
    if (e.detail.value.code.length == 0) {
      message.modal('请输入邀请码')
      return
    }
    api.joinGroup(e.detail.value.code, function (result) {
      if (result && result.errcode == 1) {
        wx.navigateBack()
      }
    })
  }
})