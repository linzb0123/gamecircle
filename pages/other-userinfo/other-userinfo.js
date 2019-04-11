// pages/other-userinfo/other-userinfo.js
const app = getApp()
var util = require('../../utils/util.js')
import Toast from '../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'你的名字',
    sex:'男',
    address:'广东 广州',
    games:'',
    signature: '我是个没有感情的杀手',
    ifFocus:false,
    rotate: 'hide',
    result:'',
    info:'暂无',
    userId:'',
    disabled:false,
    postNum:0,
    concernNum:0,
    show: {
      middle: false,
      top: false,
      top2:false,
      bottom: false,
      right: false,
      right2: false
    },
  },
  toggle(type) {
    this.setData({
      [`show.${type}`]: !this.data.show[type]
    });
  },
  focus() {
    util.get(app.globalData.URL + '/userInfo/addConcerns', {
      fromId: app.globalData.userId,
      toId: this.data.userId
    })
      .then(res => {
        wx.hideLoading();
        if (res.data.code == 200) {
          Toast.success('关注成功')
          this.setData({
            ifFocus: true,
            disabled: true,
          });
          setTimeout(() => {
            this.setData({
              disabled: false,
            });
          }, 3000);
        } else {
          Toast.fail('关注失败')
        }
      })
      .catch((res) => {
        console.log(res)
      })
  },
  nofocus(){

    util.get(app.globalData.URL + '/userInfo/deleteConcerns', {
      fromId: app.globalData.userId,
      toId: this.data.userId
    })
      .then(res => {
        wx.hideLoading();
        if (res.data.code == 200) {
          Toast.success('取关成功')
          this.setData({
            ifFocus: false,
            disabled: true
          });
          setTimeout(() => {
            this.setData({
              disabled: false,
            });
          }, 3000);
        } else {
          Toast.fail('取关失败')
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
    var that = this;
    var userId = options.userId
    this.setData({
      userId : userId
    })
    wx.showLoading({
      title: '加载中',
      mask:true
    });
    util.get(app.globalData.URL + '/userInfo/getUserInfoByUserId', {
      id : app.globalData.userId,
      userId : userId
    })
      .then(res => {
        wx.hideLoading();
        if (res.data.code == 200) {
          this.setData({
              postNum : res.data.content.data[1],
              concernNum: res.data.content.data[2]
          })
          if (res.data.content.data[0].status == 1){
            this.setData({
              result: res.data.content.data[0],
              ifFocus: true
            })
          }else{
            this.setData({
              result: res.data.content.data[0],
              ifFocus: false
            })
          }
       
          if(this.data.result.info){
            this.setData({
              info:this.data.result.info
            })
          }
          var sex = "result.sex";
          if(this.data.result.sex == 1){
            this.setData({
              [sex]:'男'
            })
            
          } else if (this.data.result.sex == 2){
            this.setData({
              [sex]:'女'
            })
          }else{
            this.setData({
              [sex]: '保密'
            })
          }
          if(this.data.result.games){
            var game='';
            for(var i=0;i<this.data.result.games.length;i++){
              game = game + this.data.result.games[i].gameName + " "
            }
            this.setData({
              games:game
            })
          }
          // console.log(this.data.result)
        } else {
          console.log("数据获取失败")
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

  },
  
  toPost:function(e){
    wx.navigateTo({
      url:'../shortpost/shortpost?userId='+this.data.userId,

    })
  },
  tomessage:function(e){
    let uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../message/message?uid=' + uid,
    })
  }

 
})