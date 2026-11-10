
export interface Spec< C, T extends C | unknown > {

    isSatisfiedBy( candidate: C | T ): boolean;

    and( other: Spec< C, T > ): Spec< C, T >;

    andNot( other: Spec< C, T > ): Spec< C, T >;

    or( other: Spec< C, T > ): Spec< C, T >;

    orNot( other: Spec< C, T > ): Spec< C, T >;

    xor( other: Spec< C, T > ): Spec< C, T >;

    xorNot( other: Spec< C, T > ): Spec< C, T >;

    not(): Spec< C, T >;

}


export abstract class Composite< C, T > implements Spec< C, T > {

    abstract isSatisfiedBy( candidate: C | T ): boolean;

    and( other: Spec< C, T > ): Spec< C, T > {
        return new And< C, T >( this, other );
    }

    andNot( other: Spec< C, T > ): Spec< C, T > {
        return new AndNot< C, T >( this, other );
    }

    or( other: Spec< C, T > ): Spec< C, T > {
        return new Or< C, T >( this, other );
    }

    orNot( other: Spec< C, T > ): Spec< C, T > {
        return new OrNot< C, T >( this, other );
    }

    xor( other: Spec< C, T > ): Spec< C, T > {
        return new Xor< C, T >( this, other );
    }

    xorNot( other: Spec< C, T > ): Spec< C, T > {
        return new XorNot< C, T >( this, other );
    }

    not(): Spec< C, T > {
        return new Not< C, T >( this );
    }

}

// ---------------------------------------------------------------------------

class And< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _left: Spec< C, T >, protected _right: Spec< C, T > ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return this._left.isSatisfiedBy( candidate ) && this._right.isSatisfiedBy( candidate );
    }

    toString(): string {
        return '(' + this._left.toString() + ' and ' + this._right.toString() + ')';
    }

}

// Syntax sugar
function and< C, T extends C | unknown >( left: Spec< C, T >, right: Spec< C, T > ) {
    return new And< C, T >( left, right );
}

// ---------------------------------------------------------------------------

class AndNot< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _left: Spec< C, T >, protected _right: Spec< C, T > ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return this._left.isSatisfiedBy( candidate ) && ! this._right.isSatisfiedBy( candidate );
    }

    toString(): string {
        return '(' + this._left.toString() + ' and not ' + this._right.toString() + ')';
    }

}

// Syntax sugar
function andNot< C, T extends C | unknown >( left: Spec< C, T >, right: Spec< C, T > ) {
    return new AndNot< C, T >( left, right );
}

// ---------------------------------------------------------------------------

class Or< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _left: Spec< C, T >, protected _right: Spec< C, T > ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return this._left.isSatisfiedBy( candidate ) || this._right.isSatisfiedBy( candidate );
    }

    toString(): string {
        return '(' + this._left.toString() + ' or ' + this._right.toString() + ')';
    }

}

// Syntax sugar
function or< C, T extends C | unknown >( left: Spec< C, T >, right: Spec< C, T > ) {
    return new Or< C, T >( left, right );
}

// ---------------------------------------------------------------------------

class OrNot< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _left: Spec< C, T >, protected _right: Spec< C, T > ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return this._left.isSatisfiedBy( candidate ) || ! this._right.isSatisfiedBy( candidate );
    }

    toString(): string {
        return '(' + this._left.toString() + ' or not ' + this._right.toString() + ')';
    }

}

// Syntax sugar
function orNot< C, T extends C | unknown >( left: Spec< C, T >, right: Spec< C, T > ) {
    return new OrNot< C, T >( left, right );
}

// ---------------------------------------------------------------------------

// XOR comparison hack
function _xor( a: any, b: any ): boolean {
	return !a != !b;
}

class Xor< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _left: Spec< C, T >, protected _right: Spec< C, T > ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return _xor( this._left.isSatisfiedBy( candidate ), this._right.isSatisfiedBy( candidate ) );
    }

    toString(): string {
        return '(' + this._left.toString() + ' xor ' + this._right.toString() + ')';
    }

}

// Syntax sugar
function xor< C, T extends C | unknown >( left: Spec< C, T >, right: Spec< C, T > ) {
    return new Xor< C, T >( left, right );
}

// ---------------------------------------------------------------------------
class XorNot< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _left: Spec< C, T >, protected _right: Spec< C, T > ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return _xor( this._left.isSatisfiedBy( candidate ), ! this._right.isSatisfiedBy( candidate ) );
    }

    toString(): string {
        return '(' + this._left.toString() + ' xor not ' + this._right.toString() + ')';
    }

}

