/*
* File:        jquery.dataTables.grouping.js
* Version:     1.2.9.
* Author:      Jovan Popovic 
* 
* Copyright 2013 Jovan Popovic, all rights reserved.
*
* This source file is free software, under either the GPL v2 license or a
* BSD style license, as supplied with this software.
* 
* This source file is distributed in the hope that it will be useful, but 
* WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
* or FITNESS FOR A PARTICULAR PURPOSE. 
* Parameters:
* @iGroupingColumnIndex                                 Integer             Index of the column that will be used for grouping - default 0
* @sGroupingColumnSortDirection                         Enumeration         Sort direction of the group
* @iGroupingOrderByColumnIndex                          Integer             Index of the column that will be used for ordering groups
* @sGroupingClass                                       String              Class that will be associated to the group row. Default - "group"
* @sGroupItemClass                                      String              Class that will be associated to the group row of group items. Default - "group-item"
* @bSetGroupingClassOnTR                                Boolean             If set class will be set to the TR instead of the TD withing the grouping TR
* @bHideGroupingColumn                                  Boolean             Hide column used for grouping once results are grouped. Default - true
* @bHideGroupingOrderByColumn                           Boolean             Hide column used for ordering groups once results are grouped. Default - true
* @sGroupBy                                             Enumeration         Type of grouping that should be applied. Values "name"(default), "letter", "year"
* @sGroupLabelPrefix                                    String              Prefix that will be added to each group cell
* @bExpandableGrouping                                  Boolean             Attach expand/collapse handlers to the grouping rows
* @bExpandSingleGroup                                   Boolean             Use accordon grouping
* @iExpandGroupOffset                                   Integer             Number of pixels to set scroll position above the currently selected group. If -1 scroll will be alligned to the table
* General settings
* @sDateFormat: "dd/MM/yyyy"                            String              Date format used for grouping
* @sEmptyGroupLabel                                     String              Lable that will be placed as group if grouping cells are empty. Default "-"

* Parameters used in the second level grouping
* @iGroupingColumnIndex2                                Integer             Index of the secondary column that will be used for grouping - default 0
* @sGroupingColumnSortDirection2                        Enumeration         Sort direction of the secondary group
* @iGroupingOrderByColumnIndex2                         Integer             Index of the column that will be used for ordering secondary groups
* @sGroupingClass2                                      String              Class that will be associated to the secondary group row. Default "subgroup"
* @sGroupItemClass2                                     String              Class that will be associated to the secondary group row of group items. Default "subgroup-item"
* @bHideGroupingColumn2                                 Boolean             Hide column used for secondary grouping once results are grouped. Default - true,
* @bHideGroupingOrderByColumn2                          Boolean             Hide column used for ordering secondary groups once results are grouped. Default - true,
* @sGroupBy2                                            Enumeration         Type of grouping that should be applied to secondary column. Values "name"(default), "letter", "year",
* @sGroupLabelPrefix2                                   String              Prefix that will be added to each secondary group cell
* @fnOnGrouped                                          Function            Function that is called when grouping is finished. Function has no parameters.
*/
(function ($) {

	"use strict";

    $.fn.rowGrouping = function (options) {

        function _fnOnGrouped() {

        }

        function _fnOnGroupCreated(oGroup, sGroup, iLevel) {
            ///<summary>
            ///Function called when a new grouping row is created(it should be overriden in properties)
            ///</summary>
        }
		
		function _fnOnGroupCompleted(oGroup, sGroup, iLevel) {
            ///<summary>
            ///Function called when a new grouping row is created(it should be overriden in properties)
            ///</summary>
        }

        function _getMonthName(iMonth) {
            var asMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return asMonths[iMonth - 1];
        }

        var defaults = {

            iGroupingColumnIndex: 0,
            sGroupingColumnSortDirection: "",
            iGroupingOrderByColumnIndex: -1,
            sGroupingClass: "group",
			sGroupItemClass: "group-item",
            bHideGroupingColumn: true,
            bHideGroupingOrderByColumn: true,
            sGroupBy: "name",
            sGroupLabelPrefix: "",
            fnGroupLabelFormat: function (label) { return label; },
            bExpandableGrouping: false,
            bExpandSingleGroup: false,
            iExpandGroupOffset: 100,
            asExpandedGroups: null,

            sDateFormat: "dd/MM/yyyy",
            sEmptyGroupLabel: "-",
            bSetGroupingClassOnTR: false,

            iGroupingColumnIndex2: -1,
            sGroupingColumnSortDirection2: "",
            iGroupingOrderByColumnIndex2: -1,
            sGroupingClass2: "subgroup",
            sGroupItemClass2: "subgroup-item",
            bHideGroupingColumn2: true,
            bHideGroupingOrderByColumn2: true,
            sGroupBy2: "name",
            sGroupLabelPrefix2: "",
            fnGroupLabelFormat2: function (label) { return label; },
            bExpandableGrouping2: false,

            fnOnGrouped: _fnOnGrouped,

            fnOnGroupCreated: _fnOnGroupCreated,
            fnOnGroupCompleted: _fnOnGroupCompleted,

            oHideEffect: null, // { method: "hide", duration: "fast", easing: "linear" },
            oShowEffect: null,//{ method: "show", duration: "slow", easing: "linear" }
			
			bUseFilteringForGrouping: false // This is still work in progress option
        };
        return this.each(function (index, elem) {

            var oTable = $(elem).dataTable();

            var aoGroups = new Array();
            $(this).dataTableExt.aoGroups = aoGroups;

            function fnCreateGroupRow(sGroupCleaned, sGroup, iColspan) {
                var nGroup = document.createElement('tr');
                var nCell = document.createElement('td');
                nGroup.id = "group-id-" + oTable.attr("id") + "_" + sGroupCleaned;

                var oGroup = { id: nGroup.id, key: sGroupCleaned, text: sGroup, level: 0, groupItemClass: ".group-item-" + sGroupCleaned, dataGroup: sGroupCleaned, aoSubgroups: new Array() };



                if (properties.bSetGroupingClassOnTR) {
                    nGroup.className = properties.sGroupingClass + " " + sGroupCleaned;
                } else {
                    nCell.className = properties.sGroupingClass + " " + sGroupCleaned;
                }

                nCell.colSpan = iColspan;
                nCell.innerHTML = properties.sGroupLabelPrefix + properties.fnGroupLabelFormat(sGroup == "" ? properties.sEmptyGroupLabel : sGroup, oGroup );
                if (properties.bExpandableGrouping) {

                    if (!_fnIsGroupCollapsed(sGroupCleaned)) {
                        nCell.className += " expanded-group";
                        oGroup.state = "expanded";
                    } else {
                        nCell.className += " collapsed-group";
                        oGroup.state = "collapsed";
                    }
                    nCell.className += " group-item-expander";
                    $(nCell).attr('data-group', oGroup.dataGroup); //Fix provided by mssskhalsa (Issue 5)
                    $(nCell).attr("data-group-level", oGroup.level);
                    $(nCell).click(_fnOnGroupClick);
                }
                nGroup.appendChild(nCell);
                aoGroups[sGroupCleaned] = oGroup;
                oGroup.nGroup = nGroup;
                properties.fnOnGroupCreated(oGroup, sGroupCleaned, 1);
                return oGroup;
            }

            function _fnCreateGroup2Row(sGroup2, sGroupLabel, iColspan, oParentGroup) {

                var nGroup2 = document.createElement('tr');
                nGroup2.id = oParentGroup.id + "_" + sGroup2;
                var nCell2 = document.createElement('td');
                var dataGroup = oParentGroup.dataGroup + '_' + sGroup2;

                var oGroup = { id: nGroup2.id, key: sGroup2, text: sGroupLabel, level: oParentGroup.level + 1, groupItemClass: ".group-item-" + dataGroup,
                    dataGroup: dataGroup, aoSubgroups: new Array()
                };

                if (properties.bSetGroupingClassOnTR) {
                    nGroup2.className = properties.sGroupingClass2 + " " + sGroup2;
                } else {
                    nCell2.className = properties.sGroupingClass2 + " " + sGroup2;
                }

                nCell2.colSpan = iColspan;
                nCell2.innerHTML = properties.sGroupLabelPrefix2 + properties.fnGroupLabelFormat2(sGroupLabel == "" ? properties.sEmptyGroupLabel : sGroupLabel, oGroup);

                if (properties.bExpandableGrouping) {

                    nGroup2.className += " group-item-" + oParentGroup.dataGroup;
                }


                if (properties.bExpandableGrouping && properties.bExpandableGrouping2) {

                    if (!_fnIsGroupCollapsed(oGroup.dataGroup)) {
                        nCell2.className += " expanded-group";
                        oGroup.state = "expanded";
                    } else {
                        nCell2.className += " collapsed-group";
                        oGroup.state = "collapsed";
                    }
                    nCell2.className += " group-item-expander";
                    $(nCell2).attr('data-group', oGroup.dataGroup);
                    $(nCell2).attr("data-group-level", oGroup.level);
                    $(nCell2).click(_fnOnGroupClick);
                }

                nGroup2.appendChild(nCell2);

                oParentGroup.aoSubgroups[oGroup.dataGroup] = oGroup;
                aoGroups[oGroup.dataGroup] = oGroup;
                oGroup.nGroup = nGroup2;
                properties.fnOnGroupCreated(oGroup, sGroup2, 2);
                return oGroup;
            }

            function _fnIsGroupCollapsed(sGroup) {
                if (aoGroups[sGroup] != null)
                    return (aoGroups[sGroup].state == "collapsed");
                else
                    if (sGroup.indexOf("_") > -1)
                        true;
                    else
						if(bInitialGrouping && (asExpandedGroups==null || asExpandedGroups.length == 0))
							return false;// initially if asExpandedGroups is empty - no one is collapsed
						else
							return ($.inArray(sGroup, asExpandedGroups) == -1); //the last chance check asExpandedGroups
            }			
			
            function _fnGetYear(x) {
				if(x.length< (iYearIndex+iYearLength) )
					return x;
				else
					return x.substr(iYearIndex, iYearLength);
            }
            function _fnGetGroupByName(x) {
                return x;
            }

            function _fnGetGroupByLetter(x) {
                return x.substr(0, 1);
            }

            function _fnGetGroupByYear(x) {
                return _fnGetYear(x);
                //return Date.parseExact(x, properties.sDateFormat).getFullYear();//slooooow
            }

            function _fnGetGroupByYearMonth(x) {
                //var date = Date.parseExact(x, "dd/MM/yyyy");
                //return date.getFullYear() + " / " + date.getMonthName();
                //return x.substr(iYearIndex, iYearLength) + '/' + x.substr(iMonthIndex, iMonthLength);
                return x.substr(iYearIndex, iYearLength) + ' ' + _getMonthName(x.substr(iMonthIndex, iMonthLength));
            }

            function _fnGetCleanedGroup(sGroup) {

                if (sGroup === "") return "-";
                return sGroup.toLowerCase().replace(/[^a-zA-Z0-9\u0080-\uFFFF]+/g, "-"); //fix for unicode characters (Issue 23)
                //return sGroup.toLowerCase().replace(/\W+/g, "-"); //Fix provided by bmathews (Issue 7)
            }
			
			function _rowGroupingRowFilter(oSettings, aData, iDataIndex) {
			    ///<summary>Used to expand/collapse groups with DataTables filtering</summary>
                if (oSettings.nTable.id !== oTable[0].id) return true;
                var sColData = aData[properties.iGroupingColumnIndex];
                if (typeof sColData === "undefined")
                    sColData = aData[oSettings.aoColumns[properties.iGroupingColumnIndex].mDataProp];
                if (_fnIsGroupCollapsed(_fnGetCleanedGroup(sColData))) {
                    if (oTable.fnIsOpen(oTable.fnGetNodes(iDataIndex)))
					{
						if (properties.fnOnRowClosed != null) {
                            properties.fnOnRowClosed(this); //    $(this.cells[0].children[0]).attr('src', '../../Images/details.png');
                        }
                        oTable.fnClose(oTable.fnGetNodes(iDataIndex));
                    }
                    return false;
                };
				return true;
            } //end of function _rowGroupingRowFilter


            function fnExpandGroup(sGroup) {
                ///<summary>Expand group if expanadable grouping is used</summary>
				
			    aoGroups[sGroup].state = "expanded";	
				
				$("td[data-group^='" + sGroup + "']").removeClass("collapsed-group");
                $("td[data-group^='" + sGroup + "']").addClass("expanded-group");
						
						
				if(properties.bUseFilteringForGrouping)
				{
					oTable.fnDraw();
					return;//Because rows are expanded with _rowGroupingRowFilter function
				}
				
				if (jQuery.inArray(sGroup, asExpandedGroups)==-1)
                    asExpandedGroups.push(sGroup);
				
                if (properties.oHideEffect != null)
                    $(".group-item-" + sGroup, oTable)
					[properties.oShowEffect.method](properties.oShowEffect.duration,
									properties.oShowEffect.easing,
									function () { });
                else
                    $(".group-item-" + sGroup, oTable).show();


            } //end of function fnExpandGroup

            function fnCollapseGroup(sGroup) {
                ///<summary>Collapse group if expanadable grouping is used</summary>

				aoGroups[sGroup].state = "collapsed";
				$("td[data-group^='" + sGroup + "']").removeClass("expanded-group");
                $("td[data-group^='" + sGroup + "']").addClass("collapsed-group");
				
				if(properties.bUseFilteringForGrouping)
				{
					oTable.fnDraw();
					return;//Because rows are expanded with _rowGroupingRowFilter function
				}
				//var index = $.inArray(sGroup, asExpandedGroups);
                //asExpandedGroups.splice(index, 1);
				
                $('.group-item-' + sGroup).each(function () {
                    //Issue 24 - Patch provided by Bob Graham
                    if (oTable.fnIsOpen(this)) {
                        if (properties.fnOnRowClosed != null) {
                            properties.fnOnRowClosed(this); //    $(this.cells[0].children[0]).attr('src', '../../Images/details.png');
                        }
                        oTable.fnClose(this);
                    }
                });

                if (properties.oHideEffect != null)
                    $(".group-item-" + sGroup, oTable)
					[properties.oHideEffect.method](properties.oHideEffect.duration,
									properties.oHideEffect.easing,
									function () { });
                else
                    $(".group-item-" + sGroup, oTable).hide();

            } //end of function fnCollapseGroup

            function _fnOnGroupClick(e) {
                ///<summary>
                ///Function that is called when user click on the group cell in order to
                ///expand of collapse group
                ///</summary>

                //var sGroup = $(this).attr("rel");
                var sGroup = $(this).attr("data-group");
                var iGroupLevel = $(this).attr("data-group-level");

                var bIsExpanded = !_fnIsGroupCollapsed(sGroup);
                if (properties.bExpandSingleGroup) {
                    if (!bIsExpanded) {
                        var sCurrentGroup = $("td.expanded-group").attr("data-group");
                        fnCollapseGroup(sCurrentGroup);
                        fnExpandGroup(sGroup);

                        if (properties.iExpandGroupOffset != -1) {
                            var position = $("#group-id-" + oTable.attr("id") + "_" + sGroup).offset().top - properties.iExpandGroupOffset;
                            window.scroll(0, position);
                        } else {
                            var position = oTable.offset().top;
                            window.scroll(0, position);
                        }
                    }
                } else {
                    if (bIsExpanded) {
                        fnCollapseGroup(sGroup);
                    } else {
                        fnExpandGroup(sGroup);
                    }
                }
                e.preventDefault();

            }; //end function _fnOnGroupClick
			
			
			function _fnDrawCallBackWithGrouping (oSettings) {

                if (oTable.fnSettings().oFeatures.bServerSide)
                    bInitialGrouping = true;
                var bUseSecondaryGrouping = false;

                if (properties.iGroupingColumnIndex2 != -1)
                    bUseSecondaryGrouping = true;

                //-----Start grouping

                if (oSettings.aiDisplayMaster.length == 0) { //aiDisplay
                    return;
                }

                var nTrs = $('tbody tr', oTable);
                var iColspan = 0; //nTrs[0].getElementsByTagName('td').length;
                for (var iColIndex = 0; iColIndex < oSettings.aoColumns.length; iColIndex++) {
                    if (oSettings.aoColumns[iColIndex].bVisible)
                        iColspan += 1;
                }
                var sLastGroup = null;
                var sLastGroup2 = null;
                if (oSettings.aiDisplay.length > 0) {
                    for (var i = 0; i < nTrs.length; i++) {


                        var iDisplayIndex = oSettings._iDisplayStart + i;
                        if (oTable.fnSettings().oFeatures.bServerSide)
                            iDisplayIndex = i;
                        var sGroupData = "";
                        var sGroup = null;
                        var sGroupData2 = "";
                        var sGroup2 = null;

                        //Issue 31 - Start fix provided by Fabien Taysse 
//                      sGroupData = oSettings.aoData[oSettings.aiDisplay[iDisplayIndex]]._aData[properties.iGroupingColumnIndex];
//                      if (sGroupData == undefined)
//                          sGroupData = oSettings.aoData[oSettings.aiDisplay[iDisplayIndex]]._aData[oSettings.aoColumns[properties.iGroupingColumnIndex].mDataProp];
                        sGroupData = this.fnGetData(nTrs[i], properties.iGroupingColumnIndex);
                        //Issue 31 - End fix provided by Fabien Taysse 

                        var sGroup = sGroupData;
                        if (properties.sGroupBy != "year")
                            sGroup = fnGetGroup(sGroupData);

                        if (bUseSecondaryGrouping) {
                            sGroupData2 = oSettings.aoData[oSettings.aiDisplay[iDisplayIndex]]._aData[properties.iGroupingColumnIndex2];
                            if (sGroupData2 == undefined)
                                sGroupData2 = oSettings.aoData[oSettings.aiDisplay[iDisplayIndex]]._aData[oSettings.aoColumns[properties.iGroupingColumnIndex2].mDataProp];
                            if (properties.sGroupBy2 != "year")
                                sGroup2 = fnGetGroup(sGroupData2);
                        }


                        if (sLastGroup == null || _fnGetCleanedGroup(sGroup) != _fnGetCleanedGroup(sLastGroup)) { // new group encountered (or first of group)
                            var sGroupCleaned = _fnGetCleanedGroup(sGroup);
				
                            if(sLastGroup != null)
                            {
                            	properties.fnOnGroupCompleted(aoGroups[_fnGetCleanedGroup(sLastGroup)]);
                            }
							/*
                            if (properties.bExpandableGrouping && bInitialGrouping) {
                                if (properties.bExpandSingleGroup) {
                                    if (asExpandedGroups.length == 0)
                                        asExpandedGroups.push(sGroupCleaned);
                                } else {
                                    asExpandedGroups.push(sGroupCleaned);
                                }
                            }
							*/
							if(properties.bAddAllGroupsAsExpanded && jQuery.inArray(sGroupCleaned,asExpandedGroups) == -1)
								asExpandedGroups.push(sGroupCleaned);

                            var oGroup = fnCreateGroupRow(sGroupCleaned, sGroup, iColspan);
                            var nGroup = oGroup.nGroup;

							if(nTrs[i].parentNode!=null)
								nTrs[i].parentNode.insertBefore(nGroup, nTrs[i]);
							else
								$(nTrs[i]).before(nGroup);

                            sLastGroup = sGroup;
                            sLastGroup2 = null; //to reset second level grouping





                        } // end if (sLastGroup == null || sGroup != sLastGroup)
						
						$(nTrs[i]).attr("data-group", aoGroups[sGroupCleaned].dataGroup);

                        $(nTrs[i]).addClass(properties.sGroupItemClass);
                        $(nTrs[i]).addClass("group-item-" + sGroupCleaned);
                        if (properties.bExpandableGrouping) {
                            if (_fnIsGroupCollapsed(sGroupCleaned) && !properties.bUseFilteringForGrouping) {
                                $(nTrs[i]).hide();
                            }
                        }


                        if (bUseSecondaryGrouping) {

                            if (sLastGroup2 == null || _fnGetCleanedGroup(sGroup2) != _fnGetCleanedGroup(sLastGroup2)) {
                                var sGroup2Id = _fnGetCleanedGroup(sGroup) + '-' + _fnGetCleanedGroup(sGroup2);
                                var oGroup2 = _fnCreateGroup2Row(sGroup2Id, sGroup2, iColspan, aoGroups[sGroupCleaned])
                                var nGroup2 = oGroup2.nGroup;
                                nTrs[i].parentNode.insertBefore(nGroup2, nTrs[i]);

                                sLastGroup2 = sGroup2;
                            }

                            $(nTrs[i]).attr("data-group", oGroup2.dataGroup)
										.addClass(properties.sGroupItemClass2)
                                        .addClass("group-item-" + oGroup2.dataGroup);
                        } //end if (bUseSecondaryGrouping)



                    } // end for (var i = 0; i < nTrs.length; i++)
                }; // if (oSettings.aiDisplay.length > 0)

				if(sLastGroup != null)
			    {
			    	properties.fnOnGroupCompleted(aoGroups[_fnGetCleanedGroup(sLastGroup)]);
			    }


                //-----End grouping
                properties.fnOnGrouped(aoGroups);

                bInitialGrouping = false;
				
            }; // end of _fnDrawCallBackWithGrouping = function (oSettings)


            //var oTable = this;
            var iYearIndex = 6;
            var iYearLength = 4;
            var asExpandedGroups = new Array();
            var bInitialGrouping = true;

            var properties = $.extend(defaults, options);

            if (properties.iGroupingOrderByColumnIndex == -1) {
                properties.bCustomColumnOrdering = false;
                properties.iGroupingOrderByColumnIndex = properties.iGroupingColumnIndex;
            } else {
                properties.bCustomColumnOrdering = true;
            }

            if (properties.sGroupingColumnSortDirection == "") {
                if (properties.sGroupBy == "year")
                    properties.sGroupingColumnSortDirection = "desc";
                else
                    properties.sGroupingColumnSortDirection = "asc";
            }


            if (properties.iGroupingOrderByColumnIndex2 == -1) {
                properties.bCustomColumnOrdering2 = false;
                properties.iGroupingOrderByColumnIndex2 = properties.iGroupingColumnIndex2;
            } else {
                properties.bCustomColumnOrdering2 = true;
            }

            if (properties.sGroupingColumnSortDirection2 == "") {
                if (properties.sGroupBy2 == "year")
                    properties.sGroupingColumnSortDirection2 = "desc";
                else
                    properties.sGroupingColumnSortDirection2 = "asc";
            }

			
			
            iYearIndex = properties.sDateFormat.toLowerCase().indexOf('yy');
            iYearLength = properties.sDateFormat.toLowerCase().lastIndexOf('y') - properties.sDateFormat.toLowerCase().indexOf('y') + 1;

            var iMonthIndex = properties.sDateFormat.toLowerCase().indexOf('mm');
            var iMonthLength = properties.sDateFormat.toLowerCase().lastIndexOf('m') - properties.sDateFormat.toLowerCase().indexOf('m') + 1;

            var fnGetGroup = _fnGetGroupByName;
            switch (properties.sGroupBy) {
                case "letter": fnGetGroup = _fnGetGroupByLetter;
                    break;
                case "year": fnGetGroup = _fnGetGroupByYear;
                    break;
                case "month": fnGetGroup = _fnGetGroupByYearMonth;
                    break;
                default: fnGetGroup = _fnGetGroupByName;
                    break;
            }
			
			
            if (properties.asExpandedGroups != null) {
                if (properties.asExpandedGroups == "NONE") {
                    properties.asExpandedGroups = [];
                    asExpandedGroups = properties.asExpandedGroups;
                    bInitialGrouping = false;
                } else if (properties.asExpandedGroups == "ALL") {
					properties.bAddAllGroupsAsExpanded = true;
                } else if (properties.asExpandedGroups.constructor == String) {
                    var currentGroup = properties.asExpandedGroups;
                    properties.asExpandedGroups = new Array();
                    properties.asExpandedGroups.push(_fnGetCleanedGroup(currentGroup));
                    asExpandedGroups = properties.asExpandedGroups;
                    bInitialGrouping = false;
                } else if (properties.asExpandedGroups.constructor == Array) {
                    for (var i = 0; i < properties.asExpandedGroups.length; i++) {
                        asExpandedGroups.push(_fnGetCleanedGroup(properties.asExpandedGroups[i]));
                        if (properties.bExpandSingleGroup)
                            break;
                    }
                    bInitialGrouping = false;
                }
            }else{
				properties.asExpandedGroups = new Array();
				properties.bAddAllGroupsAsExpanded = true;
			}
			if(properties.bExpandSingleGroup){
			    var nTrs = $('tbody tr', oTable);
				var sGroupData = oTable.fnGetData(nTrs[0], properties.iGroupingColumnIndex);
				
				var sGroup = sGroupData;
                if (properties.sGroupBy != "year")
                    sGroup = fnGetGroup(sGroupData);

				var sGroupCleaned = _fnGetCleanedGroup(sGroup);
				properties.asExpandedGroups = new Array();
				properties.asExpandedGroups.push(sGroupCleaned);
							
			}

            oTable.fnSetColumnVis(properties.iGroupingColumnIndex, !properties.bHideGroupingColumn);
            if (properties.bCustomColumnOrdering) {
                oTable.fnSetColumnVis(properties.iGroupingOrderByColumnIndex, !properties.bHideGroupingOrderByColumn);
            }
            if (properties.iGroupingColumnIndex2 != -1) {
                oTable.fnSetColumnVis(properties.iGroupingColumnIndex2, !properties.bHideGroupingColumn2);
            }
            if (properties.bCustomColumnOrdering2) {
                oTable.fnSetColumnVis(properties.iGroupingOrderByColumnIndex2, !properties.bHideGroupingOrderByColumn2);
            }
            oTable.fnSettings().aoDrawCallback.push({
                "fn": _fnDrawCallBackWithGrouping,
                "sName": "fnRowGrouping"
            });

            var aaSortingFixed = new Array();
            aaSortingFixed.push([properties.iGroupingOrderByColumnIndex, properties.sGroupingColumnSortDirection]);
            if (properties.iGroupingColumnIndex2 != -1) {
                aaSortingFixed.push([properties.iGroupingOrderByColumnIndex2, properties.sGroupingColumnSortDirection2]);
            } // end of if (properties.iGroupingColumnIndex2 != -1)

            oTable.fnSettings().aaSortingFixed = aaSortingFixed;
            //Old way
            //oTable.fnSettings().aaSortingFixed = [[properties.iGroupingOrderByColumnIndex, properties.sGroupingColumnSortDirection]];

            switch (properties.sGroupBy) {
                case "name":
                    break;


                case "letter":

                    /* Create an array with the values of all the input boxes in a column */
                    oTable.fnSettings().aoColumns[properties.iGroupingOrderByColumnIndex].sSortDataType = "rg-letter";
                    $.fn.dataTableExt.afnSortData['rg-letter'] = function (oSettings, iColumn) {
                        var aData = [];
                        $('td:eq(' + iColumn + ')', oSettings.oApi._fnGetTrNodes(oSettings)).each(function () {
                            aData.push(_fnGetGroupByLetter(this.innerHTML));
                        });
                        return aData;
                    }


                    break;


                case "year":
                    /* Create an array with the values of all the input boxes in a column */
                    oTable.fnSettings().aoColumns[properties.iGroupingOrderByColumnIndex].sSortDataType = "rg-date";
                    $.fn.dataTableExt.afnSortData['rg-date'] = function (oSettings, iColumn) {
                        var aData = [];
						var nTrs = oSettings.oApi._fnGetTrNodes(oSettings);
						for(i = 0; i< nTrs.length; i++)
						{
							aData.push(_fnGetYear( oTable.fnGetData( nTrs[i], iColumn) ));
						}

/*
                        $('td:eq(' + iColumn + ')', oSettings.oApi._fnGetTrNodes(oSettings)).each(function () {
                            aData.push(_fnGetYear(this.innerHTML));
                        });
*/
                        return aData;
                    }
                    break;
                default:
                    break;

            } // end of switch (properties.sGroupBy)

			if(properties.bUseFilteringForGrouping)
					$.fn.dataTableExt.afnFiltering.push(_rowGroupingRowFilter);
			
            oTable.fnDraw();
			


        });
    };
})(jQuery);