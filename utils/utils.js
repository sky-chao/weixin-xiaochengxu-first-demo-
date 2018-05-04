//http请求数据的方法
function http(url,callback){
    wx.request({
        url: url,
        method: 'GET',
        header: {
            "Content-Type": "json"
        },
        success(res) {
            callback(res.data)
        },
        fail(res) {
            console.log(res.errMsg)
        }
    })
}
//获取星星数组的处理方法
function convertToStarsArray(stars){
    var num = stars.toString().substring(0,1);
    var star=[];
    for(var i=0;i<5;i++){
        if(i<num){
            star.push(1);
        }else{
            star.push(0);
        }
    }
    return star;
}
module.exports={
    convertToStarsArray: convertToStarsArray,
    http: http
}
