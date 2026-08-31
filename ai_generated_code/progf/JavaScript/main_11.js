// !!! Note: this code was basically Produced with advanced coding toolso mini !!!

function create_calendar(year) {
  const year_element = document.getElementById('year');
  const calendar_element = document.getElementById('calendar');

  // Set the year as page header
  year_element.textContent = year;

  const months = [
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

  const day_names = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  months.forEach((month, index) => {
    const month_element = document.createElement('div');
    month_element.className = 'month';

    const month_name = document.createElement('div');
    month_name.className = 'month_name';
    month_name.textContent = month;
    month_element.append(month_name);

    const days_element = document.createElement('div');
    days_element.className = 'days';

    // Day headers
    day_names.forEach((day) => {
      const day_header = document.createElement('div');
      day_header.className = 'day_name';

      if (day === 'Сб' || day === 'Вс') {
        day_header.classList.add('weekend');
      }

      day_header.textContent = day;
      days_element.append(day_header);
    });

    // First day of the month
    const first_day = dayjs(`${year}-${index + 1}-01`);
    const start_day = (first_day.day() + 6) % 7;
    const days_in_month = first_day.daysInMonth();

    // Empty cells before first day of the month
    for (let i = 0; i < start_day; i++) {
      const empty_cell = document.createElement('div');
      empty_cell.className = 'empty_cell';
      days_element.append(empty_cell);
    }

    // Fill the days of the month
    for (let day = 1; day <= days_in_month; day++) {
      const day_cell = document.createElement('div');
      day_cell.className = 'day';

      const day_of_week = (start_day + day - 1) % 7;

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

const current_url = new URL(window.location);
const params = Object.fromEntries(current_url.searchParams.entries());

const current_year = params.year ? parseInt(params.year, 10) : dayjs().year();

create_calendar(current_year);

document.title = `Calendar - ${current_year}`;
