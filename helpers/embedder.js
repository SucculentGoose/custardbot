const { EmbedBuilder } = require("@discordjs/builders");

class Embedder {
  createEmbeddedItem(title, url, description, image) {
    const embedBuilder = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setThumbnail(image);
    if (url) {
      embedBuilder.setURL(url);
    }
    return embedBuilder;
  }

  createFlavorOfTheDayEmbed(location) {
    return this.createEmbeddedItem('Flavor of the Day 🍦',
     location.Url,
     `The flavor 🤤 of the day 📅 at ${location.City}, ${location.State} 🗺️ is ${location.FlavorDay} 🍦`,
     location.FlavorImageUrl);
  }

  createMultiFlavorOfTheDayEmbeds(location) {
    return this.createEmbeddedItem(
      `Flavor of the Day 🍦 at ${location.City}`,
      undefined,
      `The flavor 🤤 of the day 📅 located ${location.Distance} miles away 🚗 at ${location.Address} ${location.City}, ${location.State} 🗺️ is ${location.FlavorDay} 🍦`,
      location.FlavorImageUrl
    );
  }

  createUpCommingFotdEmbeds(city, date, flavor, image) {
    return this.createEmbeddedItem(
      `Upcoming flavor for ${city}`,
      undefined,
      `On ${date} the flavor of the day will be ${flavor}`,
      image
    );
  }
}

module.exports = new Embedder();