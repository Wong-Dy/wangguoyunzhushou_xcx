// pages/group/edit/edit.js

const app = getApp()
var api = app.api
var message = app.message
var config = app.config

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
    bindData(that)
  },
  formSubmit: function (e) {
    console.log(e)

    if (e.detail.value.name.length < 1) {
      message.warn('请输入联盟名称')
      return
    }

    message.loading('提交中...')

    var params = {
      name: e.detail.value.name,
      district: e.detail.value.kcode,
      locationX: e.detail.value.locationX,
      locationY: e.detail.value.locationY,
      notice: e.detail.value.notice
    }
    api.updateGroup(params, function (result) {
      if (result.errcode == 1) {
        message.loaded()
        message.show('更改成功', 2500, function () {
          wx.navigateBack()
        })
      }
    })
  }
})

function bindData(that) {
  message.loading()

  api.getUserGroup(function (result) {
    message.loaded()
    if (result && result.errcode == 1) {

      that.setData({
        name: result.data.groupName,
        kcode: result.data.district,
        locationX: result.data.locationX,
        locationY: result.data.locationY,
        notice: result.data.groupNotice
      })

    }
  })
}