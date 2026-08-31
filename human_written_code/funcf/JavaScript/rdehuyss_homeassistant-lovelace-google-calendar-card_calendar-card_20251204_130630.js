async getAllUrls(urls) {
  try {
    var data = await Promise.all(
      urls.map(
        url => this._hass.callApi('get', url)));
    return (data);
  } catch (error) {
    throw (error);
  }
}