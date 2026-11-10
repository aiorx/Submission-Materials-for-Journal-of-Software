const request = require("request");
const router = require("express").Router();
const youtubeDl = require("youtube-dl");
const tiktokScraper = require("tiktok-scraper");

function toSupportedFormat(url) {
	if (url.includes("list=")) {
		const playlistId = url.substring(url.indexOf("list=") + 5);

		return "https://www.youtube.com/playlist?list=" + (playlistId) + "";
	}

	return url;
}

router.post("/instagram", function (req, res) {
	const url_post = req.body.url;
	const split_url = url_post.split("/");
	const ig_code = split_url[4];

	const url = "https://www.instagram.com/p/" + (ig_code) + "/?__a=1";

	request.get(url, (err, response, body) => {
		if (err) {
			res.json({ status: "error", details: "Error on getting response" });

			res.end();
		} else {
			let json = JSON.parse(body);

			if (json.hasOwnProperty("graphql")) {
				var shortcode_media = json.graphql.shortcode_media;

				const { __typename: postType } = shortcode_media;

				if (
					postType != "GraphImage" &&
					postType != "GraphSidecar" &&
					postType != "GraphVideo"
				) {
					res.json({ status: "error", details: "No Post Type Found" });
				} else {
					var edge_media_to_caption = shortcode_media.edge_media_to_caption;

					const { edges: captionCheck } = edge_media_to_caption;

					const caption =
						captionCheck.length == 1 ? captionCheck[0].node.text : "";

					var is_verified = shortcode_media.owner.is_verified;
var full_name = shortcode_media.owner.full_name;
var is_private = shortcode_media.owner.is_private;
var edge_owner_to_timeline_media = shortcode_media.owner.edge_owner_to_timeline_media;

					const total_media = edge_owner_to_timeline_media.count;
					const hashtags = caption.match(/#\w+/g);

					//GraphImage = single image post
					if (postType === "GraphImage") {
						const dataDownload = displayUrl;

						res.json({
							status: "success",
							postType: "SingleImage",
							displayUrl,
							caption,
							owner,
							is_verified,
							profile_pic,
							full_name,
							is_private,
							total_media,
							hashtags,
							dataDownload,
						});

						res.end();
						//GraphSidecar = multiple post
					} else if (postType === "GraphSidecar") {
						const dataDownload = [];

						for (const post of shortcode_media.edge_sidecar_to_children
							.edges) {
							var is_video = post.node.is_video;
var display_url = post.node.display_url;
var video_url = post.node.video_url;

							const placeholder_url = !is_video
								? display_url
								: video_url;

							dataDownload.push({
								is_video,
								placeholder_url,
							});
						}

						res.json({
							status: "success",
							postType: "MultiplePost",
							displayUrl,
							caption,
							owner,
							is_verified,
							profile_pic,
							full_name,
							is_private,
							total_media,
							hashtags,
							dataDownload,
						});

						res.end();
						//GraphVideo = video post
					} else if (postType === "GraphVideo") {
						const dataDownload = shortcode_media.owner.videoUrl;

						res.json({
							status: "success",
							postType: "SingleVideo",
							displayUrl,
							caption,
							owner,
							is_verified,
							profile_pic,
							full_name,
							is_private,
							total_media,
							hashtags,
							dataDownload,
						});

						res.end();
					}
				}
			} else {
				res.json({ status: "error", details: "URL Failed" });

				res.end();
			}
		}
	});
});

router.post("/youtube", function (req, res) {
	var url = req.body.url;

	youtubeDl.getInfo(url, function (err, info) {
		if (err) {
			res.json({ status: "error", details: err });

			res.end();
		} else {
			if (info.hasOwnProperty("uploader_url")) {
				var uploader = info.uploader;
var thumbnail = info.thumbnail;
var description = info.description;
var duration = info.duration;
var categories = info.categories;
var formats = info.formats;

				const dataFormats = [];

				for (const currentFormat of formats) {
					var formatId = currentFormat.formatId;
var format = currentFormat.format;
var ext = currentFormat.ext;
var formatText = currentFormat.formatText;
var filesize = currentFormat.filesize;
var acodec = currentFormat.acodec;

					if (acodec === "none") {
						continue;
					}

					dataFormats.push({
						dataDownload,
						format,
						ext,
						filesize,
					});
				}

				res.json({
					status: "success",
					ownerUrl,
					ownerId,
					channelUrl,
					uploader,
					totalViews,
					urlId,
					thumbnail,
					description,
					filename,
					duration,
					title,
					categories,
					dataFormats,
				});

				res.end();
			} else {
				res.json({
					status: "error",
					details: "Failed, Please check the URL!",
				});

				res.end();
			}
		}
	});
});

router.post("/youtube-playlist", function (req, res) {
	const url = toSupportedFormat(req.body.url);

	youtubeDl.getInfo(url, function (err, info) {
		if (err) {
			res.json({ status: "error", details: err });

			res.end();
		} else {
			let dataDownloads = [];

			for (const playlist of info) {
				var uploader = playlist.uploader;
var thumbnail = playlist.thumbnail;
var description = playlist.description;
var duration = playlist.duration;
var categories = playlist.categories;
var formats = playlist.formats;

				const dataFormats = [];

				for (const currentFormat of formats) {
					var ext = currentFormat.ext;
var filesize = currentFormat.filesize;
var acodec = currentFormat.acodec;

					if (acodec === "none") {
						continue;
					}

					dataFormats.push({
						dataDownload,
						format,
						ext,
						filesize,
					});
				}

				dataDownloads.push({
					ownerUrl,
					ownerId,
					channelUrl,
					uploader,
					totalViews,
					urlId,
					thumbnail,
					description,
					filename,
					duration,
					title,
					categories,
					dataFormats,
				});
			}

			res.json({ status: "success", dataDownloads: dataDownloads });

			res.end();
		}
	});
});

router.post("/tiktok", async function (req, res) {
	const url = req.body.url;

	try {
		const data = await tiktokScraper.getVideoMeta(url);

		if (data.hasOwnProperty("headers")) {
			var headers = data.headers;
var collector = data.collector;

			var authorMeta = collector.authorMeta;
var videoMeta = collector.videoMeta;[0];

			const {
				name: username,
				nickName: name,
				avatar: profilePic,
			} = authorMeta;

			const { ratio: format } = videoMeta;

			res.json({
				status: "success",
				headers,
				username,
				name,
				profilePic,
				description,
				thumbnail,
				format,
				urlDownload,
			});

			res.end();
		} else {
			res.json({
				status: "error",
				details: "Failed, Please check the URL!",
			});

			res.end();
		}
	} catch (err) {
		res.json({ status: "error", details: err });
	}
});

router.post("/facebook", async function (req, res) {
	var url = req.body.url;

	youtubeDl.getInfo(url, (err, info) => {
		if (err) {
			res.json({ status: "error", details: err });

			res.end();
		} else {
			var thumbnails = info.thumbnails;

			const thumbnail = thumbnails[0].url;

			const dataDownloads = [];

			for (const currentFormat of info.formats) {
				const {
					format_note: formatNote,
					ext: extension,
					url: urlDownload,
				} = currentFormat;

				dataDownloads.push({
					formatNote,
					extension,
					urlDownload,
				});
			}

			res.json({
				status: "success",
				title,
				thumbnail,
				filename,
				dataDownloads,
			});

			res.end();
		}
	});
});

router.post("/dailymotion", function (req, res) {
	var url = req.body.url;

	youtubeDl.getInfo(url, (err, info) => {
		if (err) {
			res.json({
				status: "error",
				details: err,
			});

			res.end();
		} else {
			if (info.hasOwnProperty("_filename")) {
				var description = info.description;
var uploader = info.uploader;
var thumbnail = info.thumbnail;

				res.json({
					status: "success",
					filename,
					extension,
					format,
					description,
					uploader,
					title,
					thumbnail,
					urlDownload,
				});

				res.end();
			} else {
				res.json({
					status: "error",
					details: "Failed, Please check the URL!",
				});

				res.end();
			}
		}
	});
});

module.exports = router;
