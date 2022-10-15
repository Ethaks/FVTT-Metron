// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import {
  convertDistance,
  convertWeight,
  getConversionOptions,
  getOtherUnit,
  getUnitFromString,
  MODULE_ID,
  setSystemProperty,
} from "../utils.mjs";
import { convertString } from "../strings.mjs";

/**
 *
 * @param {object} data
 * @param {ConversionOptions} [options] - Options for conversion
 */
export const convertItemData = (data, options = {}) => {
  const updateData = {};
  const { target } = getConversionOptions(options);

  // If the item has a weight, convert it to the other system
  const systemData = data.system ?? data.data;
  if (systemData.weight != null) {
    /** @type {UnitSystem} */
    const currentUnitSystem = data.flags[MODULE_ID]?.unitSystem ?? "imperial";
    if (!(target !== null && currentUnitSystem === target)) {
      /** @type {WeightUnit} */
      const currentUnits = currentUnitSystem === "imperial" ? "lbs" : "kg";
      setSystemProperty(updateData, "weight", convertWeight(systemData.weight, currentUnits));
      foundry.utils.setProperty(
        updateData,
        `flags.${MODULE_ID}.unitSystem`,
        currentUnitSystem === "imperial" ? "metric" : "imperial",
      );
    }
  }

  // Ability range
  if (systemData.range) {
    const units = getUnitFromString(systemData.range.units ?? "");
    // Only handle metric/imperial units, not touch etc.
    if (units) {
      setSystemProperty(updateData, "range.units", getOtherUnit(units));
      setSystemProperty(updateData, "range.value", convertDistance(systemData.range.value, units));
      setSystemProperty(updateData, "range.long", convertDistance(systemData.range.long, units));
    }
  }

  // Target data
  if (systemData.target) {
    const units = getUnitFromString(systemData.target.units ?? "");
    // Only handle metric/imperial units, not touch etc.
    if (units) {
      setSystemProperty(updateData, "target.units", getOtherUnit(units));
      setSystemProperty(
        updateData,
        "target.value",
        convertDistance(systemData.target.value, units),
      );
    }
  }

  // Description
  if (systemData.description) {
    for (const field of ["value", "unidentified"]) {
      const value = systemData.description[field];
      if (!value) continue;
      const convertedString = convertString(value, options);
      if (convertedString !== value)
        setSystemProperty(updateData, `description.${field}`, convertedString);
    }
  }

  return updateData;
};

export const convertItem = async (item, options = {}) => {
  const itemData = item.toObject();
  const updateData = convertItemData(itemData, options);
  await item.update(updateData);
};
