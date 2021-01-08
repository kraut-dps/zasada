import oRoot from "./_support/bootstrap.js";
import {Form} from "../src/widget/Form.js";

let oHelper, eForm, eFormField1, eFormField2, eFormField3;
describe( "FormValidate", () => {

	beforeAll( ( fnDone ) => {

		oRoot.core.init( ( oLinker ) => {
			oRoot.frame.init();
			oLinker.setOpts( {
				FormField: {
					oProps: {
						bOnChange: true,
						bOnType: true
					}
				},
			} );
			oHelper = oRoot.test.oneHelper();
			fnDone();
		} );
	} );

	beforeEach( async ( fnDone ) => {
		jasmine.Ajax.install();

		await oHelper.addHtml(
			`<form action="#" class="form _ _Form">
					<div class="form-field1 _ _FormField">
						<div class="_FormField-Label">label</div>
						<input class="_FormField-Input" name="field1" value="value1"/>
						<div class="_FormField-Error"></div>
					</div>
					<div class="form-field2 _ _FormField">
						<div class="_FormField-Label">label</div>
						<input class="_FormField-Input" name="field2" value="value2"/>
						<div class="_FormField-Error"></div>
					</div>
					<div class="form-field3 _ _FormField">
						<div class="_FormField-Label">label</div>
						<input class="_FormField-Input" name="field3" value="value3"/>
						<div class="_FormField-Error"></div>
					</div>
				</div>`
		);
		eForm = oHelper.element( '.form' );
		eFormField1 = oHelper.element( '.form-field1' );
		eFormField2 = oHelper.element( '.form-field2' );
		eFormField3 = oHelper.element( '.form-field3' );
		fnDone();
	} );

	afterEach( () => {
		jasmine.Ajax.uninstall();
	} );

	describe( "base", () => {

		it( "params", () => {

			const oFormWidget = oHelper.widget( '.form', Form );
			oFormWidget.validate();

			const oRequest = jasmine.Ajax.requests.mostRecent();
			expect( oRequest.method ).toBe('POST');
			expect( oRequest.params ).toEqual(
				objToFormData( {
				field1: 'value1',
				field2: 'value2',
				field3: 'value3',
				'X-Form-Validate': '1'
			} ) );

			eFormField2.querySelector( 'input' ).value = 'value2-change';

			oFormWidget.validate();

			expect( jasmine.Ajax.requests.mostRecent().params ).toEqual( objToFormData( {
				field1: 'value1',
				field2: 'value2-change',
				field3: 'value3',
				'X-Form-Validate': '1'
			} ) );
		} );

		it( "submit", ( fnDone ) => {
			const oFormWidget = oHelper.widget( '.form', Form );
			oFormWidget.validate();

			expect( getClasses( eFormField1 ) ).toEqual( { process: true, success: false, error: false } );
			expect( getClasses( eFormField2 ) ).toEqual( { process: true, success: false, error: false } );

			jasmine.Ajax.requests.mostRecent().respondWith( {
				"status": 200,
				"responseText": JSON.stringify( { sError: '', oFieldErrors: { field2: 'error' } } )
			});

			expect( getClasses( eFormField1 ) ).toEqual( { process: false, success: true, error: false } );
			expect( getClasses( eFormField2 ) ).toEqual( { process: false, success: false, error: true } );

			fnDone();

		} );

		it( "change", ( done ) => {
			const oEvent = new CustomEvent( 'change', {
				cancelable: true
			} );
			eFormField2.querySelector( 'input' ).dispatchEvent( oEvent );

			expect( getClasses( eFormField1 ) ).toEqual( { process: false, success: false, error: false } );
			expect( getClasses( eFormField2 ) ).toEqual( { process: true, success: false, error: false } );
			expect( getClasses( eFormField3 ) ).toEqual( { process: false, success: false, error: false } );

			jasmine.Ajax.requests.mostRecent().respondWith( {
				"status": 200,
				"responseText": JSON.stringify( { sError: '', oFieldErrors: { field1: 'error', field2: 'error' } } )
			});

			expect( getClasses( eFormField1 ) ).toEqual( { process: false, success: false, error: false } );
			expect( getClasses( eFormField2 ) ).toEqual( { process: false, success: false, error: true } );
			expect( getClasses( eFormField3 ) ).toEqual( { process: false, success: false, error: false } );

			done();
		} );
	} );
} );

function getClasses( eContext ) {
	const aClasses = [ 'process', 'success', 'error' ];
	let oRet = {};
	for( let i = 0; i < aClasses.length; i++ ) {
		oRet[ aClasses[ i ] ] = eContext.classList.contains( aClasses[ i ] );
	}
	return oRet;
}

function objToFormData( oObj ) {
	const oRet = new FormData();
	for( let sKey in oObj ) {
		oRet.set( sKey, oObj[ sKey ] );
	}
	return oRet;
}