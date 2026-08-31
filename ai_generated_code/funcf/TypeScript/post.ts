function blogArticle_2024_08_06(): VElement[] {
    return [
        h('section', {},
            h('h2', {}, 'The MIP strategy'),
            h('p', {},
                'LLMs are incredible tools.  Like all tools, though, getting good results requires us to use ' +
                'them in the right way.  The idea behind Maximal Instruction Prompting (MIP) is to provide a more effective ' +
                'way to use LLMs for software development.'
            ),
            h('p', {},
                'The MIP strategy comes from observing problems using LLMs in software development.  Most ' +
                'developers use LLMs to accelerate coding tasks, but we should be able to do far more.'
            ),
            h('section', {},
                h('h3', {}, 'Summary of MIP'),
                h('p', {},
                    'MIP is an approach for capturing detailed natural language requirements to let an LLM build matching ' +
                    'software source code.'
                ),
                h('p', {},
                    'These are the core ideas:'
                ),
                h('ul', {},
                    h('li', {},
                        'Describe all the requirements that our software must meet.'
                    ),
                    h('li', {},
                        'Capture inputs from all perspectives.'
                    ),
                    h('li', {},
                        'Describe all requirements comprehensively, and exactly once.'
                    ),
                    h('li', {},
                        'Use examples that clarify requirements.'
                    )
                ),
                h('p', {},
                    'None of these are new but we can combine them to great effect.'
                )
            ),
            h('section', {},
                h('h3', {}, 'Advantages of MIP'),
                h('p', {},
                    'For MIP to be valuable, it must offer significant practical advantages over any alternatives.  As a couple ' +
                    'of my more commercially minded friends might say, "Show us the money!"'
                ),
                h('p', {},
                    'Here are some advantages:'
                ),
                h('ul', {},
                    h('li', {},
                        'MIP describes the software\'s functionality rather than how we\'d like to evolve it.  This ' +
                        'makes it easy for an LLM and a human design team to ' +
                        'understand.  Most software development methodologies focus on evolution and any resulting software ' +
                        'rapidly becomes defined by the implementation rather than the intended design.'
                    ),
                    h('li', {}, 
                        'It focuses on clarity so an LLM can generate software that meets those requirements.'
                    ),
                    h('li', {},
                        'It makes it easy to try out new ideas and variations.  Even small changes in ' +
                        'requirements might lead to significant changes in implementation, but the MIP approach allows ' +
                        'an LLM to make these sorts of changes quickly and cheaply.'
                    ),
                    h('li', {},
                        'An LLM can leverage a MIP description to help create tests and ' +
                        'user documentation.  [Aside: both of these are areas I will be looking into over the coming months]'
                    ),
                    h('li', {},
                        'Automated building of software makes it easy to change technologies and ' +
                        'implementations.  For example, we might prototype in one language and then create a production ' +
                        'implementation in another!'
                    ),
                    h('li', {},
                        'We can build more robust systems because MIP makes building multiple versions of the same software ' +
                        'inexpensive.  For example, we could imagine building various versions of some library function to ' +
                        'prevent downstream developers from inadvertently using unintended implementation details.'
                    )
                )
            ),
            h('section', {},
                h('h3', {}, 'Limitations of MIP'),
                h('p', {},
                    'MIP cannot solve all the problems with LLMs but does provide some mitigations:'
                ),
                h('ul', {},
                    h('li', {},
                        'LLMs intentionally create random and surprising outputs at times.  This probabilistic approach is a ' +
                        'strength in many instances but also causes LLMs to hallucinate.  If these occur in the wrong place, ' +
                        'we might get faulty software.  MIP makes it easy for us to build different software implementations ' +
                        'should this happen, and discarding broken versions is inexpensive.  So, while MIP doesn\'t eliminate ' +
                        'the problem of LLMs hallucinating, it can reduce the impact.'
                    ),
                    h('li', {},
                        'Even when given clear and specific instructions, an LLM will often ignore some.  We can mitigate ' +
                        'this by walking through the explicit requirements to ask the LLM to demonstrate how it met each ' +
                        'one.  We must solve this with an iterative dialogue, but the LLM can rapidly correct its mistakes.'
                    ),
                    h('li', {},
                        'This approach does not eliminate the need for a dialogue with the LLM but advances ' +
                        'the conversation quickly while maintaining a clear focus on an outcome.'
                    ),
                    h('li', {},
                        'Any prompt\'s complexity has the same limits as dialogue-based approaches.  LLMs have a ' +
                        'limited context window, so this approach only works if we can keep our working data set inside ' +
                        'that.  The approach described can still work for larger software designs, but we must break ' +
                        'this into smaller components and build each separately.'
                    )
                )
            )
        ),
        h('section', {},
            h('h2', {}, 'MIP in detail'),
            h('section', {},
                h('h3', {}, 'Describe all the requirements'),
                h('p', {},
                    'Like most tools, LLMs are inherently passive, doing nothing until we set them into action.  When we wish ' +
                    'to use them to help us build software, a designer uses prompts to guide the LLM on what they want to see.'
                ),
                h('p', {},
                    'For example, in "',
                    h('a', {href: '/blog/2024-07-15', onclick: (e: MouseEvent) => navigateEvent(e, '/blog/2024-07-15')},
                        'Can my tools build tools?  Pre-rendering web pages with help from ChatGPT'
                    ),
                    '", I used an interactive approach to build new software far faster than I would have done ' +
                    'previously.  I\'ve used this approach to develop the core of several other software components, including ' +
                    'the syntax highlighting engine used in both that and this article.'
                ),
                h('p', {},
                    'While interactive engagement with LLMs is one of their greatest strengths, it has a dark side.  ' +
                    'LLMs excel at holding conversations, and we can be seduced into spending hours ' +
                    'discussing minor details while ignoring substantive issues that might render those other conversations ' +
                    'irrelevant (bikeshedding-as-a-service).  While a human counterpart might attempt to pull the ' +
                    'discussion back on track, an LLM will not.'
                ),
                h('p', {},
                    'A human might also ask questions during a conversation to better understand some ' +
                    'task, but an LLM will only do this if asked.  Ambiguity offers an LLM yet more scope to descend into ' +
                    'hallucinatory rabbit holes as it tries to fill any void with creative, irrelevant, or plain wrong ' +
                    'content.'
                ),
                h('p', {},
                    '"LLMs are useless", we might cry.  Still, we know that once we have ' +
                    'two or more people working on a software design, we must plan to collaborate.  Our ' +
                    'team must maintain a clear and shared view of what they will build.  With an LLM, we must recognize that ' +
                    'we always have at least two team members.'
                ),
                h('p', {},
                    'As with an all-human team, we can maintain alignment by crafting a long-form description of our ' +
                    'goals.  The same works with an LLM.  We can present detailed written requirements to the LLM, giving ' +
                    'it a clearer picture of what we want it to achieve.'
                )
            ),
            h('section', {},
                h('h3', {}, 'Capture inputs from all perspectives'),
                h('p', {}, 
                    'In conventional software development, we recognize the value of many different skills and perspectives.  ' +
                    'We require product definition and vision aligned with commercial goals.  We need developers who are ' +
                    'experts in all relevant technologies.  We need to plan for testing.  We may need experts in UX and UI, ' +
                    'security, operational deployment, etc.  Each role can provide more details about what we\'re ' +
                    'looking to build.'
                ),
                h('p', {},
                    'With an LLM, we\'re looking to outsource the implementation of some or all of these elements, so we need ' +
                    'to give our LLM a clear understanding of each one.  Even if we want the LLM to focus solely on the coding ' +
                    'aspect of software development, our LLM must understand these other motivations.'
                ),
                h('p', {},
                    'Consider a testability requirement, for instance.  We might emphasize the need for our software to ' +
                    'support 90%+ automated test coverage.  This requirement could lead to an implementation that allows for ' +
                    'easier mocking.  We must explicitly state this to avoid our LLM taking a different approach.  ' +
                    'Similarly, providing examples of specific user journeys or behavioural requirements can guide the LLM ' +
                    'towards unique and innovative solutions.'
                ),
                h('p', {},
                    'It is worth noting that even though our LLM may do most of the coding, we still need considerable ' +
                    'software engineering expertise.  In addition to providing an expert review of an LLM\'s output, we ' +
                    'must capture important technology choices and implementation strategies as requirements.'
                )
            ),
            h('section', {},
                h('h3', {}, 'Describe all requirements comprehensively, and exactly once'),
                h('p', {},
                    'A significant cause of confusion and error within human software development teams is a misalignment ' +
                    'of expectations about how software should work.  Often, this arises from requirements ' +
                    'that overlap, are ambiguous, or, even worse, are contradictory.'
                ),
                h('p', {},
                    'If such things confuse humans, we can expect them to confuse LLMs too.  Unlike humans, however, LLMs ' +
                    'won\'t tell us they\'re confused.  Instead, they\'ll do unexpected things.  To address this, ' +
                    'we can take inspiration from Barbara Minto\'s MECE (mutually exclusive, collectively ' +
                    'exhaustive) principle.'
                ),
                h('p', {},
                    'Given a list of requirements, MECE aims to drive out ambiguity and contradiction:'
                ),
                h('ul', {},
                    h('li', {},
                        h('em', {},
                            'Mutually exclusive'
                        ),
                        ': the list\'s members should exclude each other, i.e. be distinct from each other.'
                    ),
                    h('li', {},
                        h('em', {},
                            'Collectively exhaustive'
                        ),
                        ': the list\'s members should exhaust the relevant field, i.e. contain everything that belongs on ' +
                        'the list.'
                    )
                ),
                h('p', {},
                    'By carefully enumerating requirements, we give our LLM clarity and make it ' +
                    'far easier for our human designers to understand the details of the software they\'re shaping.'
                )
            ),
            h('section', {},
                h('h3', {}, 'Use examples that clarify requirements'),
                h('p', {},
                    'A conventional approach in software product development is to provide "acceptance criteria".  ' +
                    'These are specific examples of how the completed software should behave.  Such examples allow developers ' +
                    'and testers to check their understanding of how the finished software should operate.'
                ),
                h('p', {},
                    'These examples do not replace the requirements but clarify them.'
                ),
                h('p', {},
                    'This approach also works for LLMs.  By providing examples of use, an LLM can more readily verify ' +
                    'that any software it produces meets the expectation of whoever provided the prompt.'
                )
            ),
        ),
        h('section', {},
            h('h2', {}, 'A practical example'),
            h('p', {},
                'Let\'s look at an example.'
            ),
            h('p', {},
                'In "',
                h('a', {href: '/blog/2024-07-15', onclick: (e: MouseEvent) => navigateEvent(e, '/blog/2024-07-15')},
                    'Can my tools build tools?'
                ),
                '", I posed the problem of building a pre-rendering application.  Let\'s expand that into a complete ' +
                'application called "siterender" and define a richer set of features than the original:'
            ),
            h('ul', {},
                h('li', {}, 'Fetches and parses sitemaps from URLs or local files.'),
                h('li', {}, 'Supports sitemaps and sitemap indexes (nested sitemaps).'),
                h('li', {}, 'Replaces URL prefixes based on specified rules.'),
                h('li', {}, 'Renders pages in parallel using Puppeteer.'),
                h('li', {}, 'Parallelizes rendering operations for maximum speed/throughput.'),
                h('li', {}, 'Saves rendered HTML content to a specified output directory.'),
                h('li', {}, 'Retry mechanism for rendering and browser launch/close operations.')
            ),
            h('p', {},
                'We expand these requirements to cover all aspects of how we expect the application to ' +
                'behave.  We then try to group them, provide an exhaustive list, and work to ensure they don\'t contradict ' +
                'each other.'
            ),
            h('section', {},
                h('h3', {}, 'The prompt'),
                h('p', {},
                    'The MIP-style prompt is 77 lines, but some are long.  I plan to improve from this text format, but it ' +
                    'works for now.'
                ),
                h('p', {},
                    'I divided the prompt into sections, each with a distinct set of requirements that ' +
                    'describe our desired application behaviour.  I iterated this prompt from a much earlier form ' +
                    'and had ChatGPT 4o help reformat it and suggest improvements to remove ambiguity or overlaps.'
                ),
                h('p', {},
                    'I used earlier versions of the prompt to build fully working implementations, but this is the first ' +
                    'version directly targeting TypeScript.  Most earlier implementations used JavaScript, ' +
                    'but I had ChatGPT build one using Python. The Python version was 20% slower, however!'
                ),
                // Replaced ~40 lines of boilerplate with 4 lines!
                CodeFragment.create({
                    file: '/blog/2024-08-06/prompt.txt',
                    language: 'Text',
                    caption: 'The MIP-style prompt for siterender'
                })
            ),
            h('section', {},
                h('h3', {}, 'The implementation'),
                h('p', {},
                    'The output ',
                    h('a', {href: '#the-code', onclick: (e: MouseEvent) => navigateEvent(e, '/blog/2024-08-06#the-code')},
                        'TypeScript source code'
                    ),
                    ' appears at the end of this article.  It consists of over 300 lines of code split across two files.'
                ),
                h('p', {},
                    'As noted in the section on limitations, ChatGPT didn\'t produce a working version of this software the ' +
                    'first time but did so with one of the earlier JavaScript editions.  To mitigate this, I asked ' +
                    'how it implemented each feature in an interactive dialogue.  Where necessary, it ' +
                    'changed its implementation to conform with the requirements.'
                ),
                h('p', {},
                    'The total interactive time required to reach the published output was around 90 minutes, which included ' +
                    'about 30 minutes of testing.  I evolved this version of the prompt over a few weeks.  While not part of ' +
                    'the prompt provided here, a further interactive session lasting 3 hours resulted in a test program that ' +
                    'provides > 90% test coverage for the ',
                    h('code', {}, 'logic.ts'),
                    ' file, including test error handling and retry logic.  A future version of the prompt will be updated to ' +
                    'include that testability requirement.  During the 3 hours, the approach was to "pair program" with the ' +
                    'LLM, letting it have the keyboard.'
                ),
                h('p', {},
                    'The general quality of the code is high.  I\'m not too fond of the use of a global variable for the XML ' +
                    'parser in ',
                    h('code', {}, 'logic.ts'),
                    ', but we can refine this later.  The implementation is robust and testable.  If we disconnect the network, ' +
                    'the retry logic keeps going and will recover if the network comes back up.  Similarly, if we set the number ' +
                    'of parallel rendering tasks to 8x the number of CPUs, we see a lot of timeouts and retries as Chrome ' +
                    'can\'t keep up, but the application completes its task quickly.'
                )
            ),
            h('section', {},
                h('h3', {}, 'Project site'),
                h('p', {},
                    'I decided to make the siterender application a distinct project so you can follow and help shape its ' +
                    'evolution.'
                ),
                h('p', {},
                    'The project site for siterender is here: ',
                    h('a', {href: '/projects/siterender', onclick: (e: MouseEvent) => navigateEvent(e, '/projects/siterender')},
                        'siterender'
                    ),
                    '.  The site has links to the source code and notes about how to contribute if you\'re interested.'
                ),
            ),
        ),
        h('section', {},
            h('h2', {}, 'Conclusion'),
            h('p', {},
                'I\'ve introduced the concept of a Maximal Instruction Prompt (MIP) and explained how I\'ve been