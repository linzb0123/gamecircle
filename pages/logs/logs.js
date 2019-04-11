//logs.js
const util = require('../../utils/util.js')
// import Toast from '../../dist/toast/toast';
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    // Toast.loading({ mask: true, message: '加载中...' });
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
  // showLoadingToast() {
  //   Toast.loading({ mask: true, message: '加载中...' });
  // },
})
