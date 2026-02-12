class StringGenerator {
  noCulversString(zipcode: string) {
    return `There are no Culvers 🍦 locations 📍 near zip code ${zipcode} 🫡`;
  }

  culversTempClosed(zipcode: string) {
    return `The Culvers 🍦 location 📍 near zip code ${zipcode} is temporarily closed 😭`
  }
}

export const stringGenerator = new StringGenerator();