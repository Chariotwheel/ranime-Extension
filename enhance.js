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

// Get Stored options

function onError(error) {
  console.log(`Error: ${error}`);
}

function onGot(result) {

  if(result.opcommentfaces !== undefined) {
    cf = result.opcommentfaces;
  }
  else {
    cf = true;
  }

  if(result.opanisearch !== undefined) {
    as = result.opanisearch;
  }
  else {
    as = true;
  }

  if(result.opspoiler !== undefined) {
    sp = result.opspoiler;
  }
  else {
    sp = false;
  }


  createMenu(cf,as,sp);
}

var getting = browser.storage.local.get(["opcommentfaces","opanisearch","opspoiler"]);
getting.then(onGot, onError);

// Create Menu

var menu = "";

function createMenu(cf,as,sp) {
  menu += '<div class="md ranimeenhanced"><form action="" class="commentfaces">';
  if(cf) {
    menu += '<a class="showrecentcommentfaces">🕐</a>';
    //menu += '<a class="showrecentfavouritefaces">♥</a>';
    menu += '<a class="showallcommentfaces">Browse Faces</a>';
    menu += '<input type="text" class="commentfacesearch" placeholder="search commentfaces">';
    menu += '<input type="text" class="commentfacetext texttop" placeholder="Toptext">';
    menu += '<input type="text" class="commentfacetext textbottom" placeholder="Bottomtext">';
    menu += '<input type="text" class="commentfacetext texthover" placeholder="Hovertext">';
  }
  if(as) {
    menu += '<br /><input type="text" class="aniListSearch anilist" placeholder="Search Media">';
    menu += '<input type="text" class="aniListSearchCharacters anilist" placeholder="Search Characters">';
    menu += '<input type="text" class="aniListSearchStaff anilist" placeholder="Search Staff">';
    menu += '<input type="text" class="aniListSearchStudios anilist" placeholder="Search Studios">';
  }
  if(sp) {
    menu += '<br/><a class="addSpoiler">Spoiler</a>';
  }
  menu += '<div class="commentfacewrapper">';
  menu += '<div class="commentfacecontainer"></div></div></form></div>';
}
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
    var marked = window.getSelection().toString();
    form.children(".usertext-edit").children(".md").children("textarea").val(marked);

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

      //if(this.value.length > 1) {

        var result = "";
        let filteredFaces = commentfaces.filter(x => x.toLowerCase().includes(this.value));
        $(this).siblings(".commentfacewrapper").css("display","inherit");

        var texttop = $(this).siblings(".texttop:first").val();
        var textbottom = $(this).siblings(".textbottom:first").val();
        var texthover = $(this).siblings(".texthover:first").val();

        filteredFaces.forEach(function(filteredFace) {
              result += generateCommentfaces(filteredFace,texttop, textbottom, texthover);
        });

        $(this).siblings('.commentfacewrapper').children('.commentfacecontainer').html(result);

        for (var i = 0; i < classname.length; i++) {
            /*
            ** Setting up actions on Clicking the Dummy Commentfaces
            */

            classname[i].addEventListener('click', addClickEvent, false);
        }
      //}

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
        $(this).siblings(".commentfacewrapper").css("display","inherit");

        var texttop = $(this).siblings(".texttop:first").val();
        var textbottom = $(this).siblings(".textbottom:first").val();
        var texthover = $(this).siblings(".texthover:first").val();

        commentfaces.forEach(function(filteredFace) {
          /*
          ** Distinction between subs necessary since the css build differs
          */
          result += generateCommentfaces(filteredFace,texttop, textbottom, texthover);

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

  function generateCommentfaces(filteredFace, texttop, textbottom, texthover) {
    var inner = texttop;
    if(typeof textbottom !== 'undefined'){
      inner += "<strong>"+textbottom+"</strong>";
    }
    if(url == "manga") {
      return "<a href=\"//#"+filteredFace+"\" class=\"addCommentface\" title=\""+texthover+"\" data-href-url=\"//#"+filteredFace+"\">"+inner+"</a>";
    }
    else if(url == "anime") {
      return "<a href=\"#"+filteredFace+"\" class=\"addCommentface\" title=\""+texthover+"\" data-href-url=\"#"+filteredFace+"\" rel=\"nofollow\">"+inner+"</a>";
    }
  }

  /*
  ** Shows the ten recently used Commentfaces
  */

  var showrecentcommentfaces = document.getElementsByClassName("showrecentcommentfaces");

  for(var i = 0; i < showrecentcommentfaces.length; i++){
      showrecentcommentfaces[i].addEventListener('click', function(){
          var result = "";
          $(this).siblings(".commentfacewrapper").css("display","inherit");

          var texttop = $(this).siblings(".texttop:first").val();
          var textbottom = $(this).siblings(".textbottom:first").val();
          var texthover = $(this).siblings(".texthover:first").val();

          var storageItemList = localStorage.getItem('recent');
          if(storageItemList !== null) {
            storageItemList = storageItemList.replace("#","");
            storageItemList = storageItemList.split(",");
            storageItemList = storageItemList.reverse();

            storageItemList.forEach(function(itemList) {
                result += generateCommentfaces(itemList,texttop, textbottom, texthover);
            });
          }

          if(result == ""){
            result = "<br />No Commentfaces used recently.";
          }
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
            searchOnAniList(query, $( this ), "anime");
        }
      });

  }

  var aniListSearchStaff = document.getElementsByClassName("aniListSearchStaff");

  for(var i = 0; i < aniListSearchStaff.length; i++){

      aniListSearchStaff[i].addEventListener('keyup', function(e){
        if(e.keyCode == 13) {
            var query = $( this ).val();
            searchOnAniList(query, $( this ), "staff");
        }
      });

  }

  var aniListSearchStudios = document.getElementsByClassName("aniListSearchStudios");

  for(var i = 0; i < aniListSearchStudios.length; i++){

      aniListSearchStudios[i].addEventListener('keyup', function(e){
        if(e.keyCode == 13) {
            var query = $( this ).val();
            searchOnAniList(query, $( this ), "studios");
        }
      });

  }

  var aniListSearchCharacters = document.getElementsByClassName("aniListSearchCharacters");

  for(var i = 0; i < aniListSearchCharacters.length; i++){

      aniListSearchCharacters[i].addEventListener('keyup', function(e){
        if(e.keyCode == 13) {
            var query = $( this ).val();
            searchOnAniList(query, $( this ), "characters");
        }
      });

  }

  /*
  ** Text functions
  */

  var addSpoiler = document.getElementsByClassName("addSpoiler");

  for(var i = 0; i < addSpoiler.length; i++){
    addSpoiler[i].addEventListener('mousedown', function(e){
        e.preventDefault();
        //var marked = window.getSelection().toString();
        //if(marked == "") {
        var txtarea = $(this).parents(".commentfaces").parents(".md").siblings(".usertext-edit").children(".md").children("textarea");
        var start = txtarea[0].selectionStart;
        var finish = txtarea[0].selectionEnd;
        var sel = txtarea[0].value.substring(start, finish);
        //}

        if(sel !== "")
          var output = '[](/s "' + sel + '")';
        else
         var output = '[](/s "")';

        var formfieldbefore = txtarea.val().substr(0,start);
        var formfieldafter = txtarea.val().substr(finish,txtarea.val().length)
        txtarea.val(formfieldbefore + output + formfieldafter);

        txtarea.focus();
    });
  }
}

