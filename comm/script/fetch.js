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

function wXbindPhone(encryptedData, iv, cb) {
  var json = JSON.stringify({
    cmd: "wXbindPhone",
    encryptedData: encryptedData,
    iv: encodeURIComponent(iv)
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

function modifySystem(ddAheadNotice, maintenanceAhead, cb) {
  var json = JSON.stringify({
    cmd: "modifySystem",
    maintenanceAhead: maintenanceAhead,
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

function modifySetting(params, cb) {
  params.cmd = "modifySetting"
  var json = JSON.stringify(params)

  return runRequest(json, cb)
}

function getUserSetting(cb) {
  var json = JSON.stringify({
    cmd: "getUserSetting"
  })

  return runRequest(json, cb)
}

function modifyGameAccount(params, cb) {
  params.cmd = "modifyGameAccount"
  var json = JSON.stringify(params)

  return runRequest(json, cb)
}

function getGameAccount(cb) {
  var json = JSON.stringify({
    cmd: "getGameAccount"
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

function updateUserNoticeTaskTime(minute, taskType, timeType, cb) {
  var json = JSON.stringify({
    cmd: "updateUserNoticeTaskTime",
    minute: minute,
    type: taskType,
    timeType: timeType
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

function rechargeRecords(start, count, cb, fail_cb) {
  var json = JSON.stringify({
    cmd: "getRechargeRecords",
    pageIndex: start,
    pageSize: count
  })

  return runRequest(json, cb)
}

function userNoticeRecord(start, count, cb, fail_cb) {
  var json = JSON.stringify({
    cmd: "getUserNoticeRecord",
    pageIndex: start,
    pageSize: count
  })

  return runRequest(json, cb)
}

function getUserMoney(cb) {
  var json = JSON.stringify({
    cmd: "getUserMoney"
  })

  return runRequest(json, cb)
}


function createGroup(name, district, locationX, locationY, cb) {
  var json = JSON.stringify({
    cmd: "createGroup",
    name: name,
    district: district,
    locationX: locationX,
    locationY: locationY
  })

  return runRequest(json, cb)
}
function updateGroup(params, cb) {
  params.cmd = "updateGroup"
  var json = JSON.stringify(params)

  return runRequest(json, cb)
}
function updateGroupSetting(params, cb) {
  params.cmd = "updateGroupSetting"
  var json = JSON.stringify(params)

  return runRequest(json, cb)
}
function getUserGroup(cb) {
  var json = JSON.stringify({
    cmd: "getUserGroup"
  })

  return runRequest(json, cb)
}
function getUserGroupById(groupId, cb) {
  var json = JSON.stringify({
    cmd: "getUserGroup",
    groupId: groupId
  })

  return runRequest(json, cb)
}
function getUserGroupList(cb) {
  var json = JSON.stringify({
    cmd: "getUserGroupList"
  })

  return runRequest(json, cb)
}

function getGroupInviteCode(cb) {
  var json = JSON.stringify({
    cmd: "getGroupInviteCode"
  })

  return runRequest(json, cb)
}
function joinGroup(inviteCode, cb) {
  var json = JSON.stringify({
    cmd: "joinGroup",
    inviteCode: inviteCode
  })

  return runRequest(json, cb)
}
function shareJoinGroup(sendUserId, groupId, cb) {
  var json = JSON.stringify({
    cmd: "shareJoinGroup",
    shareUserId: sendUserId,
    groupId: groupId
  })

  return runRequest(json, cb)
}
function sendJiJieNotice(toUserId, type, cb) {
  var json = JSON.stringify({
    cmd: "sendJiJieNotice",
    toUserId: toUserId,
    type: type
  })

  return runRequest(json, cb)
}
function updateGroupLevel(memberUserId, level, cb) {
  var json = JSON.stringify({
    cmd: "updateGroupLevel",
    memberUserId: memberUserId,
    level: level
  })

  return runRequest(json, cb)
}
function deleteGroupMember(memberUserId, cb) {
  var json = JSON.stringify({
    cmd: "deleteGroupMember",
    memberUserId: memberUserId
  })

  return runRequest(json, cb)
}
function abdicateGroupMaster(memberUserId, cb) {
  var json = JSON.stringify({
    cmd: "abdicateGroupMaster",
    memberUserId: memberUserId
  })

  return runRequest(json, cb)
}
function leaveGroup(cb) {
  var json = JSON.stringify({
    cmd: "leaveGroup"
  })

  return runRequest(json, cb)
}
function getGroupQrCode(cb) {
  var json = JSON.stringify({
    cmd: "getGroupQrCode"
  })

  return runRequest(json, cb)
}

function scanCode(code, cb) {
  var json = JSON.stringify({
    cmd: "scanCode",
    code: code
  })

  return runRequest(json, cb)
}

function addGameBbs(params, cb) {
  params.cmd = 'addGameBbs'
  var json = JSON.stringify(params)

  return runRequest(json, cb)
}
function getGameBbs(start, count, orderType, cb, fail_cb) {
  var json = JSON.stringify({
    cmd: "getGameBbs",
    pageIndex: start,
    pageSize: count,
    orderType: orderType
  })

  return runRequest(json, cb)
}


function runRequest(json, cb) {
  var sessionId = wx.getStorageSync('thirdSessionId')
  if ("" == sessionId) {
    return 201;
  }
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
          setTimeout(function () {
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
          }, 1000)
          return
        }

        wx.showModal({
          title: '系统提示',
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
  wXbindPhone: wXbindPhone,
  cancelUserNoticeTask: cancelUserNoticeTask,
  getUserNoticeTask: getUserNoticeTask,
  modifyUserNoticeTask: modifyUserNoticeTask,
  updateUserNoticeTaskTime: updateUserNoticeTaskTime,
  addFeedBack: addFeedBack,
  modifySystem: modifySystem,
  getUserSystem: getUserSystem,
  modifySetting: modifySetting,
  getUserSetting: getUserSetting,
  modifyGameAccount: modifyGameAccount,
  getGameAccount: getGameAccount,
  rechargeRecords: rechargeRecords,
  getUserMoney: getUserMoney,
  userNoticeRecord: userNoticeRecord,

  createGroup: createGroup,
  updateGroup: updateGroup,
  updateGroupSetting: updateGroupSetting,
  getUserGroup: getUserGroup,
  getUserGroupById: getUserGroupById,
  getUserGroupList: getUserGroupList,
  getGroupInviteCode: getGroupInviteCode,
  joinGroup: joinGroup,
  shareJoinGroup: shareJoinGroup,
  sendJiJieNotice: sendJiJieNotice,
  updateGroupLevel: updateGroupLevel,
  deleteGroupMember: deleteGroupMember,
  abdicateGroupMaster: abdicateGroupMaster,
  leaveGroup: leaveGroup,
  getGroupQrCode: getGroupQrCode,
  scanCode: scanCode,
  addGameBbs: addGameBbs,
  getGameBbs: getGameBbs
}