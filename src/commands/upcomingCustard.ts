import _ from "underscore";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import {networkCalls} from "../network/networkCalls";
import {stringGenerator} from "../helpers/stringGenerator";
import { scrapeUpcomingFotds } from "../helpers/scraper";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("futurecream")
    .setDescription("Lists the upcoming fotds for the week")
    .addStringOption((option) => {
      return option
        .setName("zipcode")
        .setDescription("The zip code location of the Culvers restaurant")
        .setRequired(true)
        .setMaxLength(5)
        .setMinLength(5);
    }),
  async execute(interaction) {
    // Get the zipcode that was passed by the user
    const zipcode = interaction.options.getString("zipcode");
    await interaction.deferReply();
    
    const location = await networkCalls.fetchSingleCulversLocation(zipcode);
    if (!location) {
      interaction.editReply(stringGenerator.noCulversString(zipcode));
      return;
    }
    try {
      if (!_.isString(location?.slug) || !location?.slug?.length) {
        interaction.editReply(stringGenerator.noCulversString(zipcode));
        return;
      }
      let upcomingFlavorOfTheDays: EmbedBuilder[];
      try {
        upcomingFlavorOfTheDays = await scrapeUpcomingFotds(location);
      } catch (ex) {
        await interaction.editReply("Something went wrong :(");
        return;
      }

      if (upcomingFlavorOfTheDays.length === 1) {
        await interaction.editReply(upcomingFlavorOfTheDays);
      } else if (Array.isArray(upcomingFlavorOfTheDays) && upcomingFlavorOfTheDays.length > 1) {
        await interaction.editReply({ embeds: upcomingFlavorOfTheDays });
      }
    } catch (ex) {
      interaction.editReply("Sorry an error occurred :( " + ex.message);
    }
  },
};
