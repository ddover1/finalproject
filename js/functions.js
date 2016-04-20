  var DayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var Month = ["January", "February", "March", "April", "May", "June", "July", "August",
               "September", "October", "November", "December"];
			   
  var DayToday;            var clouds = new Array;         var current = new Object;
  var firstHour;           var day =  new Array;           var weather = new Object;      
  var latitude;            var high = new Array;           var data = new Object; 
  var longitude;           var low =  new Array;           
  var locationIndex;       var slot = new Array;       
  var numLocations;
   
function Initial_Load() {
  document.getElementById("next").disabled = true; 
  document.getElementById("previous").disabled = true;
  locationIndex = -2;
  Display_Date();
  Check_Saved_Locations();   
  Get_Location(); 
  }
  
function Refresh_Display() {
  if (locationIndex == -2) {
    document.getElementById("DateTime").innerHTML = "Location cannot be determined and no locations have been saved"; }
  else if (locationIndex == -1) {
    Display_Date();
    Get_Location(); }
  else {
    Display_Date();
    Retrieve_Saved_Weather(); }
  }
  
function Next_Location() {
  locationIndex++;
  Display_Date();
  Retrieve_Saved_Weather();
  }
  
function Previous_Location() {
  locationIndex--;
  Display_Date();
  if (locationIndex == -1) { Get_Location(); }
    else { Retrieve_Saved_Weather(); }
  }
  
function Display_Date() {
  now = new Date();
  DayToday = now.getDay();
  DateToday = now.getDate();
  MonthToday = now.getMonth();
  HourNow = now.getHours();
  MinutesNow = now.getMinutes();
  AmPm = HourNow < 12 ? "am" : "pm";
  if (HourNow > 12) HourNow = HourNow - 12;
  if (HourNow == 0) HourNow = 12;
  if (MinutesNow < 10) MinutesNow = "0" + MinutesNow;
  strDate = DayOfWeek[DayToday] + ", " + Month[MonthToday] + " " + DateToday;
  strTime = HourNow + ":" + MinutesNow + AmPm;
  document.getElementById("DateTime").innerHTML = strDate + " at " + strTime;
  }

function Check_Saved_Locations() {
var URL = String(window.location);
var subURL = URL.substr(0,4);
if (subURL == 'file') {
  testdata = {"locations": [ { "city": "Omaha, NE", "id": 5074472  },
                             { "city": "Boston, MA", "id": 4930956  },
                             { "city": "Boulder, CO", "id": 5574991  } ] } ;
  data = testdata;						 
  numLocations = 3;
   }
else {  
  strdata = localStorage.getItem("locations");  
  if (strdata !== null) {
    data = JSON.parse(strdata); 
	numLocations = data.locations.length}
  else {
    numLocations = 0; }
  }
/* localStorage.setItem("locations", JSON.stringify(data)); 
if (typeof(Storage) !== undefined) alert ("HI");
localStorage.removeItem('locations');
 */
  } 

function Get_Location() {
navigator.geolocation.getCurrentPosition(Retrieve_PlaceName, Show_Error);
  }

function Show_Error(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      alert("Permission to determine location denied.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information unavailable.");
      break;
    case error.TIMEOUT:
      alert("Request to get location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred while determining your position.");
      break;
    }
  }

function Retrieve_PlaceName (position) {
  locationIndex = -1;
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  /* latitude = 40.02;
  longitude = -105.27;   */
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status >= 200 && xhttp.status < 400) {
	  current = JSON.parse(xhttp.responseText);
	  city = current.address.placename != "" ? current.address.placename : current.address.adminName2; 
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
	  Load_Weather_Data(weather.list[0].main.temp, weather.list[0].main.humidity, weather.list[0].wind.deg,
	                   weather.list[0].wind.speed, weather.list[0].clouds.all);
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
	                   weather.wind.speed, weather.clouds.all);
      document.getElementById("location").innerHTML = data.locations[locationIndex].city; 
      Retrieve_Forecast(data.locations[locationIndex].id, weather.main.temp);
      }
    }
  url = "http://api.openweathermap.org/data/2.5/weather?id=" + data.locations[locationIndex].id;
  url += "&appid=cf89da31cbe98e4b2da1dad1458ec4be&units=imperial";
  xhttp.open("GET", url, true);
  xhttp.send();
  }

function Load_Weather_Data (temp, humidity, degrees, speed, clouds) {
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
  skyCondition = Determine_Sky_Cover(clouds);
  document.getElementById("sky").innerHTML = "Sky: " + skyCondition; 
  }

function Determine_Sky_Cover(skyCover) {
  if (skyCover < 4) { skyCondition = "Clear"; }
    else if (skyCover < 12) { skyCondition = "Mostly Clear"; }
      else if (skyCover < 33) { skyCondition = "Scattered Clouds"; }
        else if (skyCover < 66) { skyCondition = "Partly Cloudy"; }
          else if (skyCover < 93) { skyCondition = "Mostly Cloudy"; }
            else { skyCondition = "Overcast"; } 
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
    cloudTotal = 0;  num = 0;
	for (j = slot[i]; j < slot[i+1]; j++) {
	  if (forecast.list[j].main.temp > highToday) highToday = forecast.list[j].main.temp; 
      high[i] = parseInt(highToday);
   	  if (forecast.list[j].main.temp < lowToday) lowToday = forecast.list[j].main.temp; 
      low[i] = (firstHour > "15" && i == 0) ? "--" : parseInt(lowToday);
	  cloudTotal = cloudTotal + parseInt(forecast.list[j].clouds.all);
	  num++;
	  }
    clouds[i] = Determine_Sky_Cover(cloudTotal / num);
    y = y + "<tr><td>" + day[i] + "</td><td>" + low[i] + "</td><td>" + high[i] + "</td><td>" + clouds[i] + "</td></tr>"; 
    }  
  document.getElementById("forecast").innerHTML = y;
  document.getElementById("previous").disabled = locationIndex == -1 ? true : false; 
  document.getElementById("next").disabled = locationIndex < numLocations - 1 ? false : true; 
  }

var triggerEl = document.querySelector('.trigger');
var mainEl = document.querySelector('.container');

triggerEl.addEventListener('click', function(event) {
  event.preventDefault();
  Create_Menu();
  mainEl.classList.toggle('nav-is-open');
}); 

function Delete_Location(i) {
  if (confirm ("Are you sure you want to delete " + data.locations[i].city + " as a saved location?") == true) {
    data.locations.splice(i,1);
    Create_Menu(); 
    if  (locationIndex > numLocations - 1) locationIndex = numLocations - 1;
    numLocations--; }
  }

function Add_Location() {
  confirm ("Add Location?");
  }

function Create_Menu() {
  var y = "<li><em><strong>Select to Delete</strong></em></li>"; 
  y = y + "<li><em><strong>a Saved Location:</strong></em></li>"; 
  y = y + '<li>&#20;</li>';
  for (i = 0; i < data.locations.length; i++) {
    y = y + '<li><a href="#" onclick="Delete_Location(' + i + ')";>' + data.locations[i].city + '</a></li>'; } 
  y = y + '<li>&#20;</li>';
  y = y + '<li>Or</li>';
  y = y + '<li>&#20;</li>';
  y = y + '<li><a href ="#" onclick="Add_Location()";>Add a New Location</a></li>';
  document.getElementById("menu").innerHTML = y; 
  }
