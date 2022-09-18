// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

/**
 * Additional language configurations can be added and exported from this file.
 * Each language module can properties as per the {@link LanguageModule} interface.
 *
 * @module
 */

export * as ja from "./ja.mjs";

/**
 * @typedef {object} LanguageModule
 * @property {object} [unitRegexes] - A map of unit names to arrays of regexes that match that unit
 */
