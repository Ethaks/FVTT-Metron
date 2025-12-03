// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

/**
 * Author: Ethaks
 * License: MIT
 */

// Import JavaScript modules
import * as settings from "./settings.mjs";
import * as item from "./documents/item.mjs";
import * as actor from "./documents/actor.mjs";
import * as scene from "./documents/scene.mjs";
import * as packs from "./documents/packs.mjs";
import * as journal from "./documents/journal.mjs";
import * as strings from "./strings.mjs";
import * as utils from "./utils.mjs";

// Import style sheet
import { onSheetHeaderButtons, onSheetHeaderButtonsV2 } from "./sheets.mjs";

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
	settings.registerSettings();

	CONFIG.compatibility?.excludePatterns?.push(/metron/);
});

Hooks.once("setup", () => {
	const moduleData = game.modules.get(utils.MODULE_ID);
	foundry.utils.setProperty(moduleData, "api", metron);

	// Override the system's default weight conversion rate with simplified one
	const overrideWeightConversion = game.settings.get(utils.MODULE_ID, "overrideWeightConversion");
	if (overrideWeightConversion) {
		settings.applyWeightConversionOverride(overrideWeightConversion);
	}
});

Hooks.once("ready", () => {
	if (game.settings.get(utils.MODULE_ID, "gridUnitSystem") === "metric") {
		const currentGridUnits = utils.getUnitFromString(game.system.grid.units);
		if (currentGridUnits === utils.UNITS.FEET && game.system.grid.distance === 5) {
			game.system.grid.units = utils.localize(`UnitsShort.${utils.UNITS.METER}`);
			game.system.grid.distance = 1.5;
		}
	}
});

// Header buttons
Hooks.on("getActorSheetHeaderButtons", onSheetHeaderButtons);
Hooks.on("getItemSheetHeaderButtons", onSheetHeaderButtons);
Hooks.on("getJournalSheetHeaderButtons", onSheetHeaderButtons);
Hooks.on("getSceneConfigHeaderButtons", onSheetHeaderButtons);

Hooks.on("getHeaderControlsActorSheetV2", onSheetHeaderButtonsV2);
Hooks.on("getHeaderControlsItemSheet5e", onSheetHeaderButtonsV2);
Hooks.on("getHeaderControlsSceneConfig", onSheetHeaderButtonsV2);

// Context menu buttons
Hooks.on("getCompendiumContextOptions", (html, buttons) => {
	buttons.push({
		name: "METRON.Convert",
		icon: '<i class="fas fa-pencil-ruler"></i>',
		callback: (li) => {
			const pack = game.packs.get(li.dataset.pack);
			if (pack) return packs.convertPack(pack);
		},
	});
});
Hooks.on("getSceneContextOptions", (html, buttons) => {
	buttons.push({
		name: "METRON.Convert",
		icon: '<i class="fas fa-pencil-ruler"></i>',
		callback: (li) => {
			const scene = game.scenes.get(li.dataset.entryId);
			if (scene) return metron.scene.convertScene(scene);
		},
	});
});
