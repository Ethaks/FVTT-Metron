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
  isEmpty,
  MODULE_ID,
  setSystemProperty,
  UNIT_SYSTEMS,
  UNITS,
} from "../utils.mjs";
import { convertString } from "../strings.mjs";
import { convertTokenVisionData } from "./scene.mjs";

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
  const updateData = {};
  const { target } = getConversionOptions(options);

  // Items
  if (actor.items) {
    updateData.items = actor.items?.map((item) => {
      const itemData = item instanceof CONFIG.Item.documentClass ? item.toObject() : item;
      const itemUpdateData = convertItemData(itemData, options);
      if (isEmpty(itemUpdateData)) return itemData;
      return foundry.utils.mergeObject(itemData, itemUpdateData);
    });
  }

  // Text fields
  for (const field of [...actorDetailFields, ...partyDataFields]) {
    const value = getSystemProperty(actor, field);
    if (!value) continue;
    const convertedString = convertString(value, options);
    if (convertedString !== value) setSystemProperty(updateData, field, convertedString);
  }

  // Senses and Movement
  for (const field of ["senses", "movement"]) {
    const fieldData = getSystemProperty(actor, `attributes.${field}`);
    if (fieldData && fieldData.units) {
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

  // Prototype token
  const prototypeToken = game.release.generation < 10 ? actor.token : actor.prototypeToken;
  if (prototypeToken) {
    const movementUnits = getSystemProperty(actor, "attributes.movement.units");
    const sensesUnits = getSystemProperty(actor, "attributes.senses.units");
    if (movementUnits || sensesUnits) {
      const inferredUnitSystem = getUnitSystem(getUnitFromString(movementUnits ?? sensesUnits));

      const currentUnitSystem =
        actor.flags[MODULE_ID]?.unitSystem ?? inferredUnitSystem ?? UNIT_SYSTEMS.IMPERIAL;
      const tokenUpdateData = convertTokenVisionData(prototypeToken, {
        current: currentUnitSystem === UNIT_SYSTEMS.IMPERIAL ? UNITS.FEET : UNITS.METER,
        ...options,
      });
      if (!isEmpty(tokenUpdateData)) {
        if (game.release.generation < 10) {
          updateData.token = tokenUpdateData;
        } else {
          updateData.prototypeToken = tokenUpdateData;
        }
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
