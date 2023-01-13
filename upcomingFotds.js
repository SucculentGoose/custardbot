const _ = require('underscore');
var JSSoup = require('jssoup').default;
const axios = require('axios');
const embedder = require('./helpers/embedder');

async function generateUpcomingFotdString(location) {
  const response = await axios.get(`${location.Url}#upcomming`);
  const data = response.data;
  const soup = new JSSoup(data);
  const fotdUpcoming = soup.find('div', 'fotdlist-unordered');
  const contents = fotdUpcoming.contents;
  if (_.isArray(contents) && contents.length) {
      const flavorsArray = [];
      _.each(contents, content => {
        const flavorObj = {};
        const dateSoup = content.find('h3', 'date');
        if (_.isString(dateSoup.text)) {
          let dateString;
          if (dateSoup.text.includes('TODAY') || dateSoup.text.includes('TOMORROW')) {
            dateString = dateSoup.text.trim().split(';')[1].trim();
          } else {
            dateString = dateSoup.text.trim();
          }
          flavorObj.date = dateString;
        }
        const flavorSoup = content.find('a', 'value');
        if (_.isString(flavorSoup.text)) {
          flavorObj.flavor = flavorSoup.text;
        }
        const imgSoup = content.find('img');
        if (_.isString(imgSoup.attrs?.src)) {
          const preUrl = imgSoup.attrs.src;
          if (preUrl.startsWith('//')) {
            flavorObj.img = preUrl.replace('//', 'https://');
          }
        }
        flavorsArray.push(flavorObj);
      });
      const upcomingFotds = [];
      _.each(flavorsArray, flavor => {
        upcomingFotds.push(embedder.createUpCommingFotdEmbeds(location.City, flavor.date, flavor.flavor, flavor.img));
      });
      return upcomingFotds;
  } else {
    // say nothing found for this location :(
      return `Nothing found for the city ${location.City}`;
  }
}

module.exports = {
  generateUpcomingFotdString
}

// doStuff();
