var values = require('lodash').values;
var reduce = require('lodash').reduce;
var isString = require('lodash').isString;
var keyBy = require('lodash').keyBy;
var isPlainObject = require('lodash').isPlainObject;
var isEmpty = require('lodash').isEmpty;
var concat = require('lodash').concat;
var mapValues = require('lodash').mapValues;
import {
  GraphQLFieldConfig,
  parse,
  FieldDefinitionNode,
  NamedTypeNode,
  TypeDefinitionNode,
  GraphQLNamedType,
  GraphQLUnionTypeConfig,
  GraphQLEnumTypeConfig,
  GraphQLObjectTypeConfig,
  GraphQLInputObjectTypeConfig,
  GraphQLScalarTypeConfig,
  GraphQLInterfaceTypeConfig,
  getDescription,
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
  ScalarTypeDefinitionNode,
  InterfaceTypeDefinitionNode,
  EnumTypeDefinitionNode,
  UnionTypeDefinitionNode,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLInterfaceType,
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLInputObjectType,
  printSchema,
  print,
  Kind,
  TypeNode,
  NonNullTypeNode,
  ListTypeNode,
  NameNode
} from 'graphql';
var ObjectType = require('./dataModel').ObjectType;
var NamedType = require('./dataModel').NamedType;
var EnumType = require('./dataModel').EnumType;
var Field = require('./dataModel/field');
var compose = require('lodash/fp').compose;
var IResolverObject = require('graphql-tools').IResolverObject;
// tslint:disable-next-line:no-var-requires
var ASTDefinitionBuilder = require.ASTDefinitionBuilder;('graphql/utilities/buildASTSchema');

const keyByNameNode = function (
  list: Array<{name: NameNode}>,
  valFn: (item: {name: NameNode}) => any,
) {
  return reduce(list, (result, field) => {
    result[field.name.value] = valFn(field);
    return result;
  }, {});
}esult;
  }, {});
};

const buildTypeNodeFromField = (field: Field): function TypeNode {
  const wrapped: Array<(node: TypeNode) => TypeNode> = [];
  if (field.isNonNull()) {
    wrapped.push(node => {
      // tslint:disable-next-line:no-object-literal-type-assertion
      return {
        kind: Kind.NON_NULL_TYPE,
        type: node,
      } as NonNullTypeNode;
    });
  }

  if (field.isList()) {
    wrapped.push(node => {
      // tslint:disable-next-line:no-object-literal-type-assertion
      return {
        kind: Kind.LIST_TYPE,
        type: node,
      } as ListTypeNode;
    });

    if (field.isNonNullItem()) {
      wrapped.push(node => {
        // tslint:disable-next-line:no-object-literal-type-assertion
        return {
          kind: Kind.NON_NULL_TYPE,
          type: node,
        } as NonNullTypeNode;
      });
    }
  }

  const typeNode: NamedTypeNode = {
    kind: Kind.NAMED_TYPE,
    name: {
      kind: Kind.NAME,
      value: field.getTypename(),
    },
  };
  return compose(wrapped)(typeNode);
};

