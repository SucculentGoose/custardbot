const axios = require('axios');

class NetworkCalls {
  /**
   * Makes a request to fetch the Culvers locations at a given zipcode.
   * @param {string} zipcode - the zip code to use when looking up a list of locations
   * @param {boolean} wantAllLocations - whether to return all locations found
   * @returns {object[]}
   */
  async fetchAllCulversLocations(zipcode, wantAllLocations) {
    try {
      const response = await axios.get(`https://www.culvers.com/api/locate/address/json?address=${zipcode}`);
      const data = response.data;
      if (!data.Collection?.Locations) {
        return undefined;
      }
      if (!data.Collection.Locations.length) {
        return undefined;
      }
      if (!wantAllLocations) {
        return data.Collection.Locations[0];
      }
      return data.Collection.Locations;
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