var All = require('..').All;
var all = require('..').all;
var sameTypeAs = require('..').sameTypeAs;
var Spec = require('..').Spec;

describe( 'All', function () {

	const createFakeUnsatisfiedSpec: () => Spec< any, any > = () => (
		{
			isSatisfiedBy( candidate: any ): boolean { return false; }
		} as Spec< any, any >
	);

	const createFakeSatisfiedSpec: () => Spec< any, any > = () => (
		{
			isSatisfiedBy( candidate: any ): boolean { return true; }
		} as Spec< any, any >
	);

	describe( 'satisfied by', () => {

		it( 'empty input', () => {
			expect(
				( new All() ).isSatisfiedBy( {} )
			).toBeTruthy();
		} );

		it( 'only passing Specs', () => {

			const all = new All(
				createFakeSatisfiedSpec(),
				createFakeSatisfiedSpec()
				);

			expect( all.isSatisfiedBy( {} ) ).toBeTruthy();
		} );

	} );

	describe( 'not satisfied by', () => {

		it( 'at least one failing Spec', () => {
			const all = new All(
				createFakeSatisfiedSpec(),
				createFakeUnsatisfiedSpec()
			);
			expect( all.isSatisfiedBy( 0 ) ).toBeFalsy();
		} );

	} );

    it( 'sugar works', () => {
		const sugar = all(
			createFakeSatisfiedSpec(),
			createFakeUnsatisfiedSpec()
		);
		const noSugar = new All(
			createFakeSatisfiedSpec(),
			createFakeUnsatisfiedSpec()
		);
        expect( sameTypeAs( sugar ).isSatisfiedBy( noSugar ) ).toBeTruthy();
    } );

} );
