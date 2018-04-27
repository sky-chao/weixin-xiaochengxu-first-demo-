import lists from "../../../data/posts-data.js";
var app=getApp();
var g_isplay = app.globalData.g_isplaymusic;//全局播放状态
Page({
  data: {
    isplaymusic: false
  },
  //初始化
  onLoad(option) {
    //option参数中有点击传入的get参数id
    var postId = option.id;
    this.setData({
      lists: lists.postList[postId],//获取通过id及上边import引进对象中数组的嵌套数据
      postId
    })
    // var post_Collections={
    //     0:false,
    //     3:true
    // }
    //获取存储在本地的收藏状态
    var postCollections = wx.getStorageSync("post_Collections");
    if (postCollections) {
      var CollectionId = postCollections[postId];//得到的值 true/false
      this.setData({
        Collection: CollectionId//方便显示wxml显示那张图片
      })
    } else {
      var postCollections = {};
      postCollections[postId] = false;
      wx.setStorageSync("post_Collections", postCollections);
    }


    //解决手机全局播放与小程序播放器图片按钮显示一致 （bug 已解决）
    var that=this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isplaymusic: true
      })
    });//监听音乐播放
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isplaymusic:false
      })
    })//监听音乐暂停。


    //如果初始全局音乐播放状态为true，就改变此页面的音乐初始状态,在局部改变状态时，通知全局（播放与暂停）
    if (app.globalData.g_isplaymusic){
      this.setData({
        isplaymusic:true
      })
    }
  },
  //点击收藏与取消收藏
  onCollection() {
    var postCollections = wx.getStorageSync("post_Collections");
    this.showToast(postCollections);
  },
  //用户有提示没有选择权的提示框
  showToast(postCollections) {
    //当点击收藏，就是给收藏按钮状态取反（缓存）
    postCollections[this.data.postId] = !postCollections[this.data.postId]
    wx.setStorageSync("post_Collections", postCollections);
    //同时也要初始化收藏按钮图片显示状态
    this.setData({
      Collection: postCollections[this.data.postId]
    })
    //提醒用户是否收藏/取消成功 ，用到的API:wx.showToast(OBJECT)
    wx.showToast({
      title: postCollections[this.data.postId] ? "收藏成功" : "取消成功",
      icon: "success",
      duration: 1000
    });
  },
  //魔太框,再次提示用户收藏与否
  showModal(postCollections) {
    var that = this;
    wx.showModal({
      title: "提示",
      cancelText: "取消",
      confirmText: "确定",
      content: postCollections[that.data.postId] ? "是否取消收藏？" : "是否收藏？",
      success(res) {
        if (res.confirm) {
          //当点击收藏，就是给收藏按钮状态取反（缓存）
          postCollections[that.data.postId] = !postCollections[that.data.postId]
          wx.setStorageSync("post_Collections", postCollections);
          //同时也要初始化收藏按钮图片显示状态
          that.setData({
            Collection: postCollections[that.data.postId]
          })
        }

      }
    })

  },
  //用户点击分享时（​显示操作菜单）
  onsharetap(e) {
    //显示操作菜单
    wx.showActionSheet({
      itemList: ['发QQ朋友圈', '发QQ好友', '发微信朋友圈', '发微信好友'],
      itemColor: "#b3d4db",
      success: function (res) {
        //res.tapIndex数组元素的序号从0开始（itemList）
        wx.showModal({
          title: '分享至',
          content: '真的要分享到',
          fail(res) {
            console.log(res)
          }
        })
      }
    })
  },
  //背景音乐的播放
  onmiusictap() {
    var a = this.data.isplaymusic
    var that = this;
    var postItemData = lists.postList[that.data.postId];
    // var g_isplay = app.globalData.g_isplaymusic;
    if (a) {
      wx.pauseBackgroundAudio();
      this.setData({
        isplaymusic: false
      })
      g_isplay=false;

    } else {
      wx.playBackgroundAudio({
        dataUrl: postItemData.music.url,
        title: postItemData.music.title,
        coverImgUrl: postItemData.music.coverImg
      })
      this.setData({
        isplaymusic: true
      })
      g_isplay = true;
    }
    this.setData({
      isplaymusic: !a
    })
  }


})