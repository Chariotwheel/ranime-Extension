var commentfaces = [
  "firstthinginthemorning",
  "watashihasdeclined",
  "killitwithfire",
  "toradorasalute",
  "kukuku2",
  "akkotears"
];

// https://b.thumbs.redditmedia.com/-H-7U_6ANr6zR_Mvkzbv0hiKzlVdm1vR7G6egC5WICs.css
// regex: \.md \[href\$="#.*\]

var apiurl = 'https://shit-taste.net/api/user/?user=Chariotwheel';

var request = new XMLHttpRequest();
request.open("POST", apiurl);
request.setRequestHeader("Content-Type", "application/json");
request.overrideMimeType("text/plain");
request.onload = function()
{
    var options = JSON.parse(request.responseText);
    console.log("Response received: " + options[0]);
    //$(".page-content .avatar").css("max-width","230px");
    //$(".name").css("color","red");
};
request.send();

var filteredFaces = [];

var menu = '<div style="" class="md"><form action="" id="commentfaces">';
menu += '<input type="text" id="commentfacesearch" placeholder="search commentfaces"><br /><div id="commentfacewrapper" style="height:150px;display:none;overflow-hidden;">';
menu += '<div id="commentfacecontainer" style="width:100%;height:100%;overflow-y:scroll;padding-right:17px;box-sizing:content-box;">';
menu += '</div></div></form></div>';

$( ".usertext-edit" ).prepend( menu );

var classname = document.getElementsByClassName("addCommentface");

document.getElementById("commentfacesearch").addEventListener('keyup', function() {

  if(this.value.length > 0) {

    var result = "";
    let filteredFaces = commentfaces.filter(x => x.toLowerCase().includes(this.value));
    $("#commentfacewrapper").css("display","inherit");

    filteredFaces.forEach(function(filteredFace) {
      result += "<a href=\"#"+filteredFace+"\" class=\"addCommentface\" rel=\"nofollow\"></a>";
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
