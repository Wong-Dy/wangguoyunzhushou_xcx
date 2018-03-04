// pages/discover/gamebbs/gamebbs.js

const app = getApp()
var api = app.api
var message = app.message

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    total: 20,
    dataList: [],
    photoList: ['../../../dist/images/123123.png'],
    firstPhotoWidth: 150,
    photosWidth: 100,
    hasMore: false,
    hasData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var windowWidth = wx.getSystemInfoSync().windowWidth

    that.setData({ firstPhotoWidth: windowWidth / 2 })
    that.setData({ photosWidth: windowWidth / 2 - 48 })

    bindData(that)
  },
  onPullDownRefresh: function () {
    var that = this;

    that.setData({ page: 1 })
    wx.showNavigationBarLoading()
    bindData(this, function () {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom: function () {
    var that = this;

    if (that.data.hasData) {
      that.setData({ hasMore: true })
      wx.showNavigationBarLoading()
      bindData(this, function () {
      })
    }

  },
  previewImageTap: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var pindex = e.currentTarget.dataset.pindex
    var that = this

    var photoList = that.data.dataList[pindex].photos
    wx.previewImage({
      current: photoList[index], // 当前显示图片的http链接
      urls: photoList // 需要预览的图片http链接列表
    })

  },
  releaseTap: function (e) {
    wx.navigateTo({
      url: 'addbbs/addbbs',
    })
  }
})

function bindData(that, cb) {
  console.log('bindData.....')

  api.getGameBbs(that.data.page, that.data.total, 0, function (data) {
    if (data && data.errcode == 1 && data.data && data.data.dataList && data.data.dataList.length > 0) {
      var tempArray = [];
      if (that.data.page > 1) {
        tempArray = that.data.dataList
        tempArray = tempArray.concat(data.data.dataList)
      } else
        tempArray = data.data.dataList

      that.setData({ hasData: true })
      that.setData({ dataList: tempArray })
      that.setData({ page: that.data.page + 1 })
    } else {
      if (that.data.page == 1) {
        that.setData({ hasData: false })
      }
      that.setData({ hasMore: false })

    }

    wx.hideNavigationBarLoading()
    message.loaded()
    typeof cb == 'function' && cb()
  })
}