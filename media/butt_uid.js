
var words = [
  "sausage",
  "timpani",
  "sassacre",
  "stumble",
  "ugly",
  "corn",
  "heart",
  "squirt",
  "scatter",
  "trouble",
  "radio",
  "religion",
  "shoulder",
  "hair",
  "troll",
  "disease",
  "chair",
  "butter",
  "pun",
  "frost",
  "fire",
  "light",
  "dark",
  "earth",
  "wind",
  "casserole",
  "egg",
  "flop",
  "squint",
  "attack",
  "retreat",
  "slide",
  "glide",
  "astro",
  "euro",
  "camera",
  "cable",
  "shoe",
  "lace",
  "bag",
  "watch"];


function butt_uid(){
  var d = new Date();
  var ms = d.getTime()
  return _.sample(words) + "-" + ms;
}

if(typeof(module) !== 'undefined'){
  module.exports = butt_uid;
}
