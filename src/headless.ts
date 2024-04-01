import { Browser } from "puppeteer";

export async function checkHeadless(browser: Browser): Promise<boolean> {
    const headlessPage = await browser.newPage();
    await headlessPage.goto("https://arh.antoinevastel.com/bots/areyouheadless");
    await headlessPage.waitForNetworkIdle();
    return headlessPage.$eval(".success", s => s.innerText == "You are not Chrome headless");
}
