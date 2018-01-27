const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 时间格式化输出，如3:25:19
const formatTimeHMS = second => {
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = Math.floor((second - hr * 3600) / 60);
  // 秒位
  var sec = (second - hr * 3600 - min * 60);// equal to => var sec = second % 60;


  if (hr.toString().length == 1)
    hr = "0" + hr
  if (min.toString().length == 1)
    min = "0" + min
  if (sec.toString().length == 1)
    sec = "0" + sec

  return hr + ":" + min + ":" + sec;
}

// 时间格式化输出，如3:25:19 86
const formatTimeHMSMS = micro_second => {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = Math.floor((second - hr * 3600) / 60);
  // 秒位
  var sec = (second - hr * 3600 - min * 60);// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = Math.floor((micro_second % 1000) / 10);

  if (hr.toString().length == 1)
    hr = "0" + hr
  if (min.toString().length == 1)
    min = "0" + min
  if (sec.toString().length == 1)
    sec = "0" + sec

  return hr + ":" + min + ":" + sec + " " + micro_sec;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function strContains(str, substr) {
  return str.indexOf(substr) >= 0
}

function strReplace(search, replace,subject) {
  return subject.replace(search, replace)
}

function imageAutoScale(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽  
  var originalHeight = e.detail.height;//图片原始高  
  var originalScale = originalHeight / originalWidth;//图片高宽比  
  console.log('originalWidth: ' + originalWidth)
  console.log('originalHeight: ' + originalHeight)
  //获取屏幕宽高  
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight / windowWidth;//屏幕高宽比  
      console.log('windowWidth: ' + windowWidth)
      console.log('windowHeight: ' + windowHeight)
      if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比  
        //图片缩放后的宽为屏幕宽  
        imageSize.imageWidth = windowWidth;
        imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
      } else {//图片高宽比大于屏幕高宽比  
        //图片缩放后的高为屏幕高  
        imageSize.imageHeight = windowHeight;
        imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
      }

    }
  })
  console.log('缩放后的宽: ' + imageSize.imageWidth)
  console.log('缩放后的高: ' + imageSize.imageHeight)
  return imageSize;
}

module.exports = {
  formatTime: formatTime,
  formatTimeHMS: formatTimeHMS,
  formatTimeHMSMS: formatTimeHMSMS,
  strContains: strContains,
  strReplace: strReplace,
  imageAutoScale: imageAutoScale
}
