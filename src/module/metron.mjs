// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

/**
 * Author: Ethaks
 * License: MIT
 */

// Import JavaScript modules
import { registerSettings } from "./settings.mjs";
import * as item from "./documents/item.mjs";
import * as actor from "./documents/actor.mjs";
import * as scene from "./documents/scene.mjs";
import * as packs from "./documents/packs.mjs";
import * as journal from "./documents/journal.mjs";
import * as strings from "./strings.mjs";
import * as utils from "./utils.mjs";

// Import style sheet
import "../styles/metron.css";
import { onSheetHeaderButtons } from "./sheets.mjs";

// API
export const metron = {
  item,
  actor,
  scene,
  packs,
  journal,
  strings,
  utils,
};

// Initialize module
Hooks.once("init", async () => {
  console.log(`${utils.MODULE_ID} | Initializing metron`);

  // Register custom module settings
  registerSettings();

  CONFIG.compatibility?.excludePatterns?.push(/metron/);
});

Hooks.once("setup", () => {
  const moduleData = game.modules.get(utils.MODULE_ID);
  foundry.utils.setProperty(moduleData, "api", metron);
});

Hooks.once("ready", () => {
  if (game.settings.get(utils.MODULE_ID, "gridUnitSystem") === "metric") {
    const currentGridUnits = utils.getUnitFromString(game.system.data.gridUnits);
    if (currentGridUnits === utils.UNITS.FEET && game.system.data.gridDistance === 5) {
      game.system.data.gridUnits = utils.localize(`UnitsShort.${utils.UNITS.METER}`);
      game.system.data.gridDistance = 1.5;
    }
  }
});

// Header buttons
Hooks.on("getActorSheetHeaderButtons", onSheetHeaderButtons);
Hooks.on("getItemSheetHeaderButtons", onSheetHeaderButtons);
Hooks.on("getJournalSheetHeaderButtons", onSheetHeaderButtons);
Hooks.on("getSceneConfigHeaderButtons", onSheetHeaderButtons);

// Context menu buttons
Hooks.on("getCompendiumDirectoryEntryContext", (html, buttons) => {
  buttons.push({
    name: "METRON.Convert",
    icon: '<i class="fas fa-pencil-ruler"></i>',
    callback: (li) => {
      const pack = game.packs.get(li.data("pack"));
      if (pack) return packs.convertPack(pack);
    },
  });
});
Hooks.on("getSceneDirectoryEntryContext", (html, buttons) => {
  buttons.push({
    name: "METRON.Convert",
    icon: '<i class="fas fa-pencil-ruler"></i>',
    callback: (li) => {
      const scene = game.scenes.get(li.data("documentId"));
      if (scene) return metron.scene.convertScene(scene);
    },
  });
});
