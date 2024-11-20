// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import { convertItemData } from "./item.mjs";
import {
	getConversionOptions,
	getUnitFromString,
	getUnitSystem,
	MODULE_ID,
	UNIT_SYSTEMS,
	UNITS,
} from "../utils.mjs";
import { convertString } from "../strings.mjs";
import { convertTokenVisionData } from "./scene.mjs";
import { convertDistanceField } from "./common.mjs";

/**
 * An array of dot separated paths to string properties that should be converted for normal actors.
 *
 * @type {string[]}
 */
const actorDetailFields = ["appearance", "trait", "biography.value", "ideal", "bond", "flaw"].map(
	(field) => `details.${field}`,
);

/**
 * An array of dot separated paths to string properties that should be converted for party sheets.
 *
 * @type {string[]}
 */
const partyDataFields = ["description.full"];

/**
 * Converts all data belonging to an actor to the other unit system.
 *
 * @param {object} actor - An actor's data object
 * @param {ConversionOptions} [options] - Options for conversion
 * @returns {object} The update data
 */
export const convertActorData = (actor, options = {}) => {
	const updateData = { system: {} };
	const { target } = getConversionOptions(options);

	// Items
	if (actor.items) {
		updateData.items = actor.items?.map((item) => {
			const itemData = item instanceof CONFIG.Item.documentClass ? item.toObject() : item;
			const itemUpdateData = convertItemData(itemData, options);
			if (foundry.utils.isEmpty(itemUpdateData)) return itemData;
			return foundry.utils.mergeObject(itemData, itemUpdateData);
		});
	}

	// Text fields
	for (const field of [...actorDetailFields, ...partyDataFields]) {
		const value = foundry.utils.getProperty(actor.system, field);
		if (!value) continue;
		const convertedString = convertString(value, options);
		if (convertedString !== value) updateData.system[field] = convertedString;
	}

	// Senses and Movement (if not set by race)
	if (!actor.items.some((i) => i.type === "race")) {
		updateData.system.attributes ??= {};
		for (const field of ["senses", "movement"]) {
			const fieldData = actor.system?.attributes?.[field];
			updateData.system.attributes[field] = convertDistanceField(fieldData, target);
		}
	}

	// Prototype token
	const prototypeToken = actor.prototypeToken;
	if (prototypeToken) {
		const movementUnits = actor.system.attributes.movement.units;
		const sensesUnits = actor.system.attributes.senses.units;
		if (movementUnits || sensesUnits) {
			const inferredUnitSystem = getUnitSystem(
				getUnitFromString(movementUnits ?? sensesUnits),
			);

			const currentUnitSystem =
				actor.flags[MODULE_ID]?.unitSystem ?? inferredUnitSystem ?? UNIT_SYSTEMS.IMPERIAL;
			const tokenUpdateData = convertTokenVisionData(prototypeToken, {
				current: currentUnitSystem === UNIT_SYSTEMS.IMPERIAL ? UNITS.FEET : UNITS.METER,
				...options,
			});
			if (!foundry.utils.isEmpty(tokenUpdateData)) {
				updateData.prototypeToken = tokenUpdateData;
				foundry.utils.setProperty(updateData, `flags.${MODULE_ID}.unitSystem`, target);
			}
		}
	}

	return updateData;
};

export const convertActor = async (actor, options) => {
	const actorData = actor.toObject();
	const updateData = convertActorData(actorData, options);
	await actor.update(updateData);
};
