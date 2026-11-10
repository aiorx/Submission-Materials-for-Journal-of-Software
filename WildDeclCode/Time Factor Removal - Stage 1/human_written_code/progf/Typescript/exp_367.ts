import {
  CodeModel,
  Schema,
  ObjectSchema,
  isObjectSchema,
  SchemaType,
  Property,
  ParameterLocation,
  Operation,
  Parameter,
  VirtualParameter,
  getAllProperties,
  ImplementationLocation,
  DictionarySchema,
} from "@azure-tools/codemodel";
var Session = require('@azure-tools/autorest-extension-base').Session;
var values = require('@azure-tools/linq').values;
var items = require('@azure-tools/linq').items;
var length = require('@azure-tools/linq').length;
var Dictionary = require('@azure-tools/linq').Dictionary;
var refCount = require('@azure-tools/linq').refCount;
var clone = require('@azure-tools/linq').clone;
var ModelerFourOptions = require('../modeler/modelerfour-options').ModelerFourOptions;

class Checker {
  codeModel: CodeModel;
  options: ModelerFourOptions = {};

  constructor(protected session: Session<CodeModel>) {
    this.codeModel = session.model; // shadow(session.model, filename);
  }

  async init() {
    // get our configuration for this run.
    this.options = await this.session.getValue("modelerfour", {});
    return this;
  }

  checkOperationGroups() {
    for (const dupe of values(this.codeModel.operationGroups)
      .select(function (each) { return each.language.default.name; })
      .duplicates()) {
      this.session.error("Duplicate Operation group '" + (dupe) + "' detected .", []);
    }
  }

  checkOperations() {
    for (const group of this.codeModel.operationGroups) {
      for (const dupe of values(group.operations)
        .select(function (each) { return each.language.default.name; })
        .duplicates()) {
        this.session.error("Duplicate Operation '" + (dupe) + "' detected.", []);
      }
    }
  }

  checkSchemas() {
    const allSchemas = values(<Dictionary<Array<Schema>>>(<any>this.codeModel.schemas))
      .selectMany(function (schemas) { return (Array.isArray(schemas) ? values(schemas) : []); })
      .toArray();

    for (const each of values(allSchemas).where(function (each) { return !each.language.default.name; })) {
      this.session.warning("Schema Missing Name '" + (JSON.stringify(each)) + "'.", []);
    }

    const types = values(<Array<Schema>>this.codeModel.schemas.objects)
      .concat(values(this.codeModel.schemas.groups))
      .concat(values(this.codeModel.schemas.choices))
      .concat(values(this.codeModel.schemas.sealedChoices))
      .toArray();
    for (const dupe of values(types).duplicates(function (each) { return each.language.default.name; })) {
      this.session.error("Duplicate object schemas with '" + (dupe.language.default.name) + "' name  detected.", []);
    }

    /* for (var dupe of values(this.codeModel.schemas.numbers).select(each => each.type).duplicates()) {
      this.session.error(`Duplicate '${dupe}' detected.`, []);
    }; */
  }

  process() {
    if (this.options["additional-checks"] !== false) {
      this.checkOperationGroups();

      this.checkOperations();

      this.checkSchemas();
    }
    return this.codeModel;
  }
}
