const popupNotOpenedError =
  "Popup was not opened, make sure this function is run from a click action.";
const features =
  "menubar=no,location=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no,width=1500,height=1000";

function registerAppConnectorMessageHandler(
  popup,
  popupUrl,
  data,
  resolveDocumentUrl,
  signal
) {
  window.addEventListener(
    "message",
    (message) => {
      if (message.source.self !== popup) {
        // Message did not come from opened popup, do not process.
        return;
      }

      const messageData = message.data;

      if (messageData?.type === "ready") {
        // 'ready' message received from Templafy, this indicates it's ready to receive "content".

        // Send content to Templafy-popup using `postMessage`.
        // More on postMessage here: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
        popup.postMessage(
          { type: "content", content: JSON.parse(data) },
          popupUrl.origin
        );
      } else if (messageData?.type === "document") {
        // 'document' message received from Templafy, this indicates it completed generating a document, the message contains a URL to the document.
        resolveDocumentUrl(messageData.documentUrl);
      }
    },
    { signal: signal }
  );
}

function openPopup(url, abortController) {
  const openedPopup = window.open(url, "_blank", features);

  if (!openedPopup) {
    abortController.abort(popupNotOpenedError);
    throw new Error(popupNotOpenedError);
  }

  // Call abort when popup is closed.
  const interval = setInterval(() => {
    if(openedPopup.closed) {
        abortController.abort("Popup was closed");
        clearInterval(interval);
    }
  }, 200);

  return openedPopup;
}

window.templafy = {
  getDocumentUrl: (popupUrl, data) => {
    const abortController = new AbortController();
    var url = new URL(popupUrl);

    let resolveDocumentUrl;

    const documentUrlPromise = new Promise((resolve, reject) => {
      resolveDocumentUrl = resolve;
      abortController.signal.addEventListener("abort", (e) => reject(e.currentTarget.reason));
    });

    const popup = openPopup(url, abortController);

    registerAppConnectorMessageHandler(
      popup,
      url,
      data,
      resolveDocumentUrl,
      abortController.signal
    );

    return documentUrlPromise.finally(() => popup.close());
  },
};