/*
** Save Faces to show most recent ones
*/

function saveRecentFaces(store){
  var storageItemList = localStorage.getItem('recent');
  if(storageItemList !== null) {
    if(storageItemList.includes(store)) {
      storageItemList = storageItemList.replace(store, "");
      storageItemList = storageItemList.replace(",,", ",");
      if(storageItemList[0] == ","){
        storageItemList = storageItemList.substr(1);
      }
    }
    if(storageItemList.match(/#/g).length > 9){
      storageItemList = storageItemList.replace(/#(.*?),/, "");
    }
    localStorage.setItem('recent', storageItemList + "," + store);

  }
  else {
    localStorage.setItem('recent', store);
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
  saveRecentFaces(commentcode);
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
  output = output.replace("****","");

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

var topic;

function searchOnAniList(searchterm, targetelement, field) {
  topic = field;
  if (topic == "anime") {
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
          format
        }
      }
    }
    `;
  }
  else if(topic == "staff") {
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
        staff (id: $id, search: $search) {
          id
          name {
            first
            last
          }
          image {
            medium
          }
        }
      }
    }
    `;
  }
  else if(topic == "studios") {
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
        studios (id: $id, search: $search) {
          id
          name
        }
      }
    }
    `;
  }
  else if(topic == "characters") {
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
        characters (id: $id, search: $search) {
          id
          name {
            first
            last
          }
          image {
            medium
          }
        }
      }
    }
    `;
  }
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
        var result = '<table class="browseAniListtable">'; var sorttable = [];
        if(topic == "anime") {
          for(var i = 0; i < data.data.Page.media.length; i++) {
              var name = data.data.Page.media[i].title.romaji;
              var id = data.data.Page.media[i].id;
              var coverimage = data.data.Page.media[i].coverImage.medium;
              var type = data.data.Page.media[i].type;
              var format = data.data.Page.media[i].format;
              var mdma = '['+name+'](https://anilist.co/'+type.toLowerCase()+'/'+id+'/)';
              sorttable.push([name,id,coverimage,type,format,mdma]);

            }
            sorttable = sorttable.sort(
              function(a, b) {
                 return b[4] > a[4];
            })
          for(var i=0; i < sorttable.length;i++) {
            result += '<tr><td><img class="anilistsearchimg" data="'+sorttable[i][5]+'" src="'+sorttable[i][2]+'"></td>';
            result += '<td><a href="https://anilist.co/'+sorttable[i][3].toLowerCase()+'/'+sorttable[i][1]+'/" target="_blank">'+sorttable[i][0]+'</a></td><td>'+sorttable[i][4].replace("_"," ").toLowerCase()+'</td></tr>';
          }
        }
        else if(topic == "staff") {
          for(var i = 0; i < data.data.Page.staff.length; i++) {
              var firstname = data.data.Page.staff[i].name.first;
              var lastname = data.data.Page.staff[i].name.last;
              var id = data.data.Page.staff[i].id;
              var image = data.data.Page.staff[i].image.medium;
              var mdma = '['+firstname+' '+lastname+'](https://anilist.co/staff/'+id+'/)';
              sorttable.push([firstname,lastname,image,mdma,id]);
            }
          for(var i=0; i < sorttable.length;i++) {
            result += '<tr><td><img class="anilistsearchimg" data="'+sorttable[i][3]+'" src="'+sorttable[i][2]+'"></td>';
            result += '<td><a href="https://anilist.co/staff/'+sorttable[i][4]+'/" target="_blank">'+sorttable[i][0]+' '+sorttable[i][1]+'</a></td></tr>';
          }
        }
        else if(topic == "studios"){
          for(var i = 0; i < data.data.Page.studios.length; i++) {
              var id = data.data.Page.studios[i].id;
              var name = data.data.Page.studios[i].name;
              var mdma = '['+name+'](https://anilist.co/studio/'+id+'/)';
              sorttable.push([name,mdma,id]);
            }
          for(var i=0; i < sorttable.length;i++) {
            result += '<tr><td><span class="anilistsearchimg" data="'+sorttable[i][1]+'">Add to Comment</span></td>';
            result += '<td><a href="https://anilist.co/studio/'+sorttable[i][2]+'/" target="_blank">'+sorttable[i][0]+'</a></td></tr>';
          }
        }
        else if(topic == "characters"){
          for(var i = 0; i < data.data.Page.characters.length; i++) {
              var id = data.data.Page.characters[i].id;
              var firstname = data.data.Page.characters[i].name.first;
              var lastname = data.data.Page.characters[i].name.last;
              if(firstname == null) {
                firstname = "";
              }
              if(lastname == null) {
                lastname = "";
              }
              var image = data.data.Page.characters[i].image.medium;
              var mdma = '['+firstname+' '+lastname+'](https://anilist.co/character/'+id+'/)';
              sorttable.push([id,firstname,lastname,image,mdma]);
            }
          for(var i=0; i < sorttable.length;i++) {
            result += '<tr><td><img class="anilistsearchimg" data="'+sorttable[i][4]+'" src="'+sorttable[i][3]+'"></td>';
            result += '<td><a href="https://anilist.co/studio/'+sorttable[i][0]+'/" target="_blank">'+sorttable[i][1]+' '+sorttable[i][2]+'</a></td></tr>';
          }
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
