module( 've.dm.DocumentFragment' );

/* Tests */

test( 'constructor', 2, function() {
	var fragment = new ve.dm.DocumentFragment( ve.dm.example.data );
	deepEqual(
		ve.example.getNodeTreeSummary( fragment.getDocumentNode() ),
		ve.example.getNodeTreeSummary( ve.dm.example.tree ),
		'node tree matches example data'
	);
	raises(
		function() {
			fragment = new ve.dm.DocumentFragment( [
				{ 'type': '/paragraph' },
				{ 'type': 'paragraph' }
			] );
		},
		/^Unbalanced input passed to DocumentFragment$/,
		'unbalanced input causes exception'
	);
} );

test( 'getData', 1, function() {
	var fragment = new ve.dm.DocumentFragment( ve.dm.example.data );
	deepEqual( fragment.getData(), ve.dm.example.data );
} );

test( 'getOffsetMap', 61, function() {
	var fragment = new ve.dm.DocumentFragment( ve.dm.example.data ),
		actual = fragment.getOffsetMap(),
		expected = ve.dm.example.getOffsetMap( fragment.getDocumentNode() );
	ok( actual.length === expected.length, 'offset map lengths match' );
	for ( var i = 0; i < actual.length; i++ ) {
		ok( actual[i] === expected[i], 'reference at offset ' + i );
	}
} );

test( 'getNodeFromOffset', 60, function() {
	var fragment = new ve.dm.DocumentFragment( ve.dm.example.data ),
		root = fragment.getDocumentNode().getRoot(),
		node,
		expected = [
		[], // 0 - document
		[0], // 1 - heading
		[0], // 2 - heading
		[0], // 3 - heading
		[0], // 4 - heading
		[], // 5 - document
		[1], // 6 - table
		[1, 0], // 7 - tableRow
		[1, 0, 0], // 8 - tableCell
		[1, 0, 0, 0], // 9 - paragraph
		[1, 0, 0, 0], // 10 - paragraph
		[1, 0, 0], // 11 - tableCell
		[1, 0, 0, 1], // 12 - list
		[1, 0, 0, 1, 0], // 13 - listItem
		[1, 0, 0, 1, 0, 0], // 14 - paragraph
		[1, 0, 0, 1, 0, 0], // 15 - paragraph
		[1, 0, 0, 1, 0], // 16 - listItem
		[1, 0, 0, 1, 0, 1], // 17 - list
		[1, 0, 0, 1, 0, 1, 0], // 18 - listItem
		[1, 0, 0, 1, 0, 1, 0, 0], // 19 - paragraph
		[1, 0, 0, 1, 0, 1, 0, 0], // 20 - paragraph
		[1, 0, 0, 1, 0, 1, 0], // 21 - listItem
		[1, 0, 0, 1, 0, 1], // 22 - list
		[1, 0, 0, 1, 0], // 23 - listItem
		[1, 0, 0, 1], // 24 - list
		[1, 0, 0], // 25 - tableCell
		[1, 0, 0, 2], // 26 - list
		[1, 0, 0, 2, 0], // 27 - listItem
		[1, 0, 0, 2, 0, 0], // 28 - paragraph
		[1, 0, 0, 2, 0, 0], // 29 - paragraph
		[1, 0, 0, 2, 0], // 30 - listItem
		[1, 0, 0, 2], // 31 - list
		[1, 0, 0], // 32 - tableCell
		[1, 0], // 33 - tableRow
		[1], // 34 - table
		[], // 35- document
		[2], // 36 - preformatted
		[2], // 37 - preformatted
		[2], // 38 - preformatted
		[2], // 39 - preformatted
		[2], // 40 - preformatted
		[], // 41 - document
		[3], // 42 - definitionList
		[3, 0], // 43 - definitionListItem
		[3, 0, 0], // 44 - paragraph
		[3, 0, 0], // 45 - paragraph
		[3, 0], // 46 - definitionListItem
		[3], // 47 - definitionList
		[3, 1], // 48 - definitionListItem
		[3, 1, 0], // 49 - paragraph
		[3, 1, 0], // 50 - paragraph
		[3, 1], // 51 - definitionListItem
		[3], // 52 - definitionList
		[], // 53 - document
		[4], // 54 - paragraph
		[4], // 55 - paragraph
		[], // 56 - document
		[5], // 57 - paragraph
		[5], // 58 - paragraph
		[] // 59 - document
	];
	for ( var i = 0; i < expected.length; i++ ) {
		node = root;
		for ( var j = 0; j < expected[i].length; j++ ) {
			node = node.children[expected[i][j]];
		}
		ok( node === fragment.getNodeFromOffset( i ), 'reference at offset ' + i );
	}
} );

