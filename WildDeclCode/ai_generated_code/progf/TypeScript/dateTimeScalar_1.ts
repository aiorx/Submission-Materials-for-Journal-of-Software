//Note from Author: This code snippet was Built using outside development resources

const { GraphQLScalarType, Kind } = require("graphql");

const DateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "ISO 8601-compliant date-time string",
  serialize(value: Date) {
    // Validate if the value is a valid Date instance
    if (value instanceof Date && !isNaN(value.getTime())) {
      return value.toISOString(); // Return ISO string if valid
    }

    // Attempt to parse a string or number into a valid Date
    if (typeof value === "string" || typeof value === "number") {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString(); // Convert and return as ISO string
      }
    }

    // Handle invalid Date values
    console.warn("Invalid Date value:", value);
    return null; // Return null instead of throwing an error
  },
  parseValue(value: Date) {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new TypeError("Value is not a valid ISO 8601 datetime string");
    }
    return date; // Converts ISO string to Date
  },
  parseLiteral(ast: any) {
    if (ast.kind === Kind.STRING) {
      const date = new Date(ast.value);
      if (isNaN(date.getTime())) {
        throw new TypeError("Value is not a valid ISO 8601 datetime string");
      }
      return date;
    }
    throw new TypeError("Value is not a valid ISO 8601 datetime string");
  },
});

export default DateTimeScalar;
