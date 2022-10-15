// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import * as languages from "./languages/languages.mjs";

/** The module's id/name */
export const MODULE_ID = "metron";

/**
 * Converts a distance value from one system to another
 *
 * @param {number} value - The value to convert
 * @param {DistanceUnit} unit - Current unit of the value
 * @returns {number} The converted value
 */
export const convertDistance = (value, unit) => {
  switch (unit) {
    case UNITS.FEET:
      return Math.round((value / 5) * 1.5 * 100) / 100;
    case UNITS.MILE:
      return Math.round(value * 1.5 * 100) / 100;
    case UNITS.METER:
      return Math.round((value / 1.5) * 5 * 100) / 100;
    case UNITS.KM:
      return Math.round((value / 1.5) * 100) / 100;
  }
  throw new Error(`Unknown unit: ${unit}`);
};

/**
 * Converts a weight value from one system to another
 *
 * @param {number} value - The value to convert
 * @param {WeightUnit} unit - Current unit of the value
 * @returns {number} The converted value
 */
export const convertWeight = (value, unit = UNITS.LBS) => {
  switch (unit) {
    case UNITS.LBS:
      return Math.round((value / 2) * 100) / 100;
    case UNITS.KG:
      return Math.round(value * 2 * 100) / 100;
  }
  throw new Error(`Unknown unit: ${unit}`);
};

/**
 * An enum of imperial units
 *
 * @enum {ImperialUnit}
 * @readonly
 */
export const IMPERIAL_UNITS = Object.freeze({
  LBS: "lbs",
  FEET: "ft",
  MILE: "mi",
});
/** @typedef {"lbs" | "ft" | "mi"} ImperialUnit */

/**
 * An enum of metric units
 *
 * @enum {MetricUnit}
 * @readonly
 */
export const METRIC_UNITS = Object.freeze({
  KG: "kg",
  METER: "m",
  KM: "km",
});
/** @typedef {"kg" | "m" | "km"} MetricUnit */

/** @typedef {ImperialUnit | MetricUnit} Unit */
/** @typedef {"ft" | "mi" | "m" | "km"} DistanceUnit */
/** @typedef {"lbs" | "kg"} WeightUnit */

/**
 * An enum containing available units
 *
 * @enum {Unit}
 * @readonly
 */
export const UNITS = Object.freeze({
  ...IMPERIAL_UNITS,
  ...METRIC_UNITS,
});

/**
 * An enum containing available unit systems
 *
 * @enum
 * @readonly
 */
export const UNIT_SYSTEMS = Object.freeze({
  METRIC: "metric",
  IMPERIAL: "imperial",
});

/** @typedef {"metric" | "imperial"} UnitSystem */

/**
 *
 * @param unit
 * @returns {UnitSystem | null}
 */
export const getUnitSystem = (unit) => {
  if (Object.values(IMPERIAL_UNITS).includes(unit)) return UNIT_SYSTEMS.IMPERIAL;
  if (Object.values(METRIC_UNITS).includes(unit)) return UNIT_SYSTEMS.METRIC;
  return null;
};

/**
 * Returns whether a unit is a weight unit
 *
 * @param {Unit} unit
 * @returns {boolean}
 */
export const isWeightUnit = (unit) => unit === UNITS.LBS || unit === UNITS.KG;

/**
 * Returns a units paired unit from the other {@link UnitSystem}
 *
 * @param {Unit} unit
 * @returns {MetricUnit|ImperialUnit}
 */
export const getOtherUnit = (unit) => {
  if (unit === UNITS.LBS) return UNITS.KG;
  if (unit === UNITS.FEET) return UNITS.METER;
  if (unit === UNITS.MILE) return UNITS.KM;
  if (unit === UNITS.KG) return UNITS.LBS;
  if (unit === UNITS.METER) return UNITS.FEET;
  if (unit === UNITS.KM) return UNITS.MILE;
};

/**
 * A record of regular expressions to match against a string to determine if it is a unit.
 * Only contains English units, as other languages are added dynamically from {@link languages}
 *
 * @enum {RegExp[]}
 */
const unitRegexes = {
  lbs: [/lbs?/, /pounds?/],
  kg: [/kgs?/, /kilograms?/],
  ft: [/ft/, /foot/, /feet/],
  mi: [/mi/, /miles?/],
  km: [/kms?/, /kilometers?/, /kilometres?/],
  m: [/m/, /meters?/, /metres?/],
};

/**
 * Determines whether a string is a unit, returning the unit if it is
 *
 * @param {string} string - The string to check
 * @returns {[Unit | null, string?]} A tuple containing either the {@link Unit} or null, and the string as it was matched
 */
export const getUnitMatchFromString = (string) => {
  const lang = game.i18n.lang;
  const langRegexes = languages[lang]?.unitRegexes ?? {};

  for (const [unit, regexes] of Object.entries(unitRegexes)) {
    for (const regex of [...regexes, ...(langRegexes[unit] ?? [])]) {
      const [match] = string.match(regex) ?? [];
      if (match && string.startsWith(match)) return [unit, match];
    }
  }
  return [null];
};

/**
 * Determines whether a string is a unit, returning the unit if it is
 *
 * @param {string} string - The string to check
 * @returns {Unit | null} The unit, or null if the given string is not a unit
 */
export const getUnitFromString = (string) => getUnitMatchFromString(string)[0];

/**
 * Localizes a string using Foundry's language files, prefixing the string with the module's id
 *
 * @param {string} key - The key to localize
 * @param {object} [data={}] - Data to pass to the localization
 * @returns {string} The localized string
 */
export const localize = (key, data = {}) => {
  return game.i18n.format(`${MODULE_ID.toLocaleUpperCase()}.${key}`, data);
};

/**
 * Sets a value using a data path in an object, prefixing the path with this Foundry version's path for system data.
 *
 * @see {@link foundry.utils.setProperty}
 * @param {object} data
 * @param {string} path
 * @param {*} value
 * @returns {boolean}
 */
export const setSystemProperty = (data, path, value) => {
  const isV10 = game.release.generation > 9;
  const systemPrefix = isV10 ? "system." : "data.";
  return foundry.utils.setProperty(data, systemPrefix + path, value);
};

/**
 * Gets a value using a data path in an object, prefixing the path with this Foundry version's path for system data.
 *
 * @param {object} data
 * @param {string} path
 * @returns {*}
 */
export const getSystemProperty = (data, path) => {
  const isV10 = game.release.generation > 9;
  const systemPrefix = isV10 ? "system." : "data.";
  return foundry.utils.getProperty(data, systemPrefix + path);
};

/**
 * @typedef {object} ConversionOptions
 * @property {null | UnitSystem} [target=null] - The unit system to convert to; if null, convert to the other system;
 *   if defined, values already belonging to that system will not be converted.
 * @property {null | UnitSystem} [current=null] - The unit system to convert from; if null, convert from the other system;
 */

/**
 * Merges a partial options object into a full options object
 *
 * @param {Partial<ConversionOptions>} [options={}] - A set of options to be merged into the default options
 * @returns {ConversionOptions} A full conversion options object
 */
export const getConversionOptions = (options = {}) => {
  const defaults = {
    target: game.settings?.get(MODULE_ID, "targetUnitSystem") ?? "metric",
    current: null,
  };
  return {
    ...defaults,
    ...options,
  };
};
