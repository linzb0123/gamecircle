// pages/publish/publish.js
const app = getApp()
var util = require('../..//utils/util.js')
import Toast from '../../dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // hiddenmodalput: true,   // 控制弹窗显示隐藏
    // textareaVal: '',        // textarea的文本值
    // times: '请点击选择截止时间',
    showDialog: false,
    buttonName: '即刻',
    short: true,
    array: [
      [
        '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
      ],
      [
        '00', '10', '20', '30', '40', '50'
      ]
    ],
    time: [0, 0],
    details:'',
    gameName: '',
    type: '',
    gameId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var gameId = options.gameId;
    var type = options.type;
    if (type == 1) {
      this.setData({
        short: true,
        buttonName: "即刻",
        type: 1,
        gameId: gameId
      })
    } else {
      this.setData({
        short: false,
        buttonName: "长期",
        type: 2,
        gameId: gameId
      })
    }

    util.get(app.globalData.URL + '/wxGame/getInfo/' + gameId, {})
      .then(res => {
        wx.hideLoading();
        if (res.data.code == 200) {
          this.setData({
            gameName:res.data.content.YxqGame.gameName
          })
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  select(e) {
    if (this.data.buttonName == '即刻') {
      this.setData({
        short: false,
        buttonName: '长期',
        type:2,
      })
    } else {
      this.setData({
        short: true,
        buttonName: '即刻',
        type:1,
      })
    }
  },
  //  点击时间组件确定事件

  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value,
    })
  },





  isfouce: function() {
    this.setData({
      hiddenmodalput: false
    })
  },

  textarea: function(e) {
    this.setData({
      textareaVal: e.detail.dataset.value
    })
  },

  bindTextAreaBlur: function(e) {
    var that = this;
    that.setData({
      details: e.detail.value
    });
  },
  
  makeTrue:function(e){
    let that =this;
    if (this.data.details == ''){
      Toast.fail("内容不能为空")
      return
    }
    if (this.data.type == 1 && this.data.time[0] == 0 && this.data.time[1] == 0){
      Toast.fail("请选择时间")
      return
    }
    if(this.data.type == 1){
      util.get(app.globalData.URL + '/instantNews/sendPost', {
        userId : app.globalData.userId,
        hour: this.data.time[0],
        minute: this.data.time[1],
        gameId: this.data.gameId,
        message: this.data.details
      })
        .then(res => {
          wx.hideLoading();
          if (res.data.code == 200) {
            Toast.success("发布成功！")
            setTimeout(function () {
            wx.redirectTo({
              url: "/pages/intime/index?isAll=&&gameId=" + that.data.gameId
              })
            }, 1000)
          } else {
            Toast.fail("发布失败")
            setTimeout(function () {
              wx.redirectTo({
                url: "/pages/intime/index?isAll=&&gameId=" + that.data.gameId
              })},1000)
            console.log("数据获取失败")
          }
        })
        .catch((res) => {
          console.log(res)
        })
    }else{
      util.get(app.globalData.URL + '/longNews/sendPost', {
        userId: app.globalData.userId,
        gameId: this.data.gameId,
        message: this.data.details
      })
        .then(res => {
          wx.hideLoading();
          if (res.data.code == 200) {
            Toast.success("发布成功")
            setTimeout(function(){
              wx.redirectTo({
                url: "/pages/longterm/longterm?isAll=&&gameId=" + that.data.gameId,
              })
            }, 1000)
           
          } else {
            Toast.fail("发布失败")
            setTimeout(function () {
              wx.redirectTo({
                url: "/pages/longterm/longterm?isAll=&&gameId=" + that.data.gameId
              })
            }, 1000)
            console.log("数据获取失败")
          }
        })
        .catch((res) => {
          console.log(res)
        })
    }
  }
})