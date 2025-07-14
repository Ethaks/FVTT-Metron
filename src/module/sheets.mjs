// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import { convertItem } from "./documents/item.mjs";
import { convertActor } from "./documents/actor.mjs";
import { convertScene } from "./documents/scene.mjs";
import { convertJournalEntry } from "./documents/journal.mjs";
import { MODULE_ID, UNIT_SYSTEMS } from "./utils.mjs";

/**
 * A hook callback that adds a "Convert" button to the header of a document sheet
 *
 * @param {DocumentSheet} sheet
 * @param {ApplicationHeaderButton[]} buttons
 */
export const onSheetHeaderButtonsV2 = (sheet, buttons) => {
	if (sheet.isEditable) {
		buttons.unshift({
			class: "metron-convert",
			icon: "fas fa-pencil-ruler",
			label: "METRON.Convert",
			/**
			 * Callback for the "Convert" button
			 *
			 * @param {MouseEvent<HTMLElement>} event
			 * @returns {Promise<void>}
			 */
			onClick: async (event) => {
				const defaultTarget = game.settings.get(MODULE_ID, "targetUnitSystem");
				const reverseTarget =
					defaultTarget === UNIT_SYSTEMS.METRIC
						? UNIT_SYSTEMS.IMPERIAL
						: UNIT_SYSTEMS.METRIC;
				const options = {
					target: event.shiftKey ? reverseTarget : defaultTarget,
				};
				switch (sheet.document.documentName) {
					case "Item":
						return convertItem(sheet.document, {
							...options,
							convertContents: true,
						}).then(() => sheet.render());
					case "Actor":
						return convertActor(sheet.document, options).then(() => sheet.render());
					case "Scene":
						return convertScene(sheet.document, options);
					// case "JournalEntry":
					// 	return convertJournalEntry(sheet.document, options);
				}
			},
		});
	}
};

export const onSheetHeaderButtons = (sheet, buttons) => {
	if (sheet.isEditable) {
		buttons.unshift({
			class: "metron-convert",
			icon: "fas fa-pencil-ruler",
			label: "METRON.Convert",
			/**
			 * Callback for the "Convert" button
			 *
			 * @param {MouseEvent<HTMLElement>} event
			 * @returns {Promise<void>}
			 */
			onclick: async (event) => {
				const defaultTarget = game.settings.get(MODULE_ID, "targetUnitSystem");
				const reverseTarget =
					defaultTarget === UNIT_SYSTEMS.METRIC
						? UNIT_SYSTEMS.IMPERIAL
						: UNIT_SYSTEMS.METRIC;
				const options = {
					target: event.shiftKey ? reverseTarget : defaultTarget,
				};
				switch (sheet.object.documentName) {
					case "Item":
						return convertItem(sheet.object, {
							...options,
							convertContents: true,
						}).then(() => sheet.render());
					case "Actor":
						return convertActor(sheet.object, options).then(() => sheet.render());
					case "Scene":
						return convertScene(sheet.object, options);
					case "JournalEntry":
						return convertJournalEntry(sheet.object, options);
				}
			},
		});
	}
};
