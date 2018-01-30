// pages/authorizemobile/authorizemobile.js
Page({
  data: {

  },
  onLoad: function (options) {

  },
  getPhoneNumber: function (e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      api.wXbindPhone(e.detail.encryptedData, e.detail.iv, function (data) {
        app.refreshUser()
        message.modal('绑定成功', function () {
          wx.reLaunch({
            url: "../mine/mine"
          })
        })
      })
    } else {
      // wx.navigateTo({
      //   url: '../faceverification/faceverification',

      // })

    }
  },
  bindmobileTap: function (e) {
    wx.navigateTo({
      url: '../bindmobile/bindmobile',
    })
  }

})