
  var user = window.location.href;
  user = user.replace("https://anilist.co/user/","");
  user = user.replace("/","");

  var apiurl = 'https://shit-taste.net/api/user/?user='+user;

  var request = new XMLHttpRequest();
  request.open("POST", apiurl);
  request.setRequestHeader("Content-Type", "application/json");
  request.overrideMimeType("text/plain");
  request.onload = function()
  {
      var options = JSON.parse(request.responseText);
      console.log("Response received: " + options[0]);
      $(".page-content .avatar").css("max-width","230px");
      $(".name").css("color","red");
  };
  request.send();
