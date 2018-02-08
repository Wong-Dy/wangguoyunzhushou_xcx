// pages/setting/setting.js

const app = getApp()
var api = app.api
var message = app.message
var config = app.config

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weihuSwitch: true,
    jijieSwitch: true,
    jijieSwitch5: true,
    jijieSwitch4: true,
    jijieSwitch3: true,
    jijieSwitch2: true,
    jijieSwitch1: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    message.loading()

    wx.getStorage({
      key: config.storageKey.userSetting,
      complete: function (res) {
        if (res.data) {
          message.loaded()
          that.setData({
            weihuSwitch: res.data.openWeihu,
            jijieSwitch: res.data.openJijie,
            jijieSwitch5: res.data.openJijie5,
            jijieSwitch4: res.data.openJijie4,
            jijieSwitch3: res.data.openJijie3,
            jijieSwitch2: res.data.openJijie2,
            jijieSwitch1: res.data.openJijie1,
          })
        } else {
          api.getUserSetting(function (result) {
            message.loaded()
            if (result && result.errcode == 1) {
              var settingParams = {
                weihuSwitch: result.data.openWeihu,
                jijieSwitch: result.data.openJijie,
                jijieSwitch5: result.data.openJijie5,
                jijieSwitch4: result.data.openJijie4,
                jijieSwitch3: result.data.openJijie3,
                jijieSwitch2: result.data.openJijie2,
                jijieSwitch1: result.data.openJijie1
              }
              that.setData(settingParams)

              wx.setStorage({
                key: config.storageKey.userSetting,
                data: settingParams
              })
            }
          })
        }
      }
    })


  },
  weihuSwitchChange: function (e) {
    var that = this

    setTimeout(function () {
      that.setData({ weihuSwitch: e.detail.value })

      submit(that)
    }, 200)

  },
  jijieSwitchChange: function (e) {
    var that = this

    setTimeout(function () {
      that.setData({ jijieSwitch: e.detail.value })
    }, 200)

    if (e.detail.value == false) {
      setTimeout(function () {
        that.setData({
          jijieSwitch5: false,
          jijieSwitch4: false,
          jijieSwitch3: false,
          jijieSwitch2: false,
          jijieSwitch1: false
        })

        submit(that)
      }, 200)
    }

  },
  jijieLevelSwitchChange: function (e) {
    var that = this

    setTimeout(function () {
      switch (parseInt(e.currentTarget.dataset.level)) {
        case 5:
          that.setData({ jijieSwitch5: e.detail.value })
          break;
        case 4:
          that.setData({ jijieSwitch4: e.detail.value })
          break;
        case 3:
          that.setData({ jijieSwitch3: e.detail.value })
          break;
        case 2:
          that.setData({ jijieSwitch2: e.detail.value })
          break;
        case 1:
          that.setData({ jijieSwitch1: e.detail.value })
          break;
      }

      if (that.data.jijieSwitch5 || that.data.jijieSwitch4
        || that.data.jijieSwitch5 || that.data.jijieSwitch2 || that.data.jijieSwitch1) {
        that.setData({ jijieSwitch: true })
      } else {
        that.setData({ jijieSwitch: false })
      }

      submit(that)
    }, 200)

  },
  onUnload: function () {
    submit(this)
  },

})

var submitStatus = 0;

function submit(that) {

  if (submitStatus == 1)
    return

  submitStatus = 1
  var params = {
    openWeihu: that.data.weihuSwitch,
    openJijie: that.data.jijieSwitch,
    openJijie5: that.data.jijieSwitch5,
    openJijie4: that.data.jijieSwitch4,
    openJijie3: that.data.jijieSwitch3,
    openJijie2: that.data.jijieSwitch2,
    openJijie1: that.data.jijieSwitch1
  }

  api.modifySetting(params, function (result) {
    if (result && result.errcode == 1) {
      wx.setStorage({
        key: config.storageKey.userSetting,
        data: params
      })
    }
  })
  setTimeout(function () {
    submitStatus = 0
  }, 1000)

}