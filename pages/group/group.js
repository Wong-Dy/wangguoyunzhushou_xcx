// pages/group/group.js
const app = getApp()
var api = app.api
var message = app.message

Page({
  /**
  * 页面的初始数据
  */
  data: {
    disabled: true,
    dataList: [],
    groupMaster: 0,
    groupLevel: 0,
    groupUserId: 0,
    groupName: '',
    groupId: 0,
  },
  onShareAppMessage: function (res) {
    var that = this

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: that.data.groupName,
      path: '/pages/group/group?type=1&userId=' + that.data.groupUserId
      + '&gname=' + that.data.groupName
      + '&groupId=' + that.data.groupId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad: function (options) {
    var that = this

    bindData(that, function () {
      if (options && options.type && options.type == '1') {
        if (dataList.length > 0)
          return
        wx.showModal({
          title: options.gname,
          content: '请确认是否加入联盟',
          success: function (res) {
            if (res.confirm) {
              api.shareJoinGroup(options.userId, options.groupId, function (result) {
                if (result.errcode == 1) {
                  message.show('已加入')
                  bindData(that)
                }
              })
            } else if (res.cancel) {

            }
          }
        })
      }

      that.setData({ disabled: false })
    })

  },
  onPullDownRefresh: function () {
    var that = this
    bindData(that)
  },
  createTap: function (e) {
    wx.navigateTo({
      url: 'create/create',
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
  itemTap: function (e) {
    var that = this
    var item = that.data.dataList[e.currentTarget.dataset.index]

    var actionList = []

    if (e.currentTarget.dataset.userid != that.data.groupUserId)
      actionList.push('遭受集结通知')

    if (e.currentTarget.dataset.userid != that.data.groupUserId
      && that.data.groupMaster == that.data.groupUserId && item.level < 4) {
      actionList.push('阶级更变')
    }

    if (e.currentTarget.dataset.userid != that.data.groupUserId
      && that.data.groupMaster == that.data.groupUserId && item.level < 5) {
      actionList.push('请出联盟')
    }

    if (e.currentTarget.dataset.userid == that.data.groupUserId
      && that.data.groupMaster == that.data.groupUserId)
      actionList.push('让位盟主')

    if (e.currentTarget.dataset.userid == that.data.groupUserId)
      actionList.push('退出联盟')

    wx.showActionSheet({
      itemList: actionList,
      success: function (res) {
        var actionName = actionList[res.tapIndex]
        if (actionName == '遭受集结通知') {
          message.loading()
          api.sendJiJieNotice(e.currentTarget.dataset.userid, 0, function (result) {
            message.loaded()
            if (result.errcode == 1) {
              if (!result.data) {
                message.modal('通知成功')
                return
              }
              if (result.data && result.data.extCode && result.data.extCode == 1001) {
                wx.showModal({
                  title: '通知失败',
                  content: '盟友余额不足！',
                  confirmText: '使用我的',
                  success: function (res) {
                    if (res.confirm) {
                      message.loading()
                      api.sendJiJieNotice(e.currentTarget.dataset.userid, 1, function (result) {
                        message.loaded()
                        if (result.errcode == 1 && !result.data) {
                          message.modal('通知成功')
                        } else {
                          message.modal('通知失败！')
                        }

                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
                return
              }
              if (result.data && result.data.extCode && result.data.extCode == 1002) {
                message.modal('盟友我的余额都不足，通知失败！')
              }
            }
          })
        } else if (actionName == '阶级更变') {
          var actionList2 = []

          if (item.level == 4) {
            actionList2.push('3阶')
            actionList2.push('2阶')
            actionList2.push('1阶')
          }
          if (item.level == 3) {
            actionList2.push('4阶')
            actionList2.push('2阶')
            actionList2.push('1阶')
          }
          if (item.level == 2) {
            actionList2.push('4阶')
            actionList2.push('3阶')
            actionList2.push('1阶')
          }
          if (item.level == 1) {
            actionList2.push('4阶')
            actionList2.push('3阶')
            actionList2.push('2阶')
          }

          wx.showActionSheet({
            itemList: actionList2,
            success: function (res) {
              console.log(res.tapIndex)
            },
            fail: function (res) {
              console.log(res.errMsg)
            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }

})

function bindData(that, cb) {
  message.loading()

  app.getPersonInfo(function (data) {
    if (data && data.id > 0) {
      api.getUserGroupList(function (result) {
        message.loaded()
        wx.stopPullDownRefresh()
        if (result && result.errcode == 1 && result.data.dataList) {
          that.setData({ dataList: result.data.dataList })
          that.setData({
            groupMaster: result.data.master,
            groupLevel: result.data.level,
            groupUserId: result.data.userId,
            groupName: result.data.groupName,
            groupId: result.data.id
          })
          initData(that)
          typeof cb == 'function' && cb()
        }
      })
    } else {
      setTimeout(function () {
        bindData(that)
      }, 1000)
      return
    }
  })

}

function initData(that) {
  if (that.data.groupLevel < 4)
    wx.hideShareMenu()
  else {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
}