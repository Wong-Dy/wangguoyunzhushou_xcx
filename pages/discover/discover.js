// pages/discover/discover.js

const app = getApp()
var api = app.api
var message = app.message
var util = require('../../utils/util.js')

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
  gamebbsTap:function(e){
    wx.navigateTo({
      url: 'gamebbs/gamebbs',
    })
  },
  scanTap: function (e) {


    // 只允许从相机扫码
    wx.scanCode({
      success: (res) => {
        var code = res.result
        if (res.scanType == 'QR_CODE') {
          api.scanCode(code, function (result) {
            if (result && result.errcode == 1) {
              if (result.data) {
                if (util.strContains(code, 'AGC@:')) {
                  wx.navigateTo({
                    url: '../group/groupjoin/groupjoin?groupId=' + result.data.groupId + '&inviteCode=' + result.data.inviteCode,
                  })
                  return
                }
              }
            }
            wx.navigateTo({
              url: '../scancontent/scancontent?content=' + code,
            })
          })


        }
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