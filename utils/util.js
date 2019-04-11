const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const toDate = date =>{
  // var time = date * 1000;
  var date = new Date(date);  
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatDuring = data =>{
  var date = data / 1000
  var hour = Math.floor(date / 3600)
  date = date % 3600
  var minute = Math.floor(date / 60)
  var second = date % 60
  return hour + ":" + minute + ":"+ second
}

const  post = (url, data) =>  {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: { 
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('token')
        },
      success: function (res) {
        if (res.statusCode == 200) {
          resolve(res);
        } else {//返回错误提示信息
          reject(res.data);
        }
      },
      error: function (e) {
        reject('网络出错');
      }
    })
  });
  return promise
}
// 封装get请求
const get = (url, data) => {
  var promise = new Promise((resolve, reject) => {
    //网络请求
    wx.request({
      url: url,
      data: data,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {//服务器返回数据
        if (res.statusCode == 200) {
          resolve(res);
        } else {//返回错误提示信息
          reject(res.data);
        }
      },
      fail: function (e) {
        console.log("success");
        reject('网络出错');
      }
    })
  });
  return promise;
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  post:post,
  get:get,
  toDate:toDate,
  formatDuring: formatDuring
}
