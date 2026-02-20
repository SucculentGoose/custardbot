import { networkCalls } from "../network/networkCalls";
import { ActionRowBuilder } from "discord.js";
import { ButtonBuilder } from "discord.js";
import { ButtonStyle } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { embedderGenerator } from "../helpers/embedderGenerator";
import { CulversLocation } from "../models/CulversLocation";
import { stringGenerator } from "../helpers/stringGenerator";

function createLocationButtons(
  location: CulversLocation,
): ActionRowBuilder<ButtonBuilder>[] {
  const buttons: ButtonBuilder[] = [];
  if (location.getRestaurantUrl) {
    buttons.push(
      new ButtonBuilder()
        .setLabel("Restaurant")
        .setStyle(ButtonStyle.Link)
        .setURL(location.getRestaurantUrl),
    );
  }

  if (!buttons.length) {
    return [];
  }

  return [new ActionRowBuilder<ButtonBuilder>().addComponents(buttons)];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fotd")
    .setDescription(
      "Gets the Culvers flavor of the day for the zip code location",
    )
    .addStringOption((option) => {
      return option
        .setName("zipcode")
        .setDescription("The zip code location of the Culvers restaurant")
        .setRequired(true)
        .setMaxLength(5)
        .setMinLength(5);
    })
    .addBooleanOption((boolOption) => {
      return boolOption
        .setName("show_more")
        .setDescription(
          "Returns up to 5 Culvers locations flavor of the day using the entered zip code.",
        );
    }),
  async execute(interaction) {
    // Get the zipcode and show_more boolean option that was passed by the user
    const zipcode = interaction.options.getString("zipcode");
    const showMore = interaction.options.getBoolean("show_more");

    // Defer the reply since we may perform network calls that take longer than 3s
    try {
      await interaction.deferReply();
    } catch (err) {
      // If deferring fails, log but continue — we'll try to reply later
      console.error("Failed to defer reply:", err);
    }

    if (showMore) {
      // If we want to show more locations, fetch all the locations
      let locations;
      try {
        locations = await networkCalls.fetchAllCulversLocations(
          zipcode,
          showMore,
        );
      } catch (err) {
        console.error("Error fetching locations:", err);
      }

      // just make sure we actually got something
      if (!locations || !locations.length) {
        // we already deferred, so edit the deferred reply
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply(stringGenerator.noCulversString(zipcode));
        } else {
          await interaction.reply(stringGenerator.noCulversString(zipcode));
        }
        return;
      }

      const fotdEmbeds: EmbedBuilder[] = [];

      // Theres no way to know how many locations could be returned, so only show the first 5
      // to the user in discord.
      for (let i = 0; i < 5; i++) {
        if (locations[i]) {
          fotdEmbeds.push(
            embedderGenerator.createMultiFlavorOfTheDayEmbeds(locations[i]),
          );
        }
      }
      // edit the deferred reply with embeds
      const heading = `Top ${fotdEmbeds.length} nearby Culver's flavor cards for ZIP ${zipcode}`;
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: heading, embeds: fotdEmbeds });
      } else {
        await interaction.reply({ content: heading, embeds: fotdEmbeds });
      }
    } else {
      // if showMore is false, just return the first result
      let location;
      try {
        location = await networkCalls.fetchSingleCulversLocation(zipcode);
      } catch (err) {
        console.error("Error fetching single location:", err);
      }

      // just make sure we actually got something
      if (!location) {
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply(stringGenerator.noCulversString(zipcode));
        } else {
          await interaction.reply(stringGenerator.noCulversString(zipcode));
        }
        return;
      }

      if (location?.isTemporarilyClosed) {
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply(
            stringGenerator.culversTempClosed(zipcode),
          );
        } else {
          await interaction.reply(stringGenerator.culversTempClosed(zipcode));
        }
        return;
      }

      const embedFotd = embedderGenerator.createFlavorOfTheDayEmbed(location);
      const components = createLocationButtons(location);

      // edit the deferred reply and fetch the updated message so we can react
      const message =
        interaction.deferred || interaction.replied
          ? await interaction.editReply({
              embeds: [embedFotd],
              components,
              fetchReply: true,
            })
          : await interaction.reply({
              embeds: [embedFotd],
              components,
              fetchReply: true,
            });
      try {
        await message.react("🔥");
        await message.react("🤮");
        await message.react("🍦");
      } catch (ex) {
        console.error("Sorry an error occurred reacting: " + ex);
      }
    }
  },
};
