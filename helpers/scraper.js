const playwright = require('playwright');
const embedder = require('./embedder');


async function scrapeUpcomingFotds(city) {
    const url = `https://www.culvers.com/restaurants/${city}?tab=upcoming`

    const launchOptions = {
        headless: true,
        executablePath: '/usr/bin/chromium-browser'
    }
    const browser = await playwright['chromium'].launch(launchOptions);
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url);
    await page.waitForTimeout(1000)

    const upcomingCount = await page.locator('//div[starts-with(@class, \'RestaurantCalendarPanel_containerItem_\')]').count()
    const flavors = [];
    for (let i = 1; i < upcomingCount + 1; i++) {
        const dayLocator = await page.locator(`//*[@id="calendar-panel-upcoming"]/div/div[${i}]/h3`)
        const dayText = await dayLocator.textContent();
        const flavorLocator = await page.locator(`//*[@id="calendar-panel-upcoming"]/div/div[${i}]/div[2]/div[1]/a`)
        const flavorName = await flavorLocator.textContent()
        const flavorImg = `https://www.culvers.com${await flavorLocator.getAttribute('href')}`
        flavors.push({
            day: dayText,
            name: flavorName,
            img: flavorImg
        });
    }
    await browser.close();

    const upcomingFotds = [];
    for (const flavor of flavors) {
        upcomingFotds.push(embedder.createUpCommingFotdEmbeds(city, flavor.day, flavor.name, flavor.img))
    }
}

scrapeUpcomingFotds('escanaba')

module.exports = {
    scrapeUpcomingFotds
}