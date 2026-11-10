var ProgramConfig = require('./config').ProgramConfig;

var TypeFormatter = require('../src/TypeFormatter').TypeFormatter;
var ChainTypeFormatter = require('../src/ChainTypeFormatter').ChainTypeFormatter;
var CircularReferenceTypeFormatter = require('../src/CircularReferenceTypeFormatter').CircularReferenceTypeFormatter;

var AnnotatedTypeFormatter = require('../src/TypeFormatter/AnnotatedTypeFormatter').AnnotatedTypeFormatter;

var StringTypeFormatter = require('../src/TypeFormatter/StringTypeFormatter').StringTypeFormatter;
var NumberTypeFormatter = require('../src/TypeFormatter/NumberTypeFormatter').NumberTypeFormatter;
var BooleanTypeFormatter = require('../src/TypeFormatter/BooleanTypeFormatter').BooleanTypeFormatter;
var NullTypeFormatter = require('../src/TypeFormatter/NullTypeFormatter').NullTypeFormatter;

var AnyTypeFormatter = require('../src/TypeFormatter/AnyTypeFormatter').AnyTypeFormatter;
var UndefinedTypeFormatter = require('../src/TypeFormatter/UndefinedTypeFormatter').UndefinedTypeFormatter;

var LiteralTypeFormatter = require('../src/TypeFormatter/LiteralTypeFormatter').LiteralTypeFormatter;
var EnumTypeFormatter = require('../src/TypeFormatter/EnumTypeFormatter').EnumTypeFormatter;

var ReferenceTypeFormatter = require('../src/TypeFormatter/ReferenceTypeFormatter').ReferenceTypeFormatter;
var DefinitionTypeFormatter = require('../src/TypeFormatter/DefinitionTypeFormatter').DefinitionTypeFormatter;
var ObjectTypeFormatter = require('../src/TypeFormatter/ObjectTypeFormatter').ObjectTypeFormatter;
var AliasTypeFormatter = require('../src/TypeFormatter/AliasTypeFormatter').AliasTypeFormatter;

var PrimitiveUnionTypeFormatter = require('../src/TypeFormatter/PrimitiveUnionTypeFormatter').PrimitiveUnionTypeFormatter;
var LiteralUnionTypeFormatter = require('../src/TypeFormatter/LiteralUnionTypeFormatter').LiteralUnionTypeFormatter;

var ArrayTypeFormatter = require('../src/TypeFormatter/ArrayTypeFormatter').ArrayTypeFormatter;
var TupleTypeFormatter = require('../src/TypeFormatter/TupleTypeFormatter').TupleTypeFormatter;
var UnionTypeFormatter = require('../src/TypeFormatter/UnionTypeFormatter').UnionTypeFormatter;
var IntersectionTypeFormatter = require('../src/TypeFormatter/IntersectionTypeFormatter').IntersectionTypeFormatter;

function createFormatter(config: ProgramConfig): TypeFormatter {
    const chainTypeFormatter = new ChainTypeFormatter([]);
    const circularReferenceTypeFormatter = new CircularReferenceTypeFormatter(chainTypeFormatter);

    chainTypeFormatter
        .addTypeFormatter(new AnnotatedTypeFormatter(circularReferenceTypeFormatter))

        .addTypeFormatter(new StringTypeFormatter())
        .addTypeFormatter(new NumberTypeFormatter())
        .addTypeFormatter(new BooleanTypeFormatter())
        .addTypeFormatter(new NullTypeFormatter())

        .addTypeFormatter(new AnyTypeFormatter())
        .addTypeFormatter(new UndefinedTypeFormatter())

        .addTypeFormatter(new LiteralTypeFormatter())
        .addTypeFormatter(new EnumTypeFormatter())

        .addTypeFormatter(new ReferenceTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new DefinitionTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new ObjectTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new AliasTypeFormatter(circularReferenceTypeFormatter))

        .addTypeFormatter(new PrimitiveUnionTypeFormatter())
        .addTypeFormatter(new LiteralUnionTypeFormatter())

        .addTypeFormatter(new ArrayTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new TupleTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new UnionTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new IntersectionTypeFormatter(circularReferenceTypeFormatter));

    return circularReferenceTypeFormatter;
}
