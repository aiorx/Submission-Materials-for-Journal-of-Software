// EXERCISE Formed using common development resources FOR ME ❤️

// Typing for car objects
interface Car {
  model: string;
  year: number;
  color: string;
}

// Array of car objects
const cars: Car[] = [
  { model: 'Toyota', year: 2020, color: 'Blue' },
  { model: 'Honda', year: 2019, color: 'Red' },
  { model: 'Ford', year: 2021, color: 'Black' },
];

// Exercise: Write a function that reduces the array of cars into an object
// where the key is the model and the value is an object with year and color.

// The function signature will look like:
// const aggregateCars: (cars: Car[]) => Record<string, { year: number; color: string }>;

// Now, try writing the function (and the attached signature) yourself.

type IAggregateCars = (
  cars: Car[],
) => Record<string, Pick<Car, 'color' | 'year'>>;

const getAggregateCars: IAggregateCars = cars =>
  cars.reduce(
    (a, v) => ({
      ...a,
      [v.model]: {
        color: v.color,
        year: v.year,
      },
    }),
    {},
  );

export { Car, getAggregateCars };
