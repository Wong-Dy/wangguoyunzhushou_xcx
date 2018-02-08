function showToast(obj) {
  wx.showToast({
    title: obj.msg,
    icon: obj.icon,
    duration: obj.duration,
    image: obj.img ? obj.img : null
  })
}

function hideToast() {
  wx.hideToast()
}

var defaultDuration = 3000

module.exports = {
  show: function (msg, duration,cb) {
    if (typeof duration == 'undefined') {
      duration = defaultDuration
    } else if (duration == 0) {
      duration = 60000
    } else if (duration == -1) {
      duration = 3600000
    }

    showToast({
      msg: msg,
      icon: 'success',
      duration: duration
    })

    setTimeout(function(){
      typeof cb == 'function' && cb()
    }, duration)
  },
  hide: function () {
    hideToast()
  },
  error: function (msg, duration) {
    if (typeof duration == 'undefined') {
      duration = defaultDuration
    } else if (duration == 0) {
      duration = 60000
    } else if (duration == -1) {
      duration = 3600000
    }
    showToast({
      msg: msg,
      icon: 'success',
      duration: duration,
      img: '/dist/images/message/error.png'
    })
  },
  warn: function (msg, duration) {
    if (typeof duration == 'undefined') {
      duration = defaultDuration
    } else if (duration == 0) {
      duration = 60000
    } else if (duration == -1) {
      duration = 3600000
    }
    showToast({
      msg: msg,
      icon: 'success',
      duration: duration,
      img: '/dist/images/message/warning.png'
    })
  },
  netex: function (msg, duration) {
    if (typeof msg == 'undefined') {
      msg = '网络开小差了...'
    }
    if (typeof duration == 'undefined') {
      duration = defaultDuration
    } else if (duration == 0) {
      duration = 60000
    } else if (duration == -1) {
      duration = 3600000
    }
    showToast({
      msg: msg,
      icon: 'success',
      duration: duration,
      img: '/dist/images/message/net_exception.png'
    })
  },
  loadFail: function (msg, duration) {
    if (typeof msg == 'undefined') {
      msg = '加载失败...'
    }
    if (typeof duration == 'undefined') {
      duration = defaultDuration
    } else if (duration == 0) {
      duration = 60000
    } else if (duration == -1) {
      duration = 3600000
    }
    console.log(duration)
    showToast({
      msg: msg,
      icon: 'success',
      duration: duration,
      img: '/dist/images/message/load_fail.png'
    })
  },

  loading: function (msg, duration) {
    if (typeof msg == 'undefined') {
      msg = '拼命加载中...'
    }
    if (typeof duration == 'undefined') {
      duration = 5000
    } else if (duration == 1) {
      duration = 10000
    }
    if (duration != 0) {
      setTimeout(function () {
        wx.hideLoading()
      }, duration)
    }
    wx.showLoading({
      title: msg,
    })
  },
  loaded: function () {
    wx.hideLoading()
  },

  modal: function (msg, cb) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success: function (res) {
        if (res) {
          typeof cb == 'function' && cb()
        }
      }
    })
  },
  modal2: function (msg, cb) {
    wx.showModal({
      title: '提示',
      content: msg,
      success: function (res) {
        if (res) {
          typeof cb == 'function' && cb(res)
        }
      }
    })
  }
}