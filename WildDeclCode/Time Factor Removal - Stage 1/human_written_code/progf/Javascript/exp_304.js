"use strict";

var fs = require("fs");
var path = require("path");
var EasyGraphQLTester = require("../../../lib");

var schemaCode = fs.readFileSync(
  path.join(__dirname, "..", "schema", "schema.gql"),
  "utf8"
);

describe("Test my schema, queries and mutations", function () {
  var tester;

  beforeAll(() => {
    tester = new EasyGraphQLTester(schemaCode);
  });

  describe("Queries", () => {
    it("Invalid query getUser", () => {
      var invalidQuery = "
        {
          getUser {
            id
            invalidField
            familyInfo {
              father {
                email
                username
              }
            }
          }
        }
      ";
      // First arg: false because the query is not valid (There is no query called getUser on the Schema)
      // Second arg: query to test
      tester.test(false, invalidQuery);
    });

    it("Should pass with a valid query", () => {
      var validQuery = "
        {
          getMeByTestResult(result: 4.9) {
            email
          }
        }
      ";
      // First arg: true because the query is valid
      // Second arg: query to test
      tester.test(true, validQuery);
    });
  });

  describe("Mutations", () => {
    it("Invalid input type", () => {
      var mutation = "
        mutation UpdateUserScores($input: UpdateUserScoresInput!) {
          updateUserScores(input: $input) {
            email
            scores
          }
        }
      ";
      // First arg: false because the input value is not valid
      // Second arg: mutation to test
      // Third arg: input value
      tester.test(false, mutation, {
        input: {
          scores: ["1"]
        }
      });
    });

    it("Should pass if the input type is valid", () => {
      var mutation = "
        mutation UpdateUserScores($input: UpdateUserScoresInput!) {
          updateUserScores(input: $input) {
            email
            scores
          }
        }
      ";
      // First arg: true because the input value is valid
      // Second arg: mutation to test
      // Third arg: input value
      tester.test(true, mutation, {
        input: {
          scores: [1]
        }
      });
    });
  });
});
