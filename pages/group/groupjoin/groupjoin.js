// pages/group/groupjoin/groupjoin.js

const app = getApp()
var api = app.api
var message = app.message
var config = app.config

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: 0,
    inviteCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    if (!options.groupId) {
      message.modal('无效跳转', function () {
        wx.navigateBack()
      })
    }
    that.setData({ groupId: options.groupId })
    if (options.inviteCode)
      that.setData({ inviteCode: options.inviteCode })

    bindData(that)

  },
  joinTap: function (e) {
    var that = this
    api.joinGroup(that.data.inviteCode, function (result) {
      if (result && result.errcode == 1) {
        message.modal('加入成功', function () {
          wx.setStorageSync(config.storageKey.refreshGroupList, true)

          wx.switchTab({
            url: '../group'
          })
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

function bindData(that) {
  message.loading()

  api.getUserGroupById(that.data.groupId, function (result) {
    message.loaded()
    if (result && result.errcode == 1) {

      that.setData({
        groupInfo: result.data
      })

    }
  })
}