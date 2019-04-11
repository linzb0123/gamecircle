// pages/longpost/longpost.js
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
    isAll: '1',
    gameId: '',
    userId: '',
    result: [{}],
    touchStart:0,
    touchEnd:0,
    role:0,
  },
  /**
   *点击添加地址事件
   */
  add_address_fun: function () {
    wx.navigateTo({
      url: 'add_address/add_address',
    })
  },
  /**
   * 长按删除
   */
  touchStart: function (e) {
    var that = this;
    that.setData({
      touchStart: e.timeStamp
    })
  },
  touchEnd: function (e) {
    var that = this;
    that.setData({
      touchEnd: e.timeStamp
    })
  },
  intoPost: function (e) {
    var that = this;
    var id = e.currentTarget.id
    var touchTime = that.data.touchEnd - that.data.touchStart;
    if (touchTime < 500) { //自定义长按时长，单位为ms
      wx.navigateTo({
        url: "../post_details/postDetails?type=2&&id=" + id
      })
     }
  },
  deletePost: function (e) {
    var that = this;
    var id = e.currentTarget.id
    var touchTime = that.data.touchEnd - that.data.touchStart;
    wx.showModal({
      title: '警告️',
      content: '是否删除帖子',
      success: function (res) {
        if (res.confirm) {
          util.post(app.globalData.URL + '/longNews/deletePost', {
            id: id
          })
            .then(res => {
              wx.hideLoading();
              if (res.data.code == 200) {
                for (var i = 0; i < that.data.result.data.length; i++) {
                  var status = "result.data[" + i + "].status"
                  if (that.data.result.data[i].id == id) {
                    that.setData({
                      [status]: 1
                    })
                    break;
                  }
                }
              } else {
                console.log("数据获取失败")
              }
            })
            .catch((res) => {
              console.log(res)
            })
        } else if (res.cancel) {
          // console.log(this.data.result)
        }
      }
    })
  },
  toDetail:function(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url:"../post_details/postDetails?type=2&&id="+id,
    })
  },
  toOtherUserInfo: function (e) {
    var userId = e.currentTarget.id;
    wx.navigateTo({
      url: "../other-userinfo/other-userinfo?userId=" + userId,
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

    this.setData({
      [avatarUrl]: app.globalData.userInfo.headimgurl,
      [nickName]: app.globalData.userInfo.nickname,
    })
    var userId = options.userId;
    this.setData({
      userId:userId
    })
    if(this.data.userId == ''){
      this.setData({
        role: 1
      })
      util.get(app.globalData.URL + '/longNews/getMyselfByUserId/' + app.globalData.userId, {})
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
    }else{
      util.get(app.globalData.URL + '/longNews/getMyselfByUserId/' + userId, {})
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
