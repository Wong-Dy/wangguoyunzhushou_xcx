const app = getApp()

var message = app.message
var api = app.api

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
  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  clickVerify: function (e) {
    var that = this;
    setTimeout(function () {
      if (that.data.mobile.length == 0) {
        message.warn('请输入手机号')
        return
      }

      if (that.data.mobile.length != 11) {
        message.warn('请输入11位手机号码')
        return
      }

      that.setData({
        is_show: (!that.data.is_show)   //false
      })

      countdown = 60
      settime(that);
      api.sendAuthCode(that.data.mobile, function (result) {
        if (result && result.errcode == 1) {
          that.setData({ code: result.data.code })
          message.show('验证码已发送')
        }
      })
    }, 100)

  },
  formSubmit: function (e) {
    var that = this
    if (e.detail.value.mobile.length == 0) {
      message.modal('请输入手机号')
      return
    }
    api.bindPhone(that.data.code, that.data.mobile, function (result) {
      if (result && result.errcode == 1) {
        app.refreshUser()
        message.modal('绑定成功', function () {
          wx.reLaunch({
            url: "../index/index"
          })
        })
      }
    })
  },
  index: function () {
    wx.reLaunch({
      url: "../index/index"
    })
  }

})
