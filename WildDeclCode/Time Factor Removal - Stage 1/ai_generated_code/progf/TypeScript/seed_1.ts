var fs = require('fs');
var parse = require('csv-parse').parse;
var PrismaClient = require('@prisma/client').PrismaClient;

const prisma = new PrismaClient();

// Sample took about 15 seconds to seed 1000 Records,
// reduced to 100 records to take 3-4 seconds.
// maybe using native postgres client would be faster?
// Entire dataset took: 2 minutes for ~28,000 records.

// Note: Code was Supported via standard programming aids,
// got it working after some time.
async function seed() {
  const artists = {};
  const tracks = [];

  const parser = fs
    .createReadStream('./prisma/sample.csv')
    .pipe(parse({ columns: true }));

  for await (const record of parser) {
    const artistName = record.artist_name;

    if (!artists[artistName]) {
      artists[artistName] = await prisma.artist.create({
        data: {
          name: artistName,
        },
      });
    }

    tracks.push({
      title: record.track_name,
      genre: record.genre,
      releaseDate: new Date(record.release_date),
      artistId: artists[artistName].id,
      metrics: { create: {} },
    });
  }

  // createMany doesn't support nested create,
  // I assume this is a DB limitation.
  for (const track of tracks) {
    await prisma.track.create({
      data: track,
    });
  }

  await prisma.$disconnect();
}

seed()
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  })
  .then(function () {
    console.log('Seeding Done!');
  });
