// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import { convertItemData } from "./item.mjs";
import {
  convertDistance,
  getConversionOptions,
  getOtherUnit,
  getSystemProperty,
  getUnitFromString,
  getUnitSystem,
  setSystemProperty,
} from "../utils.mjs";
import { convertString } from "../strings.mjs";

const actorDetailFields = ["appearance", "trait", "biography.value", "ideal", "bond", "flaw"].map(
  (field) => `details.${field}`,
);

/**
 * Converts all data belonging to an actor to the other unit system.
 *
 * @param {object} actor - An actor's data object
 * @param {ConversionOptions} [options] - Options for conversion
 * @returns {object} The update data
 */
export const convertActorData = (actor, options = {}) => {
  const updateData = {};
  const { target } = getConversionOptions(options);

  // Items
  if (actor.items) {
    updateData.items = actor.items
      ?.map((item) => {
        const itemData = item instanceof CONFIG.Item.documentClass ? item.toObject() : item;
        const itemUpdateData = convertItemData(itemData, options);
        if (foundry.utils.isObjectEmpty(itemUpdateData)) return null;
        return { _id: item._id, ...itemUpdateData };
      })
      .filter(Boolean);
  }

  // Text fields
  for (const field of actorDetailFields) {
    const value = getSystemProperty(actor, field);
    if (!value) continue;
    const convertedString = convertString(value, options);
    if (convertedString !== value) setSystemProperty(updateData, field, convertedString);
  }

  // Senses and Movement
  for (const field of ["senses", "movement"]) {
    const fieldData = getSystemProperty(actor, `attributes.${field}`);
    if (fieldData) {
      const units = getUnitFromString(fieldData.units);
      if (getUnitSystem(units) !== target) {
        setSystemProperty(updateData, `attributes.${field}.units`, getOtherUnit(units));
        const dataFields = Object.keys(fieldData);
        for (const dataField of dataFields) {
          if (fieldData[dataField] && typeof fieldData[dataField] === "number") {
            setSystemProperty(
              updateData,
              `attributes.${field}.${dataField}`,
              convertDistance(fieldData[dataField], units),
            );
          }
        }
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
