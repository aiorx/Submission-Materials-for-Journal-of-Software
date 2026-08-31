/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
import { Router } from 'express';
import mongoose from 'mongoose';
import * as Thoughts from './controllers/thoughts_controller';
import { deleteThoughtById, deleteAllThoughts } from './controllers/thoughts_controller';
import {
  addUserFunFact, getCountryDetails, getCountryUserFacts, getCountryThoughts, getAllCountries,
  getThoughtCoordinates,
  getAllCountriesWithThoughts, getScratchDataForUser, saveScratchDataForUser, generateCountryData,
} from './controllers/country_controller';

import * as UserController from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';
import User from './models/user_model';
import { getUserInfoById } from './controllers/user_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Lost & Found API!' });
});

// Thought Routes

/**
 * Gets all thoughts.
 */
router.route('/thought')
  .get(async (req, res) => {
    try {
      const thoughts = await Thoughts.getAllThoughts();
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
  .post(requireAuth, async (req, res) => {
    try {
      console.log('🔥 New Thought Request Received');
      console.log('🔑 Headers:', req.headers);
      console.log('📦 Request Body:', req.body);

      if (!req.user) {
        console.error('❌ ERROR: No user found in request');
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      }

      console.log('✅ Authenticated user:', req.user);

      const user = await User.findById(req.user.id);
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

      const newThought = await Thoughts.createThought({
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
      res.status(500).json({ error: `Create thought error: ${error.message}` });
    }
  });

/**
 * Retrieve a specific thought by its ID.
 */
router.route('/thought/:id')
  .get(async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ error: 'Thought not found' });
      }
      const thought = await Thoughts.getThought(req.params.id);
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
router.get('/thought/user', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userThoughts = await Thoughts.getThoughtsByUser(user.id);

    if (!userThoughts || userThoughts.length === 0) {
      return res.status(404).json({ error: 'No thoughts found for this user' });
    }

    res.status(200).json(userThoughts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/countries/:countryName/thoughts', async (req, res) => {
  try {
    const { countryName } = req.params;
    const thoughts = await getCountryThoughts(countryName);
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 *  Unlock a country for the authenticated user.
 */
router.route('/countries/:countryName/unlock')
  .post(requireAuth, async (req, res) => {
    try {
      const { countryName } = req.params;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.unlockedCountries.includes(countryName)) {
        return res.status(400).json({ error: `${countryName} is already unlocked.` });
      }

      user.unlockedCountries.push(countryName);
      await user.save();

      res.status(200).json({ message: `${countryName} unlocked successfully`, unlockedCountries: user.unlockedCountries });
    } catch (error) {
      res.status(500).json({ error: `Server error: ${error.message}` });
    }
  });

/**
 * Get all countries that have thoughts.
 */
router.route('/countries/with-thoughts')
  .get(async (req, res) => {
    try {
      const countries = await getAllCountriesWithThoughts();
      res.status(200).json({ message: 'Successfully retrieved countries with thoughts', countries });
    } catch (error) {
      res.status(500).json({ error: `${error.message}` });
    }
  });

/**
 * Get details about a specific country, if unlocked by the user.
 */
router.route('/countries/:countryName')
  .get(requireAuth, async (req, res) => {
    try {
      const { countryName } = req.params;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user || !user.unlockedCountries.includes(countryName)) {
        return res.status(403).json({ error: `Access denied. You must unlock ${countryName} first.` });
      }
      const countryDetail = await getCountryDetails(countryName);
      res.status(200).json({ message: `Successfully got details about ${countryName}`, country: countryDetail });
    } catch (error) {
      res.status(500).json({ error: `${error.message}` });
    }
  });

/**
 * Add a fun fact to a country if the user is from that country.
 * Not implemented
 */
router.route('/countries/:countryName/funfact')
  .post(requireAuth, async (req, res) => {
    try {
      const { countryName } = req.params;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.homeCountry !== countryName) {
        return res.status(403).json({ error: `Must be from ${countryName}.` });
      }

      const { fact } = req.body;
      const updatedCountry = await addUserFunFact(countryName, fact);
      res.status(200).json({ message: `Successfully added new fact to ${countryName}`, country: updatedCountry });
    } catch (error) {
      res.status(400).json({ error: `${error.message}` });
    }
  });

/**
 * Retrieve all countries unlocked by the authenticated user.
 */
router.route('/countries/unlocked/:id')
  .get(requireAuth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // const allUnlocked = await getUnlockedCountries();
      res.status(200).json({ message: 'Successfully retrieved unlocked countries', unlockedCountries: user.unlockedCountries });
    } catch (error) {
      res.status(500).json({ error: `${error.message}` });
    }
  });

/**
 *  Retrieve all thoughts related to a specific country.
 */
router.route('/countries/:countryName/thoughts')
  .get(requireAuth, async (req, res) => {
    try {
      const { countryName } = req.params;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user || !user.unlockedCountries.includes(countryName)) {
        return res.status(403).json({ error: `Access denied. You must unlock ${countryName} first.` });
      }

      const allThoughts = await getCountryThoughts(countryName);
      res.status(200).json({ message: 'Successfully retrieved all country thoughts', country: allThoughts });
    } catch (error) {
      res.status(500).json({ error: `${error.message}` });
    }
  });

