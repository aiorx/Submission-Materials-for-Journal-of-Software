four51.app.filter('onproperty', ['$451', function($451) {
	var defaults = {
		'OrderStats': 'Type',
		'Message': 'Box'
	};

	return function(input, query) {
		if (!input || input.length === 0) return;
		if (!query) return input;
		query.Property = query.Property || defaults[query.Model];
		return $451.filter(input, query);
	}
}]);

four51.app.filter('kb', function() {
	return function(value) {
		return isNaN(value) ? value : parseFloat(value) / 1024;
	}
});

four51.app.filter('r', ['$sce', 'WhiteLabel', function($sce, WhiteLabel) {
	return function(value) {
		var result = value, found = false;
		angular.forEach(WhiteLabel.replacements, function(c) {
			if (found) return;
			if (c.key == value) {
				result = $sce.trustAsHtml(c.value);
				found = true;
			}
		});
		return result;
	}
}]);

four51.app.filter('rc', ['$sce', 'WhiteLabel', function($sce, WhiteLabel) {
	return function(value) {
		var result = value, found = false;
		angular.forEach(WhiteLabel.replacements, function(c) {
			if (found) return;
			if (c.key.toLowerCase() == value.toLowerCase()) {
				result = $sce.trustAsHtml(c.value);
				found = true;
			}
		});
		return result;
	}
}]);

four51.app.filter('rl', ['$sce', 'WhiteLabel', function($sce, WhiteLabel) {
	return function(value) {
		var result = value, found = false;
		angular.forEach(WhiteLabel.replacements, function(c) {
			if (found) return;
			if (c.key.toLowerCase() == value.toLowerCase()) {
				result = $sce.trustAsHtml(c.value.toLowerCase());
				found = true;
			}
		});
		return result;
	}
}]);

four51.app.filter('noliverates', function() {
	return function(value) {
		var output = [];
		angular.forEach(value, function(v) {
			if (v.ShipperRateType != 'ActualRates')
				output.push(v);
		});
		return output;
	}
});

four51.app.filter('paginate', function() {
	return function(input, start) {
		if (typeof input != 'object' || !input) return;
		start = +start; //parse to int
		return input.slice(start);
	}
});

// Add filter to have NSG 150# Ground Ship for 150# and over

// Code below Constructed via standard GitHub programming aids
four51.app.filter('shipperFilter', function() {
  return function(shipper) {
    var results = shipper.filter(function(s) {
      return !s.Name.includes('NSG-Over 150# Ground Ship');
    });

    var freight = shipper.filter(function(s) {
      return s.Name.includes('NSG-Over 150# Ground Ship');
    });

    return results.length > 0 ? results : freight;
  }
});

// Previous code
// four51.app.filter("shipperFilter", function() {
// 	return function(shipper) {
// 		var results = [];
// 		var freight = [];

// 		angular.forEach(shipper, function(s) {
// 			if (s.Name.indexOf("NSG-Over 150# Ground Ship") != -1) {
// 				freight.push(s);
// 			} else {
// 				results.push(s);
// 			}
// 		});

// 		if (results.length > 0) {
// 			return results;
// 		} else {
// 			return freight;
// 		}
// 	};
// });