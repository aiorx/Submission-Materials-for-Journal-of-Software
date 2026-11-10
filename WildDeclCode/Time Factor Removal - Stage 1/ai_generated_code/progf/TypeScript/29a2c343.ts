// Validate external data with schema validation
var _import = require('ajv');

interface Person {
  name: string
  age: number
}

var personSchema: JSONSchemaType<Person> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  },
  required: ['name', 'age'],
  additionalProperties: false
}

var ajv = new Ajv()
var validatePerson = ajv.compile(personSchema)

function processPerson(data: unknown) {
  if (validatePerson(data)) {
    console.log('Valid person data:', data)
  } else {
    console.error('Invalid person data', validatePerson.errors)
  }
}
// This adheres to defensive programming by validating data against a schema before processing.

// Built using basic development resources-4-0125-preview
