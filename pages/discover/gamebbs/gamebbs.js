// pages/discover/gamebbs/gamebbs.js

const app = getApp()
var api = app.api
var message = app.message
var config = app.config

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    total: 20,
    dataList: [],
    firstPhotoWidth: 150,
    secondPhotoWidth: 100,
    photosWidth: 100,
    hasMore: false,
    hasData: false,
    readyUpdate: false
  },
  onShow: function() {
    var that = this

    if (that.data.readyUpdate) {
      that.setData({
        page: 1
      })
      wx.showNavigationBarLoading()
      bindData(this, function() {
        wx.stopPullDownRefresh()

        if (wx.pageScrollTo) {
          wx.pageScrollTo({
            scrollTop: 0
          })
        }
      })
    }

    that.setData({
      readyUpdate: false
    })
  },
  onLoad: function(options) {
    var that = this
    var windowWidth = wx.getSystemInfoSync().windowWidth

    that.setData({
      firstPhotoWidth: windowWidth / 2
    })
    that.setData({
      secondPhotoWidth: windowWidth / 2 - 48
    })
    that.setData({
      photosWidth: windowWidth / 3 - 33
    })

    message.loading()
    bindData(that)
  },
  onPullDownRefresh: function() {
    var that = this;

    that.setData({
      page: 1
    })
    wx.showNavigationBarLoading()
    bindData(this, function() {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom: function() {
    var that = this;

    if (that.data.hasData) {
      that.setData({
        hasMore: true
      })
      wx.showNavigationBarLoading()
      bindData(this, function() {})
    }

  },
  previewImageTap: function(e) {
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
  itemTap: function(e) {
    var that = this
    wx.navigateTo({
      url: 'detail/detail?index=' + e.currentTarget.dataset.index + '&bbsid=' + e.currentTarget.dataset.bbsid,
    })
  },
  releaseTap: function(e) {
    var that = this
    that.setData({
      readyUpdate: true
    })
    wx.navigateTo({
      url: 'addbbs/addbbs',
    })
  },
  likeTap: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index

    if (e.currentTarget.dataset.islike == 1) {
      message.show('已点过赞')
      return
    }

    var isLike = 'dataList[' + index + '].isLike'
    var like = 'dataList[' + index + '].like'

    var dataArr = {}
    dataArr[isLike] = 1
    dataArr[like] = that.data.dataList[index].like + 1

    that.setData(dataArr)

    api.likeGameBbs(e.currentTarget.dataset.bbsid, function(result) {
      if (result.errcode == 1) {
        wx.setStorage({
          key: config.storageKey.gameBbsList,
          data: that.data.dataList
        })
      }
    })
  },
  deleteTap: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
  }
})

function bindData(that, cb) {
  console.log('bindData.....')

  api.getGameBbs(that.data.page, that.data.total, 0, function(data) {
    if (data && data.errcode == 1 && data.data && data.data.dataList && data.data.dataList.length > 0) {
      var tempArray = [];
      if (that.data.page > 1) {
        tempArray = that.data.dataList
        tempArray = tempArray.concat(data.data.dataList)
      } else
        tempArray = data.data.dataList

      that.setData({
        hasData: true
      })
      that.setData({
        dataList: tempArray
      })
      that.setData({
        page: that.data.page + 1
      })

      wx.setStorage({
        key: config.storageKey.gameBbsList,
        data: tempArray
      })

    } else {
      if (that.data.page == 1) {
        that.setData({
          hasData: false
        })
      }
      that.setData({
        hasMore: false
      })

    }


    wx.hideNavigationBarLoading()
    message.loaded()
    typeof cb == 'function' && cb()
  })
}