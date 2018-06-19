var menu = '<div style="" class="md"><form action="" id="commentfaces">';
menu += '<input type="text" placeholder="search commentfaces"><br /><div style="height:100px;overflow-hidden;">';
menu += '<div style="width:100%;height:100%;overflow-y:scroll;padding-right:17px;box-sizing:content-box;">';
menu += '<a href="#firstthinginthemorning" data="firstthinginthemorning" class="addCommentface" rel="nofollow"></a>';
menu += '</div></div></form></div>';

$( ".usertext-edit" ).prepend( menu );

var classname = document.getElementsByClassName("addCommentface");

for (var i = 0; i < classname.length; i++) {
    var data = classname[i].getAttribute('data');
    classname[i].addEventListener('click', addCommentface(data), false);
}

function addCommentface(data) {
  var commentcode = 'firstthinginthemorning';
  var output = '[](#'+commentcode+')';
  console.log("test");
  $("textarea").val($('textarea').val()+output);
}
