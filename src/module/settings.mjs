// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import { MODULE_ID, UNIT_SYSTEMS } from "./utils.mjs";

export const registerSettings = () => {
  // Register default target unit system
  game.settings.register(MODULE_ID, "targetUnitSystem", {
    name: "METRON.Settings.TargetUnitSystem",
    hint: "METRON.Settings.TargetUnitSystemHint",
    choices: {
      [UNIT_SYSTEMS.IMPERIAL]: "METRON.Imperial",
      [UNIT_SYSTEMS.METRIC]: "METRON.Metric",
    },
    default: UNIT_SYSTEMS.METRIC,
    scope: "client",
    config: true,
    type: String,
  });

  // Register default grid unit system for units and distance
  game.settings.register(MODULE_ID, "gridUnitSystem", {
    name: "METRON.Settings.GridUnitSystem",
    hint: "METRON.Settings.GridUnitSystemHint",
    choices: {
      [UNIT_SYSTEMS.IMPERIAL]: "METRON.Imperial",
      [UNIT_SYSTEMS.METRIC]: "METRON.Metric",
    },
    default: UNIT_SYSTEMS.METRIC,
    scope: "world",
    config: true,
    type: String,
  });

  game.settings.register(MODULE_ID, "decimalSeparator", {
    name: "METRON.Settings.DecimalSeparator",
    hint: "METRON.Settings.DecimalSeparatorHint",
    choices: {
      dot: ".",
      comma: ",",
    },
    default: "dot",
    scope: "client",
    config: true,
    type: String,
  });

  game.settings.register(MODULE_ID, "overrideWeightConversion", {
    name: "METRON.Settings.OverrideWeightConversion",
    hint: "METRON.Settings.OverrideWeightConversionHint",
    default: false,
    scope: "world",
    config: true,
    type: Boolean,
    onChange: applyWeightConversionOverride,
  });
};

export const applyWeightConversionOverride = (simplified = false) => {
  if (simplified) {
    CONFIG.DND5E.weightUnits.kg.conversion = 2;
    CONFIG.DND5E.weightUnits.Mg.conversion = 2_000;
  } else {
    CONFIG.DND5E.weightUnits.kg.conversion = 2.5;
    CONFIG.DND5E.weightUnits.Mg.conversion = 2_500;
  }
};
