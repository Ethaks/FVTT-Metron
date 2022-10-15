// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import {
  convertDistance,
  convertWeight,
  getConversionOptions,
  getOtherUnit,
  getUnitMatchFromString,
  getUnitSystem,
  isWeightUnit,
  localize,
  MODULE_ID,
} from "./utils.mjs";

// A regular expression matching strings like "1 lb" or "1.5lbs"
const valueWithDecimalDot =
  /([\d１２３４５６７８９０,]+\.?[\d１２３４５６７８９０]*)([\s-]?)(\p{L}*)/gmu;
const valueWithDecimalComma =
  /([\d１２３４５６７８９０.]+,?[\d１２３４５６７８９０]*)([\s-]?)(\p{L}*)/gmu;

/**
 * Converts all instances of units in a string to the other unit system,
 * or a specific unit system if specified.
 *
 * @param {string} value
 * @param {ConversionOptions} [options] - Options for conversion
 * @returns {string} The converted value
 */
export const convertString = (value, options = {}) => {
  const { target } = getConversionOptions(options);
  const decimalSeparator = game.settings?.get(MODULE_ID, "decimalSeparator") ?? "dot";
  return value.replaceAll(
    decimalSeparator === "dot" ? valueWithDecimalDot : valueWithDecimalComma,
    (match, number, separator, maybeUnit) => {
      const [unit, unitMatch] = getUnitMatchFromString(maybeUnit);

      // No unit is recognised, leave string as-is
      if (!unit) return match;

      const unitSystem = getUnitSystem(unit);
      // If the unit is already in the target system, leave string as-is
      if (unitSystem === target) return match;

      // Normalise possibly full-width numbers
      const numberValue = Number(
        number.replace(decimalSeparator === "dot" ? "," : ".", "").normalize("NFKC"),
      );

      const convertedValue = isWeightUnit(unit)
        ? convertWeight(numberValue, unit)
        : convertDistance(numberValue, unit);
      // HACK: This assumes that the first three characters of a unit's long and short forms differ
      const isLongUnit = maybeUnit.slice(0, 3) === localize(`UnitsLong.${unit}`).slice(0, 3);
      const localizedOtherUnit = isLongUnit
        ? localize(`UnitsLong.${getOtherUnit(unit)}`)
        : localize(`UnitsShort.${getOtherUnit(unit)}`);
      return `${convertedValue}${separator ? separator : ""}${maybeUnit.replace(
        unitMatch,
        localizedOtherUnit,
      )}`;
    },
  );
};