test( 'getDataFromNode', 3, function() {
	var fragment = new ve.dm.DocumentFragment( ve.dm.example.data );
	deepEqual(
		fragment.getDataFromNode( fragment.getDocumentNode().getChildren()[0] ),
		ve.dm.example.data.slice( 1, 4 ),
		'branch with leaf children'
	);
	deepEqual(
		fragment.getDataFromNode( fragment.getDocumentNode().getChildren()[1] ),
		ve.dm.example.data.slice( 6, 34 ),
		'branch with branch children'
	);
	deepEqual(
		fragment.getDataFromNode( fragment.getDocumentNode().getChildren()[2].getChildren()[1] ),
		[],
		'leaf without children'
	);
} );

test( 'getAnnotationsFromOffset', 1, function() {
	var fragment,
		range,
		cases = [
		{
			'msg': ['bold #1', 'bold #2'],
			'data': [
				['a', { '{"type:"bold"}': { 'type': 'bold' } }],
				['b', { '{"type:"bold"}': { 'type': 'bold' } }]
			],
			'expected': [
				[{ 'type': 'bold' }],
				[{ 'type': 'bold' }]
			]
		},
		{
			'msg': ['bold #3', 'italic #1'],
			'data': [
				['a', { '{"type:"bold"}': { 'type': 'bold' } }],
				['b', { '{"type:"italic"}': { 'type': 'italic' } }]
			],
			'expected': [
				[{ 'type': 'bold' }],
				[{ 'type': 'italic' }]
			]
		},
		{
			'msg': ['bold, italic & underline'],
			'data': [
				['a',
					{
						'{"type":"bold"}': { 'type': 'bold' },
						'{"type":"italic"}': { 'type': 'italic'},
						'{"type":"underline"}': { 'type': 'underline'}
					}]
			],
			'expected': [
				[{ 'type': 'bold' }, { 'type': 'italic' }, { 'type': 'underline' }]
			]
		}

	];
	var expectCount = 0;

	for (var c = 0; c < cases.length; c++) {
		expectCount += cases[c].data.length;
	}

	expect ( expectCount );

	for (var i=0; i<cases.length; i++) {
		fragment = new ve.dm.DocumentFragment ( cases[i].data );
		for (var j=0; j<fragment.getData().length;j++) {
			annotations = fragment.getAnnotationsFromOffset( j );
			deepEqual(
				annotations, cases[i].expected[j], cases[i].msg[j]
			);
		}

	}
} );

