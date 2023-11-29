const axios = require('axios');

class NetworkCalls {

  getRestaurantUrl(location) {
    if (location?.metadata?.slug) {
      return `https://www.culvers.com/restaurants/${location?.metadata?.slug}`
    }
  }

  /**
   * Makes a request to fetch the Culvers locations at a given zipcode.
   * @param {string} zipcode - the zip code to use when looking up a list of locations
   * @param {boolean} wantAllLocations - whether to return all locations found
   * @returns {object[]}
   */
  async fetchAllCulversLocations(zipcode, wantAllLocations) {
    try {
      const response = await axios.get(`https://www.culvers.com/api/restaurants/getLocations?location=${zipcode}`);
      const data = response.data?.data;
      if (!data.geofences?.length) {
        return undefined;
      }
      if (!wantAllLocations) {
        return data.geofences[0];
      }
      return data.geofences;
    } catch (ex) {
      console.error(`An error occurred: ${ex.message}`);
      return undefined;
    }
  }
  
  /**
   * Returns the first Culvers location that is found when looking up by the provided zipcode.
   * @param {string} zipcode - the zip code to use when looking up a list of locations
   * @returns {object}
   */
  async fetchSingleCulversLocation(zipcode) {
    return await this.fetchAllCulversLocations(zipcode, false);
  }
}

module.exports = new NetworkCalls();