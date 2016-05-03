  var DayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var Month = ["January", "February", "March", "April", "May", "June", "July", "August",
               "September", "October", "November", "December"];
			   
  var DayToday;      var numLocations;     var locationIndex;      
  var firstHour;     var longitude;        var latitude;   
  var userInput;     var menuSymbol;       var xSymbol;
           
  var clouds = new Array;     var current = new Object;       var fromFile = new Boolean;         
  var day =  new Array;       var weather = new Object;       var locationAdded = new Boolean;    
  var high = new Array;       var cities = new Object;        var locationDeleted = new Boolean;  
  var low =  new Array;       var forecast = new Object;      var landscape = new Boolean;
  var slot = new Array;           
  var stations = new Array;

window.onorientationchange = readDeviceOrientation;

function readDeviceOrientation() {
  landscape = (Math.abs(window.orientation) === 90) ? true : false;
}

function Initial_Load() {
  readDeviceOrientation();
  menuSymbol = document.querySelector('.trigger').innerText;
  xSymbol = document.querySelector('.xTrigger').innerText;
  locationIndex = -1;
  Display_Date();
  Check_Saved_Locations();   
  Get_Location(); 
  document.getElementById("previous").disabled = (locationIndex == -1) ? true : false; 
  document.getElementById("next").disabled = (locationIndex < numLocations - 1) ? false : true; 
  }
  
function Refresh_Display() {
  Display_Date();
  if (locationIndex == -1) Get_Location(); 
    else Retrieve_Saved_Weather(); 
  }
  
function Next_Location() {
  locationIndex++;
  Display_Date();
  Retrieve_Saved_Weather();
  document.getElementById("previous").disabled = (locationIndex == -1) ? true : false; 
  document.getElementById("next").disabled = (locationIndex < numLocations - 1) ? false : true; 
  }
  
function Previous_Location() {
  locationIndex--;
  Display_Date();
  if (locationIndex == -1) Get_Location(); 
    else Retrieve_Saved_Weather(); 
  document.getElementById("previous").disabled = (locationIndex == -1) ? true : false; 
  document.getElementById("next").disabled = (locationIndex < numLocations - 1) ? false : true; 
  }
  
function Display_Date() {
  now = new Date();
  DayToday = now.getDay();
  DateToday = now.getDate();
  MonthToday = now.getMonth();
  HourNow = now.getHours();
  MinutesNow = now.getMinutes();
  AmPm = (HourNow < 12) ? "am" : "pm";
  if (HourNow > 12) HourNow = HourNow - 12;
  if (HourNow == 0) HourNow = 12;
  if (MinutesNow < 10) MinutesNow = "0" + MinutesNow;
  strDate = DayOfWeek[DayToday] + ", " + Month[MonthToday] + " " + DateToday;
  strTime = HourNow + ":" + MinutesNow + AmPm;
  document.getElementById("DateTime").innerHTML = strDate + " at " + strTime;
  }

function Check_Saved_Locations() {
  var URL = String(window.location);
  fromFile = (URL.substr(0,4) == 'file') ? true : false;
  if (fromFile) {
    stations = [ { "city": "Omaha, NE", "id": 5074472  },
                 { "city": "Boston, MA", "id": 4930956  },
                 { "city": "Boulder, CO", "id": 5574991  } ] ;
    numLocations = 3; }
  else {
    strdata = localStorage.getItem("stations");  
    if (strdata !== null) {
      stations = JSON.parse(strdata); 
	  numLocations = stations.length; 
	  }
    else {
      numLocations = 0; }
    }
  } 

function Get_Location() {
  navigator.geolocation.getCurrentPosition(Retrieve_PlaceName, Show_Error);
  }

function Show_Error(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      alert("Permission to determine location denied.");   break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information unavailable.");          break;
    case error.TIMEOUT: 
      alert("Request to get location timed out.");         break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred while determining your position.");      break;
    }
  }

