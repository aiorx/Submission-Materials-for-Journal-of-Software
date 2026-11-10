'use strict';

var got = require('got');
var cheerio = require('cheerio');

var url = 'https://youtube.com/watch?v=';

var tag = {
	name: 'data-title',
	url: 'data-video-id',
	id: 'data-video-id'
};

var splitCurrentPlay = function str {
	return str.indexOf('watch') === -1 ? "" + (str) + "&disable_polymer=1" : "https://www.youtube.com/playlist?list=" + (str.split('&list=')[1].split('&t=')[0]) + "&disable_polymer=1";
};

var isPrivateVideo = function tr {
	var isOwnerFieldExist = Boolean(cheerio('.pl-video-owner', tr).length);
	return !isOwnerFieldExist;
};

module.exports = function (data, opt) {
	return got(splitCurrentPlay(data)).then(res => {
		var $ = cheerio.load(res.body);
		var thumb = $('tr');
		var arr = {
			name: $('.pl-header-title').text().trim(),
			playlist: []
		};

		if (!opt) {
			opt = Object.keys(tag);
		}

		var prefixUrl = (holder, marks) => holder === 'url' ? "" + (url) + "" + (marks) + "" : marks;
		var getDuration = el => {
			var raw = $(el).find('.timestamp').text().split(':');
			return (parseInt(raw[0], 10) * 60) + parseInt(raw[1], 10);
		};

		var multipleDetails = Array.isArray(opt);

		arr.playlist = thumb.map((index, el) => {
			if (multipleDetails) {
				return opt.reduce((prev, holder) => {
					prev[holder] = prefixUrl(holder, holder === 'duration' ? getDuration(el) : el.attribs[tag[holder]]);
					return prev;
				}, {
					isPrivate: isPrivateVideo(el)
				});
			}
			if (opt === 'duration') {
				return getDuration(el);
			}
			return prefixUrl(opt, el.attribs[tag[opt]]);
		}).get();

		return {
			data: arr
		};
	});
};
