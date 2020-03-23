var DEFAULT_FORMAT = "msgpack";

function encode(data, format = DEFAULT_FORMAT) {
  if (format === "msgpack") {
    return encodeMessagePack(data);
  }
  if (format === "json") {
    return encodeJSON(data);
  }
  console.error("Unsupported encoding format.");
  return "";
}

function decode(text, format = DEFAULT_FORMAT) {
  if (format === "msgpack") {
    return decodeMessagePack(text);
  }
  if (format === "json") {
    return decodeJSON(text);
  }
  if (format === "nnstjp") {
    return decodeNNSTJP(text);
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
  try {
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
  } catch (error) {
    console.error("Unable to parse msgpack.", error);
  }
  return {};
}

function decodeNNSTJP(text) {
  const nnstjp = decodeJSON(text.replace(/^(https?:\/\/)?nnstjp\.github\.io\/Idola\/(index\.html)?\?/, ""));
  try {
    return {
      version: VERSION,
      activeTeam: nnstjp.Party === "01" ? "law" : "chaos",
      characters: nnstjp.CharacterID.map(function (id, index) {
        if (id === "100000 00") {
          id = "none";
        }
        return {
          name: id.replace(" ", ""),
          limitbreakvalue: nnstjp.CharacterLB[index],
          weapon: {hp: 0, atk: 0, def: 0, spd: Number(nnstjp.WeaponSPD[index]), crit: 0},
          symbol: {hp: 0, atk: 0, def: 0, spd: Number(nnstjp.SoulSPD[index]), res: 0, ele: 0},
          destiny: {hp: 0, atk: 0, def: 0, spd: 0},
          buff: {atk: 0, def: 0, spd: Number(nnstjp.SupportSPD[index])}
        };
      }),
      mags: nnstjp.IdoMagSPD.map(function (speed, index) {
        return {hp: 0, atk: 0, def: 0, spd: speed, res: 0, crit: 0};
      })
    };
  } catch (error) {
    console.error("Unable to parse NNSTJP.", error);
  }
  return {};
}
