import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import "./index.css"

const isValidUrl = (url: string | undefined) => {
    try {
        new URL(url || "");
    } catch (_) {
        return false;
    }
    return true;
};

const App: React.FC = () => {
    const noop = () => console.log;

    const [documentUrl, setDocumentUrl] = useState<string>("");
    const [popupOpened, setOpenedPopup] = useState<boolean>(false);
    const [popupUrl, setPopupUrl] = useState<string>(
        `https://templafy.templafy-local.com/library/documents?externalSystemType=genericAppConnector&origin=${window.location.origin}`);
    const [contentMessage, setContentMessage] = useState<string>("{\"testKey\": \"testValue\"}");

    let openedPopup: Window | null;
    const openPopupHandler = () => {
        setOpenedPopup(true);
        const features = "menubar=no,location=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no,width=1500,height=1000";
        openedPopup = window.open(popupUrl, "_blank", features);
        if (openedPopup) {
            window.addEventListener("message", messageEventHandler);
        }
    };

    const messageEventHandler = ({data}: MessageEvent) => {
        if (data?.type === "ready") {
            console.log(data);
            const url = new URL(popupUrl);
            openedPopup?.postMessage({type: "content", content: JSON.parse(contentMessage)}, url.origin);
        } else if (data?.type === "document") {
            console.log(data);
            const newDocumentUrl = (data as {documentUrl: string }).documentUrl;
            setDocumentUrl(newDocumentUrl);

            openedPopup?.close();
            setOpenedPopup(false);
            window.removeEventListener("message", messageEventHandler);
            window.location.href = newDocumentUrl;
        }
    };

    const isPopupUrlValid = isValidUrl(popupUrl);

    return (
        <div className="app">
            <h1>Setup</h1>
            <i>Create "App Connector" setting and set as "Domain Name" the same domain executing this code.
                This must much the "origin" query string parameter of the request to Templafy as well.</i>

            <i>Replace "templafy.templafy-local.com" from the URL below with the one of your tenant.
                E.g. "mycompany.templafy.com".
            </i>

            <h1>Test</h1>
            <label className="label">
                Popup URL which will open Templafy:
                <input className="input"
                    type="text"
                    value={popupUrl}
                    onChange={event => setPopupUrl(event.target.value || "")}
                />
            </label>
            <label className="label">
                Content message send to Templafy:
                <textarea
                    value={contentMessage}
                    onChange={event => setContentMessage(event.target.value || "")}
                    rows={5}
                    cols={50}
                />
            </label>
            <button onClick={openPopupHandler}
                disabled={!isPopupUrlValid || popupOpened}
            >
                Open Popup
            </button>

            <h1>Result</h1>
            <label className="label">
                Document URL:
                <input className="input"
                    type="text"
                    value={documentUrl}
                    onChange={noop}
                    disabled={true}
                />
            </label>
        </div>
    );
};

// ========================================

ReactDOM.render(<App />, document.getElementById("root"));
