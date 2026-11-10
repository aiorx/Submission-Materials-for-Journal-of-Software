// random usernames Assisted with basic coding tools
const usernames = [
    'socialjunkie42',
    'tweetmasterx',
    'instaexplorer19',
    'snapchatterpro',
    'likelover77',
    'tiktoktrendy2023',
    'shareninja365',
    'followerfanatic',
    'statusupdateguru',
    'snapstorysage',
    'hashtaghero23',
    'friendrequestking',
    'influencerwhiz',
    'connectcollector',
    'filterfreak88',
    'dmchampion2023',
    'selfiestarx',
    'trendingtopics21',
    'commentcrusader',
    'socialspheresleuth',
    'twittertornado',
    'iginnovator',
    'livestreamlegend',
    'chatconoisseur',
    'snapchatsavvy',
    'exploreeverything',
    'socialbutterfly101',
    'networknavigator',
    'shareablesensation',
    'viralvoyager22',
    'friendfinderpro',
    'memesmaestro',
    'storystylist365',
    'profileperfection',
    'viralvideovirtuoso',
    'livelifeliker',
    'dmdeity2023',
    'contentcreatorx',
    'trendtrackerpro',
    'sharablescribe',
];

// random emails Assisted with basic coding tools
const emails = [
    'john.doe123@example.com',
    'sarah.smith456@example.com',
    'mark.johnson789@example.com',
    'emily.wilson321@example.com',
    'michael.brown654@example.com',
    'linda.davis987@example.com',
    'robert.jackson234@example.com',
    'susan.taylor567@example.com',
    'william.martin432@example.com',
    'mary.jones890@example.com',
    'david.miller876@example.com',
    'jennifer.white123@example.com',
    'james.anderson678@example.com',
    'patricia.wilson345@example.com',
    'charles.thomas123@example.com',
    'lisa.roberts456@example.com',
    'richard.brown789@example.com',
    'betty.taylor987@example.com',
    'joseph.smith234@example.com',
    'elizabeth.johnson654@example.com',
    'thomas.wilson321@example.com',
    'margaret.jones456@example.com',
    'daniel.davis890@example.com',
    'dorothy.johnson234@example.com',
    'robert.anderson567@example.com',
    'nancy.martin321@example.com',
    'paul.roberts654@example.com',
    'carol.thomas987@example.com',
    'mark.smith123@example.com',
    'sandra.jones456@example.com',
    'william.miller789@example.com',
    'ashley.martin234@example.com',
    'patrick.anderson567@example.com',
    'jessica.taylor890@example.com',
    'steven.davis123@example.com',
    'deborah.brown456@example.com',
    'kenneth.anderson678@example.com',
    'donna.roberts890@example.com',
    'brian.martin234@example.com',
    'ruth.smith567@example.com',
];

// random thoughts Assisted with basic coding tools
const thoughts = [
    'The smell of freshly baked bread is so comforting.',
    'I should call my friend to see how they\'re doing.',
    'Nature is incredibly calming, especially by the water.',
    'Learning something new every day keeps life interesting.',
    'Kindness is a language that the deaf can hear and the blind can see.',
    'I\'m grateful for my health and the ability to enjoy life.',
    'A cup of tea can solve a lot of problems.',
    'Music has a unique power to uplift the spirit.',
    'I wonder what adventures await me in the future.',
    'Laughter is a universal language.',
    'The night sky is a reminder of the vastness of the universe.',
    'Acts of generosity can make a big difference in someone\'s life.',
    'The simple pleasure of a good book is hard to beat.',
    'Time spent with loved ones is never wasted.',
    'The world is full of fascinating cultures to explore.',
    'Helping others makes me feel fulfilled.',
    'Mistakes are opportunities to learn and grow.',
    'Sunsets are a daily reminder of beauty in the world.',
    'A smile can brighten someone\'s day.',
    'The scent of rain after a long dry spell is refreshing.',
    'We all have the power to create positive change.',
    'Cooking a homemade meal is a labor of love.',
    'Dreams have the potential to inspire and drive us forward.',
    'Animals have an incredible ability to sense emotions.',
    'Mindfulness can bring peace to any moment.',
    'Taking a deep breath can alleviate stress.',
    'The world is full of wonderful places to explore.',
    'Acts of kindness have a ripple effect in the world.',
    'Gratitude turns what we have into enough.',
    'A genuine compliment can make someone\'s day.',
];

// random reactions Assisted with basic coding tools
const reactions = [
    'That\'s awesome!',
    'I\'m so happy for you!',
    'Wow, I didn\'t expect that!',
    'You\'re doing great!',
    'Impressive!',
    'Congratulations!',
    'I\'m speechless!',
    'You deserve it!',
    'I\'m thrilled to hear that!',
    'Keep up the good work!',
    'That\'s incredible!',
    'I\'m proud of you!',
    'You\'re on fire!',
    'What a pleasant surprise!',
    'You\'re on the right track!',
    'You make it look easy!',
    'This is fantastic!',
    'Bravo!',
    'I\'m genuinely impressed!',
    'You nailed it!'
];

// const users = [];

// get a random item given an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// get random username 
const getRandomUsername = () => getRandomArrItem(usernames);

// get random email 
const getRandomEmail = () => getRandomArrItem(emails);

// function to generate random thoughts that we can add to the database
// includes reactions
const createRandomThoughts = (int) => {
  let results = [];
  for (let i = 0; i < int; i++) {
    results.push({
      thoughtText: getRandomArrItem(thoughts),
      username: getRandomUsername(),
      reactions: [...createReactions(3)],
    });
  }
  return results;
};

// create the reactions that will be added to each thought
const createReactions = (int) => {
    if (int === 1) {
        return getRandomArrItem(reactions);
      }
      const results = [];
      for (let i = 0; i < int; i++) {
        results.push({
          reactionBody: getRandomArrItem(reactions),
          username: getRandomUsername(),
        });
      }
      return results;
};

// export the functions for use in seed.js
module.exports = { getRandomUsername, createRandomThoughts, getRandomEmail };