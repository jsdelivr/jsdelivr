/*
	kld-camlhelper
	Pau Codina for Kaldeera
	Copyright (c) 2014 Pau Codina (pau.codina@kaldeera.com)
	Licensed under the MIT License


	Inspired in SharePoint CAML Query Helper (http://spcamlqueryhelper.codeplex.com/) allows to convert
	OData Sentences (www.odata.org) into CAMLQuery expressions.

	Example:

		var odata = ODataParserProvider.ODataParser(listSchema);
		odata.parseExpression({
			filter: 'Country eq USA and Modified eq [Today]',
			orderBy: 'Title asc, Modified desc',
			select: 'Title, Country',
			top: 10
		});
		camlQueryXml = odata.getCAMLQuery();

	This module is used when accessing SharePoint lists through JSOM. When you use REST API this conversion 
	is not necessary and you can use directly OData queries.
*/



angular.module('kld.CamlHelper', [])

.value('CamlOperatorEnumerator', {
	CamlQueryOperator: {
		BeginsWith: "BeginsWith",
		Contains: "Contains",
		DateRangesOverlap: "DateRangesOverlap",
		Eq: "Eq",
		Geq: "Geq",
		Gt: "Gt",
		In: "In", //-> SharePoint 2010
		Includes: "Includes", //-> SharePoint 2010
		IsNotNull: "IsNotNull",
		IsNull: "IsNull",
		Leq: "Leq",
		Lt: "Lt",
		Neq: "Neq",
		NotIncludes: "NotIncludes" //-> SharePoint 2010
	}
})

.provider('CamlQueryHelperProvider', function () {
		'use strict';	
		var CamlQueryHelperProvider = function (CamlOperatorEnumerator) {
		this.CamlQueryHelper = function () {
			return {
				// Properties
				Query: "",
				OrderByFields: "",
				GroupByFiels: "",

				// Methods
				Wrap: function (joinOperator, value) {
					return "<" + joinOperator + ">" + value + "</" + joinOperator + ">";
				},

				Join: function (joinOperator, fieldRef, type, value, lookupId) {
					var fieldRefTag;

					if (lookupId) {
						fieldRefTag = "<FieldRef Name='" + fieldRef + "' LookupId='True' />";
					} else {
						fieldRefTag = "<FieldRef Name='" + fieldRef + "' />";
					}

					var operatorTagName = joinOperator;
					var subQuery = "";

					switch (joinOperator) {
						case CamlOperatorEnumerator.CamlQueryOperator.In:
							// Eliminamos las llaves de array
							value = value.replace("[", "");
							value = value.replace("]", "");

							// Generamos el array de valores
							var valuesArray = value.split(",");

							var inValuesTag = "<Values>";

							valuesArray.forEach(function (each) {
								var eachValue = each.trim();
								var eachValueTag = "";

								// Si al transformar el valor a numero no es NaN, es un numero
								if (!isNaN(parseInt(eachValue))) {
									eachValueTag = "<Value Type='Integer'>" + eachValue + "</Value>";
								} else {
									eachValueTag = "<Value Type='Text'>" + eachValue + "</Value>";
								}

								inValuesTag = inValuesTag + eachValueTag;
							});

							inValuesTag += "</Values>";

							subQuery = fieldRefTag + inValuesTag;

							break;

						case CamlOperatorEnumerator.CamlQueryOperator.IsNull:
						case CamlOperatorEnumerator.CamlQueryOperator.IsNotNull:
							subQuery = fieldRefTag;
							break;

						default:
							var valueTag = "<Value Type='" + type + "'>" + value + "</Value>";
							subQuery = fieldRefTag + valueTag;
							break;
					}

					return this.Wrap(operatorTagName, subQuery);
				},

				OrJoin: function (joinOperator, fieldRef, type, value, lookupId) {
					var subQuery = this.Join(joinOperator, fieldRef, type, value, lookupId);

					if (!this.Query) {
						this.Query += subQuery;
					} else {
						this.Query += subQuery;
						this.Query = this.Wrap("Or", this.Query);
					}
				},

				AndJoin: function (joinOperator, fieldRef, type, value, lookupId) {
					var subQuery = this.Join(joinOperator, fieldRef, type, value, lookupId);

					if (!this.Query) {
						this.Query += subQuery;
					} else {
						this.Query += subQuery;
						this.Query = this.Wrap("And", this.Query);
					}
				},

				AddOrderByField: function (fieldRefName, ascending) {
					this.OrderByFields += "<FieldRef Name='" + fieldRefName + "' Ascending='" + ascending + "' />";
				},

				AddGroupByField: function (fieldRefName) {
					this.GroupByFiels += "<FieldRef Name='" + fieldRefName + "' />";
				},

				ToString: function () {
					var Where = "";
					var OrderBy = "";
					var GroupBy = "";
					
					if (this.Query) {
						Where = this.Wrap("Where", this.Query);
					}
					
					if (this.OrderByFields) {
						OrderBy = this.Wrap("OrderBy", this.OrderByFields);
					}

					if (this.GroupByFiels) {
						GroupBy = this.Wrap("GroupBy", this.GroupByFiels);
						// GroupBy = '<GroupBy Collapse="TRUE" GroupLimit="999">' + this.GroupByFiels + "</GroupBy>";
					}
					
					return "<Query>" + Where + GroupBy + OrderBy + "</Query>";
				}
			};
		};
	};

	this.$get = function (CamlOperatorEnumerator) {
		return new CamlQueryHelperProvider(CamlOperatorEnumerator);
	};
})

