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

var menu = '<div style="" class="md"><form action="" class="commentfaces"><input type="text" class="commentfacesearch" style="padding: 4px;margin-bottom: 5px;border: 2px solid lightgrey;border-radius: 5px;color: grey;" placeholder="search commentfaces">';
menu += '<div class="commentfacewrapper" style="height:150px;display:none;overflow-hidden;">';
menu += '<div class="commentfacecontainer" style="width:100%;height:100%;overflow-y:scroll;padding-right:17px;box-sizing:content-box;"></div></div></form></div>';

var replyButton = document.getElementsByClassName("reply-button");

for(var i = 0; i < replyButton.length; i++){
  replyButton[i].addEventListener('click', function(){
    var form = $( this ).parents(".entry").siblings(".child").children('form');
    form.prepend( menu );
    createCommentfacefield(form);
  });
}

function createCommentfacefield(form) {

  var classname = document.getElementsByClassName("addCommentface");
  var classnamesearch = document.getElementsByClassName("commentfacesearch");

  for(var j = 0; j < classnamesearch.length; j++) {

    classnamesearch[j].addEventListener('keyup', function() {

      if(this.value.length > 1) {

        var result = "";
        let filteredFaces = commentfaces.filter(x => x.toLowerCase().includes(this.value));
        $(this).siblings(".commentfacewrapper").css("display","inherit");

        filteredFaces.forEach(function(filteredFace) {
          if(url == "manga") {
            result += "<a href=\"//#"+filteredFace+"\" class=\"addCommentface\" data-href-url=\"//#"+filteredFace+"\"></a>";
          }
          else if(url == "anime") {
            result += "<a href=\"#"+filteredFace+"\" class=\"addCommentface\" rel=\"nofollow\"></a>";
          }
        });

        $(this).siblings('.commentfacewrapper').children('.commentfacecontainer').html(result);

        for (var i = 0; i < classname.length; i++) {
            classname[i].addEventListener('click', function() {

              var commentcode = this.getAttribute("href");
              var output = '[]('+commentcode+')';
              var formfield = $(this).parents(".commentfacecontainer").parents(".commentfacewrapper").parents(".commentfaces").parents(".md").siblings(".usertext-edit").children(".md").children("textarea");
              var cursorposition = formfield.prop("selectionStart");
              var formfieldcontent = formfield.val();

              if(cursorposition == "undefined") {
                formfield.val(formfield.val() + output);
              }
              else {
                if(formfieldcontent.length > 0) {

                  var formfieldbefore = formfieldcontent.substr(0,cursorposition);
                  var formfieldafter = formfieldcontent.substr(cursorposition,formfieldcontent.length - 1 )
                  formfield.val(formfieldbefore + output + formfieldafter);

                }
                else {

                  formfield.val(output);

                }

              }

            }, false);
        }
      }

    });

  }

}
