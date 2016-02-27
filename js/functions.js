function FormatTime() {
  var DayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var Month = ["January", "February", "March", "April", "May", "June", "July", "August",
               "September", "October", "November", "December"];
  now = new Date();
  DayToday = now.getDay();
  DateToday = now.getDate();
  MonthToday = now.getMonth();
  HourNow = now.getHours();
  MinutesNow = now.getMinutes();
  DateTime = DayOfWeek[DayToday] + ", " + Month[MonthToday] + " " + DateToday + "  " +  HourNow + ":" + MinutesNow;
  document.getElementById("DateTime").innerHTML = DateTime;
  }
