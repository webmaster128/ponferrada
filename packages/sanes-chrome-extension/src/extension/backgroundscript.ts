/*global chrome*/
import { generateErrorResponse } from './background/errorResponseGenerator';
import Backgroundscript from './background/model/backgroundscript';

const backgroundScript = new Backgroundscript();
backgroundScript.registerActionsInBackground();

/**
 * Listener for dispatching website requests towards the extension
 */
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  backgroundScript
    .handleRequestMessage(message, sender)
    .then(sendResponse)
    .catch((error: any) => {
      // eslint-disable-next-line no-console
      console.error(error);

      // exception in handleExternalMessage are most likely programming errors, since all
      // data validation must lead to an error response. Thus we return a server error without
      // revealing error details to the caller.
      const responseId = typeof message.id === 'number' ? message.id : null;
      const response = generateErrorResponse(responseId, 'Internal server error');
      sendResponse(response);
    });

  // If you want to asynchronously use sendResponse, add return true; It keeps sendResponse reference alive.
  // https://developer.chrome.com/extensions/messaging#simple
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#Parameters
  return true;
});
