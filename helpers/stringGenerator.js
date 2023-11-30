class StringGenerator {
  noCulversString(zipcode) {
    return `There are no Culvers 🍦 locations 📍 near zip code ${zipcode} 🫡`;
  }

  culversTempClosed(zipcode) {
    return `The Culvers 🍦 location 📍 near zip code ${zipcode} is temporarily closed 😭`
  }
}

module.exports = new StringGenerator();