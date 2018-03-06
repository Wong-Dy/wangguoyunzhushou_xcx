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
    page: 1,
    total: 20,
    dataList: [],
    commentList: [],
    firstPhotoWidth: 150,
    secondPhotoWidth: 100,
    photosWidth: 100,
    bbsId: 0,
    itemIndex: 0,
    commentContent: '',
    hasMore: false
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
    bindComment(that)
  },
  onPullDownRefresh: function () {
    var that = this;

    that.setData({ page: 1 })
    wx.showNavigationBarLoading()
    bindData(that, function () {
      wx.stopPullDownRefresh()
      bindComment(that, function () {
      })
    })
  },
  onReachBottom: function () {
    var that = this;

    if (that.data.commentContent.length > 0) {
      that.setData({ hasMore: true })
      wx.showNavigationBarLoading()
      bindData(that, function () {
        bindComment(that)
      })
    }

  },
  bindReply: function (e) {
    this.setData({
      releaseFocus: true
    })
  },
  likeTap: function (e) {
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

    api.likeGameBbs(e.currentTarget.dataset.bbsid, function (result) {
      if (result.errcode == 1) {

      }
    })
  },
  commentInputTap: function (e) {
    var that = this

    that.setData({ commentContent: e.detail.value })
  },
  submitCommentTap: function (e) {
    var that = this
    api.commentGameBbs(that.data.bbsId, that.data.commentContent, 0, null, function (result) {
      if (result.errcode == 1) {
        message.show('发表成功')
      }
    })

  }

})

function bindData(that, cb) {
  wx.getStorage({
    key: config.storageKey.gameBbsList,
    complete: function (res) {
      console.log(res)
      if (res.data && that.data.dataList.length == 0) {

        var tempArr = that.data.dataList
        tempArr.push(res.data[that.data.itemIndex])
        that.setData({ dataList: tempArr })

        typeof cb == 'function' && cb()
      } else {
        api.getGameBbsDetail(that.data.bbsId, function (result) {
          if (result.errcode == 1 && result.data) {
            var tempArr = []
            tempArr.push(result.data)
            that.setData({ dataList: tempArr })
          }
          typeof cb == 'function' && cb()
        })
      }
      wx.hideNavigationBarLoading()
      message.loaded()
      
    }
  })
}

function bindComment(that, cb) {
  if (that.data.bbsId && that.data.bbsId > 0) {
    api.getGameBbsComment(that.data.page, that.data.total, that.data.bbsId, function (result) {

      if (result.errcode == 1 && result.data && result.data.dataList) {
        var tempArray = [];
        if (that.data.page > 1) {
          tempArray = that.data.commentList
          tempArray = tempArray.concat(result.data.dataList)
        } else
          tempArray = result.data.dataList

        that.setData({ commentList: tempArray })
        that.setData({ page: that.data.page + 1 })
      } else {
        that.setData({ hasMore: false })
      }


      wx.hideNavigationBarLoading()
      message.loaded()
      typeof cb == 'function' && cb()

    })
  }
}