import starArray from "../../utils/utils.js";
var app = getApp();
Page({
    onLoad(option) {
        var wellReceived = app.globalData.doubanBase + "/v2/movie/in_theaters" + "? start=0&count=3";
        var Soon_to_be_shown = app.globalData.doubanBase + "/v2/movie/coming_soon" + "? start=0&count=3";
        var topList = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
        this.getResources(wellReceived, "well", "正在热映");
        this.getResources(Soon_to_be_shown, "Soon", "即将上映");
        this.getResources(topList, "top", "豆瓣Top250");
    },
    //发请求的公共方法
    getResources(url, key, MovieType){
        var that=this;
        wx.request({
            url: url,
            header: {
                "Content-Type": "json"
            },
            success(res) {
                that.getMovieListData(res.data.subjects,key,MovieType);
            },
            fail(res){
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
        console.log(dataList);
    }
})