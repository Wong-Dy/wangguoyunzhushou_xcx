/*
备注
city: 城市（在程序载入时获取一次）
count: 返回结果数量
baiduAK: 百度地图AK
apiList: api列表
hotKeyword: 搜索页热门关键词关键词
hotTag: 搜索页热门类型
bannerList: 首页（热映页）轮播图列表列表
skinList: “我的”页面背景列表
shakeSound: 摇一摇音效地址（带url表示远程地址）
shakeWelcomeImg: 摇一摇欢迎图片
*/
var distPath = '../../dist'  // dist资源路径
// var url = 'http://localhost:8301'  //app线下url
var url = 'https://ww1.isaihu.com'  //app线上url
module.exports = {
  city: '',
  count: 20,
  baiduAK: 'Y1R5guY8Y2GNRdDpLz7SUeM3QgADAXec',
  apiList: {
    run: 'https://ww1.isaihu.com/api/applet/wx?account=wx_xcx',
    auth: 'https://ww1.isaihu.com/api/applet/wx/auth?system=21',

    // run: 'https://api.isaihu.com/api/applet/wx?account=wx_xcx',
    // auth: 'https://api.isaihu.com/api/applet/wx/auth?system=21',

    baiduMap: 'https://api.map.baidu.com/geocoder/v2/'
  },
  bannerList: [
    { type: 'image', id: 0, imgUrl: distPath + '/images/banner_1.png' }
  ],
  menuList: [
    { name: '4小时', hour: 4 },
    { name: '8小时', hour: 8 },
    { name: '24小时', hour: 24 },
    { name: '3天', hour: 72 },
    { name: '7天', hour: 168 },
    { name: '14天', hour: 336 },

  ],

  bgcolorList: [
    '#E7F6F1',  //#C4E2D8
    '#FFFFCC',  //#FFCCCC

  
  ],

}