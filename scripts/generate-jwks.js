const crypto = require("crypto");

const GOOGLE_CERTS_URL =
  "https://www.googleapis.com/service_accounts/v1/metadata/x509/securetoken@system.gserviceaccount.com";

function processCertificate(pemCert) {
  const { publicKey } = new crypto.X509Certificate(pemCert);
  return publicKey.export({ format: "jwk" });
}

async function main() {
  try {
    const response = await fetch(GOOGLE_CERTS_URL);
    const certs = await response.json();

    const keys = Object.entries(certs).map(([kid, pemCert]) => ({
      ...processCertificate(pemCert),
      kid,
    }));

    console.log(JSON.stringify({ keys }, null, 2));
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
