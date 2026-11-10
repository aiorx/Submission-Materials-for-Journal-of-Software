// ==UserScript==
// @name         Moodle Ninja
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Control Moodle with the keyboard.
// @author       You
// @match        https://moodle.calvin.edu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=calvin.edu
// @grant        unsafeWindow
// @run-at document-idle
// ==/UserScript==

(function() {
    'use strict';

    // const OLLAMA_SERVER = "http://localhost:10000";
    var OLLAMA_SERVER = "http://localhost:11434";


    // Abort if we're inside a tinymce editor.
    if (document.body.classList.contains('mce-content-body')) {
        return;
    }
    
    function addTree(parent, children) {
        if (!parent.children) parent.children = [];
        ninjaData.push(parent);
        children.forEach(function c {
            if (!c.id) c.id = c.title;
            c.parent = parent.id;
            parent.children.push(c.id);
            ninjaData.push(c);
        });
    }

    var searchParams = new URLSearchParams(document.location.search);
    var courseId;
    var activityDirectory = [];

    function getCourseId() {
        var w = unsafeWindow;
        if (w.M && w.M.cfg && w.M.cfg.courseId) {
            return w.M.cfg.courseId
        }
        var dataResult = document.querySelector('[data-courseid]');
        if (dataResult) {
            return dataResult.getAttribute('data-courseid');
        }
        // Find the course id by looking for a course nav link. (TODO: this feels fragile.)
        return new URL(document.querySelector('header a[href*="/course/view.php"]').href).searchParams.get('id');
    }

    if (window.location.pathname === '/course/view.php') {
        // Capture the activities for this course.
        courseId = searchParams.get('id');

        activityDirectory = [...document.querySelectorAll('li.section')].map(function section {
            var secId = section.getAttribute('id');
            var labeledByElt = section.getAttribute('aria-labeled-by') || section.getAttribute('aria-labelledby');
            if (!labeledByElt) console.warn("Couldn't find title for", section);
            var secTitle = document.getElementById(labeledByElt).textContent.trim();
            var activities = [...section.querySelectorAll('ul.section > li.activity .activity-instance')].map(activityInstance => {
                if (!activityInstance) return;
                var titleElt = activityInstance.querySelector('.activityname');
                if (!titleElt) {
                    console.warn("OOPS, missing title", activityInstance);
                    //alert("Missing title for activity in " + secTitle);
                    // intentionally crash rather than give corrupt data.
                }
                var title = titleElt.querySelector('.instancename').textContent;
                var linkNode = titleElt.querySelector('a');
                if (!linkNode) {
                    console.warn("OOPS, missing link", activityInstance, title);
                }
                var url = linkNode.getAttribute('href');

                var activity = {title, url};
                // Extract the activity type from the URL.
                if (/\/mod\/quiz\/view.php/.test(activity.url)) {
                    activity.type = 'quiz';
                } else if (/\/mod\/assign\/view.php/.test(activity.url)) {
                    activity.type = 'assign'; // Match the name of the module.
                } else if (/\/mod\/forum\/view.php/.test(activity.url)) {
                    activity.type = 'forum';
                }

                // extract the activity id while we're here
                activity.id = new URL(activity.url).searchParams.get('id');

                return activity;
            });
            return {secId, secTitle, activities};
        });
        localStorage["activities-" + (courseId) + ""] = JSON.stringify(activityDirectory);
    } else {
        // Load the stored activities for this course.
        courseId = getCourseId();
        var stored = localStorage["activities-" + (courseId) + ""];
        if (stored) {
            activityDirectory = JSON.parse(stored);
        }
    }

    var activityDirectoryFlat = activityDirectory.flatMap(function x { return x.activities; });

    // Workaround from https://github.com/ssleptsov/ninja-keys/issues/51
    var tag2 = document.createElement('script');
    tag2.setAttribute('type', 'importmap');
    tag2.textContent = '
    {
        "imports": {
            "https://unpkg.com/lit-html@latest/directives/ref.js?module": "https://unpkg.com/lit-html@2.2.6/directives/ref.js?module"
        }
    }';
    document.body.appendChild(tag2);

    // https://github.com/ssleptsov/ninja-keys
    var tag = document.createElement('script');
    tag.setAttribute('type', 'module');
    tag.setAttribute('src', "https://unpkg.com/ninja-keys?module");
    document.body.appendChild(tag);

    var ninja = document.createElement('ninja-keys');
    ninja.setAttribute('style', '--ninja-z-index: 1050;'); // Get it in front of the course blocks and the discussion grader (z-index: 1040 from .layout.fullscreen)
    ninja.setAttribute('openHotkey', "cmd+p,ctrl+p");
    document.body.appendChild(ninja);


    // Create the go-to-activity action hierarchy.
    function activityHandler(item) {
        window.location = item.url;
    }

    var ninjaData = [];
    var courseSections = [
        {title: "Course Home", handler: function () {window.location = "/course/view.php?id=" + (courseId) + "&perpage=5000"; }},
        {
            id: "Participants",
            title: "Course Participants",
            handler: function () {window.location = "/user/index.php?id=" + (courseId) + ""; }
        },
        {title: "Gradebook", handler: function () {window.location = "/grade/report/index.php?id=" + (courseId) + ""; }}
    ];
    (function () {
        var x;
        if (x = document.querySelector('a.editingbutton')) {
            courseSections.push({title: "Toggle Editing", handler: () => {x.click(); }})
        }
    })();

    addTree({id: "Sections", title: "Course Sections"}, courseSections);

    var activityItem = {id: "Act", title: "Activity", children: []};
    ninjaData.push(activityItem);
    activityDirectory.forEach(function section {
        var secId = section.secId;
        var children = section.activities.map(({title, url}) => ({
            id: title, title: title,
            parent: secId,
            url: url, handler: activityHandler
        }));
        activityItem.children.push(section.secId);
        ninjaData.push({id: section.secId, title: section.secTitle, parent: "Act", children: children.map(x => x.id)});
        children.forEach(child => {ninjaData.push(child);}); // is there an .extend for arrays?
    });

    // I think this is broken somehow: https://github.com/ssleptsov/ninja-keys/blob/main/src/ninja-keys.ts#L192
    /**    ninja.data = [
        {
            id: "Act",
            title: "Activity",
            children: activityDirectory.map(({secTitle, activities}) => ({
                id: secTitle,
                title: secTitle,
                children: activities.map(({title, url}) => ({id: title, title: title, url: url, handler: activityHandler}))
            }))
        }
    ];*/

    /* Course blocks */
    ninjaData.push({
        id: "CourseBlocks",
        title: "Course Blocks Open-Close",
        handler: function () {
            var btn = document.getElementById('blocksliderbutton');
            if (btn) {
                btn.click();
                btn.scrollIntoView();
            }
        }
    });

    /* TODO: Merge quiz ninja into here */

    /* Assignment */
    // TODO:
    // Download all: https://moodle.calvin.edu/mod/assign/view.php?id=1517797&action=downloadall

    /* Convert-assignment-thing */
    ninjaData.push({
        id: "Submission",
        title: "Submission",
        children: ["Show File Uploads", "Save-Next", "Reset"]
    });

    async function showRaw(href) {
        var panel = document.querySelector('[data-region="review-panel"]');

        // Cleanup any object urls to avoid memory leaks.
        panel.querySelectorAll('iframe').forEach(function x {
            if (x.src.startsWith('blob:')) {
                URL.revokeObjectURL(x.src);
            }
        });
        panel.innerHTML = '';

        if (!href) return; // null can be used to clear the view without loading another thing.

        panel.innerHTML = "<p>Loading...</p>";

        // FIXME: if fetch is slow, this function could be reentrant.
        var response = await fetch(href);
        //let responseText = await response.text();
        var responseBlob = await response.blob();
        if (responseBlob.type === "application/octet-stream") {
            // Avoid downloading it.
            responseBlob = responseBlob.slice(0, responseBlob.size, "text/plain");
        }
        var iframe = document.createElement("iframe");
        iframe.setAttribute("sandbox", "allow-scripts allow-downloads"); // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox

        var allowedContentTypes = ["text/plain", "text/html", "application/pdf"];
        var responseType = responseBlob.type.split(';')[0]; // split off ;charset=utf-8 etc.
        if (allowedContentTypes.indexOf(responseType) === -1) {
            iframe.srcdoc = "Click the file name to download it. (Not displaying because the response type was " + (responseBlob.type) + ".)";
        } else {
            if (responseType === "text/html") {
                // Apply HTML content filters.
                // can't use response.text() since we already read the response. Instead, convert the blob we already have to text.
                var responseText = await new Response(responseBlob).text();
                var parser = new DOMParser();
                var doc = parser.parseFromString(responseText, "text/html");
                // Rewrite relative URLs on script and link tags like "ex03-bikeshare-wrangling_files/libs/clipboard/clipboard.min.js"
                // to be absolute URLs sourced from https://calvin-data-science.github.io/data202/site_libs/
                function rewriteURL(url) {
                    if (url.startsWith('http') || url.startsWith('data:')) return url;
                    var libPath = url.replace(/.*?\/libs\//, '');
                    return "https://calvin-data-science.github.io/data202/site_libs/" + (libPath) + "";
                }
                doc.querySelectorAll('script').forEach(function script {
                    if (script.src) {
                        var fixedURL = rewriteURL(script.getAttribute('src'));
                        console.log("Rewriting", script.src, "to", fixedURL);
                        script.src = fixedURL;
                    }
                });
                doc.querySelectorAll('link').forEach(function link {
                    if (link.href) {
                        var fixedURL = rewriteURL(link.getAttribute('href'));
                        console.log("Rewriting", link.href, "to", fixedURL);
                        link.href = fixedURL;
                    }
                });

                // Inject a mack localStorage as the first child within head
                var localStorageScript = doc.createElement('script');
                localStorageScript.textContent = "window.localStorage = {getItem: () => null, setItem: () => null, removeItem: () => null};";
                doc.head.insertBefore(localStorageScript, doc.head.firstChild);

                responseText = doc.documentElement.outerHTML;
                responseBlob = new Blob([responseText], {type: "text/html"});
            }
            iframe.src = URL.createObjectURL(responseBlob);
        }
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        panel.appendChild(iframe);
    }

    ninjaData.push({
        id: "Show File Uploads",
        title: "Show File Uploads",
        parent: "Submission",
        //hotkey: "cmd-opt-h",
        handler: function () {
            var observer = new MutationObserver(mutCallback)
            observer.observe(document.querySelector('[data-region="grade-panel"]'), {childList: true, attributes: false, subtree: true});
            hookFileSubmissions(document.body);
            rubricNumbers(document.body); // FIXME: proper hook mechanism
        }
    });
    ninjaData.push({
        id: "Save-Next",
        title: "Save and Show Next",
        //hotkey: "cmd-opt-s",
        parent: "Submission",
        handler: function () { document.querySelector('[name="saveandshownext"]').click(); }
    });
    ninjaData.push({
        id: "Reset",
        title: "Reset Grading Form",
        parent: "Submission",
        handler: function () { window.$(document).trigger('reset'); }
    });

    function showAndHighlightRaw(tag) {
        showRaw(tag.href);
        document.querySelectorAll('.fileuploadsubmission a').forEach(function x {
            x.style.fontWeight = 'normal';
        })
        tag.style.fontWeight = 'bold';
    }


    function hookFileSubmissions(parentNode) {
        console.log('hookFileSubmissions', parentNode)
        if (!parentNode.parentNode.querySelector('.submissionstatustable')) { return; }
        var shownTag = null;
        parentNode.querySelectorAll('.fileuploadsubmission a').forEach(function tag {
            //console.log("Got node", m, "from", parentNode);
            // Be careful: we seem to get addedNodes from several different parent nodes (why??),
            // so abort if we've already handled this one.
            if (tag.hooked) return;
            tag.hooked = true;
            tag.parentNode.addEventListener('click', () => showAndHighlightRaw(tag), false);
            if (!shownTag) {
                showAndHighlightRaw(tag)
                shownTag = tag;
            }
        });
        if (!shownTag) showRaw(null);
    }

    function rubricNumbers(parentNode) {
        for (var criterion of document.querySelectorAll("#advancedgrading-criteria tr.criterion")) {
            var scoreElt = criterion.querySelector('.score input');
            var outOf = criterion.querySelector('.score div').textContent;
            scoreElt.type = 'number';
            scoreElt.min = "0";
            scoreElt.max = ""+outOf;
            scoreElt.step = "0.1";
            scoreElt.required = true;
        }
    }

    function mutCallback(mutationList, observer) {
        mutationList.forEach(function mutation {
            if (mutation.type !== 'childList') return;
            //console.log(mutation.addedNodes, mutation.removedNodes);
            mutation.addedNodes.forEach(node => {
                if (!node.querySelectorAll) { return; }
                hookFileSubmissions(node);
                rubricNumbers(node);
            })
        })
    }

    /* Gradebook setup */
    ninjaData.push({
        id: "GradebookSetup",
        title: "Gradebook Setup",
        children: ["UnhideLabels"]
    });
    ninjaData.push({
        id: "UnhideLabels",
        parent: "GradebookSetup",
        title: "Unhide checkbox labels",
        handler: function () {
            var selector = ".accesshide";
            var column = prompt("Which column?", "4");
            if (column) {
                selector = ".c" + (column) + " " + (selector) + "";
            }
            document.getElementById('grade_edit_tree_table').querySelectorAll(selector).forEach(x => x.classList.remove('accesshide'));
        }
    });

    /* The silly gears... */
    var actionMenu = [...document.querySelectorAll('#region-main-settings-menu [data-enhance="moodle-core-actionmenu"] a[role="menuitem"]')].map(function x { return ({title: x.textContent, url: x.getAttribute("href")}); });
    if (actionMenu.length > 0) {
        addTree(
            {id: "MenuActions", title: "Gear"},
            actionMenu.map(function m { return ({id: "Gear-" + m.title, "title": m.title, url: m.url, handler: activityHandler }); })
        );
    }

    ninja.data = ninjaData;
    console.log(ninja.data);

    if (window.location.pathname === '/grade/report/singleview/index.php') {
        addTree(
            {id: "Grading", title: "Grading"},
            [
                {
                    title: "Show full feedback",
                    handler: function () {
                        document.querySelectorAll('input[id^=feedback][disabled]').forEach(x => {x.closest('td').style.textAlign = "left"; x.outerHTML = x.value; } )
                    }
                }
            ]
        );
    }

    if (window.location.pathname === '/course/modedit.php') {
        addTree(
            {id: "Edit", title: "Editing"},
            [
                {
                    title: "Edit next",
                    handler: function () {
                        var currentId = searchParams.get('update');
                        var currentActivityIndex = activityDirectoryFlat.findIndex(x => x.id === currentId);
                        if (currentActivityIndex === -1) {
                            alert("Couldn't find current activity in activity directory.");
                            return;
                        }
                        function slugify(s) {
                            return s.replace(/[^a-zA-Z]/g, '');
                        }
                        var currentActivitySlug = slugify(activityDirectoryFlat[currentActivityIndex].title);
                        currentActivityIndex++;
                        var matched = false, nextActivity;
                        while (currentActivityIndex < activityDirectoryFlat.length - 1) {
                            nextActivity = activityDirectoryFlat[currentActivityIndex];
                            // Skip activities that don't match the slug
                            if (slugify(nextActivity.title) === currentActivitySlug) {
                                matched = true;
                                break;
                            }
                            currentActivityIndex++;
                        }

                        if (!matched) {
                            alert("No next activity.");
                            return;
                        }
                        // Go to the edit page for the next activity.
                        window.location = "/course/modedit.php?update=" + (nextActivity.id) + "";
                    }
                }
            ])
    }


    addTree(
        {id: "AI", title: "Moodle Copilot"},
        [{
            id: "Confusions",
            title: "Get Confusions",
            handler: async function () {
                // make a floating window to display the results
                var results = document.createElement('div');
                results.style.position = "fixed";
                results.style.top = "0";
                results.style.right = "0";
                results.style.width = "25%";
                results.style.height = "25%";
                results.style.backgroundColor = "white";
                results.style.zIndex = "10000";
                results.style.overflow = "scroll";
                results.style.padding = "1em";
                results.style.border = "1px solid black";
                results.style.boxShadow = "0 0 10px black";
                results.style.fontSize = "small";
                results.style.whiteSpace = "pre-wrap";

                var closeBtn = document.createElement('button');
                closeBtn.textContent = "Close";
                closeBtn.style.position = "absolute";
                closeBtn.style.top = "0";
                closeBtn.style.right = "0";
                closeBtn.addEventListener('click', () => {results.remove();});
                results.appendChild(closeBtn);

                document.body.appendChild(results);


                // get text
                var text = prompt("Instructions?");
                // construct openai request
                // get API key from local storage
                var apiKey = localStorage.getItem('openai-api-key');
                if (!apiKey) {
                    apiKey = prompt("OpenAI API Key").trim();
                    localStorage.setItem('openai-api-key', apiKey);
                }
                // construct request
                var request = {
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {
                            "role": "system",
                            "content": "What clarification questions might students have about these instructions?"
                        },
                        {
                            "role": "user",
                            "content": text
                        }
                    ],
                    "temperature": .7,
                    "max_tokens": 2048,
                    "top_p": 1,
                    "frequency_penalty": 0,
                    "presence_penalty": 0
                };
                // send request to api.openai.com
                var result = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        "Authorization": "Bearer " + (apiKey) + "",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(request)
                });
                result = await result.json();
                // get response
                console.log(result);
                var response = result.choices[0].message.content;
                // display response
                results.textContent = response;
            }
        }]
    );

    ninjaData.push({
        id: "ClarifyPosts",
        title: "Clarify posts using local AI",
        handler: async function () {
            await clarifyDiscussionPosts();
        }
    });

    async function clarifyDiscussionPosts() {
        var contentContainers = document.querySelectorAll('.post-content-container');
        for (var contentContainer of contentContainers) {
            var origHTML = contentContainer.innerHTML;
            var content = contentContainer.textContent;

            var request = {
                "model": "llama3.1:latest",
                "messages": [
                    {
                        "role": "system",
                        "content": "Insert paragraph breaks in the following text. Also, bold any names mentioned. Include just the result, no explanation."
                    },
                    {
                        "role": "user",
                        "content": content
                    }
                ],
                "stream": false,
            };
            var result = await fetch("" + (OLLAMA_SERVER) + "/api/chat", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(request)
            });
            result = await result.json();
            console.log(result);
            var message = result.message.content;

            // Render the Markdown
            var rendered = marked.marked(message);
            contentContainer.innerHTML = rendered;

            // Add a details element with the original content.
            var details = document.createElement('details');
            var summary = document.createElement('summary');
            summary.textContent = "Original content";
            details.appendChild(summary);
            var div = document.createElement('div');
            div.innerHTML = origHTML;
            details.appendChild(div);
            contentContainer.appendChild(details);
        }
    }
    unsafeWindow.clarifyDiscussionPosts = clarifyDiscussionPosts;

    ninjaData.push({
        id: "BulkOverride",
        title: "Bulk Quiz Overrides",
        handler: async function () {
            var userId = prompt("User ID?");
            if (!userId) return;

            // activities of type quiz
            var quizzes = activityDirectory.flatMap(category =>
                                                    category.activities.filter(x => x.type === "quiz"));
            var activityTitles = quizzes.map(x => x.title).join("\n");
            if (!confirm("This will override the due date for the following quizzes:\n" + (activityTitles) + "\n\nContinue?")) return;

            for (var quiz of quizzes) {
                var quizId = quiz.id;
                console.log(quiz);
                var response = await fetch("https://moodle.calvin.edu/mod/quiz/overrideedit.php", {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:107.0) Gecko/20100101 Firefox/107.0",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Upgrade-Insecure-Requests": "1",
                        "Sec-Fetch-Dest": "document",
                        "Sec-Fetch-Mode": "navigate",
                        "Sec-Fetch-Site": "same-origin",
                        "Sec-Fetch-User": "?1"
                    },
                    "referrer": "https://moodle.calvin.edu/mod/quiz/overrideedit.php?action=adduser&cmid=" + (quizId) + "",
                    // "body": `action=adduser&cmid=${quizId}&sesskey=${window.M.cfg.sesskey}&_qf__quiz_override_form=1&mform_isexpanded_id_override=1&userid=${userId}&password=&timeclose%5Bday%5D=9&timeclose%5Bmonth%5D=12&timeclose%5Byear%5D=2022&timeclose%5Bhour%5D=23&timeclose%5Bminute%5D=59&timeclose%5Benabled%5D=1&timelimit%5Bnumber%5D=40&timelimit%5Btimeunit%5D=60&timelimit%5Benabled%5D=1&attempts=1&submitbutton=Save`,
                    "body": "action=adduser&cmid=" + (quizId) + "&sesskey=" + (window.M.cfg.sesskey) + "&_qf__quiz_override_form=1&mform_isexpanded_id_override=1&userid=" + (userId) + "&password=&attempts=0&submitbutton=Save",
                    "method": "POST",
                    "mode": "cors"
                });
                console.log(response);
            }
        }
    });

    /*
     * Giving credit for timely completion of quizzes.
     * This should be in a separate file.
     */
    async function getEarliestAttemptTimes(activity, userIdToEmail) {
        if (activity.type === 'quiz') {
            return await getQuizEarliestAttemptTimes(activity.id);
        } else if (activity.type === 'assign') {
            return await getAssignEarliestAttemptTimes(activity.id, userIdToEmail);
        } else {
            // complain
            throw new Error("Don't know how to get earliest attempt times for " + (activity.type) + "");
        }
    }

    async function getQuizEarliestAttemptTimes(quizId) {
        /**
         * Get the times when each user completed the quiz.
         * Returns a map from email to date.
         */
        /* get the response CSV */
        var url = "/mod/quiz/report.php?sesskey=" + (window.M.cfg.sesskey) + "&download=json&id=" + (quizId) + "&mode=overview&attempts=enrolled_with&onlygraded=&onlyregraded=&slotmarks=1";
        var gradesJSON = await fetch(url);
        var grades = await gradesJSON.json();
        /* for some reason there's an extra array layer */
        grades = grades[0];
        // Get the earliest attempt for each user.
        var earliestAttemptByUser = new Map();
        for (var attempt of grades) {
            // the columns aren't labeled! It's last,first,email,status,startTime,completionTime,duration,grade then grades for each question
            var email = attempt[2];
            var completionTime = attempt[5];
            // Parse the date, format looks like "February 17 2023  11:28 AM".
            var date = new Date(completionTime);
            var existingAttempt = earliestAttemptByUser.get(email);
            if (!existingAttempt || existingAttempt > date) {
                earliestAttemptByUser.set(email, date);
            }
        }
        return earliestAttemptByUser;
    }

    async function getAssignEarliestAttemptTimes(moduleId, userIdToEmail) {
        /**
         * Get the earliest submission time for each user.
         * Returns a map from email to date.
         *
         * Since the assignment module doesn't have a report, we have to get the data from the log.
         * The log data doesn't include the email, so this function requires a map from user ID to email.
         */

        /** get the submission times from the log */
        var url = "/report/log/index.php?sesskey=" + (window.M.cfg.sesskey) + "&download=json&id=" + (courseId) + "&modid=" + (moduleId) + "&modaction=c&chooselog=1&logreader=logstore_standard";
        var response = await fetch(url);
        var data = await response.json();

        // for some reason there's an extra array layer
        data = data[0];

        /* The format isn't documented, so apologies for the atrocious code. */
        var earliestAttemptByUser = new Map();
        for (var row of data) {
            // The log entries we care about have a column 5 that looks like "Submission created." and a column 6 that looks like
            // "The user with id '21655' created an online text submission with '4' words in the assignment with course module id '1575205'."
            // There is no column for the email; we have to look it up.
            if (row[5] !== "Submission created.") continue;

            var userId = row[6].match(/user with id '(\d+)'/)[1];
            var email = userIdToEmail.get(userId);
            if (!email) {
                console.warn("No email found for user " + (userId) + "");
                continue;
            }

            // The date format looks like "03/3/23, 20:16". Fortunately, the Date constructor seems to handle it.
            var date = new Date(row[0]);

            var existingAttempt = earliestAttemptByUser.get(email);
            if (!existingAttempt || existingAttempt > date) {
                earliestAttemptByUser.set(email, date);
            }
        }
        return earliestAttemptByUser;
    }

    function stripTrailingZeros(value) {
        // Strip trailing zeros. Also strip the decimal point if there are no digits after it.
        return value.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    }

    function fillInTextboxIfDifferent(textbox, value) {
        var textBoxValue = textbox.value;
        value = "" + value; // make sure it's a string
        if (stripTrailingZeros(textbox.value) !== stripTrailingZeros(value)) {
            textbox.value = value;
            // trigger the change event
            textbox.dispatchEvent(new Event('change'));
        }
    }

    async function creditAllAttempts(activities, userIdToEmail) {
        // don't count spring break as business days.
        // Treat the days as local times, since that's needed for business day calculations.
        var exceptionDates = ['2023-02-27',
                              '2023-02-28',
                              '2023-03-01',
                              '2023-03-02',
                              '2023-03-03'].map(function x { return new Date("" + (x) + "T00:00:00"); });

        var activityIds = activities.map(function activity { return activity.id; });
        // Make a map from activity id to activity name
        var activityNames = new Map();
        for (var activity of activities) {
            activityNames.set(activity.id, activity.title);
        }


        var attemptsByActivity = new Map(); // from email to array of dates
        for (var activity of activities) {
            attemptsByActivity.set(activity.id, await getEarliestAttemptTimes(activity, userIdToEmail));
        }

        // now we have a map of emails to dates of activity attempts

        // For each user, fill in the grade and feedback comments.
        var defaultDueDate = null, defaultDueElt;
        if (defaultDueElt = document.querySelector('#region-main [data-region="activity-dates"] div')) {
            defaultDueDate = new Date(defaultDueElt.textContent.trim().match(/Due: (.+)$/)[1]);
        }
        var userRows = document.querySelectorAll('.gradingtable table tbody tr');
        for (var userRow of userRows) {
            var email = userRow.querySelector('.email').textContent; // should also be .c3
            // due date column is only present if different students have different due dates
            var dueDate = userRow.querySelector('.duedate')?.textContent; // yay, optional chaining
            if (!dueDate) {
                if (!defaultDueDate) {
                    defaultDueDate = prompt("What is the due date for this assignment? (e.g. 2021-03-31 23:59:59)");
                    defaultDueDate = new Date(defaultDueDate);
                }
                dueDate = defaultDueDate;
            } else {
                dueDate = new Date(dueDate);
            }

            // Loop through each activity, count how many days late each one is.
            var resultsByActivity = new Map(), totalPoints = 0;
            for (var [activityId, attemptTimes] of attemptsByActivity) {
                var attemptTime = attemptTimes.get(email);
                if (!attemptTime) {
                    // They didn't attempt this activity.
                    resultsByActivity.set(activityId, "No attempt");
                    continue;
                }
                if (attemptTime <= dueDate) {
                    resultsByActivity.set(activityId, "On time");
                    totalPoints++;
                } else {
                    var daysLate = countBusinessDaysBetween(dueDate, attemptTime, exceptionDates);
                    resultsByActivity.set(activityId, "" + (daysLate) + " days late");
                    // Subtract 1/5 of a point for each day late.
                    totalPoints += Math.max(0.2, 1 - daysLate * 0.2);
                }
            }
            var grade = totalPoints / activityIds.length;
            // Set the grade text box.
            var gradeTextBox = userRow.querySelector('input[name^=quickgrade]');
            // The maximum grade is the text just after the text box
            var outOfText = gradeTextBox.nextSibling.textContent;
            // extract just the number out of that.
            var maxGrade = parseInt(outOfText.match(/\d+/)[0]);
            fillInTextboxIfDifferent(gradeTextBox, (grade * maxGrade).toFixed(2));
            // Set the feedback text box.
            var feedbackText = '';
            if (grade < 1.0) {
                feedbackText = "Results by activity: ";
                var anyNoAttempt = false;
                for (var [activityId, result] of resultsByActivity) {
                    if (result === "No attempt") {
                        anyNoAttempt = true;
                    }
                    feedbackText += "" + (activityNames.get(activityId)) + ": " + (result) + ", ";
                }
                if (anyNoAttempt) {
                    feedbackText += " Don't forget to complete these activities on Moodle. Let the instructor know when you have done so.";
                }
            }
            var feedbackTextBox = userRow.querySelector('textarea[name^=quickgrade_comments]');
            fillInTextboxIfDifferent(feedbackTextBox, feedbackText);
        }
    }


    function countBusinessDaysBetween(startDate, endDate, exceptionDates) {
        // Ignore any dates that are in the exception list.
        // The initial structure was generated Assisted using common GitHub development aids, but accidentally modified the startDate, and
        // its initial suggestion for exceptionDates didn't work because array.includes doesn't work on Date objects.
        var count = 0;
        // Make sure to COPY THE DATE VALUES, otherwise we'll be modifying the original dates.
        var currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            // Get just the date part of the date.
            var dayOf = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            // Can't use `.includes` because it doesn't properly compare Date objects.
            if (!exceptionDates.some(function x { return x - dayOf === 0; })) {
                var day = currentDate.getDay();
                // day 0 is Sunday, day 6 is Saturday
                if (day !== 0 && day !== 6) {
                    count++;
                }
            }
            // go to the next day.
            // Note: this actually works, because setDate handles out-of-range by wrapping to the next month.
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return count;
    }



    function getMatchingActivities(regex) {
        // make sure the regex is a regex
        if (typeof regex === 'string') {
            regex = new RegExp(regex);
        }

        // activityDirectory is organized by category, so we need to flatten it.
        var matchingActivities = [];
        for (var category of activityDirectory) {
            for (var activity of category.activities || []) {
                if (activity.type !== "quiz" && activity.type !== "assign" && activity.type !== "forum") {
                    // not a type we care about.
                    continue;
                }

                // check that the title matches.
                if (!regex.test(activity.title)) {
                    continue;
                }

                matchingActivities.push(activity);
            }
        }
        return matchingActivities;
    }

    if (window.location.pathname === '/mod/assign/view.php') {
        ninjaData.push({
            id: "CreditFromQuizzes",
            title: "Give credit from quizzes",
            handler: async function () {
                var activityRegex = prompt('Enter a regex to match the activities you want to credit.');
                var activities = getMatchingActivities(activityRegex);
                if (activities.length === 0) {
                    alert("no matching activities.")
                    return;
                }
                // Confirm that these are the activities you want to credit.
                var activityTitles = activities.map(activity => activity.title);
                var activityTitlesString = activityTitles.join('\n');
                var confirmed = confirm("Are you sure you want to credit all completions of the following activities?\n\n" + (activityTitlesString) + "");
                if (!confirmed) {
                    return;
                }

                var userIdToEmail = scrapeUserIdToEmailMap();
                await creditAllAttempts(activities, userIdToEmail);
            }
        });

        ninjaData.push({
            id: "CreditAnySubmissions",
            title: "Give credit for any submissions",
            handler: async function () {
                // loop through all grading rows
                for (var userRow of document.querySelectorAll('.gradingtable table tbody tr')) {
                    // If the assignment was submitted, there's a .submissionstatussubmitted element.
                    var submitted = !!userRow.querySelector('.submissionstatussubmitted');
                    var gradeFrac = submitted ? 1 : 0;
                    var quickGradeInput = userRow.querySelector('input[name^=quickgrade]');
                    if (quickGradeInput) {
                        // The maximum grade is the text just after the text box
                        var outOfText = quickGradeInput.nextSibling.textContent;
                        // extract just the number out of that.
                        var maxGrade = parseInt(outOfText.match(/\d+/)[0]);
                        var grade = maxGrade * gradeFrac;
                        fillInTextboxIfDifferent(quickGradeInput, grade.toFixed(1));
                    } else {
                        // Sometimes the .quickgrade is a select box.
                        quickGradeInput = userRow.querySelector('select[name^=quickgrade]');
                        if (quickGradeInput) {
                            if (gradeFrac !== 1) {
                                // TODO: handle this situation
                                console.warn("Can't handle a select box for non-submitted assignments yet.");
                                continue;
                            }
                            // Select the <option> with the highest value.
                            var options = [...quickGradeInput.querySelectorAll('option')];
                            var values = options.map(x => parseFloat(x.value));
                            var maxGrade = Math.max(...values);
                            quickGradeInput.value = maxGrade;
                            // trigger a change event
                            quickGradeInput.dispatchEvent(new Event('change'));
                        }
                    }

                }
            }
        })

        ninjaData.push({
            id: "GradeFromRandom",
            title: "Start grading at a random student",
            handler: async function () {
                // Get all grading rows
                var userRows = document.querySelectorAll('.gradingtable table tbody tr');
                // Pick a random one.
                while (true) {
                    var randomRow = userRows[Math.floor(Math.random() * userRows.length)];
                    // Look for a /mod/assign/view.php link
                    var link = randomRow.querySelector('a[href*="/mod/assign/view.php"]');
                    if (!link) { continue; }
                    // Go to that link.
                    window.location.href = link.href;
                    break;
                }
            }
        })
    }

    if (window.location.pathname.startsWith("/grade/import/")) {
        ninjaData.push({
            id: "MatchImportNames",
            title: "Match Import Names",
            handler: function () {
                document.querySelectorAll('#id_general_map select').forEach(sel => {
                    if (sel.labels.length !== 1) {
                        console.log("Missing or inconsistent label for", sel);
                        return;
                    }
                    var label = sel.labels[0].textContent.trim();
                    var opts = (
                        [...sel.querySelectorAll('[label="Grade items"] option')]
                        .filter(x => x.textContent.endsWith(label))
                    );
                    if (opts.length !== 1) {
                        console.log("No match or inconsistent match for", label);
                        return;
                    }
                    sel.value = opts[0].value;
                })
            }
        });
    }

    function scrapeUserIdToEmailMap() {
        var userIdToEmail = new Map();
        var userRows = document.querySelectorAll('.gradingtable table tbody tr');
        for (var userRow of userRows) {
            var email = userRow.querySelector('.email').textContent; // should also be .c3

            var linkWithUserId = userRow.querySelector('a[href*="user/view.php"]');
            var userId = new URL(linkWithUserId.href).searchParams.get('id');
            userIdToEmail.set(userId, email);
        }
        return userIdToEmail;
    }

    // Hack: group selection box bigger:
    function hackGroupSelect() {
        var elt = document.getElementById('addselect');
        if (!elt) return;
        elt.setAttribute('size', '40');
        elt.querySelectorAll("option").forEach(function x {
            if (x.textContent.match(/\(0\)$/)) x.style.color = 'red';
            if (x.textContent.match(/\(1\)$/)) x.style.color = 'green';

        });
    }
    hackGroupSelect();

    // Hack: double-click on review options to set all.
    function hackReviewOptions() {
        document.querySelectorAll('#id_reviewoptionshdr [data-groupname]').forEach(function gg {
            gg.querySelector('p').addEventListener('dblclick', () => {
                gg.querySelectorAll('fieldset input[type="checkbox"]').forEach(x => {x.click();})
            }, false);
        });
    }
    hackReviewOptions();


    // Scrape quick-grade comments
    // from URLs like https://moodle.calvin.edu/mod/assign/view.php?id=1744265&action=grading
    if (window.location.pathname === '/mod/assign/view.php' && window.location.search.includes('action=grading')) {
        scrapeQuickGradeComments();
    }

    function scrapeQuickGradeComments() {
        var curActivityId = new URL(window.location.href).searchParams.get('id');
        var gradingTable = document.querySelector('.gradingtable');
        if (!gradingTable) { return; }
        var comments = [...gradingTable.querySelectorAll('[id^=quickgrade_comments]')].map(function x { return x.value; });

        // store in local storage
        localStorage.setItem("grading-comments-" + (curActivityId) + "", JSON.stringify(comments));
    }

    async function scrapeAllQuickGradeComments() {
        // Call from the main page, get all the /mod/assign/view.php links and scrape the quick grade comments from each one
        var allComments = new Map(); // activity id to {name, comments}
        for (var activityHref of document.querySelectorAll('a[href*="/mod/assign/view"]')) {
            var activityId = new URL(activityHref.href).searchParams.get('id');
            if (!activityId) { continue }
            if (allComments.has(activityId)) { continue; }

            var gradingUrl = activityHref.href + '&action=grading';
            console.log("Fetching", gradingUrl);
            var response = await fetch(gradingUrl);
            var text = await response.text();
            var doc = new DOMParser().parseFromString(text, 'text/html');
            var comments = [...doc.querySelectorAll('.gradingtable [id^=quickgrade_comments]')].map(function x { return x.value; });
            var name = doc.querySelector('.page-header-headings h1').textContent;
            allComments.set(activityId, {name, comments});
        }
        return allComments;
    }

    function scrapeAndStoreAllQuickGradeComments() {
        scrapeAllQuickGradeComments().then(function comments {
            console.log(comments)
            var storageId = "all-quick-grade-comments-course-" + (courseId) + "";
            var commentsAsObject = Object.fromEntries(comments);
            localStorage.setItem(storageId, JSON.stringify(commentsAsObject));
        });
    }

    // Add a Ninja action to scrape all quick-grade comments from this course, but only if we're on the main page
    if (window.location.pathname === '/course/view.php') {
        ninjaData.push({
            id: "ScrapeAllQuickGradeComments",
            title: "Scrape all quick grade comments in this course",
            handler: scrapeAndStoreAllQuickGradeComments
        })
    }

    // Add a Ninja action to show all quick-grade comments for the current activity
    if (window.location.pathname === '/mod/assign/view.php') {
        var curActivityId = new URL(window.location.href).searchParams.get('id');
        var comments = JSON.parse(localStorage.getItem("grading-comments-" + (curActivityId) + ""));
        if (comments) {
            // Watch for input events on
            function editorChanged(event) {
                // Get the text immediately before the cursor.
                // Start by getting the current selection.
                var selection = window.getSelection();
                if (selection.rangeCount === 0) return;

                // For now just get the text immediately before the cursor.
                var range = selection.getRangeAt(0);
                var text = range.startContainer.textContent.slice(0, range.startOffset);
                console.log(text);

                console.log(event)
            }
            //document.querySelector('#id_assignfeedbackcomments_editoreditable').addEventListener('input', editorChanged, false);

            ninjaData.push({
                id: "ShowQuickGradeComments",
                title: "Show Quick-Grade Comments",
                handler: function () {
                    // open a popup with the comments
                    var popup = window.open('', 'quick-grade-comments', 'width=400,height=600');
                    popup.document.body.innerHTML = comments.join('\n\n');
                    popup.document.body.style.backgroundColor = '#f5f5f5';
                    var styleElt = popup.document.createElement('style')
                    styleElt.textContent = "
                        h1, h2, h3, h4, h5, h6 { margin: 0; }
                    ";
                    popup.document.head.appendChild(styleElt);
                }
            });
        }
    }



    // Inject quick-comment buttons into attempt review page
    if (window.location.pathname === '/mod/quiz/review.php') {
        var attemptId = new URL(window.location.href).searchParams.get('attempt');

        document.querySelectorAll('.commentlink a').forEach(function commentLink {
            var target = commentLink.getAttribute('href');

            // Create a new button
            var button = document.createElement('button');
            button.textContent = "Quick comment";
            button.style.marginLeft = '1em';
            commentLink.parentNode.appendChild(button);

            button.addEventListener('click', async (event) => {
                event.preventDefault();
                var text = await (await fetch(target)).text();

                // parse the HTML
                var doc = new DOMParser().parseFromString(text, 'text/html');

                // construct a form submission
                var form = new FormData();
                doc.querySelectorAll('#manualgradingform input').forEach(inputElement => {
                    var name = inputElement.name;
                    var value = inputElement.value;
                    // If the input element name ends with -mark, replace it with the grade.
                    if (name.endsWith('-mark')) {
                        value = "" + prompt("Grade?", value);
                    }
                    console.log(name, value)
                    form.append(name, value);
                });

                // Submit the form.
                var response = await fetch(target, {
                    method: 'POST',
                    body: form
                });
                // If it worked, reload the page.
                if (response.ok) {
                    //window.location.reload();
                }
            }, false);
        });

    }

    // Inject export-one button into edit-quiz page
    if (window.location.pathname === '/mod/quiz/edit.php') {
        // Get all quiz question "activities"
        document.querySelectorAll('.mod-quiz-edit-content a[href*="/question.php"]').forEach(function questionLink {
            // Example link: https://moodle.calvin.edu/question/question.php?cmid=1491697&id=8120072
            var questionId = new URL(questionLink.href).searchParams.get('id');
            var cmid = new URL(questionLink.href).searchParams.get('cmid');
            var row = questionLink.closest('.activity');
            var actionsSpan = row.querySelector('.actions');
            var exportButton = document.createElement('button');
            exportButton.textContent = ">";
            actionsSpan.appendChild(exportButton);
            exportButton.addEventListener('click', async (event) => {
                event.preventDefault();
                // export-one link looks like
                // https://moodle.calvin.edu/question/exportone.php?cmid=1491697&id=8120072&sesskey=SFoM5bsDEQ
                var exportUrl = "/question/exportone.php?cmid=" + (cmid) + "&id=" + (questionId) + "&sesskey=" + (window.M.cfg.sesskey) + "";
                //let response = await fetch(exportUrl);
                //let text = await response.text();
                window.location = exportUrl;
            }, false);
        });
    }

    // Inject next-feedback navigation on single-view page e.g., https://moodle.calvin.edu/grade/report/singleview/index.php?item=user&id=64944&userid=22072
    // Bind to pressing alt-downarrow
    if (window.location.pathname === '/grade/report/singleview/index.php') {
        var navigateFeedback = function (delta) {
            // Make sure we're on a name=feedback input
            var curInput = document.activeElement;
            if (curInput.tagName !== 'INPUT' || !curInput.name.startsWith('feedback')) {
                return;
            }
            // Find the desired row
            var curRow = curInput.closest('tr');
            var desiredRow = (delta > 0) ? curRow.nextElementSibling : curRow.previousElementSibling;
            if (!desiredRow) {
                return;
            }
            var nextInput = desiredRow.querySelector('[name^=feedback]');
            if (nextInput) {
                nextInput.focus();
            }
        }
        document.addEventListener('keydown', function (event) {
            if (event.altKey && event.key === 'ArrowDown') {
                event.preventDefault();
                navigateFeedback(1);
            }
            if (event.altKey && event.key === 'ArrowUp') {
                event.preventDefault();
                navigateFeedback(-1);
            }
        });
    }


    function getMoodleTimeValue(doc, baseName) {
        var year = doc.querySelector('[name="' + (baseName) + '[year]"]').value;
        var month = doc.querySelector('[name="' + (baseName) + '[month]"]').value;
        var day = doc.querySelector('[name="' + (baseName) + '[day]"]').value;
        var hour = doc.querySelector('[name="' + (baseName) + '[hour]"]').value;
        var minute = doc.querySelector('[name="' + (baseName) + '[minute]"]').value;
        return new Date(year, month - 1, day, hour, minute);
    }

    function getMoodleTimeWithEnabled(doc, baseName) {
        var enabled = doc.querySelector('[name="' + (baseName) + '[enabled]"]').checked;
        var time = getMoodleTimeValue(doc, baseName);
        return {enabled, time};
    }

    /***
    // Retrieve quiz metadata
    async function getQuizMeta(quizId) {
        let quizModEditPage = await fetch(`https://moodle.calvin.edu/course/modedit.php?update=${quizId}`);
        // parse the HTML
        let quizModEditPageHTML = await quizModEditPage.text();
        let quizModEditPageDOM = new DOMParser().parseFromString(quizModEditPageHTML, 'text/html');
        let meta = {};
        // get grading method
        meta['gradingMethod'] = quizModEditPageDOM.querySelector('#id_grademethod').value;
        meta['gradingMethodText'] = quizModEditPageDOM.querySelector('#id_grademethod option[selected]').textContent;
        // get number of attempts allowed
        meta['attemptsAllowed'] = quizModEditPageDOM.querySelector('#id_attempts option[selected]').textContent;
        // get open time
        meta['openTime'] = getMoodleTimeWithEnabled(quizModEditPageDOM, 'timeopen');
        // get close time
        meta['closeTime'] = getMoodleTimeWithEnabled(quizModEditPageDOM, 'timeclose');
        // get time limit
        meta['timeLimit'] = {
            limit: quizModEditPageDOM.querySelector(`[name="timelimit[number]"]`).value,
            enabled: quizModEditPageDOM.querySelector(`[name="timelimit[enabled]"]`).value,
        };
        // get grade category
        meta['gradeCategory'] = quizModEditPageDOM.querySelector('#id_gradecat option[selected]').textContent;
        return meta;
    }
    */
})();
