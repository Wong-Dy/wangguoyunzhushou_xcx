var message = require('../../component/message/message.js')
var config = require('../../comm/script/config.js')

var crypto = require('../../utils/cryptojs/Crypto.js').Crypto;
require('../../utils/cryptojs/AES.js')
require('../../utils/cryptojs/BlockModes.js')

/*
JS返回错误代码说明:
0:接口失败
1:接口成功
201:sessionId为空
*/

function auth(code, cb) {
  var sessionId = wx.getStorageSync('thirdSessionId');
  // if (sessionId){
  //   typeof cb == 'function' && cb(sessionId)
  //   return;
  // }
  wx.request({
    url: config.apiList.auth + "&sessionId=" + sessionId,
    data: { code: code },
    method: 'post',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      if (!res) {
        message.error('服务器走神了', 5000)
        return;
      } else if (1 != res.data.errcode) {
        message.modal(res.data.errmsg)
        return;
      }

      console.log('set thirdSessionId:' + res.data.data.sessionId)
      wx.setStorageSync('thirdSessionId', res.data.data.sessionId)
      typeof cb == 'function' && cb(res.data.data.sessionId)
    },
    fail: function () {
      message.modal('网络开小差了')
      return null;
    }
  })
}

function login(sessionId, encryptedData, iv, cb) {
  var that = this
  if ("" == sessionId) {
    return 201;
  }
  var json = JSON.stringify({
    cmd: "login",
    encryptedData: encryptedData,
    iv: encodeURIComponent(iv)
  })
  var dataBytes = crypto.charenc.UTF8.stringToBytes(json)
  var keyBytes = crypto.charenc.UTF8.stringToBytes(sessionId);
  var mode = new crypto.mode.ECB(crypto.pad.pkcs7);
  json = crypto.AES.encrypt(dataBytes, keyBytes, {
    mode: mode
  });

  wx.request({
    url: config.apiList.run + "&sessionId=" + sessionId,
    data: json,
    method: 'post',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      if (!res) {
        message.error('服务器走神了', 5000)
        return;
      }
      if (res.data.errcode == 30102) { //sessionId无效
        var loginTime = wx.getStorageSync('loginTime')
        if (loginTime > 3) {
          message.modal('登录失败,请重新刷新首页')
          return;
        }
        wx.setStorageSync('loginTime', loginTime + 1)
        wx.removeStorageSync('thirdSessionId')
        wx.login({
          success: function (loginRes) {

            auth(loginRes.code, function (newSessionId) {
              login(newSessionId, encryptedData, iv, cb)

            })
          }
        })

      }

      wx.removeStorageSync('loginTime')
      typeof cb == 'function' && cb(res.data)

    },
    fail: function () {
      message.modal('网络开小差了')
      return null;
    }
  })
}

// 首页banener
function advertisement_21001(cb) {
  return advertisement("21001", cb);
}

function advertisement(code, cb) {
  var json = JSON.stringify({
    cmd: "getAdvertisement",
    code: code,
    system: 21,
    pageIndex: 1,
    pageSize: 20
  })

  return runRequest(json, cb)
}

function sendAuthCode(phone, cb) {

  var json = JSON.stringify({
    cmd: "sendAuthCode",
    phone: phone
  })

  return runRequest(json, cb)
}

function bindPhone(code, phone, cb) {

  var json = JSON.stringify({
    cmd: "bindPhone",
    code: code,
    phone: phone
  })

  return runRequest(json, cb)
}

function addFeedBack(content, cb) {
  var json = JSON.stringify({
    cmd: "addFeedBack",
    appName: "王国纪元云助手小程序",
    score: 5,
    content: content
  })

  return runRequest(json, cb)
}

function modifySystem(phone, ddAheadNotice, cb) {
  var json = JSON.stringify({
    cmd: "modifySystem",
    phone: phone,
    ddAheadNotice: ddAheadNotice
  })

  return runRequest(json, cb)
}

function getUserSystem(cb) {
  var json = JSON.stringify({
    cmd: "getUserSystem"
  })

  return runRequest(json, cb)
}

function modifyUserNoticeTask(minute, taskType, cb) {
  var json = JSON.stringify({
    cmd: "modifyUserNoticeTask",
    minute: minute,
    type: taskType
  })

  return runRequest(json, cb)
}

function cancelUserNoticeTask(taskType, cb) {
  var json = JSON.stringify({
    cmd: "cancelUserNoticeTask",
    type: taskType
  })

  return runRequest(json, cb)
}

function getUserNoticeTask(taskType, cb) {
  var json = JSON.stringify({
    cmd: "getUserNoticeTask",
    type: taskType
  })

  return runRequest(json, cb)
}

function runRequest(json, cb) {
  var sessionId = wx.getStorageSync('thirdSessionId')
  if ("" == sessionId) {
    return 201;
  }
  console.log('get thirdSessionId:' + sessionId)
  console.log(cb)

  var dataBytes = crypto.charenc.UTF8.stringToBytes(json)
  var keyBytes = crypto.charenc.UTF8.stringToBytes(sessionId);
  var mode = new crypto.mode.ECB(crypto.pad.pkcs7);
  json = crypto.AES.encrypt(dataBytes, keyBytes, {
    mode: mode
  });

  wx.request({
    url: config.apiList.run + "&sessionId=" + sessionId,
    data: json,
    method: 'post',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      if (!res) {
        wx.showModal({
          title: '提示',
          content: '服务器走神了',
          showCancel: false
        })
        wx.hideLoading()
        wx.hideNavigationBarLoading()
        return;
      }
      
      if (res.data && res.data.errcode != 1 && res.data.errcode != 10111) {
        if (res.data.errcode == 30102) { //sessionId无效
          setTimeout(function(){
            var runTime = wx.getStorageSync('runTime')
            if (runTime > 3) {
              message.modal('登录失败,请重新刷新首页')
              return;
            }
            wx.setStorageSync('runTime', runTime + 1)
            wx.login({
              success: function (loginRes) {
                auth(loginRes.code, function (newSessionId) {
                  runRequest(json, cb)
                })
              }
            })
          },1000)
          return
        }

        wx.showModal({
          title: '发生错误',
          content: res.data.errmsg,
          showCancel: false
        })
        wx.hideLoading()
        wx.hideNavigationBarLoading()
        return;
      }

      console.log(res.data)

      wx.removeStorageSync('runTime')
      typeof cb == 'function' && cb(res.data)

    },
    fail: function () {
      wx.showModal({
        title: '提示',
        content: '网络开小差了',
        showCancel: false
      })
      return null;
    }
  })
}


module.exports = {

  auth: auth,
  login: login,
  advertisement_21001: advertisement_21001,

  sendAuthCode: sendAuthCode,
  bindPhone: bindPhone,

  cancelUserNoticeTask: cancelUserNoticeTask,
  getUserNoticeTask: getUserNoticeTask,
  modifyUserNoticeTask: modifyUserNoticeTask,
  addFeedBack: addFeedBack,
  modifySystem: modifySystem,
  getUserSystem: getUserSystem
}