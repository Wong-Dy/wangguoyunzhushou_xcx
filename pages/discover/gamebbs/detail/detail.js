// pages/discover/gamebbs/detail/detail.js

const app = getApp()
var api = app.api
var message = app.message
var config = app.config


Page({

  /**
   * 页面的初始数据
   */
  data: {
    releaseFocus: false,
    distPath: '../../../../dist',
    dataList: [],
    firstPhotoWidth: 150,
    secondPhotoWidth: 100,
    photosWidth: 100,
    bbsId: 0,
    itemIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this

    if (!options.bbsid) {
      message.warn('数据为空')
      setTimeout(function () {
        wx.navigateBack()
      }, 2500)
      return
    }
    that.setData({ bbsId: options.bbsid, itemIndex: options.index })


    var windowWidth = wx.getSystemInfoSync().windowWidth

    that.setData({ firstPhotoWidth: windowWidth / 2 })
    that.setData({ secondPhotoWidth: windowWidth / 2 - 48 })
    that.setData({ photosWidth: windowWidth / 3 - 33 })

    bindData(that)
  },
  bindReply: function (e) {
    this.setData({
      releaseFocus: true
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

function bindData(that, cb) {
  wx.getStorage({
    key: config.storageKey.gameBbsList,
    complete: function (res) {
      console.log(res)
      if (res.data) {

        var tempArr = that.data.dataList
        tempArr.push(res.data[that.data.itemIndex])
        that.setData({ dataList: tempArr })
      } else {
        api.getGameBbsDetail(that.data.bbsId, function (result) {
          if (result.errcode == 1 && result.data) {
            var tempArr = {}
            tempArr[0] = result.data
            that.setData({ dataList: tempArr })
          }
        })
      }
    }
  })
}