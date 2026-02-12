import { EmbedBuilder } from "discord.js";
import { CulversLocation } from "../models/CulversLocation";

class EmbedderGenerator {
  createEmbeddedItem(
    title: string,
    url: string | undefined,
    description: string,
    image: string,
  ): EmbedBuilder {
    const embedBuilder = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setThumbnail(image);
    if (url) {
      embedBuilder.setURL(url);
    }
    return embedBuilder;
  }

  createFlavorOfTheDayEmbed(location: CulversLocation): EmbedBuilder {
    const imageUrl = location.flavorOfDayImageUrl;

    return this.createEmbeddedItem(
      "Flavor of the Day 🍦",
      location.getRestaurantUrl,
      `The flavor 🤤 of the day 📅 at ${location.city}, ${location.state} 🗺️ is ${location.flavorOfDayName || "NOTHING 🫡"} 🍦`,
      imageUrl,
    );
  }

  createMultiFlavorOfTheDayEmbeds(location: CulversLocation): EmbedBuilder {
    return this.createEmbeddedItem(
      `Flavor of the Day 🍦 at ${location.city}`,
      undefined,
      `The flavor 🤤 of the day 📅 located at ${location.street} ${location.city}, ${location.state} 🗺️ is ${location.flavorOfDayName} 🍦`,
      location.flavorOfDayImageUrl,
    );
  }

  createUpCommingFotdEmbeds(city: string, date: string, flavor: string, image: string): EmbedBuilder {
    // The date param comes in as something like 'Monday, January 16'.
    // Do some checking to see if the date we are adding matches todays date.
    // If it does, dont use Upcoming and instead use Today's flavor for title and
    // Today the flavor of the day for the description
    let title: string;
    let description: string;

    if (date.startsWith("Today")) {
      title = `Today's flavor for ${city}`;
      description = `Today the flavor of the day will be ${flavor}`;
    } else if (date.startsWith("Tomorrow")) {
      title = `Tomorrow's flavor for ${city}`;
      description = `Tomorrow the flavor of the day will be ${flavor}`;
    } else {
      title = `Upcoming flavor for ${city}`;
      description = `On ${date}, the flavor of the day will be ${flavor}`;
    }

    return this.createEmbeddedItem(title, undefined, description, image);
  }
}

export const embedderGenerator = new EmbedderGenerator();
