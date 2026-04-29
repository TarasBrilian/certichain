const UPLOAD_FILE_ENDPOINT = "/api/pinata/upload-file";
const UPLOAD_JSON_ENDPOINT = "/api/pinata/upload-json";

export function ipfsUrl(cid: string) {
  return `ipfs://${cid}`;
}

export function gatewayUrl(cidOrUri: string) {
  const cid = cidOrUri.replace("ipfs://", "");
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;
  const token = process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN;
  
  let url = `https://gateway.pinata.cloud/ipfs/${cid}`;
  if (gateway) {
    url = `https://${gateway}/ipfs/${cid}`;
  }
  
  if (token) {
    url += `?pinataGatewayToken=${token}`;
  }
  
  return url;
}

export async function uploadFileToPinata(file: Blob, filename: string) {
  const formData = new FormData();
  formData.append("file", file, filename);

  const response = await fetch(UPLOAD_FILE_ENDPOINT, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Pinata file upload failed: ${text}`);
  }

  const data = await response.json();
  return data.IpfsHash as string;
}

export async function uploadJsonToPinata(metadata: object, filename?: string) {
  const body: Record<string, unknown> = { pinataContent: metadata };

  if (filename) {
    body.pinataMetadata = { name: filename };
  }

  const response = await fetch(UPLOAD_JSON_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Pinata JSON upload failed: ${text}`);
  }

  const data = await response.json();
  return data.IpfsHash as string;
}
