import { fitbitCfg } from "../common/constants";
import api from "../api/api";
import { toastTypes } from "../common/constants";

const { storeAccessTokens, getAccessTokens } = api;

/**
 * Creates an URL that redirects to the Fitbit OAuth2.0 page
 * @param {() => void} setToast
 * @returns {string | void}
 */
export const redirectToAuth = (setToast) => {
  try {
    const authUrl = `${fitbitCfg.authUri}?response_type=token&client_id=${fitbitCfg.client}&scope=${fitbitCfg.scopes.join("+")}&redirect_uri=${encodeURIComponent(fitbitCfg.redirectUrl)}&expires_in=604800`;

    return authUrl;
  } catch (error) {
    setToast({ type: toastTypes.ERROR, message: "Can't generate authorization URL" });
  }
};

/**
 * Handles the redirect from the Fitbit OAuth2.0 page
 * @param {Realm.App} app
 * @param {() => void} setToast
 */
export const handleRedirect = async (app, setToast) => {
  try {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const expiresIn = params.get("expires_in");
      const tokenType = params.get("token_type");
      const userId = params.get("user_id");

      if (accessToken) {
        await storeAccessTokens(app, { accessToken, expiresIn, tokenType, userId });
        setToast({ type: toastTypes.SUCCESS, message: "Authorization successful" });
      } else {
        setToast({ type: toastTypes.ERROR, message: "Authorization failed" });
      }
    } else {
      setToast({ type: toastTypes.ERROR, message: "No authorization token found" });
    }
  } catch (error) {
    setToast({ type: toastTypes.ERROR, message: "Error handling authorization redirect" });
  }
};

//  Aided using common development resources

// Helper function to fetch data from Fitbit API
const fetchFitbitData = async (app, url, setToast) => {
  try {
    const tokenData = await getAccessTokens(app);
    const { accessToken, userId, tokenType } = tokenData;

    const response = await fetch(url.replace("{userId}", userId), {
      method: "GET",
      headers: {
        "Authorization": `${tokenType} ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      setToast({ type: toastTypes.ERROR, message: `Error: ${errorData.errors[0].message}` });
      return null;
    }
  } catch (error) {
    setToast({ type: toastTypes.ERROR, message: `Fetch error: ${error.message}` });
    return null;
  }
};

// Function to fetch user's steps data
export const fetchStepsData = async (app, setToast) => {
  const url = "https://api.fitbit.com/1/user/{userId}/activities/steps/date/today/1d.json";
  return await fetchFitbitData(app, url, setToast);
};

// Function to fetch user's steps data
export const fetchDistanceData = async (app, setToast) => {
  const url = "https://api.fitbit.com/1/user/{userId}/activities/distance/date/today/1d.json";
  return await fetchFitbitData(app, url, setToast);
};

export const fetchCaloriesData = async (app, setToast) => {
  const url = "https://api.fitbit.com/1/user/{userId}/activities/calories/date/today/1d.json";
  return await fetchFitbitData(app, url, setToast);
}
