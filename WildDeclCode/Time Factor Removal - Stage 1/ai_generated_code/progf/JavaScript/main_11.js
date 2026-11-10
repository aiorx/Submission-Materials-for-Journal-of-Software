// !!! Note: this code was basically Produced with advanced coding toolso mini !!!

function create_calendar(year) {
  var year_element = document.getElementById('year');
  var calendar_element = document.getElementById('calendar');

  // Set the year as page header
  year_element.textContent = year;

  var months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  var day_names = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  months.forEach(function (month, index) {
    var month_element = document.createElement('div');
    month_element.className = 'month';

    var month_name = document.createElement('div');
    month_name.className = 'month_name';
    month_name.textContent = month;
    month_element.append(month_name);

    var days_element = document.createElement('div');
    days_element.className = 'days';

    // Day headers
    day_names.forEach((day) => {
      var day_header = document.createElement('div');
      day_header.className = 'day_name';

      if (day === 'Сб' || day === 'Вс') {
        day_header.classList.add('weekend');
      }

      day_header.textContent = day;
      days_element.append(day_header);
    });

    // First day of the month
    var first_day = dayjs("" + (year) + "-" + (index + 1) + "-01");
    var start_day = (first_day.day() + 6) % 7;
    var days_in_month = first_day.daysInMonth();

    // Empty cells before first day of the month
    for (var i = 0; i < start_day; i++) {
      var empty_cell = document.createElement('div');
      empty_cell.className = 'empty_cell';
      days_element.append(empty_cell);
    }

    // Fill the days of the month
    for (var day = 1; day <= days_in_month; day++) {
      var day_cell = document.createElement('div');
      day_cell.className = 'day';

      var day_of_week = (start_day + day - 1) % 7;

      if (day_of_week === 5 || day_of_week === 6) {
        day_cell.classList.add('weekend');
      }

      day_cell.textContent = day;
      days_element.append(day_cell);
    }

    month_element.append(days_element);
    calendar_element.append(month_element);
  });
}

var current_url = new URL(window.location);
var params = Object.fromEntries(current_url.searchParams.entries());

var current_year = params.year ? parseInt(params.year, 10) : dayjs().year();

create_calendar(current_year);

document.title = "Calendar - " + (current_year) + "";
