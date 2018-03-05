// pages/discover/gamebbs/addbbs/addbbs.js

const app = getApp()
var api = app.api
var message = app.message
var config = app.config

Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoList: [],
    photoPathList: [],
    photoWidth: 0,
    city: '位置',
    postage: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    that.setData({ city: config.city })

    var photoWidth = wx.getSystemInfoSync().windowWidth / 3 - 17

    console.log(photoWidth)
    that.setData({ photoWidth: photoWidth })
  },
  addphotoTap: function (e) {
    var that = this;

    if (that.data.photoList.length > 8) {
      message.warn('最多选择 9张图片')
      return
    }

    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      success: function (res) {
        console.log(res.tempFilePaths)

        var tempArray = that.data.photoList
        if (res.tempFilePaths.length > 0) {
          that.setData({ photoList: tempArray })
          if (res.tempFilePaths.length + that.data.length > 9) {
            message.warn('最多只能选 9张图片')
            return
          }
          tempArray = tempArray.concat(res.tempFilePaths)
          that.setData({ photoList: tempArray })
        }

      }
    })
  },
  closePhotoTap: function (e) {
    var that = this
    console.log(e)

    var tempArray = that.data.photoList

    tempArray.splice(e.currentTarget.dataset.index, 1);

    //渲染数据
    this.setData({
      photoList: tempArray
    });
  },
  formSubmit: function (e) {
    var that = this

    console.log(e)
    if (e.detail.value.content.length == 0) {
      message.warn('请输入内容')
      return
    }

    message.loading('发布中...')
    that.setData({ photoPathList: [] })
    var photoList = that.data.photoList
    for (var index in photoList) {
      wx.uploadFile({
        url: config.apiList.upGameBbsImgUrl,
        filePath: photoList[index],
        name: 'file',
        success: function (fileRes) {
          console.log(fileRes)
          var data = JSON.parse(fileRes.data);
          console.log(data)
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
              title: '失败',
              content: '图片上传失败，请检查图片格式大小',
              showCancel: false,
              success: function () {
              }
            })
            return;
          }

          if (data.errcode == 1) {
            var tempArray = that.data.photoPathList
            tempArray.push(data.data.Path)
            that.setData({ photoPathList: tempArray })
            addBbs(that, e.detail.value)
          }
        },
        fail: function (failRes) {
          console.log(failRes)

        }
      })
    }


  }
})

function addBbs(that, form, cb) {
  if (that.data.photoPathList.length != that.data.photoList.length)
    return

  var params = {
    content: form.content,
    photoList: that.data.photoPathList,
  }

  api.addGameBbs(params, function (result) {
    message.loaded()
    if (result.errcode == 1) {
      message.show('发布成功')
      setTimeout(function () {
        wx.navigateBack()
      }, 2500)
    }
  })

}