/* Global Variables */
// URL For geonames URL
const geonameURL = "http://api.geonames.org/searchJSON?username=maykeloenning&maxRows=10&q=";

/* Function called by event listener for button search */
function performAction (e){
  e.preventDefault();
  let city = document.getElementById("city").value;
  getDestination(geonameURL, city).then(function (geonameData) {
      verifyDate(geonameData);
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
const updateUI = async (isRecent, daysAwayInt) => {
  const request = await fetch("http://localhost:8000/update");
  let departDate = new Date(document.getElementById("departDate").value);
  let returnDate = new Date(document.getElementById("returnDate").value);
  if (isRecent) {
      try {
          const data = await request.json();
          let photo = document.getElementById("photo");
          if (`${data.pixbay.picture}` === "No photo") {         
            photo.setAttribute("src", ``)
            photo.setAttribute("alt", "No Photo")
          }
          else {
            photo.setAttribute("src", `${data.pixbay.picture}`);
            photo.setAttribute("alt", `${data.currentForecast.city}`)
            photo.setAttribute("width", "400");
            photo.setAttribute("height", "350");
          }
          document.getElementById("mainDescription").innerHTML = `My trip to ${data.currentForecast.city}, ${data.currentForecast.countryName} <br> Departing ${departDate.getDate()}/${departDate.getMonth() + 1} <br> Returning ${returnDate.getDate()}/${returnDate.getMonth() + 1}`;
          document.getElementById("tripDescription").innerHTML = `${data.currentForecast.city } is ${daysAwayInt} days away`;
          document.getElementById("tripWeather").innerHTML = `Typical weather for then is: <br> ${data.currentForecast.temp}°F <br> ${data.currentForecast.description} throughout the day`;
      } catch (error) {
          console.log("Error", error);
      }
  } else {
      try {
          const data = await request.json();
          let photo = document.getElementById("photo");
          if (`${data.pixbay.picture}` === "No photo") {
            photo.setAttribute("src", ``)
            photo.setAttribute("alt", "No Photo")
          }
          else {
            photo.setAttribute("src", `${data.pixbay.picture}`);
            photo.setAttribute("alt", `${data.currentForecast.city}`)
            photo.setAttribute("width", "400");
            photo.setAttribute("height", "350");
          }
          document.getElementById("mainDescription").innerHTML = `My trip to ${data.futureForecast.city}, ${data.futureForecast.countryName} <br> Departing ${departDate.getDate()}/${departDate.getMonth() + 1} <br> Returning ${returnDate.getDate()}/${returnDate.getMonth() + 1}`;
          document.getElementById("tripDescription").innerHTML = `${data.futureForecast.city} is ${daysAwayInt} days away`;
          document.getElementById("tripWeather").innerHTML = `Typical weather for then is: <br> High: ${data.futureForecast.maxTemp}°F   Low: ${data.futureForecast.lowTemp}°F  <br> ${data.futureForecast.description} throughout the day`;
      } catch (error) {
          console.log("Error", error);
      }
  }
};

 /* Compare dates to get recent or future weather from Weatherbit */
const verifyDate = function (geonameData) {
  Date.prototype.sumDay = function (days) {
      let date = new Date(this.valueOf());
      date.setDate(date.getDate() + parseInt(days));
      return date;
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
    postPhoto("http://localhost:8000/photo", { cityName: geonameData.geonames[0].name }).then(() => {
      postWeather("http://localhost:8000/currentForecast", { info: geonameData.geonames[0], lat: geonameData.geonames[0].lat, lng: geonameData.geonames[0].lng }).then(() => {
        updateUI(1, daysAwayInt); //recent
      });
    });
  } else if (differenceDay > 0) {
      postPhoto("http://localhost:8000/photo", { cityName: geonameData.geonames[0].name }).then(() => {
        postWeather("http://localhost:8000/futureForecast", { info: geonameData.geonames[0], lat: geonameData.geonames[0].lat, lng: geonameData.geonames[0].lng }).then(() => {
          updateUI(0, daysAwayInt); //future
        });
      }); 
  }
};

// export functions to index.js
export { performAction, performReturnAction};