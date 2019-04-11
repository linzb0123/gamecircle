// pages/focususers/focususers.js
import Dialog from "../../dist/dialog/dialog.js";
import Toast from '../../dist/toast/toast';
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:'',
  },
  onClose(event) {
    const { position, instance } = event.detail;
    switch (position) {
      // case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定取消关注吗？',
        }).then(() => {
          util.get(app.globalData.URL + '/userInfo/deleteConcerns', {
            fromId: app.globalData.userId,
            toId: event.currentTarget.id
          })
            .then(res => {
              wx.hideLoading();
              if (res.data.code == 200) {
                Toast.success('取消成功')
                setTimeout(function () {
                  wx.navigateTo({
                    url: "/pages/focususers/focususers"
                  })
                }, 1500) 
              } else {
                Toast.fail('取消失败')
              }
            })
            .catch((res) => {
              console.log(res)
            })
          instance.close();
        }).catch(() => {
          instance.close();
        });
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var that = this
    util.get(app.globalData.URL + '/userInfo/getUserConcornsByUserId/' + app.globalData.userId, {})
      .then(res => {
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            result: res.data.content.data,
          })
        } else {
          console.log("数据获取失败")
        }
      })
      .catch((res) => {
        console.log(res)
      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})