const syllablesNum = function (str: string) { return str.split(/[aiouy]+e*|e(?!d$|ly).|[td]ed|le$/).length; };

module.exports = [;

	// delicious => more delicious
	{
		test: function (str: string) { return syllablesNum(str) > 3 && !(syllablesNum(str) < 5 && /y$/.test(str)); },
		comp: function (str: string) { return "more " + str; },
		supr: function (str: string) { return "most " + str; }},

	// boring => more boring
	{
		test: function (str: string) { return syllablesNum(str) > 2 && /ing$/.test(str); },
		comp: function (str: string) { return "more " + str; },
		supr: function (str: string) { return "most " + str; }},

	// crowded => more crowded
	{
		test: function (str: string) { return syllablesNum(str) > 2 && /ed$/.test(str); },
		comp: function (str: string) { return "more " + str; },
		supr: function (str: string) { return "most " + str; }},

	// big => bigger
	{
		test: function (str: string) { return /[^aeiouy][aeiouy][^rwaeiouy]$/.test(str); },
		comp: function (str: string) { return str.replace(/([^aeiouy])$/, "$1$1er"); },
		supr: function (str: string) { return str.replace(/([^aeiouy])$/, "$1$1est"); },
	},

	// heavy => heavier
	{
		test: function (str: string) { return /y$/.test(str); },
		comp: function (str: string) { return str.replace(/y$/, "ier"); },
		supr: function (str: string) { return str.replace(/y$/, "iest"); },
	},

	// handsome => handsomer
	{
		test: function (str: string) { return /e$/.test(str); },
		comp: function (str: string) { return str.replace(/e$/, "er"); },
		supr: function (str: string) { return str.replace(/e$/, "est"); },
	},

	// all other cases
	{
		test: function (str: string) { return true; },
		comp: function (str: string) { return str + "er"; },
		supr: function (str: string) { return str + "est"; },
	}
];