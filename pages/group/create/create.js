// pages/group/create/create.js

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
    var that = this
  },
  formSubmit: function (e) {
    console.log(e)

    if (e.detail.value.name.length < 1) {
      message.warn('请输入联盟名称')
      return
    }

    message.loading('提交中...')

    api.createGroup(e.detail.value.name, e.detail.value.kcode,
      e.detail.value.locationX, e.detail.value.locationY, function (result) {
        if (result.errcode == 1) {
          message.loaded()
          message.show('创建成功', 3000, function () {
            wx.navigateBack()
          })
        }
      })
  }
})