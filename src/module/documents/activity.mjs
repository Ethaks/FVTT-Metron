import { convertString } from "../strings.mjs";
import {
  convertDistance,
  getConversionOptions,
  getOtherUnit,
  getUnitFromString,
  getUnitSystem,
} from "../utils.mjs";

/**
 * Convert an activity's data (i.e. all candidate fields for unit conversion).
 *
 * @param {object} data
 * @param {ConversionOptions} [options] - Options for conversion
 * @returns {object} The converted data
 */
export const convertActivityData = (data, options = {}) => {
  const updateData = {};
  const { target } = getConversionOptions(options);

  // Description
  if (data.description?.chatFlavor) {
    updateData.description = {
      chatFlavor: convertString(data.description.chatFlavor, options),
    };
  }

  // Range
  if (data.range.override && data.range?.units) {
    const units = getUnitFromString(data.range.units);
    const unitSystem = getUnitSystem(units);
    if (unitSystem !== target) {
      updateData.range = {
        units: getOtherUnit(units),
        value: convertDistance(data.range.value, units),
      };
    }
  }

  // Target
  if (data.target?.template?.units) {
    const units = getUnitFromString(data.target.template.units);
    const unitSystem = getUnitSystem(units);
    const value = data.target.template.size || 0;
    if (unitSystem !== target && Number.isNumeric(value)) {
      updateData.target ??= {};
      updateData.target.template = {
        units: getOtherUnit(units),
        size: `${convertDistance(Number.fromString(value), units)}`,
      };
    }
  }

  return updateData;
};