.provider('ODataSentencePartProvider', function () {
	var ODataSentencePartProvider = function (CamlOperatorEnumerator) {
		this.ODataSentencePart = function (expression, join, fields) {
			/*if (fields == undefined) {
				throw 'fields not specified';
				return;
			}

			if (expression == undefined || expression == "") {
				throw 'expression not specified';
				return;
			}

			if (join == undefined || join == "") {
				throw 'join not specified';
				return;
			}*/

			return {
				// Properties
				Expression: expression,
				Join: join,
				Fields: fields,
				
				ProcessOk: false,
				Operator: "",
				Left: "",
				Right: "",
				Field: "",
				Value: "",

				process: function () {
					if (this.testOperator(" eq ")) { this.processOperator(" eq ", CamlOperatorEnumerator.CamlQueryOperator.Eq); }
					if (this.testOperator(" ne ")) { this.processOperator(" ne ", CamlOperatorEnumerator.CamlQueryOperator.Neq); }
					if (this.testOperator(" gt ")) { this.processOperator(" gt ", CamlOperatorEnumerator.CamlQueryOperator.Gt); }
					if (this.testOperator(" ge ")) { this.processOperator(" ge ", CamlOperatorEnumerator.CamlQueryOperator.Geq); }
					if (this.testOperator(" lt ")) { this.processOperator(" lt ", CamlOperatorEnumerator.CamlQueryOperator.Lt); }
					if (this.testOperator(" le ")) { this.processOperator(" le ", CamlOperatorEnumerator.CamlQueryOperator.Leq); }
					if (this.testOperator(" lt ")) { this.processOperator(" lt ", CamlOperatorEnumerator.CamlQueryOperator.Lt); }
					if (this.testOperator(" in ")) { this.processOperator(" in ", CamlOperatorEnumerator.CamlQueryOperator.In); }
					if (this.testOperator(" contains ")) { this.processOperator(" contains ", CamlOperatorEnumerator.CamlQueryOperator.Contains); }
					if (this.testOperator(" beginswith ")) { this.processOperator(" beginswith ", CamlOperatorEnumerator.CamlQueryOperator.Contains); }
					if (this.testOperator(" isnull")) { this.processOperator(" isnull", CamlOperatorEnumerator.CamlQueryOperator.IsNull); }
					if (this.testOperator(" isnotnull")) { this.processOperator(" isnotnull", CamlOperatorEnumerator.CamlQueryOperator.IsNotNull); }

					if (!this.ProcessOk) {
						throw "Invalid sentence: " + this.Expression;
					}

					if (!this.isValidFieldInternalName(this.Fields, this.Left, this.Right)) {
						if (!this.isValidFieldInternalName(this.Fields, this.Right, this.Left)) {
							throw "Invalid sentence, any valid field vas specified (" + this.Expression + ")";
						}
					}
				},

				isValidFieldInternalName: function (fields, name, value) {
					try {
						this.Field = this.Fields.Fields[name];
						this.Value = value;
						return true;
					} catch (error) {
						return false;
					}
				},

				processOperator: function (operator, camlOperator) {
					this.Operator = camlOperator;
					var position = this.Expression.indexOf(operator);

					this.Left = this.Expression.substring(0, position);
					this.Right = this.Expression.substring(position + operator.length);

					this.ProcessOk = true;
				},

				testOperator: function (operator) {
					if (this.Expression.toLowerCase().indexOf(operator) == -1) {
						return false;
					} else {
						return true;
					}
				}
			};
		};
	};

	this.$get = function (CamlOperatorEnumerator) {
		return new ODataSentencePartProvider(CamlOperatorEnumerator);
	};
})

