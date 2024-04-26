import { Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { getConfig } from "./config";
import { somOauth, timeouts } from "./constants";
import { validatePairs } from "./validators";
import { mkdir } from "fs/promises";
import { checkHeadless } from "./headless";

void (async () => {
    const config = await getConfig().catch(() => null);
    puppeteer.use(stealthPlugin());

    const browser = await puppeteer.launch({
        defaultViewport: null,
        headless: false,
        args: ["--start-maximized"]
    });

    const page = (await browser.pages())[0];

    if (config?.shouldCheckHeadless && !(await checkHeadless(browser)))
        throw new Error("It is not safe to proceed: we ARE Chrome in headless mode!");

    await page.bringToFront();
    await page.goto("https://inloggen.learnbeat.nl/preauth/entreesomtoday");

    if (config) {
        const matcher = (url: string) => {
            const urlObj = new URL(url);
            return urlObj.hostname == "inloggen.somtoday.nl" && urlObj.searchParams.has("auth");
        };
        if (!matcher(page.url())) await waitForPage(page, matcher);
        await page.type(somOauth.ORG_SEARCH_FIELD_SELECTOR, config.schoolName, { delay: 50 });
        page.keyboard.press("Enter");

        await waitForPage(page, matcher);
        await page.type(somOauth.USERNAME_FIELD_SELECTOR, config.username, { delay: 50 });
        page.keyboard.press("Enter");

        await page.waitForSelector(somOauth.PASSWORD_FIELD_SELECTOR);
        await page.type(somOauth.PASSWORD_FIELD_SELECTOR, config.password, { delay: 50 });
        page.keyboard.press("Enter");
    }

    await waitForPage(page, url => url.includes("https://inloggen.learnbeat.nl/users/home"));
    page.evaluate("alert(\"Inloggen geslaagd, ga nu naar de woordenlijst die je wilt speedrunnen.\");");

    await waitForPage(page, url => url.startsWith("https://inloggen.learnbeat.nl/activities/show/"));
    await page.waitForSelector(".js-list-body");
    const words = await validatePairs(await page.$$eval(".js-words-list-item", pairs => pairs.map(pair => {
        const left = pair.querySelector(".js-left-item").innerText;
        const right = pair.querySelector(".js-right-item").innerText;
        return [left, right];
    })));
    page.evaluate(`alert("${words.length} woorden zijn nu ingeladen, kies nu de overhoring.");`);
    await page.click(".js-card-open-questions > div > .js-card-button > div > button");

    const speedrunMatcher = /https:\/\/inloggen\.learnbeat\.nl\/activities\/show\/(\d)*\/sessions\/(\d)*/;
    await waitForPage(page, url => url.match(speedrunMatcher) != null);
    try {
        const failChance = config?.failChance ?? 0.4;

        while (page.url().match(speedrunMatcher) != null) {
            await page.waitForSelector(".js-question");
            const question = await page.$eval(".js-question", q => q.innerText);
            let answer = "...";

            if (Math.random() > failChance) {
                const { term, definition } = words.find(({ term, definition }) => question == term || question == definition)!;
                answer = question == term ? definition : term;
            }

            await page.click(".js-answer");
            await page.type(".js-answer > div > div > div > input", answer, { delay: 50 });
            if (!(await page.$(".js-training-progress")) || !(await page.$(".js-next-button"))) break;
            await page.click(".js-next-button");
            await page.keyboard.press("Enter");
        }
    } catch (e) {
        console.error(e);
        page.evaluate(`alert("Error tijdens het speedrunnen: ${e}");`);
    }

    await wait(1000);
    page.evaluate("alert(\"Speedrunnen klaar, screenshotten...\");");

    const screenshotDir = config?.screenshotDirectory ?? "screenshots";
    const screenshotName = new Date().toISOString().replace(/[^a-z0-9]/gi, "_");
    const screenshotPath = `${screenshotDir}/${screenshotName}.png`;

    await mkdir(screenshotDir, { recursive: true });
    await page.screenshot({
        path: screenshotPath,
        type: "png"
    });

    await page.evaluate(`alert("Screenshot gemaakt in ${screenshotPath}, klik om te sluiten.");`);
    await Promise.all((await browser.pages()).map(p => p.close()));
})();

async function waitForPage(page: Page, matcher: (url: string) => boolean) {
    for (; ;) {
        await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: timeouts.DISABLE_TIMEOUT });
        if (matcher(page.url())) break;
    }
}

async function wait(millis: number) {
    return new Promise(res => {
        setTimeout(res, millis);
    });
}
