Page({
  totap: function () {
    // wx.navigateTo({
    //   url:"../posts/post"
    // });
    //   wx.redirectTo({
    //   url: "../posts/post",
    // })
    //带有Tab的只能用下边的方法跳转
    wx.switchTab({
        url: "../posts/post"
    });
  }
})