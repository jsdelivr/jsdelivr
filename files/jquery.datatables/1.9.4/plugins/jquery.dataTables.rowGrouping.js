/*
* File:        jquery.dataTables.grouping.js
* Version:     1.0.
* Author:      Jovan Popovic 
* 
* Copyright 2011 Jovan Popovic, all rights reserved.
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
* @sGrupingClass                                        String              Class that will be associated to the group row. Default - "group"
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
* @sGrupingClass2                                       String              Class that will be associated to the secondary group row. Default "subgroup"
* @bHideGroupingColumn2                                 Boolean             Hide column used for secondary grouping once results are grouped. Default - true,
* @bHideGroupingOrderByColumn2                          Boolean             Hide column used for ordering secondary groups once results are grouped. Default - true,
* @sGroupBy2                                            Enumeration         Type of grouping that should be applied to secondary column. Values "name"(default), "letter", "year",
* @sGroupLabelPrefix2                                   String              Prefix that will be added to each secondary group cell
* @fnOnGrouped                                          Function            Function that is called when grouping is finished. Function has no parameters.
*/
(function ($) {

    $.fn.rowGrouping = function (options) {

        function _fnOnGrouped() {

        }

        function _getMonthName(iMonth) {
            var asMonths = ["January", "February", "March", "April", "May", "June", "Jully", "August", "September", "October", "November", "December"];
            return asMonths[iMonth - 1];
        }

        var defaults = {

            iGroupingColumnIndex: 0,
            sGroupingColumnSortDirection: "",
            iGroupingOrderByColumnIndex: -1,
            sGrupingClass: "group",
            bHideGroupingColumn: true,
            bHideGroupingOrderByColumn: true,
            sGroupBy: "name",
            sGroupLabelPrefix: "",
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
            sGrupingClass2: "subgroup",
            bHideGroupingColumn2: true,
            bHideGroupingOrderByColumn2: true,
            sGroupBy2: "name",
            sGroupLabelPrefix2: "",
            bExpandableGrouping2: false,

            fnOnGrouped: _fnOnGrouped


        };


        return this.each(function (index, elem) {

            var oTable = $(elem).dataTable();
            function _fnIsGroupExpanded(sGroup) {
                return ($.inArray(sGroup, asExpandedGroups) != -1);
            }
            function _fnGetYear(x) {
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
                return sGroup.toLowerCase().replace(" ", "-");
            }

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

            if (properties.asExpandedGroups != null) {
                if (properties.asExpandedGroups == "NONE") {
                    properties.asExpandedGroups = [];
                    asExpandedGroups = properties.asExpandedGroups;
                    bInitialGrouping = false;
                } else if (properties.asExpandedGroups == "ALL") {

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
            }

            iYearIndex = properties.sDateFormat.toLowerCase().indexOf('yy');
            iYearLength = properties.sDateFormat.toLowerCase().lastIndexOf('y') - properties.sDateFormat.toLowerCase().indexOf('y') + 1;

            iMonthIndex = properties.sDateFormat.toLowerCase().indexOf('mm');
            iMonthLength = properties.sDateFormat.toLowerCase().lastIndexOf('m') - properties.sDateFormat.toLowerCase().indexOf('m') + 1;

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




            var _fnDrawCallBackWithGrouping = function (oSettings) {

                var bUseSecondaryGrouping = false;

                if (properties.iGroupingColumnIndex2 != -1)
                    bUseSecondaryGrouping = true;

                //-----Start grouping

                if (oSettings.aiDisplay.length == 0) {
                    return;
                }

                var nTrs = $('tbody tr', oTable);
                var iColspan = nTrs[0].getElementsByTagName('td').length;
                var sLastGroup = null;
                var sLastGroup2 = null;
                for (var i = 0; i < nTrs.length; i++) {
                    var iDisplayIndex = oSettings._iDisplayStart + i;
                    var sGroupData = "";
                    var sGroup = null;
                    var sGroupData2 = "";
                    var sGroup2 = null;

                    sGroupData = oSettings.aoData[oSettings.aiDisplay[iDisplayIndex]]._aData[properties.iGroupingColumnIndex];
                    var sGroup = sGroupData;
                    if (properties.sGroupBy != "year")
                        sGroup = fnGetGroup(sGroupData);

                    if (bUseSecondaryGrouping) {
                        sGroupData2 = oSettings.aoData[oSettings.aiDisplay[iDisplayIndex]]._aData[properties.iGroupingColumnIndex2];
                        if (properties.sGroupBy2 != "year")
                            sGroup2 = fnGetGroup(sGroupData2);
                    }

                    if (sLastGroup == null || sGroup != sLastGroup) {
                        var sGroupCleaned = _fnGetCleanedGroup(sGroup);

                        if (properties.bExpandableGrouping && bInitialGrouping) {
                            if (properties.bExpandSingleGroup) {
                                if (asExpandedGroups.length == 0)
                                    asExpandedGroups.push(sGroupCleaned);
                            } else {
                                asExpandedGroups.push(sGroupCleaned);
                            }
                        }


                        var nGroup = document.createElement('tr');
                        var nCell = document.createElement('td');

                        nGroup.id = "group-id-" + oTable.attr("id") + "-" + sGroupCleaned;

                        if (properties.bSetGroupingClassOnTR) {
                            nGroup.className = properties.sGrupingClass + " " + sGroupCleaned;
                        } else {
                            nCell.className = properties.sGrupingClass + " " + sGroupCleaned;
                        }

                        nCell.colSpan = iColspan;
                        nCell.innerHTML = properties.sGroupLabelPrefix + (sGroup == "" ? properties.sEmptyGroupLabel : sGroup);
                        if (properties.bExpandableGrouping) {


                            if (_fnIsGroupExpanded(sGroupCleaned)) {
                                nCell.className += " expanded-group";
                            } else {
                                nCell.className += " collapsed-group";
                            }
                            nCell.className += " group-item-expander";
                            nCell.rel = sGroupCleaned;


                            ///*************


                            $(nCell).click(function (e) {


                                var sGroup = $(this).attr("rel");

                                var bIsExpanded = _fnIsGroupExpanded(sGroup);
                                if (properties.bExpandSingleGroup) {
                                    if (!bIsExpanded) {
                                        var sCurrentGroup = asExpandedGroups[0];
                                        asExpandedGroups = new Array();
                                        asExpandedGroups.push(sGroup);

                                        $(".group-item-" + sCurrentGroup, oTable).hide();
                                        $(".group-item-" + sGroup, oTable).show();

                                        var oTrExpandedGroup = $(".expanded-group");
                                        oTrExpandedGroup.removeClass("expanded-group");
                                        oTrExpandedGroup.addClass("collapsed-group");
                                        $(this).addClass("expanded-group");
                                        $(this).removeClass("collapsed-group");
                                        if (properties.iExpandGroupOffset != -1) {
                                            var position = $("#group-id-" + oTable.attr("id") + "-" + sGroup).offset().top - properties.iExpandGroupOffset;
                                            window.scroll(0, position);
                                        } else {
                                            var position = oTable.offset().top;
                                            window.scroll(0, position);
                                        }
                                    }
                                } else {
                                    if (bIsExpanded) {
                                        var index = $.inArray(sGroup, asExpandedGroups);
                                        asExpandedGroups.splice(index, 1);
                                        $(this).removeClass("expanded-group");
                                        $(this).addClass("collapsed-group");
                                        $(".group-item-" + sGroup, oTable).hide();
                                    } else {
                                        asExpandedGroups.push(sGroup);
                                        $(this).addClass("expanded-group");
                                        $(this).removeClass("collapsed-group");
                                        $(".group-item-" + sGroup, oTable).show();
                                    }
                                }
                                e.preventDefault();

                            }
                    );






                            ///***********






                        }
                        nGroup.appendChild(nCell);
                        nTrs[i].parentNode.insertBefore(nGroup, nTrs[i]);
                        sLastGroup = sGroup;
                        sLastGroup2 = null; //to reset second level grouping





                    } // end if (sLastGroup == null || sGroup != sLastGroup)

                    if (properties.bExpandableGrouping) {
                        $(nTrs[i]).addClass("group-item-" + sGroupCleaned);
                        if (/*properties.bExpandSingleGroup &&*/!_fnIsGroupExpanded(sGroupCleaned)) {
                            $(nTrs[i]).hide();
                        }
                    }


                    if (bUseSecondaryGrouping) {

                        if (sLastGroup2 == null || sGroup2 != sLastGroup2) {
                            var nGroup2 = document.createElement('tr');
                            var nCell2 = document.createElement('td');

                            if (properties.bSetGroupingClassOnTR) {
                                nGroup2.className = properties.sGrupingClass2 + " " + sGroup2.toLowerCase().replace(" ", "-");
                            } else {
                                nCell2.className = properties.sGrupingClass2 + " " + sGroup2.toLowerCase().replace(" ", "-");
                            }

                            nCell2.colSpan = iColspan;
                            nCell2.innerHTML = properties.sGroupLabelPrefix2 + (sGroup2 == "" ? properties.sEmptyGroupLabel : sGroup2);

                            nGroup2.appendChild(nCell2);
                            nTrs[i].parentNode.insertBefore(nGroup2, nTrs[i]);
                            sLastGroup2 = sGroup2;
                        }


                    } //end if (bUseSecondaryGrouping)



                } // end for (var i = 0; i < nTrs.length; i++)


                //-----End grouping
                properties.fnOnGrouped();

                bInitialGrouping = false;
            };




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
                "sName": "fnRowGroupung"
            });

            var aaSortingFixed = new Array();
            aaSortingFixed.push([properties.iGroupingOrderByColumnIndex, properties.sGroupingColumnSortDirection]);
            if (properties.iGroupingColumnIndex2 != -1) {
                aaSortingFixed.push([properties.iGroupingOrderByColumnIndex2, properties.sGroupingColumnSortDirection2]);
            }

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
                        $('td:eq(' + iColumn + ')', oSettings.oApi._fnGetTrNodes(oSettings)).each(function () {
                            aData.push(_fnGetYear(this.innerHTML));
                        });
                        return aData;
                    }




                    break;
                default:
                    break;

            }
            if (properties.sGroupBy == "name" || properties.sGroupBy == "letter") {

            } else {
                //oTable.fnSettings().aaSortingFixed = [[properties.iGroupingOrderByColumnIndex, properties.sGroupingColumnSortDirection]];

            }

            oTable.fnDraw();





        });
    };
})(jQuery);