// Syntax sugar
function xorNot< C, T extends C | unknown >( left: Spec< C, T >, right: Spec< C, T > ) {
    return new XorNot< C, T >( left, right );
}

// ---------------------------------------------------------------------------
class Not< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _other: Spec< C, T > ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return ! this._other.isSatisfiedBy( candidate );
    }

    toString(): string {
        return '(not ' + this._other.toString() + ')';
    }

}

// Syntax sugar
function not< C, T extends C | unknown >( other: Spec< C, T > ) {
    return new Not< C, T >( other );
}

// ---------------------------------------------------------------------------

class EqualTo< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _value: T ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return this._value == candidate;
    }

    toString(): string {
        return 'equal to ' + this._value;
    }

}

// Syntax sugar
function equalTo< C, T extends C | unknown >( value: T ) {
    return new EqualTo< C, T >( value );
}

// ---------------------------------------------------------------------------

class StrictEqualTo< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _value: T ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return this._value === candidate;
    }

    toString(): string {
        return 'strict equal to ' + this._value;
    }

}

// Syntax sugar
function strictEqualTo< C, T extends C | unknown >( value: T ) {
    return new StrictEqualTo< C, T >( value );
}

// ---------------------------------------------------------------------------

class SameValueAs< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _value: T ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {

        const hasSimpleType = ( x: unknown ): function boolean { return [ 'string', 'number', 'bigint', 'boolean', 'undefined' ].indexOf( typeof x ) >= 0; };

        if ( hasSimpleType( candidate ) && hasSimpleType( this._value ) ) {
            return candidate == this._value;
        }

        return JSON.stringify( candidate ) == JSON.stringify( this._value );
    }

    toString(): string {
        return 'has same value as ' + this._value;
    }

}

// Syntax sugar
function sameValueAs< C, T extends C | unknown >( value: T ) {
    return new SameValueAs< C, T >( value );
}

// ---------------------------------------------------------------------------

class SameTypeAs< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _value: T ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {

        const notAnObject = ( x: unknown ): function boolean { return typeof x != 'object'; };

        if ( notAnObject( candidate ) && notAnObject( this._value ) ) {
            return typeof candidate == typeof this._value;
        }

        return candidate.constructor.name == this._value.constructor.name;
    }

    toString(): string {
        return 'has same type as ' + this._value;
    }

}

// Syntax sugar
function sameTypeAs< C, T extends C | unknown >( value: T ) {
    return new SameTypeAs< C, T >( value );
}

// ---------------------------------------------------------------------------

class GreaterThan< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _min: T ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return candidate > this._min;
    }

    toString(): string {
        return 'greater than ' + this._min;
    }

}

// Syntax sugar
function greaterThan< C, T extends C | unknown >( min: T ) {
    return new GreaterThan< C, T >( min );
}

// ---------------------------------------------------------------------------

class GreaterThanOrEqualTo< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _min: T ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return candidate >= this._min;
    }

    toString(): string {
        return 'greater than or equal to ' + this._min;
    }

}

// Syntax sugar
function greaterThanOrEqualTo< C, T extends C | unknown >( min: T ) {
    return new GreaterThanOrEqualTo< C, T >( min );
}

// ---------------------------------------------------------------------------

class LessThan< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _max: T ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return candidate < this._max;
    }

    toString(): string {
        return 'less than ' + this._max;
    }

}

// Syntax sugar
function lessThan< C, T extends C | unknown >( max: T ) {
    return new LessThan< C, T >( max );
}

// ---------------------------------------------------------------------------

class LessThanOrEqualTo< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _max: T ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return candidate <= this._max;
    }

    toString(): string {
        return 'less than or equal to ' + this._max;
    }

}

// Syntax sugar
function lessThanOrEqualTo< C, T extends C | unknown >( max: T ) {
    return new LessThanOrEqualTo< C, T >( max );
}

// ---------------------------------------------------------------------------

class StartsWith< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _value: string, protected _ignoreCase: boolean = false ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        const c = this._ignoreCase ? candidate.toString().toLowerCase() : candidate.toString();
        const v = this._ignoreCase ? this._value.toString().toLowerCase() : this._value.toString();
        return 0 === c.indexOf( v );
    }

    toString(): string {
        return 'starts with ' + this._value;
    }

}

// Syntax sugar
function startsWith< C, T extends C | unknown >( value: string, ignoreCase: boolean = false ) {
    return new StartsWith< C, T >( value, ignoreCase );
}

// ---------------------------------------------------------------------------

