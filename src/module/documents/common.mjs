// SPDX-FileCopyrightText: 2024 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import { convertDistance, getOtherUnit, getUnitFromString, getUnitSystem } from "../utils.mjs";

/**
 * Converts the data for a given senses/movement field, returning an object
 * suitable for merging into the update data.
 *
 * @param {object} field - The field data
 * @param {UnitSystem} target - The target unit system
 * @returns {object} The converted data
 */
export function convertDistanceField(field, target) {
  const units = getUnitFromString(
    field.units ?? Object.keys(CONFIG.DND5E.movementUnits)[0].toLowerCase(),
  );

  // No conversion required, field matches target system
  if (getUnitSystem(units) === target) return {};

  const updateData = {};
  updateData.units = getOtherUnit(units);
  for (const key of Object.keys(field)) {
    if (typeof field[key] === "number") {
      updateData[key] = convertDistance(field[key], units);
    }
  }
  return updateData;
}
