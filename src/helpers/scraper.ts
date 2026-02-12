import playwright from "playwright";
import { embedderGenerator } from "./embedderGenerator";
import { CulversLocation } from "../models/CulversLocation";

/**
 * Scrapes upcoming flavors-of-the-day from the restaurant page.
*
 * Target:
 * - Container: element with id="calendar-panel-upcoming"
 * - Items: any descendant element whose class list contains a classname that starts with
 *   "RestaurantCalendarPanel_containerItemContent".
 *
 * Extraction strategy (keeps working when markup shifts slightly):
 * - day: first <h3> text within the item
 * - name: first link text within the item
 * - imageUrl: first <img> src within the item (querystring stripped)
 */
export async function scrapeUpcomingFotds(location: CulversLocation) {
  const url = `https://www.culvers.com/restaurants/${location.slug}?tab=upcoming`;

  const launchOptions = {
    headless: true,
    // If chromium is not at this path (e.g., in Docker/playwright image), playwright will use its bundled browser.
    executablePath:
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  };

  let browser: playwright.Browser;
  let context: playwright.BrowserContext;
  let page: playwright.Page;

  try {
    browser = await playwright.chromium.launch(launchOptions);
    context = await browser.newContext();
    page = await context.newPage(); 
  } catch (ex) {
    console.error("Failed to launch browser:", ex);
    throw ex;
  }
  

  // Wait for the upcoming panel to exist in the DOM.
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#calendar-panel-upcoming", { timeout: 15000 });

  const flavors = await page.$eval("#calendar-panel-upcoming", (panel) => {
    const items = Array.from(
      panel.querySelectorAll(
        '[class^="RestaurantCalendarPanel_containerItem__"]',
      ),
    );

    const clean = (s) =>
      typeof s === "string" ? s.replace(/\s+/g, " ").trim() : "";

    return items
      .map((item) => {
        const dayText = clean(
          item.querySelector(
            '[class^="RestaurantCalendarPanel_containerItemHeading__"]',
          )?.textContent,
        );

        const content = item.querySelector(
          '[class^="RestaurantCalendarPanel_containerItemContent__"]',
        );

        // Use the specific flavor link inside the "content" section
        const flavorLink = content?.querySelector(
          '[class^="RestaurantCalendarPanel_containerItemContentFlavorLink__"]',
        );
        const flavorName = clean(flavorLink?.textContent);

        const img = item.querySelector("img[aria-labelledby]");
        const src = img?.getAttribute("src") || "";
        const imageUrl = src ? src.split("?")[0] : "";

        return { day: dayText, name: flavorName, imageUrl };
      })
      .filter((x) => x.day && x.name);
  });

  await browser.close();

  return flavors.map((flavor) =>
    embedderGenerator.createUpCommingFotdEmbeds(
      location.city,
      flavor.day,
      flavor.name,
      flavor.imageUrl,
    ),
  );
}
