//app.js

var message = require('component/message/message.js')
var api = require('comm/script/fetch.js')
var config = require('comm/script/config.js')

App({
  api: api,
  message: message,
  config: config,
  globalData: {
    userInfo: null
  },
  onLaunch: function () {
    //初始化缓存
    this.initStorage()
  },
  onShow: function (options) {
    console.log('onShow')
    console.log(options)
    this.init()
  },
  init: function () {
    // 获取用户信息
    this.getUserInfo()
  },
  auth: function (cb) {
    // var sessionId = wx.getStorageSync('thirdSessionId')
    // if (sessionId){
    //   typeof cb == "function" && cb(sessionId)
    //   return;
    // }

    wx.login({
      success: function (res) {
        //调用登录接口，获取 code

        api.auth(res.code, function (sessionId) {
          if (sessionId) {
            typeof cb == "function" && cb(sessionId)
          }
        })
      }
    })

  },
  refreshUser: function (cb) {
    var that = this
    this.auth(function (sessionId) {
      wx.getUserInfo({
        success: function (userRes) {
          wx.setStorage({
            key: 'userInfo',
            data: userRes.userInfo
          })
          that.globalData.userInfo = userRes.userInfo;
          api.login(sessionId, userRes.encryptedData, userRes.iv, function (data) {

            var personInfo = {}
            personInfo.nickName = userRes.userInfo.nickName
            personInfo.avatarUrl = userRes.userInfo.avatarUrl

            if (data.errcode == 1) {
              personInfo.account = data.data.account
              personInfo.money = data.data.money
              personInfo.isPhone = data.data.isPhone
              personInfo.id = data.data.userId
              personInfo.name = data.data.name
              personInfo.imgUrl = data.data.imgUrl
              personInfo.phone = data.data.phone
              personInfo.email = data.data.email

              that.setPersonInfo(personInfo)

              typeof cb == "function" && cb(userRes.userInfo)
            }
          })
        }, fail: function () {
          that.getUserInfoFail(function () {
            that.refreshUser(function (personInfo) {
              typeof cb == "function" && cb(personInfo)
            })
          })
        }
      })
    })
  },
  getUserInfo: function (cb) {
    var that = this
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.globalData.userInfo = res.data;
      }
    })

    this.auth(function (sessionId) {

      that.getPersonInfo(function (personInfo) {
        console.log(personInfo)
        if (personInfo && personInfo.id > 0) {
          if (that.loginCallback) {
            that.loginCallback()
            return
          }
        }

        wx.getUserInfo({
          success: function (userRes) {
            wx.setStorage({
              key: 'userInfo',
              data: userRes.userInfo
            })
            that.globalData.userInfo = userRes.userInfo;
            api.login(sessionId, userRes.encryptedData, userRes.iv, function (data) {

              if (!personInfo)
                personInfo = {}
              personInfo.nickName = userRes.userInfo.nickName
              personInfo.avatarUrl = userRes.userInfo.avatarUrl

              if (data.errcode == 1) {
                personInfo.account = data.data.account
                personInfo.money = data.data.money
                personInfo.isPhone = data.data.isPhone
                personInfo.id = data.data.userId
                personInfo.name = data.data.name
                personInfo.imgUrl = data.data.imgUrl
                personInfo.phone = data.data.phone
                personInfo.email = data.data.email

                that.setPersonInfo(personInfo)

                typeof cb == "function" && cb(userRes.userInfo)

                if (that.loginCallback) {
                  that.loginCallback()
                }
                if (that.dataCallback) {
                  that.dataCallback()
                }
              }

            })


          }, fail: function () {
            that.getUserInfoFail(function () {
              that.getUserInfo()
            })
          }
        })

      })
    })

  },
  initStorage: function () {
    wx.getStorageInfo({
      success: function (res) {
        // 个人信息默认数据
        var personInfo = {
          id: 0,
          name: '',
          nickName: '',
          age: '',
          birthday: '',
          phone: '',
          email: '',
          intro: ''
        }
        // 判断个人信息是否存在，没有则创建
        if (!('person_info' in res.keys)) {
          wx.setStorage({
            key: 'person_info',
            data: personInfo
          })
        }

      }
    })
  },
  getPersonInfo: function (cb) {
    var personInfo = wx.getStorage({
      key: 'person_info',
      complete: function (res) {
        typeof cb == "function" && cb(res.data)
      }
    })
  },
  setPersonInfo: function (personInfo, cb) {
    wx.setStorage({
      key: 'person_info',
      data: personInfo
    })
  },
  getUserInfoFail: function (cb) {
    var that = this
    wx.showModal({
      title: '警告',
      content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: (res) => {
              typeof cb == "function" && cb()
              that.getUserInfo()
              // if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录

              // }
            }, fail: function (res) {

            }
          })

        }
      }
    })
  }
})