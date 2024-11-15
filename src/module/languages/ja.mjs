// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

/** @type {LanguageModule} */
const languageModule = {
	unitRegexes: {
		lb: [/ポンド/u, /㍀/u],
		kg: [/キログラム/u],
		ft: [/フィート/u, /㌳/u],
		m: [/メートル/u],
		mi: [/マイル/u, /㍄/u],
		km: [/キロメートル/u],
	},
	requireExactMatch: false,
};

export default languageModule;
