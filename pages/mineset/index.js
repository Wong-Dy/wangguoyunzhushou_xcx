var app = getApp()
Page({

  nickname: function () {
    wx.navigateTo({
      url: '../nickset/index',
    })
  },
  music: function () {
    wx.navigateTo({
      url: '../music/index',
    })
  },
  loginPassword: function () {
    wx.navigateTo({
      url: '../loginpass/index',
    })
  },
  payPassword: function () {
    wx.navigateTo({
      url: '../paypass/index',
    })
  }
  
})