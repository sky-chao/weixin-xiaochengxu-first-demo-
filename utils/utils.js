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
    convertToStarsArray: convertToStarsArray
}
