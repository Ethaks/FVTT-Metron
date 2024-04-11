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
    /** @type {WeightUnit} */
    const currentUnits = currentUnitSystem === "imperial" ? "lbs" : "kg";
    foundry.utils.setProperty(
      updateData,
      `flags.${MODULE_ID}.unitSystem`,
      currentUnitSystem === "imperial" ? "metric" : "imperial",
    );

    // Race
    if (data.type === "race") {
      for (const field of ["senses", "movement"]) {
        if (!systemData[field] || !systemData[field].units) continue;
        const units = getUnitFromString(systemData[field].units ?? "");
        if (getUnitSystem(units) === target) continue;
        updateData.system[field] ??= {};
        updateData.system[field].units = getOtherUnit(units);
        for (const key of Object.keys(systemData[field])) {
          if (typeof systemData[field][key] === "number") {
            updateData.system[field][key] = convertDistance(systemData[field][key], units);
          }
        }
      }
    }

    // If the item has a weight, convert it to the other system
    // TODO: Repeatedly converting item without weight
    if (systemData.weight != null) {
      updateData.weight = convertWeight(systemData.weight, currentUnits);
    }
  }

  // Ability range
  if (systemData.range) {
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

  // Target data
  if (systemData.target) {
    const units = getUnitFromString(systemData.target.units ?? "");
    // Only handle metric/imperial units, not touch etc.
    if (units && getUnitSystem(units) !== target) {
      updateData.system.target = {
        units: getOtherUnit(units),
        value: convertDistance(systemData.target.value, units),
      };
    }
  }

  // Description
  if (systemData.description) {
    for (const field of ["value", "unidentified"]) {
      const value = systemData.description[field];
      if (!value) continue;
      const convertedString = convertString(value, options);
      if (convertedString !== value) updateData.system[`description.${field}`] = convertedString;
    }
  }

  return updateData;
};

export const convertItem = async (item, options = {}) => {
  const itemData = item.toObject();
  const updateData = convertItemData(itemData, options);
  await item.update(updateData);
};
