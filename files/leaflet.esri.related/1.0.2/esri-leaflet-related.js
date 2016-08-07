/*! esri-leaflet-related - v1.0.2 - 2015-07-16
*   Copyright (c) 2015 Environmental Systems Research Institute, Inc.
*   Apache 2.0 License */


/*! esri-leaflet-related - v1.0.2 - 2015-07-16
*   Copyright (c) 2015 Environmental Systems Research Institute, Inc.
*   Apache 2.0 License */
if(!Esri)var Esri=window.L.esri;L.esri.Tasks.QueryRelated=Esri.Tasks.Task.extend({setters:{offset:"offset",limit:"limit",outFields:"fields",objectIds:"objectIds",relationshipId:"relationshipId",definitionExpression:"definitionExpression",precision:"geometryPrecision",featureIds:"objectIds",returnGeometry:"returnGeometry",returnZ:"returnZ",returnM:"returnM",token:"token"},path:"queryRelatedRecords",params:{returnGeometry:!0,outSr:4326,outFields:"*",returnZ:!0,returnM:!1},initialize:function(a){a._service?L.esri.Tasks.Task.prototype.initialize.call(this,a._service):L.esri.Tasks.Task.prototype.initialize.call(this,a)},simplify:function(a,b){var c=Math.abs(a.getBounds().getWest()-a.getBounds().getEast());return this.params.maxAllowableOffset=c/a.getSize().y*b,this},run:function(a,b){return this.request(function(c,d){for(var e={features:[]},f=0;f<d.relatedRecordGroups.length;f++)for(var g=0;g<d.relatedRecordGroups[f].relatedRecords.length;g++)e.features.push(d.relatedRecordGroups[f].relatedRecords[g]);a.call(b,c,d&&L.esri.Util.responseToFeatureCollection(e),d)},b)}}),"undefined"!=typeof window&&window.L&&window.L.esri&&(window.L.esri.Tasks.queryRelated=function(a){return new L.esri.Tasks.QueryRelated(a)});
//# sourceMappingURL=esri-leaflet-related.js.map