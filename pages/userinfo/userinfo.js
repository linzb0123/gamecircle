// pages/userinfo/userinfo.js
const app = getApp()
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'昵称',
    radio1: '1',
    change: true,
    showView: true,
    sex:0,
    signature:'我是个没有感情的杀手',
    btnName: "编辑",
    address:'广东 广州',
    game:'风暴英雄风暴英雄风暴英雄风暴雄',
    userInfo: {},
    hasChange:false,
    concernCount:0,
    focCount:0
  },
  radioOnChange(event) {
    const { key } = event.currentTarget.dataset;
    this.setData({ [key]: event.detail });
    let usex = "userInfo.sex"
    this.data.hasChange=true
    if(key==1){
      this.setData({
        [usex]:'男'
      })
    }else{
      this.setData({
        [usex]:'女'
      })
    }
  },

  change(e){
    console.log(e)
    if(this.data.btnName=="编辑"){
      this.setData({
        change: false,
        showView: (!this.data.showView),
        btnName: '完成'
      })
    }else{
      this.setData({
        change: true,
        showView: true,
        btnName: '编辑'
      })
      console.log(this.data.userInfo)
      this.updateUserInfo()
    }
    
  },
  changeName(e){
    this.data.hasChange = true
    console.log(e);
    let nick = "userInfo.nickname"
    this.setData
    ({
        [nick]: e.detail
    })
  },
  changeSignature(e) {
    this.data.hasChange = true
    console.log(e);
    let info = "userInfo.info"
    this.setData
      ({
        [info]: e.detail
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res
        })
      }
    }
    console.log(this.data.userInfo)
  },
  updateUserInfo:function(){
    //post userInfo to server
    if(this.data.hasChange){
      console.log("update")
      util.post(app.globalData.URL + '/wxUser/updateInfo', { info: this.data.userInfo.info })
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
    this.getConcernCount();
    let gameList=""
    let focusGames = wx.getStorageSync('focusGames');
    if (!focusGames) focusGames=[];
    for(let i =0;i<focusGames.length;i++){
      gameList = gameList+" "+focusGames[i].gameName
    }
    this.setData({
      game: gameList
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

  },
  getConcernCount:function(){
    let that = this;
    util.get(app.globalData.URL +'/userInfo/countConAndFoc',{})
    .then(res=>{
      that.setData({
        concernCount: res.data.content.conCount,
        focCount: res.data.content.focCount
      })
    })
  },
  intoBeconcern(){
    wx.navigateTo({
      url: '../befocususers/befocususers',
    })
  }
})