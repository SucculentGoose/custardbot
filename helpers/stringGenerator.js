class StringGenerator {
  noCulversString(zipcode) {
    return `Theres no Culvers 🍦 locations 📍 near zip code ${zipcode} 🫡`;
  }
}

module.exports = new StringGenerator();