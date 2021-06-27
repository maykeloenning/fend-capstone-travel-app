/* Global Variables */
// URL For geonames URL
const geonameURL = "http://api.geonames.org/searchJSON?username=maykeloenning&maxRows=10&q=";

/* Function called by event listener for button search */
function performAction (e){
  e.preventDefault();
  let city = document.getElementById("city").value;
  getDestination(geonameURL, city).then(function (data) {
      dateVerify(data);
  });
  hide(document.getElementById("app"));
  show(document.getElementById("result"));
}

/* Function called by event listener for button return */
function performReturnAction (e){
  e.preventDefault();
  show(document.getElementById("app"));
  hide(document.getElementById("result"));
}

/* Hide elements in a page */
function hide (elements) {
  elements = elements.length ? elements : [elements];
  for (var index = 0; index < elements.length; index++) {
    elements[index].style.display = 'none';
  }
}

/* Show elements in a page */
function show (elements) {
  elements = elements.length ? elements : [elements];
  for (var index = 0; index < elements.length; index++) {
    elements[index].style.display = 'grid';
  }
}

/* Function to access Geonames API and get the coordinates of location */
const getDestination = async (geonameURL, dest) =>{
  const res = await fetch (geonameURL+dest)
  try{
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error returning destination');
  }
}

/* Function to POST Weather data from Weatherbit API */
const postWeather = async (url = '', data = {})=>{
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

/* Function to POST image data from Pixbay */
const postPhoto = async (url = '', data = {})=>{
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

/* Update UI for weather forecast and dest photo */
const updateUI = async (current, info, daysAwayInt) => {
  const request = await fetch("http://localhost:8000/update");
  let departDate = new Date(document.getElementById("departDate").value);
  let returnDate = new Date(document.getElementById("returnDate").value);
  if (current) {
      try {
          const data = await request.json();
          let photo = document.getElementById("photo");
          if (`${data.pixbay.picture}` === "No photo available") {
            document.getElementById("text").innerHTML = "No photo available"            
            photo.setAttribute("src", ``)
          }
          else {
            document.getElementById("text").innerHTML = "";
            photo.setAttribute("src", `${data.pixbay.picture}`);
            photo.setAttribute("width", "400");
            photo.setAttribute("height", "350");
          }
          console.log(data.futureForecast)
          document.getElementById("mainDescription").innerHTML = `My trip to ${info.name}, ${info.countryName} <br> Departing ${departDate.getDate()}/${departDate.getMonth() + 1} <br> Returning ${returnDate.getDate()}/${returnDate.getMonth() + 1}`;
          document.getElementById("tripDescription").innerHTML = `${info.name} is ${daysAwayInt} days away`;
          document.getElementById("tripWeather").innerHTML = `Typical weather for then is: <br> ${data.currentForecast.temp}°F <br> ${data.currentForecast.description} throughout the day`;
      } catch (error) {
          console.log("Error", error);
      }
  } else {
      try {
          const data = await request.json();
          let photo = document.getElementById("photo");
          if (`${data.pixbay.picture}` === "No photo available") {
            document.getElementById("text").innerHTML = "No photo available"
            photo.setAttribute("src", ``)
          }
          else {
            document.getElementById("text").innerHTML = "";
            photo.setAttribute("src", `${data.pixbay.picture}`);
            photo.setAttribute("width", "400");
            photo.setAttribute("height", "350");
          }
          console.log(data.futureForecast);
          document.getElementById("mainDescription").innerHTML = `My trip to ${info.name}, ${info.countryName} <br> Departing ${departDate.getDate()}/${departDate.getMonth() + 1} <br> Returning ${returnDate.getDate()}/${returnDate.getMonth() + 1}`;
          document.getElementById("tripDescription").innerHTML = `${info.name} is ${daysAwayInt} days away`;
          document.getElementById("tripWeather").innerHTML = `Typical weather for then is: <br> High: ${data.futureForecast.maxTemp}°F   Low: ${data.futureForecast.lowTemp}°F  <br> ${data.futureForecast.description} throughout the day`;
      } catch (error) {
          console.log("Error", error);
      }
  }
};

 /* Compare dates to get current or future weather from Weatherbit */
const dateVerify = function (data) {
  Date.prototype.sumDay = function (days) {
      this.setDate(this.getDate() + parseInt(days));
      return this;
  };

  let currentDay = new Date().getTime()
  let differenceDate = new Date().sumDay(7); // cuttoff date = 7 days
  let departDate = new Date(document.getElementById("departDate").value);
  
  console.log("difference date: "+ differenceDate)
  let differenceCalc = departDate.getTime() - differenceDate.getTime();
  let differenceDay = differenceCalc / (86400000); //differenceCalc in days, 86400000 miliseconds = day
  let daysAway = (departDate.getTime() - currentDay)/(86400000); //to send the days away to be displayed
  let daysAwayInt = parseInt(daysAway)
  //if date is in less than 7 days
  if (differenceDay <= 0) {
      postWeather("http://localhost:8000/currentForecast", { country: data.geonames[0], latitude: data.geonames[0].lat, longitude: data.geonames[0].lng }).then(() => {
          postPhoto("http://localhost:8000/photo", { city: data.geonames[0].name }).then(() => {
              let info = data.geonames[0] //geoname data to pass to the function updateUI
              updateUI(1, info, daysAwayInt);
          });
      });
  } else if (differenceDay > 0) {
      postWeather("http://localhost:8000/futureForecast", { country: data.geonames[0], latitude: data.geonames[0].lat, longitude: data.geonames[0].lng }).then(() => {
          postPhoto("http://localhost:8000/photo", { city: data.geonames[0].name }).then(() => {
              let info = data.geonames[0] //geoname data to pass to the function updateUI
              updateUI(0, info, daysAwayInt);
          });
      });
  }
};

// export functions to index.js
export { performAction, performReturnAction};