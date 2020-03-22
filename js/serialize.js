const VERSION = "0.3.0";
const TEAMS = ["law", "chaos"];
const STATS = ["hp", "atk", "def", "spd", "res", "crit", "ele"];
const FIELDS = ["weapon", "symbol", "destiny", "buff"];

function swap() {
  document.getElementById("law").classList.toggle("inactive_team");
  document.getElementById("chaos").classList.toggle("inactive_team");
}

function getActiveTeam() {
  if (document.getElementById("law").classList.contains("inactive_team")) {
    return "chaos";
  }
  return "law";
}

function getCharacterData(num) {
  return FIELDS.reduce(function (characterData, field) {
    characterData[field] = STATS.reduce(function (fieldData, status) {
      const statusNode = document.getElementById("char" + num + field + status);
      if (statusNode) {
        fieldData[status] = Number(statusNode.value);
      }
      return fieldData;
    }, {});
    return characterData;
  }, {
    name: document.getElementById("character" + num + "name").value,
    limitbreakvalue: document.getElementById("char" + num + "limitbreakvalue").value
  });
}

function loadCharacterData(num, data) {
  const nameNode = document.getElementById("character" + num + "name");
  nameNode.value = data.name;
  document.getElementById("char" + num + "limitbreakvalue").value = data.limitbreakvalue;
  FIELDS.forEach(function (field) {
    Object.keys(data[field]).forEach(function (status) {
      document.getElementById("char" + num + field + status).value = data[field][status];
    });
  });

  if (data.name !== "none") {
    const event = document.createEvent("Event");
    event.initEvent("change", false, true);
    nameNode.dispatchEvent(event);
  }
}

function getMagData(team) {
  return STATS.reduce(function (magData, status) {
    const statusNode = document.getElementById(team + "mag" + status);
	if (statusNode) {
        magData[status] = Number(statusNode.value);
      }
    return magData;
  }, {});
}

function loadMagData(team, data) {
  Object.keys(data).forEach(function (status) {
    document.getElementById(team + "mag" + status).value = data[status];
  });
}

function getSaveData() {
  return {
    version: VERSION,
    activeTeam: getActiveTeam(),
    characters: [1, 2, 3, 4, 5, 6, 7, 8].map(getCharacterData),
    mags: TEAMS.map(getMagData)
  };
}

function loadSaveData(data) {
  if (data.version !== VERSION) {
    console.error("Invalid data or save version not supported.");
    return;
  }
  try {
    if (getActiveTeam() !== data.activeTeam) {
      swap();
    }
    TEAMS.forEach(function (team, index) {
      loadMagData(team, data.mags[index]);
    });
    data.characters.forEach(function (characterData, index) {
      loadCharacterData(index + 1, characterData);
    });
  } catch (error) {
    console.error(error);
  }
}

function serialize(data) {
  return encode(data, "json");
}

function deserialize(text) {
  return decode(text, "json");
}
