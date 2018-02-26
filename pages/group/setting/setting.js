// pages/group/setting/setting.js

const app = getApp()
var api = app.api
var message = app.message
var config = app.config

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareJoinSwitch: true,
    inviteCodeSwitch: true,
    switchChange: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
    bindData(that)
  },
  shareJoinSwitchChange: function (e) {
    var that = this

    setTimeout(function () {
      that.setData({ shareJoinSwitch: e.detail.value })

      submit(that)
    }, 200)

  },
  inviteCodeSwitchChange: function (e) {
    var that = this

    setTimeout(function () {
      that.setData({ inviteCodeSwitch: e.detail.value })

      submit(that)
    }, 200)

  },
  onUnload: function () {
    submit(this)
  }
})

var submitStatus = 0;

function submit(that) {
  if (submitStatus == 1){
    bindData(that)
    return
  }

  // submitStatus = 1
  var dataParams = {
    shareJoinSwitch: that.data.shareJoinSwitch,
    inviteCodeSwitch: that.data.inviteCodeSwitch
  }
  var params = {
    isShareJoin: that.data.shareJoinSwitch,
    isInviteCodeJoin: that.data.inviteCodeSwitch
  }
  console.log(params)
  api.updateGroupSetting(params, function (result) {
    if (result && result.errcode == 1) {
      wx.setStorage({
        key: config.storageKey.groupSetting,
        data: dataParams
      })
    }
  })
  setTimeout(function () {
    submitStatus = 0
  }, 1000)

}

function bindData(that){
  message.loading()

  wx.getStorage({
    key: config.storageKey.groupSetting,
    complete: function (res) {
      if (res.data) {
        message.loaded()
        that.setData({
          shareJoinSwitch: res.data.shareJoinSwitch,
          inviteCodeSwitch: res.data.inviteCodeSwitch
        })
      } else {
        api.getUserGroup(function (result) {
          message.loaded()
          if (result && result.errcode == 1) {
            var settingParams = {
              shareJoinSwitch: result.data.isShareJoin,
              inviteCodeSwitch: result.data.isInviteCodeJoin
            }
            that.setData(settingParams)

            wx.setStorage({
              key: config.storageKey.groupSetting,
              data: settingParams
            })
          }
        })
      }
    }
  })
}