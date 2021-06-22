/* Global Variables */
// Personal API Key for OpenWeatherMap API
const url = 'http://api.openweathermap.org/data/2.5/forecast?zip=';
const api_key = '&appid=9d6f05f9eba4da76e5bb5cc7ffe661bf&units=metric';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

/* Function called by event listener */
function performAction (e){
const newZip = document.getElementById('zip').value;
const feelings = document.getElementById('feelings').value;
getWeather (url, newZip, api_key)
  .then(function(data){
      console.log(data);
      //Add data to post request
      postData('/add', {date:d, temp: data.list[0].main.temp, feelings:feelings});
      updateUI();
  })
}

/* Function to GET Web API Data*/
const getWeather = async (url, zip, api_key) =>{
  const res = await fetch (url+zip+api_key)
  try{
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('error');
  }
}

/* Function to POST data */
const postData = async (url = '', data = {})=>{
  console.log(data);
  const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header        
  });

  try {
    const newData = await response.json();
    return newData;
  } catch(error) {
      console.log('Error: ', error);
  }
}

/* Function to GET Project Data */
const updateUI = async () => {
  const request = await fetch('/all');
  try {
    const resultData = await request.json();
    document.getElementById('date').innerHTML = `Date: ${resultData.date}`;
    document.getElementById('temp').innerHTML = `Temperature: ${resultData.temp.toFixed(2)}`;
    document.getElementById('content').innerHTML = `Feelings: ${resultData.feelings}`;
  } catch (error){
      console.log('Error: ', error);
  }
}