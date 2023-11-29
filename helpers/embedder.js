const { EmbedBuilder } = require("@discordjs/builders");

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

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
    const metadata = location.metadata;
    const restaurantUrl = `https://www.culvers.com/restaurants/${metadata.slug}`
    const imageUrl = `https://cdn.culvers.com/menu-item-detail/${metadata.flavorOfDaySlug}`

    return this.createEmbeddedItem('Flavor of the Day 🍦',
     restaurantUrl,
     `The flavor 🤤 of the day 📅 at ${metadata.city}, ${metadata.state} 🗺️ is ${metadata.flavorOfDayName} 🍦`,
     imageUrl);
  }

  createMultiFlavorOfTheDayEmbeds(location) {
    const metadata = location.metadata
    return this.createEmbeddedItem(
      `Flavor of the Day 🍦 at ${metadata.city}`,
      undefined,
      `The flavor 🤤 of the day 📅 located at ${metadata.street} ${metadata.city}, ${metadata.state} 🗺️ is ${metadata.flavorOfDayName} 🍦`,
      location.FlavorImageUrl
    );
  }

  createUpCommingFotdEmbeds(city, date, flavor, image) {
    // The date param comes in as something like 'Monday, January 16'.
    // Do some checking to see if the date we are adding matches todays date.
    // If it does, dont use Upcoming and instead use Today's flavor for title and
    // Today the flavor of the day for the description
    let title = `Upcoming flavor for ${city}`;
    let description = `On ${date} the flavor of the day will be ${flavor}`;

    const jsDate = new Date();
    const dayOfWeek = weekdays[jsDate.getDay()];
    const month = months[jsDate.getMonth()];
    const dayOfMonth = jsDate.getDate().toString();
    if (date === `${dayOfWeek}, ${month} ${dayOfMonth}`) {
      title = `Today's flavor for ${city}`;
      description = `Today the flavor of the day will be ${flavor}`
    }
    return this.createEmbeddedItem(
      title,
      undefined,
      description,
      image
    );
  }
}

module.exports = new Embedder();