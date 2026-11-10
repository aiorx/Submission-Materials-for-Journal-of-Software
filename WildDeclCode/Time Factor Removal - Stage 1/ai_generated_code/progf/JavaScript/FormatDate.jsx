//Aided using common development resources o4-mini-high - format dates to a more readable format
function formatDate(isoString) {
  if (!isoString) return ''
  var d = new Date(isoString)
  var year = d.getFullYear()
  var month = d.toLocaleString('en-US', { month: 'long' })
  var day = d.getDate()
  var hours = String(d.getHours()).padStart(2, '0')
  var minutes = String(d.getMinutes()).padStart(2, '0')
  return "" + (year) + ", " + (month) + " " + (day) + " - " + (hours) + ":" + (minutes) + ""
}