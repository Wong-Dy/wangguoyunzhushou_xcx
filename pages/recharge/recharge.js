
Page({
  data: {
    imgalist: ['https://ww1.isaihu.com/images/wx_sq_code.jpg'],
  },
  previewImage: function (e) {
    //, 'https://ww1.isaihu.com/images/ali_sq_code.jpg'
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接   
      urls: this.data.imgalist // 需要预览的图片http链接列表   
    })
  },
}) 