.provider('ODataParserProvider', function () {
	var ODataParserProvider = function (CamlQueryHelperProvider, ODataSentencePartProvider, CamlOperatorEnumerator) {
		this.ODataParser = function (fieldsSchema) {
			if (fieldsSchema === undefined) {
				throw 'fieldsSchema not specified';
			}

			return {
				Filter: "",
				Sort: "",
				Select: "",
				Top: "",
				Paging: false,
				Skip: "",
				Sentences: [],
				FieldsSchema: fieldsSchema,

				parseExpression: function (queryInfo) {
					this.Filter = "";
					this.Sort = "";
					this.Select = "";
					this.Top = "";
					this.Skip = "";
					this.GroupBy = "";
					this.Paging = false;

					if (queryInfo.filter !== undefined) { this.Filter = queryInfo.filter; }
					if (queryInfo.orderBy !== undefined) { this.Sort = queryInfo.orderBy; }
					if (queryInfo.select !== undefined) { this.Select = queryInfo.select; }
					if (queryInfo.groupBy !== undefined) { this.GroupBy = queryInfo.groupBy; }
					if (queryInfo.top !== undefined) { this.Top = queryInfo.top; }
					if (queryInfo.paging !== undefined) { this.Paging = queryInfo.paging; }
					if (queryInfo.skip !== undefined) { this.Skip = queryInfo.skip; }

					var ex = this.Filter;
					while (ex.length > 0) {
						var resultObject = this.getNextSentence(ex);
						var sentence = resultObject.dataSentencePart;
						sentence.process();
						ex = resultObject.expression;

						this.Sentences.push(sentence);
					}
				},

				getCAMLQuery: function () {
					var finalCamlQueryString = "";
					var camlHelper = CamlQueryHelperProvider.CamlQueryHelper();
					this.Sentences.reverse();

					for (var i = 0; i < this.Sentences.length; i++) {
						var lookupId = false;
						var sentence = this.Sentences[i];

						if (sentence.Field.get_typeAsString() == "Lookup" || sentence.Field.get_typeAsString() == "User" || sentence.Field.get_typeAsString() == "LookupMulti" || sentence.Field.get_typeAsString() == "UserMulti") {
							// Se quitan las llaves, si las hay
							var sentenceValue = sentence.Value;
							sentenceValue = sentenceValue.replace("[", "");
							sentenceValue = sentenceValue.replace("]", "");

							// Se intenta hacer un split por ',' y se coge el primer elemento, que sera el que nos guiara si es lookup o no
							var tempArray = sentenceValue.split(",");

							if (!isNaN(parseInt(tempArray[0]))) {
								lookupId = true;
							} else {
								lookupId = false;
							}
						}

						switch (sentence.Join) {
							case "or":
								camlHelper.OrJoin(sentence.Operator, sentence.Field.get_internalName(), sentence.Field.get_typeAsString(), sentence.Value, lookupId);
								break;

							default:
								camlHelper.AndJoin(sentence.Operator, sentence.Field.get_internalName(), sentence.Field.get_typeAsString(), sentence.Value, lookupId);
								break;
						}
					}

					if (this.Sort.length > 0) {
						var sortSentences = this.Sort.split(",");
						for (var r = 0; r < sortSentences.length; r++) {
							if (sortSentences[r] !== "") {
								var sortSentence = sortSentences[r];
								var parts = sortSentence.trim().split(" ");

								try {
									var field = this.FieldsSchema.Fields[parts[0]];
									var ascending = true;

									if (parts.length > 1 && parts[1].trim().toLowerCase() == "desc") {
										ascending = false;
									}

									camlHelper.AddOrderByField(field.get_internalName(), ascending);
								} catch (error) {
									throw error;
								}
							}
						}
					}

					if (this.GroupBy !== undefined && this.GroupBy !== "") {
						var groupFieldsList = this.GroupBy.split(',');

						for (var g = 0; g < groupFieldsList.length; g++) {
							var eachField = groupFieldsList[g].trim();

							if (eachField.length > 0) {
								camlHelper.AddGroupByField(eachField);
							}
						}
					}


					finalCamlQueryString = camlHelper.ToString();

					var rowLimitQuery = "";

					// Generamos el string con el parametro Top
					if (this.Top !== undefined && this.Top !== "") {
						rowLimitQuery += "<RowLimit Paged='TRUE'>" + this.Top + "</RowLimit>";
					}

					var viewFieldsQuery = "";

					// Generamos el string de los campos que se seleccionaran
					if (this.Select.length > 0) {
						viewFieldsQuery = "<ViewFields>";

						var selectFieldsList = this.Select.split(',');

						for (var iterator = 0; iterator < selectFieldsList.length; iterator++) {
							var selectedField = selectFieldsList[iterator].trim();

							if (selectedField.length > 0) {
								viewFieldsQuery += "<FieldRef Name='" + selectedField + "' />";
							}
						}

						viewFieldsQuery += "</ViewFields>";
					}

					// console.log("<View>" + viewFieldsQuery + finalCamlQueryString + rowLimitQuery + "</View>");

					return "<View>" + viewFieldsQuery + finalCamlQueryString + rowLimitQuery + "</View>";
				},

				getNextSentence: function (expression) {
					var position = -1;
					var operator = " and ";

					position = expression.toLowerCase().indexOf(operator);
					if (position == -1) {
						operator = " or ";
						position = expression.toLowerCase().indexOf(operator);
					}

					if (position == -1) {
						position = expression.length;
						operator = "";
					}

					var sentence = expression.substring(0, position);
					expression = expression.substring(position + operator.length);

					var dataSentence = ODataSentencePartProvider.ODataSentencePart(sentence, operator.trim(), this.FieldsSchema);

					var resultObject = {
						expression: expression,
						dataSentencePart: dataSentence
					};

					return resultObject;
				}
			};
		};
	};

	this.$get = function (CamlQueryHelperProvider, ODataSentencePartProvider, CamlOperatorEnumerator) {
		return new ODataParserProvider(CamlQueryHelperProvider, ODataSentencePartProvider, CamlOperatorEnumerator);
	};
});

