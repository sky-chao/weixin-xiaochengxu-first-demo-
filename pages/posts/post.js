import lists from "../../data/posts-data.js";
Page({
  data:{
  },
  onLoad:function(){
    this.setData({ list: lists.postList})
  },
  onPostTap(e){
    var postId = e.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId
    })
  },
  onswipertap(e){
      var postswiperId = e.target.dataset.postid;
      wx.navigateTo({
          url: 'post-detail/post-detail?id=' + postswiperId
      })
  }
})