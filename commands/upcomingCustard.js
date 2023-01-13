const _ = require('underscore');
const {SlashCommandBuilder} = require('discord.js');

const networkCalls    = require('../network/networkCalls');
const stringGenerator = require('../helpers/stringGenerator');
const upcomingFotds   = require('../upcomingFotds');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('futurecream')
  .setDescription('Lists the upcoming fotds for the week')
  .addStringOption(option => {
    return option.setName('zipcode')
    .setDescription('The zip code location of the Culvers restaurant')
    .setRequired(true)
    .setMaxLength(5)
    .setMinLength(5)
  }),
  async execute(interaction) {
    // Get the zipcode that was passed by the user
    const zipcode = interaction.options.getString('zipcode');
    await interaction.deferReply();
    const location = await networkCalls.fetchSingleCulversLocation(zipcode);
    if (!location) {
      interaction.editReply(stringGenerator.noCulversString(zipcode));
      return;
    }
    try {
      if (!_.isString(location.Url) || !location.Url?.length) {
        interaction.editReply(stringGenerator.noCulversString(zipcode));
        return;
      }
      const upcomingFlavorOfTheDays = await upcomingFotds.generateUpcomingFotdString(location);
      if (_.isString(upcomingFlavorOfTheDays)) {
        await interaction.editReply(upcomingFlavorOfTheDays);
      } else if (_.isArray(upcomingFlavorOfTheDays) && upcomingFlavorOfTheDays.length) {
        await interaction.editReply({embeds: upcomingFlavorOfTheDays});
      }
    } catch (ex) {
      interaction.editReply('Sorry an error occurred :( ' + ex.message);
    }
  }
};