/*
	kld-scroll
	Pau Codina for Kaldeera
	Copyright (c) 2014 Pau Codina (pau.codina@kaldeera.com)
	Licensed under the MIT License

	Scroll of a SPList
*/


angular.module('kld.ngSharePoint')
.directive('kldScroll', ['SPUtils', '$compile', '$templateCache', '$http', function (SPUtils, $compile, $templateCache, $http) {

	'use strict';

	return {
		restrict: 'EA',
		replace: true,
		templateUrl: 'templates/scroll.html',
		scope: {
			pageSize: '@',
			list: '=',
			query: '=',
			results: '=',
			autoScroll: '=',
			forwardOnly: '='
		},
		compile: function(element, attrs) {

			return {
				pre: function preLink($scope, $element, $attrs) {
					if (attrs.templateUrl) {
						$http.get(attrs.templateUrl, { cache:  $templateCache }).success(function (html) {
							var newElement = $compile(html)($scope);
							$element.replaceWith(newElement);
						});

					}
				},
				post: function postLink($scope, $element, $attrs) {
					if ($scope.autoScroll) {
						// Detects end of scroll and launch the next page load request
						$(window).scroll(function() {
							if($(window).scrollTop() + $(window).height() >= $(document).height() - 150) {
								if (!$scope.lastPage && !$scope.onLoading) {
									$scope.loadNextPage();
								}
							}
						});
					}

					$scope.lastPage = false;
					$scope.firstPage = true;
					$scope.onLoading = false;
					$scope.noResults = false;
					$scope.currentPage = 0;

					SPUtils.SharePointReady().then(function () {
						$scope.list.initContext().then(function () {

							$scope.$watch(function () {
								return $scope.query.filter;
							}, function (newValue) {					
								$scope.onLoading = true;
								$scope.noResults = false;
								$scope.query.top = $attrs.pageSize;
								$scope.pageInfo = undefined;
								$scope.results = [];
								$scope.lastPage = false;
								$scope.firstPage = true;
								$scope.currentPage = 0;
								$scope.loadNextPage();
							}, true);

						});
					});

					$scope.loadNextPage = function () {
						$scope.onLoading = true;
						$scope.query.pagingInfo = ($scope.pageInfo ? $scope.pageInfo.get_pagingInfo() : '');
						$scope.list.getListItems($scope.query).then(function (results) {
							if ($scope.forwardOnly) {
								// If forwardOnly accumulates the result set
								angular.forEach(results, function (res) {
									$scope.results.push(res);
								});

								if ($scope.results.length === 0) {
									$scope.noResults = true;
								} else {
									$scope.noResults = false;
								}
							} else {
								// If not fordwarOnly replace the result set
								$scope.results = results;
							}
							$scope.currentPage++;
							$scope.pageInfo = $scope.list.Items.get_listItemCollectionPosition();
							if ($scope.pageInfo === null) $scope.lastPage = true;
							$scope.firstPage = ($scope.currentPage == 1);
							$scope.onLoading = false;
						});
					};

					$scope.loadPreviousPage = function () {
						$scope.onLoading = true;
						$scope.query.pagingInfo = 'Paged=TRUE&PagedPrev=TRUE&p_ID=' + $scope.list.Items.get_item(0).get_id();
						$scope.list.getListItems($scope.query).then(function (results) {
							$scope.results = results;
							$scope.pageInfo = $scope.list.Items.get_listItemCollectionPosition();
							$scope.lastPage = false;
							$scope.currentPage--;
							$scope.firstPage = ($scope.currentPage == 1);
							$scope.onLoading = false;
						});
					};
				}
			};
		}
	};
}]);

