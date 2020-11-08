import oCoreBox from "../src/index.js";



let oAttrs, eBase;

/**
 * создает один Element с указаными атрибутами и его же парсит с указаным префиксом
 * @param sAttrs строка с атрибутами
 * @param sPrefix префикс типа
 * @param iCnt кол-во атрибутов
 * @returns {*}
 */
const fnCast = ( sAttrs, sPrefix, iCnt ) => {
	document.body.insertAdjacentHTML(
		'afterbegin',
		`<div id="base" ${sAttrs}></div>`
	);
	let eBase = document.getElementById( 'base' );
	const oMap = {};
	for( let i = 1; i <= iCnt; i++ ) {
		oMap[ sPrefix + i ] = sPrefix + ':' + sPrefix + i;
	}
	return oAttrs.parse( [ eBase ], oMap );
};

describe( "Attrs", () => {

	beforeAll( ( fnDone ) => {
		oCoreBox.init( () => {
			oAttrs = oCoreBox.oneAttrs();
			fnDone();
		} );
	} );

	it( "map types", () => {
		document.body.insertAdjacentHTML(
			'afterbegin',
			`<div id="base" data-foo="bar">
			</div>`
		);
		eBase = document.getElementById( 'base' );
		expect(
			oAttrs.parse(
				[ eBase ],
				[ 'foo' ]
		) ).toEqual(
			{ foo: 'bar' }
		);

		expect(
			oAttrs.parse(
				[ eBase ],
				[ 's:foo' ]
			) ).toEqual(
			{ foo: 'bar' }
		);

		expect(
			oAttrs.parse(
				[ eBase ],
				{ 'foo': 'new' }
			) ).toEqual(
			{ 'new': 'bar' }
		);

		expect(
			oAttrs.parse(
				[ eBase ],
				{ 'foo': 's:new' }
			) ).toEqual(
			{ 'new': 'bar' }
		);
	} );


	it( "bool", () => {
		expect(
			fnCast(
				`
				data-b1="0"
				data-b2="1"
				data-b3=""
				data-b4="false"
				data-b5="true"
				`,
				'b',
				5
			)
		).toEqual( {
			b1: false,
			b2: true,
			b3: false,
			b4: true,
			b5: true
		} );
	} );

	it( "int", () => {
		expect(
			fnCast(
				`
				data-i1="0"
				data-i2="1"
				data-i3=""
				data-i4="false"
				data-i5="-100e10"
				`,
				'i',
				5
			)
		).toEqual( {
			i1: 0,
			i2: 1,
			i3: 0,
			i4: 0,
			i5: -100,
		} );
	} );

	it( "json", () => {
		expect(
			fnCast(
				`
				data-js1='{}'
				data-js2='{"var1":"value1"}'
				data-js3='false'
				data-js4='"string"'
				data-js5='1'
				`,
				'js',
				5
			)
		).toEqual( {
			js1: {},
			js2: {var1:"value1"},
			js3: false,
			js4: 'string',
			js5: 1,
		} );
	} );

	it( "float", () => {
		expect(
			fnCast(
				`
					data-f1='-1.2'
					data-f2='-1.2e2'
					data-f3='false'
					data-f4=''
					data-f5='0'
				`,
				'f',
				5
			)
		).toEqual( {
			f1: -1.2,
			f2: -120,
			f3: 0,
			f4: 0,
			f5: 0,
		} );
	} );

	it( "string[]", () => {
		expect(
			fnCast(
				`
					data-as1='one,two,tree'
					data-as2=' one,, tree '
				`,
				'as',
				2
			)
		).toEqual( {
			as1: ['one','two','tree'],
			as2: ['one', '', 'tree'],
		} );
	} );

	it( "mod", () => {
		expect(
			fnCast(
				`
					data-mod1="1=one,2=two,3=three"
					data-mod2="=default,checked=checked,"
					data-mod3="false"
					data-mod4="string"
					data-mod5="1"
				`,
				'mod',
				5
			)
		).toEqual( {
			mod1: {"1":"one","2":"two","3":"three"},
			mod2: {"":"default","checked":"checked"},
			mod3: {"":"false"},
			mod4: {"":"string"},
			mod5: {"":"1"},
		} );
	} );

	it( "without type prefix", () => {
		document.body.insertAdjacentHTML(
			'afterbegin',
			`<div id="base" data-s1="string">
			</div>`
		);
		eBase = document.getElementById( 'base' );
		expect(
			oAttrs.parse(
				[ eBase ],
				{
					s1: "s1",
				}
			)
		).toEqual(
			{
				s1: 'string'
			}
		);
	} );

	it( "undefined type prefix", ( done ) => {
		try {
			document.body.insertAdjacentHTML(
				'afterbegin',
				`<div id="base" data-foo1="foo1">
				</div>`
			);
			eBase = document.getElementById( 'base' );
			oAttrs.parse(
				[ eBase ], {
					foo1: "foo:foo1",
				}
			);
			fail();
		} catch( e ) {
			done();
		}
	} );

	it( "custom attr prefix", () => {
		document.body.insertAdjacentHTML(
			'afterbegin',
			`<div id="base" custom-prefix-data="5">
				</div>`
		);
		eBase = document.getElementById( 'base' );
		const oProps = oAttrs.parse(
			[ eBase ],
			{
				data: "i:iData",
			},
			'custom-prefix-'
		);
		expect( oProps ).toEqual( { iData: 5 } );
	} );

	it( "map as array", () => {
		document.body.insertAdjacentHTML(
			'afterbegin',
			`<div id="base" data-var="5" data-var2="two">
				</div>`
		);
		eBase = document.getElementById( 'base' );
		const oProps = oAttrs.parse(
			[ eBase ],
			[
				[ 'var', 'iVar', 'i' ],
				[ 'var2', 'sVar2' ]
			]
		);
		expect( oProps ).toEqual( { iVar: 5, sVar2: "two" } );
	} );
} );