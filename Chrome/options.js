function saveOptions(e) {
  e.preventDefault();
  chrome.storage.local.set({
    "opcommentfaces": document.querySelector("#commentfaces").checked,
    "opanisearch": document.querySelector("#anisearch").checked,
    "opspoiler": document.querySelector("#spoiler").checked
  });
}

function restoreOptions() {

  var getting = chrome.storage.local.get("opcommentfaces",
  function(obj) {
    if(obj !== undefined) {
      document.querySelector("#commentfaces").checked = obj.opcommentfaces;
    }
    else {
      document.querySelector("#commentfaces").checked = true;
    }
  });

  var getting = chrome.storage.local.get("opanisearch",
  function(obj) {
    if(obj !== undefined) {
      document.querySelector("#anisearch").checked = obj.opanisearch;
    }
    else {
      document.querySelector("#anisearch").checked = true;
    }
  });

  var getting = chrome.storage.local.get("opspoiler",
  function(obj) {
    if(obj !== undefined) {
      document.querySelector("#spoiler").checked = obj.opspoiler;
    }
    else {
      document.querySelector("#spoiler").checked = true;
    }
  });

}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
