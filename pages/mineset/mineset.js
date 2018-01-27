var app = getApp()
Page({

  nickname: function () {
    wx.navigateTo({
      url: '../nickset/nickset',
    })
  },
  music: function () {
    wx.navigateTo({
      url: '../music/music',
    })
  },
  loginPassword: function () {
    wx.navigateTo({
      url: '../loginpass/loginpass',
    })
  },
  payPassword: function () {
    wx.navigateTo({
      url: '../paypass/paypass',
    })
  },
  
  
})