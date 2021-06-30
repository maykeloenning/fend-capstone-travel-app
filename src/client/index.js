// import js 
import { performAction, performReturnAction } from './js/app'

//import stylesheets
import './media/screen.scss'
import './styles/style.scss'

// set calendar min selection date as current day
function calendarMin(){
    let currentDay = new Date();
    let day = currentDay.getDate();
    let month = currentDay.getMonth() + 1;
    let year = currentDay.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    currentDay = year + "-" + month + "-" + day;
    return currentDay
}

document.getElementById("departDate").setAttribute("min", calendarMin());
document.getElementById("returnDate").setAttribute("min", calendarMin());

// Event listener for button Search
window.addEventListener('DOMContentLoaded', (e) => {
    const buttonSubmit = document.getElementById('search')
    buttonSubmit.addEventListener('click', performAction)
})

// Event listener for button Return
window.addEventListener('DOMContentLoaded', (e) => {
    const buttonSubmit = document.getElementById('return')
    buttonSubmit.addEventListener('click', performReturnAction)
})

// Export statements for js
export { performAction, performReturnAction};