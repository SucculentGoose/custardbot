import { CulversLocation } from "../models/CulversLocation";

import axios from "axios";

class NetworkCalls {
  /**
   * Makes a request to fetch the Culvers locations at a given zipcode.
   * @param {string} zipcode - the zip code to use when looking up a list of locations
   * @param {boolean} wantAllLocations - whether to return all locations found
   * @returns {Promise<CulversLocation[]>}
   */
  async fetchAllCulversLocations(
    zipcode: string,
    wantAllLocations: boolean,
  ): Promise<CulversLocation[]> {
    try {
      const response = await axios.get(
        `https://www.culvers.com/api/locator/getLocations?location=${zipcode}`,
      );
      const data = response.data?.data;
      if (!data?.geofences?.length) {
        return undefined;
      }
      if (!wantAllLocations) {
        return [new CulversLocation(data.geofences[0].metadata)];
      }
      return data.geofences.map(
        (location) => new CulversLocation(location.metadata),
      );
    } catch (ex) {
      console.error(`An error occurred: ${ex.message}`);
      return undefined;
    }
  }

  /**
   * Returns the first Culvers location that is found when looking up by the provided zipcode.
   * @param {string} zipcode - the zip code to use when looking up a list of locations
   * @returns {Promise<CulversLocation>}
   */
  public async fetchSingleCulversLocation(
    zipcode: string,
  ): Promise<CulversLocation> {
    const locations = await this.fetchAllCulversLocations(zipcode, false);
    if (!locations) {
      return undefined;
    }
    return locations[0];
  }
}

export const networkCalls = new NetworkCalls();
