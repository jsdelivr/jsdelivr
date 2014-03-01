describe("Sisyphus", function() {
	var sisyphus, targetForm, namedForm;
	
	beforeEach( function() {
		loadFixtures( "fixtures.html" );
		sisyphus = Sisyphus.getInstance();
		sisyphus.setOptions( {} );
		targetForm = $( "#form1" );
		namedForm = $( "#named" );
		sisyphus.protect( targetForm );
	} );
	
	afterEach( function() {
		sisyphus = Sisyphus.free();
	} );
	
	
	it( "should return an object on instantiating", function() {
		var sisyphus1 = Sisyphus.getInstance();
		expect( typeof sisyphus1 ).toEqual( "object" );
	} );

	it( "should return null on freeing", function() {
		sisyphus = Sisyphus.free();
		expect( sisyphus ).toEqual( null );
	} );
	
	it( "should return the same instance", function() {
		var sisyphus1 = Sisyphus.getInstance(),
			sisyphus2 = Sisyphus.getInstance();
		expect( sisyphus1 ).toEqual( sisyphus2 );
	} );
	
	
	it( "should have instances with common options, i.e. be a Singleton", function() {
		var sisyphus1 = Sisyphus.getInstance(),
			sisyphus2 = Sisyphus.getInstance();
		
		sisyphus1.setOptions( { 
			timeout: 5 
		} );
		sisyphus2.setOptions( { 
			timeout: 15
		} );
		expect( sisyphus1.options ).toEqual( sisyphus2.options );
	} );
	
	
	it( "should return false if Local Storage is unavailable", function() {
		spyOn( sisyphus.browserStorage, "isAvailable" ).andCallFake( function() {
			return false;
		} );
		expect( sisyphus.protect( targetForm ) ).toEqual( false );
	} );
	
	
	it( "should bind saving data only once", function() {
		sisyphus = Sisyphus.free();
		sisyphus = Sisyphus.getInstance();
		spyOn( sisyphus, "bindSaveData" );
		sisyphus.protect( "form" );
		expect( sisyphus.bindSaveData.callCount ).toEqual( 1 );
	} );
	
	it( "should bind saving data only once - if new call is done it should just add new targets to protect", function() {
		// #form1 is already being protected from 'beforeEach' method
		spyOn( sisyphus, "bindSaveData" );
		sisyphus.protect( $("#form2") );
		expect( sisyphus.bindSaveData.callCount ).toEqual( 0 );
	} );
	
	it( "if new call is done it should just add new targets to protect", function() {
		// #form1 is already being protected from 'beforeEach' method
		var targets1 = 	sisyphus.targets.length,
						targets2;
		sisyphus.protect( $("#form2") );
		targets2 = sisyphus.targets.length;
		expect( targets1 ).toBeLessThan( targets2 );
	} );
	
	it( "should allow a custom name for the form", function() {
		sisyphus = Sisyphus.getInstance();
		sisyphus.setOptions( { name: "something" } );
		sisyphus.protect( namedForm );
		expect ( sisyphus.href ).toEqual( "something" );
	} );

	it( "should not protect the same form twice and more times", function() {
		// #form1 is already being protected from 'beforeEach' method
		var targets1 = 	sisyphus.targets.length,
						targets2;
		sisyphus.protect( $("#form1") );
		sisyphus.protect( $("#form1") );
		targets2 = sisyphus.targets.length;
		expect( targets1 ).toEqual( targets2 );
	} );
	
	
	it( "should save textfield data on key input, if options.timeout is not set", function() {
		spyOn( sisyphus, "saveToBrowserStorage" );
		$( ":text:first", targetForm ).trigger( "oninput" );
		expect( sisyphus.saveToBrowserStorage ).toHaveBeenCalled();
	} );
	
	it( "should not save all data, but textfield only on key input, if options.timeout is not set", function() {
		spyOn( sisyphus, "saveAllData" );
		$( ":text:first", targetForm ).trigger( "oninput" );
		expect( sisyphus.saveAllData.callCount ).toEqual( 0 );
	} );
	
	it( "should save textarea data on key input, if options.timeout is not set", function() {
		spyOn( sisyphus, "saveToBrowserStorage" );
		$( "textarea:first", targetForm ).trigger( "oninput" );
		expect( sisyphus.saveToBrowserStorage ).toHaveBeenCalled();
	} );
	
	it( "should not save all data, but textarea only on key input, if options.timeout is not set", function() {
		spyOn( sisyphus, "saveAllData" );
		$( "textarea:first", targetForm ).trigger( "oninput" );
		expect( sisyphus.saveAllData.callCount ).toEqual( 0 );
	} );
	
	it( "should save all data on checkbox change", function() {
		spyOn( sisyphus, "saveAllData" );
		$( ":checkbox:first", targetForm ).trigger( "change" );
		expect( sisyphus.saveAllData ).toHaveBeenCalled();
	} );
	
	it( "should save all data on radio change", function() {
		spyOn( sisyphus, "saveAllData" );
		$( ":radio:first", targetForm ).trigger( "change" );
		expect( sisyphus.saveAllData ).toHaveBeenCalled();
	} );
	
	it( "should save all data on select change", function() {
		spyOn( sisyphus, "saveAllData" );
		$( "select:first", targetForm ).trigger( "change" );
		expect( sisyphus.saveAllData ).toHaveBeenCalled();
	} );
	
	
	it( "should fire callback once on saving all data to Local Storage", function() {
		spyOn( sisyphus.options, "onSave" );
		sisyphus.saveAllData();
		expect( sisyphus.options.onSave.callCount ).toEqual( 1 );
	} );
	
	it( "should fire callback on saving data to Local Storage", function() {
		spyOn( sisyphus.options, "onSave" );
		sisyphus.saveToBrowserStorage( "key", "value" );
		expect( sisyphus.options.onSave ).toHaveBeenCalled();
	} );
	
	it( "should fire callback on removing data from Local Storage", function() {
		spyOn( sisyphus.options, "onRelease" );
		sisyphus.releaseData( targetForm.attr( "id" ), targetForm.find( ":text" ) );
		expect( sisyphus.options.onRelease ).toHaveBeenCalled();
	} );
	
	it( "should fire callback on restoring data from Local Storage", function() {
		spyOn( localStorage, "getItem" ).andCallFake( function() { 
			return "value";
		} );
		spyOn( sisyphus.options, "onRestore" );
		sisyphus.restoreAllData();
		expect( sisyphus.options.onRestore ).toHaveBeenCalled();
	} );
	
	it( "should not store excluded fields data", function() {
		sisyphus.setOptions( {
			excludeFields: $( "textarea:first" )
		})
		$( "textarea:first" ).val( "should not store" );
		sisyphus.saveAllData();
		$( "textarea:first" ).val( "" );
		sisyphus.restoreAllData();
		expect( $( "textarea:first" ).val() ).toEqual( "" );
	} );
	
});


describe("jQuery.sisyphus", function() {
	
	beforeEach( function() {
		loadFixtures( "fixtures.html" );
	} );
	
	
	it( "should return a Sisyphus instance", function() {
		var o =  $( "#form1" ).sisyphus(),
			sisyphus = Sisyphus.getInstance();
		expect( o ).toEqual( sisyphus );
	} );

	it( "should set the custom name on the Sisyphus instance", function() {
		Sisyphus.free()
		var o = $(" #named" ).sisyphus( { name: "custom-name" } );
			sisyphus = Sisyphus.getInstance();
		expect( o.href ).toEqual( "custom-name" );
	} );

	it( "should protect matched forms with Sisyphus", function() {
		spyOn( Sisyphus.getInstance(), "protect" );
		$( "#form1" ).sisyphus(),
		expect( Sisyphus.getInstance().protect ).toHaveBeenCalled();
	} );
	
});

