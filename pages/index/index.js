// pages/index/index.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickname:'文体两开花'
    },
    focusGames: [],
    fgexpireTime: wx.getStorageSync('fgexpireTime'),//缓存过期时间
    _fgexpireTime:3*60*60*1000 //3小时
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //var seconds = parseInt(t);
    //getUserinfo
    if (app.globalData.userInfo){
      console.log("app.globalData.userInfo")
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }else{
      console.log("userInfoReadyCallback")
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res
        })
      }
    }

    
  },
  //事件处理函数
  bindUserInfoViewTap: function () {
    wx.navigateTo({
      url: '../userinfo/userinfo'
    })
  },
  bindPLViewTap: function () {
    wx.navigateTo({
      url: '../private_letter/privateLetter'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  onShow:function(){
    //没有缓存 从数据库拉取并保存
    let focusGames =  wx.getStorageSync('focusGames')
    if (!focusGames) {
      this.getFocusGames();
    } else {
      //判断缓存是否过期
      let fgexpireTime1 = wx.getStorageSync('fgexpireTime');
      if (fgexpireTime1) {
        let seconds = parseInt(fgexpireTime1)
        let timestamp = Date.parse(new Date())
        if (seconds < timestamp) {
          console.log("guoqi")
            this.getFocusGames();
        }else{
          this.setData({
            focusGames:wx.getStorageSync('focusGames')
          })
        }
      }else{
        this.getFocusGames();
      }
    }
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
  toInstantNews:function(event){
    wx.navigateTo({
      url: '../intime/index?isAll=1&&gameId=',
    })
  },
  getFocusGames: function () {
    let that = this;
    let token  = wx.getStorageSync('token')
    if(!token){
      setTimeout(function(){
        that.getFocusGames();
      },1000);
      return;
    }
    // var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    util.get(app.globalData.URL + '/wxGame/getFocus', {})
    .then(res=>{
      wx.hideLoading();
      console.log("getfocus--",res)
      if (res.data.code==1){
        that.setData({
          focusGames: res.data.content.focus
        })
        wx.setStorageSync('focusGames', res.data.content.focus)
        wx.setStorageSync('fgexpireTime', Date.parse(new Date()) + that.data._fgexpireTime)
      }
      
    })
  },
  intoyxq:function(e){
    let gameId = e.currentTarget.dataset.gameid;
    wx.navigateTo({
      url: '/pages/intime/index?/isAll=0&gameId=' + gameId,
    })
  },
  addgame:function(e){
    wx.navigateTo({
      url: '/pages/focusgame/focusgame',
    })
  }
})