/**
 * Retrieve thoughts of the authenticated user.
 */
router.get('/thoughts/my-thoughts', requireAuth, async (req, res) => {
  try {
    const userThoughts = await Thoughts.getThoughtsByUser(req.user);
    res.status(200).json(userThoughts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Retrieve all fun facts about a specific country.
 */
router.route('/countries/:countryName/funFacts')
  .get(requireAuth, async (req, res) => {
    try {
      const { countryName } = req.params;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user || !user.unlockedCountries.includes(countryName)) {
        return res.status(403).json({ error: `Access denied. You must unlock ${countryName} first.` });
      }

      const allFacts = await getCountryUserFacts(countryName);
      res.status(200).json({ message: 'Successfully retrieved all country facts', funFacts: allFacts });
    } catch (error) {
      res.status(500).json({ error: `${error.message}` });
    }
  });

/**
 * Retrieve a list of all countries in the system.
 */
router.route('/countries')
  .get(async (req, res) => {
    try {
      const allCountries = await getAllCountries();
      res.status(200).json({ message: 'Successfully retrieved all countries', countries: allCountries });
    } catch (error) {
      res.status(500).json({ error: `${error.message}` });
    }
  });

/**
 * Retrieve coordinates of thoughts related to a specific country.
 */
router.route('/countries/:countryName/thought-coordinates')
  .get(async (req, res) => {
    try {
      const { countryName } = req.params;
      const coordinates = await getThoughtCoordinates(countryName);
      res.status(200).json({ message: `Successfully retrieved thought coordinates for ${countryName}`, coordinates });
    } catch (error) {
      res.status(500).json({ error: `${error.message}` });
    }
  });

// Delete a single thought by ID
router.delete('/thought/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteThoughtById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete ALL thoughts
router.delete('/thoughts/all', async (req, res) => {
  try {
    const result = await deleteAllThoughts();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
/**
 * Sign in a user and return an authentication token.
 */
router.post('/signin', requireSignin, async (req, res) => {
  try {
    const {
      token, id, email, homeCountry, fullName,
    } = UserController.signin(req.user);
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
router.post('/signup', async (req, res) => {
  try {
    const {
      token, id, email, homeCountry, fullName,
    } = await UserController.signup(req.body);
    res.json({
      token, id, email, homeCountry, fullName,
    });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

router.route('/countries/:countryName/scratch')
  .get(requireAuth, async (req, res) => {
    try {
      const { countryName } = req.params;
      // Use the authenticated user's id (req.user.id)
      const data = await getScratchDataForUser(req.user.id, countryName);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .post(requireAuth, async (req, res) => {
    try {
      const { countryName } = req.params;
      const scratchPath = req.body; // Expecting an object like { id, points: [...] }
      const savedPath = await saveScratchDataForUser(req.user.id, countryName, scratchPath);
      res.status(200).json({ message: 'Scratch data saved successfully', scratchPath: savedPath });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

/** ******* OpenAI Routes ********** */
// for a given country, generate an AI description and fun facts
router.post('/countries/:countryName/generate-data', requireAuth, generateCountryData);

// function to get user data to parse and put in a thought
router.get('/users/:id/info', async (req, res) => {
  try {
    const { id } = req.params;
    const userInfo = await getUserInfoById(id);
    res.status(200).json({ user: userInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