function Retrieve_PlaceName (position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status >= 200 && xhttp.status < 400) {
	  current = JSON.parse(xhttp.responseText);
	  city = (current.address.placename != "") ? current.address.placename : current.address.adminName2; 
      document.getElementById("location").innerHTML = city + ", " + current.address.adminCode1; 
      }
    }
  url = "http://api.geonames.org/findNearestAddressJSON?lat=" + latitude + "&lng=" + longitude + "&radius= 1&username=ddover1";
  xhttp.open("GET", url, true);
  xhttp.send();
  Retrieve_LatLon_Weather();
  }

function Retrieve_LatLon_Weather() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status >= 200 && xhttp.status < 400) {
      weather = JSON.parse(xhttp.responseText);
	  Load_Weather_Data(weather.list[0].main.temp, weather.list[0].main.humidity,
             weather.list[0].wind.deg, weather.list[0].wind.speed, weather.list[0].clouds.all,
			 weather.list[0].rain, weather.list[0].snow);
      Retrieve_Forecast(weather.list[0].id, weather.list[0].main.temp);
      }
    }
  url = "http://api.openweathermap.org/data/2.5/find?lat=" + latitude + "&lon=" + longitude;
  url += "&cnt=1&appid=cf89da31cbe98e4b2da1dad1458ec4be&units=imperial";
  xhttp.open("GET", url, true);
  xhttp.send();
  }
 
function Retrieve_Saved_Weather() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status >= 200 && xhttp.status < 400) {
	  weather = JSON.parse(xhttp.responseText);
	  Load_Weather_Data(weather.main.temp, weather.main.humidity, weather.wind.deg,
	                   weather.wind.speed, weather.clouds.all, weather.rain, weather.snow);
      document.getElementById("location").innerHTML = stations[locationIndex].city; 
      Retrieve_Forecast(stations[locationIndex].id, weather.main.temp);
      }
    }
  url = "http://api.openweathermap.org/data/2.5/weather?id=" + stations[locationIndex].id;
  url += "&appid=cf89da31cbe98e4b2da1dad1458ec4be&units=imperial";
  xhttp.open("GET", url, true);
  xhttp.send();
  }

function Load_Weather_Data (temp, humidity, degrees, speed, clouds, rain3h, snow3h) {
  document.getElementById("temp").innerHTML = "Temp: " + parseInt(temp) + "&degF"; 
  document.getElementById("humidity").innerHTML = "Humidity: " + humidity + "%";
  if (degrees < 23) { direction = "N"; }
    else if (degrees < 68) { direction = "NE"; }
      else if (degrees < 113) { direction = "E"; }
        else if (degrees < 158) { direction = "SE"; }
          else if (degrees < 203) { direction = "S"; }
            else if (degrees < 248) { direction = "SW"; }
              else if (degrees < 293) { direction = "W"; }
                else if (degrees < 313) { direction = "NW"; }
                  else { direction = "N"; }
  document.getElementById("wind").innerHTML = "Wind: " + direction + " at " + parseInt(speed) + " mph";
  rain = (rain3h != undefined) ? true : false;			
  snow = (snow3h != undefined) ? true : false;			
  skyCondition = Determine_Sky_Cover(clouds, rain, snow, 0);
  document.getElementById("sky").innerHTML = "Sky: " + skyCondition; 
  }

function Determine_Sky_Cover(skyCover, rain, snow, precipChance) {
  if (skyCover < 5) { skyCondition = "Clear"; }
    else if (skyCover < 14) { skyCondition = "Mostly Clear"; }
      else if (skyCover < 33) { skyCondition = "Scattered Clouds"; }
        else if (skyCover < 66) { skyCondition = "Partly Cloudy"; }
          else if (skyCover < 91) { skyCondition = "Mostly Cloudy"; }
            else { skyCondition = "Overcast"; } 
  if (skyCover >= 14) {
    if (rain && snow) skyCondition += ', Rain/Snow';			
      else if (rain) skyCondition += ', Rain';			
        else if (snow) skyCondition += ', Snow';	
    if (precipChance > .8) { chance = " 90%"; }
      else if (precipChance > .7) { chance = " 60%"; }
        else if (precipChance > .5) { chance = " 50%"; }
          else if (precipChance > .25) { chance = " 30%"; }
            else if (precipChance > .1) { chance = " 20%"; }
              else {chance = ""; }
    skyCondition += chance;	}
  return skyCondition;		
  }

