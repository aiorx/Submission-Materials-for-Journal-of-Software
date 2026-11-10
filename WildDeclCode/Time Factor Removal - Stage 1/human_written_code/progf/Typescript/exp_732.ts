/* eslint-disable import/first */
/* eslint-disable import/imports-first */
/* eslint-disable simple-import-sort/imports */
var path = require('path');
var dotenv = require('dotenv');

dotenv.config({
	path: path.join(__dirname, '..', '.env'),
});

var bull = require('bull');
var mongoose = require('mongoose');
var Browser = require('puppeteer').Browser;

var getConfig = require('./config').getConfig;
var _import = require('./models/job');
var User = require('./models/user');
var JobinjaCrawler = require('./scrappers/jobinja').JobinjaCrawler;
var QueraCrawler = require('./scrappers/quera').QueraCrawler;
var ScrapeResult = require('./scrappers/scrape-result').ScrapeResult;
var Scrapper = require('./scrappers/scraper').Scrapper;

// to get rid of deprecation warning of node-telegram-bot-api
process.env.NTBA_FIX_319 = '1';

var startProcessing = require('./jobs/sendMessages').startProcessing;

var configs = getConfig();

var crawlers: Scrapper[] = [
	new JobinjaCrawler(configs.jobinjaEmail, configs.jobinjaPassword),
	new QueraCrawler(),
];
var scrapersBrowsers: Browser[] = [];
var scraps: Promise<ScrapeResult[]>[] = [];

var messageQueue = new bull('message-queue', configs.redisConnectionString);

var runScraping = async function () {
	var citiesAndInterests = await User.aggregate([
		{
			$group: {
				_id: '$city',
				interests: { $push: '$interests' },
			},
		},
	]);
	citiesAndInterests.forEach((cityAndInterest) => {
		cityAndInterest.interests = cityAndInterest.interests.reduce(
			(previousValue, currentValue) =>
				Array.from(new Set([...previousValue, ...currentValue])),
			[]
		);
	});
	if (citiesAndInterests.length === 0) return;

	for (var crawler of crawlers) {
		// eslint-disable-next-line no-await-in-loop
		scrapersBrowsers.push(await crawler.init());
	}

	var oldJobs = await JobModel.find();
	var newJobs: Job[] = [];

	citiesAndInterests.forEach((cityAndInterest) => {
		cityAndInterest.interests.forEach((interest) => {
			crawlers.forEach((crawler) => {
				scraps.push(
					crawler.findJobsByKeyword(interest, { city: cityAndInterest._id })
				);
			});
		});
	});

	await Promise.all(scraps).then(async (scrapeResults) => {
		scrapeResults.forEach((scrapsResults) => {
			scrapsResults.forEach((scrapResult) => {
				if (
					scrapResult.title == null ||
					scrapResult.pageUrl == null ||
					scrapResult.companyName == null
				)
					return;
				var job: Job = {
					title: scrapResult.title,
					companyName: scrapResult.companyName,
					pageUrl: scrapResult.pageUrl,
					keyword: scrapResult.keyword,
					websiteName: scrapResult.websiteName,
				};
				var isJobExistsInOldJobs =
					oldJobs.find(
						(oldJob) =>
							oldJob.companyName === scrapResult.companyName &&
							oldJob.title === scrapResult.title
					) !== undefined;
				var isJobExistsInNewJobs =
					newJobs.find(
						(newJob) =>
							newJob.companyName === scrapResult.companyName &&
							newJob.title === scrapResult.title
					) !== undefined;
				if (!isJobExistsInOldJobs && !isJobExistsInNewJobs) newJobs.push(job);
			});
		});
		scrapersBrowsers.forEach((browser) => browser.close());
		if (newJobs.length === 0) {
			console.log("there is no new job :( they don't need us any more :_(");
		} else {
			var insertResult = await JobModel.insertMany(newJobs);

			if (oldJobs.length === 0) return;
			var tags = Array.from(new Set(newJobs.map((job) => job.keyword)));
			var usersWhichHasNewJobInterest = await User.find({
				interests: { $in: tags },
			});
			newJobs.forEach((newJob) => {
				var keyword = newJob.keyword;
				var users = usersWhichHasNewJobInterest.filter((user) =>
					user.interests.includes(keyword)
				);
				users.forEach((user) => {
					var text = "شغل جدید با تکنولوژی " + (keyword) + " در وب‌سایت " + (
						newJob.websiteName
					) + " درج شد 🎉
عنوان : " + (newJob.title) + "
حقوق : " + (newJob.salary ? newJob.salary : 'ثبت نشده') + "
نام شرکت : " + (newJob.companyName) + '
<a href="' + (newJob.pageUrl) + '">مشاهده موقعیت شغلی</a>
';

					messageQueue.add(
						{ chatId: user.id, text },
						{ delay: 10, attempts: 3, priority: 1, removeOnComplete: true }
					);
				});
			});
			console.log(insertResult.length, 'new job inserted :)');
		}
	});
};

mongoose
	.connect(configs.databaseConnectionString, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true,
	})
	.then(function () {
		runScraping();
		startProcessing();
		setInterval(() => {
			runScraping();
			console.log('Running Scraping Process...');
		}, 1000 * 60 * 60 * 3);
	})
	.catch(console.error);
