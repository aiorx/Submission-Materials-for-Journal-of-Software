```cpp
PDB_NO_DISCARD static bool HasValidDBIStreams(const PDB::RawFile &rawPdbFile, const PDB::DBIStream &dbiStream) {
    // check whether the DBI stream offers all sub-streams we need
    if (IsError(dbiStream.HasValidImageSectionStream(rawPdbFile))) {
        return false;
    }

    if (IsError(dbiStream.HasValidPublicSymbolStream(rawPdbFile))) {
        return false;
    }

    if (IsError(dbiStream.HasValidGlobalSymbolStream(rawPdbFile))) {
        return false;
    }

    if (IsError(dbiStream.HasValidSectionContributionStream(rawPdbFile))) {
        return false;
    }

    return true;
}
```