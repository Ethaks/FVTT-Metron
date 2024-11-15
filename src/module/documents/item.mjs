// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import {
	convertDistance,
	convertWeight,
	getConversionOptions,
	getOtherUnit,
	getUnitFromString,
	getUnitSystem,
	MODULE_ID,
} from "../utils.mjs";
import { convertString } from "../strings.mjs";
import { convertActivityData } from "./activity.mjs";
import { convertDistanceField } from "./common.mjs";

/**
 *
 * @param {object} data
 * @param {ConversionOptions} [options] - Options for conversion
 */
export const convertItemData = (data, options = {}) => {
	const updateData = { system: {} };
	const { target } = getConversionOptions(options);

	const systemData = data.system ?? data.data;
	/** @type {UnitSystem} */
	const currentUnitSystem = data.flags[MODULE_ID]?.unitSystem ?? "imperial";
	if (!(target !== null && currentUnitSystem === target)) {
		foundry.utils.setProperty(
			updateData,
			`flags.${MODULE_ID}.unitSystem`,
			currentUnitSystem === "imperial" ? "metric" : "imperial",
		);
	}

	// Race
	if (data.type === "race") {
		for (const field of ["senses", "movement"]) {
			if (!systemData[field]) continue;
			updateData.system[field] = convertDistanceField(systemData[field], target);
		}
	}

	// If the item has a weight, convert it to the other system
	if (systemData.weight?.value) {
		const units = getUnitFromString(systemData.weight.units ?? "");
		if (units && getUnitSystem(units) !== target) {
			updateData.system.weight = {
				units: getOtherUnit(units),
				value: convertWeight(systemData.weight.value, units),
			};
		}
	}

	// Ability range
	if (systemData.range && !(systemData.range.units in CONFIG.DND5E.rangeTypes)) {
		const units = getUnitFromString(systemData.range.units ?? "");
		// Only handle metric/imperial units, not touch etc.
		if (units && getUnitSystem(units) !== target) {
			updateData.system.range = {
				units: getOtherUnit(units),
				value: convertDistance(systemData.range.value, units),
				long: convertDistance(systemData.range.long, units),
			};
		}
	}

	// Target
	if (systemData.target?.template?.units) {
		const units = getUnitFromString(systemData.target.template.units);
		const unitSystem = getUnitSystem(units);
		const value = systemData.target.template.size || 0;
		if (unitSystem !== target && Number.isNumeric(value)) {
			updateData.system.target ??= {};
			updateData.system.target.template = {
				units: getOtherUnit(units),
				size: `${convertDistance(Number.fromString(value), units)}`,
			};
		}
	}

	// Description
	if (systemData.description) {
		for (const field of ["value", "unidentified"]) {
			const value = systemData.description[field];
			if (!value) continue;
			const convertedString = convertString(value, options);
			if (convertedString !== value)
				updateData.system[`description.${field}`] = convertedString;
		}
	}

	// Activities
	if (!foundry.utils.isEmpty(systemData.activities)) {
		for (const [id, activity] of Object.entries(systemData.activities)) {
			// Convert the activity data
			const convertedActivity = convertActivityData(activity, options);
			if (!foundry.utils.isEmpty(convertedActivity)) {
				updateData.system.activities ??= {};
				updateData.system.activities[id] = convertedActivity;
			}
		}
	}

	return updateData;
};

export const convertItem = async (item, options = {}) => {
	const itemData = item.toObject();
	const updateData = convertItemData(itemData, options);

	if (item.type !== "container") return item.update(updateData);

	// Handle container content sibling items
	if (item.type === "container" && options.convertContents) {
		const itemUpdates = [{ _id: item.id, ...updateData }];

		for (const content of await item.system.allContainedItems) {
			const contentData = content.toObject();
			const contentUpdate = convertItemData(contentData, options);
			itemUpdates.push({ _id: content.id, ...contentUpdate });
		}

		if (item.isEmbedded) return item.parent.updateEmbeddedDocuments("Item", itemUpdates);
		else if (item.pack)
			return Item.implementation.updateDocuments(itemUpdates, {
				pack: item.pack,
			});
		else return Item.implementation.updateDocuments(itemUpdates);
	}
};
