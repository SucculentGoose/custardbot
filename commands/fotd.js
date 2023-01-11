const _ = require('underscore');
const axios = require('axios');
const {SlashCommandBuilder} = require('discord.js');

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
    // Get the zipcode that was passed by the user
    const zipcode = interaction.options.getString('zipcode');
    const showMore = interaction.options.getBoolean('show_more');
    try {
      // Ok now fetch the locations from the culvers api
      const response = await axios.get(`https://www.culvers.com/api/locate/address/json?address=${zipcode}`);
      const data = response.data
      if (_.isArray(data.Collection?.Locations)) {
        if (showMore) {
          let stringToDisplay = '';
          if (showMore) {
            for (let i = 0; i <= 5; i++) {
              stringToDisplay += buildString(data.Collection.Locations[i], true);
            }
          }
          interaction.reply(stringToDisplay);
        } else {
          // if showMore is false, just return the first result
          const location = data.Collection.Locations[0];
          interaction.reply(buildString(location, false));
        }
      } else {
        interaction.reply(`No Culvers locations found for the zip code ${zipcode}`)
      }
    } catch (ex) {
      interaction.reply('Sorry an error occurred :( ' + ex.message);
    }
  }
};

function buildString(location, isShowingMultiple) {
  if (!location) {
    return ''
  }
  const flavorOfTheDay = location.FlavorDay;
  const flavorImage = location.FlavorImageUrl;
  const city = location.City;
  const state = location.State;
  const address = location.Address;
  if (isShowingMultiple) {
    return `The flavor of the day lcoated at ${address} ${city}, ${state} is ${flavorOfTheDay}\n`
  }
  return `The flavor of the day at ${city}, ${state} is ${flavorOfTheDay}\n ${flavorImage}`
}