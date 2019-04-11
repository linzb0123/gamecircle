//app.js
const util = require('./utils/util.js');
var SocketTask;
var socketOpen = false;
var websocketUrl = "ws://localhost/ws/yxq";
var socketMsgQueue = [];
var recount = 3;
App({
  globalData: {
    userInfo: null,
    URL: "http://localhost/api",
    userId: 1,
    userHeadUrl: 'http://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/902397dda144ad34948e2bfcd7a20cf431ad859c.jpg',
    username: "___小爷。",
    hasLogin:false,
  },
  onLaunch: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      that.checkLogin();
    }else{
      that.login();
    }
  },
  login: function () {
    var that = this;
    wx.showLoading({
      title: '登陆中...',
      mask: true,
    });
    wx.login({
      success: function (res) {
        var loginCode = res.code;
        util.post(that.globalData.URL +'/wxUser/login', { code: loginCode})
            .then((res)=>{
              wx.hideLoading();
              if (res.data.code == 1) {
                console.log(res.data);
                that.globalData.userInfo = res.data.content.userInfo
                that.globalData.userId = res.data.content.userInfo.id
                that.globalData.userHeadUrl = res.data.content.userInfo.headimgurl
                that.globalData.username = res.data.content.userInfo.username
                that.setUserInfo(res.data.content.userInfo)
                //存到本地
                wx.setStorageSync('token', res.data.content.token);
                that.globalData.token = res.data.content.token;
                if (that.loginReadyCallback) {
                  that.loginReadyCallback(res)
                }
                that.globalData.hasLogin = true;
                // that.initMessage()
                that.toIndex()
                that.webSocket()
                return;
              }
              if (res.data.code == 4) {
                // 去注册
                that.registerUser(loginCode);
                return;
              }
            // 登录错误
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false
              })
              return;
            })
          .catch((errmsg)=>{
              wx.hideLoading();
              console.log(errmsg)
            })
      }
    })
  },
  registerUser: function (code) {
    console.log("begin register");
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log("已经授权了")
          wx.getUserInfo({
            lang:'zh_CN',
            success: function (res) {
              var iv = res.iv;
              var encryptedData = res.encryptedData;
              var signature = res.signature;
              var rawData = res.rawData;
              // 下面开始调用注册接口 
              wx.showLoading({
                title: '开始注册...',
                mask: true,
              });
              let postdata= {code: code,
                    encryptedData: encryptedData,
                    iv: iv,
                    signature: signature,
                    rawData: rawData
                  }; // 服务器解密参数
              util.post(that.globalData.URL +'/wxUser/register', postdata)
                .then(function (res) { 
                  wx.hideLoading()
                  that.globalData.userInfo = res.data.content.userInfo
                  that.globalData.userId = res.data.content.userInfo.id
                  that.globalData.userHeadUrl = res.data.content.userInfo.headimgurl
                  that.globalData.username = res.data.content.userInfo.username
                  that.setUserInfo(res.data.content.userInfo)
                  that.globalData.token = res.data.content.token
                  that.globalData.hasLogin = true;
                  that.toIndex()
                  that.webSocket()
                })
                .catch((res) => {
                  wx.hideLoading();
                  console.log(res);
                })
            }
          })
        } else {
          //跳转授权
          wx.navigateTo({
            url: '/pages/authorization/authorization'
          })
        }
      }
    })
  },
  checkLogin: function () {
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask:true
    });
    util.get(that.globalData.URL+'/wxUser/checkLogin',{})
    .then(res=>{
      //此处玄学,不延迟的话有时候不会隐藏
      setTimeout(() => {
        wx.hideLoading();
      }, 100);
      if (res.data.code == 1){
        console.log("token有效")
        that.globalData.userInfo = res.data.content.userInfo
        that.globalData.userId = res.data.content.userInfo.id
        that.globalData.userHeadUrl = res.data.content.userInfo.headimgurl
        that.globalData.username = res.data.content.userInfo.username
        that.setUserInfo(res.data.content.userInfo)
        console.log(that.globalData.userInfo)
        if (that.loginReadyCallback) {
          that.loginReadyCallback(res)
        }
        that.globalData.hasLogin=true;
        that.toIndex();
        // that.initMessage()
        that.webSocket()
      } else if (res.data.code == -1){
        console.log("token无效，重新登陆");
        that.login();
      }else{
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        })
        return;
      }
    })
    .catch((res) => {
      wx.hideLoading();
      console.log(res);
    })
  },
  setUserInfo:function(res){
    // 防止先加载导致值为空
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback(res)
    }
  },
  webSocketListen:function(){
    var that = this;
    SocketTask.onOpen(res => {
      socketOpen = true;
      recount = 3;
      console.log('websocket连接成功', res)
      for (var i = 0; i < socketMsgQueue.length; i++) {
        sendSocketMessage(socketMsgQueue[i])
      }
      socketMsgQueue = []
    })
    SocketTask.onClose(onClose => {
      console.log('监听 WebSocket 连接关闭事件。', onClose)
      socketOpen = false;
      console.log(recount)
      if (recount>0){
        console.log('15秒后重连')
        recount--;
        setTimeout(function () {
          if (!socketOpen)
            that.webSocket();
        }, 15000);//15秒后重连
      }else{
        console.log('连接超时')
      }
      
    })
    SocketTask.onError(onError => {
      console.log('监听 WebSocket 错误。错误信息', onError)
      socketOpen = false
    })
    SocketTask.onMessage(onMessage => {
      console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', JSON.parse(onMessage.data))
      var data = JSON.parse(onMessage.data)
      //自定义接消息监听
      console.log(Array.isArray(data));
      //是数组的话是接收以前没收到的
      if(Array.isArray(data)){
        that. handMessageList(data);
        return;
      }
      let msgList = wx.getStorageSync('usermsg' + data.fromId);
      if (!msgList) msgList=[];
      msgList.push({
        'content': data.message,
        'time':data.sendTime
      });
      wx.setStorageSync('usermsg' + data.fromId, msgList);
      let userMessageList = wx.getStorageSync('userMessageList');
      if (!userMessageList) userMessageList=[];
      let flag = false;
      for (let i = 0; i < userMessageList.length;i++){
        if (userMessageList[i].uid == data.fromId){
          console.log('-------------')
          let msg = userMessageList.splice(i,1)[0];
          msg.message=data.message;
          msg.latest = data.sendTime;
          msg.hasRedPoint=true;
          userMessageList.unshift(msg);
          wx.setStorageSync('userMessageList', userMessageList)
          flag=true;
          break;
        }
      }
      if(!flag){
        // console.log('flag in')
        let msg = {
          'uid': data.fromId,
          'nickname': "未命名",
          'headimgurl': "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqp98MAhy0sVO4QibGaJiccUSy2P4GRys4kOVViaTpIFhJbNvoxwqCibEJPRoeDsymoibibPVU3YWxCrSgA/132",
          'message': data.message,
          'latest': data.sendTime,
          'hasRedPoint': true,
        }
        userMessageList.unshift(msg);
        wx.setStorageSync('userMessageList', userMessageList);
        let needToLoadInfo= wx.getStorageSync('needToLoadInfo');
        if (!needToLoadInfo) needToLoadInfo=[];
        if (needToLoadInfo.indexOf(data.fromId)==-1){
          needToLoadInfo.unshift(data.fromId);
          wx.setStorageSync('needToLoadInfo', needToLoadInfo);
        }
      }
      // if(that.private_letterHander){
      //   that.private_letterHander(onMessage)
      // }
      if (that.wsHandlerMessageAfter) {
        that.wsHandlerMessageAfter(onMessage);
      }
    })
  },
  webSocket: function () {
    let that = this
    // 创建Socket
    SocketTask = wx.connectSocket({
      url: websocketUrl,
      data: 'data',
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      method: 'post',
      success: function (res) {
        console.log('开始连接websocket', res)
        // that.webSocketListen()
      },
      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
        })
        console.log(err)
      },
    });
    that.webSocketListen();
  },
  sendSocketMessage:function(msg) {
    let data = JSON.stringify(msg)
    if(socketOpen) {
      wx.sendSocketMessage({
        data: data
      })
    } else {
      socketMsgQueue.push(data)
    }
  },
  initMessage: function () {
    return;
    var that = this;
    var msgMap = new Map();
    var userMessageList = wx.getStorageSync("userMessageList");
    console.log("有userMessageList缓存");
    if (!userMessageList) userMessageList=[];
    var tempMessageList = [];
    //打开页面需要加载的昵称头像的用户列表
    var needToLoadInfo = wx.getStorageSync("needToLoadInfo"); 
    if (!needToLoadInfo) needToLoadInfo = [];
    let latest = wx.getStorageSync('latest');
    if(!latest) latest=0;
    util.get(this.globalData.URL + '/message/getMessage/' + latest, {})
    .then(res=>{
      // console.log(res);
      let arr = res.data.content.messages;
      console.log("arr",arr);
      let fromIds =[];
      if (arr.length==0){
        console.log('0000000000')
        return;
      }
      let timestamp = arr[0].sendTime;
      wx.setStorage({
        key: 'latest',
        data: timestamp,
      })
      for(let i =0;i<arr.length;i++){
        if (fromIds.indexOf(arr[i].fromId)==-1){
          fromIds.push(arr[i].fromId);
          let index = that.getIndexFromUserMessageList(userMessageList,arr[i].fromId)
          console.log("index"+index);
          if (index==-1){
            needToLoadInfo.push(arr[i].fromId);
            tempMessageList.push({
               'uid': arr[i].fromId,
              'nickname': '未命名',
              'headimgurl':'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqp98MAhy0sVO4QibGaJiccUSy2P4GRys4kOVViaTpIFhJbNvoxwqCibEJPRoeDsymoibibPVU3YWxCrSgA/132',
                'message': arr[i].message,
              'latest': util.toDate(arr[i].sendTime),
               'hasRedPoint': true
               })
          }else{
            let msg = userMessageList.splice(index,1)[0];
            msg.message = arr[i].message;
            msg.latest = util.toDate(arr[i].sendTime);
            msg.hasRedPoint = true;
            tempMessageList.push(msg);
          }
          let msglist = [{
            'content': arr[i].message,
            'time': util.toDate(arr[i].sendTime)
          }];
          msgMap.set(arr[i].fromId, msglist);
        }else{
          let msglist = msgMap.get(arr[i].fromId);
          msglist.unshift({
            'content': arr[i].message,
            'time': util.toDate(arr[i].sendTime)
          })
          msgMap.set(arr[i].fromId, msglist);
        }
      }
      //打开页面需要加载的昵称头像的用户列表
      wx.setStorage({
        key: 'needToLoadInfo',
        data: needToLoadInfo,
      })
      //把结果缓存
      for (var [key, value] of msgMap) {
        console.log(key + " = " + value);
        let userMsg = wx.getStorageSync('usermsg' + key);
        if (!userMsg) userMsg=[];
        userMsg = userMsg.concat(value);
        wx.setStorage({
          key: 'usermsg' + key,
          data: userMsg,
        })
      }
      //私信列表缓存处理
      let newuserMessageList = userMessageList.concat(tempMessageList)
      wx.setStorage({
        key: 'userMessageList',
        data: newuserMessageList,
      })
    })
  },
  handMessageList:function(data){
    console.log("data",data);
    var that = this;
    var msgMap = new Map();
    var userMessageList = wx.getStorageSync("userMessageList");
    console.log("有userMessageList缓存");
    if (!userMessageList) userMessageList = [];
    var tempMessageList = [];
    //打开页面需要加载的昵称头像的用户列表
    var needToLoadInfo = wx.getStorageSync("needToLoadInfo");
    if (!needToLoadInfo) needToLoadInfo = [];
        // console.log(res);
    let arr = data;
    let fromIds = [];
    if (arr.length == 0) {
      // console.log('0000000000')
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      if (fromIds.indexOf(arr[i].fromId) == -1) {
        fromIds.push(arr[i].fromId);
        let index = that.getIndexFromUserMessageList(userMessageList, arr[i].fromId)
        console.log("index" + index);
        if (index == -1) {
          needToLoadInfo.push(arr[i].fromId);
          tempMessageList.push({
            'uid': arr[i].fromId,
            'nickname': '未命名',
            'headimgurl': 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqp98MAhy0sVO4QibGaJiccUSy2P4GRys4kOVViaTpIFhJbNvoxwqCibEJPRoeDsymoibibPVU3YWxCrSgA/132',
            'message': arr[i].message,
            'latest': arr[i].sendTime,
            'hasRedPoint': true
            })
        } else {
          let msg = userMessageList.splice(index, 1)[0];
          msg.message = arr[i].message;
          msg.latest = util.toDate(arr[i].sendTime);
          msg.hasRedPoint = true;
          tempMessageList.push(msg);
        }
        let msglist = [{
            'content': arr[i].message,
            'time': arr[i].sendTime
          }];
          msgMap.set(arr[i].fromId, msglist);
      } else {
          let msglist = msgMap.get(arr[i].fromId);
          msglist.unshift({
            'content': arr[i].message,
            'time': arr[i].sendTime
          })
          msgMap.set(arr[i].fromId, msglist);
      }
    }
    //打开页面需要加载的昵称头像的用户列表
    wx.setStorageSync('needToLoadInfo', needToLoadInfo)
      //把结果缓存
    for (var [key, value] of msgMap) {
      console.log(key + " = " + value);
      let userMsg = wx.getStorageSync('usermsg' + key);
      if (!userMsg) userMsg = [];
      userMsg = userMsg.concat(value);
      wx.setStorageSync('usermsg' + key, userMsg);
    }
    //私信列表缓存处理
    let newuserMessageList = tempMessageList.concat(userMessageList)
    wx.setStorageSync('userMessageList', newuserMessageList)

  },
  getIndexFromUserMessageList:function(list,uid){
    for(let i=0;i<list.length;i++){
      if(uid==list[i].uid){
        return i;
      }
    }
    return -1;
  },
  toIndex:function(){

  }
})