const playwright = require('playwright');
const embedder = require('./embedder');


async function scrapeUpcomingFotds(locationMetadata) {
    const url = `https://www.culvers.com/restaurants/${locationMetadata.slug}?tab=upcoming`

    const launchOptions = {
        headless: true,
        executablePath: '/usr/bin/chromium-browser'
    }
    const browser = await playwright['chromium'].launch(launchOptions);
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url);

    const upcomingCount = await page.locator('//div[starts-with(@class, \'RestaurantCalendarPanel_containerItem_\')]').count()
    const flavors = [];
    for (let i = 1; i < upcomingCount + 1; i++) {
        const dayLocator = await page.locator(`//*[@id="calendar-panel-upcoming"]/div/div[${i}]/h3`)
        const dayText = await dayLocator.textContent();
        const flavorLocator = await page.locator(`//*[@id="calendar-panel-upcoming"]/div/div[${i}]/div[2]/div[1]/a`)
        const flavorName = await flavorLocator.textContent();
        const imageLocator = await page.locator('//*[@id="calendar-panel-upcoming"]/div/div[1]/div[1]/a/img')
        const flavorImg = await imageLocator.getAttribute('src');

        flavors.push({
            day: dayText,
            name: flavorName,
            imageUrl: flavorImg?.split('?')[0]
        });
    }
    await browser.close();

    const upcomingFotds = [];
    for (const flavor of flavors) {
        upcomingFotds.push(embedder.createUpCommingFotdEmbeds(locationMetadata.city, flavor.day, flavor.name, flavor.imageUrl))
    }
    return upcomingFotds;
}

module.exports = {
    scrapeUpcomingFotds
}