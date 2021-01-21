# Templafy App Connector Library
This library allows external vendors to start the Templafy document creation process from their own apps and have the resulting document saved back to their app.
App connector is an external system which starts the Templafy's create document flow in its own context.

## Flow
1. The user presses a button or a link in the external app.
2. The app connector opens a pop-up that loads Templafy. It optionally sends along data which can be used in the document creation process.
3. Templafy validates the orgin of the request and allows the request.
4. If needed, the user is authenticated.
5. The user creates a document in Templafy and the Templafy's popup closes itself.
6. The app connector receives a Shared-Access Signature (SAS) link from where to download the created document.

An example app connector can be found under [Examples](./examples)

## Usage
In the [project directory](.examples/app-connector), you can run:

### `npm install --legacy-peer-deps` or `yarn`

and afterwards

### `npm start` or `yarn start`

This runs the app in the development mode.
Open [https://localhost:3000](https://localhost:3000) to view it in the browser.

The page will reload if you make edits.

## Caveats
All communication to Templafy must be over HTTPS.

If you want to avoid the development certificate option which is is coming by default, you can use [ngrok](https://ngrok.com/download) to get https connection.

After you finish the installation of ngrok, remove `HTTPS=true` from the start script in package.json

Start ngrok with the command `ngrok http 3000 --host-header=localhost:3000`.

The HTTPS URL which will popup after the command is executed can be used for opening the example app.
