// pages/focusgame/focusgame.js
import Dialog from '../../dist/dialog/dialog';
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    show:true,
    btnName:"编辑",
    game:[
      {name:'星际争霸星际争'},
      {name:'绝地求生'},
      { name: '炉石传说' },
      { name: '魔兽世界' },
      { name: '守望先锋' },
    ],
    addgame:[
      {name:'荒野行动'},
      {name:'英雄联盟'},
    ],
    result:'',
  },
  change(e){
    console.log(e)
  if (this.data.btnName == "编辑") {
      this.setData({
        show: (!this.data.show),
        btnName: '完成'
      })
    } else {
      this.setData({
        show: true,
        btnName: '编辑'
      })
    }
  },
  
  delete:function(event){
    util.get(app.globalData.URL + '/userInfo/deleteGameFocus', {
      userId: app.globalData.userId,
      gameId: event.currentTarget.id
    })
      .then(res => {
        wx.hideLoading();
        if (res.data.code == 200) {
          let focusGames = wx.getStorageSync('focusGames');
          if (!focusGames) focusGames = [];
          for (let i = 0; i < focusGames.length;i++){
            if (focusGames[i].id == event.currentTarget.id){
              focusGames.splice(i,1);
              wx.setStorageSync('focusGames', focusGames);
              break;
            }
          }
          for (var i = 0; i < this.data.result.length; i++) {
            if (this.data.result[i].id == event.currentTarget.id) {
              var status = "result[" + i + "].status"
              this.setData({
                [status]: 0
              })
              break;
            }
          }
        } else {
          console.log(res.data)
        }
      })
      .catch((res) => {
        console.log(res)
      })
  },
  add:function(event){
    util.get(app.globalData.URL + '/userInfo/addGameFocus', {
      userId: app.globalData.userId,
      gameId: event.currentTarget.id
    })
      .then(res => {
        wx.hideLoading();
        if (res.data.code == 200) {
          let focusGames = wx.getStorageSync('focusGames');
          if (!focusGames) focusGames=[];
          focusGames.push(res.data.content.gameInfo);
          wx.setStorageSync('focusGames', focusGames);
          for (var i = 0; i < this.data.result.length; i++) {
            if (this.data.result[i].id == event.currentTarget.id) {
              var status = "result[" + i + "].status"
              this.setData({
                [status]: 1
              })
              break;
            }
          }
        } else {
          console.log(res.data)
        }
      })
      .catch((res) => {
        console.log(res)
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.get(app.globalData.URL + '/wxGame/getList/'+app.globalData.userId, {})
      .then(res => {
        wx.hideLoading();
        if (res.data.code == 200) {
          this.setData({
            result: res.data.content.data
          })
        } else {
          console.log(res.data)
        }
      })
      .catch((res) => {
        console.log(res)
      })
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