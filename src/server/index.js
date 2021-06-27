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

// Callback function to complete GET '/all'
function sendData (request, response) {
    response.send(projectData);
  };

// POST path used if departure date is within a week
app.post("/currentForecast", async function (req, res) {
  let data = req.body;

  const apiWeatherBit = process.env.WEATHER_BIT;
  let latitude = data.latitude;
  let longitude = data.longitude;

  const result = await fetch("https://api.weatherbit.io/v2.0/current?lat="+latitude+"&lon="+longitude+"&key="+apiWeatherBit+"&units=I")
  try {
    const response = await result.json();
    newWeather = {
      temp: response.data[0].temp,
      description: response.data[0].weather.description
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
  let latitude = data.latitude;
  let longitude = data.longitude;

  const result = await fetch("https://api.weatherbit.io/v2.0/forecast/daily?lat="+latitude+"&lon="+longitude+"&key="+apiWeatherBit+"&units=I")
  try {
    const response = await result.json();
    newWeather = {
      maxTemp: response.data[0].max_temp,
      lowTemp: response.data[0].low_temp,
      description: response.data[0].weather.description
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
    let city = data.city;

    const result = await fetch("https://pixabay.com/api/?key="+apiPixabay+"&q="+city+"&category=travel")
    try {
      const response = await result.json();
      const hits = response.hits[0];
      if (hits.length === 0 || hits === undefined ) {
        newPhoto = {
            picture: "No photo available",
        };
        projectData["pixbay"] = newPhoto;
        res.send(projectData);
      }
      else {
        newPhoto = {
            picture: response.hits[0].webformatURL,
        };
        projectData["pixbay"] = newPhoto;
        res.send(projectData);
      }
    } catch (error) {
        console.log("Error", error);
  }
});

module.exports = server; 