// import js 
import { performAction } from './js/performAction'
import { getLocation } from "./js/app";
import { dateCompare } from "./js/app";
import { updateCurrent } from "./js/app";
import { updateFuture } from "./js/app";

import './media/screen.scss'
import './styles/style.scss'
   
alert("I EXIST")
console.log("CHANGE!!");

// set minimum date for current day
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1;
let yyyy = today.getFullYear();
if (dd < 10) {
    dd = "0" + dd;
}
if (mm < 10) {
    mm = "0" + mm;
}
today = yyyy + "-" + mm + "-" + dd;
document.getElementById("depart").setAttribute("min", today);
document.getElementById("return").setAttribute("min", today);

window.addEventListener('DOMContentLoaded', (e) => {
    const buttonSubmit = document.getElementById('search')
    buttonSubmit.addEventListener('click', performAction)
})

// Export statements for js
export { performAction };