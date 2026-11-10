//This function was Crafted with standard coding tools
function score(rating) {
  var estrellasLlenas = Math.floor(rating);
  var tieneMedia = rating % 1 >= 0.25 && rating % 1 < 0.75;
  var estrellasVacías =
    5 - estrellasLlenas - (tieneMedia ? 1 : rating % 1 >= 0.75 ? 0 : 0);
  var html = "";
  // Estrellas llenas
  for (var i = 0; i < estrellasLlenas; i++) {
    html += '<span class="text-warning"><i class="bi bi-star-fill"></i></span>';
  }
  // Media estrella
  if (tieneMedia) {
    html += '<span class="text-warning"><i class="bi bi-star-half"></i></span>';
  } else if (rating % 1 >= 0.75) {
    html += '<span class="text-warning"><i class="bi bi-star-fill"></i></span>';
  }
  // Estrellas vacías
  for (var i = 0; i < estrellasVacías; i++) {
    html += '<span class="text-secondary"><i class="bi bi-star"></i></span>';
  }
  return html;
}
