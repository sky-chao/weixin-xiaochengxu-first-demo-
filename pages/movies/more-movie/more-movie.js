import utils  from "../../../utils/utils.js";
var app=getApp();
Page({
    data: {
        movies:{},
        movieTitle:"",
        dataUrl:"",
        getstartCount:0,
        isEmpty:true
    },
    onLoad: function (options) {
        var movieTitle = options.movieType;
        var dataUrl="";
        //根据点击传入的参数，比对出改发送请求的地址
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
        //发送请求
        utils.http(dataUrl, this.getMovieListData);
        this.setData({
            movieTitle: movieTitle,
            dataUrl: dataUrl
        });
    },
    //请求成功回调函数返回的数据,且过滤处自己需要的
    getMovieListData(data) {
        var movies = [];
        for (var index in data.subjects) {
            var subject = data.subjects[index];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "..."
            }
            var temp = {
                "title": title,
                "image": subject.images.large,
                "average": subject.rating.average,
                "id": subject.id,
                "starArray": utils.convertToStarsArray(subject.rating.stars)//调去获取星星数组的方法
            };
            movies.push(temp);
        }
        //处理每次请求数据累加20条
        var totalMovies={};
        if (!this.data.isEmpty){
            totalMovies=this.data.movies.concat(movies)
        }else{
            totalMovies=movies;
            this.data.isEmpty=false;
        }
        this.setData({
            movies: totalMovies
        });
        this.data.getstartCount+=20;
    },
    //设置窗口头显示的title
    onReady(){
        wx.setNavigationBarTitle({
            title: this.data.movieTitle
        })
    },
    //下滑至页面底部加载数据
    onscrolltolower(e){
        var moreUrl = this.data.dataUrl + "?start="+this.data.getstartCount+"&count=20";
        utils.http(moreUrl, this.getMovieListData);
    }
})