/*
** Get current url to distinct between Subreddits
*/

var url = window.location.href;
url = url.replace("https://www.reddit.com/r/","");
url = url.slice(0, url.indexOf("/"));

/*
** Call API and load up JSON fule into array
*/

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

/*
** Preparing the Commentface Menu
*/

var menu = '<div class="md ranimeenhanced"><form action="" class="commentfaces">';
menu += '<a class="showallcommentfaces">Browse Faces</a>';
menu += '<input type="text" class="commentfacesearch" placeholder="search commentfaces">';
menu += '<input type="text" class="commentfacetext texttop" placeholder="Toptext">';
menu += '<input type="text" class="commentfacetext textbottom" placeholder="Bottomtext">';
menu += '<input type="text" class="commentfacetext texthover" placeholder="Hovertext">';
menu += '<input type="text" class="aniListSearch" placeholder="Search AniList">';
menu += '<div class="commentfacewrapper">';
menu += '<div class="commentfacecontainer"></div></div></form></div>';

/*
** Create Commentface Input on initialy reply to thread reply field
*/

var form = $(".commentarea").children("form");
form.prepend( menu );
createCommentfacefield(form);

/*
** Create Commentface Input Field on Click at the container of the Click
*/

var replyButton = document.getElementsByClassName("reply-button");

for(var i = 0; i < replyButton.length; i++){
  replyButton[i].addEventListener('click', function(){

    var form = $( this ).parents(".entry").siblings(".child").children('form');

    /*
    ** Remove Copy from initial reply field and clear commentfield
    */

    form.children(".md").remove();
    form.children(".usertext-edit").children(".md").children("textarea").val('');

    /*
    ** Add new field
    */

    form.prepend( menu );
    createCommentfacefield(form);

  });
}

/*
** Clicking on Edit Button
*/

var editButton = document.getElementsByClassName("edit-usertext");

for(var i = 0; i < editButton.length; i++){
  editButton[i].addEventListener('click', function(){

    var form = $( this ).parents(".entry").children('form');

    /*
    ** Remove Copy from initial reply field and clear commentfield
    */

    form.children(".md").remove();

    /*
    ** Add new field
    */

    form.prepend( menu );
    createCommentfacefield(form);

  });
}

/*
** Remove Edit Commentfacefield on Cancel or Submit
*/

var cancelButton = document.getElementsByClassName("cancel");

for(var i = 0; i < cancelButton.length; i++){
    cancelButton[i].addEventListener('click', function(){
        $( this ).parents("form").children(".md").remove();
    });
}

var saveButton = document.getElementsByClassName("save");

for(var i = 0; i < saveButton.length; i++){
    saveButton[i].addEventListener('click', function(){
        $( this ).parents("form").children(".md").remove();
    });
}

/*
**
*/

function createCommentfacefield(form) {

  var classname = document.getElementsByClassName("addCommentface");
  var classnamesearch = document.getElementsByClassName("commentfacesearch");

  for(var j = 0; j < classnamesearch.length; j++) {

    /*
    * When typing in the search bar, show fitting commentfaces
    */

    classnamesearch[j].addEventListener('keyup', function() {

      if(this.value.length > 1) {

        var result = "";
        let filteredFaces = commentfaces.filter(x => x.toLowerCase().includes(this.value));
        $(this).siblings(".commentfacewrapper").css("display","inherit");

        filteredFaces.forEach(function(filteredFace) {
          /*
          ** Distinction between subs necessary since the css build differs
          */
          if(url == "manga") {
            result += "<a href=\"//#"+filteredFace+"\" class=\"addCommentface\" data-href-url=\"//#"+filteredFace+"\"></a>";
          }
          else if(url == "anime") {
            result += "<a href=\"#"+filteredFace+"\" class=\"addCommentface\" rel=\"nofollow\"></a>";
          }
        });

        $(this).siblings('.commentfacewrapper').children('.commentfacecontainer').html(result);

        for (var i = 0; i < classname.length; i++) {
            /*
            ** Setting up actions on Clicking the Dummy Commentfaces
            */

            classname[i].addEventListener('click', addClickEvent, false);
        }
      }

    });

  }

  /*
  ** Set the Commentface text on input on the dummy commentfaces
  */

  var commentfacetext = document.getElementsByClassName("commentfacetext");

  for(var i = 0; i < commentfacetext.length; i++){
    commentfacetext[i].addEventListener('keyup', function(){

      var inputclass = $( this ).attr('class').split(' ')[1];
      var inputvalue = $( this ).val();

      var commentfacefield = $( this ).siblings(".commentfacewrapper").children(".commentfacecontainer").children("a");
      commentfacefield.each(function() {
        var facecontent = $( this ).html();
        if(inputclass == "texttop") {
          if(/<strong>.*<\/strong>/.test(facecontent)) {
            var strong = facecontent.match("<strong>.*<\/strong>");
            $( this ).html(inputvalue + strong);
          }
          else {
            $( this ).html(inputvalue);
          }
        }
        else if(inputclass == "textbottom") {
          var strong = facecontent.replace(/<strong>.*<\/strong>/g,"");
          $( this ).html(strong + "<strong>"+inputvalue+"</strong>");
        }
        else if(inputclass == "texthover") {
          $( this ).attr("title",inputvalue);
        }
      });
    });
  }

  /*
  ** Browse Commentfaces
  ** Note: The whole filtering should be put into it's own function. At this point I got the same code twice
  */

  var showallcommentfaces = document.getElementsByClassName("showallcommentfaces");

  for(var i = 0; i < showallcommentfaces.length; i++){
      showallcommentfaces[i].addEventListener('click', function(){
        var result = "";
        filteredFaces = commentfaces;
        $(this).siblings(".commentfacewrapper").css("display","inherit");

        filteredFaces.forEach(function(filteredFace) {
          /*
          ** Distinction between subs necessary since the css build differs
          */
          if(url == "manga") {
            result += "<a href=\"//#"+filteredFace+"\" class=\"addCommentface\" data-href-url=\"//#"+filteredFace+"\"></a>";
          }
          else if(url == "anime") {
            result += "<a href=\"#"+filteredFace+"\" class=\"addCommentface\" data-href-url=\"#"+filteredFace+"\" rel=\"nofollow\"></a>";
          }
        });

        $(this).siblings('.commentfacewrapper').children('.commentfacecontainer').html(result);

        for (var i = 0; i < classname.length; i++) {
            /*
            ** Setting up actions on Clicking the Dummy Commentfaces
            */
            classname[i].addEventListener('click', addClickEvent, false);
        }
      });
  }

  /*
  ** Setup AniList Search
  */

  var aniListSearch = document.getElementsByClassName("aniListSearch");

  for(var i = 0; i < aniListSearch.length; i++){

      aniListSearch[i].addEventListener('keyup', function(e){
        if(e.keyCode == 13) {
            var query = $( this ).val();
            searchOnAniList(query, $( this ));
            //  var d = data.data.title.romaji;
            //$( this ).siblings(".commentfacewrapper").css("display","inherit");
            //$( this ).siblings('.commentfacewrapper').children('.commentfacecontainer').html(result);
        }
      });

  }

}

