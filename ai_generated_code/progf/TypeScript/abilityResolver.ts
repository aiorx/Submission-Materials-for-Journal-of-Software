import AbilityScore from '../model/AbilityScore.js';
import fetchData from '../../scripts/fetchData.ts';

export default {
  Query: {
    /**
     * Fetches a paginated list of abilities from the database.
     *
     * @param _ - Unused first argument (GraphQL resolver context).
     * @param offset - The number of abilities to skip for pagination. Defaults to 0.
     * @param limit - The number of abilities to fetch. Defaults to 1.
     * @returns An object containing:
     *  - `abilities`: An array of abilities with their respective IDs.
     *  - `totalAbilities`: The total number of abilities in the database.
     * @throws Error if the database query fails.
     */

    async abilities(_: any, offset = 0, limit = 1) {
      const totalAbilities = await AbilityScore.countDocuments();
      const abilities = await AbilityScore.find().skip(offset).limit(limit);
      //This was generated from ChatGPT 4o, from here
      const abilitiesWithId = abilities.map((ability) => ({
        ...ability.toObject(),
        id: ability._id.toString(),
      }));
      //To here.
      console.log('Fetched abilities:', abilitiesWithId);
      console.log('Total abilities count:', totalAbilities);

      return { abilities: abilitiesWithId, totalAbilities };
    },

    /**
     * Fetches a single ability by its index.
     *
     * @param _ - Unused first argument (GraphQL resolver context).
     * @param id - The index of the ability to fetch.
     * @returns The ability object, including its `id`.
     * @throws Error if the ability with the given index is not found.
     */

    async ability(_: any, { id }: any) {
      const ability = await AbilityScore.findOne({ index: id });

      if (!ability) {
        throw new Error(`Ability not found for index: ${id}`);
      }
      //This was Supported via standard programming aids 4o, from here
      return {
        ...ability.toObject(),
        id: ability._id.toString(),
      };
      //To here
    },
  },

  Mutation: {
    /**
     * Fetches all data from an external source and stores it in the database.
     *
     * @returns A success message confirming the data was fetched and stored.
     * @throws Error if the fetchData script encounters any issues.
     */
    async fetchAllData() {
      await fetchData();
      return 'Data fetched and stored successfully!';
    },
  },
};