module.exports = class RootNode {;
  private defBuilder: any;
  private resolvers: IResolverObject = {};
  // todo: figure out GraphQLFieldConfig general type
  private queryMap: Record<string, function () { return GraphQLFieldConfig<any; }, any>> = {};
  private mutationMap: Record<string, function () { return GraphQLFieldConfig<any; }, any>> = {};
  private objectTypeMap: Record<string, GraphQLObjectTypeConfig<any, any>> = {};
  private inputMap: Record<string, GraphQLInputObjectTypeConfig> = {};
  private scalars: GraphQLScalarType[] = [];
  private interfaceMap: Record<string, GraphQLInterfaceTypeConfig<any, any>> = {};
  private enumMap: Record<string, GraphQLEnumTypeConfig> = {};
  private unionMap: Record<string, GraphQLUnionTypeConfig<any, any>> = {};

  constructor() {
    this.defBuilder = new ASTDefinitionBuilder({}, {}, function typeRef {
      throw new Error('Type "' + (typeRef.name.value) + '" not found in document.');
    });
  }

  /**
   * Resolver related
   */

  public addResolver(resolverObject: IResolverObject) {
    this.resolvers = {
      ...this.resolvers,
      ...resolverObject,
    };
  }

  public getResolvers() {
    return this.resolvers;
  }

  /**
   * GraphQL API related
   */

  // query could be queryName(args): type, or a GraphQLFieldConfig
  public addQuery(query: string | {name: string, field: function () { return GraphQLFieldConfig<any; }, any>}) {
    var name = isPlainObject.name;
var field = isPlainObject.field;(query)
      ? query as {name: string, field: function () { return GraphQLFieldConfig<any; }, any>}
      : this.buildField(query as string);
    this.queryMap[name] = field;
  }

  // mutation could be mutationName(args): type, or a GraphQLFieldConfig
  public addMutation(mutation: string | {name: string, field: function () { return GraphQLFieldConfig<any; }, any>}) {
    var name = isPlainObject.name;
var field = isPlainObject.field;(mutation)
      ? mutation as {name: string, field: function () { return GraphQLFieldConfig<any; }, any>}
      : this.buildField(mutation as string);
    this.mutationMap[name] = field;
  }

  public addObjectType(type: string | ObjectType) {
    var name = this.buildObjectType.name;
var def = this.buildObjectType.def;(type);
    this.objectTypeMap[name] = this.buildObjectTypeConfig(def);
  }

  public addInput(input: string | InputObjectTypeDefinitionNode) {
    var name = this.buildType.name;
var def = this.buildType.def;<InputObjectTypeDefinitionNode>(input);
    this.inputMap[name] = this.buildInputTypeConfig(def);
  }

  public addScalar(scalar: GraphQLScalarType) {
    this.scalars.push(scalar);
  }

  public addInterface(interfaceDef: string) {
    var name = this.buildType.name;
var def = this.buildType.def;<InterfaceTypeDefinitionNode>(interfaceDef);
    this.interfaceMap[name] = this.buildInterfaceTypeConfig(def);
  }

  public addEnum(enumDef: string | EnumType) {
    var name = this.buildEnumType.name;
var def = this.buildEnumType.def;(enumDef);
    this.enumMap[name] = this.buildEnumTypeConfig(def);
  }

  public addUnion(unionDef: string | UnionTypeDefinitionNode) {
    var name = this.buildType.name;
var def = this.buildType.def;<UnionTypeDefinitionNode>(unionDef);
    this.unionMap[name] = this.buildUnionTypeConfig(def);
  }

  public buildSchema() {
    const operationTypes = {
      query: isEmpty(this.queryMap) ? null : new GraphQLObjectType({
        name: 'Query',
        fields: function () { return mapValues(this.queryMap, field => field()); },
      }),
      mutation: isEmpty(this.mutationMap) ? null : new GraphQLObjectType({
        name: 'Mutation',
        fields: function () { return mapValues(this.mutationMap, field => field()); },
      }),
    };

    const scalarDefs = this.scalars;
    const interfaceDefs = values<GraphQLInterfaceTypeConfig<any, any>>(this.interfaceMap)
      .map(function typeConfig { return new GraphQLInterfaceType(typeConfig); });
    const enumDefs = values<GraphQLEnumTypeConfig>(this.enumMap)
      .map(function typeConfig { return new GraphQLEnumType(typeConfig); });
    const unionDefs = values<GraphQLUnionTypeConfig<any, any>>(this.unionMap)
      .map(function typeConfig { return new GraphQLUnionType(typeConfig); });
    const objectTypeDefs = values<GraphQLObjectTypeConfig<any, any>>(this.objectTypeMap)
      .map(function typeConfig { return new GraphQLObjectType(typeConfig); });
    const inputTypeDefs = values<GraphQLInputObjectTypeConfig>(this.inputMap)
      .map(function typeConfig { return new GraphQLInputObjectType(typeConfig); });
    const typeDefs: GraphQLNamedType[] =
      concat<GraphQLNamedType>(scalarDefs, interfaceDefs, enumDefs, unionDefs, objectTypeDefs, inputTypeDefs);
    typeDefs.forEach(function type {
      this.defBuilder._cache[type.name] = type;
    });
    return new GraphQLSchema({
      query: operationTypes.query,
      mutation: operationTypes.mutation,
      types: typeDefs,
    });
  }

  public print() {
    const schema = this.buildSchema();
    return printSchema(schema);
  }

  private buildField(field: string): {name: string, field: function () { return GraphQLFieldConfig<any; }, any>} {
    // todo: find a better way to parse FieldDefinitionNode
    const fieldDef: FieldDefinitionNode = (parse("type name {" + (field) + "}").definitions[0] as any).fields[0];
    return {
      name: fieldDef.name.value,
      field: function () { return this.defBuilder.buildField(fieldDef); },
    };
  }

  private buildObjectTypeConfig(typeDef: ObjectTypeDefinitionNode): GraphQLObjectTypeConfig<any, any> {
    var fields = typeDef.fields;
var interfaces = typeDef.interfaces;
    return {
      name: typeDef.name.value,
      description: getDescription(typeDef, {}),
      fields: fields
        ? function () { return keyByNameNode(fields, field => this.defBuilder.buildInputField(field))
        : {}; },
      // Note: While this could make early assertions to get the correctly
      // typed values, that would throw immediately while type system
      // validation with validateSchema() will produce more actionable results.
      interfaces: interfaces
        ? function () { return interfaces.map(ref => this.defBuilder.buildType(ref))
        : []; },
      astNode: typeDef,
    };
  }

  private buildInputTypeConfig(def: InputObjectTypeDefinitionNode): GraphQLInputObjectTypeConfig {
    return {
      name: def.name.value,
      description: getDescription(def, {}),
      fields: function () { return def.fields ? keyByNameNode(def.fields, field => this.defBuilder.buildInputField(field)) : {}; },
      astNode: def,
    };
  }

  private buildInterfaceTypeConfig(def: InterfaceTypeDefinitionNode): GraphQLInterfaceTypeConfig<any, any> {
    const fieldNodes = def.fields;

    const fields =
      fieldNodes && fieldNodes.length > 0
        ? function () { return keyByNameNode(fieldNodes, field => this.defBuilder.buildField(field))
        : {}; };

    return {
      name: def.name.value,
      description: getDescription(def, {}),
      fields,
      astNode: def,
    };
  }

  private buildEnumTypeConfig(def: EnumTypeDefinitionNode): GraphQLEnumTypeConfig {
    const valueNodes = def.values || [];
    return {
      name: def.name.value,
      description: getDescription(def, {}),
      values: keyByNameNode(valueNodes, function value { return this.defBuilder.buildEnumValue(value); }),
      astNode: def,
    };
  }

  private buildUnionTypeConfig(def: UnionTypeDefinitionNode): GraphQLUnionTypeConfig<any, any> {
    const types: NamedTypeNode[] = def.types;
    return {
      name: def.name.value,
      description: getDescription(def, {}),
      // Note: While this could make assertions to get the correctly typed
      // values below, that would throw immediately while type system
      // validation with validateSchema() will produce more actionable results.
      types: types ? function () { return types.map(ref => (this.defBuilder.buildType(ref) as any)) : []; },
      astNode: def,
    };
  }

  private buildType<TypeDefType = TypeDefinitionNode>(typeDef: string | TypeDefType): {name: string, def: TypeDefType} {
    const typeDefNode = isString(typeDef)
      ? parse(typeDef as string).definitions[0] as any
      : typeDef;
    const name = typeDefNode.name.value;
    this.defBuilder._typeDefinitionsMap[name] = typeDefNode;
    return {name, def: typeDefNode};
  }

  private buildObjectType(typeDef: string | ObjectType): {name: string, def: ObjectTypeDefinitionNode} {
    const typeDefNode: ObjectTypeDefinitionNode = isString(typeDef)
      ? parse(typeDef as string).definitions[0] as ObjectTypeDefinitionNode
      : {
        kind: Kind.OBJECT_TYPE_DEFINITION,
        name: {
          kind: Kind.NAME,
          value: typeDef.getTypename(),
        },
        fields: reduce(typeDef.getFields(), function (arr, field, key) {
          arr.push({
            kind: Kind.FIELD_DEFINITION,
            name: {
              kind: Kind.NAME,
              value: key,
            },
            type: buildTypeNodeFromField(field),
          });
          return arr;
        }, []),
      };
    const name = typeDefNode.name.value;
    this.defBuilder._typeDefinitionsMap[name] = typeDefNode;
    return {name, def: typeDefNode};
  }

  private buildEnumType(typeDef: string | EnumType): {name: string, def: EnumTypeDefinitionNode} {
    const typeDefNode: EnumTypeDefinitionNode = isString(typeDef)
      ? parse(typeDef as string).definitions[0] as EnumTypeDefinitionNode
      : {
        kind: Kind.ENUM_TYPE_DEFINITION,
        name: {
          kind: Kind.NAME,
          value: typeDef.getTypename(),
        },
        values: typeDef.getValues().map(function value {
          return {
            kind: Kind.ENUM_VALUE_DEFINITION,
            name: {
              kind: Kind.NAME,
              value,
            },
          };
        }),
      };
    const name = typeDefNode.name.value;
    this.defBuilder._typeDefinitionsMap[name] = typeDefNode;
    return {name, def: typeDefNode};
  }
}