/*
	kld-splist
	Pau Codina for Kaldeera
	Copyright (c) 2014 Pau Codina (pau.codina@kaldeera.com)
	Licensed under the MIT License


	kld-Splist make a query to a specified list and place the result set into a new
	scope array (ListItems).

	Example:

	<div kld-Splist="Announcements">
		<ul ng-repeat="item in ListItems">
			<li>{{item.title}}</li>
		</ul>
	</div>

	Other params:

	template-url: you can specify a new template to be loaded and replace the contents of the directive when records are loaded

		<div kld-Splist="Tasks" template-url="templates/mytasks.html">
			<img src="loading.gif" title="Loading" />
		</div>

	query: you can pass a string with a valid CAML query or a object with specific query parameters (OData format)
			supported values:
				filter: a valid odata filter sentence
				orderBy: list of field names on which the results are sorted
				select: list of field names to be retrieved
				top: 10

 			More info at http://docs.oasis-open.org/odata/odata/v4.0/os/part1-protocol/odata-v4.0-os-part1-protocol.html#_Toc372793681

			example:
			{
				filter: 'Country eq USA and Modified eq [Today]',
				orderBy: 'Title asc, Modified desc',
				select: 'Title, Country',
				top: 10
			}

			NOTE: not all OData sentences and functions are implemented
*/


angular.module('kld.ngSharePoint')
.directive('kldSplist', ['SPUtils', 'SharePoint', '$compile', '$templateCache', '$http', function (SPUtils, SharePoint, $compile, $templateCache, $http) {
	return {
		restrict: 'A',
		replace: true,
		transclude: true,
		scope: {
			list: '@kldSplist',
			web: '@spweb',
			query: '@'
		},
		compile: function (element, attrs, transclude) {
			return function ($scope, $element, $attrs) {
				if (SPUtils.inDesignMode()) return ;

				transclude($scope, function (clone) {
					angular.forEach(clone, function (e) {
						$element.append(e);
					});
				});

				$scope.ListItems = [];

				$scope.SPList = SharePoint.SPList($attrs.kldSplist, $attrs.spweb);
				if (typeof $scope.query == 'string') {
					$scope.query = $scope.$eval($scope.query);
				}

				function retrieveData() {
					$scope.SPList.getListItems($scope.query).then(function(data) {
						$scope.ListItems = data;

						if ($attrs.templateUrl && !$scope.templateLoaded) {
							$http.get($attrs.templateUrl, { cache:  $templateCache }).success(function (html) {
								var newElement = $compile(html)($scope);
								$element.html('').append(newElement);
								$scope.templateLoaded = true;
							});
						}
					}, function (error) {
						console.error(angular.toJson(error));
					});
				}

				$scope.$watch('query', function(newValue) {
					retrieveData();
				}, true);
			};
		}
	};
}]);

/*
    kld-listitemurl
    Pau Codina for Kaldeera
    Copyright (c) 2014 Pau Codina (pau.codina@kaldeera.com)
    Licensed under the MIT License


    This filter formats a valid SharePoint URL for a specific splist item form.
    Params:
        SiteId
        WebId
        ListId
        FormName (dispform | editform)

    Example:
        <a href="{{item.ID | ListItemUrl:SiteId:item.WebId:item.ListId:'dispform'}}">Test</a>

*/


angular.module('kld.ngSharePoint')
.filter('ListItemUrl', ['$location', function($location) {

    'use strict';

    return function(ListItemId, SiteId, WebId, ListId, FormName) {

    	var url = '_layouts/copyutil.aspx?Use=id&Action=' + (FormName || 'dispform');
    	url += '&ItemId=' + ListItemId;
    	url += '&ListId=' + ListId;
    	url += '&WebId=' + WebId;
    	url += '&SiteId=' + SiteId;
    	url += '&Source=' + $location.absUrl();

    	return url;
    };
}]);

/*
    kld-userformat
    Pau Codina for Kaldeera
    Copyright (c) 2014 Pau Codina (pau.codina@kaldeera.com)
    Licensed under the MIT License


    Format the reference of a user (nnn;#user) in a link to their profile page
*/


angular.module('kld.ngSharePoint')
.filter('userFormat', ['kldConstants', '$location', function(kldConstants, $location) {

    'use strict';

    return function(user) {
        
        if (user === undefined) return "";

        var usuario;
        if (typeof user == 'string') {
        	var userId = user.substring(0, user.indexOf(';#'));
        	var userName = user.substring(user.indexOf(';#') + 2);
        	var profileUrl = kldConstants.userProfileUrl + userId + '&source=' + $location.absUrl();

	        return '<a href="' + profileUrl + '">' + userName + '</a>';
        }

        return "";
    };

}]);

