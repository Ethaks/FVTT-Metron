// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

/**
 * Additional language configurations can be added and exported from this file.
 * Each language module can properties as per the {@link LanguageModule} interface.
 *
 * @module
 */
import { applyExactMatchRequirement } from "./utils.mjs";

// Import languages
import ja from "./ja.mjs";

/** @type {Record<string, LanguageModule>} */
export const languages = { ja };

// Initialise languages
for (const language of Object.values(languages)) {
  applyExactMatchRequirement(language.unitRegexes, language.requireExactMatch ?? true);
}

/**
 * An object containing all data to enable unit recognition for a language.
 * Unit strings used to replace the original unit are stored in the language's localisation file.
 *
 * @typedef {object} LanguageModule
 * @property {UnitRegexes} [unitRegexes] - A map of unit names to arrays of regexes that match that unit
 * @property {boolean} [requireExactMatch = true] - Whether the regexes should require an exact match; set to false for languages not requiring e.g. spaces
 */

/**
 * @typedef {Record<Unit, RegExp[]>} UnitRegexes
 */
