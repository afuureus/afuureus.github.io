function changeCharacter(event) {
  var imgNode = event.target.parentNode.parentNode.getElementsByClassName("charicon")[0];
  imgNode.setAttribute("src", "thumbs/character_" + event.target.value + "_thumb.png");
}

function swap() {
  document.getElementById("law").classList.toggle("inactive_team");
  document.getElementById("chaos").classList.toggle("inactive_team");
}

function getTeam(num) {
  if (num <= 4) {
    return "law";
  }
  return "chaos";
}

window.addEventListener("DOMContentLoaded", function () {
  const stats = ["hp", "atk", "def", "spd"];
  const fields = ["weapon", "symbol", "destiny"];

  for (let num = 1; num <= 8; num++) {
    const nameNode = document.getElementById("character" + num + "name");
    const limitbreakvalueNode = document.getElementById("char" + num + "limitbreakvalue");
    const team = getTeam(num);

    nameNode.addEventListener("change", changeCharacter);

    for (const status of stats) {
      const totalNode = document.getElementById("char" + num + "total" + status);
      const fieldNodes = fields.map(function (field) {
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
            const base = stats[nameNode.value].stats[limitbreakvalueNode.value][status];
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
});
