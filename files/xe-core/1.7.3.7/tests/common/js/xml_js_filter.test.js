jQuery(function($){
	module('Validator');

	var
		v     = xe.getApp('validator')[0],
		$form = $('#validator-test'),
		form  = $form[0], elems = form.elements;

	var Mute = xe.createPlugin('Mute', {
		API_BEFORE_ALERT : function(){ return false }
	});
	v.registerPlugin(new Mute());

	test('Basics', function(){
		ok(v.run(form), 'Default return value is true');
	});

	test('attr : required?', function(){
		form.reset();
		form.ruleset.value = 'ruleset';

		v.cast('ADD_FILTER', ['ruleset', {'user_1':{required:true}}]);
		ok(!v.run(form), 'The required field should have some value. - test1');

		elems.user_1.value = 'myname';
		ok(v.run(form), 'The required field should have some value. - test2');
	});

	test('attr : name pattern', function(){
		form.reset();
		form.ruleset.value = 'ruleset';

		v.cast(
			'ADD_FILTER',
			['ruleset',
				{
					'^user_':{required:true}
				}
			]
		);

		elems.user_1.value = 'value1';
		ok(!v.run(form), 'This test should be failed. (only one of three fields has value)');

		elems.user_2.value = 'value2';
		ok(!v.run(form), 'not yet (2 of 3)');

		elems.user_3.value = 'value3';
		ok(v.run(form), 'ok! you should pass at this time. (3 of 3)');
	});

});
