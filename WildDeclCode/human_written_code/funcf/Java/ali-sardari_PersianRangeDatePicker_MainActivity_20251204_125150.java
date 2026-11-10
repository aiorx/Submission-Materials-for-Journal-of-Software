```java
private void ShowDatePicker() {
    DatePickerDialog datePickerDialog = new DatePickerDialog(MainActivity.this);
    datePickerDialog.setSelectionMode(DateRangeCalendarView.SelectionMode.Range);
//        datePickerDialog.setEnableTimePicker(true);
//        datePickerDialog.setShowGregorianDate(true);
    datePickerDialog.setTextSizeTitle(10.0f);
    datePickerDialog.setTextSizeWeek(12.0f);
    datePickerDialog.setTextSizeDate(14.0f);
    datePickerDialog.setCanceledOnTouchOutside(true);
    datePickerDialog.setOnRangeDateSelectedListener(new DatePickerDialog.OnRangeDateSelectedListener() {
        @Override
        public void onRangeDateSelected(PersianCalendar startDate, PersianCalendar endDate) {
            txtStartDate.setText(startDate.getPersianShortDateTime());
            txtEndDate.setText(endDate.getPersianShortDateTime());
        }
    });
//        datePickerDialog.setAcceptButtonColor(ContextCompat.getColor(MainActivity.this, R.color.colorAccent));
    datePickerDialog.showDialog();
}
```