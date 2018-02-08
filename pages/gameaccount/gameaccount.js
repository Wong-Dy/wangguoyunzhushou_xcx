// pages/gameaccount/gameaccount.js
const app = getApp()
var api = app.api
var message = app.message
var config = app.config

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    message.loading()

    wx.getStorage({
      key: config.storageKey.userGameInfo,
      complete: function (res) {
        if (res.data) {
          message.loaded()
          that.setData({
            nickName: res.data.nickName

          })
        } else {
          api.getGameAccount(function (result) {
            message.loaded()
            if (result && result.errcode == 1) {
              var dataParams = {
                nickName: result.data.nickName

              }
              that.setData(dataParams)

              wx.setStorage({
                key: config.storageKey.userSetting,
                data: dataParams
              })
            }
          })
        }
      }
    })
  },
  formSubmit: function (e) {
    var that = this
    if (e.detail.value.nickname.length == 0) {
      message.warn('请输入游戏昵称')
      return
    }

    var params = {
      nickName: e.detail.value.nickname

    }

    api.modifyGameAccount(params, function (result) {
      if (result && result.errcode == 1) {

        message.show('保存成功', 2500, function () {
          wx.navigateBack()
        })
        wx.setStorage({
          key: config.storageKey.userGameInfo,
          data: params
        })
      }
    })

  }
})