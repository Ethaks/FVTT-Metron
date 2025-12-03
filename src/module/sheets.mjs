// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import { convertItem } from "./documents/item.mjs";
import { convertActor } from "./documents/actor.mjs";
import { convertScene } from "./documents/scene.mjs";
import { convertJournalEntry } from "./documents/journal.mjs";
import { MODULE_ID, UNIT_SYSTEMS } from "./utils.mjs";

/**
 * @import JournalSheet from "@foundry/client/appv1/sheets/journal-sheet.mjs";
 * @import { ApplicationV1HeaderButton } from "@foundry/client/appv1/api/application-v1.mjs";
 * @import DocumentSheet from "@foundry/client/applications/api/document-sheet.mjs";
 * @import { ApplicationHeaderControlsEntry } from "@foundry/client/applications/_types.mjs";
 */

/**
 * A hook callback that adds a "Convert" button to the header of a document sheet
 *
 * @param {JournalSheet | DocumentSheet} sheet - The sheet for which buttons are being added
 * @param {ApplicationV1HeaderButton[] | ApplicationHeaderControlsEntry[]} buttons
 */
export const onSheetHeaderButtons = (sheet, buttons) => {
	if (sheet.isEditable) {
		buttons.unshift({
			class: "metron-convert",
			icon: "fas fa-pencil-ruler",
			label: "METRON.Convert",
			ownership: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
			onClick: (event) => onSheetHeaderButtonClick(sheet, event),
			// NOTE: AppV1 compatibility for JournalSheets; can be removed with dnd5e 5.1
			onclick: (event) => onSheetHeaderButtonClick(sheet, event),
		});
	}
};

/**
 * Callback for the "Convert" button, converting the document to the target unit system.
 *
 * @param {JournalSheet | DocumentSheet} sheet
 * @param {PointerEvent} event
 * @returns {Promise<void>}
 */
const onSheetHeaderButtonClick = async (sheet, event) => {
	const defaultTarget = game.settings.get(MODULE_ID, "targetUnitSystem");
	const reverseTarget =
		defaultTarget === UNIT_SYSTEMS.METRIC ? UNIT_SYSTEMS.IMPERIAL : UNIT_SYSTEMS.METRIC;
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
		case "JournalEntry":
			return convertJournalEntry(sheet.document, options);
	}
};
