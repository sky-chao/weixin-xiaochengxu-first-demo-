import utils from "../../../utils/utils.js";
var app = getApp();
Page({
    data: {
        movies: {},
        movieTitle: "",
        dataUrl: "",
        getstartCount: 0,
        isEmpty: true
    },
    onLoad: function(options) {
        var movieTitle = options.movieType;
        var dataUrl = "";
        //根据点击传入的参数，比对出改发送请求的地址
        switch (movieTitle) {
            case "正在热映":
                dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
                break;
            case "即将上映":
                dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
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
                "starArray": utils.convertToStarsArray(subject.rating.stars) //调去获取星星数组的方法
            };
            movies.push(temp);
        }
        //处理每次请求数据累加20条
        var totalMovies = {};
        if (!this.data.isEmpty) {
            totalMovies = this.data.movies.concat(movies)
        } else {
            totalMovies = movies;
            this.data.isEmpty = false;
        }
        this.setData({
            movies: totalMovies
        });
        //累加，每次请求参数start起始开始的数
        this.data.getstartCount += 20;
        //关闭加载Loading
        wx.hideNavigationBarLoading()
    },
    //设置窗口头显示的title ，duiUI的操作必须写在此生命周期函数及以后
    onReady() {
        wx.setNavigationBarTitle({
            title: this.data.movieTitle
        })
    },
    //上滑至页面底部加载数据
    onReachBottom(e) {
        // onscrolltolower(e){
        var moreUrl = this.data.dataUrl + "?start=" + this.data.getstartCount + "&count=20";
        utils.http(moreUrl, this.getMovieListData);
        wx.showNavigationBarLoading() //打开Loading
    },
    //下滑刷新（只要20条数据）
    onPullDownRefresh(e) {
        var moreUrl = this.data.dataUrl + "?start=0&count=20";
        //消除进入请求回调函数getMovieListData中，if 判断造成的数据累加代码段问题
        this.data.dataUrl = {};
        this.data.isEmpty = true;
        //下次刷新时从0号元素开始，而不是有20条数据的一个跳跃。
        this.data.totalCount = 0;
        utils.http(moreUrl, this.getMovieListData);
        wx.showNavigationBarLoading(); //打开Loading
        wx.stopPullDownRefresh() //停止当前页面下拉刷新。
    },
    //点击跳转到电影详情页(movieId:html通过data-属性传递数据被事件对象e接受，通过url传递到其他页面)
    onMovietap(e) {
        var movieId = e.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: '../movie-detail/movie-detail?Id=' + movieId
        })
    },
})