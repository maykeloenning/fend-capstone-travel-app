// import js 
import { performAction } from './js/performAction'
import { getLocation } from "./js/app";
import { dateCompare } from "./js/app";
import { updateCurrent } from "./js/app";
import { updateFuture } from "./js/app";

import './media/screen.scss'
import './styles/style.scss'

// set calendar min selection date as current day
let currentDay = new Date();
let dd = currentDay.getDate();
let mm = currentDay.getMonth() + 1;
let yyyy = currentDay.getFullYear();
if (dd < 10) {
    dd = "0" + dd;
}
if (mm < 10) {
    mm = "0" + mm;
}
currentDay = yyyy + "-" + mm + "-" + dd;
document.getElementById("depart").setAttribute("min", currentDay);
document.getElementById("return").setAttribute("min", currentDay);

window.addEventListener('DOMContentLoaded', (e) => {
    const buttonSubmit = document.getElementById('search')
    buttonSubmit.addEventListener('click', performAction)
})

// Export statements for js
export { performAction };