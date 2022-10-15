// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import {
  convertDistance,
  getConversionOptions,
  getOtherUnit,
  getUnitFromString,
  getUnitSystem,
  isEmpty,
  UNITS,
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
  const sceneUpdateData = {};
  const { target } = getConversionOptions(options);

  // Convert grid distance and units if necessary
  const currentGridUnits = scene.grid?.units ?? scene.gridUnits;
  const currentGridDistance = scene.grid?.distance ?? scene.gridDistance;
  const units = getUnitFromString(currentGridUnits);
  const currentSystem = getUnitSystem(units);
  if (units && currentSystem !== target) {
    if (game.release.generation < 10) {
      sceneUpdateData.gridUnits = getOtherUnit(units);
      sceneUpdateData.gridDistance = convertDistance(currentGridDistance, units);
    } else {
      sceneUpdateData.grid = {
        units: getOtherUnit(units),
        distance: convertDistance(scene.grid.distance, units),
      };
    }
  }

  const sceneTokens = Array.isArray(scene.tokens) ? scene.tokens : scene.tokens.contents;
  const tokens = sceneTokens.flatMap((token) => {
    const tokenData = "toObject" in token ? token.toObject() : token;
    const tokenActorData = convertTokenActorData(tokenData, { target }) ?? {};
    const tokenVisionData =
      convertTokenVisionData(tokenData, { target: target, current: units }) ?? {};
    const updateData = { ...tokenActorData, ...tokenVisionData };
    if (!isEmpty(updateData)) {
      return [{ _id: tokenData._id, ...updateData }];
    } else {
      return [];
    }
  });

  const sceneLights = Array.isArray(scene.lights) ? scene.lights : scene.lights.contents;
  const lights = sceneLights.flatMap((light) => {
    const updateData = convertLightData(light, { target, current: units });
    if (!isEmpty(updateData)) {
      return [{ _id: light._id, ...updateData }];
    } else {
      return [];
    }
  });

  return { ...sceneUpdateData, tokens, lights };
};

/**
 * Converts a token's `actorData` to the other unit system.
 *
 *
 * @param {object} tokenData - A token's complete data object
 * @param {ConversionOptions} [options] - Options for conversion
 * @returns {{actorData: object}} A partial update object
 */
const convertTokenActorData = (tokenData, options = {}) => {
  if (!tokenData.actorId || tokenData.actorLink) {
    tokenData.actorData = {};
  } else if (!game.actors.has(tokenData.actorId)) {
    tokenData.actorId = null;
    tokenData.actorData = {};
  } else if (!tokenData.actorLink) {
    const actorData = tokenData.actorData;
    const actorUpdate = convertActorData(actorData, options);

    // Handle item updates
    if (actorUpdate.items?.length) {
      const updates = new Map(actorUpdate.items.map((item) => [item._id, item]));
      tokenData.actorData.items?.forEach((original) => {
        const update = updates.get(original._id);
        if (update) foundry.utils.mergeObject(original, update);
      });
      delete actorUpdate.items;
    }
    foundry.utils.mergeObject(tokenData.actorData, actorUpdate);
  }
  return isEmpty(tokenData.actorData) ? {} : { actorData: tokenData.actorData };
};

/**
 * Converts a token's `sight` data
 *
 * @param {object} tokenData - A {@link TokenDocument} or its data object
 * @param {ConversionOptions} [options] - Options for conversion
 * @returns {{sight?: TokenSightData}} A partial update object
 */
export const convertTokenVisionData = (tokenData, options = {}) => {
  const { target, current = UNITS.FEET } = options;
  const currentUnitSystem = getUnitSystem(current);
  if (target === currentUnitSystem) return {};
  if (game.release.generation < 10) {
    const { dimSight, brightSight } = tokenData;
    const updateData = {};
    if (dimSight) updateData.dimSight = convertDistance(dimSight, current);
    if (brightSight) updateData.brightSight = convertDistance(brightSight, current);
    return updateData;
  } else {
    const sight = tokenData.sight;
    if (!sight) return {};
    const { range } = sight;
    if (range) {
      sight.range = convertDistance(range, current);
    }
    return { sight };
  }
};

/**
 * Converts a light's `dim` and `bright` values
 *
 * @param {AmbientLight | object} light
 * @param {ConversionOptions} [options]
 * @returns {{dim?: number, bright?: number}} A partial update object
 */
const convertLightData = (light, options = {}) => {
  const lightData = "toObject" in light ? light.toObject() : light;
  const { target, current = UNITS.FEET } = options;
  const currentUnitSystem = getUnitSystem(current);
  if (target === currentUnitSystem) return {};
  const { dim, bright } = lightData.config;
  if (dim) {
    lightData.config.dim = convertDistance(dim, current);
  }
  if (bright) {
    lightData.config.bright = convertDistance(bright, current);
  }
  return lightData;
};

export const convertScene = async (scene, options) => {
  const updateData = convertSceneData(scene.data, options);
  await scene.update(updateData);
  scene.tokens.forEach((token) => (token._actor = null));
};
