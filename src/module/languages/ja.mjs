// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

/** @type {LanguageModule} */
const languageModule = {
  unitRegexes: {
    lbs: [/ポンド/u],
    kg: [/キログラム/u],
    ft: [/フィート/u],
    m: [/メートル/u],
    mi: [/マイル/u],
    km: [/キロメートル/u],
  },
  requireExactMatch: false,
};

export default languageModule;