function Retrieve_Forecast(id, temp) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status >= 200 && xhttp.status < 400) {
	  forecast = JSON.parse(xhttp.responseText);
	  setTimeout(Examine_Forecast_Data(), 300); 
	  Create_Forecast_Table(temp); 
      }
    }
  url = "http://api.openweathermap.org/data/2.5/forecast?id=" + id +
        "&appid=cf89da31cbe98e4b2da1dad1458ec4be&units=imperial";
  xhttp.open("GET", url, true);
  xhttp.send();
  }

function Examine_Forecast_Data() {
  firstForecast = String(forecast.list[0].dt_txt);
  firstHour = firstForecast.slice(11, 13);
  if (firstHour == "00") { slot = [2,10,18,26,34,39]; }
    else if (firstHour == "03") { slot = [1,9,17,25,33,39]; }
      else if (firstHour == "06") { slot = [0,8,16,24,32,39]; }
        else if (firstHour == "09") { slot = [0,7,15,23,31,39]; }
          else if (firstHour == "12") { slot = [0,6,14,22,30,38]; }
            else if (firstHour == "15") { slot = [0,5,13,21,29,37]; }
              else if (firstHour == "18") { slot = [0,4,12,20,28,36]; }
                else if (firstHour == "21") { slot = [0,3,11,19,27,35]; }
				  else { alert ("Not Avbl"); }
  for (i = 0; i <= 5; i++) {
    slot[i] = Math.min(forecast.list.length - 1, slot[i]); }
  if (firstHour < "09") {
    day[0] = "Tomorrow:";
	day[1] = DayOfWeek[(DayToday + 2) % 7] + ":";
	day[2] = DayOfWeek[(DayToday + 3) % 7] + ":";
	day[3] = DayOfWeek[(DayToday + 4) % 7] + ":";
	day[4] = DayOfWeek[(DayToday + 5) % 7] + ":"; }
  else {
    day[0] = "Today:";
    day[1] = "Tomorrow:";
	day[2] = DayOfWeek[(DayToday + 2) % 7] + ":";
	day[3] = DayOfWeek[(DayToday + 3) % 7] + ":";
	day[4] = DayOfWeek[(DayToday + 4) % 7] + ":"; }
  }

function Create_Forecast_Table(currentTemp) {
  var y = "<tr><th></th><th>LO</th><th>HI</th><th>Sky - Precip Chance</th></tr>";
  for (i = 0; i <= 4; i++) {
    highToday = (day[0] == "Today:" && i == 0) ? parseInt(currentTemp) : -200; 
    lowToday = (day[0] == "Today:" && i == 0) ? parseInt(currentTemp) : 200;
    cloudTotal = 0;  precipTotal = 0;  num = 0;  rain = false;  snow = false;
	for (j = slot[i]; j < slot[i+1]; j++) {
	  rainFound = false;  snowFound = false;
	  if (forecast.list[j].main.temp > highToday) 
	    highToday = forecast.list[j].main.temp; 
      high[i] = parseInt(highToday);
   	  if (forecast.list[j].main.temp < lowToday) 
	    lowToday = forecast.list[j].main.temp; 
      low[i] = (firstHour > "15" && i == 0) ? "--" : parseInt(lowToday);
	  cloudTotal = cloudTotal + parseInt(forecast.list[j].clouds.all);
      if (forecast.list[j].rain != undefined) {
        if (forecast.list[j].rain["3h"] != undefined) {
		  rain = true; 
		  rainFound = true; } }
      if (forecast.list[j].snow != undefined) {
        if (forecast.list[j].snow["3h"] != undefined) {
		  snow = true; 
		  snowFound = true; } }
	  num++;
      if (rainFound || snowFound) precipTotal++;
	  }
    clouds[i] = Determine_Sky_Cover(cloudTotal/num, rain, snow, precipTotal/num);
    y = y + "<tr><td>" + day[i] + "</td><td>" + low[i] + "</td><td>" + high[i] + "</td><td>" + clouds[i] + "</td></tr>"; 
    }  
  document.getElementById("forecast").innerHTML = y;
  }

