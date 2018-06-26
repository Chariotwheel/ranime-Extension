function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    opcommentfaces: document.querySelector("#commentfaces").checked,
    opanisearch: document.querySelector("#anisearch").checked,
    opspoiler: document.querySelector("#spoiler").checked
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {

    if(result.opcommentfaces !== undefined) {
      document.querySelector("#commentfaces").checked = result.opcommentfaces;
    } else {
      document.querySelector("#anisearch").checked = true;
    }

    if(result.opanisearch !== undefined) {
      document.querySelector("#anisearch").checked = result.opanisearch;
    } else {
      document.querySelector("#anisearch").checked = true;
    }

    if(result.opspoiler !== undefined) {
      document.querySelector("#spoiler").checked = result.opspoiler;
    } else {
      document.querySelector("#spoiler").checked = false;
    }

  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get(["opcommentfaces","opanisearch","opspoiler"]);
  getting.then(setCurrentChoice, onError);

}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