function addClickEvent(e) {

  e.preventDefault();

  /*
  ** Get href from clickedCommentface to set it into the textarea
  */

  var commentcode = this.getAttribute("href");
  if(commentcode.includes("https")){
      var raute = commentcode.indexOf("#");
      commentcode = commentcode.substr(raute, commentcode.length - 1);
      this.setAttribute("href", commentcode);
  }
  var commentfacetext = this.innerHTML;
  commentfacetext = commentfacetext.replace("<strong>","**");
  commentfacetext = commentfacetext.replace("</strong>","**");
  if (this.title != "") {
    var commentfacetexthover = " '" + this.title + "'";
  }
  else {
    var commentfacetexthover = "";
  }
  var output = '['+commentfacetext+']('+commentcode+commentfacetexthover+')';

  /*
  ** Get texarea to insert to
  */

  var formfield = $(this).parents(".commentfacecontainer").parents(".commentfacewrapper").parents(".commentfaces").parents(".md").siblings(".usertext-edit").children(".md").children("textarea");

  insertOutput(output,formfield);

}

function insertOutput(output, formfield) {
  var cursorposition = formfield.prop("selectionStart");
  var formfieldcontent = formfield.val();

  if(cursorposition == "undefined") {
    formfield.val(formfield.val() + output);
  }
  else {
    if(formfieldcontent.length > 0) {

      var formfieldbefore = formfieldcontent.substr(0,cursorposition);
      var formfieldafter = formfieldcontent.substr(cursorposition,formfieldcontent.length )
      formfield.val(formfieldbefore + output + formfieldafter);

    }
    else {

      formfield.val(output);

    }
    formfield.focus();

  }
}

/*
** Anilist API
*/

/*
** Api Query Call
*/

function searchOnAniList(searchterm, targetelement) {
    var query = `
    query ($id: Int, $page: Int, $perPage: Int, $search: String) {
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media (id: $id, search: $search) {
          id
          title {
            romaji
          }
          coverImage {
            medium
          }
          type
        }
      }
    }
    `;

    var variables = {
        search: searchterm,
        page: 1,
        perPage: 12
    };

    var url = 'https://graphql.anilist.co',
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    fetch(url, options).then(handleResponse)
                       .then(handleData)
                       .catch(handleError);
                       function handleResponse(response) {
                           return response.json().then(function (json) {
                               return response.ok ? json : Promise.reject(json);
                           });
                       }

    function handleData(data) {
        var result = '<table class="browseAniListtable">';
        for(var i = 0; i < data.data.Page.media.length; i++) {
            var name = data.data.Page.media[i].title.romaji;
            var id = data.data.Page.media[i].id;
            var coverimage = data.data.Page.media[i].coverImage.medium;
            var type = data.data.Page.media[i].type;
            var mdma = '['+name+'](https://anilist.co/anime/'+id+'/)';
            result += '<tr><td><img class="anilistsearchimg" data="'+mdma+'" src="'+coverimage+'"></td>';
            result += '<td><a href="https://anilist.co/anime/'+id+'/">'+name+'</a></td><td>'+type.toLowerCase()+'</td></tr>';
          }
          result += '</table>';
          targetelement.siblings(".commentfacewrapper").css("display","inherit");
          targetelement.siblings('.commentfacewrapper').children('.commentfacecontainer').html(result);

          var anilistsearchimg = document.getElementsByClassName("anilistsearchimg");

          for(var i = 0; i < anilistsearchimg.length; i++){
              anilistsearchimg[i].addEventListener('click', function(){
                  output = $(this).attr("data");
                  var formfield = $(this).parents("td").parents("tr").parents("tbody").parents("table").parents(".commentfacecontainer").parents(".commentfacewrapper").parents(".commentfaces").parents(".md").siblings(".usertext-edit").children(".md").children("textarea");
                  insertOutput(output,formfield);
              });
          }

     }

    function handleError(error) {
        //console.error(error);
    }
}
