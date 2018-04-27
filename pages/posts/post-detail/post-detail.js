import lists from "../../../data/posts-data.js";
Page({
  data: {

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
    //存在
    if (postCollections) {
      var CollectionId = postCollections[postId];
      this.setData({
        Collection: CollectionId
      })
    } else {
      var postCollections = {};
      postCollections[postId] = false;
      wx.setStorageSync("post_Collections", postCollections);
    }
  },
  //点击收藏与取消收藏
  onCollection() {
    var postCollections = wx.getStorageSync("post_Collections");
    //当点击收藏，就是给收藏按钮状态取反（缓存）
    postCollections[this.data.postId] = !postCollections[this.data.postId]
    wx.setStorageSync("post_Collections", postCollections);
    //同时也要初始化收藏按钮图片显示状态
    this.setData({
      Collection: postCollections[this.data.postId]
    })
  }
})