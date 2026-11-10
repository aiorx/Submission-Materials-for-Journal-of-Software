
var prisma = require('~/db.server').prisma;

export type { Entry } from "@prisma/client";

// !! All jsdocs Assisted using common GitHub development utilities

// Gets all entries in the database, ordered by date created in descending order
// Returns an array of Entry objects
// Used by the /entries page to display all lore entries
function getAllLoreEntries(): Promise<Entry[]> {
  return prisma.entry.findMany({
    orderBy: {
      createdAt: "desc",
    }
  });
}

// This function creates a new lore entry in the database.
// The lore entry is created using the lore piece provided.
function createLoreEntry({
  lorePiece
}: Entry): Promise<Entry> {
  return prisma.entry.create({
    data: {
      lorePiece
    },
  });
}

// deleteLoreEntry deletes the lore entry with the given id.
// It returns the deleted entry.
function deleteLoreEntry({
  id
}: Pick<Entry, "id">): Promise<Entry> {
  return prisma.entry.delete({
    where: { id },
  });
}
