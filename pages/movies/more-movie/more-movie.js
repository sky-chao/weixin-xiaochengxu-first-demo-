import utils  from "../../../utils/utils.js";
var app=getApp();
Page({
    data: {
       
    },
    onLoad: function (options) {
        var movieTitle = options.movieType;
        var dataUrl="";
        switch (movieTitle){
            case "正在热映": 
                dataUrl=app.globalData.doubanBase + "/v2/movie/in_theaters" ;
            break;
            case "即将上映": 
                dataUrl =app.globalData.doubanBase + "/v2/movie/coming_soon";
            break;
            case "豆瓣Top250": 
                dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
            break;
        }
        utils.http(dataUrl,this.callback);
        this.setData({
            movieTitle: movieTitle,
        });
    },
    callback(res){
        console.log(res);
    },
    onReady(){
        wx.setNavigationBarTitle({
            title: this.data.movieTitle
        })
    }
})