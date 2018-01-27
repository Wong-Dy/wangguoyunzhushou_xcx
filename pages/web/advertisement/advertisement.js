
Page({
  data: {
    src: ""
  },
  onLoad: function (option) {
    console.log(option.url)
    if (option.url){
      this.setData({
        src: option.url
      })
    }
    
  }
})
