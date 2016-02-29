  var DayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var Month = ["January", "February", "March", "April", "May", "June", "July", "August",
               "September", "October", "November", "December"];
  var weather = new Array; 
function Format_Time() {
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
  Set_Forecast_Days (DayToday);
  Load_Weather()
  }

function Set_Forecast_Days (day1) {
  document.getElementById("Day1").innerHTML = "Today:";
  document.getElementById("Day2").innerHTML = "Tomorrow:";
  document.getElementById("Day3").innerHTML = DayOfWeek[(day1 + 2) % 7];
  document.getElementById("Day4").innerHTML = DayOfWeek[(day1 + 3) % 7];
  document.getElementById("Day5").innerHTML = DayOfWeek[(day1 + 4) % 7];
  }

function Load_Weather() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
	  weather = JSON.parse(xhttp.responseText);
	  Load_Current_Data();
      }
    };
  url = "http://api.openweathermap.org/data/2.5/weather?id=4276873&appid=cf89da31cbe98e4b2da1dad1458ec4be&units=imperial"
  xhttp.open("GET", url, true);
  xhttp.send();
  }

function Load_Current_Data () {
	/*  alert (weather.wind.speed); */
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
  }
  