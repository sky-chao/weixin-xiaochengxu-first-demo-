import starArray from "../../utils/utils.js";
var app = getApp();
Page({
    data:{
        containerShow: true,
        searchPanelShow: false,
        soon:{},
        top:{},
        well:{},
        searchMovie:{}
    },
    onLoad(option) {
        var wellReceived = app.globalData.doubanBase + "/v2/movie/in_theaters" + "? start=0&count=3";
        var Soon_to_be_shown = app.globalData.doubanBase + "/v2/movie/coming_soon" + "? start=0&count=3";
        var topList = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
        this.getResources(wellReceived, "well", "正在热映");
        this.getResources(Soon_to_be_shown, "Soon", "即将上映");
        this.getResources(topList, "top", "豆瓣Top250");
    },
    //发请求的公共方法
    getResources(url, key, MovieType) {
        var that = this;
        wx.request({
            url: url,
            header: {
                "Content-Type": "json"
            },
            success(res) {
                that.getMovieListData(res.data.subjects, key, MovieType);
            },
            fail(res) {
                console.log(res.errMsg)
            }
        })
    },
    //请求成功的数据，提取出自己想要的temp
    getMovieListData(data, key, MovieType){
        var movies=[];
        for (var index in data){
            var subject=data[index];
            var title = subject.title;
            if(title.length>=6){
                title=title.substring(0,6)+"..."
            }
            var temp={
                "title": title,
                "image": subject.images.large,
                "average": subject.rating.average,
                "id": subject.id,
                "starArray": starArray.convertToStarsArray(subject.rating.stars)//调去获取星星数组的方法
            };
            movies.push(temp);
        }
        //使用传入key区分热映、即将上映、top250类型（以至于键名相同，每次调用被覆盖）
        var dataList={};
        dataList[key] = { 
            MovieType: MovieType,
            movies: movies};
        this.setData(
            dataList
        )
    },
    //加载更多电影（跳转到新的页面）
    onMoreTap(e){
        var movieType = e.currentTarget.dataset.movietype;//线获取事件绑定组建上data的数据，再以url参数传递数据至子页面
        wx.navigateTo({
            url:"more-movie/more-movie?movieType="+movieType
        })
    },
    //点击跳转到电影详情页(movieId:html通过data-属性传递数据被事件对象e接受，通过url传递到其他页面)
    onMovietap(e) {
        var movieId=e.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: 'movie-detail/movie-detail?Id=' + movieId
        })
    },
    //搜索框获取焦点时
    onBindfocus(){
        this.setData({
            containerShow: false,
            searchPanelShow: true,
        })
    },
    onCancelImgTap(){
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            searchMovie:{}
        })
    },
    searchCommand(e){
        var text = e.detail.value;
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        this.getResources(searchUrl, "searchMovie", "")
    },
    //bindchange事件文档没有，如果官方禁止使用此方法，就改成bindblur事件
    onbindchange(e){
        this.searchCommand(e)
    },
    //失去焦点按回车不管事，所以利用bindchange来弥补
    onbindblur(e){
        this.searchCommand(e)
    },
    
    //作业：以后完成下拉刷新，和上拉加载功能。（参考more-movie功能）
})