  var DayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var Month = ["January", "February", "March", "April", "May", "June", "July", "August",
               "September", "October", "November", "December"];
  var weather = new Array;   var day = new Array;   var high = new Array;   
  var low = new Array;   var slot = new Array;
  var DayToday;
  
function Load_Display() {
  Display_Date();
  Retrieve_Weather();
  Retrieve_Forecast();
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

function Retrieve_Weather() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
	  weather = JSON.parse(xhttp.responseText);
	  Load_Current_Data();
      }
    };
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
	  Find_High();
  	  Find_Low();
	  Load_Forecast_Data();
      }
    };
  url = "http://api.openweathermap.org/data/2.5/forecast?id=4276873&appid=44db6a862fba0b067b1930da0d769e98&units=imperial";
  xhttp.open("GET", url, true);
  xhttp.send();
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
  if (weather.clouds.all < 4) { skyCondition = "Clear"; }
    else if (weather.clouds.all < 12) { skyCondition = "Mostly Clear"; }
      else if (weather.clouds.all < 33) { skyCondition = "Scattered Clouds"; }
        else if (weather.clouds.all < 66) { skyCondition = "Partly Cloudy"; }
          else if (weather.clouds.all < 93) { skyCondition = "Mostly Cloudy"; }
            else { skyCondition = "Overcast"; } 
  document.getElementById("sky").innerHTML = "Sky: " + skyCondition; 
/*  alert (weather.name); */
  }

function Examine_Forecast_Data() {
  firstForecast = String(forecast.list[0].dt_txt);
  firstHour = firstForecast.slice(11, 13);
  if (firstHour == "00") { slot = [2,10,18,26,34,39]; }
    else if (firstHour == "03") { slot = [1,9,17,25,33,39]; }
      else if (firstHour == "06") { slot = [0,8,16,24,32,39]; }
        else if (firstHour == "09") { slot = [0,7,15,23,31,38]; }
          else if (firstHour == "12") { slot = [0,6,14,22,30,37]; }
            else if (firstHour == "15") { slot = [0,5,13,21,29,37]; }
              else if (firstHour == "18") { slot = [0,4,13,21,29,37]; }
                else if (firstHour == "21") { slot = [0,3,13,21,29,37]; }
				  else { }
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

function Find_High() {
  for (i = 0; i <= 4; i++) {
    highToday = (day[0] == "Today:" && i == 0) ? parseInt(weather.main.temp) : -200;
    for (j = slot[i]; j < slot[i+1]; j++) {
	  if (forecast.list[j].main.temp > highToday) {
	    highToday = forecast.list[j].main.temp;
		}
	  high[i] = parseInt(highToday);
	  }
    }  
  }

function Find_Low() {
  for (i = 0; i <= 4; i++) {
    lowToday = (day[0] == "Today:" && i == 0) ? parseInt(weather.main.temp) : 200;
    for (j = slot[i]; j < slot[i+1]; j++) {
	  if (forecast.list[j].main.temp < lowToday) {
	    lowToday = forecast.list[j].main.temp; }
	  low[i] = parseInt(lowToday);
	  }
    }  
  }

  function Load_Forecast_Data () {
  document.getElementById("Day1").innerHTML = day[0];
  document.getElementById("Day2").innerHTML = day[1];
  document.getElementById("Day3").innerHTML = day[2];
  document.getElementById("Day4").innerHTML = day[3];
  document.getElementById("Day5").innerHTML = day[4];
  document.getElementById("High1").innerHTML = high[0] + "&deg"; 
  document.getElementById("High2").innerHTML = high[1] + "&deg"; 
  document.getElementById("High3").innerHTML = high[2] + "&deg"; 
  document.getElementById("High4").innerHTML = high[3] + "&deg"; 
  document.getElementById("High5").innerHTML = high[4] + "&deg"; 
  document.getElementById("Low1").innerHTML = low[0] + "&deg"; 
  document.getElementById("Low2").innerHTML = low[1] + "&deg"; 
  document.getElementById("Low3").innerHTML = low[2] + "&deg"; 
  document.getElementById("Low4").innerHTML = low[3] + "&deg"; 
  document.getElementById("Low5").innerHTML = low[4] + "&deg"; 
  }
  