import express, { Request, Response } from 'express';
import { Server } from 'http';
import { Browser, Page } from 'puppeteer';

import { closeBrowser, createExtensionPage, createPage, launchBrowser } from '../../utils/test/e2e';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { getBalanceTextAtIndex, getUsernameE2E, waitForAllBalances } from './test/operateBalances';
import { travelToBalanceE2E } from './test/travelToBalance';

withChainsDescribe('E2E > Balance route', () => {
  let browser: Browser;
  let page: Page;
  let extensionPage: Page;
  let server: Server;

  beforeAll(() => {
    const app = express();

    app.use(express.static(require('path').join(__dirname, '/../../../build')));

    app.get('/*', function(req: Request, res: Response) {
      res.sendFile(require('path').join(__dirname, 'build', 'index.html'));
    });

    server = app.listen(9000);
  });

  beforeEach(async () => {
    browser = await launchBrowser();
    page = await createPage(browser);
    extensionPage = await createExtensionPage(browser);
    await travelToBalanceE2E(browser, page, extensionPage);
  }, 30000);

  afterEach(async () => {
    await closeBrowser(browser);
  });

  afterAll(() => {
    server.close();
  });

  it('should contain balances', async () => {
    await waitForAllBalances(page);

    const balances = [
      await getBalanceTextAtIndex(await page.$$('h6'), 0),
      await getBalanceTextAtIndex(await page.$$('h6'), 1),
      await getBalanceTextAtIndex(await page.$$('h6'), 2),
      await getBalanceTextAtIndex(await page.$$('h6'), 3),
    ];

    expect(balances).toEqual(['10 BASH', '10 CASH', '10 ETH', '5 LSK']);
  }, 45000);

  it('should contain message to get username', async () => {
    const username = await getUsernameE2E(await page.$$('h5'));

    expect(username).toBe('No human readable address registered.');
  }, 45000);
});