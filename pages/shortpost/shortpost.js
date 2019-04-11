// pages/shortpost/shortpost.js
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
    result: [{}],
    userId:'',
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
        url: "../post_details/postDetails?type=1&&id=" + id
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
            util.post(app.globalData.URL + '/instantNews/deletePost' , {
              id : id
            })
              .then(res => {
                wx.hideLoading();
                if (res.data.code == 200) {
                  for (var i = 0; i < that.data.result.data.length;i++){
                    var status = "result.data[" + i + "].status"
                    if (that.data.result.data[i].id == id ){
                      that.setData({
                        [status]:2
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
      url : "../post_details/postDetails?type=1&&id="+id,
    })
  },
  toOtherInfo:function(e){
    var userId = e.currentTarget.id;
     wx.navigateTo({
       url:"../other-userinfo/other-userinfo?userId="+userId,
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userId = options.userId;
    this.setData({
      userId : userId,
    })
    var that = this;
    /**
     * 获取用户信息
     */
    var avatarUrl = 'userInfo.avatarUrl';
    var nickName = 'userInfo.nickName';

    this.setData({
      [avatarUrl]: app.globalData.userInfo.headimgurl,
      [nickName]: app.globalData.userInfo.nickname,
    })
    if( userId == ''){
      this.setData({
        role: 1
      })
        util.get(app.globalData.URL + '/instantNews/getMyselfByUserId/' + app.globalData.userId, {})
          .then(res => {
            wx.hideLoading();
            if (res.data.code == 200) {
              that.setData({
                result: res.data.content,
                Time: res.data.content.data
              })
              if (this.data.result.data.length > 0) {
                for (var i = 0; i < this.data.result.data.length; i++) {
                  var countDown = "result.data[" + i + "].photo"
                  var endTime = "result.data[" + i + "].endTime"
                  if (this.data.result.data[i].status == 1) {
                    this.setData({
                      [countDown]: '已过期',
                    })
                  } else {
                    that.setData({
                      [endTime]: this.data.result.data[i].endTime - Date.parse(new Date()),
                      [countDown]: util.formatDuring(this.data.result.data[i].endTime - Date.parse(new Date())),
                    })
                  }
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
      util.get(app.globalData.URL + '/instantNews/getMyselfByUserId/' + userId, {})
        .then(res => {
          wx.hideLoading();
          if (res.data.code == 200) {
            that.setData({
              result: res.data.content,
              Time: res.data.content.data
            })
            if (this.data.result.data.length > 0) {
              for (var i = 0; i < this.data.result.data.length; i++) {
                var countDown = "result.data[" + i + "].photo"
                var endTime = "result.data[" + i + "].endTime"
                if (this.data.result.data[i].status == 1) {
                  this.setData({
                    [countDown]: '已过期',
                  })
                } else {
                  that.setData({
                    [endTime]: this.data.result.data[i].endTime - Date.parse(new Date()),
                    [countDown]: util.formatDuring(this.data.result.data[i].endTime - Date.parse(new Date())),
                  })
                }
                console.log(this.data.result)
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

    setInterval(() => {
      for (var i = 0; i < this.data.Time.length; i++) {
        var time = "Time[" + i + "].endTime"
        var formatTime = "result.data[" + i + "].photo"
        if (this.data.Time[i].photo != '0:0:0' && this.data.Time[i].photo != '已过期') {
          this.setData({
            [time]: this.data.Time[i].endTime - 1000,
            [formatTime]: util.formatDuring(this.data.Time[i].endTime - 1000)
          })
        }
      }
    }, 1000)

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

  longterm_tap: function (options) {
    wx.switchTab({
      url: '../longterm/longterm',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onShow();
      }
    })
  },

  /**
   * 用户点击右上角分享
   */

  onShareAppMessage: function () {

  }

})

// wx.switchTab({
//   url: 'pages/longterm/longterm'
// })
