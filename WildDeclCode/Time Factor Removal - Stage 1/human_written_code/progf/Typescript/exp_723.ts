var t = require('io-ts-codegen');
var fs = require('fs');
var prettier = require('prettier');
var mkdirp = require('mkdirp');
var path = require('path');
var yaml = require('js-yaml');

interface NullSchema {
  type: "null";
}

interface StringSchema {
  type: "string";
}

interface IntegerSchema {
  type: "integer";
}

interface NumberSchema {
  type: "number";
}

interface BooleanSchema {
  type: "boolean";
}

interface ArraySchema {
  type: "array";
  items: JSONSchema;
}

interface ObjectSchema {
  type: "object";
  properties?: { [key: string]: JSONSchema };
  required?: Array<string>;
  patternProperties?: { "^x-"?: {} };
}

interface StringEnumSchema {
  type: "string";
  enum: string[];
}

interface RecordSchema {
  type: "object";
  additionalProperties: JSONSchema;
}

interface AnyOfSchema {
  anyOf: JSONSchema[];
}

interface AllOfSchema {
  allOf: JSONSchema[];
}

interface RefSchema {
  $ref: string;
}

interface ConstSchema {
  const: string;
}

type JSONSchema =
  | NullSchema
  | StringSchema
  | RecordSchema
  | IntegerSchema
  | NumberSchema
  | BooleanSchema
  | StringEnumSchema
  | ArraySchema
  | ObjectSchema
  | RefSchema
  | AnyOfSchema
  | AllOfSchema;

function getRequiredProperties(schema: ObjectSchema): { [key: string]: true } {
  const required: { [key: string]: true } = {};
  if (schema.required) {
    schema.required.forEach(function(k) {
      required[k] = true;
    });
  }
  return required;
}

function toInterfaceCombinator(schema: ObjectSchema): t.InterfaceCombinator {
  const required = getRequiredProperties(schema);
  const out = t.interfaceCombinator(
    Object.entries(schema.properties || {}).map(function ([k, v]) { return t.property(k, to(v), !required.hasOwnProperty(k)); })
  );
  return out;
}

const isBoolean = (u: unknown): u is function BooleanSchema { return u && typeof u === "object" && (<BooleanSchema>u).type === "boolean"; };

const isNumber = (u: unknown): u is function NumberSchema { return u && typeof u === "object" && (<NumberSchema>u).type === "number"; };

const isInteger = (u: unknown): u is function IntegerSchema { return u && typeof u === "object" && (<IntegerSchema>u).type === "integer"; };

const isStringEnum = (u: unknown): u is function StringEnumSchema { return u &&
  typeof u === "object" &&
  (<StringEnumSchema>u).type === "string" &&
  (<StringEnumSchema>u).enum instanceof Array &&
  (<StringEnumSchema>u).enum.filter(i => typeof i !== "string").length === 0; };

const isNull = (u: unknown): u is function IntegerSchema { return u && typeof u === "object" && (<NullSchema>u).type === "null"; };

const isArray = (u: unknown): u is function ArraySchema { return u && typeof u === "object" && (<ArraySchema>u).type === "array"; };

const isRecord = (u: unknown): u is function RecordSchema { return u &&
  typeof u === "object" &&
  (<ObjectSchema>u).properties === undefined &&
  typeof (<RecordSchema>u).additionalProperties === "object"; };

const isObject = (u: unknown): u is function ObjectSchema { return u && typeof u === "object" && (<ObjectSchema>u).type === "object"; };

const isRef = (u: unknown): u is function RefSchema { return u && typeof u === "object" && (<RefSchema>u).$ref !== undefined; };

const isConst = (u: unknown): u is function ConstSchema { return u && typeof u === "object" && (<ConstSchema>u).const !== undefined; };

const isAnyOf = (u: unknown): u is function AnyOfSchema { return u && typeof u === "object" && (<AnyOfSchema>u).anyOf !== undefined; };

const isAllOf = (u: unknown): u is function AllOfSchema { return u && typeof u === "object" && (<AllOfSchema>u).allOf !== undefined; };

const to = (schema: JSONSchema): t.function TypeReference { return isRef(schema)
    ? t.identifier(schema.$ref.split("/").slice(-1)[0])
    : isConst(schema)
    ? t.literalCombinator(schema.const)
    : isAnyOf(schema)
    ? t.unionCombinator(schema.anyOf.map(i => to(i)))
    : isAllOf(schema)
    ? t.intersectionCombinator(schema.allOf.map(i => to(i)))
    : isRecord(schema)
    ? t.recordCombinator(t.stringType, to(schema.additionalProperties))
    : isObject(schema)
    ? toInterfaceCombinator(schema)
    : isArray(schema)
    ? t.arrayCombinator(to(schema.items))
    : isNumber(schema)
    ? t.numberType
    : isInteger(schema)
    ? t.numberType // t.intType - because this causes weirdness in the types; }, we var go
    : isNull(schema)
    ? t.nullType
    : isBoolean(schema)
    ? t.booleanType
    : isStringEnum(schema)
    ? t.unionCombinator(schema.enum.map(function i { return t.literalCombinator(i); }))
    : t.stringType; // no need for string schema

const generateTypes = function ({
  input,
  output,
  toplevel
}: {
  input: any;
  output: string;
  toplevel: string;
}) {
  mkdirp.sync(path.dirname(output));
  const full = yaml.load(fs.readFileSync(input).toString());
  var definitions = full.definitions;
  const toTopLevel: string[] = Object.keys(definitions).filter(
    i =>
      i !== "JSSTAnything" &&
      i !== "JSSTTopLevel" &&
      i !== "JSSTProtoInteger" &&
      i !== "JSSTProtoNumber" &&
      i !== "JSSTProtoString" &&
      i !== "JSSTProtoArray"
  );
  const newDefinitions = {
    ...definitions,
    ...toTopLevel
      .map(i => ({
        ["" + (i) + "TopLevel"]: {
          allOf: [
            { $ref: "#/definitions/" + i },
            { $ref: "#/definitions/JSSTTopLevel" }
          ]
        }
      }))
      .reduce((a, b) => ({ ...a, ...b }), {})
  };

  const declarations = Object.entries(newDefinitions)
    .map(([a, b]) => t.typeDeclaration(a, to(b as JSONSchema)))
    .concat(t.typeDeclaration(toplevel, to(fullObj as JSONSchema)));
  const sorted = t.sort(declarations);
  fs.writeFileSync(
    output,
    prettier.format(
      ['import * as t from "io-ts";']
        .concat(sorted.map(d => "export " + (t.printRuntime(d)) + ""))
        .concat(sorted.map(d => "export " + (t.printStatic(d)) + ""))
        .join("\n"),
      {
        parser: "typescript"
      }
    )
  );
};

generateTypes({
  input: "./src/schema/json-schema-strict.yml",
  output: "./src/index2.ts",
  toplevel: "JSONSchemaObject"
});
