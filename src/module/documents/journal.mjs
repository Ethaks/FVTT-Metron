// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import { getConversionOptions } from "../utils.mjs";
import { convertString } from "../strings.mjs";

/**
 * Converts a JournalEntry's data
 *
 * @param {object} journalEntry
 * @param {Partial<ConversionOptions>} [options={}] - Options for conversion
 */
export const convertJournalEntryData = (journalEntry, options = {}) => {
	const updateData = {};
	options ??= getConversionOptions(options);

	// v9 compatibility
	if (game.release.generation < 10) {
		const content = journalEntry.content;
		if (!content) return updateData;
		const convertedString = convertString(content, options);
		if (convertedString !== content) {
			updateData.content = convertedString;
			updateData._id = journalEntry._id;
		}
		return updateData;
	} else {
		if (journalEntry.pages) {
			updateData.pages = journalEntry.pages
				.map((page) => {
					const pageData =
						page instanceof CONFIG.JournalEntry.documentClass ? page.toObject() : page;
					const pageUpdateData = {};
					if (pageData.type === "text" && pageData.text.content) {
						const convertedString = convertString(pageData.text.content, options);
						if (convertedString !== pageData.text.content)
							foundry.utils.setProperty(
								pageUpdateData,
								"text.content",
								convertedString,
							);
					}
					if (foundry.utils.isEmpty(pageUpdateData)) return null;
					return { _id: page._id, ...pageUpdateData };
				})
				.filter(Boolean);
		}

		return updateData;
	}
};

export const convertJournalEntry = async (journalEntry, options) => {
	const journalEntryData = journalEntry.toObject();
	const updateData = convertJournalEntryData(journalEntryData, options);
	await journalEntry.update(updateData);
};
