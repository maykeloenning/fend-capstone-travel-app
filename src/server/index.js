// Setup empty JS object to act as endpoint for all routes
let projectData = {};

const dotenv = require('dotenv');
dotenv.config();

const fetch = require("node-fetch");

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser')

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
const { response } = require('express');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
const port = 8000;

// Spin up the server
const server = app.listen(port, listening);

// Callback to debug
function listening(){
    console.log(`Running on localhost: ${port}`);
  };

// Initialize all route with a callback function
app.get('/update', sendData);

app.get('/', function (req, res) {
  res.sendFile(path.resolve('dist/index.html'))
})

// Callback function to complete GET '/'
function sendData (request, response) {
    response.send(projectData);
  };

// POST path used if departure date is within a week
app.post("/currentForecast", async function (req, res) {
  let data = req.body;

  const apiWeatherBit = process.env.WEATHER_BIT;
  let lat = data.lat; //latitude
  let lng = data.lng; //longitude
  let info = data.info;

  const result = await fetch("https://api.weatherbit.io/v2.0/current?lat="+lat+"&lon="+lng+"&key="+apiWeatherBit+"&units=I")
  try {
    const responseData = await result.json();
    newWeather = {
      temp: responseData.data[0].temp,
      description: responseData.data[0].weather.description,
      city: info.name,
      countryName: info.countryName
    };
    projectData["currentForecast"] = newWeather;
    res.send(projectData);
  } catch (error) {
      console.log("Error", error);
  }
});

// POST path used if departure date is past a week
app.post("/futureForecast", async function (req, res) {
  let data = req.body;
  const apiWeatherBit = process.env.WEATHER_BIT;
  let lat = data.lat; //latitude
  let lng = data.lng; //longitude
  let info = data.info;

  const result = await fetch("https://api.weatherbit.io/v2.0/forecast/daily?lat="+lat+"&lon="+lng+"&key="+apiWeatherBit+"&units=I")
  try {
    const responseData = await result.json();
    newWeather = {
      maxTemp: responseData.data[0].max_temp,
      lowTemp: responseData.data[0].low_temp,
      description: responseData.data[0].weather.description,
      city: info.name,
      countryName: info.countryName
  }
  projectData["futureForecast"] = newWeather;
  res.send(projectData);
  } catch (error) {
    console.log("Error", error);
  }
});

// POST route to retrieve data from Pixbay
app.post("/photo", async function (req, res) {
    let data = req.body;
    const apiPixabay = process.env.PIXABAY_KEY;
    let cityName = data.cityName;

    const result = await fetch("https://pixabay.com/api/?key="+apiPixabay+"&q="+cityName+"&category=travel")
    try {
      const responseData = await result.json();
      const hits = responseData.hits[0];
      console.log(hits);
      if (hits === undefined ) {
        newPhoto = {
            picture: "No photo",
        };
        projectData["pixbay"] = newPhoto;
        res.send(projectData);
      }
      else if (hits.length !== 0){
        newPhoto = {
            picture: responseData.hits[0].webformatURL,
        };
        projectData["pixbay"] = newPhoto;
        res.send(projectData);
      }
    } catch (error) {
        console.log("Error", error);
  }
});

module.exports = app; 