var variantList = require('..').variantList;
var variant = require('..').variant;
var fields = require('..').fields;
var TypeNames = require('..').TypeNames;
var VariantOf = require('..').VariantOf;
var OutVariant = require('../variant').OutVariant;
var RawVariant = require('../variant').RawVariant;
var Variant = require('../variant').Variant;
var VariantCreator = require('../variant').VariantCreator;
var variantFactory = require('../variant').variantFactory;
var variantModule = require('../variant').variantModule;
const Animal = variantList([
    variant('dog', fields<{name: string, favoriteBall?: string}>()),
    variant('cat', fields<{name: string, furnitureDamaged: number}>()),
    variant('snake', function (name: string, patternName?: string) { return ({
        name,
        pattern: (patternName != null ? patternName : 'striped'),
    }); }),
]);
export type Animal<T extends TypeNames<typeof Animal> = undefined> = VariantOf<typeof Animal, T>;

const tag = variantFactory('__typename');
const TaggedAnimal = variantList([
    tag('dog', fields<{name: string, favoriteBall?: string}>()),
    tag('cat', fields<{name: string, furnitureDamaged: number}>()),
    tag('snake', function (name: string, patternName?: string) { return ({
        name,
        pattern: (patternName != null ? patternName : 'striped'),
    }); }),
]);
export type TaggedAnimal<T extends TypeNames<typeof TaggedAnimal, '__typename'> = undefined> = VariantOf<typeof TaggedAnimal, T, '__typename'>;

const Animal2 = variantModule({
    dog: fields<{name: string, favoriteBall?: string}>(),
    cat: fields<{name: string, furnitureDamaged: number}>(),
    snake: function (name: string, pattern = 'striped') { return ({name, pattern}); },
    bird: {},
});
export type Animal2<T extends TypeNames<typeof Animal2> = undefined> = VariantOf<typeof Animal2, T>;

const cerberus = Animal.dog({name: 'Cerberus'});
const cerberus2 = Animal2.dog({name: 'Cerberus'});

type z = Animal;

const AmphibiousAnimal = variantList([
    variant('frog', fields<{color: string}>()),
]);
export type AmphibiousAnimal<T extends TypeNames<typeof AmphibiousAnimal> = undefined> = VariantOf<typeof AmphibiousAnimal, T>;

const WaterAnimal = variantList([
    variant('goldfish', fields<{memoryInSeconds: number}>()),
]);
export type WaterAnimal<T extends TypeNames<typeof WaterAnimal> = undefined> = VariantOf<typeof WaterAnimal, T>;
 