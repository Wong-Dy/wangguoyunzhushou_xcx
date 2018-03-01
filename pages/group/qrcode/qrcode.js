// pages/group/qrcode/qrcode.js

const app = getApp()
var api = app.api
var message = app.message
var config = app.config
var QR = require("../../../utils/wxqrcode.js");
var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgData: "",
    imageDetail: {},
    qrDesc: '扫一扫上面的二维码图案，加入联盟',
    qrcStr: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    var viewWidth = wx.getSystemInfoSync().windowWidth / 1.5,
      viewHeight = viewWidth;

    var imageDetail = {
      width: viewWidth,
      height: viewHeight
    }

    that.setData({
      imageDetail: imageDetail
    })

    bindData(that)
    init(that)
  },
  qrcodeTap: function (e) {
    var that = this
    message.loading()
    init(that, function () {
      message.loaded()
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

function init(that, cb) {
  api.getGroupQrCode(function (data) {
    if (data.errcode == 1 && data.data && data.data.qrcode) {
      that.setData({ qrcStr: data.data.qrcode })

      var imgData = QR.createQrCodeImg(that.data.qrcStr);
      that.setData({ imgData: imgData })
    }
    typeof cb == 'function' && cb()
  })


}

function bindData(that) {
  message.loading()

  api.getUserGroup(function (result) {
    message.loaded()
    if (result && result.errcode == 1) {

      that.setData({
        groupInfo: result.data
      })

    }
  })
}