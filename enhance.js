var url = window.location.href;
url = url.replace("https://www.reddit.com/r/","");
url = url.slice(0, url.indexOf("/"));

var apiurl = 'https://shit-taste.net/api/commentfacescall.php?sub='+url;
var commentfaces = [];

var request = new XMLHttpRequest();
request.open("POST", apiurl);
request.setRequestHeader("Content-Type", "application/json");
request.overrideMimeType("text/plain");
request.onload = function()
{
    var options = JSON.parse(request.responseText);
    options.forEach(function(option){
      commentfaces.push(option);
    });
};
request.send();

var filteredFaces = [];

var menu = '<div style="" class="md"><form action="" id="commentfaces"><input type="text" id="commentfacesearch" style="padding: 4px;margin-bottom: 5px;border: 2px solid lightgrey;border-radius: 5px;color: grey;" placeholder="search commentfaces"><br /><div id="commentfacewrapper" style="height:150px;display:none;overflow-hidden;">';
menu += '<div id="commentfacecontainer" style="width:100%;height:100%;overflow-y:scroll;padding-right:17px;box-sizing:content-box;"></div></div></form></div>';

$( ".usertext-edit" ).prepend( menu );

var classname = document.getElementsByClassName("addCommentface");

document.getElementById("commentfacesearch").addEventListener('keyup', function() {

  if(this.value.length > 1) {

    var result = "";
    let filteredFaces = commentfaces.filter(x => x.toLowerCase().includes(this.value));
    $("#commentfacewrapper").css("display","inherit");

    filteredFaces.forEach(function(filteredFace) {
      if(url == "manga") {
        result += "<a href=\"//#"+filteredFace+"\" class=\"addCommentface\" data-href-url=\"//#"+filteredFace+"\"></a>";
      }
      else if(url == "anime") {
        result += "<a href=\"#"+filteredFace+"\" class=\"addCommentface\" rel=\"nofollow\"></a>";
      }
    });

    $("#commentfacecontainer").html(result);

    for (var i = 0; i < classname.length; i++) {
        classname[i].addEventListener('click', function() {

          var commentcode = this.getAttribute("href");
          var output = '[]('+commentcode+')';
          $("textarea").val($('textarea').val()+output);

        }, false);
    }
  }

});
