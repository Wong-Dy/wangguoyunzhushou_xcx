// pages/faceverification/faceverification.js
const app = getApp()

var api = require('../../comm/script/fetch.js')

var countdown = 60;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      is_show: true
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      is_show: false,
      last_time: countdown
    })

    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }, 1000)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    last_time: '',
    is_show: true,
    mobile: '',
    code: ''
  },
  mobileBindblur: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  clickVerify: function (e) {
    var that = this;
    // 将获取验证码按钮隐藏60s，60s后再次显示
    that.setData({
      is_show: (!that.data.is_show)   //false
    })
    settime(that);

    api.sendAuthCode(this.data.mobile, function (result) {
      if (result && result.errcode == 1) {
        that.setData({ code: result.data.code })
        wx.showToast({
          title: '已发送',
          icon: 'success',
          duration: 2000
        })
      }
    })

  },
  formSubmit: function (e) {
    var that = this
    if (e.detail.value.mobile.length == 0) {
      wx.showModal({
        title: '提示',
        content: '手机号不能为空',
        showCancel: false
      })
    } else {
      api.bindPhone(that.data.code,that.data.mobile, function (result) {
        if (result && result.errcode == 1) {
          app.init()
          wx.showModal({
            title: '提示',
            content: '绑定成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: "../index/index"
                })
              }
            }
          })
        }
      })
    }
  },
  index: function () {
    console.log("111");
    wx.reLaunch({
      url: "../index/index"
    })
  },

})