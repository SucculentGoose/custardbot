import _ from "underscore";
import { networkCalls } from "../network/networkCalls";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { embedderGenerator } from "../helpers/embedderGenerator";

const stringGenerator = require("../helpers/stringGenerator");

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

    if (showMore) {
      // If we want to show more locations, fetch all the locations
      const locations = await networkCalls.fetchAllCulversLocations(
        zipcode,
        showMore,
      );

      // just make sure we actually got something
      if (_.isUndefined(locations)) {
        interaction.reply(stringGenerator.noCulversString(zipcode));
      }

      const fotdEmbeds: EmbedBuilder[] = [];

      // Theres no way to know how many locations could be returned, so only show the first 5
      // to the user in discord.
      for (let i = 0; i <= 5; i++) {
        if (locations[i]) {
          fotdEmbeds.push(
            embedderGenerator.createMultiFlavorOfTheDayEmbeds(locations[i]),
          );
        }
      }
      interaction.reply({ embeds: fotdEmbeds });
    } else {
      // if showMore is false, just return the first result
      const location = await networkCalls.fetchSingleCulversLocation(zipcode);

      // just make sure we actually got something
      if (_.isUndefined(location)) {
        interaction.reply(stringGenerator.noCulversString(zipcode));
        return;
      }

      if (location?.isTemporarilyClosed) {
        interaction.reply(stringGenerator.culversTempClosed(zipcode));
        return;
      }

      const embedFotd = embedderGenerator.createFlavorOfTheDayEmbed(location);

      const message = await interaction.reply({
        embeds: [embedFotd],
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
