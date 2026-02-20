import { EmbedBuilder } from "discord.js";
import { CulversLocation } from "../models/CulversLocation";

class EmbedderGenerator {
  private readonly FOTD_GOLD = 0xf5b301;

  createEmbeddedItem(title: string, url: string | undefined, description: string, image: string): EmbedBuilder {
    const embedBuilder = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setThumbnail(image);
    if (url) {
      embedBuilder.setURL(url);
    }
    return embedBuilder;
  }

  private truncate(value: string | undefined, maxLength: number): string {
    if (!value) {
      return "N/A";
    }
    const trimmed = value.trim();
    if (trimmed.length <= maxLength) {
      return trimmed;
    }
    return `${trimmed.slice(0, maxLength - 1)}…`;
  }

  private compactWhitespace(value: string | undefined): string {
    if (!value) {
      return "";
    }
    return value.replace(/\s+/g, " ").trim();
  }

  private withImageWidth(imageUrl: string | undefined, width: number): string {
    if (!imageUrl) {
      return "";
    }
    try {
      const url = new URL(imageUrl);
      url.searchParams.set("width", width.toString());
      return url.toString();
    } catch (err) {
      const separator = imageUrl.includes("?") ? "&" : "?";
      return `${imageUrl}${separator}width=${width}`;
    }
  }

  private parseOptions(rawOptions: string): string {
    if (!rawOptions) {
      return "Unavailable";
    }
    try {
      const parsed = JSON.parse(rawOptions);
      if (Array.isArray(parsed) && parsed.length) {
        return parsed.join(" • ");
      }
    } catch (err) {
      return "Unavailable";
    }
    return "Unavailable";
  }

  private getTodayDayPrefix(utcOffset: number): string {
    const now = new Date();
    const utcNowMillis = now.getTime() + now.getTimezoneOffset() * 60000;
    const localMillis = utcNowMillis + utcOffset * 60000;
    const day = new Date(localMillis).getUTCDay();
    const dayKeys = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    return dayKeys[day];
  }

  private parseServiceHours(hoursJson: string, utcOffset: number): string {
    if (!hoursJson) {
      return "Unavailable";
    }
    try {
      const parsed = JSON.parse(hoursJson);
      const dayPrefix = this.getTodayDayPrefix(utcOffset);
      const open = parsed?.[`${dayPrefix}O`];
      const close = parsed?.[`${dayPrefix}C`];
      if (!open || !close) {
        return "Unavailable";
      }
      return `${open} - ${close}`;
    } catch (err) {
      return "Unavailable";
    }
  }

  private getOrderingStatus(onlineOrderStatus: number): string {
    if (onlineOrderStatus === 1) {
      return "Online ordering available";
    }
    if (onlineOrderStatus === 0) {
      return "Online ordering unavailable";
    }
    return "Online ordering status unknown";
  }

  createFlavorOfTheDayEmbed(location: CulversLocation): EmbedBuilder {
    const imageUrl = location.flavorOfDayImageUrl;
    const embedImageUrl = this.withImageWidth(imageUrl, 560);
    const restaurantUrl = location.getRestaurantUrl;
    const flavorName = location.flavorOfDayName || "Mystery Custard";
    const flavorNotes = this.truncate(
      this.compactWhitespace(location.flavorOfTheDayDescription),
      220,
    );
    const orderingStatus = this.getOrderingStatus(location.onlineOrderStatus);
    const handoffOptions = this.truncate(
      this.parseOptions(location.handoffOptions),
      72,
    );
    const dineInHours = this.parseServiceHours(location.dineInHours, location.utcOffset);
    const driveThruHours = this.parseServiceHours(location.driveThruHours, location.utcOffset);
    const compactAddress = this.truncate(
      `${location.street}, ${location.city}, ${location.state} ${location.postalCode}`,
      110,
    );

    const embed = new EmbedBuilder()
      .setColor(this.FOTD_GOLD)
      .setTitle(`Flavor of the Day • ${location.city}, ${location.state}`)
      .setDescription(`**${flavorName}**\n${flavorNotes}`)
      .addFields(
        {
          name: "Location",
          value: compactAddress,
          inline: false,
        },
        {
          name: "Ordering",
          value: `${orderingStatus}\n${handoffOptions}`,
          inline: false,
        },
        {
          name: "Today's Hours",
          value: `Dine-In: ${dineInHours}\nDrive-Thru: ${driveThruHours}`,
          inline: false,
        },
      )
      .setThumbnail(embedImageUrl || imageUrl)
      .setFooter({
        text: `Restaurant #${location.restaurantNumber} • Culver's Custardbot`,
      });

    if (restaurantUrl) {
      embed.setURL(restaurantUrl);
    }

    return embed;
  }

  createMultiFlavorOfTheDayEmbeds(location: CulversLocation): EmbedBuilder {
    const flavorName = location.flavorOfDayName || "Mystery Custard";
    const flavorNotes = this.truncate(location.flavorOfTheDayDescription, 220);
    return new EmbedBuilder()
      .setColor(this.FOTD_GOLD)
      .setTitle(`🍦 ${location.city}, ${location.state}`)
      .setDescription(`**${flavorName}**\n${flavorNotes}`)
      .addFields({
        name: "Address",
        value: `${location.street}, ${location.city}, ${location.state} ${location.postalCode}`,
      })
      .setThumbnail(location.flavorOfDayImageUrl);
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
