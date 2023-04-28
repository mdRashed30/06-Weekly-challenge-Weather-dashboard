// API Variables 
var weatherApiKey = "6ca6949d17b13bd2f65681f0b3a013f3"; 
var baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
var baseUrl2 = "https://api.openweathermap.org/data/2.5/forecast?";
var iconBaseUrl = "https://openweathermap.org/img/w/";
var uvIndexBaseUrl = "https://api.openweathermap.org/data/2.5/onecall?";

// Dom Variables 

var searchHistoryBox = $("#past-history");
var searchForm = $("#search-form");
var currentWeatherBox = $("#current-weather");
var fiveDayForecastBox = $("#five-day-forecast");
var searchValInput = $("#search-value");

// Search History Variables

var searchHistory = [];

// Search Form Event Listener

searchForm.submit(function (e) {
  e.preventDefault();
  var formValues = $(this).serializeArray();
  var city = formValues[0].value;

  // create element tho jQuery
  var searchTermDiv = $('<button type="button" class="btn past-search-term">');
  searchTermDiv.click(function (e) {
    e.preventDefault();
    var value = $(this).text();
    searchForCurrentCityWeather(value);
    searchForFiveDayForecastWeather(value);
  });
// Add City to Search History

  searchHistory.push(city);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  searchTermDiv.text(city);
  searchHistoryBox.append(searchTermDiv);
  console.log(formValues, city);
  searchForCurrentCityWeather(city);
  searchForFiveDayForecastWeather(city);
  searchValInput.val("");
});

// Get Current Weather

function searchForCurrentCityWeather(city) {
  currentWeatherBox.html("");
  var originalUrl =
    baseUrl + "q=" + city + "&appid=" + weatherApiKey + "&units=imperial";

  console.log(originalUrl);
  fetch(originalUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var cityName = data.name;
      var temp = data.main.temp;
      var humidity = data.main.humidity;
      var weather = data.weather;
      var iconUrl = iconBaseUrl + weather[0].icon + ".png";
      var wind = data.wind;
      console.log(temp, humidity, weather, wind);
      var cityNameDiv = $('<div class="city-name">');
      var tempDiv = $('<div class="temp-name">');
      var humidityDiv = $('<div class="humidity-name">');
      var weatherImg = $('<img class="icon-name"/>');
      var windDiv = $('<div class="wind-name">');
      cityNameDiv.text(cityName);
      weatherImg.attr("src", iconUrl);
      tempDiv.text("Temp: " + temp);
      humidityDiv.text("Humidity: " + humidity + "%");
      windDiv.text("Wind Speed: " + wind.speed + "mph");

      currentWeatherBox.append(cityNameDiv);
      currentWeatherBox.append(weatherImg);
      currentWeatherBox.append(tempDiv);
      currentWeatherBox.append(humidityDiv);
      currentWeatherBox.append(windDiv);
    });
}
function searchForFiveDayForecastWeather(city) {
  fiveDayForecastBox.html("");
  var forecastUrl = baseUrl2 + "q=" + city + "&appid=" + weatherApiKey + "&units=imperial";
  fetch(forecastUrl)
    .then(function (responseNewMapWork) {
      return responseNewMapWork.json();
    })
    .then(function (data) {
      console.log("Five Day Forecast", data);
      var coords = data.city.coord;
      getUVIndex(coords.lat, coords.lon);
      // empty array to collect five days of data

      for (var i = 0; i < data.list.length; i++) {
        var isThreeOClock = data.list[i].dt_txt.search("15:00:00");
        if (isThreeOClock > -1) {
          var forecast = data.list[i];
          var temp = forecast.main.temp;
          var humidity = forecast.main.humidity;
          var weather = forecast.weather;
          var iconUrl = iconBaseUrl + weather[0].icon + ".png";
          var wind = forecast.wind;
          var day = moment(forecast.dt_txt).format("ddd, Do");
          console.log(forecast, temp, humidity, weather, wind, day);
          var rowDiv = $('<div class="col-2">');
          var dayDiv = $('<div class="day-name">');
          var tempDiv = $('<div class="temp-name">');
          var humidityDiv = $('<div class="humidity-name">');
          var weatherImg = $('<img class="icon-name" />');
          var windDiv = $('<div class="wind-name">');
          weatherImg.attr("src", iconUrl);
          dayDiv.text(day);
          tempDiv.text("Temp: " + temp);
          humidityDiv.text("Humidity: " + humidity + "%");
          windDiv.text("Wind Speed: " + wind.speed + "mph");

          // all mixed values into one container
          rowDiv.append(dayDiv);
          rowDiv.append(weatherImg);
          rowDiv.append(tempDiv);
          rowDiv.append(humidityDiv);
          rowDiv.append(windDiv);
          fiveDayForecastBox.append(rowDiv);
        }
      }
    });

  
}

function getUVIndex(lat, lon) {
  //{lat}, {lon}, {part}, and {API key}
  var finalUrl =
    uvIndexBaseUrl +
    "lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=hourly,daily&appid=" +
    weatherApiKey;
  fetch(finalUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var uvIndex = data.current.uvi;
      var uvIndexDiv = $("<div class='uv-index-div'>");
      var uvIndexSpan = $("<span class='uv-index-number'>");
      uvIndexSpan.text(uvIndex);
      uvIndexDiv.text("UV Index: ");
      uvIndexDiv.append(uvIndexSpan);
      currentWeatherBox.append(uvIndexDiv);
    });
}

function reginSearchHistory() {
  if (localStorage.getItem("searchHistory")) {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    for (var i = 0; i < searchHistory.length; i++) {
      var searchTermDiv = $(
        '<button type="button" class="btn past-search-term">'
      );
      searchTermDiv.click(function (e) {
        e.preventDefault();

        var value = $(this).text();
        console.log(value);

        searchForCurrentCityWeather(value);
        searchForFiveDayForecastWeather(value);
      });

      searchTermDiv.text(searchHistory[i]);
      searchHistoryBox.append(searchTermDiv);
    }
  }
}

reginSearchHistory();
