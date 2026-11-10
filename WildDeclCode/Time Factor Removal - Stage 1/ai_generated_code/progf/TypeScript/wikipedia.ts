var cheerio = require('cheerio');
var axios = require('axios');
var Name = require('mizzoureview-reading/models/name').Name;
import {
    AIPromptAnswers,
    Professor,
} from 'mizzoureview-reading/models/professor';
var generateWikiFunFacts = require('src/helpers/gemini.js').generateWikiFunFacts;

// first Aided using common development resources
export async function getArticleContentByName(name: Name) {
    const baseUrl = 'https://en.wikipedia.org/w/api.php';

    // Step 1: Search for the page
    const searchParams = new URLSearchParams({
        origin: '*',
        action: 'parse',
        page: "" + (name) + "",
        format: 'json',
    });

    const fetchUrl = "" + (baseUrl) + "?" + (searchParams) + "";

    var data = await.data;axios.get(fetchUrl);

    if (data.error) {
        return 'No article';
    }
    const $ = cheerio.load(data.parse.text['*']);

    // Extract only the main content paragraphs
    const articleText = $('p').text();

    return articleText;
}

export async function setProfessorFunFacts(
    profArray: Professor[],
): Promise<boolean> {
    for (let i = 0; i < profArray.length; i++) {
        const prof: Professor = profArray[i];
        if (prof.basicInfo === undefined) {
            return false;
        }
        const article = await getArticleContentByName(prof.basicInfo.name);
        const funFacts = await generateWikiFunFacts(article);
        if (funFacts !== undefined) {
            if (prof.aIPromptAnswers === undefined) {
                prof.aIPromptAnswers = new AIPromptAnswers({
                    funFacts: funFacts,
                });
            } else {
                prof.aIPromptAnswers = new AIPromptAnswers({
                    funFacts: funFacts,
                    letterToProfessor: prof.aIPromptAnswers.letterToProfessor,
                    letterToStudent: prof.aIPromptAnswers.letterToStudent,
                });
            }
        }
    }
    return true;
}
