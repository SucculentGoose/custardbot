const _                     = require('underscore');
const {SlashCommandBuilder} = require('discord.js');

const networkCalls   = require('../network/networkCalls');
const stringGenerator = require('../helpers/stringGenerator');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('fotd')
  .setDescription('Gets the Culvers flavor of the day for the zip code location')
  .addStringOption(option => {
    return option.setName('zipcode')
    .setDescription('The zip code location of the Culvers restaurant')
    .setRequired(true)
    .setMaxLength(5)
    .setMinLength(5)
  })
  .addBooleanOption(boolOption => {
    return boolOption
    .setName('show_more')
    .setDescription('Returns up to 5 Culvers locations flavor of the day using the entered zip code.')
  }),
  async execute(interaction) {
    // Get the zipcode and show_more boolean option that was passed by the user
    const zipcode = interaction.options.getString('zipcode');
    const showMore = interaction.options.getBoolean('show_more');

    if (showMore) {
      // If we want to show more locations, fetch all the locations
      const locations = await networkCalls.fetchAllCulversLocations(zipcode, showMore);
      
      // just make sure we actually got something
      if (_.isUndefined(locations)) {
        interaction.reply(stringGenerator.noCulversString(zipcode));
      }

      let stringToDisplay = '';

      // Theres no way to know how many locations could be returned, so only show the first 5
      // to the user in discord.
      for (let i = 0; i <= 5; i++) {
        stringToDisplay += stringGenerator.generateFotdString(locations[i], true);
      }
      interaction.reply(stringToDisplay);
    } else {
      // if showMore is false, just return the first result
      const location = await networkCalls.fetchSingleCulversLocation(zipcode);

      // just make sure we actually got something
      if (_.isUndefined(location)) {
        interaction.reply(stringGenerator.noCulversString(zipcode));
      }

      interaction.reply(stringGenerator.generateFotdString(location, false));
    }
  }
};