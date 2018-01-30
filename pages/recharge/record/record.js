const app = getApp()
var message = app.message
var api = app.api

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    total: 13,
    orderList: [],
    hasMore: false,
    hasData: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showNavigationBarLoading()
    message.loading()
    bindData(this)
  },
  onPullDownRefresh: function () {
    var that = this;
    that.data.page = 1

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


})

function bindData(that, cb) {
  console.log('bindData.....')

  wx.getStorage({
    key: 'person_info',
    success: function (res) {
      if (res.data.id < 1) {
        setTimeout(function () {
          bindData(that, cb)
        }, 1000)
        return
      }

      api.rechargeRecords(that.data.page, that.data.total, function (data) {
        wx.hideNavigationBarLoading()
        message.loaded()
        if (data && data.errcode == 1 && data.data && data.data.dataList && data.data.dataList.length > 0) {
          var tempArray = [];
          console.log(data.data.dataList);
          if (that.data.page > 1) {
            tempArray = that.data.orderList
            tempArray = tempArray.concat(data.data.dataList)
          } else
            tempArray = data.data.dataList;
          that.setData({ hasData: true })
          that.setData({ orderList: tempArray })
          that.data.page++
        } else {
          if (that.data.page == 1) {
            that.setData({ hasData: false })
          }
          that.setData({ hasMore: false })
        }


        typeof cb == 'function' && cb()
      })
    }

  })
}