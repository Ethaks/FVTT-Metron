// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import {
  convertDistance,
  getConversionOptions,
  getOtherUnit,
  getUnitFromString,
  getUnitSystem,
} from "../utils.mjs";
import { convertActorData } from "./actor.mjs";

/**
 * Creates an object containing data with which a scene can be updated to convert its data
 * to a specific unit system.
 *
 * @param {object} scene - A scene's data object
 * @param {ConversionOptions} [options] - Options for conversion
 * @returns {object} The update data
 */
export const convertSceneData = (scene, options = {}) => {
  const updateData = {};
  const { target } = getConversionOptions(options);

  // Convert grid distance and units if necessary
  const currentGridUnits = scene.grid?.units ?? scene.gridUnits;
  const currentGridDistance = scene.grid?.distance ?? scene.gridDistance;
  const units = getUnitFromString(currentGridUnits);
  const currentSystem = getUnitSystem(units);
  if (units && currentSystem !== target) {
    if (game.release.generation < 10) {
      updateData.gridUnits = getOtherUnit(units);
      updateData.gridDistance = convertDistance(currentGridDistance, units);
    } else {
      updateData.grid = {
        units: getOtherUnit(units),
        distance: convertDistance(scene.grid.distance, units),
      };
    }
  }

  const tokens = scene.tokens
    .map((token) => {
      const tokenData = "toObject" in token ? token.toObject() : token;
      if (!tokenData.actorId || tokenData.actorLink) {
        tokenData.actorData = {};
      } else if (!game.actors.has(tokenData.actorId)) {
        tokenData.actorId = null;
        tokenData.actorData = {};
      } else if (!tokenData.actorLink) {
        const actorData = tokenData.actorData;
        const actorUpdate = convertActorData(actorData, options);

        // Handle item updates
        if (!actorUpdate.items?.length) return;
        const updates = new Map(actorUpdate.items.map((item) => [item._id, item]));
        tokenData.actorData.items?.forEach((original) => {
          const update = updates.get(original._id);
          if (update) foundry.utils.mergeObject(original, update);
        });
        delete actorUpdate.items;
        foundry.utils.mergeObject(tokenData.actorData, actorUpdate);
      }
      return tokenData;
    })
    .filter(Boolean);

  return { ...updateData, tokens };
};

export const convertScene = async (scene, options) => {
  const updateData = convertSceneData(scene.data, options);
  await scene.update(updateData);
  scene.tokens.forEach((token) => (token._actor = null));
};
