// pages/message/message.js
const app = getApp()
var getData = require('../../utils/util.js')
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scroll_height: 10,
    scrolltop:10000000,
    content:'',   
    headimgurl:"",
    uid:0,
    nickname:"未命名",
    messagess:[],
    isfocus:false,
    sending:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let uid = options.uid;
    console.log(uid)
    let nickname;
    let headimgurl;
    let userMessageList = wx.getStorageSync('userMessageList');
    let flag=false;
    for (let i = 0; i < userMessageList.length; i++) {
      console.log(userMessageList[i].uid)
      if (userMessageList[i].uid == uid) {
        nickname = userMessageList[i].nickname;
        headimgurl = userMessageList[i].headimgurl;
        userMessageList[i].hasRedPoint=false;
        flag=true;
        break ;
      }
    }
    if(!flag){
      util.get(app.globalData.URL + '/wxUser/getUserInfoById', { userId: uid })
        .then(res => {
          if (res.data.code == 1) {
            this.data.uid = res.data.content.userFewInfo.id;
            this.setData({
              headimgurl: res.data.content.userFewInfo.headimgurl,
              nickname: res.data.content.userFewInfo.nickname
            })
            // wx.setNavigationBarTitle({ title: res.data.content.userFewInfo.nickname+"" });
          }
        })
        
    }else{
      wx.setStorageSync('userMessageList', userMessageList)
      console.log(nickname)
      // wx.setNavigationBarTitle({ title: nickname + "" });
      this.data.uid = uid;
      this.setData({
        headimgurl: headimgurl,
        nickname: nickname,
        messagess: wx.getStorageSync('usermsg' + options.uid)
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      scrolltop: 999999
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that =this;
    app.wsHandlerMessageAfter = res => {
      let data = JSON.parse(res.data);
      if (data.fromId == that.data.uid) {
        that.setData({
          messagess: wx.getStorageSync('usermsg' + that.data.uid),
          scrolltop: 100000
        })
        that.updataUserMessageListRedPoint(that.data.uid);
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.wsHandlerMessageAfter = null;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.wsHandlerMessageAfter=null;
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
  test: function () {
   console.log("sdsd");
  },
  messageInput:function(e){
      this.setData({
        content: e.detail.value
      })
    
  },
  send:function(e){
    let that =this;
    let time = new Date();
    time = getData.toDate(time);
    let content = this.data.content;
    if (content=="")
      return;
    this.setData({
      content: "",
    })
    console.log(this.data.content)
    let msg = {
      'fromId': app.globalData.userInfo.id,
      'toId': this.data.uid,
      'message': content,
      'sendTime': time
    }
    app.sendSocketMessage(msg)
    this.updateMessage(msg,true)
    setTimeout(function(){
      that.setData({
        content: "",
      })
    },100);
  },

  updateMessage:function(data,me){
    let that =  this;
    let newMessage = {
      time: data.sendTime,
      content: data.message,
      me: me
    }
    this.data.messagess.push(newMessage);
    console.log("------adas",data)
    wx.setStorage({
      key: 'usermsg' + that.data.uid,
      data: that.data.messagess,
    })
    let len = this.data.messagess.length + 1;
    that.setData({
      messagess: that.data.messagess,
      scrolltop: len * 20000
    });
    that.updataUserMessageList(data,me);
  },


  updataUserMessageList: function (data, ishasRedPoint){
    let that = this;
    console.log("updataUserMessageList",data)
    let userMessageList = wx.getStorageSync('userMessageList');
    if (!userMessageList) userMessageList = [];
    let flag = false;
    for (let i = 0; i < userMessageList.length; i++) {
      if (userMessageList[i].uid == data.toId) {
        let msg = userMessageList.splice(i, 1)[0];
        msg.message = data.message;
        msg.latest = data.sendTime;
        userMessageList.unshift(msg);
        wx.setStorageSync('userMessageList', userMessageList);
        flag=true;
        break;
      }
    }
    if(!flag){
      let userMessageList = wx.getStorageSync('userMessageList');
      if (!userMessageList) userMessageList=[];
      userMessageList.unshift({
        'uid': data.toId,
        'nickname': that.data.nickname,
        'headimgurl': that.data.headimgurl,
        'message': data.message,
        'latest': data.sendTime,
        'hasRedPoint': !ishasRedPoint,
      });
      wx.setStorageSync('userMessageList', userMessageList)
    }
  }, 
  updataUserMessageListRedPoint: function (uid) {
    let that = this;
    let userMessageList = wx.getStorageSync('userMessageList');
    if (!userMessageList) userMessageList = [];
    for (let i = 0; i < userMessageList.length; i++) {
      if (userMessageList[i].uid == uid) {
        userMessageList[i].hasRedPoint=false;
        wx.setStorageSync('userMessageList', userMessageList);
        return;
      }
    }
  }, 
  tootherinfo:function(){
    wx.navigateTo({
      url: '../other-userinfo/other-userinfo?userId='+this.data.uid,
    })
  }
})