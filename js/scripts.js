function changeCharacter(event) {
  var imgNode = event.target.parentNode.parentNode.getElementsByClassName("charicon")[0];
  imgNode.setAttribute("src", "thumbs/character_" + event.target.value + "_thumb.png");
}

function getTeam(num) {
  if (num <= 4) {
    return "law";
  }
  return "chaos";
}

function createOptionElement(key) {
  const option = document.createElement("option");
  option.id = "save-" + key;
  option.innerText = key;
  option.value = key;
  return option;
}

function updateSaveNames() {
  const saveSelect = document.getElementById("save-select");
  const saveName = document.getElementById("save-name");
  const saveNameInputContainer = document.getElementById("save-name-input-container");
  const saveNameInput = document.getElementById("save-name-input");
  const loadButton = document.getElementById("load-button");
  const deleteButton = document.getElementById("delete-button");

  if (saveSelect.value !== "") {
    saveName.textContent = saveSelect.value;
    loadButton.disabled = false;
    deleteButton.disabled = false;
    saveNameInputContainer.classList.add("hidden");
    saveName.classList.remove("hidden");
    saveNameInput.value = "";
  } else {
    loadButton.disabled = true;
    deleteButton.disabled = true;
    saveName.classList.add("hidden");
    saveNameInputContainer.classList.remove("hidden");
  }
}

function save() {
  let isNew = false;
  let key = document.getElementById("save-select").value;
  if (key == "") {
    isNew = true;
    key = document.getElementById("save-name-input").value;
  }
  if (key == "") {
    window.alert("Cannot create save with empty name.");
    return;
  }
  if (window.localStorage.getItem(key) !== null) {
    if (!window.confirm("Save already exists, overwrite?")) {
      return;
    }
  }
  window.localStorage.setItem(key, serialize(getSaveData()));
  if (isNew) {
    const saveSelect = document.getElementById("save-select");
    saveSelect.appendChild(createOptionElement(key));
    saveSelect.value = key;
    updateSaveNames();
  }
}

function load() {
  let key = document.getElementById("save-select").value;
  data = deserialize(window.localStorage.getItem(key));
  if (data === null) {
    console.error("Unable to load data with key: " + key + " from storage.");
    return;
  }
  loadSaveData(data);
}

function deleteSave() {
  let key = document.getElementById("save-select").value;
  if (!window.confirm("Deleting save " + key + ".")) {
    return;
  }
  window.localStorage.removeItem(key);
  const saveOption = document.getElementById("save-" + key);
  if (saveOption && saveOption.parentNode) {
    saveOption.parentNode.removeChild(saveOption);
  }
  updateSaveNames();
}

window.addEventListener("DOMContentLoaded", function () {
  const STATS = ["hp", "atk", "def", "spd"];
  const FIELDS = ["weapon", "symbol", "destiny"];

  for (let num = 1; num <= 8; num++) {
    const nameNode = document.getElementById("character" + num + "name");
    const limitbreakvalueNode = document.getElementById("char" + num + "limitbreakvalue");
    const team = getTeam(num);

    nameNode.addEventListener("change", changeCharacter);

    for (const status of STATS) {
      const totalNode = document.getElementById("char" + num + "total" + status);
      const fieldNodes = FIELDS.map(function (field) {
        return document.getElementById("char" + num + field + status);
      });
      const buffNode = document.getElementById("char" + num + "buff" + status);
      const magNode = document.getElementById(team + "mag" + status);

      const targetNodes = [nameNode, limitbreakvalueNode, buffNode, magNode]
        .concat(fieldNodes)
        .filter(Boolean);
      for (const node of targetNodes) {
        node.addEventListener("change", function () {
          if (nameNode.value !== "none") {
            const base = characterStats[nameNode.value].stats[limitbreakvalueNode.value][status];
            const add = fieldNodes
              .concat(magNode)
              .map(function (fieldNode) { return Number(fieldNode.value); })
              .reduce(function (sum, value) { return sum + value; }, 0);
            const multi = buffNode ? ((Number(buffNode.value) + 100) / 100) : 1;
            totalNode.textContent = (base + add) * multi;
          }
        });
      }
    }

    if (nameNode.value !== "none") {
      const event = document.createEvent("Event");
      event.initEvent("change", false, true);
      nameNode.dispatchEvent(event);
    }
  }

  const saveSelect = document.getElementById("save-select");
  const saveOptions = document.createDocumentFragment();
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    saveOptions.appendChild(createOptionElement(key));
  }
  saveSelect.appendChild(saveOptions);

  saveSelect.addEventListener("change", updateSaveNames);
  updateSaveNames();
});
