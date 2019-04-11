// pages/private_letter/privateLetter.js
import Dialog from "../../dist/dialog/dialog.js";
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userMessageList:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let userMessageList = wx.getStorageSync("userMessageList")
    // this.setData({
    //   userMessageList: userMessageList
    // })
    // console.log(userMessageList)
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
    let that = this;
    this.setData({
      userMessageList: wx.getStorageSync("userMessageList")
    })
    this.loadUserBaseInfo();

    if (!app.wsHandlerMessageAfter) {
      app.wsHandlerMessageAfter = res => {
        that.setData({
          userMessageList: wx.getStorageSync('userMessageList')
        })
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
    app.wsHandlerMessageAfter = null;
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

  onClose(event) {
    let that = this;
    var duid = event.currentTarget.dataset.uid;
    console.log("even",event);
    const { position, instance } = event.detail;
    switch (position) {
      // case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          let _userMessageList = that.deleteMsgFromUserMessageList(duid);
          that.setData({
            userMessageList: _userMessageList
          })
          instance.close();
        }).catch(()=>{
          instance.close();
        });
        break;
    }
  },
  tapToMessage:function(e){
    let uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: '../message/message?uid=' + uid
    })
  },
  loadUserBaseInfo:function(){
    let that = this;
    let needToloadInfo = wx.getStorageSync('needToLoadInfo');
    console.log(needToloadInfo);
    if (!needToloadInfo || needToloadInfo.length==0) return;
    let ids = needToloadInfo.join("_");
    wx.removeStorageSync("needToLoadInfo");
    util.get(app.globalData.URL + '/wxUser/getUserInfoByIdList', { 'ids': ids})
    .then(res=>{
      let userInfoList = res.data.content.info;
      that.updateUserInfo(userInfoList);
    })
    .catch(res=>{
      let needToloadInfo2 = wx.getStorageSync('needToLoadInfo');
      if (!needToloadInfo2) needToloadInfo2=[];
      needToloadInfo.concat(needToloadInfo2);
      wx.setStorage({
        key: 'needToLoadInfo',
        data: needToloadInfo,
      })
    })


  },


  getUserInfoFromStorage: function (userId){
    let that = this
    let _userInfo = wx.getStorageSync('user'+userId)
    if(!_userInfo){
      util.get(app.globalData.URL + '/wxUser/getUserInfoById', { userId: userId})
        .then(res => {
          // setTimeout(() => {
            wx.hideLoading();
          // }, 100);
          if (res.data.code == 1) {
            wx.setStorage({
              key: 'user'+userId,
              data: res.data.content.userFewInfo,
            })
          }
        })
        .catch((res) => {
          wx.hideLoading();
          console.log(res);
        })
    }
    return _userInfo
  },
  updateUserInfo:function(info){
    let userMessageList=wx.getStorageSync("userMessageList");
    let len = info.length ;
    for (let j = 0; j < userMessageList.length && len>0; j++) {
      for (let i = 0; i < info.length; i++) {
        if (info[i].id == userMessageList[j].uid) {
          userMessageList[j].nickname = info[i].nickname;
          userMessageList[j].headimgurl = info[i].headimgurl;
          len--;
          break;
        }
      }
    }

    for (let i = 0; i < info.length;i++){
      for (let j = 0; j < userMessageList.length;j++){
        if (info[i].id == userMessageList[j].uid){
          userMessageList[j].nickname = info[i].nickname;
          userMessageList[j].headimgurl = info[i].headimgurl;
          break;
        }
      }
    }
    wx.setStorageSync("userMessageList", userMessageList);
    this.setData({
      userMessageList: userMessageList
    })
  },

  deleteMsgFromUserMessageList:function(uid){
    let userMessageList = wx.getStorageSync("userMessageList");
    for (let i = 0; i < userMessageList.length;i++){
      if (userMessageList[i].uid==uid){
        userMessageList.splice(i,1);
        wx.setStorageSync("userMessageList", userMessageList);
        return userMessageList;
      }
    }
  }
})