/*
	kld-ngsharepoint
	Pau Codina for Kaldeera
	Copyright (c) 2014 Pau Codina (pau.codina@kaldeera.com)
	Licensed under the MIT License
*/

angular.module('kld.ngSharePoint', ['kld.CamlHelper']);

/*
---------------------------------------------------------------------------------------
	Module constants
---------------------------------------------------------------------------------------
*/
angular.module('kld.SharePoint').value('kldConstants', {
	errorTemplate: 'templates/error.html',
	userProfileUrl: '_layouts/userdisp.aspx?ID='
});

/*
	kld-sharepoint
	Pau Codina for Kaldeera
	Copyright (c) 2014 Pau Codina (pau.codina@kaldeera.com)
	Licensed under the MIT License


	Main SharePoint provider.
		SPList
		SPUser
		SPGroup (comming soon)
*/


angular.module('kld.ngSharePoint')
.provider('SharePoint', function() {

	'use strict';

	var SharePoint = function($cacheFactory, SPUtils, $q) {

		/*
		---------------------------------------------------------------------------------------
			SPList ofers functionality to interact with SharePoint lists.
			Methods:
				* getListItems(query)
				* getItemById(itemId)
				* insertItem(values)
				* updateItem(values)
				* deleteItem(itemId)
		---------------------------------------------------------------------------------------
		*/
		this.SPList = function(listName, webId, webUrl) {

			if (listName === undefined) {
				throw 'listName not specified';
			}

			return {
				// properties
				webUrl: webUrl,
				ListName: listName,
				webId: webId,

				// inernal methods
				initContext: function() {
					var def = $q.defer();

					// Si ya esta inicializado ... no hacemos nada
					if (this.Context && this.List && this.Schema) {
						def.resolve(this.Schema);
						return def.promise;
					}

					// obtenemos el contexto
					if (!this.webUrl) {
						this.Context = new SP.ClientContext.get_current();
					} else {
						this.Context = new SP.ClientContext(this.webUrl);
					}

					var web = "";

					if (this.webId !== undefined) {
						web = this.Context.get_web(this.webId);
					} else {
						web = this.Context.get_web();
					}

					// Obtenemos la lista; ListName puede ser un string o un guid
					this.ListName = this.ListName.trim();
					// Se eliminan los claudators
					this.ListName = this.ListName.replace("{", "");
					this.ListName = this.ListName.replace("}", "");

					// Guid Expression
					var guidRegExp = new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");

					if (guidRegExp.test(this.ListName)) {
						this.List = web.get_lists().getById(this.ListName);
					} else {
						if (this.ListName == 'userinfolist') {
							this.List = web.get_siteUserInfoList();
						} else {
							this.List = web.get_lists().getByTitle(this.ListName);
						}
					}

					var cache = $cacheFactory.get('SPListCache');
					if (cache === undefined) {
						cache = $cacheFactory('SPListCache');
					}

					this.Schema = cache.get(web + '.' + listName);
					if (this.Schema === undefined) {
						this.ListFields = this.List.get_fields();
						this.Context.load(this.ListFields);

						var self = this;

						self.Context.executeQueryAsync(Function.createDelegate(self, function() {

							var fieldEnumerator = self.ListFields.getEnumerator();
							self.Schema = {
								Fields: {}
							};

					        while (fieldEnumerator.moveNext()) {
					            var f = fieldEnumerator.get_current();
					            self.Schema.Fields[f.get_internalName()] = f;
					        }

					        cache.put(web + '.' + listName, self.Schema);
							def.resolve(self.Schema);

						}), Function.createDelegate(self, function() {
							console.error('Error al recuperar el schema!!');
							def.reject();
						}));
					} else {
						def.resolve(this.Schema);
					}

					return def.promise;

				},

				onError: function(sender, args) {
					var self = this;
					var err = {
						Code: args.get_errorCode(),
						Details: args.get_errorDetails(),
						TypeName: args.get_errorTypeName(),
						Value: args.get_errorValue(),
						message: args.get_message(),
						request: args.get_request(),
						stackTrace: args.get_stackTrace()
					};

					console.error('SPList request failed: ' + err.message + '\n' + err.stackTrace);
					self.deferred.reject(err);
				},

				// public methods
				getListItems: function(queryInfo) {
					this.deferred = $q.defer();
					var self = this;
					var queryInformation = queryInfo;

					SPUtils.SharePointReady().then(function () {
						self.initContext().then(function(data) {
							// Generamos la CamlQuery
							var camlQuery = SPUtils.generateCamlQuery(queryInformation, self.Schema);
							self.Items = self.List.getItems(camlQuery);

							var includeSentence;
							if (queryInfo) {
								if (queryInfo.select) {
									includeSentence = 'Include(' + queryInfo.select + ')';
								}
							}

							if (includeSentence !== undefined) {
								self.Context.load(self.Items, includeSentence);
							} else {
								self.Context.load(self.Items);
							}

							self.Context.executeQueryAsync(Function.createDelegate(self, function() {
								var items = [];
								var enumItems = this.Items.getEnumerator();

								while(enumItems.moveNext()) {
									var spitem = enumItems.get_current();
									items.push(spitem.get_fieldValues());
								}

								self.deferred.resolve(items);

							}), Function.createDelegate(self, self.onError));
						});
					});

					return this.deferred.promise;
				},

				getItemById: function(itemId) {

					this.deferred = $q.defer();
					var self = this;

					SPUtils.SharePointReady().then(function () {

						self.initContext().then(function() {
					    	self.Item = self.List.getItemById(itemId);
					    	self.Context.load(self.Item);

					    	self.Context.executeQueryAsync(Function.createDelegate(self, function() {
								var values = self.Item.get_fieldValues();
								self.deferred.resolve(values);

					    	}), Function.createDelegate(self, self.onError));
						});
					});

					return this.deferred.promise;
				},

				insertItem: function(values) {

					this.deferred = $q.defer();
					var self = this;

					SPUtils.SharePointReady().then(function() {
						self.initContext();

						var creationInformation = new SP.ListItemCreationInformation();
						var newItem = self.List.addItem(creationInformation);

						angular.forEach(values, function(value, key) {
							newItem.set_item(key, value);
						});
						newItem.update();
						self.Context.load(newItem);

						self.Context.executeQueryAsync(Function.createDelegate(self, function() {

							self.deferred.resolve(newItem.get_fieldValues());

						}), Function.createDelegate(self, self.onError));
					});

					return this.deferred.promise;
				},

				updateItem: function(itemId, values) {
					this.deferred = $q.defer();
					var self = this;

					SPUtils.SharePointReady().then(function() {
						self.initContext();

				    	self.Item = self.List.getItemById(itemId);

						angular.forEach(values, function(value, key) {
							var field = self.Schema.Fields[key];

							if (!field.get_readOnlyField() && field.get_typeAsString() != 'Attachments') {
								self.Item.set_item(key, value);
							}
						});
						self.Item.update();

						self.Context.executeQueryAsync(Function.createDelegate(self, function() {

							// NOTA PAU: el item se queda sin el valor ID (seguramente pq no lo envia al servidor)
							// se lo inyectamos
							var retValues = self.Item.get_fieldValues();
							retValues.ID = itemId;
							self.deferred.resolve(retValues);

						}), Function.createDelegate(self, self.onError));

					});

					return this.deferred.promise;
				},

				deleteItem: function(toDelete) {
					this.deferred = $q.defer();
					var self = this;

					SPUtils.SharePointReady().then(function() {
						self.initContext();

						var itemId = toDelete;
						if (typeof toDelete === 'object') {
							itemId = toDelete.ID;
						}

						var itemToDelete = self.List.getItemById(itemId);
						itemToDelete.deleteObject();

						self.Context.executeQueryAsync(Function.createDelegate(self, function() {

							self.deferred.resolve();

						}), Function.createDelegate(self, self.onError));

					});

					return this.deferred.promise;
				}
			};
		};

		/*
		---------------------------------------------------------------------------------------
			SPUser
			Methods:
				* getCurrent()
				* getUserByLoginName(userLoginName)
				* ensureUser(loginName)
		---------------------------------------------------------------------------------------
		*/
		this.SPUser = function() {
			return {
				getCurrent: function() {

					var self = this;
					self.def = $q.defer();

					if (self.currentUser) {
						console.log('Ya existe currentUser');
					}

					SPUtils.SharePointReady().then(function() {
						self.context = new SP.ClientContext.get_current();

						/* Esta opcion retorna un objeto de tipo Usuario, pero no
						   retorna ninguna de las propiedades del usuario.
						   En lugar del web.getCurrentUser optamos por hacer una
						   query sobre la lista de usuarios con el id del usuario
						   conectado actualmente (variable _spPageContextInfo.userId)
						 */
						//self.currentUser = self.context.get_web().get_currentUser();
						//self.context.load(self.currentUser);

						self.usersInfoList = self.context.get_web().get_siteUserInfoList();
					    	self.currentUser = self.usersInfoList.getItemById(_spPageContextInfo.userId);
					    	self.context.load(self.currentUser);

						self.context.executeQueryAsync(Function.createDelegate(self, function() {

							self.def.resolve(self.currentUser.get_fieldValues());

						}), Function.createDelegate(self, function (sender, args) {
							console.error('Error retrieving currentUser!!');
							console.error(args.get_message());

							if (self.currentUser.get_fieldValues().Id === undefined) {
								self.def.reject({
									Code: args.get_errorCode(),
									Details: args.get_errorDetails(),
									TypeName: args.get_errorTypeName,
									Value: args.get_errorValue(),
									message: args.get_message(),
									request: args.get_request(),
									stackTrace: args.get_stackTrace()
								});
							} else {
								self.def.resolve(self.currentUser.get_fieldValues());								
							}
						}));
					});

					return self.def.promise;
				},

				getUserByLoginName: function (userLoginName) {
					var self = this;
					self.def = $q.defer();

					SPUtils.SharePointReady().then(function () {
						self.context = new SP.ClientContext.get_current();

						self.user = self.context.get_web().ensureUser(userLoginName);
						self.context.load(self.user);

						self.context.executeQueryAsync(Function.createDelegate(self, function () {
							self.def.resolve(self.user);
						}), Function.createDelegate(self, function (args) {
							console.error("Error at getUserByLoginName");
							self.def.reject({
								Code: args.get_errorCode(),
								Details: args.get_errorDetails(),
								TypeName: args.get_errorTypeName,
								Value: args.get_errorValue(),
								message: args.get_message(),
								request: args.get_request(),
								stackTrace: args.get_stackTrace()
							});
						}));
					});

					return self.def.promise;
				},

				ensureUser: function(loginName) {
					var self = this;
					self.def = $q.defer();

					SPUtils.SharePointReady().then(function() {
						self.context = new SP.ClientContext.get_current();
						self.web = self.context.get_web();

						self.currentUser = self.web.ensureUser(loginName);
				    		self.context.load(self.currentUser);

						self.context.executeQueryAsync(Function.createDelegate(self, function() {

							self.def.resolve(self.currentUser);

						}), Function.createDelegate(self, function(args) {
							console.error('Error on ensureUser!!');
							self.def.reject({
								Code: args.get_errorCode(),
								Details: args.get_errorDetails(),
								TypeName: args.get_errorTypeName,
								Value: args.get_errorValue(),
								message: args.get_message(),
								request: args.get_request(),
								stackTrace: args.get_stackTrace()
							});
						}));
					});

					return self.def.promise;
				}
			};
		};
	};
	
	this.$get = function($cacheFactory, SPUtils, $q) {
		return new SharePoint($cacheFactory, SPUtils, $q);
	};
});

