import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const API_URL = "https://api.openweathermap.org/data/2.5";
const API_Key = "";
const units = "metric";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//home page

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

//show data by coordinates

app.post("/coordinates", async (req, res) => {
  try {
    const result = await axios.get(
      API_URL +
        `/weather?lat=${req.body.lat}&lon=${req.body.lon}&appid=${API_Key}&units=${units}`
    );
    console.log(result);

    res.render("index.ejs", {
      result: result,
      sunriseTime: showLocalTime(result.data.sys.sunrise),
      sunsetTime: showLocalTime(result.data.sys.sunset),
    });
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs", { error: "Coordinates not found. Try again." });
  }
});

//show data by city name

app.post("/city-name", async (req, res) => {
  try {
    const result = await axios.get(
      API_URL + `/weather?q=${req.body.city}&appid=${API_Key}&units=${units}`
    );
    console.log(result);

    res.render("index.ejs", {
      result: result,
      sunriseTime: showLocalTime(result.data.sys.sunrise),
      sunsetTime: showLocalTime(result.data.sys.sunset),
    });
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs", { error: "City not found. Try again." });
  }
});

//show data by zip code

app.post("/zip-code", async (req, res) => {
  try {
    const result = await axios.get(
      API_URL +
        `/weather?zip=${req.body.zipCode},${req.body.countryCode}&appid=${API_Key}&units=${units}`
    );
    console.log(result);

    res.render("index.ejs", {
      result: result,
      sunriseTime: showLocalTime(result.data.sys.sunrise),
      sunsetTime: showLocalTime(result.data.sys.sunset),
    });
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs", {
      error: "Zip code or country code not found. Try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function showLocalTime(timeUnix) {
  return new Date(timeUnix * 1000).toLocaleString([], {
    timeStyle: "short",
  });
}
