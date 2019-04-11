// pages/post_details/postDetails.js
const app = getApp()
var util = require('../..//utils/util.js')
import Toast from '../../dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputReply:'hidden',
    isfocus: true,
    comment:'',
    type: '',
    postId:'',
    // inputReply: 'visible',
    inputButton:'visible',
    // inputButton: 'hidden',
    isAble: 'false',
    btnType: 'default',
    space: '0rpx',
    posterName:'',
    posterTime: '',
    posterMessage: '',
    posterHeadurl:'',
    posterId:'',
    replies:[{}],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var id = options.id;
    this.setData({
      type:options.type,
      postId:id
    })
    wx.showLoading({
      title: '加载中...',
    });
    if (options.type==1){
      util.get(app.globalData.URL + '/instantNews/getDetails/'+id, {})
        .then(res => {
          wx.hideLoading();
          if (res.data.code == 200) {
            that.setData({
              posterName: res.data.result.user.username,
              posterId: res.data.result.user.id,
              posterTime: util.toDate(res.data.result.createTime),
              posterMessage: res.data.result.message,
              posterHeadurl: res.data.result.user.headimgurl,
              replies: res.data.result.instantNewsReply2DtoList,
            })
            if (this.data.replies ){
              for (var i = 0; i < this.data.replies.length; i++) {
                var time = "replies[" + i + "].createTime"
                that.setData({
                  [time]: util.toDate(this.data.replies[i].createTime)
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
    } else if (options.type == 2){
      util.get(app.globalData.URL + '/longNews/getDetails/'+id, {})
        .then(res => {
          wx.hideLoading();
          if (res.data.code == 200) {
            that.setData({
              posterName: res.data.result.user.username,
              posterTime: util.toDate(res.data.result.createTime),
              posterMessage: res.data.result.message,
              posterId: res.data.result.user.id,
              posterHeadurl: res.data.result.user.headimgurl,
              replies: res.data.result.longNewsReply2Dtos,
            })
            if (this.data.replies){
              for (var i = 0; i < this.data.replies.length; i++) {
                var time = "replies[" + i + "].createTime"
                that.setData({
                  [time]: util.toDate(this.data.replies[i].createTime)
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

  },

  makeSure:function(){
    var that = this
    if(!this.data.comment){
      return 
    }else{
      if( this.data.type == 1 ){
        util.get(app.globalData.URL + '/instantNews/sendComment/', {comment:this.data.comment,
  postId:this.data.postId,
  userId:app.globalData.userId})
          .then(res => {
            wx.hideLoading();
            if (res.data.code == 200) {
              Toast.success('评论成功')
              setTimeout(function () {
                wx.redirectTo({
                  url: "/pages/post_details/postDetails?type=1&&id=" + that.data.postId
                })
              }, 1000)
            } else {
              Toast.fail("帖子已过期")
              console.log("数据获取失败")
            }
          })
          .catch((res) => {
            console.log(res)
          })
      }else if(this.data.type == 2){
        util.get(app.globalData.URL + '/longNews/sendComment/', {
          comment: this.data.comment,
          postId: this.data.postId,
          userId: app.globalData.userId
        })
          .then(res => {
            wx.hideLoading();
            if (res.data.code == 200) {
              Toast.success('评论成功')
              setTimeout(function(){
                wx.redirectTo({
                  url: "/pages/post_details/postDetails?type=2&&id=" + that.data.postId
                })
              },1000)
              
            } else {
              console.log("数据获取失败")
            }
          })
          .catch((res) => {
            console.log(res)
          })
      }
    }
  },

  /**
  * 检测键盘输入的事件改变状态
  */
  valueChange:function(event){
    if(event.detail.value.length>0){
      this.setData({
        isAble: 'true',
        btnType: 'primary',
        comment: event.detail.value
      })
    }else{
      this.setData({
        isAble: 'false',
        btnType: 'defalut',
      })
    }
  },

})