/*
	kld-sputils
	Pau Codina for Kaldeera
	Copyright (c) 2014 Pau Codina (pau.codina@kaldeera.com)
	Licensed under the MIT License

	SharePoint utility functions
*/

angular.module('kld.ngSharePoint').factory('SPUtils', ['$q', 'ODataParserProvider', function ($q, ODataParserProvider) {

	'use strict';

	return {
		inDesignMode: function () {
			var publishingEdit = window.g_disableCheckoutInEditMode;
			var form = document.forms[MSOWebPartPageFormName];
			var input = form.MSOLayout_InDesignMode || form._wikiPageMode;

			return !!(publishingEdit || (input && input.value));
		},

		SharePointReady: function () {
			var deferred = $q.defer();
			SP.SOD.executeOrDelayUntilScriptLoaded(function () {
				deferred.resolve();
			}, "sp.js");
			return deferred.promise;
		},

		generateCamlQuery: function (queryInfo, listSchema) {
			/*
				Formato del objeto de filtro:
				{
					filter: 'Country eq ' + $routeParams.country + ' and Modified eq [Today]',
					orderBy: 'Title asc, Modified desc',
					select: 'Title, Country',
					top: 10,
					pagingInfo: 'Paged=TRUE&p_ID=nnn[&PagedPrev=TRUE]'
				}
			*/
			var camlQueryXml = "";
			var camlQuery;

			if (queryInfo === undefined) {
				camlQuery = SP.CamlQuery.createAllItemsQuery();
			} else {
				// El formato del parametro puede ser un objeto, que hay que procesar, o un string directo de CamlQuery
				if (typeof queryInfo === 'string') {
					camlQueryXml = queryInfo;
				} else if (typeof queryInfo === 'object') {
					var odata = ODataParserProvider.ODataParser(listSchema);
					odata.parseExpression(queryInfo);
					camlQueryXml = odata.getCAMLQuery();
				}

				if (camlQueryXml) {
					camlQuery = new SP.CamlQuery();
					camlQuery.set_viewXml(camlQueryXml);
				}

				if (queryInfo.pagingInfo) {
					var position = new SP.ListItemCollectionPosition(); 
	        		position.set_pagingInfo(queryInfo.pagingInfo);
					camlQuery.set_listItemCollectionPosition(position);
				}
			}
			return camlQuery;
		}
	};
}]);
