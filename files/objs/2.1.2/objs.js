/**
 * @classDescription
 * A minimalistic library intended to help in using namespaces and class
 * inheritance in JavaScript.
 * 
 * @see Sources - https://github.com/tekool/objs
 * @see Documentation - https://github.com/tekool/objs/wiki
 * @author   Frederic Saunier - www.tekool.net
 * @version 2.1
 *
 * @license
 *
 * Copyright (C) 2006-2012 Frederic Saunier, www.tekool.net
 * Objs may be freely distributed under the MIT license.
 * For all details and documentation: https://github.com/tekool/objs/
 */
var Objs;
new function()
{
	/**
	 * Create or retrieve a class constructor using its unique classpath.
	 * 
	 * <P>
	 * If a class is declared twice with the same namespace, the last class
	 * will replace the previous one (previous is eligible for garbage
	 * collection.
	 *
	 * @param {String} classpath
	 * 		The classpath of the class to create or retrieve.
	 * 
	 * 		<P>Retrieve:
	 * 		If <code>classpath</code> is the only parameter passed when calling
	 * 		Objs, the class constructor corresponding to the given classpath is
	 * 		returned. A new class constructor is returned if no constructor for
	 * 		the given classpath first exists.
	 * 
	 * 	 	<P>Create:
	 * 		If <code>classpath</code> parameter is followed by one or two valid
	 * 		parameters it will create a class.
	 *
	 * @param {String|Function|Object} second
	 * 		{String} A superclass path to inherit from typed as a string.
	 * 		{Function} A superclass to inherit from typed as a function.
	 * 		{Object} The object used to declare class properties and methods.
	 * 		{null} A strict null will remove the associated classpath.
	 * 
	 * @param {Object} third
	 * 		(optional) The object used to declare class properties and methods
	 * 		when declaring a class which extends another one.
	 *
	 * @return {Function}
	 * 		The constructor method of the class corresponding to the given
	 * 		classpath.
	 */
	Objs = function( classpath, second, third )
	{
		var 
			func/*Function*/,
			path/*String*/,
			superclass/*Function*/,
			secondType/*String*/,
			protobject/*Object*/,
			propName/*String*/,
			i/*Number*/,
			temp/*Object*/
		;



		// --------------------------------------------------------------------
		// Retrieve
		//
		
		if( typeof classpath != Tstring ) 
			throw Error( $InvalidClasspath + classpath );
		
		/**
		 * Each classpath is prefixed before to be added to the map to avoid
		 * name collisions with any existing Map Object methods.
		 */
		path = $prefix + classpath;

		/*
		 * If <code>classpath</code> was the only parameter passed to Objs, the
		 * developer only wants to get the class constructor corresponding to
		 * the given classpath.
		 */
		if( second == null )
		{
			/*
			 * The developer want to remove a class from the Objs class map.
			 */
			if( second === null )
			{
                func = map[path];
                delete map[path];
				return func;
			}
			
			if( func = map[path] )
				return func;

			/*
			 * If the developer try to obtain an unregistered class
			 * it is really important for him to be informed of the error.
			 */
			throw Error( $NonExistentClass + classpath );
		}



		// --------------------------------------------------------------------
		// Superclass definition
		//

		/*
		 * The 2nd argument is a string representation for a superclass
		 * classpath.
		 */
		if( (secondType = typeof second) == Tstring )
		{
			superclass = map[$prefix + second];
			i = 1;
		}

		/*
		 * 2nd argument is a superclass constructor.
		 */
		else if( secondType == "function" )
		{
			superclass = second;
			i = 1;
		}

		/*
		 * 2nd argument is a protobject.
		 */
		else
		{
			protobject = second;
		}
		
		/*
		 * There must be a superclass to inherit from.
		 */
		if( i )
		{
			/*
			 * The developer try to inherit from an unregistered superclass
			 * it is important for him to be informed of the error.
			 */
			if( !superclass )
				throw Error( $NonExistentSuperClass + second );
            /*
             * The developer try to inherit from a registered superclass
             * but with an undefined protobject.
             */
			if( !(protobject = third) )
				throw Error( $InvalidProtobject + classpath );
		}
			


		// --------------------------------------------------------------------
		// Create
		//
		
		func = map[path] = function()
		{
			/*
			 * The constructor is not called during the extend phase:
			 * myClass.prototype = new MySuperClass().
			 */
			if( !func[$extending] )
			{
				//A superclass is registered.
				if( func.$superclass )
				{
					func.$superclass[$constructing] = 1;
					func.$superclass.call( this );
					delete func.$superclass[$constructing];
				}

				/*
				 * The initialize method must only be called automatically on the
				 * first called constructor in the inheritance chain.
				 */
				if
				(
					!func[$constructing]
					&&
					func.prototype.initialize
				)
					func.prototype.initialize.apply( this, arguments );
			}
		};

		/*
		 * Each class in Objs has a "$classpath" property to identify its
		 * classpath.
		 */
		func.$classpath = classpath;



		// --------------------------------------------------------------------
		// Protobject
		//

		//There is superclass to extend from.
		if( superclass )
		{
			superclass[$extending] = 1;
			func.prototype = new superclass();
			delete superclass[$extending];
						
			/*
			 * Each subclass in Objs have a "$super" shortcut to its superclass
			 * prototype and a "$superclass" shortcut to its superclass
			 * constructor when an Objs superclass is defined for it.
			 */
			func.$superclass = superclass;
			func.$super = superclass.prototype;
		}

		/*
		 * Protobject properties and methods are copied into the prototype of
		 * the returned constructor.
		 */
		temp = func.prototype;
		for( propName in protobject )
			if( protobject.hasOwnProperty(propName) )
				temp[propName] = protobject[propName];

		//Some Object methods are not enumerable on Internet Explorer
		temp.toString = protobject.toString;
		temp.valueOf = protobject.valueOf;
		temp.toLocaleString = protobject.toLocaleString;

		return func;
	};

	//----------------------------------------------------------------------
	// Private properties
	//
	
	var
		/**
		 * Strings dictionary used to reduce generated file size.
		 *
		 * @type {String}
		 * @private
		 */
		Tstring = "string",
		$prefix = "$Objs$",
		$constructing = $prefix + "c",
		$extending = $prefix + "e",
		$NonExistent = "non-existent",
		$Invalid = "invalid",
		$InvalidClasspath = $Invalid + " classpath: ",
		$NonExistentClass = $NonExistent + " class: ",
		$NonExistentSuperClass = $NonExistent + " superclass: ",

		/**
		 * @type {String}
		 * @private
		 */
		$InvalidProtobject = $Invalid + " protobject for: ",

		/**
		 * A map of <code>ClassInfo</code> objects used to manage classes
		 * registrations.
		 *
		 * @type {Object}
		 * @private
		 */
		 map = {}
	;
};
