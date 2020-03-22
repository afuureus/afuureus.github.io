function encode(data, format = "msgpack") {
  if (format === "msgpack") {
    return encodeMessagePack(data);
  }
  if (format === "json") {
    return encodeJSON(data);
  }
  console.error("Unsupported encoding format.");
  return "";
}

function decode(text, format = "msgpack") {
  if (format === "msgpack") {
    return decodeMessagePack(text);
  }
  if (format === "json") {
    return decodeJSON(text);
  }
  console.error("Unsupported decoding format.");
  return {};
}

function encodeJSON(data) {
  return JSON.stringify(data);
}

function decodeJSON(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Unable to parse JSON.", error);
  }
  return {};
}

function encodeMessagePack(data) {
  return window.btoa(String.fromCharCode.apply(null, MessagePack.encode(data)))
    .replace(/\+/g, "-") // replace + with -
    .replace(/\//g, "_") // replace / with _
    .replace(/=+$/, ""); // remove = padding
}

function decodeMessagePack(text) {
  return MessagePack.decode(
    new Uint8Array(
      window.atob(
        (text + '==='.slice((text.length + 3) % 4)) // add = padding
          .replace(/-/g, '+') // replace - with +
          .replace(/_/g, '/') // replace _ with /
      )
        .split("")
        .map(function(c) { return c.charCodeAt(0); })
    )
  );
}
