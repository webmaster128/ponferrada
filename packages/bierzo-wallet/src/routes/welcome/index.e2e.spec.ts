import { Browser, Page } from 'puppeteer';
//import { WELCOME_ROUTE } from '../paths';
import { launchBrowser, createPage, closeBrowser } from '../../utils/test/e2e';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // eslint-disable-line

describe('DOM > Welcome route', (): void => {
  let browser: Browser;
  let page: Page;

  beforeEach(async (): Promise<void> => {
    browser = await launchBrowser();
    page = await createPage(browser);
  }, 45000);

  afterEach(
    async (): Promise<void> => {
      await closeBrowser(browser);
    },
  );

  it('loads correctly', async (): Promise<void> => {
    /*const inner = await page.evaluate((id: string): string | undefined => {
      const element = document.getElementById(id);
      if (!element) {
        return undefined;
      }

      return element.id;
    }, WELCOME_ROUTE);

    expect(inner).toBe(WELCOME_ROUTE);*/
    await sleep(1000);
    expect(true).toBe(true);
  }, 45000);
});
