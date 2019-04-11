//sort.js
//獲取應用實例
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户个人信息
    userInfo: {
      avatarUrl: "",//用户头像
      nickName: "",//用户昵称
    },
    isAll:'',
    gameId:'',
    result:[{}],
  },
  /**
   *点击添加地址事件
   */
  add_address_fun: function () {
    wx.navigateTo({
      url: 'add_address/add_address',
    })
  },
  toDetail:function(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url:"../post_details/postDetails?type=2&&id="+id,
    })
  },
  toOtherUserInfo:function(e){
    var userId = e.currentTarget.id;
    wx.navigateTo({
      url:"../other-userinfo/other-userinfo?userId="+userId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    /**
     * 获取用户信息
     */
    // wx.getUserInfo({
    //   success: function (res) {
    //     var avatarUrl = 'userInfo.avatarUrl';
    //     var nickName = 'userInfo.nickName';
    //     that.setData({
    //       [avatarUrl]: res.userInfo.avatarUrl,
    //       [nickName]: res.userInfo.nickName,
    //     })
    //   }
    // })
    var avatarUrl = 'userInfo.avatarUrl';
    var nickName = 'userInfo.nickName';
    var gameId = options.gameId;
    this.setData({
      [avatarUrl]: app.globalData.userInfo.headimgurl,
      [nickName]: app.globalData.userInfo.nickname,
      gameId: gameId
    })
    var isAll = options.isAll
    if (isAll == 1) {
      util.get(app.globalData.URL + '/longNews/getListByuserId/' + app.globalData.userId, {})
        .then(res => {
          wx.hideLoading();
          if (res.data.code == 200) {
            that.setData({
              result: res.data.content,
              isAll: isAll
            })
            if (this.data.result.data.length > 0) {
              for (var i = 0; i < this.data.result.data.length; i++) {
                var time = "result.data[" + i + "].createTime"
                that.setData({
                  [time]: util.toDate(this.data.result.data[i].createTime)
                })
              }
            }
          } else {
            console.log("数据获取失败")
          }
        })
        .catch((res) => {
          console.log(res)
        })
    } else {
      util.get(app.globalData.URL + '/longNews/getListByGameId/' + gameId, {})
        .then(res => {
          wx.hideLoading();
          if (res.data.code == 200) {
            that.setData({
              result: res.data.content,
            })
            if (this.data.result.data.length > 0) {
              for (var i = 0; i < this.data.result.data.length; i++) {
                var time = "result.data[" + i + "].createTime"
                that.setData({
                  [time]: util.toDate(this.data.result.data[i].createTime),
                })
              }
            }
            // console.log(this.data.result)
          } else {
            console.log("数据获取失败")
          }
        })
        .catch((res) => {
          console.log(res)
        })
    }
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