test( 'getAnnotationsFromRange', 1, function() {
	var fragment,
		range,
		cases = [
		{
			'msg': 'all bold',
			'data': [
				['a', { '{"type:"bold"}': { 'type': 'bold' } } ],
				['b', { '{"type:"bold"}': { 'type': 'bold' } } ]
			],
			'expected': [ { 'type': 'bold' } ]
		},
		{
			'msg': 'bold and italic',
			'data': [
				['a',
					{
						'{"type":"bold"}': { 'type': 'bold' },
						'{"type":"italic"}': { 'type': 'italic'}
					}
				],
				['b',
					{
						'{"type":"bold"}': { 'type': 'bold' },
						'{"type":"italic"}': { 'type': 'italic'}
					}
				]
			],
			'expected': [ { 'type': 'bold' }, { 'type': 'italic' } ]
		},
		{
			'msg': 'bold and italic',
			'data': [
				['a',
					{
						'{"type":"bold"}': { 'type': 'bold' },
						'{"type":"italic"}': { 'type': 'italic'}
					}
				],
				['b',
					{
						'{"type":"bold"}': { 'type': 'bold' },
						'{"type":"italic"}': { 'type': 'italic'},
						'{"type":"underline"}': { 'type': 'underline'}
					}
				]
			],
			'expected': [ { 'type': 'bold' }, { 'type': 'italic' } ]
		},
		{
			'msg': 'none common, non annotated character at end',
			'data': [
				['a',
					{
						'{"type":"bold"}': { 'type': 'bold' },
						'{"type":"italic"}': { 'type': 'italic'}
					}
				],
				['b',
					{
						'{"type":"bold"}': { 'type': 'bold' },
						'{"type":"italic"}': { 'type': 'italic'},
						'{"type":"underline"}': { 'type': 'underline'}
					}
				],
				['c']
			],
			'expected': []
		},
		{
			'msg': 'none common, reverse of previous',
			'data': [
				['a'],
				['b',
					{
						'{"type":"bold"}': { 'type': 'bold' },
						'{"type":"italic"}': { 'type': 'italic'},
						'{"type":"underline"}': { 'type': 'underline'}
					}
				],
				['c',
					{
						'{"type":"bold"}': { 'type': 'bold' },
						'{"type":"italic"}': { 'type': 'italic'}
					}
				]
			],
			'expected': []
		},
		{
			'msg': 'all different',
			'data': [
				['a', { '{"type:"bold"}': { 'type': 'bold' } } ],
				['b', { '{"type:"italic"}': { 'type': 'italic' } } ]
			],
			'expected': []
		},
		{
			'msg': 'no annotations',
			'data': ['a', 'b'],
			'expected': []
		}
	];

	expect( cases.length );

	for ( var i=0; i<cases.length; i++ ) {
		fragment = new ve.dm.DocumentFragment ( cases[i].data );
		range = new ve.Range( 0, fragment.getData().length );
		annotations = fragment.getAnnotationsFromRange( range );
		deepEqual(
			annotations, cases[i].expected, cases[i].msg
		);

	}
});


test( 'offsetContainsAnnotation', 1, function(){
	var cases = [
		{
			msg: 'contains no annotations',
			data: [
				['a']
			],
			lookFor: {'type': 'bold'},
			expected: false
		},
		{
			msg: 'contains bold',
			data: [
				['a', { '{"type:"bold"}': { 'type': 'bold' } } ]
			],
			lookFor: {'type': 'bold'},
			expected: true
		},
		{
			msg: 'contains bold',
			data: [
				['a', {
					'{"type:"bold"}': { 'type': 'bold' },
					'{"type":"italic"}': { 'type': 'italic'}
					}
				]
			],
			lookFor: {'type': 'bold'},
			expected: true
		}
	],
	fragment;

	expect( cases.length );

	for( var i=0;i<cases.length;i++) {
		fragment = new ve.dm.DocumentFragment( cases[i].data );
		
		deepEqual(
			fragment.offsetContainsAnnotation(0, cases[i].lookFor),
			cases[i].expected,
			cases[i].msg
		);
	}
});

test( 'getAnnotationRangeFromOffset', 1,  function(){
	var cases = [
		{
			msg: 'a bold word',
			data: [
				['a'], //0
				['b', { '{"type:"bold"}': { 'type': 'bold' } } ], //1
				['o', { '{"type:"bold"}': { 'type': 'bold' } } ], //2
				['l', { '{"type:"bold"}': { 'type': 'bold' } } ], //3
				['d', { '{"type:"bold"}': { 'type': 'bold' } } ], //4
				['w'], //5
				['o'], //6
				['r'], //7
				['d']  //8
			],
			annotation: { 'type': 'bold' },
			offset: 3,
			expected: new ve.Range( 1, 4 )
		},
		{
			msg: 'a linked',
			data: [
				['x'], //0
				['x'], //1
				['x'], //2
				['l', { '{"type:"link/internal"}': { 'type': 'link/internal' } } ], //3
				['i', { '{"type:"link/internal"}': { 'type': 'link/internal' } } ], //4
				['n', { '{"type:"link/internal"}': { 'type': 'link/internal' } } ], //5
				['k', { '{"type:"link/internal"}': { 'type': 'link/internal' } } ], //6
				['x'], //7
				['x'], //8
				['x']  //9
			],
			annotation: { 'type': 'link/internal' },
			offset: 3,
			expected: new ve.Range( 3, 6 )
		}
	],
	fragment;

	expect( cases.length );

	for( var i=0;i<cases.length;i++) {
		fragment = new ve.dm.DocumentFragment( cases[i].data );
		
		deepEqual(
			fragment.getAnnotationRangeFromOffset(cases[i].offset, cases[i].annotation),
			cases[i].expected,
			cases[i].msg
		);
	}
});

