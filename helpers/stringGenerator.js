class StringGenerator {
  generateFotdString(location, isShowingMultiple) {
    if (!location) {
      return ''
    }
    const flavorOfTheDay = location.FlavorDay;
    const flavorImage = location.FlavorImageUrl;
    const city = location.City;
    const distance = location.Distance;
    const state = location.State;
    const address = location.Address;
    if (isShowingMultiple) {
      return `The flavor 🤤 of the day 📅 located ${distance} miles away 🚗 at ${address} ${city}, ${state} 🗺️ is ${flavorOfTheDay} 🍦\n${flavorImage}\n`
    }
    return `The flavor 🤤 of the day 📅 at ${city}, ${state} 🗺️ is ${flavorOfTheDay} 🍦\n ${flavorImage}`
  }

  noCulversString(zipcode) {
    return `Theres no Culvers 🍦 locations 📍 near zip code ${zipcode} 🫡`;
  }
}

module.exports = new StringGenerator();