import { getLocation } from "./app";
import { dateCompare } from "./app";
import { updateCurrent } from "./app";
import { updateFuture } from "./app";

/* Global Variables */
// URL For geonames URL
//var moment = require("moment");
let baseURL = "http://api.geonames.org/searchJSON?username=maykeloenning&maxRows=10&q=";

// Event listener to add function to existing HTML DOM element
//document.getElementById('search').addEventListener('click', performAction);

/* Function called by event listener */
function performAction (e){
  e.preventDefault();
  let dest = document.getElementById("dest").value;
  getLocation(baseURL, dest).then(function (data) {
      dateCompare(data);
  });
}

// Export performAction function for webpack entry
export { performAction };