var triggerEl = document.querySelector('.trigger');

triggerEl.addEventListener('click', function(event) {
  event.preventDefault();
  Create_Menu();
  document.querySelector('.container').classList.toggle('nav-is-open');
  if (!document.querySelector('.container').classList.contains('nav-is-open')) {
    if (locationAdded) locationIndex = numLocations - 1; 
      else if (locationDeleted) locationIndex = -1;
    Refresh_Display(); 
    document.querySelector(".location").value = ""; 
    document.getElementById("citylist").innerHTML = "";  
    document.getElementById("previous").disabled = (locationIndex == -1) ? true : false; 
    document.getElementById("next").disabled = (locationIndex < numLocations - 1) ? false : true; 
    triggerEl.innerText = menuSymbol; }
  else {
    triggerEl.innerText = xSymbol;
	locationDeleted = false;
	locationAdded = false; }
  }); 

function Delete_Location(i) {
  if (confirm ("Are you sure you want to delete " + stations[i].city + " as a saved location?") == true) {
    stations.splice(i,1);
	if (!fromFile) {
      localStorage.setItem("stations", JSON.stringify(stations)); }
    if  (locationIndex > numLocations - 1) locationIndex = numLocations - 1;
    numLocations--; 
    locationDeleted = true; }
  Create_Menu(); 
  }

function Show_Locations(inputString) {
  userInput = inputString;
  userInput = userInput.toUpperCase();
  if (userInput.length < 4) {
    document.getElementById("citylist").innerHTML = ""; 
    return; }
  cityMatches = cities.stations.filter(Check_Locations);
  var y = '<li><em><strong>Select Location to Add:</strong></em></li>';; 
  y += '<li>&#20;</li>';
  for (x = 0; x < cityMatches.length; x++) {
    y += '<li><a href="#" onclick="Save_Location(' + x + ')";>' + cityMatches[x].name + ", " + cityMatches[x].state + '</a></li>'; } 
  document.getElementById("citylist").innerHTML = y; 
  }

function Check_Locations(city) {
  citySubstring = city.name.substr(0,userInput.length);
  citySubstring = citySubstring.toUpperCase();
  if (citySubstring == userInput) return true; 
    else return false;
  }
 
function Save_Location(x) {
  if (numLocations == 10) {
    alert ("You are at the maximum of 10 saved locations.");
	return; }
  stations[numLocations] = { "city": "Placeholder", "id": cityMatches[x].id };
  stations[numLocations].city = cityMatches[x].name + ', ' + cityMatches[x].state;
  if (!fromFile) {
    localStorage.setItem("stations", JSON.stringify(stations)); }
  numLocations++;
  locationAdded = true;
  document.getElementById("citylist").innerHTML = ""; 
  document.querySelector(".location").value = ""; 
  Create_Menu();
  }
 
function Create_Menu() {
  var y = '<li><em><strong>Select Location to Delete:</strong></em></li>'; 
  y += '<li>&#20;</li>';
  for (i = 0; i < numLocations; i++) {
    y += '<li><a href="#" class="delete" onclick="Delete_Location(' + i + ')";>' + stations[i].city + '</a></li>'; } 
  y += '<li>&#20;</li>';
  y += '<li><em><strong>Input a New Location:</strong></em></li>'; 
  y += '<li>&#20;</li>';
  y += '<input type="text" size="20" class="location" onkeyup="Show_Locations(this.value)">'
  y += '<li>&#20;</li>';
  document.getElementById("menu").innerHTML = y; 
  }