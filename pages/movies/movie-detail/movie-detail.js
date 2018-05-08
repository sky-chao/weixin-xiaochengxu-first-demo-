var app = getApp();
import utils from "../../../utils/utils.js";
Page({
    data: {
        movieInfo: {}
    },
    //获取电影ID，及向豆瓣发送请求
    onLoad(options) {
        var movieId = options.Id;
        this.setData({
            movieId: movieId
        });
        var movieDetailUrl = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
        utils.http(movieDetailUrl, this.getMovieItemData);
    },
    //返回请求数据的回调函数，对数据的处理。
    getMovieItemData(data) {
        if (!data) {
            return;
        }
        var director = {
            avatar: "",
            name: "",
            id: ""
        }
        if (data.directors[0] != null) {
            if (data.directors[0].avatars != null) {
                director.avatar = data.directors[0].avatars.large

            }
            director.name = data.directors[0].name;
            director.id = data.directors[0].id;
        }
        var movieInfo = {
            movieImg: data.images ? data.images.large : "",
            country: data.countries[0],
            title: data.title,
            originalTitle: data.original_title,
            wishCount: data.wish_count,
            commentCount: data.comments_count,
            year: data.year,
            generes: data.genres.join("、"),
            starArray: utils.convertToStarsArray(data.rating.stars),
            average: data.rating.average,
            director: director,
            casts: utils.convertToCastString(data.casts),
            castsInfo: utils.convertToCastInfos(data.casts),
            summary: data.summary
        }
        this.setData({
            movieInfo
        });
    },
    onpreviewTap(e) {
        var images = e.currentTarget.dataset.imgshow;
        //预览图片。
        wx.previewImage({
            "current": images[0],
            "urls": images
        })
    }
})