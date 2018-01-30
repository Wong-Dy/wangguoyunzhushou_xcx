//index.js
//获取应用实例
const app = getApp()
var api = app.api
var message = app.message

var util = require('../../utils/util.js')
var config = require('../../comm/script/config.js')


var shortTitle = '云助手'
Page({
  data: {
    bgcolor: '#EFFFFF',
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    slideimagewidth: 0,
    slideimageheight: 0,
    bannerList: config.bannerList,
    menuList: config.menuList,
    hasMore: false,
    currentTime: "00:00:00",
    countDown: "┉┉┉┉",
    lastTime: "00:00:00",

    totalSecond: -1,
    lastHour: 0
  },
  onShareAppMessage: function () {
    return {
      title: '王国云助手',
      desc: '强大的语音电话云提醒，前100名注册赠送免费通知!',
      path: '/pages/index/index'
    }
  },
  onLoad: function () {
    var that = this

    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;

        that.setData({
          slideimagewidth: windowWidth,
          slideimageheight: windowWidth / 2
        })
      }
    })


    wx.showLoading({
      title: '玩命加载中...',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 5000)

    app.dataCallback = function () {
      initData(that)
    }

    app.getPersonInfo(function (data) {
      if (data && data.id > 0) {
        init(that)
      } else {
        app.loginCallback = function () {
          init(that)
        }
      }
    })

    // var random = Math.round(Math.random() * config.bgcolorList.length);
    // this.setData({ bgcolor: config.bgcolorList[random]})
    // console.log(random)

  },
  imageAutoScaleLoad: function (e) {
    var imageSize = util.imageAutoScale(e)
    this.setData({
      slideimagewidth: imageSize.imageWidth,
      slideimageheight: imageSize.imageHeight
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading()

    init(this, function () {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom: function () {
    // var that = this;

    // that.setData({ hasMore: true })
    // setTimeout(function () {
    //   that.setData({ hasMore: false })
    // }, 500)

  },
  swiperTap: function (e) {
    if (3 == e.currentTarget.dataset.type) {
      wx.navigateTo({
        url: '../web/advertisement/advertisement?url=' + e.currentTarget.dataset.link
      })
    }
  },
  menuTap: function (e) {
    wx.showLoading({
      title: '拼命加载中...',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 3000)

    var that = this
    var hour = e.currentTarget.dataset.hour
    var minute = hour * 60
    wx.getStorage({
      key: 'person_info',
      success: function (res) {
        if (!res.data || res.data.isPhone == 0) {
          wx.showModal({
            title: '提示',
            content: '请先设置语音通知手机号',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../setting/setting'
                })
              }
            }
          })

          wx.hideLoading()
          return
        }
        if (res.data.phone) {
          clearTime()
          api.modifyUserNoticeTask(minute, 0, function (result) {
            wx.hideLoading()
            if (result && result.errcode == 1) {
              that.setData({ lastHour: hour })
              that.setData({ totalSecond: hour * 60 * 60 })
              init(that)
            }
            wx.hideLoading()
          })
        }
      }
    })

  },
  cancelTap: function (e) {
    var that = this
    if (that.data.totalSecond < 1) {
      wx.showToast({
        title: '未设置通知',
        duration: 2000
      })
      return
    }

    wx.showLoading({
      title: '拼命加载中...',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 3000)

    clearTime()
    api.cancelUserNoticeTask(0, function (result) {
      if (result && result.errcode == 1) {
        that.setData({ totalSecond: -1 })
        init(that)
      }
      wx.hideLoading()
      wx.showToast({
        title: '已取消',
        duration: 2000
      })
    })
  }

})

var intCurrentTime;
var intCountDown;
var intLastTime;

function initData(that, cb) {
  wx.getStorage({
    key: 'person_info',
    complete: function (res) {
      if (!res.data || res.data.id == 0) {
        // wx.setNavigationBarTitle({
        //   title: '王国纪元云助手'
        // })
        return
      }

      wx.setNavigationBarTitle({
        title: shortTitle + '(ID:' + res.data.account + ')'
      })
    }
  })


}

function clearTime(){
  //倒计时
  clearInterval(intCountDown)
}

function loadTime(that) {
  //当前时间
  clearInterval(intCurrentTime)
  intCurrentTime = setInterval(function currentTime() {
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    that.setData({
      currentTime: time
    });
  }, 1000)

  //当前时间+倒计时时间
  var timestamp = Date.parse(new Date());
  that.setData({
    lastTime: util.formatTime(new Date(timestamp + that.data.totalSecond * 1000))
  });

  //倒计时
  clearInterval(intCountDown)
  intCountDown = setInterval(function countDown() {
    // 渲染倒计时时钟
    that.setData({
      countDown: util.formatTimeHMS(that.data.totalSecond)
    });

    if (that.data.totalSecond < 0) {
      that.setData({
        countDown: "未设置",
        lastHour: 0
      });
      clearInterval(intCountDown)
    } else if (that.data.totalSecond == 0) {
      that.setData({
        countDown: "!!!计时结束!!!",
        lastHour: 0
      });
      clearInterval(intCountDown)
    }
    that.setData({ totalSecond: that.data.totalSecond -= 1 })
  }, 1000)

  wx.hideLoading()
  wx.hideNavigationBarLoading()
}

function init(that, cb) {
  api.getUserNoticeTask(0, function (result) {
    if (result && result.errcode == 1) {
      if (result.data.minute > 0) {
        that.setData({ totalSecond: result.data.minute * 60 })
        that.setData({ lastHour: result.data.totalMinute / 60 })
      } else {
        that.setData({ totalSecond: 0 })
        that.setData({ lastHour: 0 })
      }

    } else {
      that.setData({ totalSecond: -1 })
    }
    loadTime(that)
  })

  typeof cb == 'function' && cb()
  return

  wx.getStorage({
    key: 'adv_bannerList',
    complete: function (res) {
      if (res.data) {
        that.setData({
          bannerList: res.data
        })
        wx.hideLoading()
        wx.hideNavigationBarLoading()
      } else {
        api.advertisement_21001(function (data) {
          if (data && data.errcode == 1 && data.data && data.data.dataList && data.data.dataList.length > 0) {
            var bannerList = {}
            for (var i = 0; i < data.data.dataList.length; i++) {
              var item = data.data.dataList[i]
              bannerList[i] = { type: item.type, id: i, imgUrl: item.fileUrl, link: item.link }
            }

            wx.setStorage({
              key: "adv_bannerList",
              data: bannerList
            })

            that.setData({
              bannerList: bannerList
            })
          }
          wx.hideLoading()
          wx.hideNavigationBarLoading()

        })
      }
    }
  })


}

