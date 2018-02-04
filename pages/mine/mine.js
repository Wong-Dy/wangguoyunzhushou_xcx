var app = getApp()
var config = require('../../comm/script/config.js')
var api = require('../../comm/script/fetch.js')


Page({
  data: {
    userInfo: {},
    personInfo: {},
    moneys:'0.00',
    isPhone: true,
    isHead: false
  },

  //事件处理函数
  onPullDownRefresh: function () {
    bindData(this);
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  recharge: function () {
    wx.navigateTo({
      url: '../recharge/recharge'
    })
  },
  rechargeRecord: function () {
    wx.navigateTo({
      url: '../recharge/record/record'
    })
  },
  onLoad: function (options) {
    var that = this
    app.getPersonInfo(function (personInfo) {
      if (personInfo.phone != '') {
        that.setData({ isPhone: false });
      }
    });
    this.setData({ userInfo: app.globalData.userInfo })
    bindData(that)
    if (options.url) {
      that.setData({ isHead: true })
      that.setData({ imgurl: options.url })
    } else {
      wx.getStorage({
        key: 'person_info',
        success: function (res) {
          console.log(res);
          if (res.data.imgUrl) {
            //头像已存在
            that.setData({ isHead: true })
            that.setData({ headurl: res.data.imgUrl })

          }
        }
      })
    }


  },
  settingTap: function () {
    wx.navigateTo({
      url: '../setting/setting',
    })
  },
  about: function () {
    wx.navigateTo({
      url: '../about/about',
    })
  },
  feedback: function () {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  bindmobile: function () {
    wx.navigateTo({
      url: '../authorizemobile/authorizemobile',
    })
  },
  noticeRecord: function () {
    wx.navigateTo({
      url: '../notice/record/record',
    })
  },
  noticeConfig: function () {
    wx.navigateTo({
      url: '../notice/config/config',
    })
  },
  //头像上传
  head: function () {
    return
    console.log("头像上传");
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePath = res.tempFilePaths[0]
        if (!tempFilePath) {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '头像获取失败,请重试',
            showCancel: false
          })
          return
        }
        wx.getStorage({
          key: 'person_info',
          success: function (res) {
            if (!res.data.id) {
              wx.hideLoading()
              wx.showModal({
                title: '提示',
                content: '用户信息获取失败,请重启小程序',
                showCancel: false,
                success: function () {
                }
              })
              return
            }

            wx.uploadFile({
              url: config.apiList.headUrl,
              filePath: tempFilePath,
              name: 'file',
              formData: {
                'userId': res.data.id
              },
              success: function (fileRes) {

                wx.hideLoading()
                var data = JSON.parse(fileRes.data);
                console.log("头像---------------------")
                console.log(data);
                if (!data) {
                  wx.showModal({
                    title: '提示',
                    content: '服务器走神了',
                    showCancel: false,
                    success: function () {
                    }
                  })
                  return;
                }
                if (data.errcode != 1) {
                  wx.showModal({
                    title: '发生错误',
                    content: data.errmsg,
                    showCancel: false,
                    success: function () {
                    }
                  })
                  return;
                }

                if (data.errcode == 1) {
                  res.data.headUrl = data.data.Url
                  wx.setStorage({
                    key: 'person_info',
                    data: res.data
                  })

                  that.setData({ isHead: true })
                  that.setData({ headurl: data.data.Url })


                  wx.showModal({
                    title: '提示',
                    content: '上传成功',
                    showCancel: false,
                    success: function () {

                    }
                  })

                }
              },
              fail: function (failRes) {
                console.log(failRes)

              }
            })
          }
        })


      }
    })
  }

})

function bindData(that, cb) {
  console.log('余额')

  wx.getStorage({
    key: 'person_info',
    success: function (res) {
      if (res.data.id < 1) {
        setTimeout(function () {
          bindData(that, cb)
        }, 1000)
        return
      }
      api.getUserMoney(function (data) {
        console.log(data)
        if (data && data.errcode == 1) {
          that.setData({ moneys: data.data.money })
        }
        //  wx.hideNavigationBarLoading()
        typeof cb == 'function' && cb()
      })
    }

  })
}





