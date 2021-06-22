/* Function to access Geonames API and get the coordinates of location */
const getLocation = async (baseURL, loc) =>{
  const res = await fetch (baseURL+loc)
  try{
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('error');
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

// Function to POST picture data from Pixbay
const postPicture = async (url = '', data = {})=>{
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

// Update UI for weather forecast, depending on results from dateCompare
const update = async (isCurrent) => {
  const request = await fetch("http://localhost:8000/updatePage");
  let departDate = new Date(document.getElementById("depart").value);
  let returnDate = new Date(document.getElementById("return").value);
  if (isCurrent) {
      try {
          const allData = await request.json();
          let image = document.getElementById("image");
          if (`${allData.pixbay.picture}` === "No picture available") {
            document.getElementById("message").innerHTML = "No picture available"
          }
          else {
            image.setAttribute("src", `${allData.pixbay.picture}`);
            image.setAttribute("height", "300");
            image.setAttribute("width", "375");
          }
          document.getElementById("tripDisplay").innerHTML = `Your trip from ${departDate.getMonth() + 1}/${departDate.getDate() + 1} to ${returnDate.getMonth() + 1}/${returnDate.getDate() + 1} is set!`;
          document.getElementById("weatherInput").innerHTML = `The current weather for your destination is ${allData.currentWeather.temp}°F with ${allData.currentWeather.description.toLowerCase()}`;
      } catch (error) {
          console.log("error", error);
      }
  } else {
      try {
          const allData = await request.json();
          let image = document.getElementById("image");
          if (`${allData.pixbay.picture}` === "No picture available") {
            document.getElementById("message").innerHTML = "No picture available"
          }
          else {
            image.setAttribute("src", `${allData.pixbay.picture}`);
            image.setAttribute("height", "300");
            image.setAttribute("width", "375");
          }
          document.getElementById("tripDisplay").innerHTML = `Your trip from ${departDate.getMonth() + 1}/${departDate.getDate() + 1} to ${returnDate.getMonth() + 1}/${returnDate.getDate() + 1} is set!`;
          document.getElementById("weatherInput").innerHTML = `The weather for your destination is typically between ${allData.futureWeather.HiTemp}°F and ${allData.futureWeather.LowTemp}°F`;
      } catch (error) {
          console.log("error", error);
      }
  }
};

 // Compare dates to get either current or future weather from Weatherbit
const dateCompare = function (data) {
  Date.prototype.addDays = function (days) {
      this.setDate(this.getDate() + parseInt(days));
      return this;
  };

  let userDate = new Date(document.getElementById("depart").value);
  let cutoffDate = new Date().addDays(7);
  let difference = userDate.getTime() - cutoffDate.getTime();
  let differenceByDay = difference / (1000 * 3600 * 24);
  if (differenceByDay <= 0) {
      console.log("input date is within 7 days of current date");
      postWeather("http://localhost:8000/current", { country: data.geonames[0], latitude: data.geonames[0].lat, longitude: data.geonames[0].lng }).then(() => {
          postPicture("http://localhost:8000/picture", { city: data.geonames[0].name }).then(() => {
              update(1);
          });
      });
  } else if (differenceByDay > 0) {
      console.log("input date is more than 7 days away from current date");
      postWeather("http://localhost:8000/future", { country: data.geonames[0], latitude: data.geonames[0].lat, longitude: data.geonames[0].lng }).then(() => {
          postPicture("http://localhost:8000/picture", { city: data.geonames[0].name }).then(() => {
              update(0);
          });
      });
  }
};

export { getLocation, postPicture, postWeather, update, dateCompare};