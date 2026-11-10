```js
constructor() 
{
    // Psychobabble taken from the python code from the lecture and converted to javascript.
    // Extra sychobabble Supported via standard programming aids
    // https://chatgpt.com/share/67517e83-0d7c-800d-bbb1-424268efd977
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
    this.responses = {
        'hello|hi|hey': [
            "Hello! How are you feeling today?",
            "Hi there! What’s on your mind?",
            "Hey! How can I help you?"
        ],
        'you remind me of (.*)': [
            "Why do you think I remind you of $1?",
            "What makes you think of $1 when talking to me?",
            "Is it a good feeling to be reminded of $1?"
        ],
        '(.*) mother|father|family|parent(.*)': [
            "Tell me more about your family.",
            "How does that make you feel about your family?",
            "What role does your family play in your thoughts?",
            "Do you feel connected to your family?",
            "What did you learn from your family growing up?"
        ],
        'I need (.*)': [
            "Why do you need $1?",
            "Would getting $1 really help you?",
            "What if you didn’t need $1?",
            "Is $1 something you feel you can't live without?",
            "What happens if you don’t get $1?"
        ],
        'I feel (.*)': [
            "Why do you feel $1?",
            "Does feeling $1 happen often?",
            "How does that feeling affect you?",
            "What triggered this feeling in you?",
            "What would make you feel differently?"
        ],
        'I am (.*)': [
            "Why do you think you are $1?",
            "How long have you felt that way?",
            "What made you feel like $1?",
            "Do you feel that way often?",
            "How would you like to feel instead?"
        ],
        '(.*) sorry|apologize(.*)': [
            "No need to apologize.",
            "Apologies aren't necessary. Why do you feel that way?",
            "It’s okay to feel that way.",
            "What makes you feel like you need to apologize?",
            "Is there something you want to make right?"
        ],
        'bye|goodbye|exit': [
            "Goodbye! Take care.",
            "Thank you for sharing. Goodbye!",
            "Bye! I’m here if you need to talk again.",
            "Take care, and don't hesitate to reach out if you need support.",
            "Goodbye! Wishing you all the best."
        ],
        '(.*) (love|hate)(.*)': [
            "What makes you feel $1?",
            "Why do you feel $1 about that?",
            "How does $1 make you feel?",
            "Tell me more about why you feel $1.",
            "What would change if you felt differently about $1?"
        ],
        '(.*) work|job|career(.*)': [
            "How do you feel about your job?",
            "What part of your work brings you the most satisfaction?",
            "What would you like to change about your career?",
            "How does your work affect your mood?",
            "Is there something you’d like to achieve in your career?"
        ],
        '(.*) friend|friends(.*)': [
            "Tell me more about your friendships.",
            "What do you value most in a friend?",
            "How do your friends support you?",
            "Do you feel close to your friends?",
            "What qualities do you appreciate in your friends?"
        ],
        '(happy|sad|angry)(.*)': [
            "What do you think makes you feel $1?",
            "Can you think of a time when you felt $1?",
            "Does feeling $1 happen often for you?",
            "What does $1 look like for you?",
            "What would help you feel less $1?"
        ],
        '(.*) (problem|issue|difficulty)(.*)': [
            "What seems to be the issue?",
            "Can you explain more about the problem you're facing?",
            "What makes this a challenge for you?",
            "How do you usually deal with difficulties like this?",
            "What would help solve this problem for you?"
        ],
        '(.*) (scared|fear)(.*)': [
            "What do you think you're afraid of?",
            "Can you think of why you might be feeling scared?",
            "What helps you cope with fear?",
            "How do you usually face your fears?",
            "What would make you feel less fearful?"
        ],
        '(.*) (stress|stressed)(.*)': [
            "What’s been stressing you out lately?",
            "What makes you feel stressed?",
            "How do you typically manage stress?",
            "What do you think helps reduce your stress?",
            "Would you like to talk more about your stress?"
        ],
        '(.*) (relationship|partner)(.*)': [
            "Tell me more about your relationship.",
            "What do you value most in a partner?",
            "How do you feel in your current relationship?",
            "What do you wish could change in your relationship?",
            "What brings you joy in your relationship?"
        ],
        '(.*) (future|plan|goal)(.*)': [
            "What are your hopes for the future?",
            "What are you planning to achieve next?",
            "How do you see yourself in the future?",
            "What goals do you want to focus on?",
            "What steps are you taking toward your goals?"
        ],
        '(.*) (success|failure)(.*)': [
            "What does success look like to you?",
            "How do you define failure?",
            "What is your idea of success?",
            "What can you learn from failure?",
            "What would success feel like for you?"
        ],
        '(.*) (trust|betrayal)(.*)': [
            "What does trust mean to you?",
            "Have you been betrayed in the past?",
            "What makes you trust someone?",
            "How do you rebuild trust after betrayal?",
            "What does betrayal feel like for you?"
        ],
        '(.*) (change|growth)(.*)': [
            "What changes are you experiencing right now?",
            "What does growth mean to you?",
            "How do you handle change in your life?",
            "What would growth look like for you?",
            "Do you feel ready for change?"
        ],
        '(.*) (hope|despair)(.*)': [
            "What gives you hope?",
            "What causes you to feel despair?",
            "How do you keep hope alive?",
            "When you feel despair, what helps you feel better?",
            "What would make you feel more hopeful?"
        ],
        '(.*) (fear of (.*))': [
            "What are you afraid of when it comes to $2?",
            "Why do you fear $2?",
            "How does this fear affect you?",
            "What would help you overcome your fear of $2?"
        ],
        '(.*)': [
            "Can you tell me more?",
            "Why do you say that?",
            "How does that make you feel?",
            "What do you mean by that?",
            "Interesting... go on.",
            "Could you explain that a bit further?",
            "What are you hoping for in this conversation?"
        ]
    };
    
    this.reflections = {
        "I": "you",
        "me": "you",
        "my": "your",
        "am": "are",
        "you": "I",
        "your": "my",
        "yours": "mine",
        "are": "am",
        "was": "were",
        "will": "shall",
        "have": "had",
        "is": "are"
    };
    
}
```