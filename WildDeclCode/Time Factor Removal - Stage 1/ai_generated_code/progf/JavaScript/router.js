/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
var Router = require('express').Router;
var mongoose = require('mongoose');
var Thoughts = require('./controllers/thoughts_controller');
var deleteThoughtById = require('./controllers/thoughts_controller').deleteThoughtById;
var deleteAllThoughts = require('./controllers/thoughts_controller').deleteAllThoughts;
import {
  addUserFunFact, getCountryDetails, getCountryUserFacts, getCountryThoughts, getAllCountries,
  getThoughtCoordinates,
  getAllCountriesWithThoughts, getScratchDataForUser, saveScratchDataForUser, generateCountryData,
} from './controllers/country_controller';

var UserController = require('./controllers/user_controller');
var requireAuth = require('./services/passport').requireAuth;
var requireSignin = require('./services/passport').requireSignin;
var User = require('./models/user_model');
var getUserInfoById = require('./controllers/user_controller').getUserInfoById;

var router = Router();

router.get('/', function (req, res) {
  res.json({ message: 'Welcome to the Lost & Found API!' });
});

// Thought Routes

/**
 * Gets all thoughts.
 */
router.route('/thought')
  .get(async function (req, res) {
    try {
      var thoughts = await Thoughts.getAllThoughts();
      res.json(thoughts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

/**
   * Create a new thought for the authenticated user
   * Function Formed using common development resources
   */
router.route('/thought')
  .post(requireAuth, async function (req, res) {
    try {
      console.log('🔥 New Thought Request Received');
      console.log('🔑 Headers:', req.headers);
      console.log('📦 Request Body:', req.body);

      if (!req.user) {
        console.error('❌ ERROR: No user found in request');
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      console.log('✅ Authenticated user:', req.user);

      var user = await User.findById(req.user.id);
      console.log('🔍 Looking for user with ID:', req.user.id);

      if (!user) {
        console.error('❌ ERROR: User not found');
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.homeCountry) {
        console.error('⚠️ ERROR: User homeCountry is missing');
        return res.status(400).json({ error: 'User homeCountry is missing' });
      }

      console.log('🌍 User Home Country:', user.homeCountry);

      var newThought = await Thoughts.createThought({
        user, // Pass the user object here
        content: req.body.content,
        countryOriginated: user.homeCountry,
      });

      console.log('📝 New Thought Created:', newThought);

      user.thoughts.push(newThought._id);
      await user.save();

      console.log('✅ Thought successfully saved!');

      res.status(200).json({ message: 'Thought created successfully', thought: newThought });
    } catch (error) {
      console.error('🚨 Create thought error:', error);
      res.status(500).json({ error: "Create thought error: " + (error.message) + "" });
    }
  });

/**
 * Retrieve a specific thought by its ID.
 */
router.route('/thought/:id')
  .get(async function (req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ error: 'Thought not found' });
      }
      var thought = await Thoughts.getThought(req.params.id);
      if (!thought || !req.params.id) {
        return res.status(404).json({ error: 'Thought not found' });
      }
      res.json(thought);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

/**
 * Retrieve all thoughts associated with the authenticated user.
 */
router.get('/thought/user', requireAuth, async function (req, res) {
  try {
    var user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    var userThoughts = await Thoughts.getThoughtsByUser(user.id);

    if (!userThoughts || userThoughts.length === 0) {
      return res.status(404).json({ error: 'No thoughts found for this user' });
    }

    res.status(200).json(userThoughts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/countries/:countryName/thoughts', async function (req, res) {
  try {
    var countryName = req.params.countryName;
    var thoughts = await getCountryThoughts(countryName);
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 *  Unlock a country for the authenticated user.
 */
router.route('/countries/:countryName/unlock')
  .post(requireAuth, async function (req, res) {
    try {
      var countryName = req.params.countryName;
      var user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.unlockedCountries.includes(countryName)) {
        return res.status(400).json({ error: "" + (countryName) + " is already unlocked." });
      }

      user.unlockedCountries.push(countryName);
      await user.save();

      res.status(200).json({ message: "" + (countryName) + " unlocked successfully", unlockedCountries: user.unlockedCountries });
    } catch (error) {
      res.status(500).json({ error: "Server error: " + (error.message) + "" });
    }
  });

/**
 * Get all countries that have thoughts.
 */
router.route('/countries/with-thoughts')
  .get(async function (req, res) {
    try {
      var countries = await getAllCountriesWithThoughts();
      res.status(200).json({ message: 'Successfully retrieved countries with thoughts', countries });
    } catch (error) {
      res.status(500).json({ error: "" + (error.message) + "" });
    }
  });

/**
 * Get details about a specific country, if unlocked by the user.
 */
router.route('/countries/:countryName')
  .get(requireAuth, async function (req, res) {
    try {
      var countryName = req.params.countryName;
      var user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user || !user.unlockedCountries.includes(countryName)) {
        return res.status(403).json({ error: "Access denied. You must unlock " + (countryName) + " first." });
      }
      var countryDetail = await getCountryDetails(countryName);
      res.status(200).json({ message: "Successfully got details about " + (countryName) + "", country: countryDetail });
    } catch (error) {
      res.status(500).json({ error: "" + (error.message) + "" });
    }
  });

/**
 * Add a fun fact to a country if the user is from that country.
 * Not implemented
 */
router.route('/countries/:countryName/funfact')
  .post(requireAuth, async function (req, res) {
    try {
      var countryName = req.params.countryName;
      var user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.homeCountry !== countryName) {
        return res.status(403).json({ error: "Must be from " + (countryName) + "." });
      }

      var fact = req.body.fact;
      var updatedCountry = await addUserFunFact(countryName, fact);
      res.status(200).json({ message: "Successfully added new fact to " + (countryName) + "", country: updatedCountry });
    } catch (error) {
      res.status(400).json({ error: "" + (error.message) + "" });
    }
  });

/**
 * Retrieve all countries unlocked by the authenticated user.
 */
router.route('/countries/unlocked/:id')
  .get(requireAuth, async function (req, res) {
    try {
      var user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // const allUnlocked = await getUnlockedCountries();
      res.status(200).json({ message: 'Successfully retrieved unlocked countries', unlockedCountries: user.unlockedCountries });
    } catch (error) {
      res.status(500).json({ error: "" + (error.message) + "" });
    }
  });

/**
 *  Retrieve all thoughts related to a specific country.
 */
router.route('/countries/:countryName/thoughts')
  .get(requireAuth, async function (req, res) {
    try {
      var countryName = req.params.countryName;
      var user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user || !user.unlockedCountries.includes(countryName)) {
        return res.status(403).json({ error: "Access denied. You must unlock " + (countryName) + " first." });
      }

      var allThoughts = await getCountryThoughts(countryName);
      res.status(200).json({ message: 'Successfully retrieved all country thoughts', country: allThoughts });
    } catch (error) {
      res.status(500).json({ error: "" + (error.message) + "" });
    }
  });

/**
 * Retrieve thoughts of the authenticated user.
 */
router.get('/thoughts/my-thoughts', requireAuth, async function (req, res) {
  try {
    var userThoughts = await Thoughts.getThoughtsByUser(req.user);
    res.status(200).json(userThoughts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Retrieve all fun facts about a specific country.
 */
router.route('/countries/:countryName/funFacts')
  .get(requireAuth, async function (req, res) {
    try {
      var countryName = req.params.countryName;
      var user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user || !user.unlockedCountries.includes(countryName)) {
        return res.status(403).json({ error: "Access denied. You must unlock " + (countryName) + " first." });
      }

      var allFacts = await getCountryUserFacts(countryName);
      res.status(200).json({ message: 'Successfully retrieved all country facts', funFacts: allFacts });
    } catch (error) {
      res.status(500).json({ error: "" + (error.message) + "" });
    }
  });

/**
 * Retrieve a list of all countries in the system.
 */
router.route('/countries')
  .get(async function (req, res) {
    try {
      var allCountries = await getAllCountries();
      res.status(200).json({ message: 'Successfully retrieved all countries', countries: allCountries });
    } catch (error) {
      res.status(500).json({ error: "" + (error.message) + "" });
    }
  });

/**
 * Retrieve coordinates of thoughts related to a specific country.
 */
router.route('/countries/:countryName/thought-coordinates')
  .get(async function (req, res) {
    try {
      var countryName = req.params.countryName;
      var coordinates = await getThoughtCoordinates(countryName);
      res.status(200).json({ message: "Successfully retrieved thought coordinates for " + (countryName) + "", coordinates });
    } catch (error) {
      res.status(500).json({ error: "" + (error.message) + "" });
    }
  });

// Delete a single thought by ID
router.delete('/thought/:id', async function (req, res) {
  try {
    var id = req.params.id;
    var result = await deleteThoughtById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete ALL thoughts
router.delete('/thoughts/all', async function (req, res) {
  try {
    var result = await deleteAllThoughts();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
/**
 * Sign in a user and return an authentication token.
 */
router.post('/signin', requireSignin, async function (req, res) {
  try {
    var token = UserController.signin.token;
var id = UserController.signin.id;
var email = UserController.signin.email;
var homeCountry = UserController.signin.homeCountry;
var fullName = UserController.signin.fullName;(req.user);
    res.json({
      token, id, email, homeCountry, fullName,
    });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

/**
 * Register a new user and return an authentication token.
 */
router.post('/signup', async function (req, res) {
  try {
    var token = await.token;
var id = await.id;
var email = await.email;
var homeCountry = await.homeCountry;
var fullName = await.fullName;UserController.signup(req.body);
    res.json({
      token, id, email, homeCountry, fullName,
    });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

router.route('/countries/:countryName/scratch')
  .get(requireAuth, async function (req, res) {
    try {
      var countryName = req.params.countryName;
      // Use the authenticated user's id (req.user.id)
      var data = await getScratchDataForUser(req.user.id, countryName);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .post(requireAuth, async function (req, res) {
    try {
      var countryName = req.params.countryName;
      var scratchPath = req.body; // Expecting an object like { id, points: [...] }
      var savedPath = await saveScratchDataForUser(req.user.id, countryName, scratchPath);
      res.status(200).json({ message: 'Scratch data saved successfully', scratchPath: savedPath });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

/** ******* OpenAI Routes ********** */
// for a given country, generate an AI description and fun facts
router.post('/countries/:countryName/generate-data', requireAuth, generateCountryData);

// function to get user data to parse and put in a thought
router.get('/users/:id/info', async function (req, res) {
  try {
    var id = req.params.id;
    var userInfo = await getUserInfoById(id);
    res.status(200).json({ user: userInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
