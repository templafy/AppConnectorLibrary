// This wires up a static https server to make this sample work.
// It is not relevant to the App Connector integration and it's content can be ignored.

import handler from 'serve-handler';
import { createServer } from 'https';
import { createCA, createCert } from 'mkcert';


const ca = await createCA({
  organization: "My development CA",
  countryCode: ".",
  state: ".",
  locality: ".",
  validity: 365
});

const cert = await createCert({
  ca: { key: ca.key, cert: ca.cert },
  domains: ["127.0.0.1", "localhost"],
  validity: 365
});

const server = createServer(cert, (request, response) => {
  return handler(request, response);
});

server.listen(3000, () => {
  console.log('Running at https://localhost:3000');
});
