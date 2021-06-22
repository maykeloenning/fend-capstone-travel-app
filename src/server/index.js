// Setup empty JS object to act as endpoint for all routes
projectData = {};

const dotenv = require('dotenv');
dotenv.config();

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
app.get('/all', sendData);

app.get('/', function (req, res) {
  res.sendFile(path.resolve('dist/index.html'))
})

// Callback function to complete GET '/all'
function sendData (request, response) {
    response.send(projectData);
  };

// POST route used if departure date is within a week
app.post("/current", async function (req, res) {
  let data = req.body;

  const apiKey = process.env.WEATHER_BIT;
  let lat = data.latitude;
  let lon = data.longitude;

  const result = await fetch("https://api.weatherbit.io/v2.0/current?lat="+lat+"&lon="+lon+"&key="+apiKey+"&units=I")
  try {
    const response = await result.json();

    newEntry = {
      temp: response.data[0].temp,
      description: response.data[0].weather.description
    };
  projectData["currentWeather"] = newEntry;
  res.send(projectData);
  } catch (error) {
    console.log("error", error);
  }
});

// POST route used if departure date is past a week
app.post("/future", async function (req, res) {
  let data = req.body;

  const apiKey = process.env.WEATHER_BIT;
  let lat = data.latitude;
  let lon = data.longitude;

  const result = await fetch("https://api.weatherbit.io/v2.0/forecast/daily?lat="+lat+"&lon="+lon+"&key="+apiKey+"&units=I")
  try {
    const response = await result.json();
    // console.log(response);
    newEntry = {
      HiTemp: response.data[0].max_temp,
      LowTemp: response.data[0].low_temp,
  }
  projectData["futureWeather"] = newEntry;
  res.send(projectData);
  } catch (error) {
    console.log("error", error);
  }
});

// POST route to retrieve data from Pixbay
app.post("/picture", async function (req, res) {
    let data = req.body;

    const apiKey = process.env.PIXABAY_KEY;
    let city = data.city;

    const result = await fetch("https://pixabay.com/api/?key="+apiKey+"&q="+city+"&category=travel")
    try {
      const response = await result.json();
      const arr = response.hits[0];
      console.log(arr);
      if (arr === undefined || arr.length === 0) {
        newEntry = {
            picture: "No picture available",
        };
        console.log("No picture available");
        projectData["pixbay"] = newEntry;
        res.send(projectData);
      }
      else {
        newEntry = {
            picture: response.hits[0].webformatURL,
        };
        projectData["pixbay"] = newEntry;
        res.send(projectData);
      }
    } catch (error) {
    console.log("error", error);
  }
});
