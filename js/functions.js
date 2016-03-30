  var DayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var Month = ["January", "February", "March", "April", "May", "June", "July", "August",
               "September", "October", "November", "December"];
  var weather = new Array;
  var clouds = new Array;         var DayToday;   
  var day =  new Array;           var firstHour;
  var high = new Array;           
  var low =  new Array;   
  var slot = new Array;
  
function Load_Display() {
 /* Check_Saved_Locations(); */
  getLocation(); 
  Display_Date();
  Retrieve_Weather();
  Retrieve_Forecast();
  }
  
function onSuccess (position) {
  var latitude = position.coords.latitude;
  alert(latitude);
}
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}
function onError () {
  alert("error");
} 
function getLocation() {
alert("HI");
navigator.geolocation.getCurrentPosition(onSuccess, showError);

  }

function Check_Saved_Locations() {
  if (typeof(Storage) == "undefined") {
    document.getElementById("temp").innerHTML = "No Local Storage"; }
  else {
    localStorage.setItem("location", "Overland Park, KS"); 
    localStorage.setItem("cityID1", "4276873"); }
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
  document.getElementById("location").innerHTML = "Overland Park, KS"; 
/*  document.getElementById("location").innerHTML = localStorage.getItem("location");  */
  }

function Retrieve_Weather() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
	  weather = JSON.parse(xhttp.responseText);
	  Load_Current_Data();
      }
    }
  url = "http://api.openweathermap.org/data/2.5/weather?id=4276873&appid=cf89da31cbe98e4b2da1dad1458ec4be&units=imperial";
  xhttp.open("GET", url, true);
  xhttp.send();
  }

function Retrieve_Forecast() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
	  forecast = JSON.parse(xhttp.responseText);
	  Examine_Forecast_Data();
	  Create_Forecast_Table(); 
      }
    }
  url = "http://api.openweathermap.org/data/2.5/forecast?id=4276873&appid=cf89da31cbe98e4b2da1dad1458ec4be&units=imperial";
  xhttp.open("GET", url, true);
  xhttp.send();
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

function Load_Current_Data () {
  document.getElementById("temp").innerHTML = "Temp: " + parseInt(weather.main.temp) + "&degF"; 
  document.getElementById("humidity").innerHTML = "Humidity: " + weather.main.humidity + "%";
  if (weather.wind.deg < 23) { direction = "N"; }
    else if (weather.wind.deg < 68) { direction = "NE"; }
      else if (weather.wind.deg < 113) { direction = "E"; }
        else if (weather.wind.deg < 158) { direction = "SE"; }
          else if (weather.wind.deg < 203) { direction = "S"; }
            else if (weather.wind.deg < 248) { direction = "SW"; }
              else if (weather.wind.deg < 293) { direction = "W"; }
                else if (weather.wind.deg < 313) { direction = "NW"; }
                  else { direction = "N"; }
  document.getElementById("wind").innerHTML = "Wind: " + direction + " at " + parseInt(weather.wind.speed) + " mph";
  skyCondition = Determine_Sky_Cover(weather.clouds.all);
  document.getElementById("sky").innerHTML = "Sky: " + skyCondition; 
/*  alert (weather.name); */
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

function Create_Forecast_Table() {
  var y = "<tr><th></th><th>LO</th><th>HI</th><th>Sky - Precip Chance</th></tr>"
  for (i = 0; i <= 4; i++) {
    highToday = (day[0] == "Today:" && i == 0) ? parseInt(weather.main.temp) : -200; 
    lowToday = (day[0] == "Today:" && i == 0) ? parseInt(weather.main.temp) : 200;
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
  }
