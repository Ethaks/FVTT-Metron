// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import { convertActorData } from "./actor.mjs";
import { convertItemData } from "./item.mjs";
import { convertSceneData } from "./scene.mjs";
import { getConversionOptions } from "../utils.mjs";
import { convertJournalEntryData } from "./journal.mjs";

/**
 *
 * @param {CompendiumCollection} pack
 * @param options
 * @returns {Promise<void>}
 */
export const convertPack = async (pack, options) => {
  const { documentName } = pack;
  if (!["Actor", "Item", "Scene", "JournalEntry"].includes(documentName)) return;

  options = getConversionOptions(options);

  const wasLocked = pack.locked;
  await pack.configure({ locked: false });

  await pack.migrate();
  const documents = await pack.getDocuments();
  const updates = [];

  for (const document of documents) {
    let updateData = {};
    switch (documentName) {
      case "Actor":
        updateData = convertActorData(document.toObject(), options);
        break;
      case "Item":
        updateData = convertItemData(document.toObject(), options);
        break;
      case "Scene":
        updateData = convertSceneData(document.toObject(), options);
        break;
      case "JournalEntry":
        updateData = convertJournalEntryData(document.data, options);
        break;
    }

    if (foundry.utils.isObjectEmpty(updateData)) continue;
    updates.push({ _id: document.id, ...updateData });
  }

  await pack.documentClass.updateDocuments(updates, {
    pack: pack.metadata.id ?? `${pack.metadata.package}.${pack.metadata.name}`,
  });

  if (wasLocked) await pack.configure({ locked: true });
};