class EndsWith< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _value: string, protected _ignoreCase: boolean = false ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        const c = this._ignoreCase ? candidate.toString().toLowerCase() : candidate.toString();
        const v = this._ignoreCase ? this._value.toString().toLowerCase() : this._value.toString();
        return c.substr( c.length - v.length, v.length ) === v;
    }

    toString(): string {
        return 'ends with ' + this._value;
    }

}

// Syntax sugar
function endsWith< C, T extends C | unknown >( value: string, ignoreCase: boolean = false ) {
    return new EndsWith< C, T >( value, ignoreCase );
}

// ---------------------------------------------------------------------------

class Contains< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _value: string, protected _ignoreCase: boolean = false ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        const c = this._ignoreCase ? candidate.toString().toLowerCase() : candidate.toString();
        const v = this._ignoreCase ? this._value.toString().toLowerCase() : this._value.toString();
        return c.indexOf( v ) !== -1;
    }

    toString(): string {
        return 'contains ' + this._value;
    }

}

// Syntax sugar
function contains< C, T extends C | unknown >( value: string, ignoreCase: boolean = false ) {
    return new Contains< C, T >( value, ignoreCase );
}

// ---------------------------------------------------------------------------

class In< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _values: T[] ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return this._values.indexOf( candidate as T ) >= 0;
    }

    toString(): string {
        return 'in [' + this._values.join( ', ' ) + ']';
    }

}

// Syntax sugar
function isIn< C, T extends C | unknown >( values: T[] ) {
    return new In< C, T >( values );
}

// ---------------------------------------------------------------------------

class Between< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _min: T, protected _max: T ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return candidate >= this._min && candidate <= this._max;
    }

    toString(): string {
        return 'between (' + this._min + ', ' + this._max + ')';
    }

}

// Syntax sugar
function between< C, T extends C | unknown >(  min: T, max: T ) {
    return new Between< C, T >( min, max );
}

// ---------------------------------------------------------------------------

class LengthBetween< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _min: number, protected _max: number ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        const len = candidate.toString().length;
        return len >= this._min && len <= this._max;
    }

    toString(): string {
        return 'length between (' + this._min + ', ' + this._max + ')';
    }

}

// Syntax sugar
function lengthBetween< C, T extends C | unknown >(  min: number, max: number ) {
    return new LengthBetween< C, T >( min, max );
}

// ---------------------------------------------------------------------------

class Empty< C, T extends C | unknown > extends Composite< C, T > {

    constructor() {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return Array.isArray( candidate )
            ? 0 === candidate.length
            : '' === candidate;
    }

    toString(): string {
        return 'is empty';
    }

}

// Syntax sugar
function empty< C, T extends C | unknown >() {
    return new Empty< C, T >();
}

// ---------------------------------------------------------------------------

class Matches< C, T extends C | unknown > extends Composite< C, T > {

    constructor( protected _regex: RegExp ) {
        super();
    }

    isSatisfiedBy( candidate: C | T ): boolean {
        return this._regex.test( candidate.toString() );
    }

    toString(): string {
        return 'regex ' + this._regex.source;
    }

}

// Syntax sugar
function matches< C, T extends C | unknown >( regex: RegExp ) {
    return new Matches< C, T >( regex );
}

// ---------------------------------------------------------------------------

class Any< C, T extends C | unknown > extends Composite< C, T > {

	protected readonly specs: Spec< C, T >[];

	constructor( ...specs: Spec< C, T >[] ) {
		super();
		this.specs = specs;
	}

	isSatisfiedBy( candidate: C | T ): boolean {
		for ( const currentSpec of this.specs ) {
			if ( currentSpec.isSatisfiedBy( candidate ) ) {
                return true;
            }
		}
		return 0 == this.specs.length;
	}

	toString(): string {
		return '(' + this.specs.join( ' or ' ) + ')';
	}
}

// Syntax sugar
function any< C, T extends C | unknown >( ...specs: Spec< C, T >[] ) {
    return new Any< C, T >( ...specs );
}

// ---------------------------------------------------------------------------

class All< C, T extends C | unknown > extends Composite< C, T > {

	protected readonly specs: Spec< C, T >[];

	constructor( ...specs: Spec< C, T >[] ) {
		super();
		this.specs = specs;
	}

	isSatisfiedBy( candidate: C | T ): boolean {
		for ( const currentSpec of this.specs ) {
			if ( ! currentSpec.isSatisfiedBy( candidate ) ) {
                return false;
            }
		}
		return true;
	}

	toString(): string {
		return '(' + this.specs.join( ', ' ) + ')';
	}
}

// Syntax sugar
function all< C, T extends C | unknown >( ...specs: Spec< C, T >[] ) {
    return new All< C, T >( ...specs );
}
