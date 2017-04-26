(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.runtime = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * System Runtime
 * 
 * https://designfirst.io/systemruntime/
 * 
 * Copyright 2017 Erwan Carriou
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This module contains Runtime core system.
 *
 * @module runtime
 * @submodule runtime-system
 * @class runtime-system
 * @static 
 */

'use strict';


/* Public properties */


/*
 * Runtime core system
 * @property {RuntimeSystem} system
 */
var system = {
    "models": {
        "138a81fa1f16435": {
            "_id": "138a81fa1f16435",
            "_name": "RuntimeAdmin",
            "_inherit": [
                "RuntimeComponent"
            ],
            "_core": true,
            "start": {},
            "designerWindow": {
                "type": "object",
                "readOnly": false,
                "mandatory": false,
                "default": null
            }
        },
        "135c71078810af2": {
            "_id": "135c71078810af2",
            "_name": "RuntimeChannel",
            "_inherit": [
                "RuntimeComponent"
            ],
            "_core": true,
            "$editorUpdateSchemaName": {
                "params": [{
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "name": "id",
                        "type": "string"
                    }
                ]
            },
            "$designerSync": {},
            "$appLoadSystem": {
                "params": [{
                    "name": "system",
                    "type": "object"
                }]
            },
            "$designerCreateBehavior": {
                "params": [{
                    "name": "behavior",
                    "type": "object"
                }]
            },
            "$editorUpdateBehavior": {
                "params": [{
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "behavior",
                        "type": "object"
                    }
                ]
            },
            "$designerUpdateBehavior": {
                "params": [{
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "behavior",
                        "type": "object"
                    }
                ]
            },
            "$editorDeleteBehavior": {
                "params": [{
                    "name": "id",
                    "type": "string"
                }]
            },
            "$designerDeleteBehavior": {
                "params": [{
                    "name": "id",
                    "type": "string"
                }]
            },
            "$designerCreateComponent": {
                "params": [{
                        "name": "collection",
                        "type": "string"
                    },
                    {
                        "name": "component",
                        "type": "object"
                    }
                ]
            },
            "$editorUpdateComponent": {
                "params": [{
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "collection",
                        "type": "string"
                    },
                    {
                        "name": "component",
                        "type": "object"
                    }
                ]
            },
            "$designerUpdateComponent": {
                "params": [{
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "collection",
                        "type": "string"
                    },
                    {
                        "name": "component",
                        "type": "object"
                    }
                ]
            },
            "$editorDeleteComponent": {
                "params": [{
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "collection",
                        "type": "string"
                    }
                ]
            },
            "$designerDeleteComponent": {
                "params": [{
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "collection",
                        "type": "string"
                    }
                ]
            },
            "$designerCreateType": {
                "params": [{
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "type",
                        "type": "object"
                    }
                ]
            },
            "$editorUpdateType": {
                "params": [{
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "type",
                        "type": "object"
                    }
                ]
            },
            "$editorDeleteType": {
                "params": [{
                    "name": "id",
                    "type": "string"
                }]
            },
            "$designerCreateSchema": {
                "params": [{
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "schema",
                        "type": "object"
                    }
                ]
            },
            "$editorUpdateSchema": {
                "params": [{
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "schema",
                        "type": "object"
                    }
                ]
            },
            "$editorUpdateSchemaId": {
                "params": [{
                        "name": "oldId",
                        "type": "string"
                    },
                    {
                        "name": "newId",
                        "type": "string"
                    }
                ]
            },
            "$designerDeleteSchema": {
                "params": [{
                    "name": "id",
                    "type": "string"
                }]
            },
            "$designerCreateModel": {
                "params": [{
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "model",
                        "type": "object"
                    }
                ]
            },
            "$editorUpdateModel": {
                "params": [{
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "model",
                        "type": "object"
                    }
                ]
            },
            "$designerUpdateModel": {
                "params": [{
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "model",
                        "type": "object"
                    }
                ]
            },
            "$editorUpdateModelId": {
                "params": [{
                        "name": "oldId",
                        "type": "string"
                    },
                    {
                        "name": "newId",
                        "type": "string"
                    }
                ]
            },
            "$designerDeleteModel": {
                "params": [{
                    "name": "id",
                    "type": "string"
                }]
            },
            "$editorUpdateSystem": {
                "params": [{
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "system",
                        "type": "object"
                    }
                ]
            },
            "$appLogDebug": {
                "params": [{
                    "name": "message",
                    "type": "string"
                }]
            },
            "$appLogInfo": {
                "params": [{
                    "name": "message",
                    "type": "string"
                }]
            },
            "$appLogWarn": {
                "params": [{
                    "name": "message",
                    "type": "string"
                }]
            },
            "$appLogError": {
                "params": [{
                    "name": "message",
                    "type": "string"
                }]
            },
            "$runtimeCreateComponent": {
                "params": [{
                        "name": "collection",
                        "type": "string"
                    },
                    {
                        "name": "component",
                        "type": "object"
                    }
                ]
            },
            "$runtimeDeleteComponent": {
                "params": [{
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "collection",
                        "type": "string"
                    }
                ]
            },
            "$runtimeUpdateComponent": {
                "params": [{
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "collection",
                        "type": "string"
                    },
                    {
                        "name": "field",
                        "type": "string"
                    },
                    {
                        "name": "value",
                        "type": "any"
                    }
                ]
            },
            "send": {
                "params": [{
                    "name": "message",
                    "type": "message"
                }]
            },
            "$systemInstalled": {
                "params": [{
                    "name": "id",
                    "type": "string",
                    "mandatory": true,
                    "default": ""
                }]
            },
            "$systemResolved": {
                "params": [{
                    "name": "id",
                    "type": "string",
                    "mandatory": true,
                    "default": ""
                }]
            },
            "$systemUninstalled": {
                "params": [{
                    "name": "id",
                    "type": "string",
                    "mandatory": true,
                    "default": ""
                }]
            },
            "$systemStarted": {
                "params": [{
                    "name": "id",
                    "type": "string",
                    "mandatory": true,
                    "default": ""
                }]
            },
            "$systemStopped": {
                "params": [{
                    "name": "id",
                    "type": "string",
                    "mandatory": true,
                    "default": ""
                }]
            }
        },
        "1f4141671514c2c": {
            "_id": "1f4141671514c2c",
            "_name": "RuntimeStorage",
            "get": {
                "params": [{
                    "name": "key",
                    "type": "string",
                    "mandatory": true,
                    "default": ""
                }]
            },
            "set": {
                "params": [{
                        "name": "key",
                        "type": "string",
                        "mandatory": true,
                        "default": ""
                    },
                    {
                        "name": "value",
                        "type": "any",
                        "mandatory": true,
                        "default": null
                    }
                ]
            },
            "changed": {
                "params": [{
                    "name": "changed",
                    "type": "object",
                    "mandatory": true,
                    "default": {}
                }]
            },
            "clear": {},
            "remove": {
                "params": [{
                    "name": "key",
                    "type": "string",
                    "mandatory": true,
                    "default": ""
                }]
            },
            "_core": true,
            "store": {
                "type": "object",
                "readOnly": false,
                "mandatory": false,
                "default": {}
            }
        },
        "14c7c105b31a160": {
            "_id": "14c7c105b31a160",
            "_name": "Runtime",
            "_core": true,
            "version": {
                "type": "string",
                "readOnly": true,
                "mandatory": true,
                "default": "0.0.0"
            },
            "system": {
                "params": [{
                    "name": "params",
                    "type": "any",
                    "mandatory": false
                }],
                "result": "object"
            },
            "message": {
                "params": [{
                    "name": "msg",
                    "type": "message",
                    "mandatory": true
                }]
            },
            "ready": {}
        },
        "166971fd9d107fd": {
            "_name": "RuntimeBehavior",
            "_core": true,
            "core": {
                "type": "boolean",
                "readOnly": false,
                "mandatory": false,
                "default": false
            },
            "useCoreAPI": {
                "type": "boolean",
                "readOnly": false,
                "mandatory": false,
                "default": false
            },
            "component": {
                "type": "string",
                "readOnly": false,
                "mandatory": true,
                "default": ""
            },
            "action": {
                "type": "javascript",
                "readOnly": false,
                "mandatory": true,
                "default": ""
            },
            "state": {
                "type": "string",
                "readOnly": false,
                "mandatory": true,
                "default": ""
            },
            "_id": "166971fd9d107fd"
        },
        "158321dced1014a": {
            "_name": "RuntimeClassInfo",
            "_core": true,
            "model": {
                "type": "object",
                "readOnly": true,
                "mandatory": true,
                "default": {}
            },
            "property": {
                "params": [{
                    "name": "name",
                    "type": "string"
                }],
                "result": "object"
            },
            "properties": {
                "result": "array"
            },
            "link": {
                "params": [{
                    "name": "name",
                    "type": "string"
                }],
                "result": "object"
            },
            "links": {
                "result": "array"
            },
            "method": {
                "params": [{
                    "name": "name",
                    "type": "string"
                }],
                "result": "object"
            },
            "methods": {
                "result": "array"
            },
            "collection": {
                "params": [{
                    "name": "name",
                    "type": "string"
                }],
                "result": "object"
            },
            "collections": {
                "result": "array"
            },
            "event": {
                "params": [{
                    "name": "name",
                    "type": "string"
                }],
                "result": "object"
            },
            "events": {
                "result": "array"
            },
            "_id": "158321dced1014a",
            "schema": {
                "type": "object",
                "readOnly": true,
                "mandatory": true,
                "default": {}
            }
        },
        "123751cb591de26": {
            "_id": "123751cb591de26",
            "_name": "RuntimeComponent",
            "_core": true,
            "on": {
                "params": [{
                        "name": "state",
                        "type": "string"
                    },
                    {
                        "name": "handler",
                        "type": "function"
                    },
                    {
                        "name": "useCoreAPI",
                        "type": "boolean",
                        "mandatory": false,
                        "default": false
                    },
                    {
                        "name": "isCore",
                        "type": "boolean",
                        "mandatory": false,
                        "default": false
                    }
                ]
            },
            "off": {
                "params": [{
                        "name": "state",
                        "type": "string",
                        "mandatory": false
                    },
                    {
                        "name": "behaviorId",
                        "type": "string",
                        "mandatory": false
                    }
                ]
            },
            "require": {
                "params": [{
                    "name": "id",
                    "type": "string"
                }]
            },
            "destroy": {
                "params": []
            },
            "classInfo": {
                "type": "@RuntimeClassInfo",
                "readOnly": false,
                "mandatory": false,
                "default": {}
            },
            "init": {
                "params": [{
                    "name": "conf",
                    "type": "object"
                }]
            },
            "error": {
                "params": [{
                    "name": "data",
                    "type": "errorParam"
                }]
            }
        },
        "18a51169d7112d4": {
            "_name": "RuntimeDatabase",
            "_core": true,
            "system": {
                "params": [{
                    "name": "system",
                    "type": "object",
                    "mandatory": false
                }],
                "result": "string"
            },
            "subsystem": {
                "params": [{
                    "name": "params",
                    "type": "object"
                }],
                "result": "string"
            },
            "collections": {
                "result": "object"
            },
            "insert": {
                "params": [{
                    "name": "event",
                    "type": "dbInsertEvent"
                }]
            },
            "update": {
                "params": [{
                    "name": "event",
                    "type": "dbUpdateEvent"
                }]
            },
            "remove": {
                "params": [{
                    "name": "event",
                    "type": "dbRemoveEvent"
                }]
            },
            "_id": "18a51169d7112d4"
        },
        "16b9d1ac2216ffe": {
            "_id": "16b9d1ac2216ffe",
            "_name": "RuntimeLogger",
            "_core": true,
            "level": {
                "type": "log",
                "readOnly": false,
                "mandatory": false,
                "default": "warn"
            },
            "debug": {
                "params": [{
                    "name": "message",
                    "type": "any"
                }]
            },
            "info": {
                "params": [{
                    "name": "message",
                    "type": "any"
                }]
            },
            "warn": {
                "params": [{
                    "name": "message",
                    "type": "any"
                }]
            },
            "error": {
                "params": [{
                    "name": "message",
                    "type": "any"
                }]
            }
        },
        "1d9b6139411aa91": {
            "_name": "RuntimeMessage",
            "_core": true,
            "event": {
                "type": "string",
                "readOnly": false,
                "mandatory": true,
                "default": ""
            },
            "from": {
                "type": "string",
                "readOnly": false,
                "mandatory": true,
                "default": ""
            },
            "data": {
                "type": "array",
                "readOnly": false,
                "mandatory": true,
                "default": []
            },
            "_id": "1d9b6139411aa91"
        },
        "1628c13c22152e6": {
            "_name": "RuntimeMetamodel",
            "_core": true,
            "schema": {
                "params": [{
                    "name": "schema",
                    "type": "object"
                }],
                "result": "any"
            },
            "model": {
                "params": [{
                    "name": "model",
                    "type": "object"
                }],
                "result": "any"
            },
            "type": {
                "params": [{
                    "name": "type",
                    "type": "object"
                }],
                "result": "any"
            },
            "create": {
                "params": []
            },
            "_id": "1628c13c22152e6"
        },
        "177ac136891629f": {
            "_name": "RuntimeState",
            "_core": true,
            "name": {
                "type": "string",
                "readOnly": false,
                "mandatory": true,
                "default": ""
            },
            "parameters": {
                "type": "object",
                "readOnly": false,
                "mandatory": false,
                "default": {}
            },
            "_id": "177ac136891629f"
        },
        "170521b88614387": {
            "_name": "RuntimeSystem",
            "_core": true,
            "name": {
                "type": "string",
                "readOnly": false,
                "mandatory": true,
                "default": ""
            },
            "master": {
                "type": "boolean",
                "readOnly": false,
                "mandatory": false,
                "default": false
            },
            "subsystem": {
                "type": "boolean",
                "readOnly": false,
                "mandatory": false,
                "default": false
            },
            "version": {
                "type": "string",
                "readOnly": false,
                "mandatory": false,
                "default": "0.0.1"
            },
            "description": {
                "type": "string",
                "readOnly": false,
                "mandatory": false,
                "default": ""
            },
            "schemas": {
                "type": "object",
                "readOnly": false,
                "mandatory": false,
                "default": {}
            },
            "models": {
                "type": "object",
                "readOnly": false,
                "mandatory": false,
                "default": {}
            },
            "behaviors": {
                "type": "object",
                "readOnly": false,
                "mandatory": false,
                "default": {}
            },
            "types": {
                "type": "object",
                "readOnly": false,
                "mandatory": false,
                "default": {}
            },
            "components": {
                "type": "object",
                "readOnly": false,
                "mandatory": false,
                "default": {}
            },
            "ready": {},
            "sync": {},
            "main": {},
            "_id": "170521b88614387"
        },
        "100b91ed2211b15": {
            "_id": "100b91ed2211b15",
            "_name": "RuntimeOSGi",
            "install": {
                "params": [{
                        "name": "url",
                        "type": "any",
                        "mandatory": true,
                        "default": ""
                    },
                    {
                        "name": "async",
                        "type": "boolean",
                        "mandatory": false,
                        "default": true
                    }
                ],
                "result": "string"
            },
            "uninstall": {
                "params": [{
                    "name": "id",
                    "type": "string",
                    "mandatory": true,
                    "default": ""
                }]
            },
            "start": {
                "params": [{
                    "name": "id",
                    "type": "string",
                    "mandatory": true,
                    "default": ""
                }]
            },
            "stop": {
                "params": [{
                    "name": "id",
                    "type": "string",
                    "mandatory": true,
                    "default": ""
                }]
            },
            "status": {
                "result": "object"
            },
            "_core": true,
            "bundle": {
                "result": "string"
            }
        },
        "1b2811b092143f5": {
            "_id": "1b2811b092143f5",
            "_name": "RuntimeSystemOSGi",
            "start": {},
            "stop": {},
            "_core": true,
            "state": {
                "type": "string",
                "readOnly": false,
                "mandatory": false,
                "default": "none"
            },
            "location": {
                "type": "string",
                "readOnly": false,
                "mandatory": false,
                "default": ""
            },
            "uninstall": {},
            "bundle": {
                "result": "string"
            }
        },
        "o1e1e01e6b41cec3": {
            "_id": "o1e1e01e6b41cec3",
            "_name": "RuntimeLog",
            "action": {
                "type": "dbAction",
                "readOnly": false,
                "mandatory": false,
                "default": "insert"
            },
            "collection": {
                "type": "string",
                "readOnly": false,
                "mandatory": false,
                "default": ""
            },
            "id": {
                "type": "string",
                "readOnly": false,
                "mandatory": false,
                "default": ""
            },
            "field": {
                "type": "string",
                "readOnly": false,
                "mandatory": false,
                "default": ""
            },
            "value": {
                "type": "any",
                "readOnly": false,
                "mandatory": false,
                "default": ""
            },
            "order": {
                "type": "number",
                "readOnly": false,
                "mandatory": false,
                "default": 0
            }
        }
    },
    "schemas": {
        "10374180581a41f": {
            "_id": "10374180581a41f",
            "_name": "RuntimeAdmin",
            "_inherit": [
                "RuntimeComponent"
            ],
            "_core": true,
            "designerWindow": "property",
            "start": "method"
        },
        "104ad1f48518376": {
            "_id": "104ad1f48518376",
            "_name": "RuntimeChannel",
            "_core": true,
            "$editorUpdateSystem": "event",
            "$editorUpdateSchema": "event",
            "$editorUpdateSchemaId": "event",
            "$editorUpdateSchemaName": "event",
            "$editorUpdateModel": "event",
            "$editorUpdateModelId": "event",
            "$editorUpdateType": "event",
            "$editorDeleteType": "event",
            "$editorUpdateBehavior": "event",
            "$editorDeleteBehavior": "event",
            "$editorUpdateComponent": "event",
            "$editorDeleteComponent": "event",
            "$appLogDebug": "event",
            "$appLogInfo": "event",
            "$appLogWarn": "event",
            "$appLogError": "event",
            "$appLoadSystem": "event",
            "$designerSync": "event",
            "$designerCreateBehavior": "event",
            "$designerCreateComponent": "event",
            "$designerCreateType": "event",
            "$designerCreateSchema": "event",
            "$designerCreateModel": "event",
            "$designerDeleteSchema": "event",
            "$designerDeleteModel": "event",
            "$designerDeleteType": "event",
            "$designerDeleteBehavior": "event",
            "$designerDeleteComponent": "event",
            "$designerUpdateComponent": "event",
            "$designerUpdateModel": "event",
            "$designerUpdateBehavior": "event",
            "$runtimeCreateComponent": "event",
            "$runtimeDeleteComponent": "event",
            "$runtimeUpdateComponent": "event",
            "_inherit": [
                "RuntimeComponent"
            ],
            "send": "event",
            "$systemInstalled": "event",
            "$systemResolved": "event",
            "$systemStarted": "event",
            "$systemStopped": "event",
            "$systemUninstalled": "event"
        },
        "12fa8181ce127a0": {
            "_id": "12fa8181ce127a0",
            "_name": "RuntimeStorage",
            "_inherit": [
                "RuntimeComponent"
            ],
            "_core": true,
            "store": "property",
            "get": "method",
            "set": "method",
            "remove": "method",
            "clear": "method",
            "changed": "event"
        },
        "12e211d4cd120a6": {
            "_id": "12e211d4cd120a6",
            "_name": "Runtime",
            "_inherit": [
                "RuntimeOSGi"
            ],
            "_core": true,
            "version": "property",
            "system": "method",
            "message": "method",
            "ready": "event"
        },
        "1ac07185641fa9f": {
            "_name": "RuntimeBehavior",
            "_inherit": [
                "RuntimeComponent"
            ],
            "_core": true,
            "core": "property",
            "component": "property",
            "action": "property",
            "state": "property",
            "useCoreAPI": "property",
            "_id": "1ac07185641fa9f"
        },
        "1c00b13a1b1bc92": {
            "_name": "RuntimeClassInfo",
            "_inherit": [
                "RuntimeComponent"
            ],
            "_core": true,
            "model": "property",
            "schema": "property",
            "method": "method",
            "methods": "method",
            "property": "method",
            "properties": "method",
            "link": "method",
            "links": "method",
            "collections": "method",
            "collection": "method",
            "event": "method",
            "events": "method",
            "_id": "1c00b13a1b1bc92"
        },
        "111df11e2b19fde": {
            "_id": "111df11e2b19fde",
            "_name": "RuntimeComponent",
            "_inherit": [],
            "_core": true,
            "classInfo": "property",
            "on": "method",
            "off": "method",
            "require": "method",
            "destroy": "method",
            "init": "method",
            "error": "event"
        },
        "1723516a30132ac": {
            "_name": "RuntimeDatabase",
            "_inherit": [
                "RuntimeComponent"
            ],
            "_core": true,
            "system": "method",
            "subsystem": "method",
            "collections": "method",
            "insert": "event",
            "update": "event",
            "remove": "event",
            "_id": "1723516a30132ac"
        },
        "1268f1dddd1fea7": {
            "_name": "RuntimeLogger",
            "_core": true,
            "level": "property",
            "debug": "method",
            "info": "method",
            "warn": "method",
            "error": "method",
            "_id": "1268f1dddd1fea7"
        },
        "14caa1c46414ee1": {
            "_name": "RuntimeMessage",
            "_inherit": [
                "RuntimeComponent"
            ],
            "_core": true,
            "event": "property",
            "from": "property",
            "data": "property",
            "_id": "14caa1c46414ee1"
        },
        "193f1166eb16609": {
            "_name": "RuntimeMetamodel",
            "_inherit": [
                "RuntimeComponent"
            ],
            "_core": true,
            "schema": "method",
            "model": "method",
            "type": "method",
            "create": "method",
            "_id": "193f1166eb16609"
        },
        "158711d6f215e4b": {
            "_name": "RuntimeState",
            "_inherit": [],
            "_core": true,
            "_class": false,
            "name": "property",
            "parameters": "property",
            "_id": "158711d6f215e4b"
        },
        "1cb761fa4510dca": {
            "_id": "1cb761fa4510dca",
            "_name": "RuntimeSystem",
            "_inherit": [
                "RuntimeSystemOSGi"
            ],
            "_core": true,
            "name": "property",
            "master": "property",
            "subsystem": "property",
            "version": "property",
            "description": "property",
            "schemas": "property",
            "models": "property",
            "behaviors": "property",
            "types": "property",
            "components": "property",
            "sync": "method",
            "main": "method",
            "ready": "event"
        },
        "157931f7a31b61d": {
            "_id": "157931f7a31b61d",
            "_name": "RuntimeOSGi",
            "_inherit": [
                "RuntimeComponent"
            ],
            "_core": true,
            "install": "method",
            "uninstall": "method",
            "start": "method",
            "stop": "method",
            "status": "method",
            "bundle": "method"
        },
        "145fe10c7514298": {
            "_id": "145fe10c7514298",
            "_name": "RuntimeSystemOSGi",
            "_inherit": [
                "RuntimeComponent"
            ],
            "_core": true,
            "state": "property",
            "location": "property",
            "start": "method",
            "stop": "method",
            "uninstall": "method",
            "bundle": "method"
        },
        "f1a10d1067d1b23a": {
            "_id": "f1a10d1067d1b23a",
            "_name": "RuntimeLog",
            "_inherit": [
                "RuntimeComponent"
            ],
            "action": "property",
            "collection": "property",
            "id": "property",
            "field": "property",
            "value": "property",
            "order": "property"
        }
    },
    "types": {
        "collection": {
            "name": "collection",
            "type": "object",
            "schema": {
                "type": {
                    "type": [
                        "string"
                    ],
                    "mandatory": true
                },
                "readOnly": {
                    "type": "boolean",
                    "mandatory": true
                },
                "mandatory": {
                    "type": "boolean",
                    "mandatory": true
                },
                "default": {
                    "type": "object",
                    "mandatory": true
                },
                "description": {
                    "type": "string",
                    "mandatory": false
                },
                "label": {
                    "type": "string",
                    "mandatory": false
                }
            },
            "core": true
        },
        "css": {
            "name": "css",
            "type": "string",
            "core": true
        },
        "date": {
            "name": "date",
            "type": "object",
            "core": true
        },
        "errorParam": {
            "name": "errorParam",
            "type": "object",
            "schema": {
                "message": {
                    "type": "string",
                    "mandatory": true
                },
                "error": {
                    "type": "object",
                    "mandatory": true
                }
            },
            "core": true
        },
        "event": {
            "name": "event",
            "type": "object",
            "schema": {
                "params": {
                    "type": [
                        "parameter"
                    ],
                    "mandatory": false
                },
                "description": {
                    "type": "string",
                    "mandatory": false
                }
            },
            "core": true
        },
        "html": {
            "name": "html",
            "type": "string",
            "core": true
        },
        "javascript": {
            "name": "javascript",
            "type": "string",
            "core": true
        },
        "json": {
            "name": "json",
            "type": "object",
            "core": true
        },
        "link": {
            "name": "link",
            "type": "object",
            "schema": {
                "type": {
                    "type": "string",
                    "mandatory": true
                },
                "readOnly": {
                    "type": "boolean",
                    "mandatory": true
                },
                "mandatory": {
                    "type": "boolean",
                    "mandatory": true
                },
                "default": {
                    "type": "@type",
                    "mandatory": true
                },
                "description": {
                    "type": "string",
                    "mandatory": false
                },
                "label": {
                    "type": "string",
                    "mandatory": false
                }
            },
            "core": true
        },
        "log": {
            "name": "log",
            "type": "string",
            "value": [
                "debug",
                "info",
                "warn",
                "error"
            ],
            "core": true
        },
        "message": {
            "name": "message",
            "type": "object",
            "schema": {
                "event": {
                    "type": "string",
                    "mandatory": true
                },
                "from": {
                    "type": "string",
                    "mandatory": false
                },
                "data": {
                    "type": "object",
                    "mandatory": true
                }
            },
            "core": true
        },
        "method": {
            "name": "method",
            "type": "object",
            "schema": {
                "result": {
                    "type": "string",
                    "mandatory": false
                },
                "params": {
                    "type": [
                        "parameter"
                    ],
                    "mandatory": false
                },
                "description": {
                    "type": "string",
                    "mandatory": false
                }
            },
            "core": true
        },
        "parameter": {
            "name": "parameter",
            "type": "object",
            "schema": {
                "name": {
                    "type": "string",
                    "mandatory": true
                },
                "type": {
                    "type": "string",
                    "mandatory": true
                },
                "mandatory": {
                    "type": "boolean",
                    "mandatory": false
                },
                "default": {
                    "type": "@type",
                    "mandatory": false
                }
            },
            "core": true
        },
        "property": {
            "name": "property",
            "type": "object",
            "schema": {
                "type": {
                    "type": "string",
                    "mandatory": true
                },
                "readOnly": {
                    "type": "boolean",
                    "mandatory": true
                },
                "mandatory": {
                    "type": "boolean",
                    "mandatory": true
                },
                "default": {
                    "type": "@type",
                    "mandatory": true
                },
                "description": {
                    "type": "string",
                    "mandatory": false
                },
                "label": {
                    "type": "string",
                    "mandatory": false
                }
            },
            "core": true
        },
        "osgiStates": {
            "name": "osgiStates",
            "type": "string",
            "value": [
                "none",
                "installed",
                "resolved",
                "starting",
                "active",
                "stopping",
                "uninstalled"
            ],
            "core": true
        },
        "text": {
            "name": "text",
            "type": "string",
            "core": true
        },
        "dbInsertEvent": {
            "_id": "148ef1e19810e6d",
            "name": "dbInsertEvent",
            "type": "object",
            "schema": {
                "collection": {
                    "type": "string",
                    "mandatory": true,
                    "default": ""
                },
                "document": {
                    "type": "object",
                    "mandatory": true,
                    "default": {}
                }
            }
        },
        "dbRemoveEvent": {
            "_id": "1952e1ac4213f4a",
            "name": "dbRemoveEvent",
            "type": "object",
            "schema": {
                "collection": {
                    "type": "string",
                    "mandatory": true,
                    "default": ""
                },
                "id": {
                    "type": "string",
                    "mandatory": true,
                    "default": ""
                }
            }
        },
        "dbUpdateEvent": {
            "_id": "1f5c41309711752",
            "name": "dbUpdateEvent",
            "type": "object",
            "schema": {
                "collection": {
                    "type": "string",
                    "mandatory": true,
                    "default": ""
                },
                "id": {
                    "type": "string",
                    "mandatory": true,
                    "default": ""
                },
                "field": {
                    "type": "string",
                    "mandatory": true,
                    "default": ""
                },
                "value": {
                    "type": "any",
                    "mandatory": true,
                    "default": null
                }
            }
        },
        "dbAction": {
            "_id": "e1950e16f2914da9",
            "name": "dbAction",
            "type": "string",
            "value": [
                "insert",
                "update",
                "remove"
            ]
        }
    },
    "behaviors": {
        "1c00c107e01c9b3": {
            "_id": "1c00c107e01c9b3",
            "component": "RuntimeAdmin",
            "state": "start",
            "action": "function start() {\n    var RuntimeChannel = null,\n        channel = null,\n        db = this.require('db');\n\n    if (!this.require('channel-admin')) {\n        RuntimeChannel = this.require('RuntimeChannel');\n        channel = new RuntimeChannel({\n            '_id': 'channel-admin',\n            '_core': true\n        });\n        \n        // for jquery compatibility in electron\n        if (typeof global !== 'undefined' && typeof window !== 'undefined') {\n            delete module;\n        }\n\n        channel.on('send', function send(message) {\n            this.require('admin').designerWindow().postMessage(JSON.stringify(message), '*');\n        }, false, true);\n\n        // schema change events\n        channel.on('$designerCreateSchema', function $designerCreateSchema(id, schema) {\n            this.require('logger').level('warn');\n            this.require('metamodel').schema(schema);\n            this.require('metamodel').create();\n            this.require('logger').level('debug');\n        }, true, true);\n\n        channel.on('$editorUpdateSchema', function $editorUpdateSchema(id, schema) {\n            this.require('logger').level('warn');\n            this.require('metamodel').schema(schema);\n            this.require('metamodel').create();\n            this.require('logger').level('debug');\n        }, true, true);\n\n        channel.on('$designerDeleteSchema', function $designerDeleteSchema(id) {\n            this.require('logger').level('warn');\n            var search = $db.RuntimeSchema.find({ '_id': id }),\n                modelName = '',\n                modelId = '';\n\n            if (search.length) {\n                modelName = search[0]._name;\n                $db.RuntimeSchema.remove({ '_id': id });\n\n                search = $db.RuntimeModel.find({ '_name': modelName });\n                if (search.length) {\n                    modelId = search[0]._id;\n                    $db.RuntimeModel.remove({ '_id': modelId });\n                    $component.removeFromMemory(modelName);\n                }\n\n                search = $db.RuntimeGeneratedModel.find({ '_name': modelName });\n                if (search.length) {\n                    modelId = search[0]._id;\n                    $db.RuntimeGeneratedModel.remove({ '_id': modelId });\n                    $component.removeFromMemory(modelName);\n                }\n                this.require('metamodel').create();\n            }\n            this.require('logger').level('debug');\n        }, true, true);\n\n        // model change events\n        channel.on('$designerCreateModel', function $designerCreateModel(id, model) {\n            this.require('logger').level('warn');\n            this.require('metamodel').model(model);\n            this.require('metamodel').create();\n            this.require('logger').level('debug');\n        }, true, true);\n\n        channel.on('$editorUpdateModel', function $editorUpdateModel(id, model) {\n            this.require('logger').level('warn');\n            this.require('metamodel').model(model);\n            this.require('metamodel').create();\n            this.require('logger').level('debug');\n        }, true, true);\n\n        channel.on('$designerUpdateModel', function $designerUpdateModel(id, model) {\n            this.require('logger').level('warn');\n            this.require('metamodel').model(model);\n            this.require('metamodel').create();\n            this.require('logger').level('debug');\n        }, true, true);\n\n        channel.on('$designerDeleteModel', function $designerDeleteModel(id) {\n            this.require('logger').level('warn');\n            var search = $db.RuntimeModel.find({ '_id': id }),\n                modelName = '',\n                modelId = '';\n\n            if (search.length) {\n                modelName = search[0]._name;\n                $db.RuntimeModel.remove({ '_id': id });\n                $component.removeFromMemory(modelName);\n            }\n\n            search = $db.RuntimeGeneratedModel.find({ '_name': modelName });\n            if (search.length) {\n                modelId = search[0]._id;\n                $db.RuntimeGeneratedModel.remove({ '_id': modelId });\n                $component.removeFromMemory(modelName);\n            }\n            this.require('metamodel').create();\n            this.require('logger').level('debug');\n        }, true, true);\n\n        // type change events\n        channel.on('$designerCreateType', function $designerCreateType(id, type) {\n            this.require('logger').level('warn');\n            this.require('metamodel').type(type);\n            this.require('metamodel').create();\n            this.require('logger').level('debug');\n        }, true, true);\n\n        channel.on('$editorUpdateType', function $editorUpdateType(id, type) {\n            this.require('logger').level('warn');\n            this.require('metamodel').type(type);\n            this.require('metamodel').create();\n            this.require('logger').level('debug');\n\n        }, true, true);\n\n        channel.on('$editorDeleteType', function $editorDeleteType(id) {\n            this.require('logger').level('warn');\n            $db.RuntimeType.remove({ 'name': id });\n            this.require('metamodel').create();\n            this.require('logger').level('debug');\n        }, true, true);\n\n        channel.on('$designerDeleteType', function $designerDeleteType(id) {\n            this.require('logger').level('warn');\n            $db.RuntimeType.remove({ 'name': id });\n            this.require('metamodel').create();\n            this.require('logger').level('debug');\n        }, true, true);\n\n        // component change events\n        channel.on('$designerCreateComponent', function $designerCreateComponent(model, component) {\n            $db[model].insert(component);\n        }, true, true);\n\n        channel.on('$editorUpdateComponent', function $editorUpdateComponent(id, collection, component) {\n            $db[collection].update({ '_id': id }, component, { 'upsert': true });\n        }, true, true);\n\n        channel.on('$designerUpdateComponent', function $editorUpdateComponent(id, collection, component) {\n            $db[collection].update({ '_id': id }, component, { 'upsert': true });\n        }, true, true);\n\n        channel.on('$editorDeleteComponent', function $editorDeleteComponent(id, collection) {\n            $db[collection].remove({ '_id': id });\n        }, true, true);\n\n        channel.on('$designerDeleteComponent', function $designerDeleteComponent(id, collection) {\n            $db[collection].remove({ '_id': id });\n        }, true, true);\n\n        // behavior change events\n        channel.on('$designerCreateBehavior', function createBehavior(component) {\n            $db.RuntimeBehavior.insert(component);\n        }, true, true);\n\n        channel.on('$editorUpdateBehavior', function $editorUpdateBehavior(id, behavior) {\n            if (this.require(id)) {\n                this.require(id).action(behavior.action);\n                if (behavior.state === 'main') {\n                    this.require(behavior.component).main();\n                }\n                if (behavior.state === 'start') {\n                    this.require(behavior.component).start();\n                }\n            }\n        }, true, true);\n\n        channel.on('$designerUpdateBehavior', function $designerUpdateBehavior(id, behavior) {\n            if (this.require(id)) {\n                this.require(id).action(behavior.action);\n                if (behavior.state === 'main') {\n                    this.require(behavior.component).main();\n                }\n                if (behavior.state === 'start') {\n                    this.require(behavior.component).start();\n                }\n            }\n        }, true, true);\n\n        channel.on('$editorDeleteBehavior', function $editorDeleteBehavior(id) {\n            $db.RuntimeBehavior.remove({ '_id': id });\n        }, true, true);\n\n        channel.on('$designerDeleteBehavior', function $editorDeleteBehavior(id) {\n            $db.RuntimeBehavior.remove({ '_id': id });\n        }, true, true);\n\n        // System Designer event\n        channel.on('$designerSync', function sync() {\n            var designerWindow = this.require('admin').designerWindow(),\n                system = null;\n\n            this.require('admin').designerWindow(null);\n            system = JSON.parse(this.require('db').system());\n            designerWindow = this.require('admin').designerWindow(designerWindow);\n\n            this.$appLoadSystem(system);\n        }, false, true);\n        \n        // Database insert event\n        db.on('insert', function insert(event) {\n          if (event.collection.indexOf('Runtime') !== 0) {\n            this.require('channel').$runtimeCreateComponent(event.collection, event.document);\n          }\n        });\n        \n         // Database remove event\n        db.on('remove', function remove(event) {\n          if (event.collection.indexOf('Runtime') !== 0) {\n            this.require('channel').$runtimeDeleteComponent(event.id, event.collection);\n          }\n        });\n        \n         // Database update event\n        db.on('update', function update(event) {\n          if (event.collection.indexOf('Runtime') !== 0) {\n            this.require('channel').$runtimeUpdateComponent(event.id, event.collecion, event.field, event.value);\n          }\n        });\n\n        window.addEventListener('message', function (event) {\n            var data = null;\n            try {\n                data = JSON.parse(event.data);\n                if (data &&\n                    typeof data.event !== 'undefined' &&\n                    typeof data.from !== 'undefined' &&\n                    typeof data.data !== 'undefined') {\n                    this.designerWindow(event.source);\n                    $db.RuntimeMessage.insert(data);\n                }\n            } catch (e) {\n            }\n        }.bind(this), false);\n\n        this.require('logger').info('admin is started');\n    } else {\n        this.require('logger').info('admin is already started');\n    }\n}",
            "useCoreAPI": true,
            "core": true
        },
        "1ca0f1020412d4f": {
            "_id": "1ca0f1020412d4f",
            "component": "RuntimeStorage",
            "state": "get",
            "action": "function get(key) {\n    var result = null;\n    \n    if (typeof this.store()[key]) {\n        result = this.store()[key];\n    }\n    return result;\n}",
            "useCoreAPI": false,
            "core": true
        },
        "16764100d51b5f8": {
            "_id": "16764100d51b5f8",
            "component": "RuntimeStorage",
            "state": "set",
            "action": "function set(key, value) {\n    var store = this.store(),\n        item = {};\n    \n    store[key] = value;\n    this.store(store);\n\n    item[key] = JSON.stringify(value);\n    \n    switch (true) {\n        case typeof localStorage !== 'undefined':\n            localStorage.setItem(key, JSON.stringify(value)); \n            break;\n        default:\n            break;\n    }\n}",
            "useCoreAPI": false,
            "core": true
        },
        "134b616b1016f60": {
            "_id": "134b616b1016f60",
            "component": "RuntimeStorage",
            "state": "clear",
            "action": "function clear() {\n    this.store({});\n    \n    switch (true) {\n        case typeof localStorage !== 'undefined':\n            localStorage.clear(); \n            break;\n        default:\n            break;\n    }\n}",
            "useCoreAPI": false,
            "core": true
        },
        "14c7f1a8431b3d5": {
            "_id": "14c7f1a8431b3d5",
            "component": "RuntimeStorage",
            "state": "init",
            "action": "function init(conf) {\n    switch (true) {\n        case typeof localStorage !== 'undefined':\n            \n            // init \n            var keys = Object.keys(localStorage),\n                store = {},\n                i = 0,\n                length = 0;\n                \n            length = keys.length;    \n            for (i = 0; i < length; i++) {\n                try {\n                    store[keys[i]] = JSON.parse(localStorage[keys[i]]);\n                } catch (e) {\n                }\n            }\n            this.store(store);\n            \n            // event\n            window.addEventListener('storage', function (e) {\n                var obj = {},\n                    store = this.store();\n                    \n                try {\n                    store[e.key] = JSON.parse(e.newValue)\n                    this.store(store);\n                   \n                    obj[e.key] = {};\n                    obj[e.key].oldValue = JSON.parse(e.oldValue);\n                    obj[e.key].newValue = JSON.parse(e.newValue);\n                    \n                    this.changed(obj);\n                } catch (e) {\n                }\n            }.bind(this));\n            break;\n        default:\n            break;\n    }\n}",
            "useCoreAPI": false,
            "core": true
        },
        "1a4921ac7112bd4": {
            "_id": "1a4921ac7112bd4",
            "component": "RuntimeStorage",
            "state": "remove",
            "action": "function remove(key) {\n    var store = this.store();\n    \n    delete store[key];\n    this.store(store);\n    \n    switch (true) {\n        case typeof localStorage !== 'undefined':\n            localStorage.removeItem(key); \n            break;\n        default:\n            break;\n    }\n}",
            "useCoreAPI": false,
            "core": true
        },
        "13010167f313f87": {
            "_id": "13010167f313f87",
            "component": "Runtime",
            "state": "system",
            "action": "function system(params) {\n    var RuntimeSystem = null,\n    system = {},\n    systemId = '',\n    result = [],\n    conf = {};\n    \n    if (params) {\n        if (typeof params === 'string') {\n          conf.master = true;\n          conf.name = params;\n        } else {\n          conf = params;\n          conf.master = true;\n        }\n        RuntimeSystem = this.require('RuntimeSystem');\n        system = new RuntimeSystem(conf);\n        system.state('active');\n    } else {\n        result = $db.RuntimeSystem.find({\n            'master': true\n        });\n        if (result.length) {\n            systemId = result[0]._id;\n            system = $component.get(systemId);\n        }\n    }\n    return system;\n}",
            "core": true,
            "useCoreAPI": true
        },
        "155141e40312cd8": {
            "_id": "155141e40312cd8",
            "component": "RuntimeClassInfo",
            "state": "collection",
            "action": "function collection(name) {\n    var result = {};\n    if (this.schema()[name] === 'collection') {\n        result = this.model()[name];\n    } \n    \n    return result; \n}",
            "core": true
        },
        "1f6941a0c012c1f": {
            "_id": "1f6941a0c012c1f",
            "component": "RuntimeClassInfo",
            "state": "collections",
            "action": "function collections(name) {\n    var keys = Object.keys(this.schema()),\n    item = '',\n    result = [],\n    i = 0,\n    length = 0;\n    \n    length = keys.length; \n    \n    for (i = 0; i < length; i++) { \n        item = keys[i]; \n        if (this.schema()[item] === 'collection') {\n            result.push(item);\n        }\n    }\n    \n    return result;\n}",
            "core": true
        },
        "1ef711b4171c849": {
            "_id": "1ef711b4171c849",
            "component": "RuntimeClassInfo",
            "state": "event",
            "action": "function event(name) {\n    var result = {};\n    \n    if (this.schema()[name] === 'event') {\n        result = this.model()[name];\n    } \n    \n    return result;\n}",
            "core": true
        },
        "1bae51b6ed1d25c": {
            "_id": "1bae51b6ed1d25c",
            "component": "RuntimeClassInfo",
            "state": "events",
            "action": "function events(name) {\n    var keys = Object.keys(this.schema()),\n    item = '',\n    result = [],\n    i = 0,\n    length = 0;\n    \n    length = keys.length;\n    \n    for (i = 0; i < length; i++) {\n        item = keys[i];\n        if (this.schema()[item] === 'event') {\n            result.push(item);\n        }\n    } \n    return result;\n}",
            "core": true
        },
        "19ac2125221528b": {
            "_id": "19ac2125221528b",
            "component": "RuntimeClassInfo",
            "state": "link",
            "action": "function link(name) {\n    var result = {};\n    \n    if (this.schema()[name] === 'link') {\n        result = this.model()[name];\n    }\n    return result;\n}",
            "core": true
        },
        "17ed21dfc01b8e8": {
            "_id": "17ed21dfc01b8e8",
            "component": "RuntimeClassInfo",
            "state": "links",
            "action": "function links(name) { \n    var keys = Object.keys(this.schema()),\n    item = '',\n    result = [],\n    i = 0,\n    length = 0;\n    length = keys.length;\n    \n    for (i = 0; i < length; i++) {\n        item = keys[i];\n        if (this.schema()[item] === 'link') {\n            result.push(item);\n        }\n    } return result;\n}",
            "core": true
        },
        "11ce318a561ac61": {
            "_id": "11ce318a561ac61",
            "component": "RuntimeClassInfo",
            "state": "method",
            "action": "function method(name) {\n    var result = {};\n    if (this.schema()[name] === 'method') {\n        result = this.model()[name];\n        \n    }\n    \n    return result;\n}",
            "core": true
        },
        "12ff2190a018046": {
            "_id": "12ff2190a018046",
            "component": "RuntimeClassInfo",
            "state": "methods",
            "action": "function methods(name) {\n    var keys = Object.keys(this.schema()),\n    item = '',\n    result = [],\n    i = 0,\n    length = 0;\n    length = keys.length;\n    for (i = 0; i < length; i++) {\n        item = keys[i];\n        if (this.schema()[item] === 'method') {\n            result.push(item);\n        }\n    } \n    \n    return result;\n}",
            "core": true
        },
        "1028d1681e1fd58": {
            "_id": "1028d1681e1fd58",
            "component": "RuntimeClassInfo",
            "state": "properties",
            "action": "function properties(name) { \n    var keys = Object.keys(this.schema()),\n    item = '',\n    result = [],\n    i = 0,\n    length = 0;\n    length = keys.length;\n    \n    for (i = 0; i < length; i++) {\n        item = keys[i];\n        if (this.schema()[item] === 'property') {\n            result.push(item);\n        }\n    } return result;\n}",
            "core": true
        },
        "18eeb10c5319368": {
            "_id": "18eeb10c5319368",
            "component": "RuntimeClassInfo",
            "state": "property",
            "action": "function property(name) {\n    var result = {};\n    \n    if (this.schema()[name] === 'property') {\n        result = this.model()[name];\n    }\n    return result;\n}",
            "core": true
        },
        "1ba721201114b6b": {
            "_id": "1ba721201114b6b",
            "component": "RuntimeComponent",
            "state": "destroy",
            "action": "function destroy() {\n    $component.destroy(this.id());\n}",
            "core": true,
            "useCoreAPI": true
        },
        "15486186f41a48c": {
            "_id": "15486186f41a48c",
            "component": "RuntimeComponent",
            "state": "off",
            "action": "function off(state, behaviorId) {\n    var args = [],\n    i = 0,\n    length = 0;\n    length = arguments.length;\n    \n    for (i = 0; i < length - 7; i++) {\n        args.push(arguments[i]);\n    }\n    \n    if ($workflow.checkParams({\n        \"component\": this, \n        \"methodName\": \"off\", \n        \"args\": args\n        })) {\n        \n        if (state || behaviorId) {\n            if ($metamodel.isValidState(state, this.constructor.name)) {\n                $behavior.remove({\n                    \"behaviorId\": behaviorId, \n                    \"componentId\": this.id(), \n                    \"state\": state\n                });\n            } else { \n                this.require('logger').warn(\"invoke \\'off\\' method of component '\" + this.id() + \"' with an invalid state '\" + state + \"'\"); \n            }\n        } else {\n            $behavior.remove({\n                \"componentId\": this.id()\n            });\n        }\n    }\n}",
            "core": true,
            "useCoreAPI": true
        },
        "1da0a17878104c3": {
            "_id": "1da0a17878104c3",
            "component": "RuntimeComponent",
            "state": "require",
            "action": "function require(id) {\n    return $component.get(id);\n}",
            "core": true,
            "useCoreAPI": true
        },
        "1a5111d17a1800c": {
            "_id": "1a5111d17a1800c",
            "component": "RuntimeDatabase",
            "state": "collections",
            "action": "function collections() {\n    var result = {},\n    collectionName = '';\n    \n    for (collectionName in $db.store) {\n        if ($db.store.hasOwnProperty(collectionName) && collectionName.indexOf('Runtime') !== 0) {\n            result[collectionName] = $db[collectionName];\n            \n        }\n    }\n    return result;\n}",
            "core": true,
            "useCoreAPI": true
        },
        "1e5bf167ca1b61e": {
            "_id": "1e5bf167ca1b61e",
            "component": "RuntimeDatabase",
            "state": "subsystem",
            "action": "function subsystem(params) {\n    return $db.subsystem(params);\n}",
            "core": true,
            "useCoreAPI": true
        },
        "15ab1112e81b1b4": {
            "_id": "15ab1112e81b1b4",
            "component": "RuntimeDatabase",
            "state": "system",
            "action": "function system(system) {\n    var result  = '';\n    \n    if (system) {\n      result = $db.system(system);\n      this.require(result).state('active');\n    } else {\n      result = $db.system();\n    }\n    return result;\n}",
            "core": true,
            "useCoreAPI": true
        },
        "1d993108fa18ef2": {
            "_id": "1d993108fa18ef2",
            "component": "RuntimeLogger",
            "state": "debug",
            "action": "function debug(message) {\n    if (this.level() === 'debug') {\n        console.log('runtime: ' + message);\n    }\n}",
            "core": true
        },
        "1a37a188e11fe73": {
            "_id": "1a37a188e11fe73",
            "component": "RuntimeLogger",
            "state": "error",
            "action": "function error(message) {\n    console.error('runtime: ' + message);\n}",
            "core": true
        },
        "1edd21e12a16534": {
            "_id": "1edd21e12a16534",
            "component": "RuntimeLogger",
            "state": "info",
            "action": "function info(message) {\n    if (this.level() === 'info' || this.level() === 'debug') {\n        console.info('runtime: ' + message);\n    }\n}",
            "core": true
        },
        "141f2143d3122a4": {
            "_id": "141f2143d3122a4",
            "component": "RuntimeLogger",
            "state": "level",
            "action": "function level(val) {\n    $log.level(val);\n}",
            "core": true,
            "useCoreAPI": true
        },
        "192401bab21304e": {
            "_id": "192401bab21304e",
            "component": "RuntimeLogger",
            "state": "warn",
            "action": "function warn(message) {\n    if (this.level() === 'info' || this.level() === 'warn' || this.level() === 'debug') {\n        console.warn('runtime: ' + message);\n    } \n}",
            "core": true
        },
        "11fc715e2f1a31e": {
            "_id": "11fc715e2f1a31e",
            "component": "RuntimeMetamodel",
            "state": "create",
            "action": "function create() {\n        $metamodel.create();\n}",
            "core": true,
            "useCoreAPI": true
        },
        "1232f1f107142cf": {
            "_id": "1232f1f107142cf",
            "component": "RuntimeMetamodel",
            "state": "model",
            "action": "function model(model) {\n    return $metamodel.model(model);\n}",
            "core": true,
            "useCoreAPI": true
        },
        "1365412f69153d2": {
            "_id": "1365412f69153d2",
            "component": "RuntimeMetamodel",
            "state": "schema",
            "action": "function schema(schema) {\n    return $metamodel.schema(schema);\n}",
            "core": true,
            "useCoreAPI": true
        },
        "194db147fe161a2": {
            "_id": "194db147fe161a2",
            "component": "RuntimeMetamodel",
            "state": "type",
            "action": "function type(type) {\n    return $metamodel.type(type);\n}",
            "core": true,
            "useCoreAPI": true
        },
        "129f71568717a22": {
            "_id": "129f71568717a22",
            "component": "RuntimeSystem",
            "state": "sync",
            "action": "function sync() {\n    var system = JSON.parse($db.system());\n    \n    this.schemas(system.schemas);\n    this.types(system.types);\n    this.behaviors(system.behaviors);\n    this.components(system.components);\n}",
            "core": true,
            "useCoreAPI": true
        },
        "1ef951f1411b895": {
            "_id": "1ef951f1411b895",
            "component": "RuntimeOSGi",
            "state": "install",
            "action": "function install(url, async) { \n  var importedSystem = null,\n      system = {},\n      systemId = '',\n      callbackLoad = null,\n      xhr = null,\n      result = '',\n      channel = $component.get('channel');\n\n  if (typeof url === 'object') {\n    importedSystem = url;\n  } else {\n    if (url.indexOf('{') === 0) {\n      importedSystem = JSON.parse(url);\n    }\n  }\n  \n  if (importedSystem) {\n    systemId = this.require('db').system(importedSystem); \n    if (systemId) {\n      system = this.require(systemId);\n      \n      if (typeof url === 'string') {\n        system.location(url);\n      }\n      system.state('installed');    \n      channel.$systemInstalled(systemId);\n      system.state('resolved');\n      channel.$systemResolved(systemId);\n      \n      result = systemId;\n    }\n  } else {   \n    if (typeof global !== 'undefined' && typeof window === 'undefined') {\n      if (url.indexOf('.json') !== -1) {\n        system = global.require(global.process.env.PWD + '/' + url);\n      } else {\n        system = global.require(url);\n      }\n      systemId = this.require('db').system(system);\n      system = this.require(systemId);\n      \n      if (typeof url === 'string') {\n        system.location(url);\n      }\n      system.state('installed');    \n      channel.$systemInstalled(systemId);\n      system.state('resolved');\n      channel.$systemResolved(systemId);\n      \n      result = systemId;\n    } else {\n      xhr = new XMLHttpRequest();\n      callbackLoad = function callbackLoad(system, url) {\n        var sysId = $db.system(system),\n            sys = $component.get(sysId),\n            channel = $component.get('channel');\n            \n        if (typeof url === 'string') {    \n          sys.location(url);    \n        }\n        sys.state('installed');    \n        channel.$systemInstalled(sysId);\n        sys.state('resolved');\n        channel.$systemResolved(sysId);\n        \n        result = sysId;\n      };\n      \n      if (async) {\n        xhr.open('GET', url, true);\n        xhr.onreadystatechange = function () {\n          if (xhr.readyState === 4) {\n            if (xhr.status === 200) {\n              callbackLoad(JSON.parse(xhr.response), url);\n            }\n          }\n        };\n        xhr.send(null);\n      } else {\n        xhr.open('GET', url, false);\n        xhr.send(null);\n        if (xhr.status === 200) {\n          callbackLoad(JSON.parse(xhr.response), url);\n        }\n      }\n    }\n  }\n  return result;\n}",
            "useCoreAPI": true,
            "core": true
        },
        "14c1517b711cb78": {
            "_id": "14c1517b711cb78",
            "component": "RuntimeOSGi",
            "state": "uninstall",
            "action": "function uninstall(id) { \n\tvar search = {},\n\t    system = null,\n\t    behaviorId = '',\n\t    collection =  '',\n\t    componentId = '',\n\t    length = 0,\n\t    i = 0,\n\t    coreComponents = ['admin', 'channel', 'db', 'logger', 'metamodel', 'runtime'];\n\t\n\tsearch = $db.RuntimeSystem.find({\n\t  '_id': id\n\t});\n\t\n\tif (search.length) {\n\t  system = search[0];\n\t  // remove behaviors\n\t  if (system.behaviors) {\n\t    for (behaviorId in system.behaviors) {\n\t      $db.RuntimeBehavior.remove({ \n\t        '_id': system.behaviors[behaviorId]._id\n\t      });\n\t    }\n\t  }\n\t  // remove components\n\t  if (system.components) {\n\t    for (collection in system.components) {\n\t      for (componentId in system.components[collection]) {\n\t        if (coreComponents.indexOf(componentId) === -1) {\n  \t        $db[collection].remove({ \n  \t          '_id': componentId\n  \t        });\n\t        }\n\t      }\n\t    }\n\t  }\n\t}\n\t\n\tthis.require(id).state('uninstalled');\n\tchannel.$systemUninstalled(id);\n}",
            "useCoreAPI": true,
            "core": true
        },
        "1cb9d103d41dd97": {
            "_id": "1cb9d103d41dd97",
            "component": "e89c617b6b15d24",
            "state": "start",
            "action": "function start() {\n  var subsystems = [],\n    systems = [],\n    system = null,\n    scripts = [],\n    script = null,\n    mode = '',\n    logLevel = 'warn',\n    i = 0,\n    length = 0;\n\n  // in a browser\n  if (typeof document !== 'undefined') {\n    systems = document.querySelectorAll('link[rel=system]');\n    length = systems.length;\n\n    // logger\n    scripts = document.querySelectorAll('script[log]');\n    if (scripts.length) {\n      logLevel = scripts[0].getAttribute('log');\n      this.require('logger').level(logLevel);\n    }\n\n    // mode\n    scripts = document.querySelectorAll('script[mode]');\n    if (scripts.length) {\n      mode = scripts[0].getAttribute('mode');\n      \n      if (mode === 'dev') {\n        document.addEventListener('dragenter', function (e) {\n          e.stopPropagation();\n          e.preventDefault();\n        }, false);\n\n        document.addEventListener('dragover', function (e) {\n          e.stopPropagation();\n          e.preventDefault();\n        }, false);\n\n        document.addEventListener('drop', function (e) {\n          e.stopPropagation();\n          e.preventDefault();\n          var files = e.dataTransfer.files;\n          var reader = new FileReader();\n          var json = '';\n          reader.onload = function (event) {\n            json += event.target.result;\n          };\n          reader.onloadend = function () {\n            var sys = JSON.parse(json);\n            runtime.install(sys);\n          };\n          reader.readAsText(files[0], 'UTF-8');\n        });\n      }\n      if (mode === 'design') {\n        this.require('admin').start();\n      }\n    }\n\n    // systems\n    for (i = 0; i < length; i++) {\n      system = systems[i];\n\n      if (system.getAttribute('async') === 'false') {\n        this.require('runtime').install(system.href, false);\n      } else {\n        this.require('runtime').install(system.href, true);\n      }\n    }\n\n    // designer (deprecated)\n    scripts = document.querySelectorAll('script[designer]');\n    if (scripts.length) {\n      this.require('admin').start();\n    }\n\n    // ready event\n    if (length === 0) {\n      this.require('runtime').ready();\n    }\n  }\n}",
            "useCoreAPI": true,
            "core": true
        },
        "105f219c6813643": {
            "_id": "105f219c6813643",
            "component": "RuntimeOSGi",
            "state": "start",
            "action": "function start(id) { \n\tvar system = this.require(id),\n\t    channel = this.require('channel');\n\t\n\tif (system.state() === 'resolved' || system.state() === 'installed') {\n  \tsystem.state('starting');\n  \tif (system.main) {\n  \t  system.main();\n  \t}\n  \tif (system.start) {\n  \t  system.start();\n  \t}\n  \tchannel.$systemStarted(id);\n  \tsystem.state('active');\n\t}\n}",
            "useCoreAPI": false,
            "core": true
        },
        "1a81a1f00d17269": {
            "_id": "1a81a1f00d17269",
            "component": "RuntimeOSGi",
            "state": "stop",
            "action": "function stop(id) { \n\tvar system = this.require(id),\n\t    channel = this.require('channel');\n\t    \n\tif (system.state() === 'active') {\n  \tsystem.state('stopping');\n  \tif (system.stop) {\n  \t  system.stop();\n  \t}\n  \tchannel.$systemStopped(id);\n  \tsystem.state('resolved');\n  \tchannel.$systemResolved(id);\n\t}\n}",
            "useCoreAPI": false,
            "core": true
        },
        "116851b602128d1": {
            "_id": "116851b602128d1",
            "component": "RuntimeOSGi",
            "state": "status",
            "action": "function status() { \n\tvar result = {},\n\t    system = null,\n\t    length = 0,\n\t    i = 0;\n\t\n\tsystems = $db.RuntimeSystem.find({});\n\t\n\tlength = systems.length;\n\tfor (i = 0; i < length; i++) {\n\t    system = systems[i];\n\t    result[system.name] = {\n\t      'id': system._id,\n\t      'state': system.state,\n\t      'name': system.name,\n\t      'version': system.version,\n\t      'location': system.location,\n\t      'master': system.master\n\t    };\n\t}\n\t\n\treturn result;\n}",
            "useCoreAPI": true,
            "core": true
        },
        "12e491859c13918": {
            "_id": "12e491859c13918",
            "component": "RuntimeChannel",
            "state": "$systemStarted",
            "action": "function $systemStarted(id) { \n  var systems = null;\n    \n  if (id !== 'e89c617b6b15d24') {\n    if (typeof document !== 'undefined') {\n      systems = document.querySelectorAll('link[rel=system]');\n         \n      if ($state.get('runtime') && $state.get('runtime').name === 'ready') {    \n      } else {\n        if (systems.length + 1 === $db.RuntimeSystem.count()) {\n          $component.get('runtime').ready();\n        }\n      }\n    }\n  }\n}",
            "useCoreAPI": true,
            "core": true
        },
        "1e9021bd4e1bc6e": {
            "_id": "1e9021bd4e1bc6e",
            "component": "RuntimeChannel",
            "state": "$systemInstalled",
            "action": "function $systemInstalled(id) {\n    var systems = null,\n        dependencies = [],\n        master = [],\n        canStart = true;\n\n    if (id !== 'e89c617b6b15d24') {\n      // if all systems are installed\n      systems = $db.RuntimeSystem.find({});\n\n      systems.forEach(function (system) {\n          var sys = this.require(system._id);\n          if (sys.state() === 'none') {\n              canStart = false;\n          }\n      }.bind(this));\n\n      // start all the systems\n      if (canStart) {\n          dependencies = $db.RuntimeSystem.find({\n              'master': false\n          });\n\n          dependencies.forEach(function (dep) {\n              var system = this.require(dep._id);\n              channel = this.require('channel');\n              \n              if (system.state() === 'resolved') {\n                system.state('starting');\n                system.start();\n                channel.$systemStarted(dep._id);\n                system.state('active');\n              }\n          }.bind(this));\n\n          master = $db.RuntimeSystem.find({\n              'master': true\n          });\n\n          master.forEach(function (dep) {\n              var system = this.require(dep._id);\n              channel = this.require('channel');\n              \n              if (system.state() === 'resolved') {\n                system.state('starting');\n                system.start();\n                channel.$systemStarted(dep._id);\n                system.state('active');\n              }\n          }.bind(this));\n      }\n  }\n}",
            "useCoreAPI": true,
            "core": true
        },
        "1cfa4145f614da8": {
            "_id": "1cfa4145f614da8",
            "component": "Runtime",
            "state": "message",
            "action": "function message(msg) { \n\t$db.RuntimeMessage.insert(msg);\n}",
            "useCoreAPI": true,
            "core": true
        },
        "182c51edc31ad97": {
            "_id": "182c51edc31ad97",
            "component": "RuntimeSystemOSGi",
            "state": "uninstall",
            "action": "function uninstall() { \n\tthis.require('runtime').uninstall(this.id());\n}",
            "useCoreAPI": false,
            "core": true
        },
        "19cf317d7217331": {
            "_id": "19cf317d7217331",
            "component": "RuntimeOSGi",
            "state": "bundle",
            "action": "function bundle() { \n\tvar result = this.require('db').system();\n\treturn result;\n}",
            "useCoreAPI": false,
            "core": true
        },
        "14b77144911ce48": {
            "_id": "14b77144911ce48",
            "component": "RuntimeSystemOSGi",
            "state": "bundle",
            "action": "function bundle() { \n\tvar result = '',\n\tsystem = [];\n\t\n\tsystems = $db.RuntimeSystem.find({\n    '_id': this.id()\n  });\n  \n  if (systems.length) {\n    result = JSON.stringify(systems[0]);\n  }\n  \n\treturn result;\n}",
            "useCoreAPI": true,
            "core": true
        }
    },
    "components": {
        "RuntimeAdmin": {
            "admin": {
                "_id": "admin",
                "_core": true,
                "designerWindow": null
            }
        },
        "RuntimeStorage": {
            "storage": {
                "_id": "storage",
                "_core": true
            }
        },
        "Runtime": {
            "runtime": {
                "_id": "runtime",
                "version": "1.9.6"
            }
        },
        "RuntimeDatabase": {
            "db": {
                "_id": "db"
            }
        },
        "RuntimeLogger": {
            "logger": {
                "_id": "logger",
                "level": "warn"
            }
        },
        "RuntimeMetamodel": {
            "metamodel": {
                "_id": "metamodel"
            }
        },
        "RuntimeSystem": {},
        "RuntimeChannel": {
            "channel": {
                "_id": "channel"
            }
        }
    },
    "name": "system-runtime",
    "version": "1.9.6",
    "description": "System Runtime",
    "_id": "e89c617b6b15d24",
    "master": false,
    "subsystem": false
};

/* exports  */


/**
 * This module contains Runtime core system.
 *
 * @module runtime
 * @submodule runtime-system
 * @class runtime-system
 * @static 
 */


/**
 * Runtime core system
 * @property {RuntimeSystem} system
 */
exports.system = system;

},{}],2:[function(require,module,exports){
/*
 * System Runtime
 * 
 * https://designfirst.io/systemruntime/
 * 
 * Copyright 2017 Erwan Carriou
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This module manages the behaviors of all components. 
 * A behavior is a mecanism that allow users to add actions that will be executed 
 * when a specific state of a component will change.
 * 
 * @module runtime
 * @submodule runtime-behavior
 * @requires runtime-db
 * @requires runtime-helper
 * @requires runtime-channel
 * @class runtime-behavior
 * @static
 */

'use strict';

var $db = require('./db.js');
var $helper = require('./helper.js');


/* Private properties */


var store = {};


/* Private methods */


/*
 * Create a function from a string.
 * The created function:
 * - will be a named function,
 * - has the context of the component and
 * - can have some core modules injected as parameters.
 * @method createFunction
 * @param {String} name default name of the function 
 * @param {String} func a stringified function
 * @param {Boolean} core if true, the behavior will be treated as a Runtime core behavior.
 * In that case, the behavior can not be exported in a system (default false)
 * @param {Boolean} useCoreAPI if true, Runtime core modules will be injected as parameters of the function (default false)
 * @return {Function} the created function
 * @private
 */
function createFunction(name, func, core, useCoreAPI) {
    var funcName = '',
        beginBody = -1,
        funcParams = '',
        params = [],
        paramsClean = [],
        funcBody = '',
        header = '',
        action = null;

    beginBody = func.indexOf('{');
    header = func.substring(0, beginBody);

    funcName = header.split('(')[0].replace('function', '').trim();
    funcParams = header.split('(')[1].replace(')', '').trim();

    params = funcParams.split(',');
    params.forEach(function (param) {
        paramsClean.push(param.trim());
    });

    funcBody = func.substring(beginBody + 1);
    funcBody = funcBody.substring(0, funcBody.lastIndexOf('}')).trim();

    funcName = funcName || name;

    if (params[0] === '') {
        params = [];
    }
    if (useCoreAPI) {
        params.push('$component');
        params.push('$db');
        params.push('$metamodel');
        params.push('$workflow');
        params.push('$behavior');
        params.push('$state');
        params.push('$log');
    }

    if (params[0] !== '') {
        /* jshint -W054 */
        action = new Function("body", "return function " + funcName + " (" + params.join(',') + ") { return new Function('" + params.join("','") + "', body).apply(this, arguments) };")(funcBody);
        /* jshint +W054 */
    } else {
        /* jshint -W054 */
        action = new Function("body", "return function " + funcName + " () { return new Function(body).apply(this, arguments) };")(funcBody);
        /* jshint +W054 */
    }

    return action;
}


/* Public methods */


/*
 * Add a behavior that will be stored in Runtime database.
 * @method add
 * @param {String} id id of the component
 * @param {Object} state the state on which the action will be executed 
 * @param {Object} action the action to execute when the component will have a specific state 
 * @param {Boolean} useCoreAPI if true, Runtime core modules will be injected as parameters of the action (default false)
 * @param {Boolean} core if true, behavior can not be exported
 * @return {String} id of the behavior created in Runtime database
 */
function add(id, state, action, useCoreAPI, core) {
    var behaviorId = $helper.generateId(),
        strAction = action.toString();

    if (typeof core === 'undefined') {
        core = false;
    }
    if (typeof useCoreAPI === 'undefined') {
        useCoreAPI = false;
    }

    action = createFunction(state, strAction, core, useCoreAPI);

    store[behaviorId] = action;

    $db.RuntimeBehavior.insert({
        "_id": behaviorId,
        "component": id,
        "state": state,
        "action": strAction,
        "useCoreAPI": useCoreAPI,
        "core": core
    });

    return behaviorId;
}


/*
 * Remove a behavior with its id or remove all the behaviors for a specific state
 * of the component.
 * @method remove
 * @param {Object} params <br>
 * {String} componentId id of the component <br>
 * {String} state state of the component <br>
 * {String} behaviorId id of the behavior (optional)) <br>
 */
function remove(params) {
    var result = [];

    params = params || {};
    params.behaviorId = params.behaviorId || '';
    params.componentId = params.componentId || '';
    params.state = params.state || '';

    if (params.componentId) {
        if (params.behaviorId) {
            $db.RuntimeBehavior.remove({
                "_id": params.behaviorId,
                "component": params.componentId,
                "state": params.state
            });
            delete store[params.behaviorId];
        } else {
            if (params.state) {
                result = $db.RuntimeBehavior.remove({
                    "component": params.componentId,
                    "state": params.state
                });
            } else {
                result = $db.RuntimeBehavior.remove({
                    "component": params.componentId
                });
            }
            result.forEach(function (id) {
                delete store[id];
            });
        }
    }
}


/*
 * Remove a behavior with its id from the memory.
 * @method removeFromMemory
 * @param {String} id id of the component
 */
function removeFromMemory(id) {
    delete store[id];
}


/*
 * Get all the actions of a behavior for a component.
 * @method getActions
 * @param {String} id id of the component
 * @param {String} state name of the state
 * @return {Array} all the actions that have to be executed for a specific component and state
 */
function getActions(id, state) {
    var result = [],
        dbResult = [],
        action = null;

    dbResult = $db.RuntimeBehavior.find({
        "component": id,
        "state": state
    });

    dbResult.forEach(function (behavior) {
        action = store[behavior._id];
        if (typeof action === 'undefined') {
            action = createFunction(behavior.state, behavior.action, behavior.core, behavior.useCoreAPI);
            store[behavior._id] = action;
        }
        result.push({
            "useCoreAPI": behavior.useCoreAPI,
            "action": action
        });
    });

    return result;
}


/*
 * Remove all the behaviors stored in memory.
 * @method clear
 */
function clear() {
    store = {};
}


/*
 * Get a behavior by its id.
 * @method get
 * @param {String} id id of the behavior
 * @return {Behavior} the behavior
 */
function get(id) {
    return store[id];
}


/* exports */


/**
 * This module manages the behaviors of all components. A behavior is a mecanism that allow users to add action that will be executed 
 * when a specific state of a component will change.
 * 
 * @module runtime
 * @submodule runtime-behavior
 * @requires runtime-db
 * @requires runtime-helper
 * @requires runtime-channel
 * @class runtime-behavior
 * @static
 */


/**
 * Add a behavior that will be stored in Runtime database.
 * @method add
 * @param {String} id id of the component
 * @param {Object} state the state on which the action will be executed 
 * @param {Object} action the action to execute when the component will have a specific state 
 * @param {Boolean} useCoreAPI if true, Runtime core modules will be injected as parameters of the action (default false)
 * @param {Boolean} core if true, behavior can not be exported
 * @return {String} id of the behavior created in Runtime database
 */
exports.add = add;


/**
 * Get a behavior by its id.
 * @method get
 * @param {String} id id of the behavior
 * @return {Behavior} the behavior
 */
exports.get = get;


/**
 * Remove a behavior with its id or remove all the behaviors for a specific state
 * of the component.
 * @method remove
 * @param {Object} params <br>
 * {String} componentId id of the component <br>
 * {String} state state of the component <br>
 * {String} behaviorId id of the behavior (optional)) <br>
 */
exports.remove = remove;


/**
 * Get all the actions of a behavior for a component.
 * @method getActions
 * @param {String} id id of the component
 * @param {String} state name of the state
 * @return {Array} all the actions that have to be executed for a specific component and state
 */
exports.getActions = getActions;


/**
 * Remove all the behaviors stored in memory.
 * @method clear
 */
exports.clear = clear;


/**
 * Remove a behavior with its id from the memory.
 * @method removeFromMemory
 * @param {String} id id of the component
 */
exports.removeFromMemory = removeFromMemory;
},{"./db.js":4,"./helper.js":5}],3:[function(require,module,exports){
/*
 * System Runtime
 * 
 * https://designfirst.io/systemruntime/
 * 
 * Copyright 2017 Erwan Carriou
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This module manages the components. 
 * It is the factory of all the components that are created by Runtime.
 * 
 * @module runtime
 * @submodule runtime-component
 * @requires runtime-workflow
 * @requires runtime-db
 * @requires runtime-metamodel
 * @requires runtime-behavior
 * @requires runtime-helper
 * @requires runtime-log
 * @class runtime-component
 * @static 
 */

'use strict';

var $workflow = require('./workflow.js');
var $db = require('./db.js');
var $metamodel = require('./metamodel.js');
var $behavior = require('./behavior.js');
var $helper = require('./helper.js');
var $log = require('./log.js');
var $worklow = require('./workflow.js');
var $state = require('./state.js');


/* Private properties */


var PROPERTY_TYPE = 'property',
    LINK_TYPE = 'link',
    COLLECTION_TYPE = 'collection',
    METHOD_TYPE = 'method',
    EVENT_TYPE = 'event',
    NAME = '_name',
    store = {};


/* Private methods */


/*
 * Sub class to override push and pop method of Array Class.
 * @class RuntimeArray
 * @param {Object} conf
 * {String} classId name of the class
 * {String} type type of the array
 * {Array} arr array
 * @private
 */
function RuntimeArray(conf) {
    var arr = [],
        arrDb = [],
        type = '',
        id = '',
        classId = '',
        propertyName = '',
        isReadOnly = false;

    conf = conf || {};
    type = conf.type || '';
    id = conf.id || '';
    propertyName = conf.propertyName || '';
    arrDb = conf.arr || [];
    classId = conf.classId || '';

    if (typeof conf.readOnly !== 'undefined') {
        isReadOnly = conf.readOnly;
    }

    // init
    arrDb.forEach(function (val) {
        if (type.indexOf('@') !== -1) {
            arr.push($helper.getRuntime().require(val));
        } else {
            arr.push(val);
        }
    });

    function _add(val, action, start, deleteCount) {
        var isClass = false,
            i = 0,
            length = 0,
            del = [];

        if (!isReadOnly) {

            isClass = type.indexOf('@') !== -1;

            if (isClass) {
                if (val && $metamodel.inheritFrom(val.constructor.name, type.replace('@', ''))) {
                    switch (true) {
                        case action === 'push':
                            arrDb.push(val.id());
                            break;
                        case action === 'unshift':
                            arrDb.unshift(val.id());
                            break;
                        case action === 'splice':
                            del = arrDb.splice(start, deleteCount, val);

                            length = del.length;
                            for (i = 0; i < length; i++) {
                                $workflow.state({
                                    "component": id,
                                    "state": propertyName,
                                    "data": [del[i], 'remove']
                                });
                            }
                            break;
                        default:
                            break;
                    }

                    if ($helper.isRuntime()) {
                        $helper.getRuntime().require('db').update({
                            'collection': classId,
                            'id': id,
                            'field': propertyName,
                            'value': arrDb
                        });
                    }

                    $workflow.state({
                        "component": id,
                        "state": propertyName,
                        "data": [val.id(), 'add']
                    });
                } else {
                    if (typeof val.id !== 'undefined') {
                        $log.invalidPropertyName(id, classId, propertyName, val.id(), type);
                    } else {
                        $log.invalidPropertyName(id, classId, propertyName, val, type);
                    }
                }
            } else {
                if (val && $metamodel.isValidType(val, type)) {
                    switch (true) {
                        case action === 'push':
                            arrDb.push(val);
                            break;
                        case action === 'unshift':
                            arrDb.unshift(val);
                            break;
                        case action === 'splice':
                            arrDb.splice(start, deleteCount, val);
                            break;
                        default:
                            break;
                    }

                    if ($helper.isRuntime()) {
                        $helper.getRuntime().require('db').update({
                            'collection': classId,
                            'id': id,
                            'field': propertyName,
                            'value': arrDb
                        });
                    }

                    $workflow.state({
                        "component": id,
                        "state": propertyName,
                        "data": [val, 'add']
                    });
                } else {
                    $log.invalidPropertyName(id, classId, propertyName, val, type);
                }
            }
        } else {
            $log.readOnlyProperty(id, classId, propertyName);
        }
        return arrDb.length;
    }

    function _remove(action) {
        var result,
            val = null,
            isClass = false;

        if (!isReadOnly) {
            if (arrDb.length !== 0) {

                switch (true) {
                    case action === 'pop':
                        val = arrDb.pop();
                        break;
                    case action === 'shift':
                        val = arrDb.shift();
                        break;
                    default:
                        break;
                }

                if ($helper.isRuntime()) {
                    $helper.getRuntime().require('db').update({
                        'collection': classId,
                        'id': id,
                        'field': propertyName,
                        'value': arrDb
                    });
                }

                $workflow.state({
                    "component": id,
                    "state": propertyName,
                    "data": [val, 'remove']
                });

                isClass = type.indexOf('@') !== -1;

                if (isClass) {
                    result = store[val];
                } else {
                    result = val;
                }
            }
        } else {
            $log.readOnlyProperty(id, classId, propertyName);
        }
        return result;
    }

    /* Override push method.
     * @push
     * @param {RuntimeComponent|Object} val
     */
    arr.push = function push(val) {
        return _add(val, 'push');
    };

    /* Override unshift method.
     * @unshift
     * @param {RuntimeComponent|Object} val
     */
    arr.unshift = function unshift(val) {
        return _add(val, 'unshift');
    };

    /* Override concat method.
     * @push
     * @param {RuntimeComponent|Object} arr
     */
    arr.concat = function concat(arr) {
        var i = 0,
            length = 0;

        if (Array.isArray(arr)) {
            length = arr.length;
            for (i = 0; i < length; i++) {
                _add(arr[i], 'push');
            }
        }

        conf.arr = arrDb;
        return new RuntimeArray(conf);
    };

    /* Override pop method.
     * @pop
     * @return {RuntimeComponent|Object} value
     */
    arr.pop = function pop() {
        return _remove('pop');
    };

    /* Override shift method.
     * @shift
     * @return {RuntimeComponent|Object} value
     */
    arr.shift = function shift() {
        return _remove('shift');
    };

    /* Override sort method.
     * @sort
     * @param {Function} funct the sort function
     * @return {RuntimeArray} the current RuntimeArray
     */
    arr.sort = function sort(funct) {
        arrDb.sort(funct);

        if ($helper.isRuntime()) {
            $helper.getRuntime().require('db').update({
                'collection': classId,
                'id': id,
                'field': propertyName,
                'value': arrDb
            });
        }

        return arr;
    };

    /* Override reverse method.
     * @reverse
     * @return {RuntimeArray} the reversed RuntimeArray
     */
    arr.reverse = function reverse() {
        arrDb.reverse();

        if ($helper.isRuntime()) {
            $helper.getRuntime().require('db').update({
                'collection': classId,
                'id': id,
                'field': propertyName,
                'value': arrDb
            });
        }
        return arr;
    };

    /* Override splice method.
     * @splice
     * @return {RuntimeArray} the spliced RuntimeArray
     */
    arr.splice = function splice(start, deleteCount, val) {
        var result = [],
            i = 0,
            length = 0;

        if (typeof val !== 'undefined') {
            _add(val, 'splice', start, deleteCount);
        } else {
            result = arrDb.splice(start, deleteCount);

            if ($helper.isRuntime()) {
                $helper.getRuntime().require('db').update({
                    'collection': classId,
                    'id': id,
                    'field': propertyName,
                    'value': arrDb
                });
            }

            length = result.length;
            for (i = 0; i < length; i++) {
                $workflow.state({
                    "component": id,
                    "state": propertyName,
                    "data": [result[i], 'remove']
                });
            }
        }
        return result;
    };

    /* Override slice method.
     * @slice
     * @return {RuntimeArray} the sliced RuntimeArray
     */
    arr.slice = function slice(begin, end) {
        var result = arrDb.slice(begin, end);
        return result;
    };

    return arr;
}

/* jshint -W058 */
RuntimeArray.prototype = new Array;
/* jshint +W058 */


/*
 * Get all the names of method parameters.
 * @method getParamNames
 * @param {String} id id of the class
 * @param {String} methodName name of the method
 * @return {Array} all the names of method parameters of the class
 * @private
 */
function getParamNames(id, methodName) {
    var params = [],
        result = [],
        length = 0,
        i = 0;

    params = $metamodel.getModel(id)[methodName].params;
    if (params) {
        length = params.length;
        for (i = 0; i < length; i++) {
            result.push(params[i].name);
        }
    }
    return result;
}


/*
 * Get all the property of a class.
 * @method getProperties
 * @param {String} id id of the class
 * @return {Array} all the properties of the class
 * @private
 */
function getProperties(id) {
    var model = null,
        schema = null,
        propNames = [],
        length = 0,
        i = 0,
        result = [];

    model = $metamodel.getModel(id);
    schema = $metamodel.getSchema(model[NAME]);

    propNames = Object.keys(schema);

    length = propNames.length;
    for (i = 0; i < length; i++) {
        if (schema[propNames[i]] === LINK_TYPE || schema[propNames[i]] === PROPERTY_TYPE || schema[propNames[i]] === COLLECTION_TYPE) {
            result.push({
                "name": propNames[i],
                "type": model[propNames[i]].type,
                "readOnly": model[propNames[i]].readOnly
            });
        }
    }

    return result;
}


/*
 * Get all the method of a class.
 * @method getMethods
 * @param {String} id id of the class
 * @return {Array} all the methods of the class
 * @private
 */
function getMethods(id) {
    var model = null,
        schema = null,
        propNames = [],
        length = 0,
        i = 0,
        result = [];

    model = $metamodel.getModel(id);
    schema = $metamodel.getSchema(model[NAME]);

    propNames = Object.keys(schema);

    length = propNames.length;
    for (i = 0; i < length; i++) {
        if (schema[propNames[i]] === METHOD_TYPE) {
            result.push(propNames[i]);
        }
    }

    return result;
}


/*
 * Get the schema of a structure.
 * @method getStructureProperties
 * @param {String} name of the property
 * @param {String} name of the model
 * @return {Array} list of property schema of the structure type
 * @private
 */
function getStructureProperties(propertyName, model) {
    var modelDef = null,
        type = null,
        structure = null,
        result = [],
        propNames = [];

    modelDef = $metamodel.getModel(model);
    type = modelDef[propertyName].type;
    structure = $metamodel.getType(type);

    if (structure.schema) {
        propNames = Object.keys(structure.schema);
        propNames.forEach(function (name) {
            structure.schema[name].name = name;
            result.push(structure.schema[name]);
        });
    }

    return result;
}


/*
 * Get all the event of a class.
 * @method getEvents
 * @param {String} id id of the class
 * @return {Array} all the events of the class
 * @private
 */
function getEvents(id) {
    var model = null,
        schema = null,
        propNames = [],
        length = 0,
        i = 0,
        result = [];

    model = $metamodel.getModel(id);
    schema = $metamodel.getSchema(model[NAME]);

    propNames = Object.keys(schema);

    length = propNames.length;
    for (i = 0; i < length; i++) {
        if (schema[propNames[i]] === EVENT_TYPE) {
            result.push(propNames[i]);
        }
    }

    return result;
}

/*
 * Get the value of a structure.
 * @method getStructureValue
 * @param {String} model name of the model
 * @param {String} id name of the component
 * @param {String} path 
 * @return {Object} the value
 * @private
 */
function getStructureValue(model, id, path) {
    var result = null,
        doc = $db.store[model][id],
        subPath = path.split('.'),
        length = subPath.length,
        i = 0;

    result = doc;

    for (i = 0; i < length; i++) {
        result = result[subPath[i]];
    }
    return result;
}


/*
 * Set the value of a structure.
 * @method getStructureValue
 * @param {String} model name of the model
 * @param {String} id name of the component
 * @param {String} path 
 * @param {String} value the value to set 
 * @private
 */
function setStructureValue(model, id, path, value) {
    var result = null,
        doc = $db.store[model][id],
        subPath = path.split('.'),
        length = subPath.length,
        i = 0;

    result = doc;

    for (i = 0; i < length - 1; i++) {
        result = result[subPath[i]];
    }
    result[subPath[i]] = value;
}


/*
 * Create a new class from a class definition.
 * @method createClasss
 * @param {String} classId name of the class
 * @return {Function} the class
 * @private
 */
function createClass(classId) {
    var body = function (config) {
        config = config || {};
        var body = {};

        if (config.constructor.name !== 'Object') {
            $log.invalidConctructorParameters(config, classId);
            config = {};
        }

        if (!$metamodel.isValidObject(config, $metamodel.getModel(classId), true, true)) {
            $log.invalidParameters(classId);
        }

        $metamodel.prepareObject(config, $metamodel.getModel(classId));

        if (typeof config._id === 'undefined') {
            config._id = $helper.generateId();
        }

        store[config._id] = this;

        // id
        body = function () {
            return config._id;
        };
        /* jshint -W054 */
        this.id = new Function("body", "return function id () { return body.call(this) };")(body);
        /* jshint +W054 */

        // classInfo
        if ($metamodel.inheritFrom(classId, 'RuntimeComponent')) {
            config.classInfo = classId + 'Info';
        }

        // create link to db
        $db.store[classId][config._id] = config;

        $db.createLog('insert', classId, config._id, '', config);

        if ($helper.isRuntime() && $helper.getRuntime().require('db')) {
            $helper.getRuntime().require('db').insert({
                collection: classId,
                document: config
            });
        }

        Object.freeze(this);

        if (this.init) {
            this.init(config);
        }
    };
    /* jshint -W054 */
    return new Function("body", "return function " + classId + " (config) { body.call(this,config) };")(body);
    /* jshint +W054 */
}


/*
 * Add an id method to a class that will return its id.
 * @method addId
 * @param {Function} Class a class
 * @param {String} classId name of the class
 * @private
 */
function addId(Class, classId) {
    var body = function () {
        return classId;
    };
    /* jshint -W054 */
    Class.id = new Function("body", "return function id (prop, val) { return body.call(this, prop, val) };")(body);
    /* jshint +W054 */
}


/*
 * Add properties to a component. All these properties will be accessed by a method with the same name.
 * Some checks can be done in order to see if the set of properties is compliant with the model.
 * @example
 * laure.age(); // get the age of a person
 * laure.age(22); // set the age of a person
 * @method addProperties
 * @param {String} model model name
 * @param {Function} Class Class
 * @param {String} classId name of the class
 * @private
 */
function addProperties(model, Class, classId) {
    var properties = getProperties(model);

    properties.forEach(function property(prop) {
        var body = {},
            propertyName = '',
            propertyType = '',
            propertyReadOnly = '';

        propertyName = prop.name;
        propertyType = prop.type;
        propertyReadOnly = prop.readOnly;

        function _isValidCollection(coll, type) {
            var result = true;

            coll.forEach(function (val) {
                if (
                    !(
                        $metamodel.isValidType(val, type) &&
                        ($metamodel.inheritFrom(val.constructor.name, type.replace('@', '')) && (type.indexOf('@') !== -1)))
                ) {
                    result = result && false;
                }
            });

            return true;
        }

        function _getRealCollection(coll, type) {
            var result = [];

            coll.forEach(function (val) {
                if (type[0].indexOf('@') !== -1) {
                    switch (true) {
                        case typeof val === 'string':
                            result.push(val);
                            break;
                        case typeof val.id !== 'undefined':
                            result.push(val.id());
                            break;
                        default:
                            result.push(null);
                            break;
                    }
                } else {
                    result.push(val);
                }
            });

            return result;
        }

        if (Array.isArray(propertyType)) { // in case of array, return a sub array
            body = function body(position, value) {
                var search = [],
                    component = null,
                    runtimeArr = null,
                    val = null,
                    realVal = null,
                    i = 0,
                    length = 0;

                if (typeof value === 'undefined') {
                    if (typeof position === 'undefined') {

                        runtimeArr = new RuntimeArray({
                            "id": this.id(),
                            "propertyName": propertyName,
                            "readOnly": propertyReadOnly,
                            "classId": classId,
                            "type": propertyType[0],
                            "arr": $db.store[classId][this.id()][propertyName]
                        });

                        return runtimeArr;
                    } else {
                        if (Array.isArray(position)) { // we replace the collection
                            if (_isValidCollection(position, propertyType[0])) {
                                search = $db[classId].find({
                                    "_id": this.id()
                                });
                                if (search.length) {

                                    component = search[0];
                                    realVal = _getRealCollection(position, propertyType[0]);

                                    $workflow.state({
                                        "component": this.id(),
                                        "state": propertyName,
                                        "data": [realVal, 'reset']
                                    });

                                    component[propertyName] = realVal;

                                    if ($helper.isRuntime()) {
                                        $helper.getRuntime().require('db').update({
                                            'collection': classId,
                                            'id': this.id(),
                                            'field': propertyName,
                                            'value': component[propertyName]
                                        });
                                    }
                                }
                            } else {
                                $log.invalidPropertyName(this.id(), this.constructor.name, propertyName, position, propertyType);
                            }
                        } else {
                            if (typeof position === 'number') {
                                val = $db.store[classId][this.id()][propertyName][position];
                                if (val) {
                                    if (propertyType[0].indexOf('@') !== -1) {
                                        realVal = $helper.getRuntime().require(val);
                                    } else {
                                        realVal = val;
                                    }
                                    return realVal;
                                }
                            } else {
                                $log.invalidPropertyName(this.id(), this.constructor.name, propertyName, position, 'number');
                            }
                        }
                    }
                } else {
                    if (propertyReadOnly) {
                        $log.readOnlyProperty(this.id(), this.constructor.name, propertyName);
                    } else {
                        if (
                            $metamodel.isValidType(value, propertyType[0]) ||
                            ($metamodel.inheritFrom(value.constructor.name, propertyType[0].replace('@', '')) && (propertyType[0].indexOf('@') !== -1))
                        ) {
                            search = $db[classId].find({
                                "_id": this.id()
                            });
                            if (search.length) {

                                if (propertyType[0].indexOf('@') !== -1) {
                                    switch (true) {
                                        case typeof value === 'string':
                                            realVal = value;
                                            break;
                                        case typeof value.id !== 'undefined':
                                            realVal = value.id();
                                            break;
                                        default:
                                            realVal = '';
                                            break;
                                    }
                                } else {
                                    realVal = value;
                                }

                                component = search[0];
                                component[propertyName][position] = realVal;

                                if ($helper.isRuntime()) {
                                    $helper.getRuntime().require('db').update({
                                        'collection': classId,
                                        'id': this.id(),
                                        'field': propertyName,
                                        'value': component[propertyName]
                                    });
                                }

                                $workflow.state({
                                    "component": this.id(),
                                    "state": propertyName,
                                    "data": [realVal, 'add']
                                });
                            }
                        } else {
                            $log.invalidPropertyName(this.id(), this.constructor.name, propertyName, value, propertyType);
                        }
                    }
                }
            };
            /* jshint -W054 */
            Class.prototype[propertyName] = new Function("body", "return function " + propertyName + " (position,value) { return body.call(this, position, value) };")(body);
            /* jshint +W054 */
        } else {
            body = function body(value) {
                var search = [],
                    component = null,
                    propertyValue = null;

                if (typeof value === 'undefined') {
                    component = $db.store[classId][this.id()];
                    if (component) {
                        switch (true) {
                            case propertyType.indexOf('@') !== -1:
                                propertyValue = get(component[propertyName]);
                                break;
                            case propertyType === 'date':
                                propertyValue = new Date(component[propertyName]);
                                break;
                            case $metamodel.isStructure(propertyName, classId):
                                propertyValue = addStructure('', propertyName, model, this.id());
                                break;
                            default:
                                propertyValue = component[propertyName];
                                break;
                        }
                        return propertyValue;
                    } else {
                        $log.destroyedComponentCall(propertyName, this.id());
                    }
                } else {
                    if (propertyReadOnly) {
                        $log.readOnlyProperty(this.id(), this.constructor.name, propertyName);
                    } else {
                        if ($metamodel.isValidType(value, propertyType)) {
                            search = $db[classId].find({ "_id": this.id() });
                            if (search.length) {
                                component = search[0];

                                switch (true) {
                                    case propertyType.indexOf('@') !== -1:
                                        if (value === null) {
                                            component[propertyName] = value;
                                        } else {
                                            component[propertyName] = value.id();
                                        }
                                        break;
                                    case propertyType === 'date':
                                        if (typeof value === 'string') {
                                            component[propertyName] = value;
                                        } else {
                                            component[propertyName] = value.toISOString();
                                        }
                                        break;
                                    default:
                                        component[propertyName] = value;
                                        break;
                                }

                                if ($helper.isRuntime() && $helper.getRuntime().require('db')) {
                                    $helper.getRuntime().require('db').update({
                                        'collection': classId,
                                        'id': this.id(),
                                        'field': propertyName,
                                        'value': value
                                    });
                                }

                                // case of RuntimeBehavior
                                if (classId === 'RuntimeBehavior') {
                                    $behavior.removeFromMemory(this.id());
                                }

                                $workflow.state({
                                    "component": this.id(),
                                    "state": propertyName,
                                    "data": [value]
                                });
                            }
                        } else {
                            $log.invalidPropertyName(this.id(), this.constructor.name, propertyName, value, propertyType);
                        }
                    }
                }
            };
            /* jshint -W054 */
            Class.prototype[propertyName] = new Function("body", "return function " + propertyName + " (value) { return body.call(this,value) };")(body);
            /* jshint +W054 */
        }
    });
}


/*
 * Add structure properties to a component. All these properties will be accessed by a method with the same name.
 * Some checks can be done in order to see if the set of properties is compliant with the model.
 * @method addStructure
 * @param {String} path parent path
 * @param {String} name property name
 * @param {String} model model name
 * @param {String} id id of the component
 * @return {Object} object that cointains methods to access the structure 
 * @private
 */
function addStructure(path, name, model, id) {
    var properties = getStructureProperties(name, model),
        sructure = {};

    properties.forEach(function property(prop) {
        var body = {},
            propertyName = '',
            propertyType = '',
            propertyReadOnly = '';

        propertyName = prop.name;
        propertyType = prop.type;
        propertyReadOnly = prop.readOnly;

        body = function body(value) {
            var search = [],
                component = null,
                propertyValue = null,
                parentPath = '',
                fullPath = '';

            if (path) {
                parentPath = parentPath + '.' + name;
            } else {
                parentPath = name;
            }
            fullPath = parentPath + '.' + propertyName;

            if (typeof value === 'undefined') {
                component = $db.store[model][id];
                if (component) {
                    switch (true) {
                        case propertyType.indexOf('@') !== -1:
                            propertyValue = get(getStructureValue(model, id, fullPath));
                            break;
                        case propertyType === 'date':
                            propertyValue = new Date(getStructureValue(model, id, fullPath));
                            break;
                        case $metamodel.isStructure(propertyName, model):
                            propertyValue = addStructure(parentPath, propertyName, model, id);
                            break;
                        default:
                            propertyValue = getStructureValue(model, id, fullPath);
                            break;
                    }
                    if (propertyValue === undefined && prop.default !== undefined) {
                        propertyValue = prop.default;
                    }
                    return propertyValue;
                } else {
                    $log.destroyedComponentCall(fullPath, id);
                }
            } else {
                if (propertyReadOnly) {
                    $log.readOnlyProperty(id, model, fullPath);
                } else {
                    if ($metamodel.isValidType(value, propertyType)) {
                        search = $db[model].find({ "_id": id });
                        if (search.length) {
                            component = search[0];

                            switch (true) {
                                case propertyType.indexOf('@') !== -1:
                                    setStructureValue(model, id, fullPath, value.id());
                                    break;
                                case propertyType === 'date':
                                    setStructureValue(model, id, fullPath, value.toISOString());
                                    break;
                                default:
                                    setStructureValue(model, id, fullPath, value);
                                    break;
                            }

                            if ($helper.isRuntime() && $helper.getRuntime().require('db')) {
                                $helper.getRuntime().require('db').update({
                                    'collection': model,
                                    'id': id,
                                    'field': fullPath,
                                    'value': value
                                });
                            }

                            // case of RuntimeBehavior
                            if (model === 'RuntimeBehavior') {
                                $behavior.removeFromMemory(id);
                            }

                            $workflow.state({
                                "component": id,
                                "state": fullPath,
                                "data": [value]
                            });
                        }
                    } else {
                        $log.invalidPropertyName(id, model, fullPath, value, propertyType);
                    }
                }
            }
        };

        /* jshint -W054 */
        sructure[propertyName] = new Function("body", "return function " + propertyName + " (value) { return body.call(this,value) };")(body);
        /* jshint +W054 */
    });

    return sructure;
}

/*
 * Add methods to a component.
 * The call to these methods will invoke the workflow in order to check that inpouts / outputs are compliant with the model.
 * @method addMethods
 * @param {String} model model name
 * @param {Function} Class Class
 * @param {String} classId name of the class
 * @private
 */
function addMethods(model, Class, classId) {
    var methods = getMethods(model);

    methods.forEach(function method(methodName) {
        var paramsName = getParamNames(classId, methodName),
            params = paramsName.join(','),
            body = function () {
                var result = null;

                result = $workflow.state({
                    "component": this.id(),
                    "state": methodName,
                    "data": arguments
                });

                return result;
            };
        if (params) {
            /* jshint -W054 */
            Class.prototype[methodName] = new Function("body", "return function " + methodName + " (" + params + ") { return body.call(this," + params + ") };")(body);
            /* jshint +W054 */
        } else {
            /* jshint -W054 */
            Class.prototype[methodName] = new Function("body", "return function " + methodName + " () { return body.call(this) };")(body);
            /* jshint +W054 */
        }
    });
}


/*
 * Add events to a component.
 * The call to these methods will invoke the workflow in order to check that inpouts are compliant with the model.
 * @method addEvents
 * @param {String} model model name
 * @param {Function} Class Class
 * @param {String} classId name of the class
 * @private
 */
function addEvents(model, Class, classId) {
    var events = getEvents(model);
    events.forEach(function event(methodName) {
        var paramsName = getParamNames(classId, methodName),
            params = paramsName.join(','),
            body = function () {
                var systems = [],
                    systemId = 'e89c617b6b15d24',
                    data = [],
                    i = 0,
                    length = -1,
                    message = {};

                if (classId === 'RuntimeChannel') {
                    systems = $db.RuntimeSystem.find({
                        'master': true
                    });
                    if (systems.length) {
                        systemId = systems[0]._id;
                    }

                    message.from = systemId;
                    length = arguments.length;
                    for (i = 0; i < length; i++) {
                        data.push(arguments[i]);
                    }
                    message.data = data;
                    message.event = methodName;

                    $db.RuntimeMessage.insert(message);

                    $workflow.state({
                        "component": this.id(),
                        "state": "send",
                        "data": [{
                            "event": message.event,
                            "from": message.from,
                            "data": message.data
                        }]
                    });
                } else {
                    $workflow.state({
                        "component": this.id(),
                        "state": methodName,
                        "data": arguments
                    });
                }
            };
        if (params) {
            /* jshint -W054 */
            Class.prototype[methodName] = new Function("body", "return function " + methodName + " (" + params + ") { return body.call(this," + params + ") };")(body);
            /* jshint +W054 */
        } else {
            /* jshint -W054 */
            Class.prototype[methodName] = new Function("body", "return function " + methodName + " () { return body.call(this) };")(body);
            /* jshint +W054 */
        }
    });
}


/*
 * Add a on method to a component to add behaviors to the component.
 * @method addOn
 * @param {Function} Class Class
 * @param {String} classId name of the class
 * @private
 */
function addOn(Class, classId) {
    var body = function (state, handler, useCoreAPI, isCore) {
        var behaviorId = '',
            currentState = '';

        if ($workflow.checkParams({
            "component": this,
            "methodName": "on",
            "args": arguments
        })) {
            if ($metamodel.isValidState(state, classId)) {
                if (
                    !$metamodel.isEvent(state, classId) &&
                    !$metamodel.isProperty(state, classId) &&
                    !$metamodel.isLink(state, classId) &&
                    !$metamodel.isCollection(state, classId) &&
                    $db.RuntimeBehavior.find({
                        "component": this.id(),
                        "state": state
                    }).length >= 1) {
                    $log.behaviorNotUnique(classId, state);
                } else {
                    if ($worklow.validParamNumbers(classId, state, handler)) {
                        behaviorId = $behavior.add(this.id(), state, handler, useCoreAPI, isCore);

                        currentState = $state.get(this.id());
                        if (currentState && state === currentState.name) {
                            $workflow.action(behaviorId, currentState.parameters.data);
                        }

                    } else {
                        $log.invalidParamNumberMethodOn(this.id(), this.constructor.name, state);
                    }
                }
            } else {
                $log.invalidStateOn(classId, state);
            }
        }
        return behaviorId;
    };
    /* jshint -W054 */
    Class.prototype.on = new Function("body", "return function on (state,handler,useCoreAPI,isCore) { return body.call(this,state,handler,useCoreAPI,isCore) };")(body);
    /* jshint +W054 */
}


/*
 * Add a on method to a class component to add behaviors to the class.
 * @method addOnClass
 * @param {Function} Class Class
 * @param {String} classId name of the class
 * @private
 */
function addOnClass(Class, classId) {
    var body = function (state, handler, useCoreAPI, isCore) {
        var behaviorId = '',
            currentState = '';

        if ($workflow.checkParams({
            "component": this,
            "methodName": "on",
            "args": arguments
        })) {
            if ($metamodel.isValidState(state, classId)) {
                if (
                    !$metamodel.isEvent(state, classId) &&
                    !$metamodel.isProperty(state, classId) &&
                    !$metamodel.isLink(state, classId) &&
                    !$metamodel.isCollection(state, classId) &&
                    $db.RuntimeBehavior.find({
                        "component": this.id(),
                        "state": state
                    }).length >= 1) {
                    $log.behaviorNotUnique(classId, state);
                } else {
                    if ($worklow.validParamNumbers(classId, state, handler)) {
                        behaviorId = $behavior.add(this.id(), state, handler, useCoreAPI, isCore);

                        currentState = $state.get(this.id());
                        if (currentState && state === currentState.name) {
                            $workflow.action(behaviorId, currentState.parameters.data);
                        }

                    } else {
                        $log.invalidParamNumberMethodOn(this.id(), this.constructor.name, state);
                    }
                }
            } else {
                $log.invalidStateOn(classId, state);
            }
        }
        return behaviorId;
    };
    /* jshint -W054 */
    Class.on = new Function("body", "return function on (state,handler,useCoreAPI,isCore) { return body.call(this, state, handler, useCoreAPI,isCore) };")(body);
    /* jshint -W054 */
}


/*
 * Add a off method to a class component to remove behaviors from the class.
 * @method addOffClass
 * @param {Object} Class Class
 * @param {String} classId name of the class
 * @private
 */
function addOffClass(Class, classId) {
    var body = function (state, behaviorId) {
        if ($workflow.checkParams({
            "component": this,
            "methodName": "off",
            "args": arguments
        })) {
            if ($metamodel.isValidState(state, classId)) {
                $behavior.remove({
                    "behaviorId": behaviorId,
                    "componentId": classId,
                    "state": state
                });
            } else {
                $log.InvalidStateOff(classId, state);
            }
        }
    };
    /* jshint -W054 */
    Class.off = new Function("body", "return function off (state, behaviorId) { return body.call(this, state, behaviorId) };")(body);
    /* jshint +W054 */
}


/*
 * Add a destroy method to a class component to detroy the class and all the components of the same class.
 * @method addDestroyClass
 * @param {Object} Class Class
 * @private
 */
function addDestroyClass(Class) {
    var body = function () {
        var id = this.id(),
            result = [],
            i = 0,
            length = 0;

        // if not virtual component
        if ($db[id]) {
            result = $db[id].remove();
        }

        delete store[id];

        // remove behaviors
        $behavior.remove({
            'componentId': id
        });

        length = result.length;
        for (i = 0; i < length; i++) {
            // remove behaviors
            $behavior.remove({
                'componentId': result[i]
            });
        }

        $workflow.state({
            "component": id,
            "state": "destroy"
        });
    };
    /* jshint -W054 */
    Class.destroy = new Function("body", "return function destroy () { return body.call(this) };")(body);
    /* jshint +W054 */
}


/*
 * Add the addClassInfo method on a class.
 * @method addClassInfoClass
 * @param {Object} Class Class
 * @private
 */
function addClassInfoClass(Class) {
    var body = function () {
        return get(this.id() + 'Info');
    };
    /* jshint -W054 */
    Class.classInfo = new Function("body", "return function classInfo () { return body.call(this) };")(body);
    /* jshint +W054 */
}


/*
 * Create a component from its configuration.
 * @method factory
 * @param {JSON} config configuration of the component
 * @return {Component} the created component
 * @private
 */
function factory(config) {
    config = config || {};

    var Class = {},
        classId = '';

    if (typeof config.model === 'undefined') {
        classId = $helper.generateId();
    } else {
        classId = config.model;
    }

    Class = createClass(classId);

    store[classId] = Class;

    addId(Class, classId);

    addProperties(config.model, Class, classId);
    addMethods(config.model, Class, classId);
    addEvents(config.model, Class, classId);

    // add default properties/methods only if the component
    // inherit from RuntimeComponent
    if ($metamodel.inheritFrom(classId, 'RuntimeComponent')) {
        addOn(Class, classId);
        addOnClass(Class, classId);
        addOffClass(Class, classId);
        addDestroyClass(Class);
        addClassInfoClass(Class);
    }

    Object.freeze(Class);

    return Class;
}


/* Public methods */


/*
 * Get a component by its id.
 * @method get
 * @param {String} id of the component
 * @return {Component} component
 */
function get(id) {
    return store[id];
}


/*
 * Create a component from its configuration.
 * @method create
 * @param {Object} config <br>
 * {String} model model name <br>
 * @return {Component}
 */
function create(config) {
    return factory(config);
}


/*
 * Destroy a component from its id.
 * @method destroy
 * @param {String} id id of the component to destroy
 */
function destroy(id) {
    var component = store[id],
        classId = '';

    if (component) {
        delete store[id];
        classId = component.constructor.name;
        $db[classId].remove({
            "_id": id
        });

        // remove behaviors
        $behavior.remove({
            'componentId': id
        });

        // case of Behavior
        if (classId === 'RuntimeBehavior') {
            $behavior.removeFromMemory(id);
        }
    }
}


/*
 * Remove a component with its id from the memory.
 * @method removeFromMemory
 * @param {String} id id of the component
 */
function removeFromMemory(id) {
    delete store[id];
}


/*
 * Remove all the components store in the memory.
 * @method clear
 */
function clear() {
    store = {};
}


/* exports */


/**
 * This module manages the components. 
 * It is the factory of all the components that are created by Runtime.
 * 
 * @module runtime
 * @submodule runtime-component
 * @requires runtime-workflow
 * @requires runtime-db
 * @requires runtime-metamodel
 * @requires runtime-behavior
 * @requires runtime-helper
 * @requires runtime-log
 * @class runtime-component
 * @static 
 */


/**
 * Create a component from its configuration.
 * @method create
 * @param {Object} config <br>
 * {String} model model name <br>
 * @return {Component} component
 */
exports.create = create;


/**
 * Get a component by its id.
 * @method get
 * @param {String} id id of the component
 * @return {Component} component
 */
exports.get = get;


/**
 * Remove a component with its id from the memory.
 * @method removeFromMemory
 * @param {String} id id of the component
 */
exports.removeFromMemory = removeFromMemory;


/**
 * Remove all the components store in memory.
 * @method clear
 */
exports.clear = clear;


/**
 * Destroy a component from its id.
 * @method destroy
 * @param {String} id id of the component to destroy
 * @return {Boolean} if the component has been destroyed
 */
exports.destroy = destroy;
},{"./behavior.js":2,"./db.js":4,"./helper.js":5,"./log.js":6,"./metamodel.js":7,"./state.js":9,"./workflow.js":10}],4:[function(require,module,exports){
/*
 * System Runtime
 * 
 * https://designfirst.io/systemruntime/
 * 
 * Copyright 2017 Erwan Carriou
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This module manages Runtime database. <br>
 * Runtime database is a micro NoSQL Database that contains: <br>
 * - collections to store documents (schemas, types, components, ...) and <br>
 * - APIs to import or export documents. <br>
 * 
 * Runtime Database is closely linked to Runtime metamodel and Runtime components because: <br>
 * - all operations done by Runtime database must be compliant with the model before being finished, <br>
 * - insert operation automatically creates a component and <br>
 * - remove operation automatically destroy a component.
 *  
 * @module runtime
 * @submodule runtime-db
 * @requires runtime-component
 * @requires runtime-helper
 * @requires runtime-log
 * @class runtime-db
 * @static
 */

'use strict';

var $component = require('./component.js');
var $metamodel = require('./metamodel.js');
var $helper = require('./helper.js');
var $log = require('./log.js');
var $behavior = require('./behavior.js');
var $state = require('./state.js');
var $workflow = require('./workflow.js');


/* Private properties */


var store = {},
    collections = [],
    internalDB = [
        'Runtime',
        'RuntimeSchema',
        'RuntimeModel',
        'RuntimeGeneratedModel',
        'RuntimeBehavior',
        'RuntimeState',
        'RuntimeType',
        'RuntimeMetamodel',
        'RuntimeDatabase',
        'RuntimeSystem',
        'RuntimeClassInfo',
        'RuntimeMessage',
        'RuntimeChannel',
        'RuntimeLogger',
        'RuntimeLog'
    ],
    coreDb = [
        'RuntimeLog',
        'RuntimeSchema',
        'RuntimeLogger',
        'RuntimeModel',
        'RuntimeGeneratedModel',
        'RuntimeState',
        'RuntimeType'
    ],
    logOrder = 0;


/* Private methods */


/*
 * Increment Log
 * @method incLogOrder
 */
function incLogOrder() {
    return logOrder++;
}


/*
 * Dump the database.
 * @method dump
 * @return {Object} the dump of the database. The dump is an object that contains: <br>
 * {Object} schemas the schemas store in the database <br>
 * {Object} types the types store in the database <br>
 * {Object} behaviors the behaviors store in the database <br>
 * {Object} components the components store in the database
 * @private
 */
function dump() {
    var dbDump = {},
        collectionName = '',
        behaviorId = '',
        typeId = '',
        type = null,
        behavior = null,
        schema = null,
        model = null,
        collection = null,
        schemaId = '',
        modelId = '',
        length = 0,
        i = 0,
        id = '';

    // schemas
    dbDump.schemas = {};
    if (exports.RuntimeSchema.count()) {
        for (schemaId in store.RuntimeSchema) {
            schema = JSON.parse(JSON.stringify(store.RuntimeSchema[schemaId]));
            if (!schema._core) {
                dbDump.schemas[schemaId] = schema;
            }
        }
    }

    // models
    dbDump.models = {};
    if (exports.RuntimeModel.count()) {
        for (modelId in store.RuntimeModel) {
            model = JSON.parse(JSON.stringify(store.RuntimeModel[modelId]));
            if (!model._core) {
                dbDump.models[modelId] = model;
            }
        }
    }

    // types
    dbDump.types = {};
    if (exports.RuntimeType.count()) {
        for (typeId in store.RuntimeType) {
            type = JSON.parse(JSON.stringify(store.RuntimeType[typeId]));
            if (!type.core) {
                dbDump.types[type.name] = type;
            }
        }
    }

    // behaviors
    dbDump.behaviors = {};
    for (behaviorId in store.RuntimeBehavior) {
        behavior = JSON.parse(JSON.stringify(store.RuntimeBehavior[behaviorId]));
        delete behavior.classInfo;

        if (!behavior.core) {
            dbDump.behaviors[behaviorId] = behavior;
        }
    }

    // components
    dbDump.components = {};
    length = collections.length;
    for (i = 0; i < length; i++) {
        collectionName = collections[i];
        if (exports[collectionName].count()) {
            collection = JSON.parse(JSON.stringify(store[collectionName]));

            for (id in collection) {
                delete collection[id].classInfo;

                if (collection[id]._core) {
                    delete collection[id];
                }
            }

            if (Object.keys(collection).length) {
                dbDump.components[collectionName] = collection;
            }
        }
    }

    return dbDump;
}


/*
 * Test if an object contains another one.
 * @method contains
 * @param {Object} source source object 
 * @param {Object} target target object 
 * @return {Boolean} true if the source object contains the target object
 * @private
 */
function contains(source, target) {
    var result = true,
        property = '';

    for (property in source) {
        if (typeof target[property] !== 'undefined') {
            if (source[property] instanceof RegExp) {
                if (target[property].match(source[property]) === null) {
                    result = false;
                    break;
                }
            } else {
                if (target[property] !== source[property]) {
                    result = false;
                    break;
                }
            }
        } else {
            result = false;
            break;
        }
    }
    return result;
}


/** 
 * A collection of documents managed by Runtime. <br>
 * Internal collections manage core objects of Runtime (schema, type, ...). <br>
 * Public collections manage components of the same class. <br>
 * 
 * @class RuntimeDatabaseCollection
 * @constructor
 * @param {String} name name of the new collection
 */
var RuntimeDatabaseCollection = function (name) {
    if ($metamodel.getSchema(name) || internalDB.indexOf(name) !== -1) {
        store[name] = {};
        this.name = name;
        if (internalDB.indexOf(name) === -1) {
            collections.push(name);
        }
    } else {
        $log.invalidCollectionName(name);
    }
};


/**
 * Find a document into the collection.
 * @method find
 * @param {Object|Array} query
 * @return {Array} Array of documents that map the query
 * 
 * @example 
 * $db.Person.find({"name": "laure"}); <br>
 * $db.Person.find({"name": "laure", "age" : 24}); <br>
 * $db.Person.find([{"name": "rene"}, {"name": "robert"}]);
 */
RuntimeDatabaseCollection.prototype.find = function (query) {
    var result = [],
        resultId = {},
        id = '',
        object = {};

    query = query || null;

    if (query && Object.keys(query).length) {
        if (Array.isArray(query)) {
            query.forEach(function multi_search(criteria) {
                for (id in store[this.name]) {
                    object = store[this.name][id];
                    if (contains(criteria, object)) {
                        if (typeof resultId[id] === 'undefined') {
                            result.push(object);
                            resultId[id] = true;
                        }
                    }
                }
            }.bind(this));
        } else {
            for (id in store[this.name]) {
                object = store[this.name][id];
                if (contains(query, object)) {
                    result.push(object);
                }
            }
        }
    } else {
        for (id in store[this.name]) {
            object = store[this.name][id];
            result.push(object);
        }
    }

    return result;
};


/**
 * Insert an new document into the collection. <br>
 * Before inserting the document, Runtime checks that the document is compliant
 * with its class definition. <br> 
 * Then, after inserting it, we create the component.
 * @method insert
 * @param {Object|Array} document a new object to add
 * @return {Array} array of id created
 * 
 * @example 
 * $db.Person.insert({<br>
 *      "name": "bob", <br>
 *      "firstName": "Saint-Clar", <br>
 *      "age": 43 <br>
 * }); <br>
 */
RuntimeDatabaseCollection.prototype.insert = function (document) {
    var doc = [],
        Component = null,
        result = [];

    if (Array.isArray(document)) {
        doc = document;
    } else {
        doc.push(document);
    }

    doc.forEach(function multi_insert(obj) {
        var component = null,
            channels = [],
            channel = null,
            systems = [];

        switch (true) {
            case this.name === 'RuntimeSchema':
            case this.name === 'RuntimeLogger':
            case this.name === 'RuntimeModel':
            case this.name === 'RuntimeType':
            case this.name === 'RuntimeGeneratedModel':
            case $metamodel.isValidObject(obj, $metamodel.getModel(this.name)):

                if (typeof obj._id === 'undefined') {
                    obj._id = $helper.generateId();
                }

                $metamodel.prepareObject(obj, $metamodel.getModel(this.name));

                store[this.name][obj._id] = obj;

                Component = $component.get(this.name);
                if (Component) {
                    component = new Component(obj);
                    result.push(component.id());
                } else {
                    createLog('insert', this.name, obj._id, '', obj);

                    if ($helper.isRuntime() && $helper.getRuntime().require('db')) {
                        $helper.getRuntime().require('db').insert({
                            collection: this.name,
                            document: obj
                        });
                    }
                }

                if (this.name === 'RuntimeMessage') {
                    if ($helper.isRuntime()) {
                        channels = exports.RuntimeChannel.find({});
                        var length = channels.length;
                        for (var i = 0; i < length; i++) {
                            channel = $helper.getRuntime().require(channels[i]._id);
                            $workflow.state({
                                "component": channels[i]._id,
                                "state": obj.event,
                                "data": obj.data
                            });
                        }
                    }
                }

                break;
            default:
                $log.invalidDocumentOnDbInsert(obj, this.name);
                break;
        }
    }.bind(this));

    return result;
};


/**
 * Update documents into a collection.
 * @method update
 * @param {Object|Array} query query to find the documents to update
 * @param {Object} update update to make
 * @param {Object} options 
 * {Boolean} upsert true if we create a document when no document is found by the query
 * @return {Number} Number of documents updated
 * 
 * @example 
 * $db.Cars.update({"code": "AZD-71"}, {"price": "10000$"}); <br>
 * $db.Cars.update([{"code": "AZD-71"}, {"code": "AZD-65"}], {"price": "10000$"}); <br>
 * $db.Cars.update({"code": "AZD-71"}, {"price": "10000$"}, {"upsert": true}); <br>
 */
RuntimeDatabaseCollection.prototype.update = function (query, update, options) {
    var docs = this.find(query),
        updated = 0,
        i = 0,
        length = docs.length,
        attributeName = '',
        schema = $metamodel.getModel(this.name),
        type = '';

    options = options || {};
    if (typeof options.upsert === 'undefined') {
        options.upsert = options.upsert || false;
    }

    if (update) {

        // upsert case
        if (length === 0 && options.upsert) {
            if (query._id) {
                update._id = query._id;
            }
            this.insert(update);
            updated = updated + 1;
        }

        for (i = 0; i < length; i++) {
            // case of update of _id
            if (typeof update._id !== 'undefined' && update._id !== docs[i]._id) {
                $log.updateUuid(docs[i]._id, update._id, typeof $component.get(update._id) !== 'undefined');
            }

            for (attributeName in update) {
                if (typeof docs[i][attributeName] !== 'undefined') {
                    if (this.name !== 'RuntimeSchema' && this.name !== 'RuntimeModel' && this.name !== 'RuntimeGeneratedModel') {
                        // check type
                        type = '';
                        if (attributeName.indexOf('_') !== 0) {
                            type = schema[attributeName].type;
                        } else {
                            if ($metamodel.getMetaDef()[attributeName]) {
                                type = $metamodel.getMetaDef()[attributeName].type;
                            }
                        }
                        if (type) {
                            if ($metamodel.isValidType(update[attributeName], type)) {
                                docs[i][attributeName] = update[attributeName];
                                updated = updated + 1;

                                createLog('update', this.name, docs[i]._id, attributeName, update[attributeName]);

                                if ($helper.isRuntime() && $helper.getRuntime().require('db')) {
                                    $helper.getRuntime().require('db').update({
                                        'collection': this.name,
                                        'id': docs[i]._id,
                                        'field': attributeName,
                                        'value': update[attributeName]
                                    });
                                }
                                $workflow.state({
                                    "component": docs[i]._id,
                                    "state": attributeName,
                                    "data": [update[attributeName]]
                                });
                            } else {
                                $log.invalidPropertyTypeOnDbUpdate(this.name, docs[i]._id, attributeName, update[attributeName], schema[attributeName].type);
                            }
                        } else {
                            $log.unknownPropertyOnDbUpdate(this.name, attributeName, docs[i]._id);
                        }
                    } else {
                        // TODO more check in case of schema update
                        docs[i][attributeName] = update[attributeName];

                        createLog('update', this.name, docs[i]._id, attributeName, update[attributeName]);

                        updated = updated + 1;
                        if ($helper.isRuntime() && $helper.getRuntime().require('db')) {
                            $helper.getRuntime().require('db').update({
                                'collection': this.name,
                                'id': docs[i]._id,
                                'field': attributeName,
                                'value': update[attributeName]
                            });
                        }
                    }
                }
            }
        }
    }

    return updated;
};


/**
 * Remove a document from the colllection. <br>
 * When a document is removed, the component is destroyed.
 * @method remove
 * @param {Object|Array} query query to find the documents to remove
 * @return {Array} list of documents id removed
 * 
 * @example 
 * $db.Cars.remove({"code": "AZD-71"}); <br>
 * $db.Cars.remove([{"code": "AZD-71"}, {"code": "AZD-65"}]); <br>
 */
RuntimeDatabaseCollection.prototype.remove = function (query) {
    var result = [],
        id = '',
        component = null,
        object = {};

    query = query || null;

    if (query && Object.keys(query).length) {

        if (Array.isArray(query)) {
            query.forEach(function multi_remove(criteria) {
                for (id in store[this.name]) {
                    object = store[this.name][id];

                    if (contains(criteria, object)) {
                        delete store[this.name][id];

                        createLog('remove', this.name, id, '', '');

                        component = $component.get(id);
                        if (component) {
                            component.destroy();
                        }
                        if ($helper.isRuntime() && $helper.getRuntime().require('db')) {
                            $helper.getRuntime().require('db').remove({
                                'collection': this.name,
                                'id': id
                            });
                        }
                        result.push(id);
                    }
                }
            }.bind(this));
        } else {
            for (id in store[this.name]) {
                object = store[this.name][id];

                if (contains(query, object)) {
                    delete store[this.name][id];

                    createLog('remove', this.name, id, '', '');

                    component = $component.get(id);
                    if (component) {
                        component.destroy();
                    }
                    if ($helper.isRuntime() && $helper.getRuntime().require('db')) {
                        $helper.getRuntime().require('db').remove({
                            'collection': this.name,
                            'id': id
                        });
                    }
                    result.push(id);
                }
            }
        }
    } else {
        for (id in store[this.name]) {
            delete store[this.name][id];

            createLog('remove', this.name, id, '', '');

            if (coreDb.indexOf(this.name) == -1) {
                component = $component.get(id);
                if (component) {
                    component.destroy();
                }
            }
            if ($helper.isRuntime() && $helper.getRuntime().require('db')) {
                $helper.getRuntime().require('db').remove({
                    'collection': this.name,
                    'id': id
                });
            }
            result.push(id);
        }
    }

    return result;
};


/**
 * Count the number of documents in the collection.
 * @method count
 * @return {Number} number of documents in the collection
 */
RuntimeDatabaseCollection.prototype.count = function () {
    var result = 0,
        objectId = '';
    for (objectId in store[this.name]) {
        result++;
    }
    return result;
};


/* Public methods */


/*
 * Create a Log
 * @method createLog
 * @param {String} action CRUD action that happenned
 * @param {String} collection collection of the 
 * @param {String} id id of the component
 * @param {String} field field of the component
 * @param {String} value value of the field of the component
 */
function createLog(action, collection, id, field, value) {
    var logId = $helper.generateId();

    collection = collection || '';
    id = id || '';
    field = field || '';
    value = value || '';

    // clean log every 1000 logs
    if (Object.keys(store.RuntimeLog).length > 1000) {
        store.RuntimeLog = {};
    }

    store.RuntimeLog[logId] = {
        _id: logId,
        action: action,
        collection: collection,
        id: id,
        field: field,
        value: value,
        order: incLogOrder()
    };
}


/*
 * Create a new {{#crossLink "RuntimeDatabaseCollection"}}{{/crossLink}}.
 * @method collection
 * @param {String} name of the collection
 */
function collection(name) {
    exports[name] = new RuntimeDatabaseCollection(name);
}


/*
 * Import/Export a Runtime system into/from the database
 * @method system
 * @param {JSON} importedSystem a Runtime system to import
 * @return {String} the id of the imported Runtime system or the if of the current Runtime system
 */
function system(importedSystem) {
    var result = '',
        collectionName = '',
        componentId = '',
        typeName = '',
        schemaName = '',
        modelName = '',
        behaviorId = '',
        systems = [],
        id = null,
        dbDump = null,
        mastersystem = null,
        behavior = null,
        exportedSystem = {};

    if (importedSystem) { // import

        // add types
        for (typeName in importedSystem.types) {
            $metamodel.type(importedSystem.types[typeName]);
        }

        // add schemas
        for (schemaName in importedSystem.schemas) {
            $metamodel.schema(importedSystem.schemas[schemaName]);
        }

        // add models
        for (modelName in importedSystem.models) {
            $metamodel.model(importedSystem.models[modelName]);
        }

        $metamodel.create();

        //add behaviors
        for (behaviorId in importedSystem.behaviors) {
            exports.RuntimeBehavior.insert(importedSystem.behaviors[behaviorId]);
        }

        // add components
        for (collectionName in importedSystem.components) {
            for (componentId in importedSystem.components[collectionName]) {
                exports[collectionName].insert(importedSystem.components[collectionName][componentId]);
            }
        }

        // reset info if already a master system
        systems = exports.RuntimeSystem.find({
            'master': true
        });
        if (systems.length) {
            if (systems[0]._id === importedSystem._id) {
                importedSystem.master = true;
            } else {
                importedSystem.master = true;
                systems[0].master = false;
            }
        }

        // insert the system in DB
        exports.RuntimeSystem.insert(importedSystem);

        result = importedSystem._id;

    } else { // export
        // get id of the master system
        systems = exports.RuntimeSystem.find({
            'master': true
        });

        if (systems.length) {

            mastersystem = systems[0];
            id = mastersystem._id;

            // prop
            exportedSystem._id = id;
            exportedSystem.name = mastersystem.name;
            exportedSystem.description = mastersystem.description;
            exportedSystem.version = mastersystem.version;
            exportedSystem.master = true;
            exportedSystem.subsystem = false;

            // dump
            dbDump = dump();
            for (collectionName in dbDump) {
                if (dbDump.hasOwnProperty(collectionName)) {
                    exportedSystem[collectionName] = dbDump[collectionName];
                }
            }

            for (behaviorId in exportedSystem.behaviors) {
                behavior = exportedSystem.behaviors[behaviorId];
                if (behavior.state === 'main' || behavior.state === 'start' || behavior.state === 'stop') {
                    behavior.component = id;
                }
            }

            result = JSON.stringify(exportedSystem);
        } else {
            result = "{}";
            $log.masterSystemNotFound();
        }
    }
    return result;
}


/*
 * Export a Runtime sub-system.
 * @method subsystem
 * @param {JSON} params parameters
 * @return {String} a stringified Runtime sub-system
 * 
 * @example
 * $db.subsystem({"schemas":{"name":"Person"}}); // filter export on schemas <br>
 * $db.subsystem({"types":{"name":"address"}}); // filter export on types <br>
 * $db.subsystem({"behaviors":{"component":"laure"}}); // filter export on behaviors <br>
 * $db.subsystem({"components":{"Person": {"country": "France"}}}); // filter export on components <br>
 * $db.subsystem({"schemas":{"name":"Person"},"components":{"Person": {"country": "France"}}}); // combine filters
 */
function subsystem(params) {
    var system = {},
        result = [],
        defaultName = '',
        i = 0,
        length = 0,
        schema = null,
        type = null,
        model = null,
        behavior = null,
        component = null,
        className = '';

    // default values
    result = exports.RuntimeSystem.find({
        'master': true
    });
    if (result.length) {
        defaultName = result[0].name;
    }

    system.name = params.name || 'sub_' + defaultName;
    system.version = params.version || '0.0.1';
    system.description = params.description || '';

    system.subsystem = true;

    // schemas
    system.schemas = {};
    if (params.schemas) {
        result = exports.RuntimeSchema.find(params.schema);

        length = result.length;
        for (i = 0; i < length; i++) {
            schema = result[i];
            if (!schema._core) {
                system.schemas[schema._id] = schema;
            }
        }
    }

    // models
    system.models = {};
    if (params.models) {
        result = exports.RuntimeModel.find(params.models);

        length = result.length;
        for (i = 0; i < length; i++) {
            model = result[i];
            if (!model._core) {
                system.models[model._id] = model;
            }
        }
    }

    // types
    system.types = {};
    if (params.types) {
        result = exports.RuntimeType.find(params.types);

        length = result.length;
        for (i = 0; i < length; i++) {
            type = result[i];
            if (!type._core) {
                system.types[type._id] = type;
            }
        }
    }

    // behaviors
    system.behaviors = {};
    if (params.behaviors) {
        behavior = exports.RuntimeBehavior.find(params.behaviors);

        length = result.length;
        for (i = 0; i < length; i++) {
            behavior = result[i];
            if (!behavior.core) {
                system.behaviors[behavior._id] = behavior;
            }
        }
    }

    // components
    system.components = {};
    if (params.components) {
        for (className in params.components) {
            if (exports[className]) {
                system.components[className] = {};

                result = exports[className].find(params.components[className]);
                length = result.length;
                for (i = 0; i < length; i++) {
                    component = result[i];
                    system.components[className][component._id] = component;
                }
            }
        }
    }

    return JSON.stringify(system);
}


/*
 * Clear the database.
 * @method clear
 */
function clear() {
    var length = 0,
        i = 0,
        collectionName = '';

    // remove collections
    length = collections.length;
    for (i = 0; i < length; i++) {
        collectionName = collections[i];
        exports[collectionName].remove();
    }

    // remove internal collections
    length = internalDB.length;
    for (i = 0; i < length; i++) {
        collectionName = internalDB[i];
        exports[collectionName].remove();
    }
}


/*
 * Init the database.
 * @method init
 */
function init() {
    var runtimeSystemId = '',
        runtimeSystem = null;

    runtimeSystem = exports.RuntimeSystem.find({
        '_id': 'e89c617b6b15d24'
    })[0];

    // clear all the data in memory
    exports.clear();
    $component.clear();
    $metamodel.clear();
    $state.clear();
    $behavior.clear();

    // init metamodel
    $metamodel.init();

    // reimport Runtime core system
    runtimeSystemId = exports.system(runtimeSystem);
    $component.get(runtimeSystemId).main();
}


/* exports */


/**
 * This module manages Runtime database. <br>
 * Runtime database is a micro NoSQL Database that contains: <br>
 * - collections to store documents (schemas, types, components, ...) and <br>
 * - APIs to import or export documents. <br>
 * 
 * Runtime database is closely linked to Runtime metamodel because: <br>
 * - all operations done by Runtime database must be compliant with the model before being finished, <br>
 * - insert operation automatically creates a component and <br>
 * - remove operation automatically destroy a component.
 *   
 * @module runtime
 * @submodule runtime-db
 * @requires runtime-component
 * @requires runtime-helper
 * @requires runtime-log
 * @class runtime-db
 * @static
 */


/**
 * Create a Log
 * @method createLog
 * @param {String} action CRUD action that happenned
 * @param {String} collection collection of the 
 * @param {String} id id of the component
 * @param {String} field field of the component
 * @param {String} value value of the field of the component
 */
exports.createLog = createLog;

/**
 * Create a new {{#crossLink "RuntimeDatabaseCollection"}}{{/crossLink}}.
 * @method collection
 * @param {String} name of the collection
 */
exports.collection = collection;


/**
 * Runtime database store that lists all the collections.
 * @property {JSON} store
 */
exports.store = store;


/**
 * Import/Export a Runtime system into/from the database.
 * @method system
 * @param {JSON} importedSystem a Runtime system to import
 * @return {String} the id of the imported Runtime system or the current Runtime system  
 */
exports.system = system;


/**
 * Export a Runtime sub-system.
 * @method subsystem
 * @param {JSON} params parameters
 * @return {String} a stringified Runtime sub-system
 * 
 * @example
 * $db.subsystem({"schemas":{"name":"Person"}}); // filter export on schemas <br>
 * $db.subsystem({"types":{"name":"address"}}); // filter export on types <br>
 * $db.subsystem({"behaviors":{"component":"laure"}}); // filter export on behaviors <br>
 * $db.subsystem({"components":{"Person": {"country": "France"}}}); // filter export on components <br>
 * $db.subsystem({"schemas":{"name":"Person"},"components":{"Person": {"country": "France"}}}); // combine filters
 */
exports.subsystem = subsystem;


/**
 * Clear the database.
 * @method clear
 */
exports.clear = clear;


/**
 * Init the database.
 * @method init
 */
exports.init = init;
},{"./behavior.js":2,"./component.js":3,"./helper.js":5,"./log.js":6,"./metamodel.js":7,"./state.js":9,"./workflow.js":10}],5:[function(require,module,exports){
/*
 * System Runtime
 * 
 * https://designfirst.io/systemruntime/
 * 
 * Copyright 2017 Erwan Carriou
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This module contains all the functions used by all the modules.
 * 
 * @module runtime
 * @submodule runtime-helper
 * @requires runtime-db
 * @requires runtime-component
 * @class runtime-helper
 * @static
 */


'use strict';

var $db = require('./db.js');
var $component = require('./component.js');


/* Private property */


var runtimeRef = null;


/* Public method */


/*
 * Check if a Runtime instance exists.
 * @method isRuntime
 * @return {Boolean} true if a Runtime instance exist
 */
function isRuntime() {
    var result = false;

    if ($db.Runtime && $db.Runtime.find().length) {
        result = true;
    }

    return result;
}


/*
 * Get the Runtime instance.
 * @method getRuntime
 * @return {Runtime} Runtime instance
 */
function getRuntime() {
    var runtimeId = '',
        result = null;

    if (!runtimeRef) {
        runtimeId = $db.Runtime.find()[0]._id;
        runtimeRef = $component.get(runtimeId);
    }

    return runtimeRef;
}


/*
 * Generate a uuid.
 * @method generateId
 * @return {String} a uuid
 */
function generateId() {
    function gen() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16);
    }
    function getPrefix() {
        var validPrefix = 'abcdefghijklmnopqrstuvwxyz';
        return validPrefix.charAt(Math.floor(Math.random() * validPrefix.length));
    }
    
    return getPrefix() + gen() + gen() + gen();
}


/*
 * Add Polyfill
 * @method polyfill
 */
function polyfill() {

    // fixing constructor.name property in IE
    // taken from http://stackoverflow.com/questions/25140723/constructor-name-is-undefined-in-internet-explorer
    if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
        Object.defineProperty(Function.prototype, 'name', {
            get: function() {
                var funcNameRegex = /function\s([^(]{1,})\(/;
                var results = (funcNameRegex).exec((this).toString());
                return (results && results.length > 1) ? results[1].trim() : "";
            },
            set: function(value) { }
        });
    }
}


/* exports */


/**
 * This module contains all the functions used by all the modules.
 * 
 * @module runtime
 * @submodule runtime-helper
 * @requires runtime-db
 * @requires runtime-component
 * @class runtime-helper
 * @static
 */


/**
 * Get Runtime instance.
 * @method getRuntime
 * @return {Runtime} Runtime instance
 */
exports.getRuntime = getRuntime;


/**
 * Check if a Runtime instance exists.
 * @method isRuntime
 * @return {Boolean} true if a Runtime instance exist
 */
exports.isRuntime = isRuntime;


/**
 * Generate a uuid.
 * @method generateId
 * @return {String} a uuid
 */
exports.generateId = generateId;


/**
 * Add Polyfill
 * @method polyfill
 */
exports.polyfill = polyfill;
},{"./component.js":3,"./db.js":4}],6:[function(require,module,exports){
/*
 * System Runtime
 * 
 * https://designfirst.io/systemruntime/
 * 
 * Copyright 2017 Erwan Carriou
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This module contains all the functions that write a log.
 * 
 * @module runtime
 * @submodule runtime-log
 * @requires runtime-helper
 * @class runtime-log
 * @static
 */

'use strict';


var $helper = require('./helper.js');
var $workflow = require('./workflow.js');
var $metamodel = require('./metamodel.js');
var $db = require('./db.js');
var $component = require('./component.js');

/* Private properties */


var ID = '_id',
    NAME = '_name',
    currentLevel = 'warn',
    loggerRef = null,
    fakeLoggerRef = {
        currentLevel: 'warn',
        level: function debug(levelName) {
            if (levelName) {
                this.currentLevel = levelName;
            }
            return this.currentLevel;
        },
        debug: function debug(message) {
            if (this.currentLevel === 'debug') {
                console.log('runtime: ' + message);
            }
        },
        info: function info(message) {
            if (this.currentLevel === 'info' || this.currentLevel === 'debug') {
                console.info('runtime: ' + message);
            }
        },
        warn: function warning(message) {
            if (this.currentLevel === 'info' || this.currentLevel === 'warn' || this.currentLevel === 'debug') {
                console.warn('runtime: ' + message);
            }
        },
        error: function error(message) {
            console.error('runtime: ' + message);
        }
    };

/*
 * Get the RuntimeLogger instance.
 * @method getLogger
 * @return {RuntimeLogger} RuntimeLogger instance
 * @private
 */
function getLogger() {
    var loggerId = '',
        loggers = [],
        result = null;

    if (!$metamodel.getModel('RuntimeLogger')) {
        result = fakeLoggerRef;
    } else {
        loggers = $db.RuntimeLogger.find();
        if (loggers.length) {
            loggerId = loggers[0][ID];

            if ($component.get(loggerId)) {
                loggerRef = $component.get(loggerId);
                result = loggerRef;
            } else {
                result = fakeLoggerRef;
            }
        } else {
            result = fakeLoggerRef;
        }
    }

    return result;
}


/* Public methods */


/*
 * Set the level of the log.
 * @method level
 * @param {String} levelName name of the level
 */
function level(levelName) {
    currentLevel = levelName;
}


/*
 * A property of a schema is unknown.
 * @method unknownProperty
 * @param {String} propertyName the name of the property
 * @param {Object} schema the schema definition
 */
function unknownProperty(propertyName, schema) {
    var message = '';

    if (schema[NAME]) {
        message = "unknown property '" + propertyName + "' for the definition of '" + schema[NAME] + "'";
    } else {
        message = "unknown property '" + propertyName + "' for a model";
    }

    getLogger().warn(message);
}


/*
 * Invalid type for a property.
 * @method invalidPropertyType
 * @param {String} propertyName name of the peropety
 * @param {String} type the type defined by the schema
 * @param {String} property the property
 */
function invalidPropertyType(propertyName, type, property) {
    getLogger().warn("invalid type for property '" + propertyName + "': expected type '" + type + "' instead of type '" + typeof property + "'");
}


/*
 * Invalid value for type enum.
 * @method invalidEnumValue
 * @param {Object} value the value
 * @param {String} type the type defined by the schema
 */
function invalidEnumValue(value, type) {
    getLogger().warn("'" + value + "' is an invalid value for the type enum '" + type + "'");
}


/*
 * Invalid class name for a component.
 * @method invalidClassName
 * @param {String} componentId id of the component
 * @param {String} type the type defined by the schema
 * @param {String} constructorName name of the component class
 */
function invalidClassName(componentId, type, constructorName) {
    getLogger().warn("invalid class name for component '" + componentId + "': expected '" + type + "' instead of '" + constructorName + "'");
}


/*
 * Missing a property.
 * @method missingProperty
 * @param {String} propertyName name of the property
 */
function missingProperty(propertyName) {
    getLogger().warn("missing property '" + propertyName + "'");
}


/*
 * A class definition is missing.
 * @method missingImplementation
 * @param {String} name name of the missing schema
 */
function missingImplementation(name) {
    getLogger().warn("schema '" + name + "' is missing.");
}


/*
 * Invalid type for a property of a class definition.
 * @method invalidTypeImp
 * @param {String} property a property
 * @param {String} className a class name
 */
function invalidTypeImp(property, className) {
    getLogger().error("the property '" + property + "' of the model '" + className + "' is invalid");
}


/*
 * Missing a property for a class definition.
 * @method missingPropertyImp
 * @param {String} property a property
 * @param {String} className a class name
 */
function missingPropertyImp(property, className) {
    getLogger().warn("missing property '" + property + "' for the definition of '" + className + "'");
}


/*
 * Unkown property for a class definition.
 * @method unknownPropertyImp
 * @param {String} property a property
 * @param {Object} schema a schema
 */
function unknownPropertyImp(property, schema) {
    getLogger().error("the model '" + schema + "' has an unknown property '" + property + "'");
}


/*
 * Try to add an invalid type.
 * @method invalidTypeDefinition
 * @param {String} name a type definition
 */
function invalidTypeDefinition(name) {
    getLogger().warn("the type '" + name + "' is not valid");
}


/*
 * Invalid property name.
 * @method invalidPropertyName
 * @param {String} id id of the component
 * @param {String} className class name of the component
 * @param {String} propertyName name of the property
 * @param {String} propertyValue value of the property
 * @param {String} type type defined by the schema
 */
function invalidPropertyName(id, className, propertyName, propertyValue, type) {
    var classInfo = '';

    if (className !== 'Function') {
        classInfo = " (class '" + className + "')";
    }

    if (typeof type === 'string') {
        getLogger().warn("invalid type for property '" + propertyName + "' on component '" + id + "'" + classInfo + ": expected '" + type.replace('@', '') + "' instead of '" + typeof propertyValue + "'");
    } else {
        getLogger().warn("invalid type for property type '" + propertyName + "' on component '" + classInfo + ": expected 'string' instead of '" + typeof type + "'");
    }
}


/*
 * Trying to set a read-only property.
 * @method readOnlyProperty
 * @param {String} id id of the component
 * @param {String} className class name of the component
 * @param {String} propertyName name of the property
 */
function readOnlyProperty(id, className, propertyName) {
    var classInfo = '';

    if (className !== 'Function') {
        classInfo = " (class '" + className + "')";
    }
    getLogger().warn("can not set read-only property '" + propertyName + "' on component '" + id + "'" + classInfo);
}


/*
 * Invalid document on a Runtime database insert operation.
 * @method invalidDocumentOnDbInsert
 * @param {String} doc a document
 * @param {String} collectionName the name of the colllection
 */
function invalidDocumentOnDbInsert(doc, collectionName) {
    getLogger().warn("invalid document '" + JSON.stringify(doc).replace(/,/g, ', ') + "' on an insert operation on collection '" + collectionName + "'");
}


/*
 * Invalid property on a Runtime database update operation.
 * @method invalidPropertyTypeOnDbUpdate
 * @param {String} collectionName the name of the colllection
 * @param {String} id id of the component
 * @param {String} propertyName name of the property
 * @param {String} propertyValue value of the property
 * @param {String} type expected type defined by the schema
 */
function invalidPropertyTypeOnDbUpdate(collectionName, id, propertyName, propertyValue, type) {
    getLogger().warn("invalid type when trying to update the property '" + propertyName + "' of document '" + id + "' (collection '" + collectionName + "') with the value '" + JSON.stringify(propertyValue) + "': expected type '" + type + "'");
}

/*
 * Unkonw property on a Runtime database update operation.
 * @method unknownPropertyOnDbUpdate
 * @param {String} collectionName the name of the colllection
 * @param {String} propertyName name of the property
 * @param {String} id id of the component
 */
function unknownPropertyOnDbUpdate(propertyName, collectionName, id) {
    getLogger().warn("unknown property '" + propertyName + "' on an update operation on collection '" + collectionName + "' with component '" + id + "'");
}


/*
 * Call an unknown method of a class.
 * @method unknownMethod
 * @param {String} classId id of the class
 * @param {String} methodName name of the method
 */
function unknownMethod(classId, methodName) {
    getLogger().warn("try to call an unknown method '" + methodName + "' for the class '" + classId + "'");
}


/*
 * Try to create an invalid RuntimeDatabaseCollection.
 * @method invalidCollectionName
 * @param {String} name name of the collection
 */
function invalidCollectionName(name) {
    getLogger().warn("invalid name for creating the collection '" + name + "': there is no schema '" + name + "' in the metamodel");
}


/*
 * Invalid type result of a method.
 * @method invalidResultType
 * @param {String} id id of the component
 * @param {String} className class name of the component
 * @param {String} methodName name ot the method
 * @param {String} expectedType expected type
 * @param {String} type current type
 */
function invalidResultType(id, className, methodName, expectedType, type) {
    var classInfo = '';

    if (className !== 'Function') {
        classInfo = " (class '" + className + "')";
    }

    if (type) {
        getLogger().warn("invalid type for the result of method '" + methodName + "' on component '" + id + "'" + classInfo + ": expected type '" + expectedType.replace('@', '') + "' instead of type '" + type + "'");
    } else {
        getLogger().warn("invalid type for the result of method '" + methodName + "' on component '" + id + "'" + classInfo + ": expected type '" + expectedType.replace('@', '') + "'");
    }
}


/*
 * Unknown class.
 * @method unknownComponent
 * @param {String} id id of the class
 * @param {String} componentId if of the component
 */
function unknownComponent(className, componentId) {
    getLogger().warn("unkown class component '" + className + "' for component '" + componentId + "'");
}


/*
 * The Runtime workflow has been restarted.
 * @method workflowRestarted
 */
function workflowRestarted() {
    getLogger().warn('runtime has been restarted');
}


/*
 * invalid parameter number for a method.
 * @method invalidParamNumber
 * @param {String} id id of the component
 * @param {String} className class name of the component
 * @param {String} methodName name of the component
 */
function invalidParamNumber(id, className, methodName) {
    var classInfo = '';

    if (className !== 'Function') {
        classInfo = " (class '" + className + "')";
    }

    getLogger().warn("invalid number of parameters when calling the method '" + methodName + "' on component '" + id + "'" + classInfo);
}


/*
 * Invalid type parameters for a method.
 * @method invalidParamType
 * @param {String} id id of the component
 * @param {String} className class name of the component
 * @param {String} methodName name of the component
 * @param {String} paramName name of the parameter
 * 
 */
function invalidParamType(id, className, methodName, paramName) {
    var classInfo = '';

    if (className !== 'Function') {
        classInfo = " (class '" + className + "')";
    }
    getLogger().warn("invalid type for the parameter '" + paramName + "' when calling the method '" + methodName + "' on component '" + id + "'" + classInfo);
}


/*
 * Add a more than one behavior to a state.
 * @method behaviorNotUnique
 * @param {String} id id of the class
 * @param {String} stateName name of the state
 */
function behaviorNotUnique(id, stateName) {
    getLogger().warn("try to add more than one behavior for the state '" + stateName + "' on class '" + id + "'");
}


/*
 * Can not add a behavior with an invalid state.
 * @method invalidStateOn
 * @param {String} id id of the class
 * @param {String} stateName name of the state
 */
function invalidStateOn(id, stateName) {
    getLogger().warn("try to add a behavior with an unkwown state '" + stateName + "' on class '" + id + "'");
}


/*
 * The call to a remove state of the behavior module is invalid.
 * @method invalidStateOff
 * @param {String} id id of the class
 * @param {String} stateName name of the state
 */
function invalidStateOff(id, stateName) {
    getLogger().warn("try to remove a behavior from an unkwown state '" + stateName + "' on class '" + id + "'");
}


/*
 * The master system is not found.
 * @method masterSystemNotFound
 */
function masterSystemNotFound() {
    getLogger().warn("can not export the database because no system was defined");
}


/*
 * Invalid type.
 * @method invalidType
 * @param {Object} value value of the type
 * @param {String} typeName expectec type defined by the schema
 */
function invalidType(value, typeName) {
    getLogger().warn("invalid type for value '" + JSON.stringify(value) + "': expected '" + typeName + "'");
}


/*
 * Unknown type.
 * @method unknownType
 * @param {String} value value
 */
function unknownType(value) {
    getLogger().warn("unknown type for value '" + JSON.stringify(value) + "'");
}


/*
 * A component has not been alreay created.
 * @method canNotYetValidate
 * @param {String} id id of the component
 * @param {String} className name of the class
 */
function canNotYetValidate(id, className) {
    getLogger().debug("can not yet validate if the component '" + id + "' is an instance of '" + className + "'");
}


/**
 * A message send by the channel is invalid
 * @method invalidChannelEvent
 * @param {String} message message send
 * @param {String} eventName name of the event
 * @param {String} type expected type
 */
function invalidChannelEvent(message, eventName, type) {
    getLogger().warn("invalid type for the message '" + JSON.stringify(message) + "': expected type '" + type + "' for event '" + eventName + "'");
}


/*
 * invalid parameter number for an action add with on method.
 * @method invalidParamNumberMethodOn
 * @param {String} id id of the component
 * @param {String} className class name of the component
 * @param {String} methodName name of the component
 */
function invalidParamNumberMethodOn(id, className, methodName) {
    var classInfo = '';

    if (className !== 'Function') {
        classInfo = " (class '" + className + "')";
    }
    getLogger().warn("invalid number of parameters when adding an action on method '" + methodName + "' on component '" + id + "'" + classInfo);
}


/*
 * Change the id of a component.
 * @method updateUuid
 * @param {String} currentId id of the component
 * @param {String} newId of the component
 * @param {Boolean} alreadyUsed newId already used
 */
function updateUuid(currentId, newId, alreadyUsed) {
    if (alreadyUsed) {
        getLogger().warn("try to update a component of id '" + currentId + "' with the new id '" + newId + "' that is already used");
    } else {
        getLogger().warn("try to update a component of id '" + currentId + "' with the new id '" + newId + "'");
    }
}


/*
 * Try to change the state of a component that has been destroyed.
 * @method invalidUseOfComponent
 * @param {String} id id of the component
 */
function invalidUseOfComponent(id) {
    getLogger().warn("try to change the state of the destroyed component '" + id + "'");
}


/*
 * Try to add an invalid schema.
 * @method invalidSchema
 * @param {String} name name of the schema
 */
function invalidSchema(name) {
    getLogger().warn("the schema '" + name + "' is not valid");
}


/*
 * Try to add an invalid model.
 * @method invalidModel
 * @param {String} name name of the model
 */
function invalidModel(name) {
    getLogger().warn("the model '" + name + "' is not valid");
}


/*
 * Invalid parameters set when creating an instance of a class.
 * @method invalidParameters
 * @param {String} classId class name of the component
 */
function invalidParameters(classId) {
    getLogger().warn("the parameters for creating a component of class '" + classId + "' are not compliant with the model");
}


/*
 * Try to get the property of a destroyed component.
 * @method destroyedComponentCall
 * @param {String} propertyName name of the property
 * @param {String} id id of the component
 */
function destroyedComponentCall(propertyName, id) {
    getLogger().warn("trying to get the property '" + propertyName + "' on the destroyed component '" + id + "'");
}


/*
 * Invalid parameter type  when creating an instance of a class.
 * @method invalidConctructorParameters
 * @param {String} object configuration
 * @param {String} name schema name
 */
function invalidConctructorParameters(object, name) {
    getLogger().warn("the constructor parameter '" + JSON.stringify(object).replace(/,/g, ', ') + "' for creating a component of class '" + name + "' is not an object");
}


/*
 * Get the information of an unkown model.
 * @method unknownModel
 * @param {String} classId id of the class
 */
function unknownModel(classId) {
    getLogger().warn("try get the information of an unknown model '" + classId + "'");
}


/*
 * A schema is missing.
 * @method missingSchema
 * @param {String} name name of the schema
 */
function missingSchema(name) {
    getLogger().warn("the schema '" + name + "' is missing");
}


/*
 * A cyclic dependency was found.
 * @method missingSchema
 * @param {String} name name of the schema where the cyclic dependency was found
 */
function cyclicDependency(name) {
    if (name) {
        getLogger().error('a cyclic inheritance dependency with \’' + name + '\’ schema has been found, please check the \'_inherit\' properties of your schemas');
    } else {
        getLogger().error('a cyclic inheritance dependency has been found, please check the \'_inherit\' properties of your schemas');
    }
}


/*
 * Invalid type for a type enum.
 * @method invalidEnumType
 * @param {Object} value the value
 * @param {String} typeName name of the type
 * @param {String} type typeName of the type
 */
function invalidEnumType(value, typeName, type) {
    if (type !== typeof value) {
        getLogger().warn("invalid type for enumerated type '" + typeName + "': expected type '" + type + "' instead of type '" + typeof value + "'");
    } else {
        getLogger().warn("invalid type for enumerated type '" + typeName + "'");
    }
}


/*
 * Load schema.
 * @method loadSchema
 * @param {String} name name of the schema
 */
function loadSchema(name) {
    getLogger().debug("load schema '" + name + "'");
}


/*
 * Load model.
 * @method loadModel
 * @param {String} name name of the model
 */
function loadModel(name) {
    getLogger().debug("load model '" + name + "'");
}


/*
 * Load type.
 * @method loadType
 * @param {String} name name of the type
 */
function loadType(name) {
    getLogger().debug("load type '" + name + "'");
}


/*
 * Compile schema.
 * @method compileSchema
 * @param {String} name name of the schema
 */
function compileSchema(name) {
    getLogger().debug("compile schema '" + name + "'...");
}


/*
 * Generate model.
 * @method generateModel
 * @param {String} name name of the model
 */
function generateModel(name) {
    getLogger().debug("generate model '" + name + "'...");
}


/*
 * Check model.
 * @method checkModel
 * @param {String} name name of the model
 */
function checkModel(name) {
    getLogger().debug("analyze model '" + name + "'...");
}


/*
 * Create collection.
 * @method createCollection
 * @param {String} name name of the collection
 */
function createCollection(name) {
    getLogger().debug("create collection '" + name + "'");
}

/*
 * Create class.
 * @method createClass
 * @param {String} name name of the class
 */
function createClass(name) {
    getLogger().debug("create class '" + name + "'");
}


/*
 * Begins model creation.
 * @method modelCreationBegin
 */
function modelCreationBegin() {
    getLogger().debug("starting model creation...");
}


/*
 * End model creation.
 * @method modelCreationEnd
 */
function modelCreationEnd() {
    getLogger().debug("model creation ended");
}


/*
 * An error happened when invoking a behavior.
 * @method actionInvokeError
 * @param {String} state state
 * @param {String} id component id
 * @param {String} className component class name
 * @param {String} message
 */
function actionInvokeError(state, id, className, message) {
    if (className !== 'Function') {
        getLogger().error("error when trying to call the method '" + state + "' on component '" + id + "' (class '" + className + "'): " + message);
    } else {
        getLogger().error("error when trying to call the method '" + state + "' on component '" + id + "': " + message);
    }
}


/*
 * Invalid name for the property of a schema.
 * @method invalidSchemaProperty
 * @param {String} name name of the schema
 * @param {String} propName name of the property
 */
function invalidSchemaProperty(name, propName) {
    getLogger().warn("invalid property '" + propName + "' for schema '" + name + "': only 'property', 'link', 'collection', 'method' and 'event' are allowed.");
}


/*
 * Invalid format for the definition of a property
 * @method invalidPropertyFormat
 * @param {String} obj definition of a property
 */
function invalidPropertyFormat(obj) {
    getLogger().warn("invalid format for a definition of a property': '" + obj + "' is not an object");
}


/* exports */


/**
 * This module contains all the functions that write a log.
 * 
 * @module runtime
 * @submodule runtime-log
 * @requires runtime-helper
 * @class runtime-log
 * @static
 */


/**
 * Set the level of the log.
 * @method level
 * @param {String} levelName name of the level
 */
exports.level = level;


/**
 * A property of a schema is unknown.
 * @method unknownProperty
 * @param {String} propertyName the name of the property
 * @param {Object} schema the schema definition
 */
exports.unknownProperty = unknownProperty;


/**
 * Invalid type for a property.
 * @method invalidPropertyType
 * @param {String} propertyName name of the peropety
 * @param {String} type the type defined by the schema
 * @param {String} property the property
 */
exports.invalidPropertyType = invalidPropertyType;


/**
 * Invalid value for a type enum.
 * @method invalidEnumValue
 * @param {Object} value the value
 * @param {String} type the type defined by the schema
 */
exports.invalidEnumValue = invalidEnumValue;


/**
 * Invalid class name for a component.
 * @method invalidClassName
 * @param {String} componentId id of the component
 * @param {String} type the type defined by the schema
 * @param {String} constructorName name of the component class
 */
exports.invalidClassName = invalidClassName;


/**
 * Missing a property.
 * @method missingProperty
 * @param {String} propertyName name of the property
 */
exports.missingProperty = missingProperty;


/**
 * A class definition is missing.
 * @method missingImplementation
 * @param {String} name name of the missing schema
 */
exports.missingImplementation = missingImplementation;


/**
 * Invalid type for a property of a class definition.
 * @method invalidTypeImp
 * @param {String} property a property
 * @param {String} className a class name
 */
exports.invalidTypeImp = invalidTypeImp;


/**
 * Missing a property for a class definition.
 * @method missingPropertyImp
 * @param {String} property a property
 * @param {String} className a class name
 */
exports.missingPropertyImp = missingPropertyImp;


/**
 * Unkown property for a class definition.
 * @method unknownPropertyImp
 * @param {String} property a property
 * @param {Object} schema a schema
 */
exports.unknownPropertyImp = unknownPropertyImp;


/**
 * Try to add an invalid type.
 * @method invalidTypeDefinition
 * @param {String} name a type definition
 */
exports.invalidTypeDefinition = invalidTypeDefinition;


/**
 * Invalid property type.
 * @method invalidPropertyName
 * @param {String} id id of the component
 * @param {String} className class name of the component
 * @param {String} propertyName name of the property
 * @param {String} propertyValue value of the property
 * @param {String} type type defined by the schema
 */
exports.invalidPropertyName = invalidPropertyName;


/**
 * Trying to set a read-only property.
 * @method readOnlyProperty
 * @param {String} id id of the component
 * @param {String} className class name of the component
 * @param {String} propertyName name of the property
 */
exports.readOnlyProperty = readOnlyProperty;


/**
 * Invalid document on a Runtime database insert operation.
 * @method invalidDocumentOnDbInsert
 * @param {String} doc a document
 * @param {String} collectionName the name of the colllection
 */
exports.invalidDocumentOnDbInsert = invalidDocumentOnDbInsert;


/**
 * Invalid property on a Runtime database update operation.
 * @method invalidPropertyTypeOnDbUpdate
 * @param {String} collectionName the name of the colllection
 * @param {String} id id of the component
 * @param {String} propertyName name of the property
 * @param {String} propertyValue value of the property
 * @param {String} type expected type defined by the schema
 */
exports.invalidPropertyTypeOnDbUpdate = invalidPropertyTypeOnDbUpdate;


/**
 * Call an unknown method of a class.
 * @method unknownMethod
 * @param {String} classId id of the class
 * @param {String} methodName name of the method
 */
exports.unknownMethod = unknownMethod;


/**
 * Try to create an invalid RuntimeDatabaseCollection.
 * @method invalidCollectionName
 * @param {String} name name of the collection
 */
exports.invalidCollectionName = invalidCollectionName;


/**
 * Invalid type result of a method.
 * @method invalidResultType
 * @param {String} id id of the component
 *  * @param {String} className class name of the component
 * @param {String} methodName name ot the method
 * @param {String} expectedType expected type
 * @param {String} type current type
 */
exports.invalidResultType = invalidResultType;


/**
 * Unknown class.
 * @method unknownComponent
 * @param {String} id id of the class
 * @param {String} componentId if of the component
 */
exports.unknownComponent = unknownComponent;


/**
 * The Runtime workflow has been restarted.
 * @method workflowRestarted
 */
exports.workflowRestarted = workflowRestarted;


/**
 * Invalid parameter number for a method.
 * @method invalidParamNumber
 * @param {String} id id of the component
 * @param {String} className class name of the component
 * @param {String} methodName name of the component
 */
exports.invalidParamNumber = invalidParamNumber;


/**
 * Invalid type parameters for a method.
 * @method invalidParamType
 * @param {String} id id of the component
 * @param {String} className class name of the component
 * @param {String} methodName name of the component
 * @param {String} paramName name of the parameter
 * 
 */
exports.invalidParamType = invalidParamType;


/**
 * Add a more than one behavior to a state.
 * @method behaviorNotUnique
 * @param {String} id id of the class
 * @param {String} stateName name of the state
 */
exports.behaviorNotUnique = behaviorNotUnique;


/**
 * Can not add a behavior with an invalid state.
 * @method invalidStateOn
 * @param {String} id id of the class
 * @param {String} stateName name of the state
 */
exports.invalidStateOn = invalidStateOn;


/**
 * The call to a remove state of the behavior module is invalid.
 * @method invalidStateOff
 * @param {String} id id of the class
 * @param {String} stateName name of the state
 */
exports.invalidStateOff = invalidStateOff;


/**
 * The master system is not found.
 * @method masterSystemNotFound
 */
exports.masterSystemNotFound = masterSystemNotFound;


/**
 * Invalid type.
 * @method invalidType
 * @param {Object} value value of the type
 * @param {String} typeName expectec type defined by the schema
 */
exports.invalidType = invalidType;


/**
 * Unknown type.
 * @method unknownType
 * @param {String} value value
 */
exports.unknownType = unknownType;


/**
 * A component has not been alreay created.
 * @method canNotYetValidate
 * @param {String} id id of the component
 * @param {String} className name of the class
 */
exports.canNotYetValidate = canNotYetValidate;


/**
 * A message send by the channel is invalid
 * @method invalidChannelEvent
 * @param {String} message message send
 * @param {String} eventName name of the event
 * @param {String} type expected type
 */
exports.invalidChannelEvent = invalidChannelEvent;


/**
 * invalid parameter number for an action add with on method.
 * @method invalidParamNumberMethodOn
 * @param {String} className class name of the component
 * @param {String} id id of the component
 * @param {String} methodName name of the component
 */
exports.invalidParamNumberMethodOn = invalidParamNumberMethodOn;


/**
 * Change the id of a component.
 * @method updateUuid
 * @param {String} currentId id of the component
 * @param {String} newId of the component
 * @param {Boolean} alreadyUsed newId already used
 */
exports.updateUuid = updateUuid;


/**
 * Unkonw property on a Runtime database update operation.
 * @method unknownPropertyOnDbUpdate
 * @param {String} collectionName the name of the colllection
 * @param {String} propertyName name of the property
 * @param {String} id id of the component
 */
exports.unknownPropertyOnDbUpdate = unknownPropertyOnDbUpdate;


/**
 * Try to change the state of a component that has been destroyed
 * @method invalideUseOfComponent
 * @param {String} id id of the component
 */
exports.invalidUseOfComponent = invalidUseOfComponent;


/**
 * Try to add an invalid schema.
 * @method invalidSchema
 * @param {String} name name of the schema
 */
exports.invalidSchema = invalidSchema;


/**
 * Try to add an invalid model.
 * @method invalidModel
 * @param {String} name name of the model
 */
exports.invalidModel = invalidModel;


/**
 * Invalid parameters set when creating an instance of a class.
 * @method invalidParameters
 * @param {String} classId class name of the component
 */
exports.invalidParameters = invalidParameters;


/**
 * Try to get the property of a destroyed component.
 * @method destroyedComponentCall
 * @param {String} propertyName name of the property
 * @param {String} id id of the component
 */
exports.destroyedComponentCall = destroyedComponentCall;


/**
 * Invalid parameter type  when creating an instance of a class.
 * @method invalidConctructorParameters
 * @param {String} object configuration
 * @param {String} name schema name
 */
exports.invalidConctructorParameters = invalidConctructorParameters;


/**
 * Get the information of an unkown model.
 * @method unknownModel
 * @param {String} classId id of the class
 */
exports.unknownModel = unknownModel;


/**
 * A schema is missing.
 * @method missingSchema
 * @param {String} name name of the schema
 */
exports.missingSchema = missingSchema;


/**
 * A cyclic dependency was found.
 * @method missingSchema
 * @param {String} name name of the schema where the cyclic dependency was found
 */
exports.cyclicDependency = cyclicDependency;


/**
 * Invalid type for a type enum.
 * @method invalidEnumType
 * @param {Object} value the value
 * @param {String} typeName name of the type
 * @param {String} type typeName of the type
 */
exports.invalidEnumType = invalidEnumType;


/**
 * Load schema.
 * @method loadSchema
 * @param {String} name name of the schema
 */
exports.loadSchema = loadSchema;


/**
 * Load model.
 * @method loadModel
 * @param {String} name name of the model
 */
exports.loadModel = loadModel;


/**
 * Load type.
 * @method loadType
 * @param {String} name name of the type
 */
exports.loadType = loadType;


/** 
 * Compile schema.
 * @method compileSchema
 * @param {String} name name of the schema
 */
exports.compileSchema = compileSchema;


/**
 * Generate model.
 * @method generateModel
 * @param {String} name name of the model
 */
exports.generateModel = generateModel;


/**
 * Check model.
 * @method checkModel
 * @param {String} name name of the model
 */
exports.checkModel = checkModel;


/**
 * Create collection.
 * @method createCollection
 * @param {String} name name of the collection
 */
exports.createCollection = createCollection;


/**
 * Create class.
 * @method createClass
 * @param {String} name name of the class
 */
exports.createClass = createClass;


/*
 * Begins model creation.
 * @method modelCreationBegin
 */
exports.modelCreationBegin = modelCreationBegin;


/*
 * End model creation.
 * @method modelCreationEnd
 */
exports.modelCreationEnd = modelCreationEnd;


/**
 * An error happened when invoking a behavior.
 * @method actionInvokeError
 * @param {String} state state
 * @param {String} id component id
 * @param {String} className component class name
 * @param {String} message
 */
exports.actionInvokeError = actionInvokeError;


/**
 * Invalid name for the property of a schema.
 * @method invalidSchemaProperty
 * @param {String} name name of the schema
 * @param {String} propName name of the property
 */
exports.invalidSchemaProperty = invalidSchemaProperty;


/**
 * Invalid format for the definition of a property
 * @method invalidPropertyFormat
 * @param {String} obj definition of a property
 */
exports.invalidPropertyFormat = invalidPropertyFormat;

},{"./component.js":3,"./db.js":4,"./helper.js":5,"./metamodel.js":7,"./workflow.js":10}],7:[function(require,module,exports){
/*
 * System Runtime
 * 
 * https://designfirst.io/systemruntime/
 * 
 * Copyright 2017 Erwan Carriou
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This module manages Runtime metamodel. <br>
 * Runtime metamodel loads schemas and types, analyzes them and creates the component classes and related RuntimeDatabaseCollections.
 * 
 * @module runtime
 * @submodule runtime-metamodel
 * @requires runtime-db
 * @requires runtime-log
 * @requires runtime-component
 * @requires runtime-workflow
 * @class runtime-metamodel
 * @static
 */

'use strict';

var $db = require('./db.js');
var $log = require('./log.js');
var $component = require('./component.js');
var $workflow = require('./workflow.js');
var $helper = require('./helper.js');


/* Private properties */


var ID = '_id',
    NAME = '_name',
    DESCRIPTION = '_description',
    INHERITS = '_inherit',
    CLASS = '_class',
    CORE = '_core',
    METHOD_TYPE = 'method',
    EVENT_TYPE = 'event',
    PROPERTY_TYPE = 'property',
    LINK_TYPE = 'link',
    COLLECTION_TYPE = 'collection',
    internalTypes = ['property', 'collection', 'link', 'method', 'event'],
    defaultTypes = ['boolean', 'string', 'number', 'object', 'function', 'array', 'date', 'any'],
    store = {
        metadef: {},
        inheritance: {},
        inheritanceTree: {},
        schemas: {},
        compiledSchemas: {},
        models: {},
        generatedModels: {},
        states: {},
        type: {}
    };


/* Private methods */


/*
 * Generate the models.
 * @method generateModels
 * @private
 */
function generateModels() {
    var att = '',
        name = '',
        schemaName = '',
        schema = {},
        modelName = '',
        modelParent = null,
        modelExt = null,
        modelDef = null,
        model = {},
        models = {},
        mergedModel = {},
        parents = [],
        length = 0,
        i = 0,
        j = 0,
        nbAncestors = 0,
        sortInheritTree = [];

    // default values
    for (schemaName in store.compiledSchemas) {
        schema = store.compiledSchemas[schemaName];

        // set model internal properties
        model = {
            "_name": schema._name,
        };

        // set _core
        if (typeof schema._core !== 'undefined') {
            model._core = schema._core;
        }

        // set inherit
        if (Array.isArray(schema._inherit)) {
            model._inherit = schema._inherit;
        }

        // set class
        if (typeof schema._class !== 'undefined') {
            model._class = schema._class;
        }

        // set description 
        if (typeof schema._description !== 'undefined') {
            model._description = schema._description;
        }

        //  set model default values
        for (att in schema) {
            switch (true) {
                case schema[att] === 'property':
                    model[att] = {
                        "type": "any",
                        "readOnly": false,
                        "mandatory": false,
                        "default": "",
                        "description": att,
                        "label": att
                    };
                    break;
                case schema[att] === 'link':
                    model[att] = {
                        "type": "@RuntimeComponent",
                        "readOnly": false,
                        "mandatory": false,
                        "default": "",
                        "description": att,
                        "label": att
                    };
                    break;
                case schema[att] === 'method':
                    model[att] = {
                        "params": [
                            {
                                "name": "param",
                                "type": "any",
                                "mandatory": false
                            }
                        ],
                        "result": "any",
                        "description": att
                    };
                    break;
                case schema[att] === 'event':
                    model[att] = {
                        "params": [
                            {
                                "name": "param",
                                "type": "any",
                                "mandatory": false
                            }
                        ],
                        "description": att
                    };
                    break;
                case schema[att] === 'collection':
                    model[att] = {
                        "type": ["@RuntimeComponent"],
                        "readOnly": false,
                        "mandatory": false,
                        "default": [],
                        "description": att,
                        "label": att
                    };
                    break;
                default:
                    if (att.indexOf('_') !== 0) {
                        $log.invalidSchemaProperty(schema._name, att);
                    }
                    break;
            }
        }

        store.generatedModels[model._name] = model;
    }

    // models to override
    for (modelName in store.generatedModels) {
        model = store.generatedModels[modelName];
        name = model[NAME];
        modelExt = store.models[name];
        if (modelExt) {
            mergedModel = merge(modelExt, model);
            delete mergedModel._id;
            store.generatedModels[name] = mergedModel;
        }
    }

    // inheritance
    sortInheritTree = sortInheritanceTree();

    nbAncestors = sortInheritTree.length;
    for (i = 0; i < nbAncestors; i++) {
        modelName = sortInheritTree[i];
        model = store.generatedModels[modelName];

        if (model) {
            parents = getParents(modelName);
            parents.reverse();

            var modelToMerge = JSON.parse(JSON.stringify(model));

            length = parents.length;
            for (j = 0; j < length; j++) {
                name = parents[j];
                modelParent = store.generatedModels[name];
                if (modelParent) {
                    mergedModel = merge(modelParent, model);
                    delete mergedModel._id;
                    store.generatedModels[modelName] = mergedModel;
                }
            }

            // last inherit 
            // is the overriden model
            modelExt = store.models[modelName];
            if (modelExt) {
                mergedModel = merge(modelExt, store.generatedModels[modelName]);
                delete mergedModel._id;
                store.generatedModels[modelName] = mergedModel;
            }
        }
    }

    // save 
    for (modelName in store.generatedModels) {
        modelDef = store.generatedModels[modelName];
        $db.RuntimeGeneratedModel.insert(modelDef);

        if (!modelDef._core) {
            $log.generateModel(modelName);
        }
    }
}

/*
 * Load schemas and types in memory.
 * @method loadInMemory
 * @private
 */
function loadInMemory() {
    var schemas = [],
        types = [],
        schema = null,
        model = {},
        models = [],
        type = null,
        id = '',
        name = '',
        inherit = '',
        i = 0,
        length = 0;

    // init store
    store.inheritance = {};
    store.inheritanceTree = {};
    store.schemas = {};
    store.compiledSchemas = {};
    store.models = {};
    store.generatedModels = {};
    store.states = {};
    store.type = {};

    // load schemas
    schemas = $db.RuntimeSchema.find({});

    length = schemas.length;
    for (i = 0; i < length; i++) {
        schema = schemas[i];

        name = schema[NAME];
        inherit = schema[INHERITS];

        store.schemas[name] = schema;
        if (inherit) {
            store.inheritance[name] = inherit;
        }

        if (!schema._core) {
            $log.loadSchema(name);
        }
    }

    // load models
    models = $db.RuntimeModel.find({});

    length = models.length;
    for (i = 0; i < length; i++) {
        model = models[i];
        name = model[NAME];

        store.models[name] = model;

        if (!model._core) {
            $log.loadModel(name);
        }
    }

    // load types
    types = $db.RuntimeType.find({});

    length = types.length;
    for (i = 0; i < length; i++) {
        type = types[i];
        store.type[type.name] = type;

        if (!type.core) {
            $log.loadType(type.name);
        }
    }
}


/*
 * Create the inheritance tree.
 * @method createInheritanceTree
 * @private
 */
function createInheritanceTree() {
    var name = '',
        c3linerization = [],
        ancestors = [];

    /*
     * Check if we have finisehd to linerize.
     * @param {Array} elts array of elts
     * @return {Boolean} true if all the arrays are empty
     * @private
     */
    function _isEmpty(elts) {
        var i = 0,
            length = 0,
            result = true;

        length = elts.length;
        for (i = 0; i < length; i++) {
            if (elts[i].length) {
                result = false;
            }
        }
        return result;
    }

    /*
     * Remove an elt from all the arrays.
     * @param {String} elt element to remove
     * @param {Array} elts array of elts
     * @private
     */
    function _removeCandidate(elt, elts) {
        var i = 0,
            length = 0,
            arr = [];

        length = elts.length;
        for (i = 0; i < length; i++) {
            if (elts[i].indexOf(elt) === 0) {
                arr = elts[i];
                arr.reverse();
                arr.pop();
                arr.reverse();
                elts[i] = arr;
            }
        }
    }

    /*
     * Check the element is a good candidate.
     * @param {String} elt element to remove
     * @param {Array} elts array of elts
     * @return {Boolean} true if the element is a good candidate.
     * @private
     */
    function _isCandidate(elt, elts) {
        var result = true,
            i = 0,
            length = 0;

        length = elts.length;
        for (i = 0; i < length; i++) {
            if (elts[i].indexOf(elt) > 0) {
                result = false;
            }
        }

        return result;
    }

    /*
     * Find a candidate and return it.
     * @param {Array} elts array of elts
     * @return {Array} array containing the candidate
     * @private
     */
    function _findCandidate(elts) {
        var i = 0,
            length = 0,
            result = [];

        length = elts.length;
        for (i = 0; i < length; i++) {
            if (_isCandidate(elts[i][0], elts)) {
                result.push(elts[i][0]);
                _removeCandidate(elts[i][0], elts);
                break;
            }
        }
        return result;
    }

    /*
     * Merge the arrays.
     * @param {Array} elts array of elts
     * @return {Array} list of candidates returned by the merge
     * @private
     */
    function _merge(elts) {
        var result = [],
            candidates = [];

        candidates = _findCandidate(elts);
        while (candidates[0] !== undefined) {
            result = result.concat(candidates);
            candidates = _findCandidate(elts);
        }

        if (!_isEmpty(elts)) {
            $log.cyclicDependency();
        }
        return result;
    }

    /*
     * Start the linerieation from an element.
     * @param {String} name name of the element
     * @return {Array} list of candidates
     * @private
     */
    function _linerize(name) {
        var result = [],
            parents = [],
            i = 0,
            length = 0;

        /*
         * Check if there is a cyclic dependency. 
         * @param {String} name
         * @param {String} item
         * @return {Boolean} true if there is a cyclic dependency
         * @private 
         */
        function _checkCyclicDep(name, item) {
            var isCyclicDeb = false;

            if (Array.isArray(store.inheritance[item]) && store.inheritance[item].indexOf(name) !== -1) {
                $log.cyclicDependency(name);
                isCyclicDeb = true;
            }
            return isCyclicDeb;
        }

        if (Array.isArray(store.inheritance[name])) {
            parents = store.inheritance[name].slice();
        } else {
            $log.missingSchema(name);
        }

        length = parents.length;
        for (i = 0; i < length; i++) {
            if (_checkCyclicDep(name, parents[i])) {
                parents = [];
                break;
            }
        }

        if (parents.length) {
            result = [name].concat(_merge(parents.map(_linerize).concat([parents])));
        } else {
            result = [name];
        }
        return result;
    }

    for (name in store.inheritance) {
        c3linerization = _linerize(name);
        ancestors = c3linerization.reverse();
        ancestors.pop();
        if (ancestors.length) {
            store.inheritanceTree[name] = ancestors;
        }
    }
}


/*
 * Extend a schema with the properties of its parent.
 * @method extend
 * @param {String} name name of the schema to extend
 * @return {JSON} object extended with the properties of its parent
 * @private
 */
function extend(name) {
    var sonExtend = {},
        son = store.schemas[name],
        ancestors = store.inheritanceTree[name],
        length = 0,
        i = 0,
        ancestor = null,
        prop = '';

    if (ancestors) {
        length = ancestors.length;
        ancestors.reverse();
    }
    for (i = 0; i < length; i++) {
        ancestor = store.schemas[ancestors[i]];
        for (prop in ancestor) {
            if (prop.indexOf('_') !== 0) {
                sonExtend[prop] = ancestor[prop];
            }
        }
    }
    for (prop in son) {
        sonExtend[prop] = son[prop];
    }
    return sonExtend;
}


/*
 * Get sorted InheritanceTree structure.
 * @method sortInheritanceTree
 * @return {Array} sorted InheritanceTree structure
 * @private
 */
function sortInheritanceTree() {
    var result = [],
        temp = {},
        keys = [],
        modelName = '',
        nbAncestors = 0;

    for (modelName in store.inheritanceTree) {
        nbAncestors = store.inheritanceTree[modelName].length;
        if (typeof temp[nbAncestors] === 'undefined') {
            temp[nbAncestors] = [];
        }
        temp[nbAncestors].push(modelName);
    }

    keys = Object.keys(temp).sort();
    keys.forEach(function (index) {
        temp[index].forEach(function (model) {
            result.push(model);
        });
    });

    return result;
}


/*
 * Add the models.
 * @method compileSchemas
 * @private
 */
function compileSchemas() {
    var name = '';
    for (name in store.schemas) {
        if (!store.schemas[name]._core) {
            $log.compileSchema(name);
        }

        store.compiledSchemas[name] = extend(name);
    }
}


/*
 * Test if all the models are compliants with their schemas.
 * @method checkModels
 * @private
 */
function checkModels() {
    var name = '',
        classDef = null,
        schema = '';

    for (name in store.generatedModels) {
        classDef = store.generatedModels[name];
        if (classDef) {
            schema = store.compiledSchemas[name];
            if (schema) {
                if (!classDef._core) {
                    $log.checkModel(name);
                }
                checkImp(classDef, schema);
            } else {
                $log.missingImplementation(name);
            }
        }
    }
}


/*
 * Get all the states of a schema.
 * @method getStates
 * @private
 */
function getStates() {
    var name = '',
        schema = null,
        type = '',
        states = [],
        attribute = '';

    for (name in store.compiledSchemas) {
        states = [];
        schema = store.compiledSchemas[name];
        if (schema) {
            for (attribute in schema) {
                type = schema[attribute];
                if (attribute.indexOf('_') !== 0 && internalTypes.indexOf(type) !== -1) {
                    states.push(attribute);
                }
            }
        }
        store.states[name] = states;
    }
}


/*
 * Test if a schema is compliant with its schema.
 * @method checkImp
 * @param {JSON} classDef schema to test 
 * @param {JSON} classImp schema to validate
 * @private
 */
function checkImp(classDef, classImp) {
    var property = '',
        value = null;
    for (property in classImp) {
        if (property !== ID &&
            property !== NAME &&
            property !== DESCRIPTION &&
            property !== INHERITS &&
            property !== CLASS &&
            property !== CORE) {
            if (typeof classDef[property] !== 'undefined') {
                value = classDef[property];
                if (!checkSchema(value, classImp[property])) {
                    $log.invalidTypeImp(property, classDef[NAME]);
                }
            } else {
                $log.missingPropertyImp(property, classDef[NAME]);
            }
        }
    }
    // check if all properties are there
    for (property in classDef) {
        if (property !== ID &&
            property !== NAME &&
            property !== DESCRIPTION &&
            property !== INHERITS &&
            property !== CLASS &&
            property !== CORE) {
            if (typeof classImp[property] === 'undefined') {
                $log.unknownPropertyImp(property, classDef[NAME]);
            }
        }
    }
}


/*
 * Test if a value has the correct type.
 * @method checkSchema
 * @param {Object} value value to test
 * @param {Object} type type to test
 * @return {Boolean} true if the value has the correct type
 * @private
 */
function checkSchema(value, type) {
    var result = true;
    if (hasType(type, 'string') && defaultTypes.indexOf(type) !== -1) {
        result = hasType(value, type);
    } else {
        result = checkCustomSchema(value, type);
    }
    return result;
}


/*
 * Test if a value has correct custom type.
 * @method checkCustomSchema
 * @param {type} value value to test
 * @param {String} typeName type to test
 * @return {Boolean} true if the value has the correct type
 * @private
 */
function checkCustomSchema(value, typeName) {
    var result = true,
        typeDef = store.type[typeName],
        length = 0,
        i = 0;

    if (!hasType(typeDef, 'undefined')) {
        if (!hasType(value, 'undefined')) {
            if (typeDef.type === 'array') {
                length = value.length;
                for (i = 0; i < length; i++) {
                    if (!hasType(typeDef.schema, 'undefined')) {
                        result = isValidSchema(value[i], typeDef.schema);
                    } else {
                        result = isValidType(value[i], typeDef.type);
                    }
                    if (result === false) {
                        break;
                    }
                }
            } else {
                if (!hasType(typeDef.schema, 'undefined')) {
                    result = isValidSchema(value, typeDef.schema);
                } else {
                    result = isValidType(value, typeDef.type);
                }
            }
        } else {
            result = false;
        }
    } else {
        result = false;
    }

    return result;
}


/*
 * Init the Database stucture.
 * @method initDbStructure
 * @private
 */
function initDbStructure() {
    $db.collection('RuntimeLogger');
    $db.collection('RuntimeSchema');
    $db.collection('RuntimeModel');
    $db.collection('RuntimeGeneratedModel');
    $db.collection('RuntimeClassInfo');
    $db.collection('RuntimeBehavior');
    $db.collection('RuntimeState');
    $db.collection('RuntimeType');
    $db.collection('RuntimeMessage');
    $db.collection('RuntimeChannel');
    $db.collection('RuntimeLog');
}


/*
 * Create the Database structure (i.e. RuntimeDatabaseCollection).
 * @method createDbStructure
 * @private
 */
function createDbStructure() {
    var modelName = '',
        modelDef = {};

    for (modelName in store.generatedModels) {
        modelDef = store.generatedModels[modelName];
        if (typeof $db[modelDef[NAME]] === 'undefined' &&
            modelDef[CLASS] !== false) {
            $db.collection(modelDef[NAME]);

            if (!modelDef._core) {
                $log.createCollection(modelDef[NAME]);
            }
        }
    }
}


/*
 * Create all the classes of the model.
 * @method createClass
 * @private
 */
function createClass() {
    var modelName = '',
        modelDef = {};

    for (modelName in store.generatedModels) {
        modelDef = store.generatedModels[modelName];
        if (modelDef[CLASS] !== false) {
            $component.create({
                "model": modelName
            });
            if (!modelDef._core) {
                $log.createClass(modelName);
            }
        }
    }
}


/*
 * Create all the ClassInfo of the model.
 * @method createClassInfo
 * @private
 */
function createClassInfo() {
    var modelName = '',
        modelDef = {},
        name = '';

    for (modelName in store.generatedModels) {
        modelDef = store.generatedModels[modelName];
        name = modelDef[NAME] + 'Info';

        if (
            modelDef[CLASS] !== false &&
            inheritFrom(modelDef[NAME], 'RuntimeComponent')
        ) {
            if (!$component.get(name)) {
                $db.RuntimeClassInfo.insert({
                    "_id": name,
                    "schema": store.compiledSchemas[modelName],
                    "model": modelDef
                });
            } else {
                $db.RuntimeClassInfo.update({
                    "_id": name
                }, {
                        "_id": name,
                        "schema": store.compiledSchemas[modelName],
                        "model": modelDef
                    });
            }
        }
    }
}


/* 
 * Get the real name of the reference object / type.
 * @method getReference
 * @param {String} value
 * @return {String} real name
 * @private
 */
function getReference(value) {
    return value.replace('@', '');
}


/*
 * Is the value a custom type.
 * @method isCustomType
 * @param {String} value
 * @return {Boolean}
 * @private
 */
function isCustomType(value) {
    var result = hasType(value, 'string') &&
        defaultTypes.indexOf(value) === -1 &&
        !isReference(value);

    return result;
}


/*
 * Is the value a reference.
 * @method isReference
 * @param {String} value
 * @return {Boolean}
 * @private
 */
function isReference(value) {
    return value.indexOf('@') !== -1;
}


/*
 * Get the real type of a value.
 * @method getRealType
 * @param {type} value
 * @return {String} type of the value
 * @private
 */
function getRealType(value) {
    var type = '';

    if (Array.isArray(value)) {
        type = 'array';
    } else {
        type = typeof value;
    }
    if (value === 'any') {
        type = 'any';
    }

    return type;
}


/*
 * Get the class name of an object.
 * @method getClassName
 * @param {type} obj object
 * @return {String} the class name of the object
 * @private
 */
function getClassName(obj) {
    var result = '';

    if (obj && obj.constructor) {
        result = obj.constructor.name;
    }
    return result;
}


/*
 * Check if the value is a valid enum value.
 * @method isValidEnumValue
 * @param {String} value
 * @param {Array} enumValue
 * @return {Boolean} the class name of the object
 * @private
 */
function isValidEnumValue(value, enumValue) {
    return enumValue.indexOf(value) !== -1;
}


/*
 * Check if a value has the specified type.
 * @param {type} value
 * @param {type} type
 * @returns {Boolean} true is value has type 'type'
 */
function hasType(value, type) {
    var result = true,
        date = null;

    switch (type) {
        case 'array':
            result = Array.isArray(value);
            break;
        case 'date':
            if (typeof value === 'string') {
                date = new Date(value);
                result = !isNaN(date.getDate());
            } else {
                result = value instanceof Date;
            }
            break;
        case 'any':
            result = true;
            break;
        default:
            result = (type === typeof value);
            break;
    }

    return result;
}


/*
 * Check if an attribute of the schema has a specific type.
 * @method isCollection
 * @param {String} name
 * @param {String} id component id
 * @param {String} type type to check
 * @return {Boolean} true if the attribute has for type type
 */
function checkType(name, id, type) {
    var result = false,
        componentSchema = store.generatedModels[id],
        attributeType = '';

    if (componentSchema && componentSchema[NAME]) {
        componentSchema = store.compiledSchemas[componentSchema[NAME]];
    }

    if (componentSchema) {
        attributeType = componentSchema[name];
        if (attributeType === type) {
            result = true;
        }
    }

    return result;
}

/*
 * Merge two schemas.
 * @method merge
 * @param {Object} source source schema
 * @param {Object} target target schema
 * @param {Boolean} merge also private properties
 * @return {Object} merged schema
 */
function merge(source, target, all) {
    var propName = '',
        result = target;

    for (propName in source) {
        if (source.hasOwnProperty(propName) && propName.indexOf('_') !== 0) {
            result[propName] = source[propName];
        }
    }
    return result;
}

/* Public methods */


/*
 * Add a new schema.
 * @method schema
 * @param {JSON} importedSchema schema to add
 */
function schema(importedSchema) {
    var id = null,
        result = [],
        schema = null,
        name = '',
        mergedSchema = {},
        schemas = [];

    schema = JSON.parse(JSON.stringify(importedSchema));
    name = schema[NAME];

    if (typeof schema[ID] === 'undefined') {
        schema[ID] = $helper.generateId();
    }
    if (typeof schema[INHERITS] === 'undefined') {
        schema[INHERITS] = ['RuntimeComponent'];
    }

    // check if schema is compliant with the meta meta model
    if (isValidObject(schema, store.metadef.schema, false)) {
        schemas = $db.RuntimeSchema.find({ '_name': name });
        if (schemas.length) {
            mergedSchema = merge(schema, schemas[0]);
            delete mergedSchema._id;
            $db.RuntimeSchema.update({ '_name': name }, mergedSchema);
            id = schemas[0]._id;
        } else {
            result = $db.RuntimeSchema.insert(schema);
            id = result[0];
        }
    } else {
        $log.invalidSchema(schema[NAME]);
    }

    return id;
}


/*
 * Add a new model.
 * @method model
 * @param {JSON} importedModel model to add
 */
function model(importedModel) {
    var model = null,
        id = null,
        result = [],
        inherit = '',
        name = '',
        mergedModel = {},
        models = [];

    model = JSON.parse(JSON.stringify(importedModel));
    name = model[NAME];

    if (typeof model[ID] === 'undefined') {
        model[ID] = $helper.generateId();
    }

    // check if model is compliant with the meta meta model
    if (isValidObject(model, store.metadef.model, false)) {
        models = $db.RuntimeModel.find({ '_name': name });
        if (models.length) {
            mergedModel = merge(model, models[0]);
            delete mergedModel._id;
            $db.RuntimeModel.update({ '_name': name }, mergedModel);
            id = models[0]._id;
        } else {
            result = $db.RuntimeModel.insert(model);
            id = result[0];
        }
    } else {
        $log.invalidModel(model[NAME]);
    }

    return id;
}

/*
 * Add a new type.
 * @method type
 * @param {JSON} importedType type to add
 */
function type(importedType) {
    var id = null,
        result = [],
        name = importedType.name;

    // check if type is compliant with the meta meta model
    if (isValidObject(importedType, store.metadef.type)) {
        result = $db.RuntimeType.insert(importedType);
        id = result[0];
    } else {
        $log.invalidTypeDefinition(name);
    }

    return id;
}


/*
 * Init the metamodel.
 * @method init
 */
function init() {
    clear();
    store.metadef = {
        schema: {
            "_id": {
                "type": "string",
                "mandatory": true
            },
            "_name": {
                "type": "string",
                "mandatory": true
            },
            "_inherit": {
                "type": ["string"],
                "mandatory": false,
                "default": ["RuntimeComponent"]
            },
            "_class": {
                "type": "boolean",
                "mandatory": false
            },
            "_core": {
                "type": "boolean",
                "mandatory": false
            },
            "_description": {
                "type": "string",
                "mandatory": false
            }
        },
        model: {
            "_id": {
                "type": "string",
                "mandatory": true
            },
            "_name": {
                "type": "string",
                "mandatory": true
            },
            "_inherit": {
                "type": ["string"],
                "mandatory": false
            },
            "_class": {
                "type": "boolean",
                "mandatory": false
            },
            "_core": {
                "type": "boolean",
                "mandatory": false
            },
            "_description": {
                "type": "string",
                "mandatory": false
            }
        },
        type: {
            "_id": {
                "type": "string",
                "mandatory": false
            },
            "name": {
                "type": "string",
                "mandatory": true
            },
            "type": {
                "type": "string",
                "mandatory": true
            },
            "schema": {
                "type": "object",
                "mandatory": false
            },
            "value": {
                "type": ["any"],
                "mandatory": false
            },
            "core": {
                "type": "boolean",
                "mandatory": false
            },
            "_description": {
                "type": "string",
                "mandatory": false
            }
        }

    };
    initDbStructure();
}


/*
 * Remove the data of the metamodel from the memory.
 * @method clear
 */
function clear() {
    store = {
        metadef: {},
        inheritance: {},
        inheritanceTree: {},
        schemas: {},
        compiledSchemas: {},
        models: {},
        generatedModels: {},
        states: {},
        type: {}
    };
}


/*
 * Create the metamodel.
 * @method create
 */
function create() {
    $log.modelCreationBegin();
    loadInMemory();
    createInheritanceTree();
    compileSchemas();
    generateModels();
    checkModels();
    getStates();
    createDbStructure();
    createClass();
    createClassInfo();
    $log.modelCreationEnd();
}


/*
 * Check if an attribute of the schema is an event.
 * @method isEvent
 * @param {String} name
 * @param {String} id component id
 * @return {Boolean} true if the attribute is an event
 */
function isEvent(name, id) {
    return checkType(name, id, EVENT_TYPE);
}


/*
 * Check if an attribute of the schema is a property.
 * @method isProperty
 * @param {String} name name of the property
 * @param {String} id component id
 * @return {Boolean} true if the attribute is a property
 */
function isProperty(name, id) {
    return checkType(name, id, PROPERTY_TYPE);
}


/*
 * Check if an attribute of the schema is a link.
 * @method isLink
 * @param {String} name name of the property
 * @param {String} id component id
 * @return {Boolean} true if the attribute is a link
 */
function isLink(name, id) {
    return checkType(name, id, LINK_TYPE);
}


/*
 * Check if an attribute of the schema is a collection.
 * @method isCollection
 * @param {String} name name of the collection
 * @param {String} id component id
 * @return {Boolean} true if the attribute is a collection
 */
function isCollection(name, id) {
    return checkType(name, id, COLLECTION_TYPE);
}


/*
 * Check if an attribute of the schema is a method.
 * @method isMethod
 * @param {String} name name of the method
 * @param {String} id component id
 * @return {Boolean} true if the attribute is a method
 */
function isMethod(name, id) {
    return checkType(name, id, METHOD_TYPE);
}


/*
 * Check if an attribute of the schema is a structure.
 * @method isStructure
 * @param {String} name name of the propertys
 * @param {String} id component id
 * @return {Boolean} true if the property is a structure
 */
function isStructure(name, id) {
    var result = false,
        model = store.generatedModels[id],
        attributeType = '',
        type = '';

    if (model[name]) {
        type = store.type[model[name].type];
    }

    if (type && type.schema) {
        result = true;
    }

    return result;
}


/*
 * Check if the name is a correct state for the component.
 * @method isValidState
 * @param {String} name name of the state
 * @param {String} id component id
 * @return {Boolean} true if the name is a correct state for the component
 */
function isValidState(name, id) {
    var result = false,
        componentSchema = store.generatedModels[id],
        state = {};

    if (componentSchema && componentSchema[NAME]) {
        componentSchema = store.generatedModels[componentSchema[NAME]];
    }
    state = store.states[componentSchema[NAME]];

    if (Array.isArray(state)) {
        result = state.indexOf(name) !== -1;
    }

    return result;
}


/*
 * Check if a value is compliant with a type.
 * @method isValidType
 * @param {Object} object object to validate
 * @param {String} type type to use for validation
 * @return {Boolean} true if the object is compliant with the type
 */
function isValidType(value, typeName) {
    var result = true;


    function _isValidCustomType(value, typeName) {
        var typeDef = store.type[typeName],
            result = true;

        if (Array.isArray(typeDef.value) && typeDef.value.indexOf(value) === -1) {
            result = false;
        }

        if (result === false) {
            $log.invalidEnumValue(value, typeName);
        }
        return result;
    }

    function _checkReference(value, typeName) {
        var isValid = true;
        var typeRef = getReference(typeName);
        var component = value;

        if (value !== '' && value !== null) {
            if (hasType(value, 'string')) {
                component = $component.get(value);
            }
            if (getClassName(component) !== typeRef && JSON.stringify(component) !== '{}') {
                isValid = false;
                $log.invalidType(value, typeName.replace('@', ''));
            }
        }
        return isValid;
    }

    /*
    * Check if an object is compliant with a type.
    * @return {Boolean} the object is compliant with the type
    * @private
    */
    function _isValidType(value, typeName) {
        var isValid = true,
            realType = '',
            i = 0,
            length = 0;

        realType = getRealType(typeName);
        switch (realType) {
            case 'string':
                isValid = hasType(value, typeName);
                break;
            case 'array':
                length = value.length;
                for (i = 0; i < length; i++) {
                    switch (true) {
                        case isCustomType(typeName[0]):
                            isValid = checkCustomSchema(value[i], typeName[0]);
                            break;
                        case isReference(typeName[0]):
                            isValid = _checkReference(value[i], typeName[0]);
                            break;
                        default:
                            isValid = hasType(value[i], typeName[0]);
                            break;
                    }
                }
                break;
            default:
                break;
        }
        return isValid;
    }

    if (hasType(typeName, 'string')) {
        switch (true) {
            case isCustomType(typeName):
                result = checkCustomSchema(value, typeName);

                if (!result) {
                    $log.invalidEnumType(value, typeName, store.type[typeName].type);
                }

                if (result) {
                    result = _isValidCustomType(value, typeName);
                }
                break;
            case isReference(typeName):
                result = _checkReference(value, typeName);
                break;
            default:
                result = _isValidType(value, typeName);
                break;
        }
    } else {
        result = false;
    }

    return result;
}


/*
 * Check if a value is compliant with a type enum.
 * @method isValidEnum
 * @param {String|Object} value value to validate
 * @param {Schema} schema schema to use for validation
 * @return {Boolean} true if the object is compliant with the enum
 */
function isValidEnum(value, schema) {
    var result = true;

    function _isInstanceOf(component, className) {
        var result = false,
            componentClassName = '';

        componentClassName = component.constructor.name;

        if (componentClassName === 'Function') {
            componentClassName = component.name;
        }
        result = componentClassName === className;

        return result;
    }

    if (isReference(schema.type)) {
        result = _isInstanceOf($component.get(value), getReference(schema.type)) && schema.value.indexOf(value) !== -1;
        if (!result) {
            $log.invalidEnumValue(value, schema.type);
        }
    } else {
        result = (hasType(value, schema.type)) && schema.value.indexOf(value) !== -1;
        if (!result) {
            $log.invalidEnumValue(value, schema.type);
        }
    }

    return result;
}


/*
 * Check if the object is compliant with the schema.
 * Use it to test if a schema is compliant with a schema
 * it is supposed to validate.
 * @method isValidSchema
 * @param {JSON} object
 * @param {JSON} schema
 * @return {Boolean}
 * @private
 */
function isValidSchema(object, schema) {
    var fieldName = '',
        field = null,
        result = true,
        mandatory = true,
        typeSchema = '',
        typeRef = '',
        realType = '',
        length = 0,
        i = 0;

    /*
     * Check if a field is compliant with the type of the reference.
     * @return {Boolean} the field is compliant with the type of the reference
     * @private
     */
    function _isValidReference() {
        var isValid = true,
            enumValue = [];

        typeRef = getReference(typeSchema);
        typeRef = object[typeRef];
        if (isCustomType(typeRef)) {
            if (store.type[typeRef]) {
                if (store.type[typeRef].schema) {
                    isValid = isValidSchema(field, store.type[typeRef].schema);
                } else {
                    // check type
                    isValid = hasType(field, store.type[typeRef].type);

                    // check value
                    enumValue = store.type[typeRef].value;
                    if (enumValue) {
                        isValid = isValidEnumValue(field, enumValue);
                    }
                }
            } else {
                isValid = false;
            }
        } else {
            if (typeRef === 'array') {
                isValid = Array.isArray(field);
            } else {
                if (isReference(typeRef)) {
                    isValid = hasType(field, 'object') || hasType(field, 'string');
                    // TODO maybe have a more strict validation than just a type checking
                } else {
                    isValid = hasType(field, typeRef);
                }
            }
        }
        if (!isValid) {
            $log.invalidPropertyType(fieldName, typeRef, field);
        }
        return isValid;
    }

    /*
     * Check if a field is compliant with a type.
     * @return {Boolean} the field is compliant with the type
     * @private
     */
    function _isValidType() {
        var isValid = true;

        realType = getRealType(typeSchema);
        switch (realType) {
            case 'string':
                if (isCustomType(realType)) {
                    isValid = isValidSchema(field, typeSchema);
                } else {
                    if (!hasType(field, typeSchema)) {
                        $log.invalidPropertyType(fieldName, typeSchema, field);
                        isValid = false;
                        break;
                    }
                }
                break;
            case 'array':
                length = field.length;
                for (i = 0; i < length; i++) {
                    if (isCustomType(typeSchema[0])) {
                        isValid = isValidSchema(field[i], store.type[typeSchema[0]].schema);
                    } else {
                        if (!hasType(field[i], typeSchema[0])) {
                            $log.invalidPropertyType(field[i], typeSchema[0], field[i]);
                            isValid = false;
                            break;
                        }
                    }
                }
                break;
            default:
                break;
        }
        return isValid;
    }

    // type

    if (hasType(object, 'object')) {
        for (fieldName in object) {
            field = object[fieldName];

            if (hasType(schema[fieldName], 'undefined')) {
                $log.unknownProperty(fieldName, schema);
                return false;
            } else {
                typeSchema = schema[fieldName].type;
            }

            switch (true) {
                case isReference(typeSchema):
                    result = _isValidReference();
                    break;
                default:
                    result = _isValidType();
                    break;
            }
            if (!result) {
                break;
            }
        }

        // mandatory
        for (fieldName in schema) {
            field = schema[fieldName];
            mandatory = field.mandatory;
            if (mandatory === true && (hasType(object[fieldName], 'undefined') && object[fieldName] !== undefined)) {
                $log.missingProperty(fieldName);
                result = false;
                break;
            }
        }
    } else {
        result = false;
        $log.invalidPropertyFormat(object);
    }

    return result;
}


/*
 * Check if the object is compliant with the schema.
 * Use it to test if the constructor of an object is compliant
 * with the definition of the class.
 * @method isValidObject
 * @param {Object} object object to validate
 * @param {Object} schema schema that validates the object
 * @param {Boolean} strict true if validation is strict
 * @param {Boolean} cleanRef true if we remove the reference to the object
 * @return {Boolean} true is the object is compliant with the schema
 */
function isValidObject(object, schema, strict, cleanRef) {
    var fieldName = '',
        field = null,
        result = true,
        mandatory = true,
        typeSchema = '',
        typeRef = '',
        realType = '',
        length = 0,
        i = 0;

    if (hasType(strict, 'undefined')) {
        strict = true;
    }

    if (hasType(cleanRef, 'undefined')) {
        strict = false;
    }

    /*
     * Check if a field is compliant with a custom type.
     * @return {Boolean} the field is compliant with the custom type
     * @private
     */
    function _isValidCustomType(field, typeSchema) {
        var isValid = true,
            realType = '';

        realType = store.type[typeSchema];
        if (realType) {
            switch (true) {
                case !hasType(realType.schema, 'undefined'):
                    isValid = isValidObject(field, realType.schema);
                    break;
                case !hasType(realType.value, 'undefined'):
                    isValid = isValidEnum(field, realType);
                    break;
                default:
                    isValid = isValidType(field, realType.type);
                    break;
            }
        } else {
            isValid = false;
        }
        return isValid;
    }

    /*
     * Check if a field is compliant with the type of the reference.
     * @return {Boolean} the field is compliant with the type of the reference
     * @private
     */
    function _isValidReference(field, typeSchema) {
        var isValid = true,
            comp = null,
            isComponent = false;

        typeRef = getReference(typeSchema);
        if (field && field.id) {
            comp = field;
            isComponent = true;
        } else {
            comp = $component.get(field);
        }

        if (!hasType(comp, 'undefined')) {
            if (!inheritFrom(comp.constructor.name, typeRef)) {
                //if (getClassName(comp) !== typeRef) { uncomment this line for a strict mode
                isValid = false;
                $log.invalidType(field, typeRef);
            } else {
                if (isComponent && cleanRef) {
                    object[fieldName] = comp.id(); // store the id instead the full object 
                }
            }
        } else {
            // check for default value of an object ({} or null)
            switch (true) {
                case (hasType(field, 'object') && field !== null && Object.keys(field).length > 0):
                case hasType(field, 'string') && field !== '':
                    $log.canNotYetValidate(field, typeRef);
                    break;
                default:
                    break;
            }
        }
        return isValid;
    }

    /*
     * Check if a field is compliant with a type.
     * @return {Boolean} the field is compliant with the type
     * @private
     */
    function _isValidType(field, typeSchema) {
        var isValid = true,
            date = null,
            typeArray = '';

        realType = getRealType(typeSchema);
        switch (realType) {
            case 'any':
                break;
            case 'string':
                if (isCustomType(realType)) {
                    isValid = isValidObject(field, typeSchema);
                } else {
                    if (typeSchema === 'array') {
                        if (getRealType(field) !== 'array') {
                            $log.invalidPropertyType(fieldName, typeSchema, field);
                            isValid = false;
                            break;
                        }
                    } else {
                        if (typeSchema === 'date') {
                            date = new Date(field);
                            isValid = !isNaN(date.getDate());
                            if (!isValid) {
                                $log.invalidPropertyType(fieldName, typeSchema, field);
                                break;
                            }
                        } else {
                            if (getRealType(field) !== typeSchema && getRealType(field) !== 'any') {
                                $log.invalidPropertyType(fieldName, typeSchema, field);
                                isValid = false;
                                break;
                            }
                        }
                    }
                }
                break;
            case 'array':
                if (Array.isArray(field)) {
                    length = field.length;
                    typeArray = typeSchema[0];
                    for (i = 0; i < length; i++) {
                        if (isCustomType(typeArray)) {
                            isValid = isValidObject(field[i], store.type[typeArray].schema);
                        } else {
                            if (!isReference(typeArray)) {
                                if (getRealType(field[i]) !== typeArray && typeArray !== 'any') {
                                    $log.invalidPropertyType(field[i], typeArray, field[i]);
                                    isValid = false;
                                    break;
                                }
                            } else {
                                if (getRealType(field[i]) === 'string') {
                                    // Case of an import of a system
                                    if ($component.get(field[i])) {
                                        if (!inheritFrom(getClassName($component.get(field[i])), getReference(typeArray))) {
                                            $log.invalidClassName(JSON.stringify(field[i]), getReference(typeArray), getClassName($component.get(field[i])));
                                            isValid = false;
                                            break;
                                        }
                                    } else {
                                        if (field[i] !== '') {
                                            $log.canNotYetValidate(field[i], getReference(typeArray));
                                        }
                                    }
                                } else {
                                    if (!inheritFrom(getClassName(field[i]), getReference(typeArray))) {
                                        $log.invalidClassName(JSON.stringify(field[i]), getReference(typeArray), getClassName(field[i]));
                                        isValid = false;
                                        break;
                                    } else {
                                        if (cleanRef) {
                                            field[i] = field[i].id(); // store the id instead the full object
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    isValid = false;
                    $log.invalidType(field, 'array');
                }
                break;
            default:
                isValid = false;
                $log.unknownType(field);
                break;
        }
        return isValid;
    }


    // type
    for (fieldName in object) {
        field = object[fieldName];

        if (!hasType(schema[fieldName], 'undefined') || fieldName === '_core') {

            // case of _core
            if (fieldName !== '_core') {
                typeSchema = schema[fieldName].type;
            } else {
                typeSchema = 'boolean';
            }

            // cas of _id
            if (fieldName === '_id') {
                typeSchema = 'string';
            }

        } else {
            if (strict) {
                $log.unknownProperty(fieldName, schema);
                return false;
            } else {
                continue;
            }
        }

        switch (true) {
            case isCustomType(typeSchema):
                result = _isValidCustomType(field, typeSchema);
                break;
            case isReference(typeSchema):
                result = _isValidReference(field, typeSchema);
                break;
            default:
                result = _isValidType(field, typeSchema);
                break;
        }
    }

    // mandatory
    for (fieldName in schema) {
        field = schema[fieldName];
        mandatory = field.mandatory;
        if (hasType(object[fieldName], 'undefined')) {
            if (mandatory === true) {
                $log.missingProperty(fieldName);
                result = false;
            }
        }
    }

    return result;
}


/*
 * Prepare the object in order to be compliant with the schema.
 * @method prepareObject
 * @param {Object} object object to prepate
 * @param {Object} schema schema that validates the object
 */
function prepareObject(object, schema) {
    var fieldName = '',
        field = null,
        mandatory = true,
        defaultValue = '';

    // mandatory & default value
    for (fieldName in schema) {
        field = schema[fieldName];
        mandatory = field.mandatory;
        defaultValue = field.default;
        if (hasType(object[fieldName], 'undefined')) {
            if (mandatory === false && !hasType(defaultValue, 'undefined')) {
                object[fieldName] = defaultValue;
            }
        }
    }
}


/*
 * Get a schema.
 * @method getSchema
 * @param {String} name of the schema
 * @return {Object} the schema
 */
function getSchema(name) {
    var result = null;
    if (store.compiledSchemas[name]) {
        result = store.compiledSchemas[name];
    }
    return result;
}


/*
 * Get a model.
 * @method getModel
 * @param {String} name of the model
 * @return {Object} the model
 */
function getModel(name) {
    var result = null;
    if (store.generatedModels[name]) {
        result = store.generatedModels[name];
    }
    return result;
}


/*
 * Get a type.
 * @method getType
 * @param {String} name of the type
 * @return {Object} the type
 */
function getType(name) {
    var result = null;
    if (store.type[name] && store.type[name]) {
        result = JSON.parse(JSON.stringify(store.type[name]));
    }
    return result;
}


/*
 * Get the definition of the metamodel.
 * @method getMetaDef
 * @return {Object} the metadefinition of the metamodel
 */
function getMetaDef() {
    var result = store.metadef.schema;
    return result;
}


/*
 * Get parents of a schema if any.
 * @method get
 * @param {String} id id of the schema
 * @return {Array} id id of the parents
 */
function getParents(id) {
    var result = [];

    if (!store.inheritanceTree[id]) {
        result = [];
    } else {
        result = store.inheritanceTree[id].slice();
    }

    return result;
}

/*
 * Check if a class inherits from another one
 * @method inheritFrom
 * @param {String} name name of the class
 * @param {String} parentName name of the parent
 * @return {Boolean} true if the component inherit from the specific class name
 */
function inheritFrom(name, parentName) {
    var result = false,
        parents = [],
        i = 0,
        length = 0;

    /*
     * 
     * Check if a class inherits from another one
     * @method _searchParent
     * @param {String} className name of the class
     * @param {String} ancestorName of the parent
     * @returns {Boolean} true if the component inherit from the specific class name
     * @private
     */
    function _searchParent(className, ancestorName) {
        var isAncestor = false,
            parents = [],
            i = 0,
            length = 0;

        parents = getParents(className);
        if (parents.length !== 0) {
            if (parents.indexOf(ancestorName) !== -1) {
                isAncestor = true;
            } else {
                for (i = 0; i < length; i++) {
                    isAncestor = _searchParent(parents[i], ancestorName);
                    if (isAncestor) {
                        break;
                    }
                }
            }
        }
        return isAncestor;
    }

    if (name !== parentName) {
        parents = getParents(name);
        length = parents.length;

        if (parents.length !== 0) {
            if (parents.indexOf(parentName) !== -1) {
                result = true;
            } else {
                for (i = 0; i < length; i++) {
                    result = _searchParent(parents[i], parentName);
                    if (result) {
                        break;
                    }
                }
            }
        }
    } else {
        result = true;
    }

    return result;
}


/* exports */


/**
 * This module manages Runtime metamodel. <br>
 * Runtime metamodel loads schemas and types, analyzes them and creates the component classes and related RuntimeDatabaseCollections.
 * 
 * @module runtime
 * @submodule runtime-metamodel
 * @requires runtime-db
 * @requires runtime-log
 * @requires runtime-component
 * @requires runtime-workflow
 * @class runtime-metamodel
 * @static
 */


/**
 * Init the metamodel.
 * @method init
 */
exports.init = init;


/**
 * Remove the data of the metamodel from the memory.
 * @method clear
 */
exports.clear = clear;


/**
 * Add a new schema.
 * @method schema
 * @param {JSON} importedSchema a schema to add
 */
exports.schema = schema;


/**
 * Add a new model.
 * @method model
 * @param {JSON} importedModel a mode to add
 */
exports.model = model;


/**
 * Add a new type.
 * @method type
 * @param {JSON} importedType type to add
 */
exports.type = type;


/**
 * Create the metamodel.
 * @method create
 */
exports.create = create;


/**
 * Get a schema.
 * @method getSchema
 * @param {String} name name of the schema
 * @return {Object} the schema
 */
exports.getSchema = getSchema;


/**
 * Get a model.
 * @method getModel
 * @param {String} name name of the model
 * @return {Object} the model
 */
exports.getModel = getModel;


/**
 * Get the definition of the metamodel.
 * @method getMetaDef
 * @return {Object} the metadefinition of the metamodel
 */
exports.getMetaDef = getMetaDef;


/**
 * Get parents of a shema if any.
 * @method getParents
 * @param {String} id id of the schema
 * @return {Array} id id of the parents
 */
exports.getParents = getParents;


/**
 * Check if a class inherits from another one
 * @method inheritFrom
 * @param {String} name name of the class
 * @param {String} parentName name of the parent
 * @return {Boolean} true if the component inherit from the specific class name
 */
exports.inheritFrom = inheritFrom;


/**
 * Check if the object is compliant with the schema.
 * Use it to test if the constructor of an object is compliant
 * with the definition of the class.
 * @method isValidObject
 * @param {Object} object object to validate
 * @param {Object} schema schema that validates the object
 * @param {Boolean} strict true if validation is strict
 * @param {Boolean} cleanRef true if we remove the reference to the object
 * @return {Boolean} true is the object is compliant with the schema
 */
exports.isValidObject = isValidObject;


/**
 * Prepare the object in order to be compliant with the schema.
 * @method prepareObject
 * @param {Object} object object to prepare
 * @param {Object} schema schema that validates the object
 */
exports.prepareObject = prepareObject;


/**
 * Check if a value is compliant with a type.
 * @method isValidType
 * @param {Object} object object to validate
 * @param {String} type type to use for validation
 * @return {Boolean} true if the object is compliant with the type
 */
exports.isValidType = isValidType;


/**
 * Check if a value is compliant with a type enum.
 * @method isValidEnum
 * @param {String|Object} value value to validate
 * @param {Schema} schema schema to use for validation
 * @return {Boolean} true if the object is compliant with the enum
 */
exports.isValidEnum = isValidEnum;


/**
 * Check if the name is a correct state for the component.
 * @method isValidState
 * @param {String} name name of the state
 * @param {String} id component id
 * @return {Boolean} true if the name is a correct state for the component
 */
exports.isValidState = isValidState;


/**
 * Check if an attribute of the schema is an event.
 * @method isEvent
 * @param {String} name name of the attribute
 * @param {String} id component id
 * @return {Boolean} true if the attribute is an event
 */
exports.isEvent = isEvent;


/**
 * Check if an attribute of the schema is a property.
 * @method isProperty
 * @param {String} name name of the property
 * @param {String} id component id
 * @return {Boolean} true if the attribute is a property
 */
exports.isProperty = isProperty;


/**
 * Check if an attribute of the schema is a link.
 * @method isLink
 * @param {String} name name of the property
 * @param {String} id component id
 * @return {Boolean} true if the attribute is a link
 */
exports.isLink = isLink;


/**
 * Check if an attribute of the schema is a collection.
 * @method isCollection
 * @param {String} name name of the collection
 * @param {String} id component id
 * @return {Boolean} true if the attribute is a collection
 */
exports.isCollection = isCollection;


/**
 * Check if an attribute of the schema is a method.
 * @method isMethod
 * @param {String} name name of the method
 * @param {String} id component id
 * @return {Boolean} true if the attribute is a method
 */
exports.isMethod = isMethod;


/**
 * Check if an attribute of the schema is a structure.
 * @method isStructure
 * @param {String} name name of the propertys
 * @param {String} id component id
 * @return {Boolean} true if the property is a structure
 */
exports.isStructure = isStructure;


/**
 * Get a type.
 * @method getType
 * @param {String} name of the type
 * @return {Object} the type
 */
exports.getType = getType;
},{"./component.js":3,"./db.js":4,"./helper.js":5,"./log.js":6,"./workflow.js":10}],8:[function(require,module,exports){
(function (global){
/*
 * System Runtime
 * 
 * https://designfirst.io/systemruntime/
 * 
 * Copyright 2017 Erwan Carriou
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This module is the main module of Runtime. <br>
 * It inits Runtime metamodel and loads Runtime core system.
 * 
 * @module runtime
 * @requires runtime-component
 * @requires runtime-metamodel
 * @requires runtime-system
 * @requires runtime-helper
 * @main runtime
 * @class runtime
 * @static
 */

'use strict';

// add require at global level
if (typeof window === 'undefined' && typeof global !== 'undefined') {
    global.require = require;
}

var $db = require('./db.js');
var $component = require('./component.js');
var $metamodel = require('./metamodel.js');
var $system = require('../build/system/system.js');
var $helper = require('./helper.js');


/* Private Property */

var sytemId = '',
    system = '',
    channel = null;


/* Polyfill */
$helper.polyfill();

/* Init Metamodel */


$metamodel.init();


/* Init runtime from a system */


sytemId = $db.system($system.system);

system = $component.get(sytemId);
channel = $component.get('channel');

system.state('installed');
channel.$systemInstalled(sytemId);
system.state('resolved');
channel.$systemResolved(sytemId);
system.state('starting');
channel.$systemStarted(sytemId);

system.main(); // deprecated
system.start();

system.state('active');


/* exports */


/**
 * This module is the main module of Runtime. <br>
 * It inits Runtime metamodel and loads Runtime core system.
 * 
 * @module runtime
 * @requires runtime-component
 * @requires runtime-metamodel
 * @requires runtime-system
 * @main runtime
 * @class runtime
 * @static
 */


/**
 * Runtime instance.
 * @property runtime
 * @type Runtime
 */
module.exports = $component.get('runtime');
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../build/system/system.js":1,"./component.js":3,"./db.js":4,"./helper.js":5,"./metamodel.js":7}],9:[function(require,module,exports){
/*
 * System Runtime
 * 
 * https://designfirst.io/systemruntime/
 * 
 * Copyright 2017 Erwan Carriou
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * This module manages the states of all thecomponents.
 * 
 * @module runtime
 * @submodule runtime-state
 * @requires runtime-db
 * @class runtime-state
 * @static
 */

'use strict';

var $db = require('./db.js');


/* Private properties */


var store = {};


/* Public methods */


/*
 * Set the state of a component.
 * @method set
 * @param {String} id component id on which change the state
 * @param {String} state the new state of the component
 * @param {Object} parameters parameters
 */
function set(id, state, parameters) {
    store[id] = {
        "name": state,
        "parameters": {
            "data": parameters
        }
    };
    $db.store.RuntimeState[id] = {
        "name": state,
        "parameters": {
            "data": parameters
        }
    };
}


/*
 * Get the state of a component.
 * @method get 
 * @param {String} id id of the component
 * @return {String} state of the component
 */
function get(id) {
    return store[id];
}


/*
 * Remove all the states of the components from the memory.
 * @method clear
 */
function clear() {
    store = {};
}


/* exports */


/**
 * This module manages the states of all the components.
 * 
 * @module runtime
 * @submodule runtime-state
 * @requires runtime-db
 * @class runtime-state
 * @static
 */


/**
 * Set the state of a component.
 * @method set
 * @param {String} id component id on which change the state
 * @param {String} state the new state of the component
 */
exports.set = set;


/**
 * Get the state of a component.
 * @method get 
 * @param {String} id id of the component
 * @return {String} the state of the component.
 */
exports.get = get;


/**
 * Remove all the states of the components from the memory.
 * @method clear
 */
exports.clear = clear;
},{"./db.js":4}],10:[function(require,module,exports){
/*
 * System Runtime
 * 
 * https://designfirst.io/systemruntime/
 * 
 * Copyright 2017 Erwan Carriou
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This module manages the workflow of Runtime. It behaves like a workflow engine. <br>
 * It checks if the change of status of a component is valid to be executed. By valid, it means that:<br>
 * - the state is valid for the component, <br>
 * - the input (i.e. parameters) of all actions for the state are compliants with the model and <br>
 * - the output of all actions are compliants with the model. <br>
 * 
 * If an error occurs, the workflow will call the error state of the component and runtime. <br>
 * If the error can break the consistency of the current system, the worklow will stop.
 * 
 * @module runtime
 * @submodule runtime-workflow
 * @requires runtime-metamodel
 * @requires runtime-component
 * @requires runtime-behavior
 * @requires runtime-channel
 * @requires runtime-state
 * @requires runtime-helper
 * @requires runtime-log
 * @requires runtime-db
 * @class runtime-workflow 
 * @static
 */

'use strict';

var $metamodel = require('./metamodel.js');
var $component = require('./component.js');
var $behavior = require('./behavior.js');
var $state = require('./state.js');
var $helper = require('./helper.js');
var $log = require('./log.js');
var $db = require('./db.js');


/* Private methods */


/**
 * The RuntimeError class.
 * @class RuntimeError
 * @constructor
 * @param {String} message message of the error
 */
function RuntimeError(message) {
    this.message = message;
    this.name = "RuntimeError";
}
RuntimeError.prototype = new Error();
RuntimeError.prototype.constructor = RuntimeError;


/*
 * Get all the names of the parameter of a method.
 * @method getParamNames
 * @param {String} id id of the class
 * @param {String} methodName name of the method
 * @return {Array} the names of all parameters of the method for the class
 * @private
 */
function getParamNames(id, methodName) {
    var method = null,
        params = [],
        result = [],
        length = 0,
        i = 0;

    if ($metamodel.getModel(id)) {
        method = $metamodel.getModel(id)[methodName];
    } else {
        $log.unknownModel(id);
    }

    if (method) {
        params = method.params;
        if (params) {
            length = params.length;
            for (i = 0; i < length; i++) {
                result.push(params[i].name);
            }
        }
    } else {
        $log.unknownMethod(id, methodName);
    }
    return result;
}


/* 
 * Get the number of parameters of a method.
 * @method getParamNumber
 * @param {String} id id of the class
 * @param {String} methodName name of the method
 * @return {Array} number of parameters min and max for the method
 * @private
 */
function getParamNumber(id, methodName) {
    var method = null,
        params = [],
        result = [],
        length = 0,
        i = 0,
        min = 0,
        max = 0;

    if ($metamodel.getModel(id)) {
        method = $metamodel.getModel(id)[methodName];
    } else {
        $log.unknownModel(id);
    }

    if (method) {
        params = method.params;
        if (params) {
            length = params.length;
            for (i = 0; i < length; i++) {
                if (typeof params[i].mandatory === 'undefined' || params[i].mandatory === true) {
                    min = min + 1;
                }
                max = max + 1;
            }
        }
        result.push(min);
        result.push(max);
    } else {
        $log.unknownMethod(id, methodName);
    }
    return result;
}


/* 
 * Set the default value of the non mandatory parameters of a method.
 * @method setDefaultValue
 * @param {String} id id of the class
 * @param {String} methodName name of the method
 * @param {Array} args arguments
 * @return {Array} arguments with default values
 * @private
 */
function setDefaultValue(id, methodName, args) {
    var method = null,
        params = [],
        result = [],
        length = 0,
        i = 0;

    method = $metamodel.getModel(id)[methodName];
    if (method) {
        params = method.params;
        if (params) {
            length = params.length;
            for (i = 0; i < length; i++) {
                if (params[i].mandatory === false && typeof args[i] === 'undefined') {
                    result.push(params[i].default);
                } else {
                    result.push(args[i]);
                }
            }
        }
    } else {
        $log.unknownMethod(id, methodName);
    }
    return result;
}


/*
 * Get the type returned by a method.
 * @method getReturnType
 * @param {String} id id of the class
 * @param {String} methodName name of the method
 * @return {String} the type returned by the method
 * @private
 */
function getReturnType(id, methodName) {
    var resultType = null,
        result = null;

    if ($metamodel.getModel(id)) {
        resultType = $metamodel.getModel(id)[methodName].result;
    } else {
        $log.unknownModel(id);
    }

    if (resultType) {
        result = resultType;
    }
    return result;
}


/*
 * Get all the type of the parameters of a method
 * @method getParamTypes
 * @param {String} id id of the class
 * @param {String} methodName name of the method
 * @return {Array} the types of the parameters of a method
 * @private
 */
function getParamTypes(id, methodName) {
    var method = null,
        params = [],
        result = [],
        length = 0,
        i = 0;

    if ($metamodel.getModel(id)) {
        method = $metamodel.getModel(id)[methodName];
    } else {
        $log.unknownModel(id);
    }

    if (method) {
        params = method.params;
        if (params) {
            length = params.length;
            for (i = 0; i < length; i++) {
                result.push(params[i].type);
            }
        }
    } else {
        $log.unknownMethod(id, methodName);
    }
    return result;
}


/*
 * Check if conditions on output are compliant with the metamodel
 * @method checkResult
 * @param {Object} params
 * @return {Boolean} true if conditions on ouput are compliant with the metamodel
 * @private
 */
function checkResult(params) {
    params = params || {};

    var component = params.component || null,
        methodName = params.methodName || '',
        methodResult = null,
        componentClassName = '',
        returnType = null,
        result = true;

    if (typeof params.methodResult !== 'undefined') {
        methodResult = params.methodResult;
    } else {
        methodResult = undefined;
    }

    if (component.constructor.name === 'Function') {
        componentClassName = component.name;
    } else {
        componentClassName = component.constructor.name;
    }

    returnType = getReturnType(componentClassName, methodName);

    if (returnType !== null) {
        switch (true) {
            case returnType === 'any':
                break;
            case returnType === 'array':
                if (!Array.isArray(methodResult)) {
                    result = false;
                    $log.invalidResultType(component.id(), component.constructor.name, methodName, returnType, null);
                }
                break;
            default:
                if (typeof methodResult !== returnType) {
                    result = false;
                    $log.invalidResultType(component.id(), component.constructor.name, methodName, returnType, typeof methodResult);
                }
                break;
        }
    }

    return result;
}


/*
 * Get the actions of the specified state
 * @method getActions
 * @param {Object} component a Runtime component
 * @param {String} name name of the state
 * @param {Boolean} isEvent true if the state is an event
 * @return {Array} list of the actions
 * @private
 */
function getActions(component, name, isEvent) {
    var action = $behavior.getActions(component.id(), name),
        parents = [],
        length = 0,
        i = 0,
        parent = null;

    if (!action.length || isEvent) {
        if (component.constructor.name !== 'Function') {
            action = action.concat(getActions($component.get(component.constructor.name), name, isEvent));
        } else {
            parents = $metamodel.getParents(component.name);
            length = parents.length;
            for (i = 0; i < length; i++) {
                parent = $component.get(parents[i]);
                if (parent) {
                    action = action.concat(getActions(parent, name, isEvent));
                } else {
                    $log.unknownComponent(parents[i], component.name);
                }
                if (action.length) {
                    break;
                }
            }
        }
    }

    if (action.length) {
        action.reverse();
    }

    return action;
}


/*
 * Call an action and make some Dependency Injection if it is a core action
 * @method callAction
 * @param {Component} component
 * @param {String} state name of the state
 * @param {Object} action action
 * @param {Array} params parameters of the action
 * @param {Boolean} isEvent is the action a callback of an event
 * @return {Boolean} result of the action
 */
function callAction(component, state, action, params, isEvent) {
    var result = null,
        injectedParams = [],
        componentClassName = '',
        i = 0,
        length = 0;

    if (component.constructor.name === 'Function') {
        componentClassName = component.name;
    } else {
        componentClassName = component.constructor.name;
    }

    if (!$metamodel.isProperty(state, componentClassName) && !$metamodel.isLink(state, componentClassName) && !$metamodel.isCollection(state, componentClassName)) {
        params = setDefaultValue(componentClassName, state, params);
    }

    try {
        length = params.length;
        for (i = 0; i < length; i++) {
            injectedParams.push(params[i]);
        }
        if (action.useCoreAPI) {
            injectedParams.push($component);
            injectedParams.push($db);
            injectedParams.push($metamodel);
            injectedParams.push(exports);
            injectedParams.push($behavior);
            injectedParams.push($state);
            injectedParams.push($log);
        }

        if (isEvent) {
            setTimeout(action.action.bind.apply(action.action, [component].concat(injectedParams)), 0);
        } else {
            result = action.action.apply(component, injectedParams);
        }
    } catch (e) {
        if (e instanceof RuntimeError) {
            throw e;
        } else {
             /* jshint -W054 */
            if (new Function() === undefined) {
             /* jshint +W054 */    
                console.error('runtime: can not execute new Function() instruction in the current context.');
            } else {
                if (component && component.error) {
                    component.error({
                        "message": "error when trying to call the method '" + state + "' on component '" + component.id() + "'",
                        "error": e
                    });
                }
                if ($helper.getRuntime()) {
                    $helper.getRuntime().error({
                        "message": "error when trying to call the method '" + state + "' on component '" + component.id() + "'",
                        "error": e
                    });
                }
                $log.actionInvokeError(state, component.id(), component.constructor.name, e.message);
            }
        }
    }

    return result;
}


/* Public methods */


/*
 * Check if an action has the valid number of parameter.
 * @method validParamNumbers
 * @param {String} className name the class
 * @param {String} state state on which the action applied
 * @param {Function} action action
 * @return {Boolean} true if the action is the valid number of parameters
 */
function validParamNumbers(className, state, action) {
    var func = '',
        beginBody = -1,
        header = '',
        funcParams = '',
        params = [],
        paramNumber = 0,
        modelNumberParam = [],
        isProperty = false,
        isLink = false,
        isCollection = false,
        result = false;

    // check number of parameters of the action
    func = action.toString();
    beginBody = func.indexOf('{');
    header = func.substring(0, beginBody);
    funcParams = header.split('(')[1].replace(')', '').trim();
    params = funcParams.split(',');
    if (params[0] === '') {
        params = [];
    }
    paramNumber = params.length;

    // get the number min and max of valid parameters
    isProperty = $metamodel.isProperty(state, className);
    isLink = $metamodel.isLink(state, className);
    isCollection = $metamodel.isCollection(state, className);

    switch (true) {
        case isCollection:
            modelNumberParam = [2, 2];
            break;
        case isProperty:
            modelNumberParam = [1, 1];
            break;
        case isLink:
            modelNumberParam = [1, 1];
            break;
        default:
            modelNumberParam = getParamNumber(className, state);
            break;
    }

    // compare
    if (modelNumberParam[0] <= paramNumber && paramNumber <= modelNumberParam[1]) {
        result = true;
    }

    return result;
}


/*
 * Check if conditions on input are compliant with the model before calling the action.
 * @method checkParams
 * @param {Object} params
 * @return {Boolean} true if condition on input are compliant with the model
 */
function checkParams(params) {
    params = params || {};

    var component = params.component || null,
        methodName = params.methodName || '',
        args = params.args || '',
        paramsName = [],
        paramsType = [],
        paramsNumber = [],
        componentClassName = '',
        length = args.length,
        i = 0,
        param = null,
        result = true,
        isProperty = false,
        isLink = false,
        isCollection = false;

    if (component.constructor.name === 'Function') {
        componentClassName = component.name;
    } else {
        componentClassName = component.constructor.name;
    }

    isProperty = $metamodel.isProperty(methodName, componentClassName);
    isLink = $metamodel.isLink(methodName, componentClassName);
    isCollection = $metamodel.isCollection(methodName, componentClassName);
    paramsName = getParamNames(componentClassName, methodName);

    switch (true) {
        case isCollection:
            paramsType = [$metamodel.getModel(componentClassName)[methodName].type[0], 'string'];
            paramsNumber = [2, 2];
            break;
        case isProperty:
            paramsType = [$metamodel.getModel(componentClassName)[methodName].type];
            paramsNumber = [1, 1];
            break;
        case isLink:
            paramsType = [$metamodel.getModel(componentClassName)[methodName].type];
            paramsNumber = [1, 1];
            break;
        default:
            paramsType = getParamTypes(componentClassName, methodName);
            paramsNumber = getParamNumber(componentClassName, methodName);
            break;
    }

    // case of object
    if (typeof length === 'undefined') {
        length = 1;
    }

    if (length < paramsNumber[0] || paramsNumber[1] < length) {
        result = false;
        $log.invalidParamNumber(component.id(), component.constructor.name, methodName);
    }

    for (i = 0; i < length; i++) {
        param = args[i];
        if (typeof param === 'undefined') {
            if (i < paramsNumber[0]) {
                result = false;
                $log.invalidParamNumber(component.id(), component.constructor.name, methodName);
            } else {
                continue;
            }
        } else {
            if (!$metamodel.isValidType(param, paramsType[i])) {
                result = false;
                $log.invalidParamType(component.id(), component.constructor.name, methodName, paramsName[i]);
            }
        }
    }

    return result;
}


/*
 * Call an action that comes from an event.
 * @method action
 * @param {String} behaviorId id of the behavior
 * @param {Array} params parameters
 */
function action(behaviorId, params) {
    var isEvent = false,
        isProperty = false,
        isLink = false,
        isCollection = false,
        behaviors = [],
        behavior = null,
        component = null,
        componentClassName = '',
        actionFromMemory = null;

    behaviors = $db.RuntimeBehavior.find({
        "_id": behaviorId
    });

    actionFromMemory = $behavior.get(behaviorId);

    if (behaviors.length === 1) {
        behavior = behaviors[0];

        component = $component.get(behavior.component);
        if (component) {

            if (component.constructor.name === 'Function') {
                componentClassName = component.name;
            } else {
                componentClassName = component.constructor.name;
            }

            isEvent = $metamodel.isEvent(behavior.state, componentClassName);
            isProperty = $metamodel.isProperty(behavior.state, componentClassName);
            isLink = $metamodel.isLink(behavior.state, componentClassName);
            isCollection = $metamodel.isCollection(behavior.state, componentClassName);

            if (isEvent || isProperty || isCollection || isLink) {
                callAction(component, behavior.state, {
                    "useCoreAPI": behavior.useCoreAPI,
                    "action": actionFromMemory
                }, params, true);
            }
        }
    }
}


/*
 * Change the state of a component.
 * 
 * Worklow:<br>
 * <br>
 * 0. Check if the component has not been destroyed <br>
 * 1. Check if the state is a method, a property or an event <br>
 * 2. Search if there is a behavior with actions for the new state <br>
 * 3. If so, get the action(s) <br>
 * 4. Check if the inputs are compliants with the metamodel <br>
 * 5. Call the action(s) <br>
 * 6. If a method, check if the output are compliants with the metamodel <br>
 * 7. If all is ok, the state of the component is updated <br>
 * 8. Return the result <br>
 * 
 * @method state
 * @param {Object} params params to change the state <br>
 * {String} component id of the component <br>
 * {String} state state of the component <br>
 * {Array} data parameters to send to the action
 */
function state(params) {

    params = params || {};
    params.component = params.component || '';
    params.state = params.state || '';
    params.data = params.data || [];

    var component = null,
        currentState = '',
        actions = [],
        action = null,
        result = null,
        i = 0,
        length = 0,
        componentClassName = false,
        isProperty = false,
        isLink = false,
        isCollection = false,
        isEvent = false;

    currentState = $state.get(params.component);

    if (currentState === 'destroy') {
        $log.invalidUseOfComponent(params.component);
    }

    component = $component.get(params.component);
    if (component) {

        if (component.constructor.name === 'Function') {
            componentClassName = component.name;
        } else {
            componentClassName = component.constructor.name;
        }
        isEvent = $metamodel.isEvent(params.state, componentClassName);
        isProperty = $metamodel.isProperty(params.state, componentClassName);
        isLink = $metamodel.isLink(params.state, componentClassName);
        isCollection = $metamodel.isCollection(params.state, componentClassName);
        actions = getActions(component, params.state, isEvent);
    }

    if (actions.length) {

        if (checkParams({
            "component": component,
            "methodName": params.state,
            "args": params.data
        })) {

            if (!isEvent &&
                !isProperty &&
                !isLink &&
                !isCollection) {
                action = actions[0];
                result = callAction(component, params.state, action, params.data, false);

                checkResult({
                    "component": component,
                    "methodName": params.state,
                    "methodResult": result
                });

            } else {

                length = actions.length;
                for (i = 0; i < length; i++) {
                    action = actions[i];
                    callAction(component, params.state, action, params.data, true);
                }

                $state.set(component.id(), params.state, params.data);
            }
        }
        return result;
    } else {
        if (component && (isEvent || isProperty || isLink || isCollection)) {
            $state.set(component.id(), params.state, params.data);
        }
    }
}


/*
 * Stop the workflow engine.
 * @method stop
 * @param {Object} params parameters <br>
 * {Boolean} error true if the stop of the workflow is due to an error (default false) <br>
 * {String} message error message to log (default '')
 */
function stop(params) {
    params = params || {};

    if (typeof params.error === 'undefined') {
        params.error = false;
    }
    params.message = params.message || '';

    exports.state = function () {
    };

    if (params.error) {
        if (params.message) {
            throw new RuntimeError('runtime has been stopped because ' + params.message);
        } else {
            throw new RuntimeError('runtime has been stopped because of an unknown error');
        }
    } else {
        if (params.message) {
            console.error('runtime: runtime has been stopped because ' + params.message);
        } else {
            console.error('runtime: runtime has been stopped');
        }
    }
}


/*
 * Restart the workflow engine from the last state.
 * @method restart
 */
function restart() {
    exports.state = state;
    $log.workflowRestarted();
}


/* exports */


/**
 * This module manages the workflow of Runtime. It behaves like a workflow engine. <br>
 * It checks if the change of status of a component is valid to be executed. By valid, it means that:<br>
 * - the state is valid for the component, <br>
 * - the input (i.e. parameters) of all actions for the state are compliants with the model and <br>
 * - the output of all actions are compliants with the model. <br>
 * 
 * If an error occurs, the workflow will call the error state of the component and of Runtime instance. <br>
 * If the error can break the consistency of the current system, the worklow will stop.
 * 
 * @module runtime
 * @submodule runtime-workflow
 * @requires runtime-metamodel
 * @requires runtime-component
 * @requires runtime-behavior
 * @requires runtime-channel
 * @requires runtime-state
 * @requires runtime-helper
 * @requires runtime-log
 * @requires runtime-db
 * @class runtime-workflow 
 * @static
 */


/**
 * Change the state of a component.
 * 
 * Worklow:<br>
 * <br>
 * 0. Check if the component has not been destroyed <br>
 * 1. Check if the state is a method or an event <br>
 * 2. Search if there is a behavior with an action for the new state <br>
 * 3. If so, get the action(s) <br>
 * 4. Check if the conditons on input are compliant with the metamodel <br>
 * 5. Call the action(s) <br>
 * 6. If not an of event, check if the conditons on input are compliant with the metamodel <br>
 * 7. If all is ok, the state of the component is updated <br>
 * 8. Return the result <br>
 * 
 * @method state
 * @param {Object} params params to change the state <br>
 * {String} component id of the component <br>
 * {String} state state of the component <br>
 * {Array} data parameters to send to the action
 */
exports.state = state;


/**
 * Stop the workflow engine.
 * @method stop
 * @param {Object} params parameters <br>
 * {Boolean} error true if the stop of the workflow is due to an error (default false) <br>
 * {String} message error message to log (default '')
 */
exports.stop = stop;


/**
 * Restart the workflow engine from the last state.
 * @method restart
 */
exports.restart = restart;


/**
 * Check if conditions on input are compliant with the model before calling the action.
 * @method checkParams
 * @param {Object} params
 * @return {Boolean} true if condition on input are compliant with the model
 */
exports.checkParams = checkParams;


/**
 * Check if an action has the valid number of parameter.
 * @method validParamNumbers
 * @param {String} className name the class
 * @param {String} state state on which the action applied
 * @param {Function} action action
 * @return {Boolean} true if the action is the valid number of parameters
 */
exports.validParamNumbers = validParamNumbers;


/**
 * Call an action that comes from an event.
 * @method action
 * @param {String} behaviorId id of the behavior
 * @param {Array} params parameters
 */
exports.action = action;
},{"./behavior.js":2,"./component.js":3,"./db.js":4,"./helper.js":5,"./log.js":6,"./metamodel.js":7,"./state.js":9}]},{},[8])(8)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9zeXN0ZW0vc3lzdGVtLmpzIiwic3JjL2JlaGF2aW9yLmpzIiwic3JjL2NvbXBvbmVudC5qcyIsInNyYy9kYi5qcyIsInNyYy9oZWxwZXIuanMiLCJzcmMvbG9nLmpzIiwic3JjL21ldGFtb2RlbC5qcyIsInNyYy9ydW50aW1lLmpzIiwic3JjL3N0YXRlLmpzIiwic3JjL3dvcmtmbG93LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2o4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcGhEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hnQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzd0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdHlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICogU3lzdGVtIFJ1bnRpbWVcbiAqIFxuICogaHR0cHM6Ly9kZXNpZ25maXJzdC5pby9zeXN0ZW1ydW50aW1lL1xuICogXG4gKiBDb3B5cmlnaHQgMjAxNyBFcndhbiBDYXJyaW91XG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBjb250YWlucyBSdW50aW1lIGNvcmUgc3lzdGVtLlxuICpcbiAqIEBtb2R1bGUgcnVudGltZVxuICogQHN1Ym1vZHVsZSBydW50aW1lLXN5c3RlbVxuICogQGNsYXNzIHJ1bnRpbWUtc3lzdGVtXG4gKiBAc3RhdGljIFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuXG4vKiBQdWJsaWMgcHJvcGVydGllcyAqL1xuXG5cbi8qXG4gKiBSdW50aW1lIGNvcmUgc3lzdGVtXG4gKiBAcHJvcGVydHkge1J1bnRpbWVTeXN0ZW19IHN5c3RlbVxuICovXG52YXIgc3lzdGVtID0ge1xuICAgIFwibW9kZWxzXCI6IHtcbiAgICAgICAgXCIxMzhhODFmYTFmMTY0MzVcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxMzhhODFmYTFmMTY0MzVcIixcbiAgICAgICAgICAgIFwiX25hbWVcIjogXCJSdW50aW1lQWRtaW5cIixcbiAgICAgICAgICAgIFwiX2luaGVyaXRcIjogW1xuICAgICAgICAgICAgICAgIFwiUnVudGltZUNvbXBvbmVudFwiXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJfY29yZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJzdGFydFwiOiB7fSxcbiAgICAgICAgICAgIFwiZGVzaWduZXJXaW5kb3dcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICAgIFwicmVhZE9ubHlcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCIxMzVjNzEwNzg4MTBhZjJcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxMzVjNzEwNzg4MTBhZjJcIixcbiAgICAgICAgICAgIFwiX25hbWVcIjogXCJSdW50aW1lQ2hhbm5lbFwiLFxuICAgICAgICAgICAgXCJfaW5oZXJpdFwiOiBbXG4gICAgICAgICAgICAgICAgXCJSdW50aW1lQ29tcG9uZW50XCJcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIl9jb3JlXCI6IHRydWUsXG4gICAgICAgICAgICBcIiRlZGl0b3JVcGRhdGVTY2hlbWFOYW1lXCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIkZGVzaWduZXJTeW5jXCI6IHt9LFxuICAgICAgICAgICAgXCIkYXBwTG9hZFN5c3RlbVwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic3lzdGVtXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIiRkZXNpZ25lckNyZWF0ZUJlaGF2aW9yXCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJiZWhhdmlvclwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIlxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIkZWRpdG9yVXBkYXRlQmVoYXZpb3JcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYmVoYXZpb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIkZGVzaWduZXJVcGRhdGVCZWhhdmlvclwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJiZWhhdmlvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIiRlZGl0b3JEZWxldGVCZWhhdmlvclwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJGRlc2lnbmVyRGVsZXRlQmVoYXZpb3JcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIiRkZXNpZ25lckNyZWF0ZUNvbXBvbmVudFwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbGxlY3Rpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIiRlZGl0b3JVcGRhdGVDb21wb25lbnRcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29sbGVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29tcG9uZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJGRlc2lnbmVyVXBkYXRlQ29tcG9uZW50XCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbGxlY3Rpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIiRlZGl0b3JEZWxldGVDb21wb25lbnRcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29sbGVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIiRkZXNpZ25lckRlbGV0ZUNvbXBvbmVudFwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb2xsZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJGRlc2lnbmVyQ3JlYXRlVHlwZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ0eXBlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJGVkaXRvclVwZGF0ZVR5cGVcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidHlwZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIiRlZGl0b3JEZWxldGVUeXBlXCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIkZGVzaWduZXJDcmVhdGVTY2hlbWFcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic2NoZW1hXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJGVkaXRvclVwZGF0ZVNjaGVtYVwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzY2hlbWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIkZWRpdG9yVXBkYXRlU2NoZW1hSWRcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJvbGRJZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibmV3SWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIkZGVzaWduZXJEZWxldGVTY2hlbWFcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIiRkZXNpZ25lckNyZWF0ZU1vZGVsXCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm1vZGVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJGVkaXRvclVwZGF0ZU1vZGVsXCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm1vZGVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJGRlc2lnbmVyVXBkYXRlTW9kZWxcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibW9kZWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIkZWRpdG9yVXBkYXRlTW9kZWxJZFwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm9sZElkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJuZXdJZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIiRkZXNpZ25lckRlbGV0ZU1vZGVsXCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIkZWRpdG9yVXBkYXRlU3lzdGVtXCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInN5c3RlbVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIiRhcHBMb2dEZWJ1Z1wiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIkYXBwTG9nSW5mb1wiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIkYXBwTG9nV2FyblwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIkYXBwTG9nRXJyb3JcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJHJ1bnRpbWVDcmVhdGVDb21wb25lbnRcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb2xsZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb21wb25lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIkcnVudGltZURlbGV0ZUNvbXBvbmVudFwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb2xsZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJHJ1bnRpbWVVcGRhdGVDb21wb25lbnRcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29sbGVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInZhbHVlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJhbnlcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2VuZFwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJtZXNzYWdlXCJcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJHN5c3RlbUluc3RhbGxlZFwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIiRzeXN0ZW1SZXNvbHZlZFwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIiRzeXN0ZW1Vbmluc3RhbGxlZFwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIiRzeXN0ZW1TdGFydGVkXCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJHN5c3RlbVN0b3BwZWRcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjogXCJcIlxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiMWY0MTQxNjcxNTE0YzJjXCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMWY0MTQxNjcxNTE0YzJjXCIsXG4gICAgICAgICAgICBcIl9uYW1lXCI6IFwiUnVudGltZVN0b3JhZ2VcIixcbiAgICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJrZXlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImtleVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmFsdWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImFueVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJjaGFuZ2VkXCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjaGFuZ2VkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjoge31cbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiY2xlYXJcIjoge30sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwia2V5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjogXCJcIlxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJfY29yZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJzdG9yZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjoge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCIxNGM3YzEwNWIzMWExNjBcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxNGM3YzEwNWIzMWExNjBcIixcbiAgICAgICAgICAgIFwiX25hbWVcIjogXCJSdW50aW1lXCIsXG4gICAgICAgICAgICBcIl9jb3JlXCI6IHRydWUsXG4gICAgICAgICAgICBcInZlcnNpb25cIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIFwicmVhZE9ubHlcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIjAuMC4wXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInN5c3RlbVwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicGFyYW1zXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImFueVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIFwicmVzdWx0XCI6IFwib2JqZWN0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIm1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm1zZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJtZXNzYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWVcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwicmVhZHlcIjoge31cbiAgICAgICAgfSxcbiAgICAgICAgXCIxNjY5NzFmZDlkMTA3ZmRcIjoge1xuICAgICAgICAgICAgXCJfbmFtZVwiOiBcIlJ1bnRpbWVCZWhhdmlvclwiLFxuICAgICAgICAgICAgXCJfY29yZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJjb3JlXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJib29sZWFuXCIsXG4gICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInVzZUNvcmVBUElcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIixcbiAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImFjdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiamF2YXNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIFwicmVhZE9ubHlcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjogXCJcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic3RhdGVcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIFwicmVhZE9ubHlcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjogXCJcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTY2OTcxZmQ5ZDEwN2ZkXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCIxNTgzMjFkY2VkMTAxNGFcIjoge1xuICAgICAgICAgICAgXCJfbmFtZVwiOiBcIlJ1bnRpbWVDbGFzc0luZm9cIixcbiAgICAgICAgICAgIFwiX2NvcmVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibW9kZWxcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICAgIFwicmVhZE9ubHlcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiB7fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwicHJvcGVydHlcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICBcInJlc3VsdFwiOiBcIm9iamVjdFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgICAgICAgICAgICBcInJlc3VsdFwiOiBcImFycmF5XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImxpbmtcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICBcInJlc3VsdFwiOiBcIm9iamVjdFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJsaW5rc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJyZXN1bHRcIjogXCJhcnJheVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJtZXRob2RcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICBcInJlc3VsdFwiOiBcIm9iamVjdFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJtZXRob2RzXCI6IHtcbiAgICAgICAgICAgICAgICBcInJlc3VsdFwiOiBcImFycmF5XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImNvbGxlY3Rpb25cIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICBcInJlc3VsdFwiOiBcIm9iamVjdFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJjb2xsZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJyZXN1bHRcIjogXCJhcnJheVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJldmVudFwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIFwicmVzdWx0XCI6IFwib2JqZWN0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImV2ZW50c1wiOiB7XG4gICAgICAgICAgICAgICAgXCJyZXN1bHRcIjogXCJhcnJheVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJfaWRcIjogXCIxNTgzMjFkY2VkMTAxNGFcIixcbiAgICAgICAgICAgIFwic2NoZW1hXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjoge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCIxMjM3NTFjYjU5MWRlMjZcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxMjM3NTFjYjU5MWRlMjZcIixcbiAgICAgICAgICAgIFwiX25hbWVcIjogXCJSdW50aW1lQ29tcG9uZW50XCIsXG4gICAgICAgICAgICBcIl9jb3JlXCI6IHRydWUsXG4gICAgICAgICAgICBcIm9uXCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImhhbmRsZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidXNlQ29yZUFQSVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYm9vbGVhblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaXNDb3JlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJib29sZWFuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwib2ZmXCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYmVoYXZpb3JJZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwicmVxdWlyZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZGVzdHJveVwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImNsYXNzSW5mb1wiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiQFJ1bnRpbWVDbGFzc0luZm9cIixcbiAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiB7fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiaW5pdFwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29uZlwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIlxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlcnJvclwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZGF0YVwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJlcnJvclBhcmFtXCJcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIjE4YTUxMTY5ZDcxMTJkNFwiOiB7XG4gICAgICAgICAgICBcIl9uYW1lXCI6IFwiUnVudGltZURhdGFiYXNlXCIsXG4gICAgICAgICAgICBcIl9jb3JlXCI6IHRydWUsXG4gICAgICAgICAgICBcInN5c3RlbVwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic3lzdGVtXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIFwicmVzdWx0XCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInN1YnN5c3RlbVwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicGFyYW1zXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgXCJyZXN1bHRcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiY29sbGVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgIFwicmVzdWx0XCI6IFwib2JqZWN0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImluc2VydFwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZXZlbnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiZGJJbnNlcnRFdmVudFwiXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZXZlbnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiZGJVcGRhdGVFdmVudFwiXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZXZlbnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiZGJSZW1vdmVFdmVudFwiXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIl9pZFwiOiBcIjE4YTUxMTY5ZDcxMTJkNFwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiMTZiOWQxYWMyMjE2ZmZlXCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTZiOWQxYWMyMjE2ZmZlXCIsXG4gICAgICAgICAgICBcIl9uYW1lXCI6IFwiUnVudGltZUxvZ2dlclwiLFxuICAgICAgICAgICAgXCJfY29yZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJsZXZlbFwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwibG9nXCIsXG4gICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjogXCJ3YXJuXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImRlYnVnXCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJtZXNzYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImFueVwiXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImluZm9cIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYW55XCJcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwid2FyblwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJhbnlcIlxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlcnJvclwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJhbnlcIlxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiMWQ5YjYxMzk0MTFhYTkxXCI6IHtcbiAgICAgICAgICAgIFwiX25hbWVcIjogXCJSdW50aW1lTWVzc2FnZVwiLFxuICAgICAgICAgICAgXCJfY29yZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJldmVudFwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJmcm9tXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImFycmF5XCIsXG4gICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBbXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMWQ5YjYxMzk0MTFhYTkxXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCIxNjI4YzEzYzIyMTUyZTZcIjoge1xuICAgICAgICAgICAgXCJfbmFtZVwiOiBcIlJ1bnRpbWVNZXRhbW9kZWxcIixcbiAgICAgICAgICAgIFwiX2NvcmVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwic2NoZW1hXCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzY2hlbWFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCJcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICBcInJlc3VsdFwiOiBcImFueVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJtb2RlbFwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibW9kZWxcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCJcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICBcInJlc3VsdFwiOiBcImFueVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ0eXBlXCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ0eXBlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgXCJyZXN1bHRcIjogXCJhbnlcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTYyOGMxM2MyMjE1MmU2XCJcbiAgICAgICAgfSxcbiAgICAgICAgXCIxNzdhYzEzNjg5MTYyOWZcIjoge1xuICAgICAgICAgICAgXCJfbmFtZVwiOiBcIlJ1bnRpbWVTdGF0ZVwiLFxuICAgICAgICAgICAgXCJfY29yZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJuYW1lXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInBhcmFtZXRlcnNcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICAgIFwicmVhZE9ubHlcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IHt9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJfaWRcIjogXCIxNzdhYzEzNjg5MTYyOWZcIlxuICAgICAgICB9LFxuICAgICAgICBcIjE3MDUyMWI4ODYxNDM4N1wiOiB7XG4gICAgICAgICAgICBcIl9uYW1lXCI6IFwiUnVudGltZVN5c3RlbVwiLFxuICAgICAgICAgICAgXCJfY29yZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJuYW1lXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIm1hc3RlclwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYm9vbGVhblwiLFxuICAgICAgICAgICAgICAgIFwicmVhZE9ubHlcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJzdWJzeXN0ZW1cIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIixcbiAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidmVyc2lvblwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjogXCIwLjAuMVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjogXCJcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2NoZW1hc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjoge31cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIm1vZGVsc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjoge31cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImJlaGF2aW9yc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjoge31cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInR5cGVzXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiB7fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiY29tcG9uZW50c1wiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjoge31cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlYWR5XCI6IHt9LFxuICAgICAgICAgICAgXCJzeW5jXCI6IHt9LFxuICAgICAgICAgICAgXCJtYWluXCI6IHt9LFxuICAgICAgICAgICAgXCJfaWRcIjogXCIxNzA1MjFiODg2MTQzODdcIlxuICAgICAgICB9LFxuICAgICAgICBcIjEwMGI5MWVkMjIxMWIxNVwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjEwMGI5MWVkMjIxMWIxNVwiLFxuICAgICAgICAgICAgXCJfbmFtZVwiOiBcIlJ1bnRpbWVPU0dpXCIsXG4gICAgICAgICAgICBcImluc3RhbGxcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ1cmxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImFueVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImFzeW5jXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJib29sZWFuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicmVzdWx0XCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInVuaW5zdGFsbFwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInN0YXJ0XCI6IHtcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbe1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic3RvcFwiOiB7XG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW3tcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInN0YXR1c1wiOiB7XG4gICAgICAgICAgICAgICAgXCJyZXN1bHRcIjogXCJvYmplY3RcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiX2NvcmVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiYnVuZGxlXCI6IHtcbiAgICAgICAgICAgICAgICBcInJlc3VsdFwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiMWIyODExYjA5MjE0M2Y1XCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMWIyODExYjA5MjE0M2Y1XCIsXG4gICAgICAgICAgICBcIl9uYW1lXCI6IFwiUnVudGltZVN5c3RlbU9TR2lcIixcbiAgICAgICAgICAgIFwic3RhcnRcIjoge30sXG4gICAgICAgICAgICBcInN0b3BcIjoge30sXG4gICAgICAgICAgICBcIl9jb3JlXCI6IHRydWUsXG4gICAgICAgICAgICBcInN0YXRlXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIm5vbmVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwibG9jYXRpb25cIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIFwicmVhZE9ubHlcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInVuaW5zdGFsbFwiOiB7fSxcbiAgICAgICAgICAgIFwiYnVuZGxlXCI6IHtcbiAgICAgICAgICAgICAgICBcInJlc3VsdFwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwibzFlMWUwMWU2YjQxY2VjM1wiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIm8xZTFlMDFlNmI0MWNlYzNcIixcbiAgICAgICAgICAgIFwiX25hbWVcIjogXCJSdW50aW1lTG9nXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiZGJBY3Rpb25cIixcbiAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcImluc2VydFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJjb2xsZWN0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJpZFwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjogXCJcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZmllbGRcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIFwicmVhZE9ubHlcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInZhbHVlXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJhbnlcIixcbiAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJvcmRlclwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjogMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBcInNjaGVtYXNcIjoge1xuICAgICAgICBcIjEwMzc0MTgwNTgxYTQxZlwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjEwMzc0MTgwNTgxYTQxZlwiLFxuICAgICAgICAgICAgXCJfbmFtZVwiOiBcIlJ1bnRpbWVBZG1pblwiLFxuICAgICAgICAgICAgXCJfaW5oZXJpdFwiOiBbXG4gICAgICAgICAgICAgICAgXCJSdW50aW1lQ29tcG9uZW50XCJcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIl9jb3JlXCI6IHRydWUsXG4gICAgICAgICAgICBcImRlc2lnbmVyV2luZG93XCI6IFwicHJvcGVydHlcIixcbiAgICAgICAgICAgIFwic3RhcnRcIjogXCJtZXRob2RcIlxuICAgICAgICB9LFxuICAgICAgICBcIjEwNGFkMWY0ODUxODM3NlwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjEwNGFkMWY0ODUxODM3NlwiLFxuICAgICAgICAgICAgXCJfbmFtZVwiOiBcIlJ1bnRpbWVDaGFubmVsXCIsXG4gICAgICAgICAgICBcIl9jb3JlXCI6IHRydWUsXG4gICAgICAgICAgICBcIiRlZGl0b3JVcGRhdGVTeXN0ZW1cIjogXCJldmVudFwiLFxuICAgICAgICAgICAgXCIkZWRpdG9yVXBkYXRlU2NoZW1hXCI6IFwiZXZlbnRcIixcbiAgICAgICAgICAgIFwiJGVkaXRvclVwZGF0ZVNjaGVtYUlkXCI6IFwiZXZlbnRcIixcbiAgICAgICAgICAgIFwiJGVkaXRvclVwZGF0ZVNjaGVtYU5hbWVcIjogXCJldmVudFwiLFxuICAgICAgICAgICAgXCIkZWRpdG9yVXBkYXRlTW9kZWxcIjogXCJldmVudFwiLFxuICAgICAgICAgICAgXCIkZWRpdG9yVXBkYXRlTW9kZWxJZFwiOiBcImV2ZW50XCIsXG4gICAgICAgICAgICBcIiRlZGl0b3JVcGRhdGVUeXBlXCI6IFwiZXZlbnRcIixcbiAgICAgICAgICAgIFwiJGVkaXRvckRlbGV0ZVR5cGVcIjogXCJldmVudFwiLFxuICAgICAgICAgICAgXCIkZWRpdG9yVXBkYXRlQmVoYXZpb3JcIjogXCJldmVudFwiLFxuICAgICAgICAgICAgXCIkZWRpdG9yRGVsZXRlQmVoYXZpb3JcIjogXCJldmVudFwiLFxuICAgICAgICAgICAgXCIkZWRpdG9yVXBkYXRlQ29tcG9uZW50XCI6IFwiZXZlbnRcIixcbiAgICAgICAgICAgIFwiJGVkaXRvckRlbGV0ZUNvbXBvbmVudFwiOiBcImV2ZW50XCIsXG4gICAgICAgICAgICBcIiRhcHBMb2dEZWJ1Z1wiOiBcImV2ZW50XCIsXG4gICAgICAgICAgICBcIiRhcHBMb2dJbmZvXCI6IFwiZXZlbnRcIixcbiAgICAgICAgICAgIFwiJGFwcExvZ1dhcm5cIjogXCJldmVudFwiLFxuICAgICAgICAgICAgXCIkYXBwTG9nRXJyb3JcIjogXCJldmVudFwiLFxuICAgICAgICAgICAgXCIkYXBwTG9hZFN5c3RlbVwiOiBcImV2ZW50XCIsXG4gICAgICAgICAgICBcIiRkZXNpZ25lclN5bmNcIjogXCJldmVudFwiLFxuICAgICAgICAgICAgXCIkZGVzaWduZXJDcmVhdGVCZWhhdmlvclwiOiBcImV2ZW50XCIsXG4gICAgICAgICAgICBcIiRkZXNpZ25lckNyZWF0ZUNvbXBvbmVudFwiOiBcImV2ZW50XCIsXG4gICAgICAgICAgICBcIiRkZXNpZ25lckNyZWF0ZVR5cGVcIjogXCJldmVudFwiLFxuICAgICAgICAgICAgXCIkZGVzaWduZXJDcmVhdGVTY2hlbWFcIjogXCJldmVudFwiLFxuICAgICAgICAgICAgXCIkZGVzaWduZXJDcmVhdGVNb2RlbFwiOiBcImV2ZW50XCIsXG4gICAgICAgICAgICBcIiRkZXNpZ25lckRlbGV0ZVNjaGVtYVwiOiBcImV2ZW50XCIsXG4gICAgICAgICAgICBcIiRkZXNpZ25lckRlbGV0ZU1vZGVsXCI6IFwiZXZlbnRcIixcbiAgICAgICAgICAgIFwiJGRlc2lnbmVyRGVsZXRlVHlwZVwiOiBcImV2ZW50XCIsXG4gICAgICAgICAgICBcIiRkZXNpZ25lckRlbGV0ZUJlaGF2aW9yXCI6IFwiZXZlbnRcIixcbiAgICAgICAgICAgIFwiJGRlc2lnbmVyRGVsZXRlQ29tcG9uZW50XCI6IFwiZXZlbnRcIixcbiAgICAgICAgICAgIFwiJGRlc2lnbmVyVXBkYXRlQ29tcG9uZW50XCI6IFwiZXZlbnRcIixcbiAgICAgICAgICAgIFwiJGRlc2lnbmVyVXBkYXRlTW9kZWxcIjogXCJldmVudFwiLFxuICAgICAgICAgICAgXCIkZGVzaWduZXJVcGRhdGVCZWhhdmlvclwiOiBcImV2ZW50XCIsXG4gICAgICAgICAgICBcIiRydW50aW1lQ3JlYXRlQ29tcG9uZW50XCI6IFwiZXZlbnRcIixcbiAgICAgICAgICAgIFwiJHJ1bnRpbWVEZWxldGVDb21wb25lbnRcIjogXCJldmVudFwiLFxuICAgICAgICAgICAgXCIkcnVudGltZVVwZGF0ZUNvbXBvbmVudFwiOiBcImV2ZW50XCIsXG4gICAgICAgICAgICBcIl9pbmhlcml0XCI6IFtcbiAgICAgICAgICAgICAgICBcIlJ1bnRpbWVDb21wb25lbnRcIlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwic2VuZFwiOiBcImV2ZW50XCIsXG4gICAgICAgICAgICBcIiRzeXN0ZW1JbnN0YWxsZWRcIjogXCJldmVudFwiLFxuICAgICAgICAgICAgXCIkc3lzdGVtUmVzb2x2ZWRcIjogXCJldmVudFwiLFxuICAgICAgICAgICAgXCIkc3lzdGVtU3RhcnRlZFwiOiBcImV2ZW50XCIsXG4gICAgICAgICAgICBcIiRzeXN0ZW1TdG9wcGVkXCI6IFwiZXZlbnRcIixcbiAgICAgICAgICAgIFwiJHN5c3RlbVVuaW5zdGFsbGVkXCI6IFwiZXZlbnRcIlxuICAgICAgICB9LFxuICAgICAgICBcIjEyZmE4MTgxY2UxMjdhMFwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjEyZmE4MTgxY2UxMjdhMFwiLFxuICAgICAgICAgICAgXCJfbmFtZVwiOiBcIlJ1bnRpbWVTdG9yYWdlXCIsXG4gICAgICAgICAgICBcIl9pbmhlcml0XCI6IFtcbiAgICAgICAgICAgICAgICBcIlJ1bnRpbWVDb21wb25lbnRcIlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiX2NvcmVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwic3RvcmVcIjogXCJwcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJnZXRcIjogXCJtZXRob2RcIixcbiAgICAgICAgICAgIFwic2V0XCI6IFwibWV0aG9kXCIsXG4gICAgICAgICAgICBcInJlbW92ZVwiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJjbGVhclwiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJjaGFuZ2VkXCI6IFwiZXZlbnRcIlxuICAgICAgICB9LFxuICAgICAgICBcIjEyZTIxMWQ0Y2QxMjBhNlwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjEyZTIxMWQ0Y2QxMjBhNlwiLFxuICAgICAgICAgICAgXCJfbmFtZVwiOiBcIlJ1bnRpbWVcIixcbiAgICAgICAgICAgIFwiX2luaGVyaXRcIjogW1xuICAgICAgICAgICAgICAgIFwiUnVudGltZU9TR2lcIlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiX2NvcmVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwidmVyc2lvblwiOiBcInByb3BlcnR5XCIsXG4gICAgICAgICAgICBcInN5c3RlbVwiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJtZXNzYWdlXCI6IFwibWV0aG9kXCIsXG4gICAgICAgICAgICBcInJlYWR5XCI6IFwiZXZlbnRcIlxuICAgICAgICB9LFxuICAgICAgICBcIjFhYzA3MTg1NjQxZmE5ZlwiOiB7XG4gICAgICAgICAgICBcIl9uYW1lXCI6IFwiUnVudGltZUJlaGF2aW9yXCIsXG4gICAgICAgICAgICBcIl9pbmhlcml0XCI6IFtcbiAgICAgICAgICAgICAgICBcIlJ1bnRpbWVDb21wb25lbnRcIlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiX2NvcmVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiY29yZVwiOiBcInByb3BlcnR5XCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcInByb3BlcnR5XCIsXG4gICAgICAgICAgICBcImFjdGlvblwiOiBcInByb3BlcnR5XCIsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwicHJvcGVydHlcIixcbiAgICAgICAgICAgIFwidXNlQ29yZUFQSVwiOiBcInByb3BlcnR5XCIsXG4gICAgICAgICAgICBcIl9pZFwiOiBcIjFhYzA3MTg1NjQxZmE5ZlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiMWMwMGIxM2ExYjFiYzkyXCI6IHtcbiAgICAgICAgICAgIFwiX25hbWVcIjogXCJSdW50aW1lQ2xhc3NJbmZvXCIsXG4gICAgICAgICAgICBcIl9pbmhlcml0XCI6IFtcbiAgICAgICAgICAgICAgICBcIlJ1bnRpbWVDb21wb25lbnRcIlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiX2NvcmVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwibW9kZWxcIjogXCJwcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJzY2hlbWFcIjogXCJwcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJtZXRob2RcIjogXCJtZXRob2RcIixcbiAgICAgICAgICAgIFwibWV0aG9kc1wiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJwcm9wZXJ0eVwiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IFwibWV0aG9kXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCJtZXRob2RcIixcbiAgICAgICAgICAgIFwibGlua3NcIjogXCJtZXRob2RcIixcbiAgICAgICAgICAgIFwiY29sbGVjdGlvbnNcIjogXCJtZXRob2RcIixcbiAgICAgICAgICAgIFwiY29sbGVjdGlvblwiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJldmVudFwiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJldmVudHNcIjogXCJtZXRob2RcIixcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMWMwMGIxM2ExYjFiYzkyXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCIxMTFkZjExZTJiMTlmZGVcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxMTFkZjExZTJiMTlmZGVcIixcbiAgICAgICAgICAgIFwiX25hbWVcIjogXCJSdW50aW1lQ29tcG9uZW50XCIsXG4gICAgICAgICAgICBcIl9pbmhlcml0XCI6IFtdLFxuICAgICAgICAgICAgXCJfY29yZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJjbGFzc0luZm9cIjogXCJwcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJvblwiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJvZmZcIjogXCJtZXRob2RcIixcbiAgICAgICAgICAgIFwicmVxdWlyZVwiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJkZXN0cm95XCI6IFwibWV0aG9kXCIsXG4gICAgICAgICAgICBcImluaXRcIjogXCJtZXRob2RcIixcbiAgICAgICAgICAgIFwiZXJyb3JcIjogXCJldmVudFwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiMTcyMzUxNmEzMDEzMmFjXCI6IHtcbiAgICAgICAgICAgIFwiX25hbWVcIjogXCJSdW50aW1lRGF0YWJhc2VcIixcbiAgICAgICAgICAgIFwiX2luaGVyaXRcIjogW1xuICAgICAgICAgICAgICAgIFwiUnVudGltZUNvbXBvbmVudFwiXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJfY29yZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJzeXN0ZW1cIjogXCJtZXRob2RcIixcbiAgICAgICAgICAgIFwic3Vic3lzdGVtXCI6IFwibWV0aG9kXCIsXG4gICAgICAgICAgICBcImNvbGxlY3Rpb25zXCI6IFwibWV0aG9kXCIsXG4gICAgICAgICAgICBcImluc2VydFwiOiBcImV2ZW50XCIsXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBcImV2ZW50XCIsXG4gICAgICAgICAgICBcInJlbW92ZVwiOiBcImV2ZW50XCIsXG4gICAgICAgICAgICBcIl9pZFwiOiBcIjE3MjM1MTZhMzAxMzJhY1wiXG4gICAgICAgIH0sXG4gICAgICAgIFwiMTI2OGYxZGRkZDFmZWE3XCI6IHtcbiAgICAgICAgICAgIFwiX25hbWVcIjogXCJSdW50aW1lTG9nZ2VyXCIsXG4gICAgICAgICAgICBcIl9jb3JlXCI6IHRydWUsXG4gICAgICAgICAgICBcImxldmVsXCI6IFwicHJvcGVydHlcIixcbiAgICAgICAgICAgIFwiZGVidWdcIjogXCJtZXRob2RcIixcbiAgICAgICAgICAgIFwiaW5mb1wiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJ3YXJuXCI6IFwibWV0aG9kXCIsXG4gICAgICAgICAgICBcImVycm9yXCI6IFwibWV0aG9kXCIsXG4gICAgICAgICAgICBcIl9pZFwiOiBcIjEyNjhmMWRkZGQxZmVhN1wiXG4gICAgICAgIH0sXG4gICAgICAgIFwiMTRjYWExYzQ2NDE0ZWUxXCI6IHtcbiAgICAgICAgICAgIFwiX25hbWVcIjogXCJSdW50aW1lTWVzc2FnZVwiLFxuICAgICAgICAgICAgXCJfaW5oZXJpdFwiOiBbXG4gICAgICAgICAgICAgICAgXCJSdW50aW1lQ29tcG9uZW50XCJcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIl9jb3JlXCI6IHRydWUsXG4gICAgICAgICAgICBcImV2ZW50XCI6IFwicHJvcGVydHlcIixcbiAgICAgICAgICAgIFwiZnJvbVwiOiBcInByb3BlcnR5XCIsXG4gICAgICAgICAgICBcImRhdGFcIjogXCJwcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJfaWRcIjogXCIxNGNhYTFjNDY0MTRlZTFcIlxuICAgICAgICB9LFxuICAgICAgICBcIjE5M2YxMTY2ZWIxNjYwOVwiOiB7XG4gICAgICAgICAgICBcIl9uYW1lXCI6IFwiUnVudGltZU1ldGFtb2RlbFwiLFxuICAgICAgICAgICAgXCJfaW5oZXJpdFwiOiBbXG4gICAgICAgICAgICAgICAgXCJSdW50aW1lQ29tcG9uZW50XCJcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIl9jb3JlXCI6IHRydWUsXG4gICAgICAgICAgICBcInNjaGVtYVwiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJtb2RlbFwiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWV0aG9kXCIsXG4gICAgICAgICAgICBcImNyZWF0ZVwiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJfaWRcIjogXCIxOTNmMTE2NmViMTY2MDlcIlxuICAgICAgICB9LFxuICAgICAgICBcIjE1ODcxMWQ2ZjIxNWU0YlwiOiB7XG4gICAgICAgICAgICBcIl9uYW1lXCI6IFwiUnVudGltZVN0YXRlXCIsXG4gICAgICAgICAgICBcIl9pbmhlcml0XCI6IFtdLFxuICAgICAgICAgICAgXCJfY29yZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJfY2xhc3NcIjogZmFsc2UsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJwcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJwYXJhbWV0ZXJzXCI6IFwicHJvcGVydHlcIixcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTU4NzExZDZmMjE1ZTRiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCIxY2I3NjFmYTQ1MTBkY2FcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxY2I3NjFmYTQ1MTBkY2FcIixcbiAgICAgICAgICAgIFwiX25hbWVcIjogXCJSdW50aW1lU3lzdGVtXCIsXG4gICAgICAgICAgICBcIl9pbmhlcml0XCI6IFtcbiAgICAgICAgICAgICAgICBcIlJ1bnRpbWVTeXN0ZW1PU0dpXCJcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIl9jb3JlXCI6IHRydWUsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJwcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJtYXN0ZXJcIjogXCJwcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJzdWJzeXN0ZW1cIjogXCJwcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJ2ZXJzaW9uXCI6IFwicHJvcGVydHlcIixcbiAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJwcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJzY2hlbWFzXCI6IFwicHJvcGVydHlcIixcbiAgICAgICAgICAgIFwibW9kZWxzXCI6IFwicHJvcGVydHlcIixcbiAgICAgICAgICAgIFwiYmVoYXZpb3JzXCI6IFwicHJvcGVydHlcIixcbiAgICAgICAgICAgIFwidHlwZXNcIjogXCJwcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJjb21wb25lbnRzXCI6IFwicHJvcGVydHlcIixcbiAgICAgICAgICAgIFwic3luY1wiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJtYWluXCI6IFwibWV0aG9kXCIsXG4gICAgICAgICAgICBcInJlYWR5XCI6IFwiZXZlbnRcIlxuICAgICAgICB9LFxuICAgICAgICBcIjE1NzkzMWY3YTMxYjYxZFwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjE1NzkzMWY3YTMxYjYxZFwiLFxuICAgICAgICAgICAgXCJfbmFtZVwiOiBcIlJ1bnRpbWVPU0dpXCIsXG4gICAgICAgICAgICBcIl9pbmhlcml0XCI6IFtcbiAgICAgICAgICAgICAgICBcIlJ1bnRpbWVDb21wb25lbnRcIlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiX2NvcmVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiaW5zdGFsbFwiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJ1bmluc3RhbGxcIjogXCJtZXRob2RcIixcbiAgICAgICAgICAgIFwic3RhcnRcIjogXCJtZXRob2RcIixcbiAgICAgICAgICAgIFwic3RvcFwiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJzdGF0dXNcIjogXCJtZXRob2RcIixcbiAgICAgICAgICAgIFwiYnVuZGxlXCI6IFwibWV0aG9kXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCIxNDVmZTEwYzc1MTQyOThcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxNDVmZTEwYzc1MTQyOThcIixcbiAgICAgICAgICAgIFwiX25hbWVcIjogXCJSdW50aW1lU3lzdGVtT1NHaVwiLFxuICAgICAgICAgICAgXCJfaW5oZXJpdFwiOiBbXG4gICAgICAgICAgICAgICAgXCJSdW50aW1lQ29tcG9uZW50XCJcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIl9jb3JlXCI6IHRydWUsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwicHJvcGVydHlcIixcbiAgICAgICAgICAgIFwibG9jYXRpb25cIjogXCJwcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJzdGFydFwiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJzdG9wXCI6IFwibWV0aG9kXCIsXG4gICAgICAgICAgICBcInVuaW5zdGFsbFwiOiBcIm1ldGhvZFwiLFxuICAgICAgICAgICAgXCJidW5kbGVcIjogXCJtZXRob2RcIlxuICAgICAgICB9LFxuICAgICAgICBcImYxYTEwZDEwNjdkMWIyM2FcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCJmMWExMGQxMDY3ZDFiMjNhXCIsXG4gICAgICAgICAgICBcIl9uYW1lXCI6IFwiUnVudGltZUxvZ1wiLFxuICAgICAgICAgICAgXCJfaW5oZXJpdFwiOiBbXG4gICAgICAgICAgICAgICAgXCJSdW50aW1lQ29tcG9uZW50XCJcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcImFjdGlvblwiOiBcInByb3BlcnR5XCIsXG4gICAgICAgICAgICBcImNvbGxlY3Rpb25cIjogXCJwcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJpZFwiOiBcInByb3BlcnR5XCIsXG4gICAgICAgICAgICBcImZpZWxkXCI6IFwicHJvcGVydHlcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJwcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJvcmRlclwiOiBcInByb3BlcnR5XCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJ0eXBlc1wiOiB7XG4gICAgICAgIFwiY29sbGVjdGlvblwiOiB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJjb2xsZWN0aW9uXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICAgICAgICAgIFwic2NoZW1hXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB0cnVlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYm9vbGVhblwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB0cnVlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2VcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJjc3NcIjoge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwiY3NzXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiZGF0ZVwiOiB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJkYXRlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiZXJyb3JQYXJhbVwiOiB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJlcnJvclBhcmFtXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICAgICAgICAgIFwic2NoZW1hXCI6IHtcbiAgICAgICAgICAgICAgICBcIm1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiZXZlbnRcIjoge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwiZXZlbnRcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgXCJzY2hlbWFcIjoge1xuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFyYW1ldGVyXCJcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2VcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJodG1sXCI6IHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImh0bWxcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJqYXZhc2NyaXB0XCI6IHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImphdmFzY3JpcHRcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJqc29uXCI6IHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImpzb25cIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJsaW5rXCI6IHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImxpbmtcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgXCJzY2hlbWFcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB0cnVlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYm9vbGVhblwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB0cnVlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiQHR5cGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcImxvZ1wiOiB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJsb2dcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBbXG4gICAgICAgICAgICAgICAgXCJkZWJ1Z1wiLFxuICAgICAgICAgICAgICAgIFwiaW5mb1wiLFxuICAgICAgICAgICAgICAgIFwid2FyblwiLFxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwibWVzc2FnZVwiOiB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJtZXNzYWdlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICAgICAgICAgIFwic2NoZW1hXCI6IHtcbiAgICAgICAgICAgICAgICBcImV2ZW50XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZnJvbVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJtZXRob2RcIjoge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwibWV0aG9kXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICAgICAgICAgIFwic2NoZW1hXCI6IHtcbiAgICAgICAgICAgICAgICBcInJlc3VsdFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYXJhbWV0ZXJcIlxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcInBhcmFtZXRlclwiOiB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJwYXJhbWV0ZXJcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgXCJzY2hlbWFcIjoge1xuICAgICAgICAgICAgICAgIFwibmFtZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB0cnVlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJib29sZWFuXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJAdHlwZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcInByb3BlcnR5XCI6IHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcInByb3BlcnR5XCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICAgICAgICAgIFwic2NoZW1hXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJib29sZWFuXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIkB0eXBlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2VcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJvc2dpU3RhdGVzXCI6IHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIm9zZ2lTdGF0ZXNcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBbXG4gICAgICAgICAgICAgICAgXCJub25lXCIsXG4gICAgICAgICAgICAgICAgXCJpbnN0YWxsZWRcIixcbiAgICAgICAgICAgICAgICBcInJlc29sdmVkXCIsXG4gICAgICAgICAgICAgICAgXCJzdGFydGluZ1wiLFxuICAgICAgICAgICAgICAgIFwiYWN0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJzdG9wcGluZ1wiLFxuICAgICAgICAgICAgICAgIFwidW5pbnN0YWxsZWRcIlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwidGV4dFwiOiB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiZGJJbnNlcnRFdmVudFwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjE0OGVmMWUxOTgxMGU2ZFwiLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiZGJJbnNlcnRFdmVudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBcInNjaGVtYVwiOiB7XG4gICAgICAgICAgICAgICAgXCJjb2xsZWN0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcImRvY3VtZW50XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkYlJlbW92ZUV2ZW50XCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTk1MmUxYWM0MjEzZjRhXCIsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJkYlJlbW92ZUV2ZW50XCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICAgICAgICAgIFwic2NoZW1hXCI6IHtcbiAgICAgICAgICAgICAgICBcImNvbGxlY3Rpb25cIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiaWRcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwiXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZGJVcGRhdGVFdmVudFwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjFmNWM0MTMwOTcxMTc1MlwiLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiZGJVcGRhdGVFdmVudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBcInNjaGVtYVwiOiB7XG4gICAgICAgICAgICAgICAgXCJjb2xsZWN0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcImlkXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYW55XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRiQWN0aW9uXCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiZTE5NTBlMTZmMjkxNGRhOVwiLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiZGJBY3Rpb25cIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBbXG4gICAgICAgICAgICAgICAgXCJpbnNlcnRcIixcbiAgICAgICAgICAgICAgICBcInVwZGF0ZVwiLFxuICAgICAgICAgICAgICAgIFwicmVtb3ZlXCJcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJiZWhhdmlvcnNcIjoge1xuICAgICAgICBcIjFjMDBjMTA3ZTAxYzliM1wiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjFjMDBjMTA3ZTAxYzliM1wiLFxuICAgICAgICAgICAgXCJjb21wb25lbnRcIjogXCJSdW50aW1lQWRtaW5cIixcbiAgICAgICAgICAgIFwic3RhdGVcIjogXCJzdGFydFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiBzdGFydCgpIHtcXG4gICAgdmFyIFJ1bnRpbWVDaGFubmVsID0gbnVsbCxcXG4gICAgICAgIGNoYW5uZWwgPSBudWxsLFxcbiAgICAgICAgZGIgPSB0aGlzLnJlcXVpcmUoJ2RiJyk7XFxuXFxuICAgIGlmICghdGhpcy5yZXF1aXJlKCdjaGFubmVsLWFkbWluJykpIHtcXG4gICAgICAgIFJ1bnRpbWVDaGFubmVsID0gdGhpcy5yZXF1aXJlKCdSdW50aW1lQ2hhbm5lbCcpO1xcbiAgICAgICAgY2hhbm5lbCA9IG5ldyBSdW50aW1lQ2hhbm5lbCh7XFxuICAgICAgICAgICAgJ19pZCc6ICdjaGFubmVsLWFkbWluJyxcXG4gICAgICAgICAgICAnX2NvcmUnOiB0cnVlXFxuICAgICAgICB9KTtcXG4gICAgICAgIFxcbiAgICAgICAgLy8gZm9yIGpxdWVyeSBjb21wYXRpYmlsaXR5IGluIGVsZWN0cm9uXFxuICAgICAgICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcXG4gICAgICAgICAgICBkZWxldGUgbW9kdWxlO1xcbiAgICAgICAgfVxcblxcbiAgICAgICAgY2hhbm5lbC5vbignc2VuZCcsIGZ1bmN0aW9uIHNlbmQobWVzc2FnZSkge1xcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnYWRtaW4nKS5kZXNpZ25lcldpbmRvdygpLnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpLCAnKicpO1xcbiAgICAgICAgfSwgZmFsc2UsIHRydWUpO1xcblxcbiAgICAgICAgLy8gc2NoZW1hIGNoYW5nZSBldmVudHNcXG4gICAgICAgIGNoYW5uZWwub24oJyRkZXNpZ25lckNyZWF0ZVNjaGVtYScsIGZ1bmN0aW9uICRkZXNpZ25lckNyZWF0ZVNjaGVtYShpZCwgc2NoZW1hKSB7XFxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlKCdsb2dnZXInKS5sZXZlbCgnd2FybicpO1xcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnbWV0YW1vZGVsJykuc2NoZW1hKHNjaGVtYSk7XFxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlKCdtZXRhbW9kZWwnKS5jcmVhdGUoKTtcXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmUoJ2xvZ2dlcicpLmxldmVsKCdkZWJ1ZycpO1xcbiAgICAgICAgfSwgdHJ1ZSwgdHJ1ZSk7XFxuXFxuICAgICAgICBjaGFubmVsLm9uKCckZWRpdG9yVXBkYXRlU2NoZW1hJywgZnVuY3Rpb24gJGVkaXRvclVwZGF0ZVNjaGVtYShpZCwgc2NoZW1hKSB7XFxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlKCdsb2dnZXInKS5sZXZlbCgnd2FybicpO1xcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnbWV0YW1vZGVsJykuc2NoZW1hKHNjaGVtYSk7XFxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlKCdtZXRhbW9kZWwnKS5jcmVhdGUoKTtcXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmUoJ2xvZ2dlcicpLmxldmVsKCdkZWJ1ZycpO1xcbiAgICAgICAgfSwgdHJ1ZSwgdHJ1ZSk7XFxuXFxuICAgICAgICBjaGFubmVsLm9uKCckZGVzaWduZXJEZWxldGVTY2hlbWEnLCBmdW5jdGlvbiAkZGVzaWduZXJEZWxldGVTY2hlbWEoaWQpIHtcXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmUoJ2xvZ2dlcicpLmxldmVsKCd3YXJuJyk7XFxuICAgICAgICAgICAgdmFyIHNlYXJjaCA9ICRkYi5SdW50aW1lU2NoZW1hLmZpbmQoeyAnX2lkJzogaWQgfSksXFxuICAgICAgICAgICAgICAgIG1vZGVsTmFtZSA9ICcnLFxcbiAgICAgICAgICAgICAgICBtb2RlbElkID0gJyc7XFxuXFxuICAgICAgICAgICAgaWYgKHNlYXJjaC5sZW5ndGgpIHtcXG4gICAgICAgICAgICAgICAgbW9kZWxOYW1lID0gc2VhcmNoWzBdLl9uYW1lO1xcbiAgICAgICAgICAgICAgICAkZGIuUnVudGltZVNjaGVtYS5yZW1vdmUoeyAnX2lkJzogaWQgfSk7XFxuXFxuICAgICAgICAgICAgICAgIHNlYXJjaCA9ICRkYi5SdW50aW1lTW9kZWwuZmluZCh7ICdfbmFtZSc6IG1vZGVsTmFtZSB9KTtcXG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaC5sZW5ndGgpIHtcXG4gICAgICAgICAgICAgICAgICAgIG1vZGVsSWQgPSBzZWFyY2hbMF0uX2lkO1xcbiAgICAgICAgICAgICAgICAgICAgJGRiLlJ1bnRpbWVNb2RlbC5yZW1vdmUoeyAnX2lkJzogbW9kZWxJZCB9KTtcXG4gICAgICAgICAgICAgICAgICAgICRjb21wb25lbnQucmVtb3ZlRnJvbU1lbW9yeShtb2RlbE5hbWUpO1xcbiAgICAgICAgICAgICAgICB9XFxuXFxuICAgICAgICAgICAgICAgIHNlYXJjaCA9ICRkYi5SdW50aW1lR2VuZXJhdGVkTW9kZWwuZmluZCh7ICdfbmFtZSc6IG1vZGVsTmFtZSB9KTtcXG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaC5sZW5ndGgpIHtcXG4gICAgICAgICAgICAgICAgICAgIG1vZGVsSWQgPSBzZWFyY2hbMF0uX2lkO1xcbiAgICAgICAgICAgICAgICAgICAgJGRiLlJ1bnRpbWVHZW5lcmF0ZWRNb2RlbC5yZW1vdmUoeyAnX2lkJzogbW9kZWxJZCB9KTtcXG4gICAgICAgICAgICAgICAgICAgICRjb21wb25lbnQucmVtb3ZlRnJvbU1lbW9yeShtb2RlbE5hbWUpO1xcbiAgICAgICAgICAgICAgICB9XFxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnbWV0YW1vZGVsJykuY3JlYXRlKCk7XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnbG9nZ2VyJykubGV2ZWwoJ2RlYnVnJyk7XFxuICAgICAgICB9LCB0cnVlLCB0cnVlKTtcXG5cXG4gICAgICAgIC8vIG1vZGVsIGNoYW5nZSBldmVudHNcXG4gICAgICAgIGNoYW5uZWwub24oJyRkZXNpZ25lckNyZWF0ZU1vZGVsJywgZnVuY3Rpb24gJGRlc2lnbmVyQ3JlYXRlTW9kZWwoaWQsIG1vZGVsKSB7XFxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlKCdsb2dnZXInKS5sZXZlbCgnd2FybicpO1xcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnbWV0YW1vZGVsJykubW9kZWwobW9kZWwpO1xcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnbWV0YW1vZGVsJykuY3JlYXRlKCk7XFxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlKCdsb2dnZXInKS5sZXZlbCgnZGVidWcnKTtcXG4gICAgICAgIH0sIHRydWUsIHRydWUpO1xcblxcbiAgICAgICAgY2hhbm5lbC5vbignJGVkaXRvclVwZGF0ZU1vZGVsJywgZnVuY3Rpb24gJGVkaXRvclVwZGF0ZU1vZGVsKGlkLCBtb2RlbCkge1xcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnbG9nZ2VyJykubGV2ZWwoJ3dhcm4nKTtcXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmUoJ21ldGFtb2RlbCcpLm1vZGVsKG1vZGVsKTtcXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmUoJ21ldGFtb2RlbCcpLmNyZWF0ZSgpO1xcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnbG9nZ2VyJykubGV2ZWwoJ2RlYnVnJyk7XFxuICAgICAgICB9LCB0cnVlLCB0cnVlKTtcXG5cXG4gICAgICAgIGNoYW5uZWwub24oJyRkZXNpZ25lclVwZGF0ZU1vZGVsJywgZnVuY3Rpb24gJGRlc2lnbmVyVXBkYXRlTW9kZWwoaWQsIG1vZGVsKSB7XFxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlKCdsb2dnZXInKS5sZXZlbCgnd2FybicpO1xcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnbWV0YW1vZGVsJykubW9kZWwobW9kZWwpO1xcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnbWV0YW1vZGVsJykuY3JlYXRlKCk7XFxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlKCdsb2dnZXInKS5sZXZlbCgnZGVidWcnKTtcXG4gICAgICAgIH0sIHRydWUsIHRydWUpO1xcblxcbiAgICAgICAgY2hhbm5lbC5vbignJGRlc2lnbmVyRGVsZXRlTW9kZWwnLCBmdW5jdGlvbiAkZGVzaWduZXJEZWxldGVNb2RlbChpZCkge1xcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnbG9nZ2VyJykubGV2ZWwoJ3dhcm4nKTtcXG4gICAgICAgICAgICB2YXIgc2VhcmNoID0gJGRiLlJ1bnRpbWVNb2RlbC5maW5kKHsgJ19pZCc6IGlkIH0pLFxcbiAgICAgICAgICAgICAgICBtb2RlbE5hbWUgPSAnJyxcXG4gICAgICAgICAgICAgICAgbW9kZWxJZCA9ICcnO1xcblxcbiAgICAgICAgICAgIGlmIChzZWFyY2gubGVuZ3RoKSB7XFxuICAgICAgICAgICAgICAgIG1vZGVsTmFtZSA9IHNlYXJjaFswXS5fbmFtZTtcXG4gICAgICAgICAgICAgICAgJGRiLlJ1bnRpbWVNb2RlbC5yZW1vdmUoeyAnX2lkJzogaWQgfSk7XFxuICAgICAgICAgICAgICAgICRjb21wb25lbnQucmVtb3ZlRnJvbU1lbW9yeShtb2RlbE5hbWUpO1xcbiAgICAgICAgICAgIH1cXG5cXG4gICAgICAgICAgICBzZWFyY2ggPSAkZGIuUnVudGltZUdlbmVyYXRlZE1vZGVsLmZpbmQoeyAnX25hbWUnOiBtb2RlbE5hbWUgfSk7XFxuICAgICAgICAgICAgaWYgKHNlYXJjaC5sZW5ndGgpIHtcXG4gICAgICAgICAgICAgICAgbW9kZWxJZCA9IHNlYXJjaFswXS5faWQ7XFxuICAgICAgICAgICAgICAgICRkYi5SdW50aW1lR2VuZXJhdGVkTW9kZWwucmVtb3ZlKHsgJ19pZCc6IG1vZGVsSWQgfSk7XFxuICAgICAgICAgICAgICAgICRjb21wb25lbnQucmVtb3ZlRnJvbU1lbW9yeShtb2RlbE5hbWUpO1xcbiAgICAgICAgICAgIH1cXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmUoJ21ldGFtb2RlbCcpLmNyZWF0ZSgpO1xcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnbG9nZ2VyJykubGV2ZWwoJ2RlYnVnJyk7XFxuICAgICAgICB9LCB0cnVlLCB0cnVlKTtcXG5cXG4gICAgICAgIC8vIHR5cGUgY2hhbmdlIGV2ZW50c1xcbiAgICAgICAgY2hhbm5lbC5vbignJGRlc2lnbmVyQ3JlYXRlVHlwZScsIGZ1bmN0aW9uICRkZXNpZ25lckNyZWF0ZVR5cGUoaWQsIHR5cGUpIHtcXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmUoJ2xvZ2dlcicpLmxldmVsKCd3YXJuJyk7XFxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlKCdtZXRhbW9kZWwnKS50eXBlKHR5cGUpO1xcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnbWV0YW1vZGVsJykuY3JlYXRlKCk7XFxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlKCdsb2dnZXInKS5sZXZlbCgnZGVidWcnKTtcXG4gICAgICAgIH0sIHRydWUsIHRydWUpO1xcblxcbiAgICAgICAgY2hhbm5lbC5vbignJGVkaXRvclVwZGF0ZVR5cGUnLCBmdW5jdGlvbiAkZWRpdG9yVXBkYXRlVHlwZShpZCwgdHlwZSkge1xcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnbG9nZ2VyJykubGV2ZWwoJ3dhcm4nKTtcXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmUoJ21ldGFtb2RlbCcpLnR5cGUodHlwZSk7XFxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlKCdtZXRhbW9kZWwnKS5jcmVhdGUoKTtcXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmUoJ2xvZ2dlcicpLmxldmVsKCdkZWJ1ZycpO1xcblxcbiAgICAgICAgfSwgdHJ1ZSwgdHJ1ZSk7XFxuXFxuICAgICAgICBjaGFubmVsLm9uKCckZWRpdG9yRGVsZXRlVHlwZScsIGZ1bmN0aW9uICRlZGl0b3JEZWxldGVUeXBlKGlkKSB7XFxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlKCdsb2dnZXInKS5sZXZlbCgnd2FybicpO1xcbiAgICAgICAgICAgICRkYi5SdW50aW1lVHlwZS5yZW1vdmUoeyAnbmFtZSc6IGlkIH0pO1xcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnbWV0YW1vZGVsJykuY3JlYXRlKCk7XFxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlKCdsb2dnZXInKS5sZXZlbCgnZGVidWcnKTtcXG4gICAgICAgIH0sIHRydWUsIHRydWUpO1xcblxcbiAgICAgICAgY2hhbm5lbC5vbignJGRlc2lnbmVyRGVsZXRlVHlwZScsIGZ1bmN0aW9uICRkZXNpZ25lckRlbGV0ZVR5cGUoaWQpIHtcXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmUoJ2xvZ2dlcicpLmxldmVsKCd3YXJuJyk7XFxuICAgICAgICAgICAgJGRiLlJ1bnRpbWVUeXBlLnJlbW92ZSh7ICduYW1lJzogaWQgfSk7XFxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlKCdtZXRhbW9kZWwnKS5jcmVhdGUoKTtcXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmUoJ2xvZ2dlcicpLmxldmVsKCdkZWJ1ZycpO1xcbiAgICAgICAgfSwgdHJ1ZSwgdHJ1ZSk7XFxuXFxuICAgICAgICAvLyBjb21wb25lbnQgY2hhbmdlIGV2ZW50c1xcbiAgICAgICAgY2hhbm5lbC5vbignJGRlc2lnbmVyQ3JlYXRlQ29tcG9uZW50JywgZnVuY3Rpb24gJGRlc2lnbmVyQ3JlYXRlQ29tcG9uZW50KG1vZGVsLCBjb21wb25lbnQpIHtcXG4gICAgICAgICAgICAkZGJbbW9kZWxdLmluc2VydChjb21wb25lbnQpO1xcbiAgICAgICAgfSwgdHJ1ZSwgdHJ1ZSk7XFxuXFxuICAgICAgICBjaGFubmVsLm9uKCckZWRpdG9yVXBkYXRlQ29tcG9uZW50JywgZnVuY3Rpb24gJGVkaXRvclVwZGF0ZUNvbXBvbmVudChpZCwgY29sbGVjdGlvbiwgY29tcG9uZW50KSB7XFxuICAgICAgICAgICAgJGRiW2NvbGxlY3Rpb25dLnVwZGF0ZSh7ICdfaWQnOiBpZCB9LCBjb21wb25lbnQsIHsgJ3Vwc2VydCc6IHRydWUgfSk7XFxuICAgICAgICB9LCB0cnVlLCB0cnVlKTtcXG5cXG4gICAgICAgIGNoYW5uZWwub24oJyRkZXNpZ25lclVwZGF0ZUNvbXBvbmVudCcsIGZ1bmN0aW9uICRlZGl0b3JVcGRhdGVDb21wb25lbnQoaWQsIGNvbGxlY3Rpb24sIGNvbXBvbmVudCkge1xcbiAgICAgICAgICAgICRkYltjb2xsZWN0aW9uXS51cGRhdGUoeyAnX2lkJzogaWQgfSwgY29tcG9uZW50LCB7ICd1cHNlcnQnOiB0cnVlIH0pO1xcbiAgICAgICAgfSwgdHJ1ZSwgdHJ1ZSk7XFxuXFxuICAgICAgICBjaGFubmVsLm9uKCckZWRpdG9yRGVsZXRlQ29tcG9uZW50JywgZnVuY3Rpb24gJGVkaXRvckRlbGV0ZUNvbXBvbmVudChpZCwgY29sbGVjdGlvbikge1xcbiAgICAgICAgICAgICRkYltjb2xsZWN0aW9uXS5yZW1vdmUoeyAnX2lkJzogaWQgfSk7XFxuICAgICAgICB9LCB0cnVlLCB0cnVlKTtcXG5cXG4gICAgICAgIGNoYW5uZWwub24oJyRkZXNpZ25lckRlbGV0ZUNvbXBvbmVudCcsIGZ1bmN0aW9uICRkZXNpZ25lckRlbGV0ZUNvbXBvbmVudChpZCwgY29sbGVjdGlvbikge1xcbiAgICAgICAgICAgICRkYltjb2xsZWN0aW9uXS5yZW1vdmUoeyAnX2lkJzogaWQgfSk7XFxuICAgICAgICB9LCB0cnVlLCB0cnVlKTtcXG5cXG4gICAgICAgIC8vIGJlaGF2aW9yIGNoYW5nZSBldmVudHNcXG4gICAgICAgIGNoYW5uZWwub24oJyRkZXNpZ25lckNyZWF0ZUJlaGF2aW9yJywgZnVuY3Rpb24gY3JlYXRlQmVoYXZpb3IoY29tcG9uZW50KSB7XFxuICAgICAgICAgICAgJGRiLlJ1bnRpbWVCZWhhdmlvci5pbnNlcnQoY29tcG9uZW50KTtcXG4gICAgICAgIH0sIHRydWUsIHRydWUpO1xcblxcbiAgICAgICAgY2hhbm5lbC5vbignJGVkaXRvclVwZGF0ZUJlaGF2aW9yJywgZnVuY3Rpb24gJGVkaXRvclVwZGF0ZUJlaGF2aW9yKGlkLCBiZWhhdmlvcikge1xcbiAgICAgICAgICAgIGlmICh0aGlzLnJlcXVpcmUoaWQpKSB7XFxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWlyZShpZCkuYWN0aW9uKGJlaGF2aW9yLmFjdGlvbik7XFxuICAgICAgICAgICAgICAgIGlmIChiZWhhdmlvci5zdGF0ZSA9PT0gJ21haW4nKSB7XFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcXVpcmUoYmVoYXZpb3IuY29tcG9uZW50KS5tYWluKCk7XFxuICAgICAgICAgICAgICAgIH1cXG4gICAgICAgICAgICAgICAgaWYgKGJlaGF2aW9yLnN0YXRlID09PSAnc3RhcnQnKSB7XFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcXVpcmUoYmVoYXZpb3IuY29tcG9uZW50KS5zdGFydCgpO1xcbiAgICAgICAgICAgICAgICB9XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgfSwgdHJ1ZSwgdHJ1ZSk7XFxuXFxuICAgICAgICBjaGFubmVsLm9uKCckZGVzaWduZXJVcGRhdGVCZWhhdmlvcicsIGZ1bmN0aW9uICRkZXNpZ25lclVwZGF0ZUJlaGF2aW9yKGlkLCBiZWhhdmlvcikge1xcbiAgICAgICAgICAgIGlmICh0aGlzLnJlcXVpcmUoaWQpKSB7XFxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWlyZShpZCkuYWN0aW9uKGJlaGF2aW9yLmFjdGlvbik7XFxuICAgICAgICAgICAgICAgIGlmIChiZWhhdmlvci5zdGF0ZSA9PT0gJ21haW4nKSB7XFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcXVpcmUoYmVoYXZpb3IuY29tcG9uZW50KS5tYWluKCk7XFxuICAgICAgICAgICAgICAgIH1cXG4gICAgICAgICAgICAgICAgaWYgKGJlaGF2aW9yLnN0YXRlID09PSAnc3RhcnQnKSB7XFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcXVpcmUoYmVoYXZpb3IuY29tcG9uZW50KS5zdGFydCgpO1xcbiAgICAgICAgICAgICAgICB9XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgfSwgdHJ1ZSwgdHJ1ZSk7XFxuXFxuICAgICAgICBjaGFubmVsLm9uKCckZWRpdG9yRGVsZXRlQmVoYXZpb3InLCBmdW5jdGlvbiAkZWRpdG9yRGVsZXRlQmVoYXZpb3IoaWQpIHtcXG4gICAgICAgICAgICAkZGIuUnVudGltZUJlaGF2aW9yLnJlbW92ZSh7ICdfaWQnOiBpZCB9KTtcXG4gICAgICAgIH0sIHRydWUsIHRydWUpO1xcblxcbiAgICAgICAgY2hhbm5lbC5vbignJGRlc2lnbmVyRGVsZXRlQmVoYXZpb3InLCBmdW5jdGlvbiAkZWRpdG9yRGVsZXRlQmVoYXZpb3IoaWQpIHtcXG4gICAgICAgICAgICAkZGIuUnVudGltZUJlaGF2aW9yLnJlbW92ZSh7ICdfaWQnOiBpZCB9KTtcXG4gICAgICAgIH0sIHRydWUsIHRydWUpO1xcblxcbiAgICAgICAgLy8gU3lzdGVtIERlc2lnbmVyIGV2ZW50XFxuICAgICAgICBjaGFubmVsLm9uKCckZGVzaWduZXJTeW5jJywgZnVuY3Rpb24gc3luYygpIHtcXG4gICAgICAgICAgICB2YXIgZGVzaWduZXJXaW5kb3cgPSB0aGlzLnJlcXVpcmUoJ2FkbWluJykuZGVzaWduZXJXaW5kb3coKSxcXG4gICAgICAgICAgICAgICAgc3lzdGVtID0gbnVsbDtcXG5cXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmUoJ2FkbWluJykuZGVzaWduZXJXaW5kb3cobnVsbCk7XFxuICAgICAgICAgICAgc3lzdGVtID0gSlNPTi5wYXJzZSh0aGlzLnJlcXVpcmUoJ2RiJykuc3lzdGVtKCkpO1xcbiAgICAgICAgICAgIGRlc2lnbmVyV2luZG93ID0gdGhpcy5yZXF1aXJlKCdhZG1pbicpLmRlc2lnbmVyV2luZG93KGRlc2lnbmVyV2luZG93KTtcXG5cXG4gICAgICAgICAgICB0aGlzLiRhcHBMb2FkU3lzdGVtKHN5c3RlbSk7XFxuICAgICAgICB9LCBmYWxzZSwgdHJ1ZSk7XFxuICAgICAgICBcXG4gICAgICAgIC8vIERhdGFiYXNlIGluc2VydCBldmVudFxcbiAgICAgICAgZGIub24oJ2luc2VydCcsIGZ1bmN0aW9uIGluc2VydChldmVudCkge1xcbiAgICAgICAgICBpZiAoZXZlbnQuY29sbGVjdGlvbi5pbmRleE9mKCdSdW50aW1lJykgIT09IDApIHtcXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmUoJ2NoYW5uZWwnKS4kcnVudGltZUNyZWF0ZUNvbXBvbmVudChldmVudC5jb2xsZWN0aW9uLCBldmVudC5kb2N1bWVudCk7XFxuICAgICAgICAgIH1cXG4gICAgICAgIH0pO1xcbiAgICAgICAgXFxuICAgICAgICAgLy8gRGF0YWJhc2UgcmVtb3ZlIGV2ZW50XFxuICAgICAgICBkYi5vbigncmVtb3ZlJywgZnVuY3Rpb24gcmVtb3ZlKGV2ZW50KSB7XFxuICAgICAgICAgIGlmIChldmVudC5jb2xsZWN0aW9uLmluZGV4T2YoJ1J1bnRpbWUnKSAhPT0gMCkge1xcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZSgnY2hhbm5lbCcpLiRydW50aW1lRGVsZXRlQ29tcG9uZW50KGV2ZW50LmlkLCBldmVudC5jb2xsZWN0aW9uKTtcXG4gICAgICAgICAgfVxcbiAgICAgICAgfSk7XFxuICAgICAgICBcXG4gICAgICAgICAvLyBEYXRhYmFzZSB1cGRhdGUgZXZlbnRcXG4gICAgICAgIGRiLm9uKCd1cGRhdGUnLCBmdW5jdGlvbiB1cGRhdGUoZXZlbnQpIHtcXG4gICAgICAgICAgaWYgKGV2ZW50LmNvbGxlY3Rpb24uaW5kZXhPZignUnVudGltZScpICE9PSAwKSB7XFxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlKCdjaGFubmVsJykuJHJ1bnRpbWVVcGRhdGVDb21wb25lbnQoZXZlbnQuaWQsIGV2ZW50LmNvbGxlY2lvbiwgZXZlbnQuZmllbGQsIGV2ZW50LnZhbHVlKTtcXG4gICAgICAgICAgfVxcbiAgICAgICAgfSk7XFxuXFxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldmVudCkge1xcbiAgICAgICAgICAgIHZhciBkYXRhID0gbnVsbDtcXG4gICAgICAgICAgICB0cnkge1xcbiAgICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgJiZcXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBkYXRhLmV2ZW50ICE9PSAndW5kZWZpbmVkJyAmJlxcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGRhdGEuZnJvbSAhPT0gJ3VuZGVmaW5lZCcgJiZcXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBkYXRhLmRhdGEgIT09ICd1bmRlZmluZWQnKSB7XFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2lnbmVyV2luZG93KGV2ZW50LnNvdXJjZSk7XFxuICAgICAgICAgICAgICAgICAgICAkZGIuUnVudGltZU1lc3NhZ2UuaW5zZXJ0KGRhdGEpO1xcbiAgICAgICAgICAgICAgICB9XFxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xcbiAgICAgICAgICAgIH1cXG4gICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xcblxcbiAgICAgICAgdGhpcy5yZXF1aXJlKCdsb2dnZXInKS5pbmZvKCdhZG1pbiBpcyBzdGFydGVkJyk7XFxuICAgIH0gZWxzZSB7XFxuICAgICAgICB0aGlzLnJlcXVpcmUoJ2xvZ2dlcicpLmluZm8oJ2FkbWluIGlzIGFscmVhZHkgc3RhcnRlZCcpO1xcbiAgICB9XFxufVwiLFxuICAgICAgICAgICAgXCJ1c2VDb3JlQVBJXCI6IHRydWUsXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcIjFjYTBmMTAyMDQxMmQ0ZlwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjFjYTBmMTAyMDQxMmQ0ZlwiLFxuICAgICAgICAgICAgXCJjb21wb25lbnRcIjogXCJSdW50aW1lU3RvcmFnZVwiLFxuICAgICAgICAgICAgXCJzdGF0ZVwiOiBcImdldFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiBnZXQoa2V5KSB7XFxuICAgIHZhciByZXN1bHQgPSBudWxsO1xcbiAgICBcXG4gICAgaWYgKHR5cGVvZiB0aGlzLnN0b3JlKClba2V5XSkge1xcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5zdG9yZSgpW2tleV07XFxuICAgIH1cXG4gICAgcmV0dXJuIHJlc3VsdDtcXG59XCIsXG4gICAgICAgICAgICBcInVzZUNvcmVBUElcIjogZmFsc2UsXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcIjE2NzY0MTAwZDUxYjVmOFwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjE2NzY0MTAwZDUxYjVmOFwiLFxuICAgICAgICAgICAgXCJjb21wb25lbnRcIjogXCJSdW50aW1lU3RvcmFnZVwiLFxuICAgICAgICAgICAgXCJzdGF0ZVwiOiBcInNldFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSkge1xcbiAgICB2YXIgc3RvcmUgPSB0aGlzLnN0b3JlKCksXFxuICAgICAgICBpdGVtID0ge307XFxuICAgIFxcbiAgICBzdG9yZVtrZXldID0gdmFsdWU7XFxuICAgIHRoaXMuc3RvcmUoc3RvcmUpO1xcblxcbiAgICBpdGVtW2tleV0gPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XFxuICAgIFxcbiAgICBzd2l0Y2ggKHRydWUpIHtcXG4gICAgICAgIGNhc2UgdHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gJ3VuZGVmaW5lZCc6XFxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpOyBcXG4gICAgICAgICAgICBicmVhaztcXG4gICAgICAgIGRlZmF1bHQ6XFxuICAgICAgICAgICAgYnJlYWs7XFxuICAgIH1cXG59XCIsXG4gICAgICAgICAgICBcInVzZUNvcmVBUElcIjogZmFsc2UsXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcIjEzNGI2MTZiMTAxNmY2MFwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjEzNGI2MTZiMTAxNmY2MFwiLFxuICAgICAgICAgICAgXCJjb21wb25lbnRcIjogXCJSdW50aW1lU3RvcmFnZVwiLFxuICAgICAgICAgICAgXCJzdGF0ZVwiOiBcImNsZWFyXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiOiBcImZ1bmN0aW9uIGNsZWFyKCkge1xcbiAgICB0aGlzLnN0b3JlKHt9KTtcXG4gICAgXFxuICAgIHN3aXRjaCAodHJ1ZSkge1xcbiAgICAgICAgY2FzZSB0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSAndW5kZWZpbmVkJzpcXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTsgXFxuICAgICAgICAgICAgYnJlYWs7XFxuICAgICAgICBkZWZhdWx0OlxcbiAgICAgICAgICAgIGJyZWFrO1xcbiAgICB9XFxufVwiLFxuICAgICAgICAgICAgXCJ1c2VDb3JlQVBJXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCIxNGM3ZjFhODQzMWIzZDVcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxNGM3ZjFhODQzMWIzZDVcIixcbiAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IFwiUnVudGltZVN0b3JhZ2VcIixcbiAgICAgICAgICAgIFwic3RhdGVcIjogXCJpbml0XCIsXG4gICAgICAgICAgICBcImFjdGlvblwiOiBcImZ1bmN0aW9uIGluaXQoY29uZikge1xcbiAgICBzd2l0Y2ggKHRydWUpIHtcXG4gICAgICAgIGNhc2UgdHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gJ3VuZGVmaW5lZCc6XFxuICAgICAgICAgICAgXFxuICAgICAgICAgICAgLy8gaW5pdCBcXG4gICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGxvY2FsU3RvcmFnZSksXFxuICAgICAgICAgICAgICAgIHN0b3JlID0ge30sXFxuICAgICAgICAgICAgICAgIGkgPSAwLFxcbiAgICAgICAgICAgICAgICBsZW5ndGggPSAwO1xcbiAgICAgICAgICAgICAgICBcXG4gICAgICAgICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aDsgICAgXFxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XFxuICAgICAgICAgICAgICAgIHRyeSB7XFxuICAgICAgICAgICAgICAgICAgICBzdG9yZVtrZXlzW2ldXSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlW2tleXNbaV1dKTtcXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xcbiAgICAgICAgICAgICAgICB9XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgICAgIHRoaXMuc3RvcmUoc3RvcmUpO1xcbiAgICAgICAgICAgIFxcbiAgICAgICAgICAgIC8vIGV2ZW50XFxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3JhZ2UnLCBmdW5jdGlvbiAoZSkge1xcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0ge30sXFxuICAgICAgICAgICAgICAgICAgICBzdG9yZSA9IHRoaXMuc3RvcmUoKTtcXG4gICAgICAgICAgICAgICAgICAgIFxcbiAgICAgICAgICAgICAgICB0cnkge1xcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVbZS5rZXldID0gSlNPTi5wYXJzZShlLm5ld1ZhbHVlKVxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZShzdG9yZSk7XFxuICAgICAgICAgICAgICAgICAgIFxcbiAgICAgICAgICAgICAgICAgICAgb2JqW2Uua2V5XSA9IHt9O1xcbiAgICAgICAgICAgICAgICAgICAgb2JqW2Uua2V5XS5vbGRWYWx1ZSA9IEpTT04ucGFyc2UoZS5vbGRWYWx1ZSk7XFxuICAgICAgICAgICAgICAgICAgICBvYmpbZS5rZXldLm5ld1ZhbHVlID0gSlNPTi5wYXJzZShlLm5ld1ZhbHVlKTtcXG4gICAgICAgICAgICAgICAgICAgIFxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkKG9iaik7XFxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcXG4gICAgICAgICAgICAgICAgfVxcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XFxuICAgICAgICAgICAgYnJlYWs7XFxuICAgICAgICBkZWZhdWx0OlxcbiAgICAgICAgICAgIGJyZWFrO1xcbiAgICB9XFxufVwiLFxuICAgICAgICAgICAgXCJ1c2VDb3JlQVBJXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCIxYTQ5MjFhYzcxMTJiZDRcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxYTQ5MjFhYzcxMTJiZDRcIixcbiAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IFwiUnVudGltZVN0b3JhZ2VcIixcbiAgICAgICAgICAgIFwic3RhdGVcIjogXCJyZW1vdmVcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZnVuY3Rpb24gcmVtb3ZlKGtleSkge1xcbiAgICB2YXIgc3RvcmUgPSB0aGlzLnN0b3JlKCk7XFxuICAgIFxcbiAgICBkZWxldGUgc3RvcmVba2V5XTtcXG4gICAgdGhpcy5zdG9yZShzdG9yZSk7XFxuICAgIFxcbiAgICBzd2l0Y2ggKHRydWUpIHtcXG4gICAgICAgIGNhc2UgdHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gJ3VuZGVmaW5lZCc6XFxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTsgXFxuICAgICAgICAgICAgYnJlYWs7XFxuICAgICAgICBkZWZhdWx0OlxcbiAgICAgICAgICAgIGJyZWFrO1xcbiAgICB9XFxufVwiLFxuICAgICAgICAgICAgXCJ1c2VDb3JlQVBJXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCIxMzAxMDE2N2YzMTNmODdcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxMzAxMDE2N2YzMTNmODdcIixcbiAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IFwiUnVudGltZVwiLFxuICAgICAgICAgICAgXCJzdGF0ZVwiOiBcInN5c3RlbVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiBzeXN0ZW0ocGFyYW1zKSB7XFxuICAgIHZhciBSdW50aW1lU3lzdGVtID0gbnVsbCxcXG4gICAgc3lzdGVtID0ge30sXFxuICAgIHN5c3RlbUlkID0gJycsXFxuICAgIHJlc3VsdCA9IFtdLFxcbiAgICBjb25mID0ge307XFxuICAgIFxcbiAgICBpZiAocGFyYW1zKSB7XFxuICAgICAgICBpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ3N0cmluZycpIHtcXG4gICAgICAgICAgY29uZi5tYXN0ZXIgPSB0cnVlO1xcbiAgICAgICAgICBjb25mLm5hbWUgPSBwYXJhbXM7XFxuICAgICAgICB9IGVsc2Uge1xcbiAgICAgICAgICBjb25mID0gcGFyYW1zO1xcbiAgICAgICAgICBjb25mLm1hc3RlciA9IHRydWU7XFxuICAgICAgICB9XFxuICAgICAgICBSdW50aW1lU3lzdGVtID0gdGhpcy5yZXF1aXJlKCdSdW50aW1lU3lzdGVtJyk7XFxuICAgICAgICBzeXN0ZW0gPSBuZXcgUnVudGltZVN5c3RlbShjb25mKTtcXG4gICAgICAgIHN5c3RlbS5zdGF0ZSgnYWN0aXZlJyk7XFxuICAgIH0gZWxzZSB7XFxuICAgICAgICByZXN1bHQgPSAkZGIuUnVudGltZVN5c3RlbS5maW5kKHtcXG4gICAgICAgICAgICAnbWFzdGVyJzogdHJ1ZVxcbiAgICAgICAgfSk7XFxuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCkge1xcbiAgICAgICAgICAgIHN5c3RlbUlkID0gcmVzdWx0WzBdLl9pZDtcXG4gICAgICAgICAgICBzeXN0ZW0gPSAkY29tcG9uZW50LmdldChzeXN0ZW1JZCk7XFxuICAgICAgICB9XFxuICAgIH1cXG4gICAgcmV0dXJuIHN5c3RlbTtcXG59XCIsXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwidXNlQ29yZUFQSVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMTU1MTQxZTQwMzEyY2Q4XCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTU1MTQxZTQwMzEyY2Q4XCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVDbGFzc0luZm9cIixcbiAgICAgICAgICAgIFwic3RhdGVcIjogXCJjb2xsZWN0aW9uXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiOiBcImZ1bmN0aW9uIGNvbGxlY3Rpb24obmFtZSkge1xcbiAgICB2YXIgcmVzdWx0ID0ge307XFxuICAgIGlmICh0aGlzLnNjaGVtYSgpW25hbWVdID09PSAnY29sbGVjdGlvbicpIHtcXG4gICAgICAgIHJlc3VsdCA9IHRoaXMubW9kZWwoKVtuYW1lXTtcXG4gICAgfSBcXG4gICAgXFxuICAgIHJldHVybiByZXN1bHQ7IFxcbn1cIixcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMWY2OTQxYTBjMDEyYzFmXCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMWY2OTQxYTBjMDEyYzFmXCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVDbGFzc0luZm9cIixcbiAgICAgICAgICAgIFwic3RhdGVcIjogXCJjb2xsZWN0aW9uc1wiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiBjb2xsZWN0aW9ucyhuYW1lKSB7XFxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGhpcy5zY2hlbWEoKSksXFxuICAgIGl0ZW0gPSAnJyxcXG4gICAgcmVzdWx0ID0gW10sXFxuICAgIGkgPSAwLFxcbiAgICBsZW5ndGggPSAwO1xcbiAgICBcXG4gICAgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IFxcbiAgICBcXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7IFxcbiAgICAgICAgaXRlbSA9IGtleXNbaV07IFxcbiAgICAgICAgaWYgKHRoaXMuc2NoZW1hKClbaXRlbV0gPT09ICdjb2xsZWN0aW9uJykge1xcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xcbiAgICAgICAgfVxcbiAgICB9XFxuICAgIFxcbiAgICByZXR1cm4gcmVzdWx0O1xcbn1cIixcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMWVmNzExYjQxNzFjODQ5XCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMWVmNzExYjQxNzFjODQ5XCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVDbGFzc0luZm9cIixcbiAgICAgICAgICAgIFwic3RhdGVcIjogXCJldmVudFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiBldmVudChuYW1lKSB7XFxuICAgIHZhciByZXN1bHQgPSB7fTtcXG4gICAgXFxuICAgIGlmICh0aGlzLnNjaGVtYSgpW25hbWVdID09PSAnZXZlbnQnKSB7XFxuICAgICAgICByZXN1bHQgPSB0aGlzLm1vZGVsKClbbmFtZV07XFxuICAgIH0gXFxuICAgIFxcbiAgICByZXR1cm4gcmVzdWx0O1xcbn1cIixcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMWJhZTUxYjZlZDFkMjVjXCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMWJhZTUxYjZlZDFkMjVjXCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVDbGFzc0luZm9cIixcbiAgICAgICAgICAgIFwic3RhdGVcIjogXCJldmVudHNcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZnVuY3Rpb24gZXZlbnRzKG5hbWUpIHtcXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLnNjaGVtYSgpKSxcXG4gICAgaXRlbSA9ICcnLFxcbiAgICByZXN1bHQgPSBbXSxcXG4gICAgaSA9IDAsXFxuICAgIGxlbmd0aCA9IDA7XFxuICAgIFxcbiAgICBsZW5ndGggPSBrZXlzLmxlbmd0aDtcXG4gICAgXFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xcbiAgICAgICAgaXRlbSA9IGtleXNbaV07XFxuICAgICAgICBpZiAodGhpcy5zY2hlbWEoKVtpdGVtXSA9PT0gJ2V2ZW50Jykge1xcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xcbiAgICAgICAgfVxcbiAgICB9IFxcbiAgICByZXR1cm4gcmVzdWx0O1xcbn1cIixcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMTlhYzIxMjUyMjE1MjhiXCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTlhYzIxMjUyMjE1MjhiXCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVDbGFzc0luZm9cIixcbiAgICAgICAgICAgIFwic3RhdGVcIjogXCJsaW5rXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiOiBcImZ1bmN0aW9uIGxpbmsobmFtZSkge1xcbiAgICB2YXIgcmVzdWx0ID0ge307XFxuICAgIFxcbiAgICBpZiAodGhpcy5zY2hlbWEoKVtuYW1lXSA9PT0gJ2xpbmsnKSB7XFxuICAgICAgICByZXN1bHQgPSB0aGlzLm1vZGVsKClbbmFtZV07XFxuICAgIH1cXG4gICAgcmV0dXJuIHJlc3VsdDtcXG59XCIsXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcIjE3ZWQyMWRmYzAxYjhlOFwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjE3ZWQyMWRmYzAxYjhlOFwiLFxuICAgICAgICAgICAgXCJjb21wb25lbnRcIjogXCJSdW50aW1lQ2xhc3NJbmZvXCIsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwibGlua3NcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZnVuY3Rpb24gbGlua3MobmFtZSkgeyBcXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLnNjaGVtYSgpKSxcXG4gICAgaXRlbSA9ICcnLFxcbiAgICByZXN1bHQgPSBbXSxcXG4gICAgaSA9IDAsXFxuICAgIGxlbmd0aCA9IDA7XFxuICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xcbiAgICBcXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XFxuICAgICAgICBpdGVtID0ga2V5c1tpXTtcXG4gICAgICAgIGlmICh0aGlzLnNjaGVtYSgpW2l0ZW1dID09PSAnbGluaycpIHtcXG4gICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcXG4gICAgICAgIH1cXG4gICAgfSByZXR1cm4gcmVzdWx0O1xcbn1cIixcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMTFjZTMxOGE1NjFhYzYxXCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTFjZTMxOGE1NjFhYzYxXCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVDbGFzc0luZm9cIixcbiAgICAgICAgICAgIFwic3RhdGVcIjogXCJtZXRob2RcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZnVuY3Rpb24gbWV0aG9kKG5hbWUpIHtcXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xcbiAgICBpZiAodGhpcy5zY2hlbWEoKVtuYW1lXSA9PT0gJ21ldGhvZCcpIHtcXG4gICAgICAgIHJlc3VsdCA9IHRoaXMubW9kZWwoKVtuYW1lXTtcXG4gICAgICAgIFxcbiAgICB9XFxuICAgIFxcbiAgICByZXR1cm4gcmVzdWx0O1xcbn1cIixcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMTJmZjIxOTBhMDE4MDQ2XCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTJmZjIxOTBhMDE4MDQ2XCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVDbGFzc0luZm9cIixcbiAgICAgICAgICAgIFwic3RhdGVcIjogXCJtZXRob2RzXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiOiBcImZ1bmN0aW9uIG1ldGhvZHMobmFtZSkge1xcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuc2NoZW1hKCkpLFxcbiAgICBpdGVtID0gJycsXFxuICAgIHJlc3VsdCA9IFtdLFxcbiAgICBpID0gMCxcXG4gICAgbGVuZ3RoID0gMDtcXG4gICAgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xcbiAgICAgICAgaXRlbSA9IGtleXNbaV07XFxuICAgICAgICBpZiAodGhpcy5zY2hlbWEoKVtpdGVtXSA9PT0gJ21ldGhvZCcpIHtcXG4gICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcXG4gICAgICAgIH1cXG4gICAgfSBcXG4gICAgXFxuICAgIHJldHVybiByZXN1bHQ7XFxufVwiLFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCIxMDI4ZDE2ODFlMWZkNThcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxMDI4ZDE2ODFlMWZkNThcIixcbiAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IFwiUnVudGltZUNsYXNzSW5mb1wiLFxuICAgICAgICAgICAgXCJzdGF0ZVwiOiBcInByb3BlcnRpZXNcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZnVuY3Rpb24gcHJvcGVydGllcyhuYW1lKSB7IFxcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuc2NoZW1hKCkpLFxcbiAgICBpdGVtID0gJycsXFxuICAgIHJlc3VsdCA9IFtdLFxcbiAgICBpID0gMCxcXG4gICAgbGVuZ3RoID0gMDtcXG4gICAgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XFxuICAgIFxcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcXG4gICAgICAgIGl0ZW0gPSBrZXlzW2ldO1xcbiAgICAgICAgaWYgKHRoaXMuc2NoZW1hKClbaXRlbV0gPT09ICdwcm9wZXJ0eScpIHtcXG4gICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcXG4gICAgICAgIH1cXG4gICAgfSByZXR1cm4gcmVzdWx0O1xcbn1cIixcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMThlZWIxMGM1MzE5MzY4XCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMThlZWIxMGM1MzE5MzY4XCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVDbGFzc0luZm9cIixcbiAgICAgICAgICAgIFwic3RhdGVcIjogXCJwcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiBwcm9wZXJ0eShuYW1lKSB7XFxuICAgIHZhciByZXN1bHQgPSB7fTtcXG4gICAgXFxuICAgIGlmICh0aGlzLnNjaGVtYSgpW25hbWVdID09PSAncHJvcGVydHknKSB7XFxuICAgICAgICByZXN1bHQgPSB0aGlzLm1vZGVsKClbbmFtZV07XFxuICAgIH1cXG4gICAgcmV0dXJuIHJlc3VsdDtcXG59XCIsXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcIjFiYTcyMTIwMTExNGI2YlwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjFiYTcyMTIwMTExNGI2YlwiLFxuICAgICAgICAgICAgXCJjb21wb25lbnRcIjogXCJSdW50aW1lQ29tcG9uZW50XCIsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwiZGVzdHJveVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiBkZXN0cm95KCkge1xcbiAgICAkY29tcG9uZW50LmRlc3Ryb3kodGhpcy5pZCgpKTtcXG59XCIsXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwidXNlQ29yZUFQSVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMTU0ODYxODZmNDFhNDhjXCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTU0ODYxODZmNDFhNDhjXCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVDb21wb25lbnRcIixcbiAgICAgICAgICAgIFwic3RhdGVcIjogXCJvZmZcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZnVuY3Rpb24gb2ZmKHN0YXRlLCBiZWhhdmlvcklkKSB7XFxuICAgIHZhciBhcmdzID0gW10sXFxuICAgIGkgPSAwLFxcbiAgICBsZW5ndGggPSAwO1xcbiAgICBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xcbiAgICBcXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aCAtIDc7IGkrKykge1xcbiAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XFxuICAgIH1cXG4gICAgXFxuICAgIGlmICgkd29ya2Zsb3cuY2hlY2tQYXJhbXMoe1xcbiAgICAgICAgXFxcImNvbXBvbmVudFxcXCI6IHRoaXMsIFxcbiAgICAgICAgXFxcIm1ldGhvZE5hbWVcXFwiOiBcXFwib2ZmXFxcIiwgXFxuICAgICAgICBcXFwiYXJnc1xcXCI6IGFyZ3NcXG4gICAgICAgIH0pKSB7XFxuICAgICAgICBcXG4gICAgICAgIGlmIChzdGF0ZSB8fCBiZWhhdmlvcklkKSB7XFxuICAgICAgICAgICAgaWYgKCRtZXRhbW9kZWwuaXNWYWxpZFN0YXRlKHN0YXRlLCB0aGlzLmNvbnN0cnVjdG9yLm5hbWUpKSB7XFxuICAgICAgICAgICAgICAgICRiZWhhdmlvci5yZW1vdmUoe1xcbiAgICAgICAgICAgICAgICAgICAgXFxcImJlaGF2aW9ySWRcXFwiOiBiZWhhdmlvcklkLCBcXG4gICAgICAgICAgICAgICAgICAgIFxcXCJjb21wb25lbnRJZFxcXCI6IHRoaXMuaWQoKSwgXFxuICAgICAgICAgICAgICAgICAgICBcXFwic3RhdGVcXFwiOiBzdGF0ZVxcbiAgICAgICAgICAgICAgICB9KTtcXG4gICAgICAgICAgICB9IGVsc2UgeyBcXG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1aXJlKCdsb2dnZXInKS53YXJuKFxcXCJpbnZva2UgXFxcXCdvZmZcXFxcJyBtZXRob2Qgb2YgY29tcG9uZW50ICdcXFwiICsgdGhpcy5pZCgpICsgXFxcIicgd2l0aCBhbiBpbnZhbGlkIHN0YXRlICdcXFwiICsgc3RhdGUgKyBcXFwiJ1xcXCIpOyBcXG4gICAgICAgICAgICB9XFxuICAgICAgICB9IGVsc2Uge1xcbiAgICAgICAgICAgICRiZWhhdmlvci5yZW1vdmUoe1xcbiAgICAgICAgICAgICAgICBcXFwiY29tcG9uZW50SWRcXFwiOiB0aGlzLmlkKClcXG4gICAgICAgICAgICB9KTtcXG4gICAgICAgIH1cXG4gICAgfVxcbn1cIixcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJ1c2VDb3JlQVBJXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCIxZGEwYTE3ODc4MTA0YzNcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxZGEwYTE3ODc4MTA0YzNcIixcbiAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IFwiUnVudGltZUNvbXBvbmVudFwiLFxuICAgICAgICAgICAgXCJzdGF0ZVwiOiBcInJlcXVpcmVcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZnVuY3Rpb24gcmVxdWlyZShpZCkge1xcbiAgICByZXR1cm4gJGNvbXBvbmVudC5nZXQoaWQpO1xcbn1cIixcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJ1c2VDb3JlQVBJXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCIxYTUxMTFkMTdhMTgwMGNcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxYTUxMTFkMTdhMTgwMGNcIixcbiAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IFwiUnVudGltZURhdGFiYXNlXCIsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwiY29sbGVjdGlvbnNcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZnVuY3Rpb24gY29sbGVjdGlvbnMoKSB7XFxuICAgIHZhciByZXN1bHQgPSB7fSxcXG4gICAgY29sbGVjdGlvbk5hbWUgPSAnJztcXG4gICAgXFxuICAgIGZvciAoY29sbGVjdGlvbk5hbWUgaW4gJGRiLnN0b3JlKSB7XFxuICAgICAgICBpZiAoJGRiLnN0b3JlLmhhc093blByb3BlcnR5KGNvbGxlY3Rpb25OYW1lKSAmJiBjb2xsZWN0aW9uTmFtZS5pbmRleE9mKCdSdW50aW1lJykgIT09IDApIHtcXG4gICAgICAgICAgICByZXN1bHRbY29sbGVjdGlvbk5hbWVdID0gJGRiW2NvbGxlY3Rpb25OYW1lXTtcXG4gICAgICAgICAgICBcXG4gICAgICAgIH1cXG4gICAgfVxcbiAgICByZXR1cm4gcmVzdWx0O1xcbn1cIixcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJ1c2VDb3JlQVBJXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCIxZTViZjE2N2NhMWI2MWVcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxZTViZjE2N2NhMWI2MWVcIixcbiAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IFwiUnVudGltZURhdGFiYXNlXCIsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwic3Vic3lzdGVtXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiOiBcImZ1bmN0aW9uIHN1YnN5c3RlbShwYXJhbXMpIHtcXG4gICAgcmV0dXJuICRkYi5zdWJzeXN0ZW0ocGFyYW1zKTtcXG59XCIsXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwidXNlQ29yZUFQSVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMTVhYjExMTJlODFiMWI0XCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTVhYjExMTJlODFiMWI0XCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVEYXRhYmFzZVwiLFxuICAgICAgICAgICAgXCJzdGF0ZVwiOiBcInN5c3RlbVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiBzeXN0ZW0oc3lzdGVtKSB7XFxuICAgIHZhciByZXN1bHQgID0gJyc7XFxuICAgIFxcbiAgICBpZiAoc3lzdGVtKSB7XFxuICAgICAgcmVzdWx0ID0gJGRiLnN5c3RlbShzeXN0ZW0pO1xcbiAgICAgIHRoaXMucmVxdWlyZShyZXN1bHQpLnN0YXRlKCdhY3RpdmUnKTtcXG4gICAgfSBlbHNlIHtcXG4gICAgICByZXN1bHQgPSAkZGIuc3lzdGVtKCk7XFxuICAgIH1cXG4gICAgcmV0dXJuIHJlc3VsdDtcXG59XCIsXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwidXNlQ29yZUFQSVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMWQ5OTMxMDhmYTE4ZWYyXCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMWQ5OTMxMDhmYTE4ZWYyXCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVMb2dnZXJcIixcbiAgICAgICAgICAgIFwic3RhdGVcIjogXCJkZWJ1Z1wiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiBkZWJ1ZyhtZXNzYWdlKSB7XFxuICAgIGlmICh0aGlzLmxldmVsKCkgPT09ICdkZWJ1ZycpIHtcXG4gICAgICAgIGNvbnNvbGUubG9nKCdydW50aW1lOiAnICsgbWVzc2FnZSk7XFxuICAgIH1cXG59XCIsXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcIjFhMzdhMTg4ZTExZmU3M1wiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjFhMzdhMTg4ZTExZmU3M1wiLFxuICAgICAgICAgICAgXCJjb21wb25lbnRcIjogXCJSdW50aW1lTG9nZ2VyXCIsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwiZXJyb3JcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZnVuY3Rpb24gZXJyb3IobWVzc2FnZSkge1xcbiAgICBjb25zb2xlLmVycm9yKCdydW50aW1lOiAnICsgbWVzc2FnZSk7XFxufVwiLFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCIxZWRkMjFlMTJhMTY1MzRcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxZWRkMjFlMTJhMTY1MzRcIixcbiAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IFwiUnVudGltZUxvZ2dlclwiLFxuICAgICAgICAgICAgXCJzdGF0ZVwiOiBcImluZm9cIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZnVuY3Rpb24gaW5mbyhtZXNzYWdlKSB7XFxuICAgIGlmICh0aGlzLmxldmVsKCkgPT09ICdpbmZvJyB8fCB0aGlzLmxldmVsKCkgPT09ICdkZWJ1ZycpIHtcXG4gICAgICAgIGNvbnNvbGUuaW5mbygncnVudGltZTogJyArIG1lc3NhZ2UpO1xcbiAgICB9XFxufVwiLFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCIxNDFmMjE0M2QzMTIyYTRcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxNDFmMjE0M2QzMTIyYTRcIixcbiAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IFwiUnVudGltZUxvZ2dlclwiLFxuICAgICAgICAgICAgXCJzdGF0ZVwiOiBcImxldmVsXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiOiBcImZ1bmN0aW9uIGxldmVsKHZhbCkge1xcbiAgICAkbG9nLmxldmVsKHZhbCk7XFxufVwiLFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWUsXG4gICAgICAgICAgICBcInVzZUNvcmVBUElcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcIjE5MjQwMWJhYjIxMzA0ZVwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjE5MjQwMWJhYjIxMzA0ZVwiLFxuICAgICAgICAgICAgXCJjb21wb25lbnRcIjogXCJSdW50aW1lTG9nZ2VyXCIsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwid2FyblwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiB3YXJuKG1lc3NhZ2UpIHtcXG4gICAgaWYgKHRoaXMubGV2ZWwoKSA9PT0gJ2luZm8nIHx8IHRoaXMubGV2ZWwoKSA9PT0gJ3dhcm4nIHx8IHRoaXMubGV2ZWwoKSA9PT0gJ2RlYnVnJykge1xcbiAgICAgICAgY29uc29sZS53YXJuKCdydW50aW1lOiAnICsgbWVzc2FnZSk7XFxuICAgIH0gXFxufVwiLFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCIxMWZjNzE1ZTJmMWEzMWVcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxMWZjNzE1ZTJmMWEzMWVcIixcbiAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IFwiUnVudGltZU1ldGFtb2RlbFwiLFxuICAgICAgICAgICAgXCJzdGF0ZVwiOiBcImNyZWF0ZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiBjcmVhdGUoKSB7XFxuICAgICAgICAkbWV0YW1vZGVsLmNyZWF0ZSgpO1xcbn1cIixcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJ1c2VDb3JlQVBJXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCIxMjMyZjFmMTA3MTQyY2ZcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxMjMyZjFmMTA3MTQyY2ZcIixcbiAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IFwiUnVudGltZU1ldGFtb2RlbFwiLFxuICAgICAgICAgICAgXCJzdGF0ZVwiOiBcIm1vZGVsXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiOiBcImZ1bmN0aW9uIG1vZGVsKG1vZGVsKSB7XFxuICAgIHJldHVybiAkbWV0YW1vZGVsLm1vZGVsKG1vZGVsKTtcXG59XCIsXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwidXNlQ29yZUFQSVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMTM2NTQxMmY2OTE1M2QyXCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTM2NTQxMmY2OTE1M2QyXCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVNZXRhbW9kZWxcIixcbiAgICAgICAgICAgIFwic3RhdGVcIjogXCJzY2hlbWFcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZnVuY3Rpb24gc2NoZW1hKHNjaGVtYSkge1xcbiAgICByZXR1cm4gJG1ldGFtb2RlbC5zY2hlbWEoc2NoZW1hKTtcXG59XCIsXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwidXNlQ29yZUFQSVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMTk0ZGIxNDdmZTE2MWEyXCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTk0ZGIxNDdmZTE2MWEyXCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVNZXRhbW9kZWxcIixcbiAgICAgICAgICAgIFwic3RhdGVcIjogXCJ0eXBlXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiOiBcImZ1bmN0aW9uIHR5cGUodHlwZSkge1xcbiAgICByZXR1cm4gJG1ldGFtb2RlbC50eXBlKHR5cGUpO1xcbn1cIixcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJ1c2VDb3JlQVBJXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCIxMjlmNzE1Njg3MTdhMjJcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxMjlmNzE1Njg3MTdhMjJcIixcbiAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IFwiUnVudGltZVN5c3RlbVwiLFxuICAgICAgICAgICAgXCJzdGF0ZVwiOiBcInN5bmNcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZnVuY3Rpb24gc3luYygpIHtcXG4gICAgdmFyIHN5c3RlbSA9IEpTT04ucGFyc2UoJGRiLnN5c3RlbSgpKTtcXG4gICAgXFxuICAgIHRoaXMuc2NoZW1hcyhzeXN0ZW0uc2NoZW1hcyk7XFxuICAgIHRoaXMudHlwZXMoc3lzdGVtLnR5cGVzKTtcXG4gICAgdGhpcy5iZWhhdmlvcnMoc3lzdGVtLmJlaGF2aW9ycyk7XFxuICAgIHRoaXMuY29tcG9uZW50cyhzeXN0ZW0uY29tcG9uZW50cyk7XFxufVwiLFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWUsXG4gICAgICAgICAgICBcInVzZUNvcmVBUElcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcIjFlZjk1MWYxNDExYjg5NVwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjFlZjk1MWYxNDExYjg5NVwiLFxuICAgICAgICAgICAgXCJjb21wb25lbnRcIjogXCJSdW50aW1lT1NHaVwiLFxuICAgICAgICAgICAgXCJzdGF0ZVwiOiBcImluc3RhbGxcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZnVuY3Rpb24gaW5zdGFsbCh1cmwsIGFzeW5jKSB7IFxcbiAgdmFyIGltcG9ydGVkU3lzdGVtID0gbnVsbCxcXG4gICAgICBzeXN0ZW0gPSB7fSxcXG4gICAgICBzeXN0ZW1JZCA9ICcnLFxcbiAgICAgIGNhbGxiYWNrTG9hZCA9IG51bGwsXFxuICAgICAgeGhyID0gbnVsbCxcXG4gICAgICByZXN1bHQgPSAnJyxcXG4gICAgICBjaGFubmVsID0gJGNvbXBvbmVudC5nZXQoJ2NoYW5uZWwnKTtcXG5cXG4gIGlmICh0eXBlb2YgdXJsID09PSAnb2JqZWN0Jykge1xcbiAgICBpbXBvcnRlZFN5c3RlbSA9IHVybDtcXG4gIH0gZWxzZSB7XFxuICAgIGlmICh1cmwuaW5kZXhPZigneycpID09PSAwKSB7XFxuICAgICAgaW1wb3J0ZWRTeXN0ZW0gPSBKU09OLnBhcnNlKHVybCk7XFxuICAgIH1cXG4gIH1cXG4gIFxcbiAgaWYgKGltcG9ydGVkU3lzdGVtKSB7XFxuICAgIHN5c3RlbUlkID0gdGhpcy5yZXF1aXJlKCdkYicpLnN5c3RlbShpbXBvcnRlZFN5c3RlbSk7IFxcbiAgICBpZiAoc3lzdGVtSWQpIHtcXG4gICAgICBzeXN0ZW0gPSB0aGlzLnJlcXVpcmUoc3lzdGVtSWQpO1xcbiAgICAgIFxcbiAgICAgIGlmICh0eXBlb2YgdXJsID09PSAnc3RyaW5nJykge1xcbiAgICAgICAgc3lzdGVtLmxvY2F0aW9uKHVybCk7XFxuICAgICAgfVxcbiAgICAgIHN5c3RlbS5zdGF0ZSgnaW5zdGFsbGVkJyk7ICAgIFxcbiAgICAgIGNoYW5uZWwuJHN5c3RlbUluc3RhbGxlZChzeXN0ZW1JZCk7XFxuICAgICAgc3lzdGVtLnN0YXRlKCdyZXNvbHZlZCcpO1xcbiAgICAgIGNoYW5uZWwuJHN5c3RlbVJlc29sdmVkKHN5c3RlbUlkKTtcXG4gICAgICBcXG4gICAgICByZXN1bHQgPSBzeXN0ZW1JZDtcXG4gICAgfVxcbiAgfSBlbHNlIHsgICBcXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XFxuICAgICAgaWYgKHVybC5pbmRleE9mKCcuanNvbicpICE9PSAtMSkge1xcbiAgICAgICAgc3lzdGVtID0gZ2xvYmFsLnJlcXVpcmUoZ2xvYmFsLnByb2Nlc3MuZW52LlBXRCArICcvJyArIHVybCk7XFxuICAgICAgfSBlbHNlIHtcXG4gICAgICAgIHN5c3RlbSA9IGdsb2JhbC5yZXF1aXJlKHVybCk7XFxuICAgICAgfVxcbiAgICAgIHN5c3RlbUlkID0gdGhpcy5yZXF1aXJlKCdkYicpLnN5c3RlbShzeXN0ZW0pO1xcbiAgICAgIHN5c3RlbSA9IHRoaXMucmVxdWlyZShzeXN0ZW1JZCk7XFxuICAgICAgXFxuICAgICAgaWYgKHR5cGVvZiB1cmwgPT09ICdzdHJpbmcnKSB7XFxuICAgICAgICBzeXN0ZW0ubG9jYXRpb24odXJsKTtcXG4gICAgICB9XFxuICAgICAgc3lzdGVtLnN0YXRlKCdpbnN0YWxsZWQnKTsgICAgXFxuICAgICAgY2hhbm5lbC4kc3lzdGVtSW5zdGFsbGVkKHN5c3RlbUlkKTtcXG4gICAgICBzeXN0ZW0uc3RhdGUoJ3Jlc29sdmVkJyk7XFxuICAgICAgY2hhbm5lbC4kc3lzdGVtUmVzb2x2ZWQoc3lzdGVtSWQpO1xcbiAgICAgIFxcbiAgICAgIHJlc3VsdCA9IHN5c3RlbUlkO1xcbiAgICB9IGVsc2Uge1xcbiAgICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xcbiAgICAgIGNhbGxiYWNrTG9hZCA9IGZ1bmN0aW9uIGNhbGxiYWNrTG9hZChzeXN0ZW0sIHVybCkge1xcbiAgICAgICAgdmFyIHN5c0lkID0gJGRiLnN5c3RlbShzeXN0ZW0pLFxcbiAgICAgICAgICAgIHN5cyA9ICRjb21wb25lbnQuZ2V0KHN5c0lkKSxcXG4gICAgICAgICAgICBjaGFubmVsID0gJGNvbXBvbmVudC5nZXQoJ2NoYW5uZWwnKTtcXG4gICAgICAgICAgICBcXG4gICAgICAgIGlmICh0eXBlb2YgdXJsID09PSAnc3RyaW5nJykgeyAgICBcXG4gICAgICAgICAgc3lzLmxvY2F0aW9uKHVybCk7ICAgIFxcbiAgICAgICAgfVxcbiAgICAgICAgc3lzLnN0YXRlKCdpbnN0YWxsZWQnKTsgICAgXFxuICAgICAgICBjaGFubmVsLiRzeXN0ZW1JbnN0YWxsZWQoc3lzSWQpO1xcbiAgICAgICAgc3lzLnN0YXRlKCdyZXNvbHZlZCcpO1xcbiAgICAgICAgY2hhbm5lbC4kc3lzdGVtUmVzb2x2ZWQoc3lzSWQpO1xcbiAgICAgICAgXFxuICAgICAgICByZXN1bHQgPSBzeXNJZDtcXG4gICAgICB9O1xcbiAgICAgIFxcbiAgICAgIGlmIChhc3luYykge1xcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XFxuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xcbiAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcXG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XFxuICAgICAgICAgICAgICBjYWxsYmFja0xvYWQoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpLCB1cmwpO1xcbiAgICAgICAgICAgIH1cXG4gICAgICAgICAgfVxcbiAgICAgICAgfTtcXG4gICAgICAgIHhoci5zZW5kKG51bGwpO1xcbiAgICAgIH0gZWxzZSB7XFxuICAgICAgICB4aHIub3BlbignR0VUJywgdXJsLCBmYWxzZSk7XFxuICAgICAgICB4aHIuc2VuZChudWxsKTtcXG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcXG4gICAgICAgICAgY2FsbGJhY2tMb2FkKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKSwgdXJsKTtcXG4gICAgICAgIH1cXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG4gIHJldHVybiByZXN1bHQ7XFxufVwiLFxuICAgICAgICAgICAgXCJ1c2VDb3JlQVBJXCI6IHRydWUsXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcIjE0YzE1MTdiNzExY2I3OFwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjE0YzE1MTdiNzExY2I3OFwiLFxuICAgICAgICAgICAgXCJjb21wb25lbnRcIjogXCJSdW50aW1lT1NHaVwiLFxuICAgICAgICAgICAgXCJzdGF0ZVwiOiBcInVuaW5zdGFsbFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiB1bmluc3RhbGwoaWQpIHsgXFxuXFx0dmFyIHNlYXJjaCA9IHt9LFxcblxcdCAgICBzeXN0ZW0gPSBudWxsLFxcblxcdCAgICBiZWhhdmlvcklkID0gJycsXFxuXFx0ICAgIGNvbGxlY3Rpb24gPSAgJycsXFxuXFx0ICAgIGNvbXBvbmVudElkID0gJycsXFxuXFx0ICAgIGxlbmd0aCA9IDAsXFxuXFx0ICAgIGkgPSAwLFxcblxcdCAgICBjb3JlQ29tcG9uZW50cyA9IFsnYWRtaW4nLCAnY2hhbm5lbCcsICdkYicsICdsb2dnZXInLCAnbWV0YW1vZGVsJywgJ3J1bnRpbWUnXTtcXG5cXHRcXG5cXHRzZWFyY2ggPSAkZGIuUnVudGltZVN5c3RlbS5maW5kKHtcXG5cXHQgICdfaWQnOiBpZFxcblxcdH0pO1xcblxcdFxcblxcdGlmIChzZWFyY2gubGVuZ3RoKSB7XFxuXFx0ICBzeXN0ZW0gPSBzZWFyY2hbMF07XFxuXFx0ICAvLyByZW1vdmUgYmVoYXZpb3JzXFxuXFx0ICBpZiAoc3lzdGVtLmJlaGF2aW9ycykge1xcblxcdCAgICBmb3IgKGJlaGF2aW9ySWQgaW4gc3lzdGVtLmJlaGF2aW9ycykge1xcblxcdCAgICAgICRkYi5SdW50aW1lQmVoYXZpb3IucmVtb3ZlKHsgXFxuXFx0ICAgICAgICAnX2lkJzogc3lzdGVtLmJlaGF2aW9yc1tiZWhhdmlvcklkXS5faWRcXG5cXHQgICAgICB9KTtcXG5cXHQgICAgfVxcblxcdCAgfVxcblxcdCAgLy8gcmVtb3ZlIGNvbXBvbmVudHNcXG5cXHQgIGlmIChzeXN0ZW0uY29tcG9uZW50cykge1xcblxcdCAgICBmb3IgKGNvbGxlY3Rpb24gaW4gc3lzdGVtLmNvbXBvbmVudHMpIHtcXG5cXHQgICAgICBmb3IgKGNvbXBvbmVudElkIGluIHN5c3RlbS5jb21wb25lbnRzW2NvbGxlY3Rpb25dKSB7XFxuXFx0ICAgICAgICBpZiAoY29yZUNvbXBvbmVudHMuaW5kZXhPZihjb21wb25lbnRJZCkgPT09IC0xKSB7XFxuICBcXHQgICAgICAgICRkYltjb2xsZWN0aW9uXS5yZW1vdmUoeyBcXG4gIFxcdCAgICAgICAgICAnX2lkJzogY29tcG9uZW50SWRcXG4gIFxcdCAgICAgICAgfSk7XFxuXFx0ICAgICAgICB9XFxuXFx0ICAgICAgfVxcblxcdCAgICB9XFxuXFx0ICB9XFxuXFx0fVxcblxcdFxcblxcdHRoaXMucmVxdWlyZShpZCkuc3RhdGUoJ3VuaW5zdGFsbGVkJyk7XFxuXFx0Y2hhbm5lbC4kc3lzdGVtVW5pbnN0YWxsZWQoaWQpO1xcbn1cIixcbiAgICAgICAgICAgIFwidXNlQ29yZUFQSVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCIxY2I5ZDEwM2Q0MWRkOTdcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxY2I5ZDEwM2Q0MWRkOTdcIixcbiAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IFwiZTg5YzYxN2I2YjE1ZDI0XCIsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwic3RhcnRcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZnVuY3Rpb24gc3RhcnQoKSB7XFxuICB2YXIgc3Vic3lzdGVtcyA9IFtdLFxcbiAgICBzeXN0ZW1zID0gW10sXFxuICAgIHN5c3RlbSA9IG51bGwsXFxuICAgIHNjcmlwdHMgPSBbXSxcXG4gICAgc2NyaXB0ID0gbnVsbCxcXG4gICAgbW9kZSA9ICcnLFxcbiAgICBsb2dMZXZlbCA9ICd3YXJuJyxcXG4gICAgaSA9IDAsXFxuICAgIGxlbmd0aCA9IDA7XFxuXFxuICAvLyBpbiBhIGJyb3dzZXJcXG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XFxuICAgIHN5c3RlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1zeXN0ZW1dJyk7XFxuICAgIGxlbmd0aCA9IHN5c3RlbXMubGVuZ3RoO1xcblxcbiAgICAvLyBsb2dnZXJcXG4gICAgc2NyaXB0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFtsb2ddJyk7XFxuICAgIGlmIChzY3JpcHRzLmxlbmd0aCkge1xcbiAgICAgIGxvZ0xldmVsID0gc2NyaXB0c1swXS5nZXRBdHRyaWJ1dGUoJ2xvZycpO1xcbiAgICAgIHRoaXMucmVxdWlyZSgnbG9nZ2VyJykubGV2ZWwobG9nTGV2ZWwpO1xcbiAgICB9XFxuXFxuICAgIC8vIG1vZGVcXG4gICAgc2NyaXB0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFttb2RlXScpO1xcbiAgICBpZiAoc2NyaXB0cy5sZW5ndGgpIHtcXG4gICAgICBtb2RlID0gc2NyaXB0c1swXS5nZXRBdHRyaWJ1dGUoJ21vZGUnKTtcXG4gICAgICBcXG4gICAgICBpZiAobW9kZSA9PT0gJ2RldicpIHtcXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGZ1bmN0aW9uIChlKSB7XFxuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XFxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcXG4gICAgICAgIH0sIGZhbHNlKTtcXG5cXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZnVuY3Rpb24gKGUpIHtcXG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xcbiAgICAgICAgfSwgZmFsc2UpO1xcblxcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGZ1bmN0aW9uIChlKSB7XFxuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XFxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcXG4gICAgICAgICAgdmFyIGZpbGVzID0gZS5kYXRhVHJhbnNmZXIuZmlsZXM7XFxuICAgICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xcbiAgICAgICAgICB2YXIganNvbiA9ICcnO1xcbiAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2ZW50KSB7XFxuICAgICAgICAgICAganNvbiArPSBldmVudC50YXJnZXQucmVzdWx0O1xcbiAgICAgICAgICB9O1xcbiAgICAgICAgICByZWFkZXIub25sb2FkZW5kID0gZnVuY3Rpb24gKCkge1xcbiAgICAgICAgICAgIHZhciBzeXMgPSBKU09OLnBhcnNlKGpzb24pO1xcbiAgICAgICAgICAgIHJ1bnRpbWUuaW5zdGFsbChzeXMpO1xcbiAgICAgICAgICB9O1xcbiAgICAgICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlc1swXSwgJ1VURi04Jyk7XFxuICAgICAgICB9KTtcXG4gICAgICB9XFxuICAgICAgaWYgKG1vZGUgPT09ICdkZXNpZ24nKSB7XFxuICAgICAgICB0aGlzLnJlcXVpcmUoJ2FkbWluJykuc3RhcnQoKTtcXG4gICAgICB9XFxuICAgIH1cXG5cXG4gICAgLy8gc3lzdGVtc1xcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcXG4gICAgICBzeXN0ZW0gPSBzeXN0ZW1zW2ldO1xcblxcbiAgICAgIGlmIChzeXN0ZW0uZ2V0QXR0cmlidXRlKCdhc3luYycpID09PSAnZmFsc2UnKSB7XFxuICAgICAgICB0aGlzLnJlcXVpcmUoJ3J1bnRpbWUnKS5pbnN0YWxsKHN5c3RlbS5ocmVmLCBmYWxzZSk7XFxuICAgICAgfSBlbHNlIHtcXG4gICAgICAgIHRoaXMucmVxdWlyZSgncnVudGltZScpLmluc3RhbGwoc3lzdGVtLmhyZWYsIHRydWUpO1xcbiAgICAgIH1cXG4gICAgfVxcblxcbiAgICAvLyBkZXNpZ25lciAoZGVwcmVjYXRlZClcXG4gICAgc2NyaXB0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFtkZXNpZ25lcl0nKTtcXG4gICAgaWYgKHNjcmlwdHMubGVuZ3RoKSB7XFxuICAgICAgdGhpcy5yZXF1aXJlKCdhZG1pbicpLnN0YXJ0KCk7XFxuICAgIH1cXG5cXG4gICAgLy8gcmVhZHkgZXZlbnRcXG4gICAgaWYgKGxlbmd0aCA9PT0gMCkge1xcbiAgICAgIHRoaXMucmVxdWlyZSgncnVudGltZScpLnJlYWR5KCk7XFxuICAgIH1cXG4gIH1cXG59XCIsXG4gICAgICAgICAgICBcInVzZUNvcmVBUElcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMTA1ZjIxOWM2ODEzNjQzXCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTA1ZjIxOWM2ODEzNjQzXCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVPU0dpXCIsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwic3RhcnRcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZnVuY3Rpb24gc3RhcnQoaWQpIHsgXFxuXFx0dmFyIHN5c3RlbSA9IHRoaXMucmVxdWlyZShpZCksXFxuXFx0ICAgIGNoYW5uZWwgPSB0aGlzLnJlcXVpcmUoJ2NoYW5uZWwnKTtcXG5cXHRcXG5cXHRpZiAoc3lzdGVtLnN0YXRlKCkgPT09ICdyZXNvbHZlZCcgfHwgc3lzdGVtLnN0YXRlKCkgPT09ICdpbnN0YWxsZWQnKSB7XFxuICBcXHRzeXN0ZW0uc3RhdGUoJ3N0YXJ0aW5nJyk7XFxuICBcXHRpZiAoc3lzdGVtLm1haW4pIHtcXG4gIFxcdCAgc3lzdGVtLm1haW4oKTtcXG4gIFxcdH1cXG4gIFxcdGlmIChzeXN0ZW0uc3RhcnQpIHtcXG4gIFxcdCAgc3lzdGVtLnN0YXJ0KCk7XFxuICBcXHR9XFxuICBcXHRjaGFubmVsLiRzeXN0ZW1TdGFydGVkKGlkKTtcXG4gIFxcdHN5c3RlbS5zdGF0ZSgnYWN0aXZlJyk7XFxuXFx0fVxcbn1cIixcbiAgICAgICAgICAgIFwidXNlQ29yZUFQSVwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMWE4MWExZjAwZDE3MjY5XCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMWE4MWExZjAwZDE3MjY5XCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVPU0dpXCIsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwic3RvcFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiBzdG9wKGlkKSB7IFxcblxcdHZhciBzeXN0ZW0gPSB0aGlzLnJlcXVpcmUoaWQpLFxcblxcdCAgICBjaGFubmVsID0gdGhpcy5yZXF1aXJlKCdjaGFubmVsJyk7XFxuXFx0ICAgIFxcblxcdGlmIChzeXN0ZW0uc3RhdGUoKSA9PT0gJ2FjdGl2ZScpIHtcXG4gIFxcdHN5c3RlbS5zdGF0ZSgnc3RvcHBpbmcnKTtcXG4gIFxcdGlmIChzeXN0ZW0uc3RvcCkge1xcbiAgXFx0ICBzeXN0ZW0uc3RvcCgpO1xcbiAgXFx0fVxcbiAgXFx0Y2hhbm5lbC4kc3lzdGVtU3RvcHBlZChpZCk7XFxuICBcXHRzeXN0ZW0uc3RhdGUoJ3Jlc29sdmVkJyk7XFxuICBcXHRjaGFubmVsLiRzeXN0ZW1SZXNvbHZlZChpZCk7XFxuXFx0fVxcbn1cIixcbiAgICAgICAgICAgIFwidXNlQ29yZUFQSVwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMTE2ODUxYjYwMjEyOGQxXCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTE2ODUxYjYwMjEyOGQxXCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVPU0dpXCIsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwic3RhdHVzXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiOiBcImZ1bmN0aW9uIHN0YXR1cygpIHsgXFxuXFx0dmFyIHJlc3VsdCA9IHt9LFxcblxcdCAgICBzeXN0ZW0gPSBudWxsLFxcblxcdCAgICBsZW5ndGggPSAwLFxcblxcdCAgICBpID0gMDtcXG5cXHRcXG5cXHRzeXN0ZW1zID0gJGRiLlJ1bnRpbWVTeXN0ZW0uZmluZCh7fSk7XFxuXFx0XFxuXFx0bGVuZ3RoID0gc3lzdGVtcy5sZW5ndGg7XFxuXFx0Zm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XFxuXFx0ICAgIHN5c3RlbSA9IHN5c3RlbXNbaV07XFxuXFx0ICAgIHJlc3VsdFtzeXN0ZW0ubmFtZV0gPSB7XFxuXFx0ICAgICAgJ2lkJzogc3lzdGVtLl9pZCxcXG5cXHQgICAgICAnc3RhdGUnOiBzeXN0ZW0uc3RhdGUsXFxuXFx0ICAgICAgJ25hbWUnOiBzeXN0ZW0ubmFtZSxcXG5cXHQgICAgICAndmVyc2lvbic6IHN5c3RlbS52ZXJzaW9uLFxcblxcdCAgICAgICdsb2NhdGlvbic6IHN5c3RlbS5sb2NhdGlvbixcXG5cXHQgICAgICAnbWFzdGVyJzogc3lzdGVtLm1hc3RlclxcblxcdCAgICB9O1xcblxcdH1cXG5cXHRcXG5cXHRyZXR1cm4gcmVzdWx0O1xcbn1cIixcbiAgICAgICAgICAgIFwidXNlQ29yZUFQSVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJjb3JlXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCIxMmU0OTE4NTljMTM5MThcIjoge1xuICAgICAgICAgICAgXCJfaWRcIjogXCIxMmU0OTE4NTljMTM5MThcIixcbiAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IFwiUnVudGltZUNoYW5uZWxcIixcbiAgICAgICAgICAgIFwic3RhdGVcIjogXCIkc3lzdGVtU3RhcnRlZFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiAkc3lzdGVtU3RhcnRlZChpZCkgeyBcXG4gIHZhciBzeXN0ZW1zID0gbnVsbDtcXG4gICAgXFxuICBpZiAoaWQgIT09ICdlODljNjE3YjZiMTVkMjQnKSB7XFxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XFxuICAgICAgc3lzdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbcmVsPXN5c3RlbV0nKTtcXG4gICAgICAgICBcXG4gICAgICBpZiAoJHN0YXRlLmdldCgncnVudGltZScpICYmICRzdGF0ZS5nZXQoJ3J1bnRpbWUnKS5uYW1lID09PSAncmVhZHknKSB7ICAgIFxcbiAgICAgIH0gZWxzZSB7XFxuICAgICAgICBpZiAoc3lzdGVtcy5sZW5ndGggKyAxID09PSAkZGIuUnVudGltZVN5c3RlbS5jb3VudCgpKSB7XFxuICAgICAgICAgICRjb21wb25lbnQuZ2V0KCdydW50aW1lJykucmVhZHkoKTtcXG4gICAgICAgIH1cXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XCIsXG4gICAgICAgICAgICBcInVzZUNvcmVBUElcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMWU5MDIxYmQ0ZTFiYzZlXCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMWU5MDIxYmQ0ZTFiYzZlXCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVDaGFubmVsXCIsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwiJHN5c3RlbUluc3RhbGxlZFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiAkc3lzdGVtSW5zdGFsbGVkKGlkKSB7XFxuICAgIHZhciBzeXN0ZW1zID0gbnVsbCxcXG4gICAgICAgIGRlcGVuZGVuY2llcyA9IFtdLFxcbiAgICAgICAgbWFzdGVyID0gW10sXFxuICAgICAgICBjYW5TdGFydCA9IHRydWU7XFxuXFxuICAgIGlmIChpZCAhPT0gJ2U4OWM2MTdiNmIxNWQyNCcpIHtcXG4gICAgICAvLyBpZiBhbGwgc3lzdGVtcyBhcmUgaW5zdGFsbGVkXFxuICAgICAgc3lzdGVtcyA9ICRkYi5SdW50aW1lU3lzdGVtLmZpbmQoe30pO1xcblxcbiAgICAgIHN5c3RlbXMuZm9yRWFjaChmdW5jdGlvbiAoc3lzdGVtKSB7XFxuICAgICAgICAgIHZhciBzeXMgPSB0aGlzLnJlcXVpcmUoc3lzdGVtLl9pZCk7XFxuICAgICAgICAgIGlmIChzeXMuc3RhdGUoKSA9PT0gJ25vbmUnKSB7XFxuICAgICAgICAgICAgICBjYW5TdGFydCA9IGZhbHNlO1xcbiAgICAgICAgICB9XFxuICAgICAgfS5iaW5kKHRoaXMpKTtcXG5cXG4gICAgICAvLyBzdGFydCBhbGwgdGhlIHN5c3RlbXNcXG4gICAgICBpZiAoY2FuU3RhcnQpIHtcXG4gICAgICAgICAgZGVwZW5kZW5jaWVzID0gJGRiLlJ1bnRpbWVTeXN0ZW0uZmluZCh7XFxuICAgICAgICAgICAgICAnbWFzdGVyJzogZmFsc2VcXG4gICAgICAgICAgfSk7XFxuXFxuICAgICAgICAgIGRlcGVuZGVuY2llcy5mb3JFYWNoKGZ1bmN0aW9uIChkZXApIHtcXG4gICAgICAgICAgICAgIHZhciBzeXN0ZW0gPSB0aGlzLnJlcXVpcmUoZGVwLl9pZCk7XFxuICAgICAgICAgICAgICBjaGFubmVsID0gdGhpcy5yZXF1aXJlKCdjaGFubmVsJyk7XFxuICAgICAgICAgICAgICBcXG4gICAgICAgICAgICAgIGlmIChzeXN0ZW0uc3RhdGUoKSA9PT0gJ3Jlc29sdmVkJykge1xcbiAgICAgICAgICAgICAgICBzeXN0ZW0uc3RhdGUoJ3N0YXJ0aW5nJyk7XFxuICAgICAgICAgICAgICAgIHN5c3RlbS5zdGFydCgpO1xcbiAgICAgICAgICAgICAgICBjaGFubmVsLiRzeXN0ZW1TdGFydGVkKGRlcC5faWQpO1xcbiAgICAgICAgICAgICAgICBzeXN0ZW0uc3RhdGUoJ2FjdGl2ZScpO1xcbiAgICAgICAgICAgICAgfVxcbiAgICAgICAgICB9LmJpbmQodGhpcykpO1xcblxcbiAgICAgICAgICBtYXN0ZXIgPSAkZGIuUnVudGltZVN5c3RlbS5maW5kKHtcXG4gICAgICAgICAgICAgICdtYXN0ZXInOiB0cnVlXFxuICAgICAgICAgIH0pO1xcblxcbiAgICAgICAgICBtYXN0ZXIuZm9yRWFjaChmdW5jdGlvbiAoZGVwKSB7XFxuICAgICAgICAgICAgICB2YXIgc3lzdGVtID0gdGhpcy5yZXF1aXJlKGRlcC5faWQpO1xcbiAgICAgICAgICAgICAgY2hhbm5lbCA9IHRoaXMucmVxdWlyZSgnY2hhbm5lbCcpO1xcbiAgICAgICAgICAgICAgXFxuICAgICAgICAgICAgICBpZiAoc3lzdGVtLnN0YXRlKCkgPT09ICdyZXNvbHZlZCcpIHtcXG4gICAgICAgICAgICAgICAgc3lzdGVtLnN0YXRlKCdzdGFydGluZycpO1xcbiAgICAgICAgICAgICAgICBzeXN0ZW0uc3RhcnQoKTtcXG4gICAgICAgICAgICAgICAgY2hhbm5lbC4kc3lzdGVtU3RhcnRlZChkZXAuX2lkKTtcXG4gICAgICAgICAgICAgICAgc3lzdGVtLnN0YXRlKCdhY3RpdmUnKTtcXG4gICAgICAgICAgICAgIH1cXG4gICAgICAgICAgfS5iaW5kKHRoaXMpKTtcXG4gICAgICB9XFxuICB9XFxufVwiLFxuICAgICAgICAgICAgXCJ1c2VDb3JlQVBJXCI6IHRydWUsXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcIjFjZmE0MTQ1ZjYxNGRhOFwiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjFjZmE0MTQ1ZjYxNGRhOFwiLFxuICAgICAgICAgICAgXCJjb21wb25lbnRcIjogXCJSdW50aW1lXCIsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiBtZXNzYWdlKG1zZykgeyBcXG5cXHQkZGIuUnVudGltZU1lc3NhZ2UuaW5zZXJ0KG1zZyk7XFxufVwiLFxuICAgICAgICAgICAgXCJ1c2VDb3JlQVBJXCI6IHRydWUsXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcIjE4MmM1MWVkYzMxYWQ5N1wiOiB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIjE4MmM1MWVkYzMxYWQ5N1wiLFxuICAgICAgICAgICAgXCJjb21wb25lbnRcIjogXCJSdW50aW1lU3lzdGVtT1NHaVwiLFxuICAgICAgICAgICAgXCJzdGF0ZVwiOiBcInVuaW5zdGFsbFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJmdW5jdGlvbiB1bmluc3RhbGwoKSB7IFxcblxcdHRoaXMucmVxdWlyZSgncnVudGltZScpLnVuaW5zdGFsbCh0aGlzLmlkKCkpO1xcbn1cIixcbiAgICAgICAgICAgIFwidXNlQ29yZUFQSVwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMTljZjMxN2Q3MjE3MzMxXCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTljZjMxN2Q3MjE3MzMxXCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVPU0dpXCIsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwiYnVuZGxlXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiOiBcImZ1bmN0aW9uIGJ1bmRsZSgpIHsgXFxuXFx0dmFyIHJlc3VsdCA9IHRoaXMucmVxdWlyZSgnZGInKS5zeXN0ZW0oKTtcXG5cXHRyZXR1cm4gcmVzdWx0O1xcbn1cIixcbiAgICAgICAgICAgIFwidXNlQ29yZUFQSVwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwiY29yZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiMTRiNzcxNDQ5MTFjZTQ4XCI6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiMTRiNzcxNDQ5MTFjZTQ4XCIsXG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBcIlJ1bnRpbWVTeXN0ZW1PU0dpXCIsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwiYnVuZGxlXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiOiBcImZ1bmN0aW9uIGJ1bmRsZSgpIHsgXFxuXFx0dmFyIHJlc3VsdCA9ICcnLFxcblxcdHN5c3RlbSA9IFtdO1xcblxcdFxcblxcdHN5c3RlbXMgPSAkZGIuUnVudGltZVN5c3RlbS5maW5kKHtcXG4gICAgJ19pZCc6IHRoaXMuaWQoKVxcbiAgfSk7XFxuICBcXG4gIGlmIChzeXN0ZW1zLmxlbmd0aCkge1xcbiAgICByZXN1bHQgPSBKU09OLnN0cmluZ2lmeShzeXN0ZW1zWzBdKTtcXG4gIH1cXG4gIFxcblxcdHJldHVybiByZXN1bHQ7XFxufVwiLFxuICAgICAgICAgICAgXCJ1c2VDb3JlQVBJXCI6IHRydWUsXG4gICAgICAgICAgICBcImNvcmVcIjogdHJ1ZVxuICAgICAgICB9XG4gICAgfSxcbiAgICBcImNvbXBvbmVudHNcIjoge1xuICAgICAgICBcIlJ1bnRpbWVBZG1pblwiOiB7XG4gICAgICAgICAgICBcImFkbWluXCI6IHtcbiAgICAgICAgICAgICAgICBcIl9pZFwiOiBcImFkbWluXCIsXG4gICAgICAgICAgICAgICAgXCJfY29yZVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiZGVzaWduZXJXaW5kb3dcIjogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIlJ1bnRpbWVTdG9yYWdlXCI6IHtcbiAgICAgICAgICAgIFwic3RvcmFnZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJfaWRcIjogXCJzdG9yYWdlXCIsXG4gICAgICAgICAgICAgICAgXCJfY29yZVwiOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiUnVudGltZVwiOiB7XG4gICAgICAgICAgICBcInJ1bnRpbWVcIjoge1xuICAgICAgICAgICAgICAgIFwiX2lkXCI6IFwicnVudGltZVwiLFxuICAgICAgICAgICAgICAgIFwidmVyc2lvblwiOiBcIjEuOS42XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJSdW50aW1lRGF0YWJhc2VcIjoge1xuICAgICAgICAgICAgXCJkYlwiOiB7XG4gICAgICAgICAgICAgICAgXCJfaWRcIjogXCJkYlwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiUnVudGltZUxvZ2dlclwiOiB7XG4gICAgICAgICAgICBcImxvZ2dlclwiOiB7XG4gICAgICAgICAgICAgICAgXCJfaWRcIjogXCJsb2dnZXJcIixcbiAgICAgICAgICAgICAgICBcImxldmVsXCI6IFwid2FyblwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiUnVudGltZU1ldGFtb2RlbFwiOiB7XG4gICAgICAgICAgICBcIm1ldGFtb2RlbFwiOiB7XG4gICAgICAgICAgICAgICAgXCJfaWRcIjogXCJtZXRhbW9kZWxcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIlJ1bnRpbWVTeXN0ZW1cIjoge30sXG4gICAgICAgIFwiUnVudGltZUNoYW5uZWxcIjoge1xuICAgICAgICAgICAgXCJjaGFubmVsXCI6IHtcbiAgICAgICAgICAgICAgICBcIl9pZFwiOiBcImNoYW5uZWxcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBcIm5hbWVcIjogXCJzeXN0ZW0tcnVudGltZVwiLFxuICAgIFwidmVyc2lvblwiOiBcIjEuOS42XCIsXG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIlN5c3RlbSBSdW50aW1lXCIsXG4gICAgXCJfaWRcIjogXCJlODljNjE3YjZiMTVkMjRcIixcbiAgICBcIm1hc3RlclwiOiBmYWxzZSxcbiAgICBcInN1YnN5c3RlbVwiOiBmYWxzZVxufTtcblxuLyogZXhwb3J0cyAgKi9cblxuXG4vKipcbiAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIFJ1bnRpbWUgY29yZSBzeXN0ZW0uXG4gKlxuICogQG1vZHVsZSBydW50aW1lXG4gKiBAc3VibW9kdWxlIHJ1bnRpbWUtc3lzdGVtXG4gKiBAY2xhc3MgcnVudGltZS1zeXN0ZW1cbiAqIEBzdGF0aWMgXG4gKi9cblxuXG4vKipcbiAqIFJ1bnRpbWUgY29yZSBzeXN0ZW1cbiAqIEBwcm9wZXJ0eSB7UnVudGltZVN5c3RlbX0gc3lzdGVtXG4gKi9cbmV4cG9ydHMuc3lzdGVtID0gc3lzdGVtO1xuIiwiLypcbiAqIFN5c3RlbSBSdW50aW1lXG4gKiBcbiAqIGh0dHBzOi8vZGVzaWduZmlyc3QuaW8vc3lzdGVtcnVudGltZS9cbiAqIFxuICogQ29weXJpZ2h0IDIwMTcgRXJ3YW4gQ2FycmlvdVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogVGhpcyBtb2R1bGUgbWFuYWdlcyB0aGUgYmVoYXZpb3JzIG9mIGFsbCBjb21wb25lbnRzLiBcbiAqIEEgYmVoYXZpb3IgaXMgYSBtZWNhbmlzbSB0aGF0IGFsbG93IHVzZXJzIHRvIGFkZCBhY3Rpb25zIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBcbiAqIHdoZW4gYSBzcGVjaWZpYyBzdGF0ZSBvZiBhIGNvbXBvbmVudCB3aWxsIGNoYW5nZS5cbiAqIFxuICogQG1vZHVsZSBydW50aW1lXG4gKiBAc3VibW9kdWxlIHJ1bnRpbWUtYmVoYXZpb3JcbiAqIEByZXF1aXJlcyBydW50aW1lLWRiXG4gKiBAcmVxdWlyZXMgcnVudGltZS1oZWxwZXJcbiAqIEByZXF1aXJlcyBydW50aW1lLWNoYW5uZWxcbiAqIEBjbGFzcyBydW50aW1lLWJlaGF2aW9yXG4gKiBAc3RhdGljXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgJGRiID0gcmVxdWlyZSgnLi9kYi5qcycpO1xudmFyICRoZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlci5qcycpO1xuXG5cbi8qIFByaXZhdGUgcHJvcGVydGllcyAqL1xuXG5cbnZhciBzdG9yZSA9IHt9O1xuXG5cbi8qIFByaXZhdGUgbWV0aG9kcyAqL1xuXG5cbi8qXG4gKiBDcmVhdGUgYSBmdW5jdGlvbiBmcm9tIGEgc3RyaW5nLlxuICogVGhlIGNyZWF0ZWQgZnVuY3Rpb246XG4gKiAtIHdpbGwgYmUgYSBuYW1lZCBmdW5jdGlvbixcbiAqIC0gaGFzIHRoZSBjb250ZXh0IG9mIHRoZSBjb21wb25lbnQgYW5kXG4gKiAtIGNhbiBoYXZlIHNvbWUgY29yZSBtb2R1bGVzIGluamVjdGVkIGFzIHBhcmFtZXRlcnMuXG4gKiBAbWV0aG9kIGNyZWF0ZUZ1bmN0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBkZWZhdWx0IG5hbWUgb2YgdGhlIGZ1bmN0aW9uIFxuICogQHBhcmFtIHtTdHJpbmd9IGZ1bmMgYSBzdHJpbmdpZmllZCBmdW5jdGlvblxuICogQHBhcmFtIHtCb29sZWFufSBjb3JlIGlmIHRydWUsIHRoZSBiZWhhdmlvciB3aWxsIGJlIHRyZWF0ZWQgYXMgYSBSdW50aW1lIGNvcmUgYmVoYXZpb3IuXG4gKiBJbiB0aGF0IGNhc2UsIHRoZSBiZWhhdmlvciBjYW4gbm90IGJlIGV4cG9ydGVkIGluIGEgc3lzdGVtIChkZWZhdWx0IGZhbHNlKVxuICogQHBhcmFtIHtCb29sZWFufSB1c2VDb3JlQVBJIGlmIHRydWUsIFJ1bnRpbWUgY29yZSBtb2R1bGVzIHdpbGwgYmUgaW5qZWN0ZWQgYXMgcGFyYW1ldGVycyBvZiB0aGUgZnVuY3Rpb24gKGRlZmF1bHQgZmFsc2UpXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGNyZWF0ZWQgZnVuY3Rpb25cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUZ1bmN0aW9uKG5hbWUsIGZ1bmMsIGNvcmUsIHVzZUNvcmVBUEkpIHtcbiAgICB2YXIgZnVuY05hbWUgPSAnJyxcbiAgICAgICAgYmVnaW5Cb2R5ID0gLTEsXG4gICAgICAgIGZ1bmNQYXJhbXMgPSAnJyxcbiAgICAgICAgcGFyYW1zID0gW10sXG4gICAgICAgIHBhcmFtc0NsZWFuID0gW10sXG4gICAgICAgIGZ1bmNCb2R5ID0gJycsXG4gICAgICAgIGhlYWRlciA9ICcnLFxuICAgICAgICBhY3Rpb24gPSBudWxsO1xuXG4gICAgYmVnaW5Cb2R5ID0gZnVuYy5pbmRleE9mKCd7Jyk7XG4gICAgaGVhZGVyID0gZnVuYy5zdWJzdHJpbmcoMCwgYmVnaW5Cb2R5KTtcblxuICAgIGZ1bmNOYW1lID0gaGVhZGVyLnNwbGl0KCcoJylbMF0ucmVwbGFjZSgnZnVuY3Rpb24nLCAnJykudHJpbSgpO1xuICAgIGZ1bmNQYXJhbXMgPSBoZWFkZXIuc3BsaXQoJygnKVsxXS5yZXBsYWNlKCcpJywgJycpLnRyaW0oKTtcblxuICAgIHBhcmFtcyA9IGZ1bmNQYXJhbXMuc3BsaXQoJywnKTtcbiAgICBwYXJhbXMuZm9yRWFjaChmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgICAgcGFyYW1zQ2xlYW4ucHVzaChwYXJhbS50cmltKCkpO1xuICAgIH0pO1xuXG4gICAgZnVuY0JvZHkgPSBmdW5jLnN1YnN0cmluZyhiZWdpbkJvZHkgKyAxKTtcbiAgICBmdW5jQm9keSA9IGZ1bmNCb2R5LnN1YnN0cmluZygwLCBmdW5jQm9keS5sYXN0SW5kZXhPZignfScpKS50cmltKCk7XG5cbiAgICBmdW5jTmFtZSA9IGZ1bmNOYW1lIHx8IG5hbWU7XG5cbiAgICBpZiAocGFyYW1zWzBdID09PSAnJykge1xuICAgICAgICBwYXJhbXMgPSBbXTtcbiAgICB9XG4gICAgaWYgKHVzZUNvcmVBUEkpIHtcbiAgICAgICAgcGFyYW1zLnB1c2goJyRjb21wb25lbnQnKTtcbiAgICAgICAgcGFyYW1zLnB1c2goJyRkYicpO1xuICAgICAgICBwYXJhbXMucHVzaCgnJG1ldGFtb2RlbCcpO1xuICAgICAgICBwYXJhbXMucHVzaCgnJHdvcmtmbG93Jyk7XG4gICAgICAgIHBhcmFtcy5wdXNoKCckYmVoYXZpb3InKTtcbiAgICAgICAgcGFyYW1zLnB1c2goJyRzdGF0ZScpO1xuICAgICAgICBwYXJhbXMucHVzaCgnJGxvZycpO1xuICAgIH1cblxuICAgIGlmIChwYXJhbXNbMF0gIT09ICcnKSB7XG4gICAgICAgIC8qIGpzaGludCAtVzA1NCAqL1xuICAgICAgICBhY3Rpb24gPSBuZXcgRnVuY3Rpb24oXCJib2R5XCIsIFwicmV0dXJuIGZ1bmN0aW9uIFwiICsgZnVuY05hbWUgKyBcIiAoXCIgKyBwYXJhbXMuam9pbignLCcpICsgXCIpIHsgcmV0dXJuIG5ldyBGdW5jdGlvbignXCIgKyBwYXJhbXMuam9pbihcIicsJ1wiKSArIFwiJywgYm9keSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSB9O1wiKShmdW5jQm9keSk7XG4gICAgICAgIC8qIGpzaGludCArVzA1NCAqL1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8qIGpzaGludCAtVzA1NCAqL1xuICAgICAgICBhY3Rpb24gPSBuZXcgRnVuY3Rpb24oXCJib2R5XCIsIFwicmV0dXJuIGZ1bmN0aW9uIFwiICsgZnVuY05hbWUgKyBcIiAoKSB7IHJldHVybiBuZXcgRnVuY3Rpb24oYm9keSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSB9O1wiKShmdW5jQm9keSk7XG4gICAgICAgIC8qIGpzaGludCArVzA1NCAqL1xuICAgIH1cblxuICAgIHJldHVybiBhY3Rpb247XG59XG5cblxuLyogUHVibGljIG1ldGhvZHMgKi9cblxuXG4vKlxuICogQWRkIGEgYmVoYXZpb3IgdGhhdCB3aWxsIGJlIHN0b3JlZCBpbiBSdW50aW1lIGRhdGFiYXNlLlxuICogQG1ldGhvZCBhZGRcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge09iamVjdH0gc3RhdGUgdGhlIHN0YXRlIG9uIHdoaWNoIHRoZSBhY3Rpb24gd2lsbCBiZSBleGVjdXRlZCBcbiAqIEBwYXJhbSB7T2JqZWN0fSBhY3Rpb24gdGhlIGFjdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGNvbXBvbmVudCB3aWxsIGhhdmUgYSBzcGVjaWZpYyBzdGF0ZSBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdXNlQ29yZUFQSSBpZiB0cnVlLCBSdW50aW1lIGNvcmUgbW9kdWxlcyB3aWxsIGJlIGluamVjdGVkIGFzIHBhcmFtZXRlcnMgb2YgdGhlIGFjdGlvbiAoZGVmYXVsdCBmYWxzZSlcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY29yZSBpZiB0cnVlLCBiZWhhdmlvciBjYW4gbm90IGJlIGV4cG9ydGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9IGlkIG9mIHRoZSBiZWhhdmlvciBjcmVhdGVkIGluIFJ1bnRpbWUgZGF0YWJhc2VcbiAqL1xuZnVuY3Rpb24gYWRkKGlkLCBzdGF0ZSwgYWN0aW9uLCB1c2VDb3JlQVBJLCBjb3JlKSB7XG4gICAgdmFyIGJlaGF2aW9ySWQgPSAkaGVscGVyLmdlbmVyYXRlSWQoKSxcbiAgICAgICAgc3RyQWN0aW9uID0gYWN0aW9uLnRvU3RyaW5nKCk7XG5cbiAgICBpZiAodHlwZW9mIGNvcmUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvcmUgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB1c2VDb3JlQVBJID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB1c2VDb3JlQVBJID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYWN0aW9uID0gY3JlYXRlRnVuY3Rpb24oc3RhdGUsIHN0ckFjdGlvbiwgY29yZSwgdXNlQ29yZUFQSSk7XG5cbiAgICBzdG9yZVtiZWhhdmlvcklkXSA9IGFjdGlvbjtcblxuICAgICRkYi5SdW50aW1lQmVoYXZpb3IuaW5zZXJ0KHtcbiAgICAgICAgXCJfaWRcIjogYmVoYXZpb3JJZCxcbiAgICAgICAgXCJjb21wb25lbnRcIjogaWQsXG4gICAgICAgIFwic3RhdGVcIjogc3RhdGUsXG4gICAgICAgIFwiYWN0aW9uXCI6IHN0ckFjdGlvbixcbiAgICAgICAgXCJ1c2VDb3JlQVBJXCI6IHVzZUNvcmVBUEksXG4gICAgICAgIFwiY29yZVwiOiBjb3JlXG4gICAgfSk7XG5cbiAgICByZXR1cm4gYmVoYXZpb3JJZDtcbn1cblxuXG4vKlxuICogUmVtb3ZlIGEgYmVoYXZpb3Igd2l0aCBpdHMgaWQgb3IgcmVtb3ZlIGFsbCB0aGUgYmVoYXZpb3JzIGZvciBhIHNwZWNpZmljIHN0YXRlXG4gKiBvZiB0aGUgY29tcG9uZW50LlxuICogQG1ldGhvZCByZW1vdmVcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgPGJyPlxuICoge1N0cmluZ30gY29tcG9uZW50SWQgaWQgb2YgdGhlIGNvbXBvbmVudCA8YnI+XG4gKiB7U3RyaW5nfSBzdGF0ZSBzdGF0ZSBvZiB0aGUgY29tcG9uZW50IDxicj5cbiAqIHtTdHJpbmd9IGJlaGF2aW9ySWQgaWQgb2YgdGhlIGJlaGF2aW9yIChvcHRpb25hbCkpIDxicj5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlKHBhcmFtcykge1xuICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICBwYXJhbXMuYmVoYXZpb3JJZCA9IHBhcmFtcy5iZWhhdmlvcklkIHx8ICcnO1xuICAgIHBhcmFtcy5jb21wb25lbnRJZCA9IHBhcmFtcy5jb21wb25lbnRJZCB8fCAnJztcbiAgICBwYXJhbXMuc3RhdGUgPSBwYXJhbXMuc3RhdGUgfHwgJyc7XG5cbiAgICBpZiAocGFyYW1zLmNvbXBvbmVudElkKSB7XG4gICAgICAgIGlmIChwYXJhbXMuYmVoYXZpb3JJZCkge1xuICAgICAgICAgICAgJGRiLlJ1bnRpbWVCZWhhdmlvci5yZW1vdmUoe1xuICAgICAgICAgICAgICAgIFwiX2lkXCI6IHBhcmFtcy5iZWhhdmlvcklkLFxuICAgICAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IHBhcmFtcy5jb21wb25lbnRJZCxcbiAgICAgICAgICAgICAgICBcInN0YXRlXCI6IHBhcmFtcy5zdGF0ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkZWxldGUgc3RvcmVbcGFyYW1zLmJlaGF2aW9ySWRdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5zdGF0ZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9ICRkYi5SdW50aW1lQmVoYXZpb3IucmVtb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb21wb25lbnRcIjogcGFyYW1zLmNvbXBvbmVudElkLFxuICAgICAgICAgICAgICAgICAgICBcInN0YXRlXCI6IHBhcmFtcy5zdGF0ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAkZGIuUnVudGltZUJlaGF2aW9yLnJlbW92ZSh7XG4gICAgICAgICAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IHBhcmFtcy5jb21wb25lbnRJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0LmZvckVhY2goZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0b3JlW2lkXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8qXG4gKiBSZW1vdmUgYSBiZWhhdmlvciB3aXRoIGl0cyBpZCBmcm9tIHRoZSBtZW1vcnkuXG4gKiBAbWV0aG9kIHJlbW92ZUZyb21NZW1vcnlcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgY29tcG9uZW50XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZyb21NZW1vcnkoaWQpIHtcbiAgICBkZWxldGUgc3RvcmVbaWRdO1xufVxuXG5cbi8qXG4gKiBHZXQgYWxsIHRoZSBhY3Rpb25zIG9mIGEgYmVoYXZpb3IgZm9yIGEgY29tcG9uZW50LlxuICogQG1ldGhvZCBnZXRBY3Rpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIGNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IHN0YXRlIG5hbWUgb2YgdGhlIHN0YXRlXG4gKiBAcmV0dXJuIHtBcnJheX0gYWxsIHRoZSBhY3Rpb25zIHRoYXQgaGF2ZSB0byBiZSBleGVjdXRlZCBmb3IgYSBzcGVjaWZpYyBjb21wb25lbnQgYW5kIHN0YXRlXG4gKi9cbmZ1bmN0aW9uIGdldEFjdGlvbnMoaWQsIHN0YXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdLFxuICAgICAgICBkYlJlc3VsdCA9IFtdLFxuICAgICAgICBhY3Rpb24gPSBudWxsO1xuXG4gICAgZGJSZXN1bHQgPSAkZGIuUnVudGltZUJlaGF2aW9yLmZpbmQoe1xuICAgICAgICBcImNvbXBvbmVudFwiOiBpZCxcbiAgICAgICAgXCJzdGF0ZVwiOiBzdGF0ZVxuICAgIH0pO1xuXG4gICAgZGJSZXN1bHQuZm9yRWFjaChmdW5jdGlvbiAoYmVoYXZpb3IpIHtcbiAgICAgICAgYWN0aW9uID0gc3RvcmVbYmVoYXZpb3IuX2lkXTtcbiAgICAgICAgaWYgKHR5cGVvZiBhY3Rpb24gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBhY3Rpb24gPSBjcmVhdGVGdW5jdGlvbihiZWhhdmlvci5zdGF0ZSwgYmVoYXZpb3IuYWN0aW9uLCBiZWhhdmlvci5jb3JlLCBiZWhhdmlvci51c2VDb3JlQVBJKTtcbiAgICAgICAgICAgIHN0b3JlW2JlaGF2aW9yLl9pZF0gPSBhY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgXCJ1c2VDb3JlQVBJXCI6IGJlaGF2aW9yLnVzZUNvcmVBUEksXG4gICAgICAgICAgICBcImFjdGlvblwiOiBhY3Rpb25cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qXG4gKiBSZW1vdmUgYWxsIHRoZSBiZWhhdmlvcnMgc3RvcmVkIGluIG1lbW9yeS5cbiAqIEBtZXRob2QgY2xlYXJcbiAqL1xuZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgc3RvcmUgPSB7fTtcbn1cblxuXG4vKlxuICogR2V0IGEgYmVoYXZpb3IgYnkgaXRzIGlkLlxuICogQG1ldGhvZCBnZXRcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgYmVoYXZpb3JcbiAqIEByZXR1cm4ge0JlaGF2aW9yfSB0aGUgYmVoYXZpb3JcbiAqL1xuZnVuY3Rpb24gZ2V0KGlkKSB7XG4gICAgcmV0dXJuIHN0b3JlW2lkXTtcbn1cblxuXG4vKiBleHBvcnRzICovXG5cblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBtYW5hZ2VzIHRoZSBiZWhhdmlvcnMgb2YgYWxsIGNvbXBvbmVudHMuIEEgYmVoYXZpb3IgaXMgYSBtZWNhbmlzbSB0aGF0IGFsbG93IHVzZXJzIHRvIGFkZCBhY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIFxuICogd2hlbiBhIHNwZWNpZmljIHN0YXRlIG9mIGEgY29tcG9uZW50IHdpbGwgY2hhbmdlLlxuICogXG4gKiBAbW9kdWxlIHJ1bnRpbWVcbiAqIEBzdWJtb2R1bGUgcnVudGltZS1iZWhhdmlvclxuICogQHJlcXVpcmVzIHJ1bnRpbWUtZGJcbiAqIEByZXF1aXJlcyBydW50aW1lLWhlbHBlclxuICogQHJlcXVpcmVzIHJ1bnRpbWUtY2hhbm5lbFxuICogQGNsYXNzIHJ1bnRpbWUtYmVoYXZpb3JcbiAqIEBzdGF0aWNcbiAqL1xuXG5cbi8qKlxuICogQWRkIGEgYmVoYXZpb3IgdGhhdCB3aWxsIGJlIHN0b3JlZCBpbiBSdW50aW1lIGRhdGFiYXNlLlxuICogQG1ldGhvZCBhZGRcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge09iamVjdH0gc3RhdGUgdGhlIHN0YXRlIG9uIHdoaWNoIHRoZSBhY3Rpb24gd2lsbCBiZSBleGVjdXRlZCBcbiAqIEBwYXJhbSB7T2JqZWN0fSBhY3Rpb24gdGhlIGFjdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGNvbXBvbmVudCB3aWxsIGhhdmUgYSBzcGVjaWZpYyBzdGF0ZSBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdXNlQ29yZUFQSSBpZiB0cnVlLCBSdW50aW1lIGNvcmUgbW9kdWxlcyB3aWxsIGJlIGluamVjdGVkIGFzIHBhcmFtZXRlcnMgb2YgdGhlIGFjdGlvbiAoZGVmYXVsdCBmYWxzZSlcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY29yZSBpZiB0cnVlLCBiZWhhdmlvciBjYW4gbm90IGJlIGV4cG9ydGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9IGlkIG9mIHRoZSBiZWhhdmlvciBjcmVhdGVkIGluIFJ1bnRpbWUgZGF0YWJhc2VcbiAqL1xuZXhwb3J0cy5hZGQgPSBhZGQ7XG5cblxuLyoqXG4gKiBHZXQgYSBiZWhhdmlvciBieSBpdHMgaWQuXG4gKiBAbWV0aG9kIGdldFxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBiZWhhdmlvclxuICogQHJldHVybiB7QmVoYXZpb3J9IHRoZSBiZWhhdmlvclxuICovXG5leHBvcnRzLmdldCA9IGdldDtcblxuXG4vKipcbiAqIFJlbW92ZSBhIGJlaGF2aW9yIHdpdGggaXRzIGlkIG9yIHJlbW92ZSBhbGwgdGhlIGJlaGF2aW9ycyBmb3IgYSBzcGVjaWZpYyBzdGF0ZVxuICogb2YgdGhlIGNvbXBvbmVudC5cbiAqIEBtZXRob2QgcmVtb3ZlXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIDxicj5cbiAqIHtTdHJpbmd9IGNvbXBvbmVudElkIGlkIG9mIHRoZSBjb21wb25lbnQgPGJyPlxuICoge1N0cmluZ30gc3RhdGUgc3RhdGUgb2YgdGhlIGNvbXBvbmVudCA8YnI+XG4gKiB7U3RyaW5nfSBiZWhhdmlvcklkIGlkIG9mIHRoZSBiZWhhdmlvciAob3B0aW9uYWwpKSA8YnI+XG4gKi9cbmV4cG9ydHMucmVtb3ZlID0gcmVtb3ZlO1xuXG5cbi8qKlxuICogR2V0IGFsbCB0aGUgYWN0aW9ucyBvZiBhIGJlaGF2aW9yIGZvciBhIGNvbXBvbmVudC5cbiAqIEBtZXRob2QgZ2V0QWN0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjb21wb25lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdGF0ZSBuYW1lIG9mIHRoZSBzdGF0ZVxuICogQHJldHVybiB7QXJyYXl9IGFsbCB0aGUgYWN0aW9ucyB0aGF0IGhhdmUgdG8gYmUgZXhlY3V0ZWQgZm9yIGEgc3BlY2lmaWMgY29tcG9uZW50IGFuZCBzdGF0ZVxuICovXG5leHBvcnRzLmdldEFjdGlvbnMgPSBnZXRBY3Rpb25zO1xuXG5cbi8qKlxuICogUmVtb3ZlIGFsbCB0aGUgYmVoYXZpb3JzIHN0b3JlZCBpbiBtZW1vcnkuXG4gKiBAbWV0aG9kIGNsZWFyXG4gKi9cbmV4cG9ydHMuY2xlYXIgPSBjbGVhcjtcblxuXG4vKipcbiAqIFJlbW92ZSBhIGJlaGF2aW9yIHdpdGggaXRzIGlkIGZyb20gdGhlIG1lbW9yeS5cbiAqIEBtZXRob2QgcmVtb3ZlRnJvbU1lbW9yeVxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjb21wb25lbnRcbiAqL1xuZXhwb3J0cy5yZW1vdmVGcm9tTWVtb3J5ID0gcmVtb3ZlRnJvbU1lbW9yeTsiLCIvKlxuICogU3lzdGVtIFJ1bnRpbWVcbiAqIFxuICogaHR0cHM6Ly9kZXNpZ25maXJzdC5pby9zeXN0ZW1ydW50aW1lL1xuICogXG4gKiBDb3B5cmlnaHQgMjAxNyBFcndhbiBDYXJyaW91XG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBtYW5hZ2VzIHRoZSBjb21wb25lbnRzLiBcbiAqIEl0IGlzIHRoZSBmYWN0b3J5IG9mIGFsbCB0aGUgY29tcG9uZW50cyB0aGF0IGFyZSBjcmVhdGVkIGJ5IFJ1bnRpbWUuXG4gKiBcbiAqIEBtb2R1bGUgcnVudGltZVxuICogQHN1Ym1vZHVsZSBydW50aW1lLWNvbXBvbmVudFxuICogQHJlcXVpcmVzIHJ1bnRpbWUtd29ya2Zsb3dcbiAqIEByZXF1aXJlcyBydW50aW1lLWRiXG4gKiBAcmVxdWlyZXMgcnVudGltZS1tZXRhbW9kZWxcbiAqIEByZXF1aXJlcyBydW50aW1lLWJlaGF2aW9yXG4gKiBAcmVxdWlyZXMgcnVudGltZS1oZWxwZXJcbiAqIEByZXF1aXJlcyBydW50aW1lLWxvZ1xuICogQGNsYXNzIHJ1bnRpbWUtY29tcG9uZW50XG4gKiBAc3RhdGljIFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyICR3b3JrZmxvdyA9IHJlcXVpcmUoJy4vd29ya2Zsb3cuanMnKTtcbnZhciAkZGIgPSByZXF1aXJlKCcuL2RiLmpzJyk7XG52YXIgJG1ldGFtb2RlbCA9IHJlcXVpcmUoJy4vbWV0YW1vZGVsLmpzJyk7XG52YXIgJGJlaGF2aW9yID0gcmVxdWlyZSgnLi9iZWhhdmlvci5qcycpO1xudmFyICRoZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlci5qcycpO1xudmFyICRsb2cgPSByZXF1aXJlKCcuL2xvZy5qcycpO1xudmFyICR3b3JrbG93ID0gcmVxdWlyZSgnLi93b3JrZmxvdy5qcycpO1xudmFyICRzdGF0ZSA9IHJlcXVpcmUoJy4vc3RhdGUuanMnKTtcblxuXG4vKiBQcml2YXRlIHByb3BlcnRpZXMgKi9cblxuXG52YXIgUFJPUEVSVFlfVFlQRSA9ICdwcm9wZXJ0eScsXG4gICAgTElOS19UWVBFID0gJ2xpbmsnLFxuICAgIENPTExFQ1RJT05fVFlQRSA9ICdjb2xsZWN0aW9uJyxcbiAgICBNRVRIT0RfVFlQRSA9ICdtZXRob2QnLFxuICAgIEVWRU5UX1RZUEUgPSAnZXZlbnQnLFxuICAgIE5BTUUgPSAnX25hbWUnLFxuICAgIHN0b3JlID0ge307XG5cblxuLyogUHJpdmF0ZSBtZXRob2RzICovXG5cblxuLypcbiAqIFN1YiBjbGFzcyB0byBvdmVycmlkZSBwdXNoIGFuZCBwb3AgbWV0aG9kIG9mIEFycmF5IENsYXNzLlxuICogQGNsYXNzIFJ1bnRpbWVBcnJheVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZcbiAqIHtTdHJpbmd9IGNsYXNzSWQgbmFtZSBvZiB0aGUgY2xhc3NcbiAqIHtTdHJpbmd9IHR5cGUgdHlwZSBvZiB0aGUgYXJyYXlcbiAqIHtBcnJheX0gYXJyIGFycmF5XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBSdW50aW1lQXJyYXkoY29uZikge1xuICAgIHZhciBhcnIgPSBbXSxcbiAgICAgICAgYXJyRGIgPSBbXSxcbiAgICAgICAgdHlwZSA9ICcnLFxuICAgICAgICBpZCA9ICcnLFxuICAgICAgICBjbGFzc0lkID0gJycsXG4gICAgICAgIHByb3BlcnR5TmFtZSA9ICcnLFxuICAgICAgICBpc1JlYWRPbmx5ID0gZmFsc2U7XG5cbiAgICBjb25mID0gY29uZiB8fCB7fTtcbiAgICB0eXBlID0gY29uZi50eXBlIHx8ICcnO1xuICAgIGlkID0gY29uZi5pZCB8fCAnJztcbiAgICBwcm9wZXJ0eU5hbWUgPSBjb25mLnByb3BlcnR5TmFtZSB8fCAnJztcbiAgICBhcnJEYiA9IGNvbmYuYXJyIHx8IFtdO1xuICAgIGNsYXNzSWQgPSBjb25mLmNsYXNzSWQgfHwgJyc7XG5cbiAgICBpZiAodHlwZW9mIGNvbmYucmVhZE9ubHkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlzUmVhZE9ubHkgPSBjb25mLnJlYWRPbmx5O1xuICAgIH1cblxuICAgIC8vIGluaXRcbiAgICBhcnJEYi5mb3JFYWNoKGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgaWYgKHR5cGUuaW5kZXhPZignQCcpICE9PSAtMSkge1xuICAgICAgICAgICAgYXJyLnB1c2goJGhlbHBlci5nZXRSdW50aW1lKCkucmVxdWlyZSh2YWwpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyci5wdXNoKHZhbCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIF9hZGQodmFsLCBhY3Rpb24sIHN0YXJ0LCBkZWxldGVDb3VudCkge1xuICAgICAgICB2YXIgaXNDbGFzcyA9IGZhbHNlLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBsZW5ndGggPSAwLFxuICAgICAgICAgICAgZGVsID0gW107XG5cbiAgICAgICAgaWYgKCFpc1JlYWRPbmx5KSB7XG5cbiAgICAgICAgICAgIGlzQ2xhc3MgPSB0eXBlLmluZGV4T2YoJ0AnKSAhPT0gLTE7XG5cbiAgICAgICAgICAgIGlmIChpc0NsYXNzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCAmJiAkbWV0YW1vZGVsLmluaGVyaXRGcm9tKHZhbC5jb25zdHJ1Y3Rvci5uYW1lLCB0eXBlLnJlcGxhY2UoJ0AnLCAnJykpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBhY3Rpb24gPT09ICdwdXNoJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJEYi5wdXNoKHZhbC5pZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgYWN0aW9uID09PSAndW5zaGlmdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyRGIudW5zaGlmdCh2YWwuaWQoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGFjdGlvbiA9PT0gJ3NwbGljZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsID0gYXJyRGIuc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCwgdmFsKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9IGRlbC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR3b3JrZmxvdy5zdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBvbmVudFwiOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RhdGVcIjogcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhXCI6IFtkZWxbaV0sICdyZW1vdmUnXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCRoZWxwZXIuaXNSdW50aW1lKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRoZWxwZXIuZ2V0UnVudGltZSgpLnJlcXVpcmUoJ2RiJykudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29sbGVjdGlvbic6IGNsYXNzSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lkJzogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2ZpZWxkJzogcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IGFyckRiXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICR3b3JrZmxvdy5zdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBvbmVudFwiOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RhdGVcIjogcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhXCI6IFt2YWwuaWQoKSwgJ2FkZCddXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsLmlkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5pbnZhbGlkUHJvcGVydHlOYW1lKGlkLCBjbGFzc0lkLCBwcm9wZXJ0eU5hbWUsIHZhbC5pZCgpLCB0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuaW52YWxpZFByb3BlcnR5TmFtZShpZCwgY2xhc3NJZCwgcHJvcGVydHlOYW1lLCB2YWwsIHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsICYmICRtZXRhbW9kZWwuaXNWYWxpZFR5cGUodmFsLCB0eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgYWN0aW9uID09PSAncHVzaCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyRGIucHVzaCh2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBhY3Rpb24gPT09ICd1bnNoaWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJEYi51bnNoaWZ0KHZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGFjdGlvbiA9PT0gJ3NwbGljZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyRGIuc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCwgdmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoJGhlbHBlci5pc1J1bnRpbWUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGhlbHBlci5nZXRSdW50aW1lKCkucmVxdWlyZSgnZGInKS51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb2xsZWN0aW9uJzogY2xhc3NJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaWQnOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZmllbGQnOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogYXJyRGJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJHdvcmtmbG93LnN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdGF0ZVwiOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRhdGFcIjogW3ZhbCwgJ2FkZCddXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRsb2cuaW52YWxpZFByb3BlcnR5TmFtZShpZCwgY2xhc3NJZCwgcHJvcGVydHlOYW1lLCB2YWwsIHR5cGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRsb2cucmVhZE9ubHlQcm9wZXJ0eShpZCwgY2xhc3NJZCwgcHJvcGVydHlOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyRGIubGVuZ3RoO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZW1vdmUoYWN0aW9uKSB7XG4gICAgICAgIHZhciByZXN1bHQsXG4gICAgICAgICAgICB2YWwgPSBudWxsLFxuICAgICAgICAgICAgaXNDbGFzcyA9IGZhbHNlO1xuXG4gICAgICAgIGlmICghaXNSZWFkT25seSkge1xuICAgICAgICAgICAgaWYgKGFyckRiLmxlbmd0aCAhPT0gMCkge1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgYWN0aW9uID09PSAncG9wJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IGFyckRiLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgYWN0aW9uID09PSAnc2hpZnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gYXJyRGIuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCRoZWxwZXIuaXNSdW50aW1lKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgJGhlbHBlci5nZXRSdW50aW1lKCkucmVxdWlyZSgnZGInKS51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbGxlY3Rpb24nOiBjbGFzc0lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2lkJzogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZmllbGQnOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiBhcnJEYlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkd29ya2Zsb3cuc3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICBcImNvbXBvbmVudFwiOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgXCJzdGF0ZVwiOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiBbdmFsLCAncmVtb3ZlJ11cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlzQ2xhc3MgPSB0eXBlLmluZGV4T2YoJ0AnKSAhPT0gLTE7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNDbGFzcykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBzdG9yZVt2YWxdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkbG9nLnJlYWRPbmx5UHJvcGVydHkoaWQsIGNsYXNzSWQsIHByb3BlcnR5TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKiBPdmVycmlkZSBwdXNoIG1ldGhvZC5cbiAgICAgKiBAcHVzaFxuICAgICAqIEBwYXJhbSB7UnVudGltZUNvbXBvbmVudHxPYmplY3R9IHZhbFxuICAgICAqL1xuICAgIGFyci5wdXNoID0gZnVuY3Rpb24gcHVzaCh2YWwpIHtcbiAgICAgICAgcmV0dXJuIF9hZGQodmFsLCAncHVzaCcpO1xuICAgIH07XG5cbiAgICAvKiBPdmVycmlkZSB1bnNoaWZ0IG1ldGhvZC5cbiAgICAgKiBAdW5zaGlmdFxuICAgICAqIEBwYXJhbSB7UnVudGltZUNvbXBvbmVudHxPYmplY3R9IHZhbFxuICAgICAqL1xuICAgIGFyci51bnNoaWZ0ID0gZnVuY3Rpb24gdW5zaGlmdCh2YWwpIHtcbiAgICAgICAgcmV0dXJuIF9hZGQodmFsLCAndW5zaGlmdCcpO1xuICAgIH07XG5cbiAgICAvKiBPdmVycmlkZSBjb25jYXQgbWV0aG9kLlxuICAgICAqIEBwdXNoXG4gICAgICogQHBhcmFtIHtSdW50aW1lQ29tcG9uZW50fE9iamVjdH0gYXJyXG4gICAgICovXG4gICAgYXJyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdChhcnIpIHtcbiAgICAgICAgdmFyIGkgPSAwLFxuICAgICAgICAgICAgbGVuZ3RoID0gMDtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICAgICAgICBsZW5ndGggPSBhcnIubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgX2FkZChhcnJbaV0sICdwdXNoJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25mLmFyciA9IGFyckRiO1xuICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVBcnJheShjb25mKTtcbiAgICB9O1xuXG4gICAgLyogT3ZlcnJpZGUgcG9wIG1ldGhvZC5cbiAgICAgKiBAcG9wXG4gICAgICogQHJldHVybiB7UnVudGltZUNvbXBvbmVudHxPYmplY3R9IHZhbHVlXG4gICAgICovXG4gICAgYXJyLnBvcCA9IGZ1bmN0aW9uIHBvcCgpIHtcbiAgICAgICAgcmV0dXJuIF9yZW1vdmUoJ3BvcCcpO1xuICAgIH07XG5cbiAgICAvKiBPdmVycmlkZSBzaGlmdCBtZXRob2QuXG4gICAgICogQHNoaWZ0XG4gICAgICogQHJldHVybiB7UnVudGltZUNvbXBvbmVudHxPYmplY3R9IHZhbHVlXG4gICAgICovXG4gICAgYXJyLnNoaWZ0ID0gZnVuY3Rpb24gc2hpZnQoKSB7XG4gICAgICAgIHJldHVybiBfcmVtb3ZlKCdzaGlmdCcpO1xuICAgIH07XG5cbiAgICAvKiBPdmVycmlkZSBzb3J0IG1ldGhvZC5cbiAgICAgKiBAc29ydFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmN0IHRoZSBzb3J0IGZ1bmN0aW9uXG4gICAgICogQHJldHVybiB7UnVudGltZUFycmF5fSB0aGUgY3VycmVudCBSdW50aW1lQXJyYXlcbiAgICAgKi9cbiAgICBhcnIuc29ydCA9IGZ1bmN0aW9uIHNvcnQoZnVuY3QpIHtcbiAgICAgICAgYXJyRGIuc29ydChmdW5jdCk7XG5cbiAgICAgICAgaWYgKCRoZWxwZXIuaXNSdW50aW1lKCkpIHtcbiAgICAgICAgICAgICRoZWxwZXIuZ2V0UnVudGltZSgpLnJlcXVpcmUoJ2RiJykudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAnY29sbGVjdGlvbic6IGNsYXNzSWQsXG4gICAgICAgICAgICAgICAgJ2lkJzogaWQsXG4gICAgICAgICAgICAgICAgJ2ZpZWxkJzogcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICAgICd2YWx1ZSc6IGFyckRiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgfTtcblxuICAgIC8qIE92ZXJyaWRlIHJldmVyc2UgbWV0aG9kLlxuICAgICAqIEByZXZlcnNlXG4gICAgICogQHJldHVybiB7UnVudGltZUFycmF5fSB0aGUgcmV2ZXJzZWQgUnVudGltZUFycmF5XG4gICAgICovXG4gICAgYXJyLnJldmVyc2UgPSBmdW5jdGlvbiByZXZlcnNlKCkge1xuICAgICAgICBhcnJEYi5yZXZlcnNlKCk7XG5cbiAgICAgICAgaWYgKCRoZWxwZXIuaXNSdW50aW1lKCkpIHtcbiAgICAgICAgICAgICRoZWxwZXIuZ2V0UnVudGltZSgpLnJlcXVpcmUoJ2RiJykudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAnY29sbGVjdGlvbic6IGNsYXNzSWQsXG4gICAgICAgICAgICAgICAgJ2lkJzogaWQsXG4gICAgICAgICAgICAgICAgJ2ZpZWxkJzogcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICAgICd2YWx1ZSc6IGFyckRiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyO1xuICAgIH07XG5cbiAgICAvKiBPdmVycmlkZSBzcGxpY2UgbWV0aG9kLlxuICAgICAqIEBzcGxpY2VcbiAgICAgKiBAcmV0dXJuIHtSdW50aW1lQXJyYXl9IHRoZSBzcGxpY2VkIFJ1bnRpbWVBcnJheVxuICAgICAqL1xuICAgIGFyci5zcGxpY2UgPSBmdW5jdGlvbiBzcGxpY2Uoc3RhcnQsIGRlbGV0ZUNvdW50LCB2YWwpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBsZW5ndGggPSAwO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgX2FkZCh2YWwsICdzcGxpY2UnLCBzdGFydCwgZGVsZXRlQ291bnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXJyRGIuc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCk7XG5cbiAgICAgICAgICAgIGlmICgkaGVscGVyLmlzUnVudGltZSgpKSB7XG4gICAgICAgICAgICAgICAgJGhlbHBlci5nZXRSdW50aW1lKCkucmVxdWlyZSgnZGInKS51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAnY29sbGVjdGlvbic6IGNsYXNzSWQsXG4gICAgICAgICAgICAgICAgICAgICdpZCc6IGlkLFxuICAgICAgICAgICAgICAgICAgICAnZmllbGQnOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IGFyckRiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAkd29ya2Zsb3cuc3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICBcImNvbXBvbmVudFwiOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgXCJzdGF0ZVwiOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiBbcmVzdWx0W2ldLCAncmVtb3ZlJ11cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvKiBPdmVycmlkZSBzbGljZSBtZXRob2QuXG4gICAgICogQHNsaWNlXG4gICAgICogQHJldHVybiB7UnVudGltZUFycmF5fSB0aGUgc2xpY2VkIFJ1bnRpbWVBcnJheVxuICAgICAqL1xuICAgIGFyci5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlKGJlZ2luLCBlbmQpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGFyckRiLnNsaWNlKGJlZ2luLCBlbmQpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICByZXR1cm4gYXJyO1xufVxuXG4vKiBqc2hpbnQgLVcwNTggKi9cblJ1bnRpbWVBcnJheS5wcm90b3R5cGUgPSBuZXcgQXJyYXk7XG4vKiBqc2hpbnQgK1cwNTggKi9cblxuXG4vKlxuICogR2V0IGFsbCB0aGUgbmFtZXMgb2YgbWV0aG9kIHBhcmFtZXRlcnMuXG4gKiBAbWV0aG9kIGdldFBhcmFtTmFtZXNcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgY2xhc3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2ROYW1lIG5hbWUgb2YgdGhlIG1ldGhvZFxuICogQHJldHVybiB7QXJyYXl9IGFsbCB0aGUgbmFtZXMgb2YgbWV0aG9kIHBhcmFtZXRlcnMgb2YgdGhlIGNsYXNzXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBnZXRQYXJhbU5hbWVzKGlkLCBtZXRob2ROYW1lKSB7XG4gICAgdmFyIHBhcmFtcyA9IFtdLFxuICAgICAgICByZXN1bHQgPSBbXSxcbiAgICAgICAgbGVuZ3RoID0gMCxcbiAgICAgICAgaSA9IDA7XG5cbiAgICBwYXJhbXMgPSAkbWV0YW1vZGVsLmdldE1vZGVsKGlkKVttZXRob2ROYW1lXS5wYXJhbXM7XG4gICAgaWYgKHBhcmFtcykge1xuICAgICAgICBsZW5ndGggPSBwYXJhbXMubGVuZ3RoO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHBhcmFtc1tpXS5uYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qXG4gKiBHZXQgYWxsIHRoZSBwcm9wZXJ0eSBvZiBhIGNsYXNzLlxuICogQG1ldGhvZCBnZXRQcm9wZXJ0aWVzXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIGNsYXNzXG4gKiBAcmV0dXJuIHtBcnJheX0gYWxsIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBjbGFzc1xuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZ2V0UHJvcGVydGllcyhpZCkge1xuICAgIHZhciBtb2RlbCA9IG51bGwsXG4gICAgICAgIHNjaGVtYSA9IG51bGwsXG4gICAgICAgIHByb3BOYW1lcyA9IFtdLFxuICAgICAgICBsZW5ndGggPSAwLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgcmVzdWx0ID0gW107XG5cbiAgICBtb2RlbCA9ICRtZXRhbW9kZWwuZ2V0TW9kZWwoaWQpO1xuICAgIHNjaGVtYSA9ICRtZXRhbW9kZWwuZ2V0U2NoZW1hKG1vZGVsW05BTUVdKTtcblxuICAgIHByb3BOYW1lcyA9IE9iamVjdC5rZXlzKHNjaGVtYSk7XG5cbiAgICBsZW5ndGggPSBwcm9wTmFtZXMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc2NoZW1hW3Byb3BOYW1lc1tpXV0gPT09IExJTktfVFlQRSB8fCBzY2hlbWFbcHJvcE5hbWVzW2ldXSA9PT0gUFJPUEVSVFlfVFlQRSB8fCBzY2hlbWFbcHJvcE5hbWVzW2ldXSA9PT0gQ09MTEVDVElPTl9UWVBFKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IHByb3BOYW1lc1tpXSxcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogbW9kZWxbcHJvcE5hbWVzW2ldXS50eXBlLFxuICAgICAgICAgICAgICAgIFwicmVhZE9ubHlcIjogbW9kZWxbcHJvcE5hbWVzW2ldXS5yZWFkT25seVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qXG4gKiBHZXQgYWxsIHRoZSBtZXRob2Qgb2YgYSBjbGFzcy5cbiAqIEBtZXRob2QgZ2V0TWV0aG9kc1xuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjbGFzc1xuICogQHJldHVybiB7QXJyYXl9IGFsbCB0aGUgbWV0aG9kcyBvZiB0aGUgY2xhc3NcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGdldE1ldGhvZHMoaWQpIHtcbiAgICB2YXIgbW9kZWwgPSBudWxsLFxuICAgICAgICBzY2hlbWEgPSBudWxsLFxuICAgICAgICBwcm9wTmFtZXMgPSBbXSxcbiAgICAgICAgbGVuZ3RoID0gMCxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgbW9kZWwgPSAkbWV0YW1vZGVsLmdldE1vZGVsKGlkKTtcbiAgICBzY2hlbWEgPSAkbWV0YW1vZGVsLmdldFNjaGVtYShtb2RlbFtOQU1FXSk7XG5cbiAgICBwcm9wTmFtZXMgPSBPYmplY3Qua2V5cyhzY2hlbWEpO1xuXG4gICAgbGVuZ3RoID0gcHJvcE5hbWVzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNjaGVtYVtwcm9wTmFtZXNbaV1dID09PSBNRVRIT0RfVFlQRSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gocHJvcE5hbWVzW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cblxuLypcbiAqIEdldCB0aGUgc2NoZW1hIG9mIGEgc3RydWN0dXJlLlxuICogQG1ldGhvZCBnZXRTdHJ1Y3R1cmVQcm9wZXJ0aWVzXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBvZiB0aGUgcHJvcGVydHlcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG9mIHRoZSBtb2RlbFxuICogQHJldHVybiB7QXJyYXl9IGxpc3Qgb2YgcHJvcGVydHkgc2NoZW1hIG9mIHRoZSBzdHJ1Y3R1cmUgdHlwZVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZ2V0U3RydWN0dXJlUHJvcGVydGllcyhwcm9wZXJ0eU5hbWUsIG1vZGVsKSB7XG4gICAgdmFyIG1vZGVsRGVmID0gbnVsbCxcbiAgICAgICAgdHlwZSA9IG51bGwsXG4gICAgICAgIHN0cnVjdHVyZSA9IG51bGwsXG4gICAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgICBwcm9wTmFtZXMgPSBbXTtcblxuICAgIG1vZGVsRGVmID0gJG1ldGFtb2RlbC5nZXRNb2RlbChtb2RlbCk7XG4gICAgdHlwZSA9IG1vZGVsRGVmW3Byb3BlcnR5TmFtZV0udHlwZTtcbiAgICBzdHJ1Y3R1cmUgPSAkbWV0YW1vZGVsLmdldFR5cGUodHlwZSk7XG5cbiAgICBpZiAoc3RydWN0dXJlLnNjaGVtYSkge1xuICAgICAgICBwcm9wTmFtZXMgPSBPYmplY3Qua2V5cyhzdHJ1Y3R1cmUuc2NoZW1hKTtcbiAgICAgICAgcHJvcE5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHN0cnVjdHVyZS5zY2hlbWFbbmFtZV0ubmFtZSA9IG5hbWU7XG4gICAgICAgICAgICByZXN1bHQucHVzaChzdHJ1Y3R1cmUuc2NoZW1hW25hbWVdKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKlxuICogR2V0IGFsbCB0aGUgZXZlbnQgb2YgYSBjbGFzcy5cbiAqIEBtZXRob2QgZ2V0RXZlbnRzXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIGNsYXNzXG4gKiBAcmV0dXJuIHtBcnJheX0gYWxsIHRoZSBldmVudHMgb2YgdGhlIGNsYXNzXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBnZXRFdmVudHMoaWQpIHtcbiAgICB2YXIgbW9kZWwgPSBudWxsLFxuICAgICAgICBzY2hlbWEgPSBudWxsLFxuICAgICAgICBwcm9wTmFtZXMgPSBbXSxcbiAgICAgICAgbGVuZ3RoID0gMCxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgbW9kZWwgPSAkbWV0YW1vZGVsLmdldE1vZGVsKGlkKTtcbiAgICBzY2hlbWEgPSAkbWV0YW1vZGVsLmdldFNjaGVtYShtb2RlbFtOQU1FXSk7XG5cbiAgICBwcm9wTmFtZXMgPSBPYmplY3Qua2V5cyhzY2hlbWEpO1xuXG4gICAgbGVuZ3RoID0gcHJvcE5hbWVzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNjaGVtYVtwcm9wTmFtZXNbaV1dID09PSBFVkVOVF9UWVBFKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChwcm9wTmFtZXNbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLypcbiAqIEdldCB0aGUgdmFsdWUgb2YgYSBzdHJ1Y3R1cmUuXG4gKiBAbWV0aG9kIGdldFN0cnVjdHVyZVZhbHVlXG4gKiBAcGFyYW0ge1N0cmluZ30gbW9kZWwgbmFtZSBvZiB0aGUgbW9kZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBuYW1lIG9mIHRoZSBjb21wb25lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgdmFsdWVcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGdldFN0cnVjdHVyZVZhbHVlKG1vZGVsLCBpZCwgcGF0aCkge1xuICAgIHZhciByZXN1bHQgPSBudWxsLFxuICAgICAgICBkb2MgPSAkZGIuc3RvcmVbbW9kZWxdW2lkXSxcbiAgICAgICAgc3ViUGF0aCA9IHBhdGguc3BsaXQoJy4nKSxcbiAgICAgICAgbGVuZ3RoID0gc3ViUGF0aC5sZW5ndGgsXG4gICAgICAgIGkgPSAwO1xuXG4gICAgcmVzdWx0ID0gZG9jO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdFtzdWJQYXRoW2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKlxuICogU2V0IHRoZSB2YWx1ZSBvZiBhIHN0cnVjdHVyZS5cbiAqIEBtZXRob2QgZ2V0U3RydWN0dXJlVmFsdWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBtb2RlbCBuYW1lIG9mIHRoZSBtb2RlbFxuICogQHBhcmFtIHtTdHJpbmd9IGlkIG5hbWUgb2YgdGhlIGNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgdGhlIHZhbHVlIHRvIHNldCBcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHNldFN0cnVjdHVyZVZhbHVlKG1vZGVsLCBpZCwgcGF0aCwgdmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gbnVsbCxcbiAgICAgICAgZG9jID0gJGRiLnN0b3JlW21vZGVsXVtpZF0sXG4gICAgICAgIHN1YlBhdGggPSBwYXRoLnNwbGl0KCcuJyksXG4gICAgICAgIGxlbmd0aCA9IHN1YlBhdGgubGVuZ3RoLFxuICAgICAgICBpID0gMDtcblxuICAgIHJlc3VsdCA9IGRvYztcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0W3N1YlBhdGhbaV1dO1xuICAgIH1cbiAgICByZXN1bHRbc3ViUGF0aFtpXV0gPSB2YWx1ZTtcbn1cblxuXG4vKlxuICogQ3JlYXRlIGEgbmV3IGNsYXNzIGZyb20gYSBjbGFzcyBkZWZpbml0aW9uLlxuICogQG1ldGhvZCBjcmVhdGVDbGFzc3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc0lkIG5hbWUgb2YgdGhlIGNsYXNzXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGNsYXNzXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjcmVhdGVDbGFzcyhjbGFzc0lkKSB7XG4gICAgdmFyIGJvZHkgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgICAgICAgdmFyIGJvZHkgPSB7fTtcblxuICAgICAgICBpZiAoY29uZmlnLmNvbnN0cnVjdG9yLm5hbWUgIT09ICdPYmplY3QnKSB7XG4gICAgICAgICAgICAkbG9nLmludmFsaWRDb25jdHJ1Y3RvclBhcmFtZXRlcnMoY29uZmlnLCBjbGFzc0lkKTtcbiAgICAgICAgICAgIGNvbmZpZyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEkbWV0YW1vZGVsLmlzVmFsaWRPYmplY3QoY29uZmlnLCAkbWV0YW1vZGVsLmdldE1vZGVsKGNsYXNzSWQpLCB0cnVlLCB0cnVlKSkge1xuICAgICAgICAgICAgJGxvZy5pbnZhbGlkUGFyYW1ldGVycyhjbGFzc0lkKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRtZXRhbW9kZWwucHJlcGFyZU9iamVjdChjb25maWcsICRtZXRhbW9kZWwuZ2V0TW9kZWwoY2xhc3NJZCkpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLl9pZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNvbmZpZy5faWQgPSAkaGVscGVyLmdlbmVyYXRlSWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3JlW2NvbmZpZy5faWRdID0gdGhpcztcblxuICAgICAgICAvLyBpZFxuICAgICAgICBib2R5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy5faWQ7XG4gICAgICAgIH07XG4gICAgICAgIC8qIGpzaGludCAtVzA1NCAqL1xuICAgICAgICB0aGlzLmlkID0gbmV3IEZ1bmN0aW9uKFwiYm9keVwiLCBcInJldHVybiBmdW5jdGlvbiBpZCAoKSB7IHJldHVybiBib2R5LmNhbGwodGhpcykgfTtcIikoYm9keSk7XG4gICAgICAgIC8qIGpzaGludCArVzA1NCAqL1xuXG4gICAgICAgIC8vIGNsYXNzSW5mb1xuICAgICAgICBpZiAoJG1ldGFtb2RlbC5pbmhlcml0RnJvbShjbGFzc0lkLCAnUnVudGltZUNvbXBvbmVudCcpKSB7XG4gICAgICAgICAgICBjb25maWcuY2xhc3NJbmZvID0gY2xhc3NJZCArICdJbmZvJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNyZWF0ZSBsaW5rIHRvIGRiXG4gICAgICAgICRkYi5zdG9yZVtjbGFzc0lkXVtjb25maWcuX2lkXSA9IGNvbmZpZztcblxuICAgICAgICAkZGIuY3JlYXRlTG9nKCdpbnNlcnQnLCBjbGFzc0lkLCBjb25maWcuX2lkLCAnJywgY29uZmlnKTtcblxuICAgICAgICBpZiAoJGhlbHBlci5pc1J1bnRpbWUoKSAmJiAkaGVscGVyLmdldFJ1bnRpbWUoKS5yZXF1aXJlKCdkYicpKSB7XG4gICAgICAgICAgICAkaGVscGVyLmdldFJ1bnRpbWUoKS5yZXF1aXJlKCdkYicpLmluc2VydCh7XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbjogY2xhc3NJZCxcbiAgICAgICAgICAgICAgICBkb2N1bWVudDogY29uZmlnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5mcmVlemUodGhpcyk7XG5cbiAgICAgICAgaWYgKHRoaXMuaW5pdCkge1xuICAgICAgICAgICAgdGhpcy5pbml0KGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qIGpzaGludCAtVzA1NCAqL1xuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oXCJib2R5XCIsIFwicmV0dXJuIGZ1bmN0aW9uIFwiICsgY2xhc3NJZCArIFwiIChjb25maWcpIHsgYm9keS5jYWxsKHRoaXMsY29uZmlnKSB9O1wiKShib2R5KTtcbiAgICAvKiBqc2hpbnQgK1cwNTQgKi9cbn1cblxuXG4vKlxuICogQWRkIGFuIGlkIG1ldGhvZCB0byBhIGNsYXNzIHRoYXQgd2lsbCByZXR1cm4gaXRzIGlkLlxuICogQG1ldGhvZCBhZGRJZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gQ2xhc3MgYSBjbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzSWQgbmFtZSBvZiB0aGUgY2xhc3NcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGFkZElkKENsYXNzLCBjbGFzc0lkKSB7XG4gICAgdmFyIGJvZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjbGFzc0lkO1xuICAgIH07XG4gICAgLyoganNoaW50IC1XMDU0ICovXG4gICAgQ2xhc3MuaWQgPSBuZXcgRnVuY3Rpb24oXCJib2R5XCIsIFwicmV0dXJuIGZ1bmN0aW9uIGlkIChwcm9wLCB2YWwpIHsgcmV0dXJuIGJvZHkuY2FsbCh0aGlzLCBwcm9wLCB2YWwpIH07XCIpKGJvZHkpO1xuICAgIC8qIGpzaGludCArVzA1NCAqL1xufVxuXG5cbi8qXG4gKiBBZGQgcHJvcGVydGllcyB0byBhIGNvbXBvbmVudC4gQWxsIHRoZXNlIHByb3BlcnRpZXMgd2lsbCBiZSBhY2Nlc3NlZCBieSBhIG1ldGhvZCB3aXRoIHRoZSBzYW1lIG5hbWUuXG4gKiBTb21lIGNoZWNrcyBjYW4gYmUgZG9uZSBpbiBvcmRlciB0byBzZWUgaWYgdGhlIHNldCBvZiBwcm9wZXJ0aWVzIGlzIGNvbXBsaWFudCB3aXRoIHRoZSBtb2RlbC5cbiAqIEBleGFtcGxlXG4gKiBsYXVyZS5hZ2UoKTsgLy8gZ2V0IHRoZSBhZ2Ugb2YgYSBwZXJzb25cbiAqIGxhdXJlLmFnZSgyMik7IC8vIHNldCB0aGUgYWdlIG9mIGEgcGVyc29uXG4gKiBAbWV0aG9kIGFkZFByb3BlcnRpZXNcbiAqIEBwYXJhbSB7U3RyaW5nfSBtb2RlbCBtb2RlbCBuYW1lXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBDbGFzcyBDbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzSWQgbmFtZSBvZiB0aGUgY2xhc3NcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGFkZFByb3BlcnRpZXMobW9kZWwsIENsYXNzLCBjbGFzc0lkKSB7XG4gICAgdmFyIHByb3BlcnRpZXMgPSBnZXRQcm9wZXJ0aWVzKG1vZGVsKTtcblxuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiBwcm9wZXJ0eShwcm9wKSB7XG4gICAgICAgIHZhciBib2R5ID0ge30sXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSAnJyxcbiAgICAgICAgICAgIHByb3BlcnR5VHlwZSA9ICcnLFxuICAgICAgICAgICAgcHJvcGVydHlSZWFkT25seSA9ICcnO1xuXG4gICAgICAgIHByb3BlcnR5TmFtZSA9IHByb3AubmFtZTtcbiAgICAgICAgcHJvcGVydHlUeXBlID0gcHJvcC50eXBlO1xuICAgICAgICBwcm9wZXJ0eVJlYWRPbmx5ID0gcHJvcC5yZWFkT25seTtcblxuICAgICAgICBmdW5jdGlvbiBfaXNWYWxpZENvbGxlY3Rpb24oY29sbCwgdHlwZSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRydWU7XG5cbiAgICAgICAgICAgIGNvbGwuZm9yRWFjaChmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAhKFxuICAgICAgICAgICAgICAgICAgICAgICAgJG1ldGFtb2RlbC5pc1ZhbGlkVHlwZSh2YWwsIHR5cGUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoJG1ldGFtb2RlbC5pbmhlcml0RnJvbSh2YWwuY29uc3RydWN0b3IubmFtZSwgdHlwZS5yZXBsYWNlKCdAJywgJycpKSAmJiAodHlwZS5pbmRleE9mKCdAJykgIT09IC0xKSkpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCAmJiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfZ2V0UmVhbENvbGxlY3Rpb24oY29sbCwgdHlwZSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICBjb2xsLmZvckVhY2goZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlWzBdLmluZGV4T2YoJ0AnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVvZiB2YWwuaWQgIT09ICd1bmRlZmluZWQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbC5pZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcGVydHlUeXBlKSkgeyAvLyBpbiBjYXNlIG9mIGFycmF5LCByZXR1cm4gYSBzdWIgYXJyYXlcbiAgICAgICAgICAgIGJvZHkgPSBmdW5jdGlvbiBib2R5KHBvc2l0aW9uLCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBzZWFyY2ggPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgcnVudGltZUFyciA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHZhbCA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHJlYWxWYWwgPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gMDtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcG9zaXRpb24gPT09ICd1bmRlZmluZWQnKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bnRpbWVBcnIgPSBuZXcgUnVudGltZUFycmF5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInByb3BlcnR5TmFtZVwiOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWFkT25seVwiOiBwcm9wZXJ0eVJlYWRPbmx5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NJZFwiOiBjbGFzc0lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBwcm9wZXJ0eVR5cGVbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcnJcIjogJGRiLnN0b3JlW2NsYXNzSWRdW3RoaXMuaWQoKV1bcHJvcGVydHlOYW1lXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBydW50aW1lQXJyO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocG9zaXRpb24pKSB7IC8vIHdlIHJlcGxhY2UgdGhlIGNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2lzVmFsaWRDb2xsZWN0aW9uKHBvc2l0aW9uLCBwcm9wZXJ0eVR5cGVbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaCA9ICRkYltjbGFzc0lkXS5maW5kKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2lkXCI6IHRoaXMuaWQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlYXJjaC5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ID0gc2VhcmNoWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhbFZhbCA9IF9nZXRSZWFsQ29sbGVjdGlvbihwb3NpdGlvbiwgcHJvcGVydHlUeXBlWzBdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHdvcmtmbG93LnN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBvbmVudFwiOiB0aGlzLmlkKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdGF0ZVwiOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhXCI6IFtyZWFsVmFsLCAncmVzZXQnXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFtwcm9wZXJ0eU5hbWVdID0gcmVhbFZhbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRoZWxwZXIuaXNSdW50aW1lKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaGVscGVyLmdldFJ1bnRpbWUoKS5yZXF1aXJlKCdkYicpLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb2xsZWN0aW9uJzogY2xhc3NJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2lkJzogdGhpcy5pZCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZmllbGQnOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IGNvbXBvbmVudFtwcm9wZXJ0eU5hbWVdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9nLmludmFsaWRQcm9wZXJ0eU5hbWUodGhpcy5pZCgpLCB0aGlzLmNvbnN0cnVjdG9yLm5hbWUsIHByb3BlcnR5TmFtZSwgcG9zaXRpb24sIHByb3BlcnR5VHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHBvc2l0aW9uID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSAkZGIuc3RvcmVbY2xhc3NJZF1bdGhpcy5pZCgpXVtwcm9wZXJ0eU5hbWVdW3Bvc2l0aW9uXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5VHlwZVswXS5pbmRleE9mKCdAJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhbFZhbCA9ICRoZWxwZXIuZ2V0UnVudGltZSgpLnJlcXVpcmUodmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhbFZhbCA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWFsVmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5pbnZhbGlkUHJvcGVydHlOYW1lKHRoaXMuaWQoKSwgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLCBwcm9wZXJ0eU5hbWUsIHBvc2l0aW9uLCAnbnVtYmVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5UmVhZE9ubHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2cucmVhZE9ubHlQcm9wZXJ0eSh0aGlzLmlkKCksIHRoaXMuY29uc3RydWN0b3IubmFtZSwgcHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWV0YW1vZGVsLmlzVmFsaWRUeXBlKHZhbHVlLCBwcm9wZXJ0eVR5cGVbMF0pIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCRtZXRhbW9kZWwuaW5oZXJpdEZyb20odmFsdWUuY29uc3RydWN0b3IubmFtZSwgcHJvcGVydHlUeXBlWzBdLnJlcGxhY2UoJ0AnLCAnJykpICYmIChwcm9wZXJ0eVR5cGVbMF0uaW5kZXhPZignQCcpICE9PSAtMSkpXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2ggPSAkZGJbY2xhc3NJZF0uZmluZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2lkXCI6IHRoaXMuaWQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWFyY2gubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5VHlwZVswXS5pbmRleE9mKCdAJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWxWYWwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSB0eXBlb2YgdmFsdWUuaWQgIT09ICd1bmRlZmluZWQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFsVmFsID0gdmFsdWUuaWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhbFZhbCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWxWYWwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IHNlYXJjaFswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50W3Byb3BlcnR5TmFtZV1bcG9zaXRpb25dID0gcmVhbFZhbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJGhlbHBlci5pc1J1bnRpbWUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGhlbHBlci5nZXRSdW50aW1lKCkucmVxdWlyZSgnZGInKS51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb2xsZWN0aW9uJzogY2xhc3NJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaWQnOiB0aGlzLmlkKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2ZpZWxkJzogcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IGNvbXBvbmVudFtwcm9wZXJ0eU5hbWVdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR3b3JrZmxvdy5zdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBvbmVudFwiOiB0aGlzLmlkKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0YXRlXCI6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiBbcmVhbFZhbCwgJ2FkZCddXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5pbnZhbGlkUHJvcGVydHlOYW1lKHRoaXMuaWQoKSwgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLCBwcm9wZXJ0eU5hbWUsIHZhbHVlLCBwcm9wZXJ0eVR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8qIGpzaGludCAtVzA1NCAqL1xuICAgICAgICAgICAgQ2xhc3MucHJvdG90eXBlW3Byb3BlcnR5TmFtZV0gPSBuZXcgRnVuY3Rpb24oXCJib2R5XCIsIFwicmV0dXJuIGZ1bmN0aW9uIFwiICsgcHJvcGVydHlOYW1lICsgXCIgKHBvc2l0aW9uLHZhbHVlKSB7IHJldHVybiBib2R5LmNhbGwodGhpcywgcG9zaXRpb24sIHZhbHVlKSB9O1wiKShib2R5KTtcbiAgICAgICAgICAgIC8qIGpzaGludCArVzA1NCAqL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYm9keSA9IGZ1bmN0aW9uIGJvZHkodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VhcmNoID0gW10sXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ID0gJGRiLnN0b3JlW2NsYXNzSWRdW3RoaXMuaWQoKV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgcHJvcGVydHlUeXBlLmluZGV4T2YoJ0AnKSAhPT0gLTE6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBnZXQoY29tcG9uZW50W3Byb3BlcnR5TmFtZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIHByb3BlcnR5VHlwZSA9PT0gJ2RhdGUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gbmV3IERhdGUoY29tcG9uZW50W3Byb3BlcnR5TmFtZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICRtZXRhbW9kZWwuaXNTdHJ1Y3R1cmUocHJvcGVydHlOYW1lLCBjbGFzc0lkKTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IGFkZFN0cnVjdHVyZSgnJywgcHJvcGVydHlOYW1lLCBtb2RlbCwgdGhpcy5pZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IGNvbXBvbmVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5kZXN0cm95ZWRDb21wb25lbnRDYWxsKHByb3BlcnR5TmFtZSwgdGhpcy5pZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eVJlYWRPbmx5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9nLnJlYWRPbmx5UHJvcGVydHkodGhpcy5pZCgpLCB0aGlzLmNvbnN0cnVjdG9yLm5hbWUsIHByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJG1ldGFtb2RlbC5pc1ZhbGlkVHlwZSh2YWx1ZSwgcHJvcGVydHlUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaCA9ICRkYltjbGFzc0lkXS5maW5kKHsgXCJfaWRcIjogdGhpcy5pZCgpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWFyY2gubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IHNlYXJjaFswXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgcHJvcGVydHlUeXBlLmluZGV4T2YoJ0AnKSAhPT0gLTE6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFtwcm9wZXJ0eU5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50W3Byb3BlcnR5TmFtZV0gPSB2YWx1ZS5pZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgcHJvcGVydHlUeXBlID09PSAnZGF0ZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50W3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRbcHJvcGVydHlOYW1lXSA9IHZhbHVlLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRoZWxwZXIuaXNSdW50aW1lKCkgJiYgJGhlbHBlci5nZXRSdW50aW1lKCkucmVxdWlyZSgnZGInKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGhlbHBlci5nZXRSdW50aW1lKCkucmVxdWlyZSgnZGInKS51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb2xsZWN0aW9uJzogY2xhc3NJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaWQnOiB0aGlzLmlkKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2ZpZWxkJzogcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhc2Ugb2YgUnVudGltZUJlaGF2aW9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbGFzc0lkID09PSAnUnVudGltZUJlaGF2aW9yJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGJlaGF2aW9yLnJlbW92ZUZyb21NZW1vcnkodGhpcy5pZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR3b3JrZmxvdy5zdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBvbmVudFwiOiB0aGlzLmlkKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0YXRlXCI6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiBbdmFsdWVdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5pbnZhbGlkUHJvcGVydHlOYW1lKHRoaXMuaWQoKSwgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLCBwcm9wZXJ0eU5hbWUsIHZhbHVlLCBwcm9wZXJ0eVR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8qIGpzaGludCAtVzA1NCAqL1xuICAgICAgICAgICAgQ2xhc3MucHJvdG90eXBlW3Byb3BlcnR5TmFtZV0gPSBuZXcgRnVuY3Rpb24oXCJib2R5XCIsIFwicmV0dXJuIGZ1bmN0aW9uIFwiICsgcHJvcGVydHlOYW1lICsgXCIgKHZhbHVlKSB7IHJldHVybiBib2R5LmNhbGwodGhpcyx2YWx1ZSkgfTtcIikoYm9keSk7XG4gICAgICAgICAgICAvKiBqc2hpbnQgK1cwNTQgKi9cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbi8qXG4gKiBBZGQgc3RydWN0dXJlIHByb3BlcnRpZXMgdG8gYSBjb21wb25lbnQuIEFsbCB0aGVzZSBwcm9wZXJ0aWVzIHdpbGwgYmUgYWNjZXNzZWQgYnkgYSBtZXRob2Qgd2l0aCB0aGUgc2FtZSBuYW1lLlxuICogU29tZSBjaGVja3MgY2FuIGJlIGRvbmUgaW4gb3JkZXIgdG8gc2VlIGlmIHRoZSBzZXQgb2YgcHJvcGVydGllcyBpcyBjb21wbGlhbnQgd2l0aCB0aGUgbW9kZWwuXG4gKiBAbWV0aG9kIGFkZFN0cnVjdHVyZVxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggcGFyZW50IHBhdGhcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIHByb3BlcnR5IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBtb2RlbCBtb2RlbCBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIGNvbXBvbmVudFxuICogQHJldHVybiB7T2JqZWN0fSBvYmplY3QgdGhhdCBjb2ludGFpbnMgbWV0aG9kcyB0byBhY2Nlc3MgdGhlIHN0cnVjdHVyZSBcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGFkZFN0cnVjdHVyZShwYXRoLCBuYW1lLCBtb2RlbCwgaWQpIHtcbiAgICB2YXIgcHJvcGVydGllcyA9IGdldFN0cnVjdHVyZVByb3BlcnRpZXMobmFtZSwgbW9kZWwpLFxuICAgICAgICBzcnVjdHVyZSA9IHt9O1xuXG4gICAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uIHByb3BlcnR5KHByb3ApIHtcbiAgICAgICAgdmFyIGJvZHkgPSB7fSxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSA9ICcnLFxuICAgICAgICAgICAgcHJvcGVydHlUeXBlID0gJycsXG4gICAgICAgICAgICBwcm9wZXJ0eVJlYWRPbmx5ID0gJyc7XG5cbiAgICAgICAgcHJvcGVydHlOYW1lID0gcHJvcC5uYW1lO1xuICAgICAgICBwcm9wZXJ0eVR5cGUgPSBwcm9wLnR5cGU7XG4gICAgICAgIHByb3BlcnR5UmVhZE9ubHkgPSBwcm9wLnJlYWRPbmx5O1xuXG4gICAgICAgIGJvZHkgPSBmdW5jdGlvbiBib2R5KHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgc2VhcmNoID0gW10sXG4gICAgICAgICAgICAgICAgY29tcG9uZW50ID0gbnVsbCxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gbnVsbCxcbiAgICAgICAgICAgICAgICBwYXJlbnRQYXRoID0gJycsXG4gICAgICAgICAgICAgICAgZnVsbFBhdGggPSAnJztcblxuICAgICAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRQYXRoID0gcGFyZW50UGF0aCArICcuJyArIG5hbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmVudFBhdGggPSBuYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVsbFBhdGggPSBwYXJlbnRQYXRoICsgJy4nICsgcHJvcGVydHlOYW1lO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9ICRkYi5zdG9yZVttb2RlbF1baWRdO1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIHByb3BlcnR5VHlwZS5pbmRleE9mKCdAJykgIT09IC0xOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBnZXQoZ2V0U3RydWN0dXJlVmFsdWUobW9kZWwsIGlkLCBmdWxsUGF0aCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBwcm9wZXJ0eVR5cGUgPT09ICdkYXRlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gbmV3IERhdGUoZ2V0U3RydWN0dXJlVmFsdWUobW9kZWwsIGlkLCBmdWxsUGF0aCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAkbWV0YW1vZGVsLmlzU3RydWN0dXJlKHByb3BlcnR5TmFtZSwgbW9kZWwpOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBhZGRTdHJ1Y3R1cmUocGFyZW50UGF0aCwgcHJvcGVydHlOYW1lLCBtb2RlbCwgaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gZ2V0U3RydWN0dXJlVmFsdWUobW9kZWwsIGlkLCBmdWxsUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5VmFsdWUgPT09IHVuZGVmaW5lZCAmJiBwcm9wLmRlZmF1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IHByb3AuZGVmYXVsdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkbG9nLmRlc3Ryb3llZENvbXBvbmVudENhbGwoZnVsbFBhdGgsIGlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eVJlYWRPbmx5KSB7XG4gICAgICAgICAgICAgICAgICAgICRsb2cucmVhZE9ubHlQcm9wZXJ0eShpZCwgbW9kZWwsIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJG1ldGFtb2RlbC5pc1ZhbGlkVHlwZSh2YWx1ZSwgcHJvcGVydHlUeXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoID0gJGRiW21vZGVsXS5maW5kKHsgXCJfaWRcIjogaWQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VhcmNoLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IHNlYXJjaFswXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIHByb3BlcnR5VHlwZS5pbmRleE9mKCdAJykgIT09IC0xOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0U3RydWN0dXJlVmFsdWUobW9kZWwsIGlkLCBmdWxsUGF0aCwgdmFsdWUuaWQoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBwcm9wZXJ0eVR5cGUgPT09ICdkYXRlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFN0cnVjdHVyZVZhbHVlKG1vZGVsLCBpZCwgZnVsbFBhdGgsIHZhbHVlLnRvSVNPU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRTdHJ1Y3R1cmVWYWx1ZShtb2RlbCwgaWQsIGZ1bGxQYXRoLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJGhlbHBlci5pc1J1bnRpbWUoKSAmJiAkaGVscGVyLmdldFJ1bnRpbWUoKS5yZXF1aXJlKCdkYicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRoZWxwZXIuZ2V0UnVudGltZSgpLnJlcXVpcmUoJ2RiJykudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb2xsZWN0aW9uJzogbW9kZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaWQnOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdmaWVsZCc6IGZ1bGxQYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FzZSBvZiBSdW50aW1lQmVoYXZpb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWwgPT09ICdSdW50aW1lQmVoYXZpb3InKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRiZWhhdmlvci5yZW1vdmVGcm9tTWVtb3J5KGlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkd29ya2Zsb3cuc3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBvbmVudFwiOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdGF0ZVwiOiBmdWxsUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhXCI6IFt2YWx1ZV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuaW52YWxpZFByb3BlcnR5TmFtZShpZCwgbW9kZWwsIGZ1bGxQYXRoLCB2YWx1ZSwgcHJvcGVydHlUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKiBqc2hpbnQgLVcwNTQgKi9cbiAgICAgICAgc3J1Y3R1cmVbcHJvcGVydHlOYW1lXSA9IG5ldyBGdW5jdGlvbihcImJvZHlcIiwgXCJyZXR1cm4gZnVuY3Rpb24gXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIiAodmFsdWUpIHsgcmV0dXJuIGJvZHkuY2FsbCh0aGlzLHZhbHVlKSB9O1wiKShib2R5KTtcbiAgICAgICAgLyoganNoaW50ICtXMDU0ICovXG4gICAgfSk7XG5cbiAgICByZXR1cm4gc3J1Y3R1cmU7XG59XG5cbi8qXG4gKiBBZGQgbWV0aG9kcyB0byBhIGNvbXBvbmVudC5cbiAqIFRoZSBjYWxsIHRvIHRoZXNlIG1ldGhvZHMgd2lsbCBpbnZva2UgdGhlIHdvcmtmbG93IGluIG9yZGVyIHRvIGNoZWNrIHRoYXQgaW5wb3V0cyAvIG91dHB1dHMgYXJlIGNvbXBsaWFudCB3aXRoIHRoZSBtb2RlbC5cbiAqIEBtZXRob2QgYWRkTWV0aG9kc1xuICogQHBhcmFtIHtTdHJpbmd9IG1vZGVsIG1vZGVsIG5hbWVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IENsYXNzIENsYXNzXG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NJZCBuYW1lIG9mIHRoZSBjbGFzc1xuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gYWRkTWV0aG9kcyhtb2RlbCwgQ2xhc3MsIGNsYXNzSWQpIHtcbiAgICB2YXIgbWV0aG9kcyA9IGdldE1ldGhvZHMobW9kZWwpO1xuXG4gICAgbWV0aG9kcy5mb3JFYWNoKGZ1bmN0aW9uIG1ldGhvZChtZXRob2ROYW1lKSB7XG4gICAgICAgIHZhciBwYXJhbXNOYW1lID0gZ2V0UGFyYW1OYW1lcyhjbGFzc0lkLCBtZXRob2ROYW1lKSxcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtc05hbWUuam9pbignLCcpLFxuICAgICAgICAgICAgYm9keSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIHJlc3VsdCA9ICR3b3JrZmxvdy5zdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IHRoaXMuaWQoKSxcbiAgICAgICAgICAgICAgICAgICAgXCJzdGF0ZVwiOiBtZXRob2ROYW1lLFxuICAgICAgICAgICAgICAgICAgICBcImRhdGFcIjogYXJndW1lbnRzXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgaWYgKHBhcmFtcykge1xuICAgICAgICAgICAgLyoganNoaW50IC1XMDU0ICovXG4gICAgICAgICAgICBDbGFzcy5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBuZXcgRnVuY3Rpb24oXCJib2R5XCIsIFwicmV0dXJuIGZ1bmN0aW9uIFwiICsgbWV0aG9kTmFtZSArIFwiIChcIiArIHBhcmFtcyArIFwiKSB7IHJldHVybiBib2R5LmNhbGwodGhpcyxcIiArIHBhcmFtcyArIFwiKSB9O1wiKShib2R5KTtcbiAgICAgICAgICAgIC8qIGpzaGludCArVzA1NCAqL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLyoganNoaW50IC1XMDU0ICovXG4gICAgICAgICAgICBDbGFzcy5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBuZXcgRnVuY3Rpb24oXCJib2R5XCIsIFwicmV0dXJuIGZ1bmN0aW9uIFwiICsgbWV0aG9kTmFtZSArIFwiICgpIHsgcmV0dXJuIGJvZHkuY2FsbCh0aGlzKSB9O1wiKShib2R5KTtcbiAgICAgICAgICAgIC8qIGpzaGludCArVzA1NCAqL1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuLypcbiAqIEFkZCBldmVudHMgdG8gYSBjb21wb25lbnQuXG4gKiBUaGUgY2FsbCB0byB0aGVzZSBtZXRob2RzIHdpbGwgaW52b2tlIHRoZSB3b3JrZmxvdyBpbiBvcmRlciB0byBjaGVjayB0aGF0IGlucG91dHMgYXJlIGNvbXBsaWFudCB3aXRoIHRoZSBtb2RlbC5cbiAqIEBtZXRob2QgYWRkRXZlbnRzXG4gKiBAcGFyYW0ge1N0cmluZ30gbW9kZWwgbW9kZWwgbmFtZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gQ2xhc3MgQ2xhc3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc0lkIG5hbWUgb2YgdGhlIGNsYXNzXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBhZGRFdmVudHMobW9kZWwsIENsYXNzLCBjbGFzc0lkKSB7XG4gICAgdmFyIGV2ZW50cyA9IGdldEV2ZW50cyhtb2RlbCk7XG4gICAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24gZXZlbnQobWV0aG9kTmFtZSkge1xuICAgICAgICB2YXIgcGFyYW1zTmFtZSA9IGdldFBhcmFtTmFtZXMoY2xhc3NJZCwgbWV0aG9kTmFtZSksXG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXNOYW1lLmpvaW4oJywnKSxcbiAgICAgICAgICAgIGJvZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN5c3RlbXMgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgc3lzdGVtSWQgPSAnZTg5YzYxN2I2YjE1ZDI0JyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IFtdLFxuICAgICAgICAgICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gLTEsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSB7fTtcblxuICAgICAgICAgICAgICAgIGlmIChjbGFzc0lkID09PSAnUnVudGltZUNoYW5uZWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN5c3RlbXMgPSAkZGIuUnVudGltZVN5c3RlbS5maW5kKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdtYXN0ZXInOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3lzdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5c3RlbUlkID0gc3lzdGVtc1swXS5faWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLmZyb20gPSBzeXN0ZW1JZDtcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLmRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLmV2ZW50ID0gbWV0aG9kTmFtZTtcblxuICAgICAgICAgICAgICAgICAgICAkZGIuUnVudGltZU1lc3NhZ2UuaW5zZXJ0KG1lc3NhZ2UpO1xuXG4gICAgICAgICAgICAgICAgICAgICR3b3JrZmxvdy5zdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBvbmVudFwiOiB0aGlzLmlkKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0YXRlXCI6IFwic2VuZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJldmVudFwiOiBtZXNzYWdlLmV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBtZXNzYWdlLmZyb20sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhXCI6IG1lc3NhZ2UuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHdvcmtmbG93LnN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IHRoaXMuaWQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RhdGVcIjogbWV0aG9kTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiBhcmd1bWVudHNcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgaWYgKHBhcmFtcykge1xuICAgICAgICAgICAgLyoganNoaW50IC1XMDU0ICovXG4gICAgICAgICAgICBDbGFzcy5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBuZXcgRnVuY3Rpb24oXCJib2R5XCIsIFwicmV0dXJuIGZ1bmN0aW9uIFwiICsgbWV0aG9kTmFtZSArIFwiIChcIiArIHBhcmFtcyArIFwiKSB7IHJldHVybiBib2R5LmNhbGwodGhpcyxcIiArIHBhcmFtcyArIFwiKSB9O1wiKShib2R5KTtcbiAgICAgICAgICAgIC8qIGpzaGludCArVzA1NCAqL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLyoganNoaW50IC1XMDU0ICovXG4gICAgICAgICAgICBDbGFzcy5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBuZXcgRnVuY3Rpb24oXCJib2R5XCIsIFwicmV0dXJuIGZ1bmN0aW9uIFwiICsgbWV0aG9kTmFtZSArIFwiICgpIHsgcmV0dXJuIGJvZHkuY2FsbCh0aGlzKSB9O1wiKShib2R5KTtcbiAgICAgICAgICAgIC8qIGpzaGludCArVzA1NCAqL1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuLypcbiAqIEFkZCBhIG9uIG1ldGhvZCB0byBhIGNvbXBvbmVudCB0byBhZGQgYmVoYXZpb3JzIHRvIHRoZSBjb21wb25lbnQuXG4gKiBAbWV0aG9kIGFkZE9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBDbGFzcyBDbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzSWQgbmFtZSBvZiB0aGUgY2xhc3NcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGFkZE9uKENsYXNzLCBjbGFzc0lkKSB7XG4gICAgdmFyIGJvZHkgPSBmdW5jdGlvbiAoc3RhdGUsIGhhbmRsZXIsIHVzZUNvcmVBUEksIGlzQ29yZSkge1xuICAgICAgICB2YXIgYmVoYXZpb3JJZCA9ICcnLFxuICAgICAgICAgICAgY3VycmVudFN0YXRlID0gJyc7XG5cbiAgICAgICAgaWYgKCR3b3JrZmxvdy5jaGVja1BhcmFtcyh7XG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiB0aGlzLFxuICAgICAgICAgICAgXCJtZXRob2ROYW1lXCI6IFwib25cIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBhcmd1bWVudHNcbiAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIGlmICgkbWV0YW1vZGVsLmlzVmFsaWRTdGF0ZShzdGF0ZSwgY2xhc3NJZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICEkbWV0YW1vZGVsLmlzRXZlbnQoc3RhdGUsIGNsYXNzSWQpICYmXG4gICAgICAgICAgICAgICAgICAgICEkbWV0YW1vZGVsLmlzUHJvcGVydHkoc3RhdGUsIGNsYXNzSWQpICYmXG4gICAgICAgICAgICAgICAgICAgICEkbWV0YW1vZGVsLmlzTGluayhzdGF0ZSwgY2xhc3NJZCkgJiZcbiAgICAgICAgICAgICAgICAgICAgISRtZXRhbW9kZWwuaXNDb2xsZWN0aW9uKHN0YXRlLCBjbGFzc0lkKSAmJlxuICAgICAgICAgICAgICAgICAgICAkZGIuUnVudGltZUJlaGF2aW9yLmZpbmQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21wb25lbnRcIjogdGhpcy5pZCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdGF0ZVwiOiBzdGF0ZVxuICAgICAgICAgICAgICAgICAgICB9KS5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgICAgICAkbG9nLmJlaGF2aW9yTm90VW5pcXVlKGNsYXNzSWQsIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHdvcmtsb3cudmFsaWRQYXJhbU51bWJlcnMoY2xhc3NJZCwgc3RhdGUsIGhhbmRsZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcklkID0gJGJlaGF2aW9yLmFkZCh0aGlzLmlkKCksIHN0YXRlLCBoYW5kbGVyLCB1c2VDb3JlQVBJLCBpc0NvcmUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3RhdGUgPSAkc3RhdGUuZ2V0KHRoaXMuaWQoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFN0YXRlICYmIHN0YXRlID09PSBjdXJyZW50U3RhdGUubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR3b3JrZmxvdy5hY3Rpb24oYmVoYXZpb3JJZCwgY3VycmVudFN0YXRlLnBhcmFtZXRlcnMuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuaW52YWxpZFBhcmFtTnVtYmVyTWV0aG9kT24odGhpcy5pZCgpLCB0aGlzLmNvbnN0cnVjdG9yLm5hbWUsIHN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGxvZy5pbnZhbGlkU3RhdGVPbihjbGFzc0lkLCBzdGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJlaGF2aW9ySWQ7XG4gICAgfTtcbiAgICAvKiBqc2hpbnQgLVcwNTQgKi9cbiAgICBDbGFzcy5wcm90b3R5cGUub24gPSBuZXcgRnVuY3Rpb24oXCJib2R5XCIsIFwicmV0dXJuIGZ1bmN0aW9uIG9uIChzdGF0ZSxoYW5kbGVyLHVzZUNvcmVBUEksaXNDb3JlKSB7IHJldHVybiBib2R5LmNhbGwodGhpcyxzdGF0ZSxoYW5kbGVyLHVzZUNvcmVBUEksaXNDb3JlKSB9O1wiKShib2R5KTtcbiAgICAvKiBqc2hpbnQgK1cwNTQgKi9cbn1cblxuXG4vKlxuICogQWRkIGEgb24gbWV0aG9kIHRvIGEgY2xhc3MgY29tcG9uZW50IHRvIGFkZCBiZWhhdmlvcnMgdG8gdGhlIGNsYXNzLlxuICogQG1ldGhvZCBhZGRPbkNsYXNzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBDbGFzcyBDbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzSWQgbmFtZSBvZiB0aGUgY2xhc3NcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGFkZE9uQ2xhc3MoQ2xhc3MsIGNsYXNzSWQpIHtcbiAgICB2YXIgYm9keSA9IGZ1bmN0aW9uIChzdGF0ZSwgaGFuZGxlciwgdXNlQ29yZUFQSSwgaXNDb3JlKSB7XG4gICAgICAgIHZhciBiZWhhdmlvcklkID0gJycsXG4gICAgICAgICAgICBjdXJyZW50U3RhdGUgPSAnJztcblxuICAgICAgICBpZiAoJHdvcmtmbG93LmNoZWNrUGFyYW1zKHtcbiAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IHRoaXMsXG4gICAgICAgICAgICBcIm1ldGhvZE5hbWVcIjogXCJvblwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IGFyZ3VtZW50c1xuICAgICAgICB9KSkge1xuICAgICAgICAgICAgaWYgKCRtZXRhbW9kZWwuaXNWYWxpZFN0YXRlKHN0YXRlLCBjbGFzc0lkKSkge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgISRtZXRhbW9kZWwuaXNFdmVudChzdGF0ZSwgY2xhc3NJZCkgJiZcbiAgICAgICAgICAgICAgICAgICAgISRtZXRhbW9kZWwuaXNQcm9wZXJ0eShzdGF0ZSwgY2xhc3NJZCkgJiZcbiAgICAgICAgICAgICAgICAgICAgISRtZXRhbW9kZWwuaXNMaW5rKHN0YXRlLCBjbGFzc0lkKSAmJlxuICAgICAgICAgICAgICAgICAgICAhJG1ldGFtb2RlbC5pc0NvbGxlY3Rpb24oc3RhdGUsIGNsYXNzSWQpICYmXG4gICAgICAgICAgICAgICAgICAgICRkYi5SdW50aW1lQmVoYXZpb3IuZmluZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBvbmVudFwiOiB0aGlzLmlkKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0YXRlXCI6IHN0YXRlXG4gICAgICAgICAgICAgICAgICAgIH0pLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICRsb2cuYmVoYXZpb3JOb3RVbmlxdWUoY2xhc3NJZCwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkd29ya2xvdy52YWxpZFBhcmFtTnVtYmVycyhjbGFzc0lkLCBzdGF0ZSwgaGFuZGxlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlaGF2aW9ySWQgPSAkYmVoYXZpb3IuYWRkKHRoaXMuaWQoKSwgc3RhdGUsIGhhbmRsZXIsIHVzZUNvcmVBUEksIGlzQ29yZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZSA9ICRzdGF0ZS5nZXQodGhpcy5pZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U3RhdGUgJiYgc3RhdGUgPT09IGN1cnJlbnRTdGF0ZS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHdvcmtmbG93LmFjdGlvbihiZWhhdmlvcklkLCBjdXJyZW50U3RhdGUucGFyYW1ldGVycy5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5pbnZhbGlkUGFyYW1OdW1iZXJNZXRob2RPbih0aGlzLmlkKCksIHRoaXMuY29uc3RydWN0b3IubmFtZSwgc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkbG9nLmludmFsaWRTdGF0ZU9uKGNsYXNzSWQsIHN0YXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmVoYXZpb3JJZDtcbiAgICB9O1xuICAgIC8qIGpzaGludCAtVzA1NCAqL1xuICAgIENsYXNzLm9uID0gbmV3IEZ1bmN0aW9uKFwiYm9keVwiLCBcInJldHVybiBmdW5jdGlvbiBvbiAoc3RhdGUsaGFuZGxlcix1c2VDb3JlQVBJLGlzQ29yZSkgeyByZXR1cm4gYm9keS5jYWxsKHRoaXMsIHN0YXRlLCBoYW5kbGVyLCB1c2VDb3JlQVBJLGlzQ29yZSkgfTtcIikoYm9keSk7XG4gICAgLyoganNoaW50IC1XMDU0ICovXG59XG5cblxuLypcbiAqIEFkZCBhIG9mZiBtZXRob2QgdG8gYSBjbGFzcyBjb21wb25lbnQgdG8gcmVtb3ZlIGJlaGF2aW9ycyBmcm9tIHRoZSBjbGFzcy5cbiAqIEBtZXRob2QgYWRkT2ZmQ2xhc3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBDbGFzcyBDbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzSWQgbmFtZSBvZiB0aGUgY2xhc3NcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGFkZE9mZkNsYXNzKENsYXNzLCBjbGFzc0lkKSB7XG4gICAgdmFyIGJvZHkgPSBmdW5jdGlvbiAoc3RhdGUsIGJlaGF2aW9ySWQpIHtcbiAgICAgICAgaWYgKCR3b3JrZmxvdy5jaGVja1BhcmFtcyh7XG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiB0aGlzLFxuICAgICAgICAgICAgXCJtZXRob2ROYW1lXCI6IFwib2ZmXCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogYXJndW1lbnRzXG4gICAgICAgIH0pKSB7XG4gICAgICAgICAgICBpZiAoJG1ldGFtb2RlbC5pc1ZhbGlkU3RhdGUoc3RhdGUsIGNsYXNzSWQpKSB7XG4gICAgICAgICAgICAgICAgJGJlaGF2aW9yLnJlbW92ZSh7XG4gICAgICAgICAgICAgICAgICAgIFwiYmVoYXZpb3JJZFwiOiBiZWhhdmlvcklkLFxuICAgICAgICAgICAgICAgICAgICBcImNvbXBvbmVudElkXCI6IGNsYXNzSWQsXG4gICAgICAgICAgICAgICAgICAgIFwic3RhdGVcIjogc3RhdGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGxvZy5JbnZhbGlkU3RhdGVPZmYoY2xhc3NJZCwgc3RhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICAvKiBqc2hpbnQgLVcwNTQgKi9cbiAgICBDbGFzcy5vZmYgPSBuZXcgRnVuY3Rpb24oXCJib2R5XCIsIFwicmV0dXJuIGZ1bmN0aW9uIG9mZiAoc3RhdGUsIGJlaGF2aW9ySWQpIHsgcmV0dXJuIGJvZHkuY2FsbCh0aGlzLCBzdGF0ZSwgYmVoYXZpb3JJZCkgfTtcIikoYm9keSk7XG4gICAgLyoganNoaW50ICtXMDU0ICovXG59XG5cblxuLypcbiAqIEFkZCBhIGRlc3Ryb3kgbWV0aG9kIHRvIGEgY2xhc3MgY29tcG9uZW50IHRvIGRldHJveSB0aGUgY2xhc3MgYW5kIGFsbCB0aGUgY29tcG9uZW50cyBvZiB0aGUgc2FtZSBjbGFzcy5cbiAqIEBtZXRob2QgYWRkRGVzdHJveUNsYXNzXG4gKiBAcGFyYW0ge09iamVjdH0gQ2xhc3MgQ2xhc3NcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGFkZERlc3Ryb3lDbGFzcyhDbGFzcykge1xuICAgIHZhciBib2R5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaWQgPSB0aGlzLmlkKCksXG4gICAgICAgICAgICByZXN1bHQgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbGVuZ3RoID0gMDtcblxuICAgICAgICAvLyBpZiBub3QgdmlydHVhbCBjb21wb25lbnRcbiAgICAgICAgaWYgKCRkYltpZF0pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9ICRkYltpZF0ucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgc3RvcmVbaWRdO1xuXG4gICAgICAgIC8vIHJlbW92ZSBiZWhhdmlvcnNcbiAgICAgICAgJGJlaGF2aW9yLnJlbW92ZSh7XG4gICAgICAgICAgICAnY29tcG9uZW50SWQnOiBpZFxuICAgICAgICB9KTtcblxuICAgICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBiZWhhdmlvcnNcbiAgICAgICAgICAgICRiZWhhdmlvci5yZW1vdmUoe1xuICAgICAgICAgICAgICAgICdjb21wb25lbnRJZCc6IHJlc3VsdFtpXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAkd29ya2Zsb3cuc3RhdGUoe1xuICAgICAgICAgICAgXCJjb21wb25lbnRcIjogaWQsXG4gICAgICAgICAgICBcInN0YXRlXCI6IFwiZGVzdHJveVwiXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoganNoaW50IC1XMDU0ICovXG4gICAgQ2xhc3MuZGVzdHJveSA9IG5ldyBGdW5jdGlvbihcImJvZHlcIiwgXCJyZXR1cm4gZnVuY3Rpb24gZGVzdHJveSAoKSB7IHJldHVybiBib2R5LmNhbGwodGhpcykgfTtcIikoYm9keSk7XG4gICAgLyoganNoaW50ICtXMDU0ICovXG59XG5cblxuLypcbiAqIEFkZCB0aGUgYWRkQ2xhc3NJbmZvIG1ldGhvZCBvbiBhIGNsYXNzLlxuICogQG1ldGhvZCBhZGRDbGFzc0luZm9DbGFzc1xuICogQHBhcmFtIHtPYmplY3R9IENsYXNzIENsYXNzXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBhZGRDbGFzc0luZm9DbGFzcyhDbGFzcykge1xuICAgIHZhciBib2R5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZ2V0KHRoaXMuaWQoKSArICdJbmZvJyk7XG4gICAgfTtcbiAgICAvKiBqc2hpbnQgLVcwNTQgKi9cbiAgICBDbGFzcy5jbGFzc0luZm8gPSBuZXcgRnVuY3Rpb24oXCJib2R5XCIsIFwicmV0dXJuIGZ1bmN0aW9uIGNsYXNzSW5mbyAoKSB7IHJldHVybiBib2R5LmNhbGwodGhpcykgfTtcIikoYm9keSk7XG4gICAgLyoganNoaW50ICtXMDU0ICovXG59XG5cblxuLypcbiAqIENyZWF0ZSBhIGNvbXBvbmVudCBmcm9tIGl0cyBjb25maWd1cmF0aW9uLlxuICogQG1ldGhvZCBmYWN0b3J5XG4gKiBAcGFyYW0ge0pTT059IGNvbmZpZyBjb25maWd1cmF0aW9uIG9mIHRoZSBjb21wb25lbnRcbiAqIEByZXR1cm4ge0NvbXBvbmVudH0gdGhlIGNyZWF0ZWQgY29tcG9uZW50XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBmYWN0b3J5KGNvbmZpZykge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuICAgIHZhciBDbGFzcyA9IHt9LFxuICAgICAgICBjbGFzc0lkID0gJyc7XG5cbiAgICBpZiAodHlwZW9mIGNvbmZpZy5tb2RlbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY2xhc3NJZCA9ICRoZWxwZXIuZ2VuZXJhdGVJZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNsYXNzSWQgPSBjb25maWcubW9kZWw7XG4gICAgfVxuXG4gICAgQ2xhc3MgPSBjcmVhdGVDbGFzcyhjbGFzc0lkKTtcblxuICAgIHN0b3JlW2NsYXNzSWRdID0gQ2xhc3M7XG5cbiAgICBhZGRJZChDbGFzcywgY2xhc3NJZCk7XG5cbiAgICBhZGRQcm9wZXJ0aWVzKGNvbmZpZy5tb2RlbCwgQ2xhc3MsIGNsYXNzSWQpO1xuICAgIGFkZE1ldGhvZHMoY29uZmlnLm1vZGVsLCBDbGFzcywgY2xhc3NJZCk7XG4gICAgYWRkRXZlbnRzKGNvbmZpZy5tb2RlbCwgQ2xhc3MsIGNsYXNzSWQpO1xuXG4gICAgLy8gYWRkIGRlZmF1bHQgcHJvcGVydGllcy9tZXRob2RzIG9ubHkgaWYgdGhlIGNvbXBvbmVudFxuICAgIC8vIGluaGVyaXQgZnJvbSBSdW50aW1lQ29tcG9uZW50XG4gICAgaWYgKCRtZXRhbW9kZWwuaW5oZXJpdEZyb20oY2xhc3NJZCwgJ1J1bnRpbWVDb21wb25lbnQnKSkge1xuICAgICAgICBhZGRPbihDbGFzcywgY2xhc3NJZCk7XG4gICAgICAgIGFkZE9uQ2xhc3MoQ2xhc3MsIGNsYXNzSWQpO1xuICAgICAgICBhZGRPZmZDbGFzcyhDbGFzcywgY2xhc3NJZCk7XG4gICAgICAgIGFkZERlc3Ryb3lDbGFzcyhDbGFzcyk7XG4gICAgICAgIGFkZENsYXNzSW5mb0NsYXNzKENsYXNzKTtcbiAgICB9XG5cbiAgICBPYmplY3QuZnJlZXplKENsYXNzKTtcblxuICAgIHJldHVybiBDbGFzcztcbn1cblxuXG4vKiBQdWJsaWMgbWV0aG9kcyAqL1xuXG5cbi8qXG4gKiBHZXQgYSBjb21wb25lbnQgYnkgaXRzIGlkLlxuICogQG1ldGhvZCBnZXRcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBvZiB0aGUgY29tcG9uZW50XG4gKiBAcmV0dXJuIHtDb21wb25lbnR9IGNvbXBvbmVudFxuICovXG5mdW5jdGlvbiBnZXQoaWQpIHtcbiAgICByZXR1cm4gc3RvcmVbaWRdO1xufVxuXG5cbi8qXG4gKiBDcmVhdGUgYSBjb21wb25lbnQgZnJvbSBpdHMgY29uZmlndXJhdGlvbi5cbiAqIEBtZXRob2QgY3JlYXRlXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIDxicj5cbiAqIHtTdHJpbmd9IG1vZGVsIG1vZGVsIG5hbWUgPGJyPlxuICogQHJldHVybiB7Q29tcG9uZW50fVxuICovXG5mdW5jdGlvbiBjcmVhdGUoY29uZmlnKSB7XG4gICAgcmV0dXJuIGZhY3RvcnkoY29uZmlnKTtcbn1cblxuXG4vKlxuICogRGVzdHJveSBhIGNvbXBvbmVudCBmcm9tIGl0cyBpZC5cbiAqIEBtZXRob2QgZGVzdHJveVxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjb21wb25lbnQgdG8gZGVzdHJveVxuICovXG5mdW5jdGlvbiBkZXN0cm95KGlkKSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IHN0b3JlW2lkXSxcbiAgICAgICAgY2xhc3NJZCA9ICcnO1xuXG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgICBkZWxldGUgc3RvcmVbaWRdO1xuICAgICAgICBjbGFzc0lkID0gY29tcG9uZW50LmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgICRkYltjbGFzc0lkXS5yZW1vdmUoe1xuICAgICAgICAgICAgXCJfaWRcIjogaWRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGJlaGF2aW9yc1xuICAgICAgICAkYmVoYXZpb3IucmVtb3ZlKHtcbiAgICAgICAgICAgICdjb21wb25lbnRJZCc6IGlkXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGNhc2Ugb2YgQmVoYXZpb3JcbiAgICAgICAgaWYgKGNsYXNzSWQgPT09ICdSdW50aW1lQmVoYXZpb3InKSB7XG4gICAgICAgICAgICAkYmVoYXZpb3IucmVtb3ZlRnJvbU1lbW9yeShpZCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLypcbiAqIFJlbW92ZSBhIGNvbXBvbmVudCB3aXRoIGl0cyBpZCBmcm9tIHRoZSBtZW1vcnkuXG4gKiBAbWV0aG9kIHJlbW92ZUZyb21NZW1vcnlcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgY29tcG9uZW50XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZyb21NZW1vcnkoaWQpIHtcbiAgICBkZWxldGUgc3RvcmVbaWRdO1xufVxuXG5cbi8qXG4gKiBSZW1vdmUgYWxsIHRoZSBjb21wb25lbnRzIHN0b3JlIGluIHRoZSBtZW1vcnkuXG4gKiBAbWV0aG9kIGNsZWFyXG4gKi9cbmZ1bmN0aW9uIGNsZWFyKCkge1xuICAgIHN0b3JlID0ge307XG59XG5cblxuLyogZXhwb3J0cyAqL1xuXG5cbi8qKlxuICogVGhpcyBtb2R1bGUgbWFuYWdlcyB0aGUgY29tcG9uZW50cy4gXG4gKiBJdCBpcyB0aGUgZmFjdG9yeSBvZiBhbGwgdGhlIGNvbXBvbmVudHMgdGhhdCBhcmUgY3JlYXRlZCBieSBSdW50aW1lLlxuICogXG4gKiBAbW9kdWxlIHJ1bnRpbWVcbiAqIEBzdWJtb2R1bGUgcnVudGltZS1jb21wb25lbnRcbiAqIEByZXF1aXJlcyBydW50aW1lLXdvcmtmbG93XG4gKiBAcmVxdWlyZXMgcnVudGltZS1kYlxuICogQHJlcXVpcmVzIHJ1bnRpbWUtbWV0YW1vZGVsXG4gKiBAcmVxdWlyZXMgcnVudGltZS1iZWhhdmlvclxuICogQHJlcXVpcmVzIHJ1bnRpbWUtaGVscGVyXG4gKiBAcmVxdWlyZXMgcnVudGltZS1sb2dcbiAqIEBjbGFzcyBydW50aW1lLWNvbXBvbmVudFxuICogQHN0YXRpYyBcbiAqL1xuXG5cbi8qKlxuICogQ3JlYXRlIGEgY29tcG9uZW50IGZyb20gaXRzIGNvbmZpZ3VyYXRpb24uXG4gKiBAbWV0aG9kIGNyZWF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyA8YnI+XG4gKiB7U3RyaW5nfSBtb2RlbCBtb2RlbCBuYW1lIDxicj5cbiAqIEByZXR1cm4ge0NvbXBvbmVudH0gY29tcG9uZW50XG4gKi9cbmV4cG9ydHMuY3JlYXRlID0gY3JlYXRlO1xuXG5cbi8qKlxuICogR2V0IGEgY29tcG9uZW50IGJ5IGl0cyBpZC5cbiAqIEBtZXRob2QgZ2V0XG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIGNvbXBvbmVudFxuICogQHJldHVybiB7Q29tcG9uZW50fSBjb21wb25lbnRcbiAqL1xuZXhwb3J0cy5nZXQgPSBnZXQ7XG5cblxuLyoqXG4gKiBSZW1vdmUgYSBjb21wb25lbnQgd2l0aCBpdHMgaWQgZnJvbSB0aGUgbWVtb3J5LlxuICogQG1ldGhvZCByZW1vdmVGcm9tTWVtb3J5XG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIGNvbXBvbmVudFxuICovXG5leHBvcnRzLnJlbW92ZUZyb21NZW1vcnkgPSByZW1vdmVGcm9tTWVtb3J5O1xuXG5cbi8qKlxuICogUmVtb3ZlIGFsbCB0aGUgY29tcG9uZW50cyBzdG9yZSBpbiBtZW1vcnkuXG4gKiBAbWV0aG9kIGNsZWFyXG4gKi9cbmV4cG9ydHMuY2xlYXIgPSBjbGVhcjtcblxuXG4vKipcbiAqIERlc3Ryb3kgYSBjb21wb25lbnQgZnJvbSBpdHMgaWQuXG4gKiBAbWV0aG9kIGRlc3Ryb3lcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgY29tcG9uZW50IHRvIGRlc3Ryb3lcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGlmIHRoZSBjb21wb25lbnQgaGFzIGJlZW4gZGVzdHJveWVkXG4gKi9cbmV4cG9ydHMuZGVzdHJveSA9IGRlc3Ryb3k7IiwiLypcbiAqIFN5c3RlbSBSdW50aW1lXG4gKiBcbiAqIGh0dHBzOi8vZGVzaWduZmlyc3QuaW8vc3lzdGVtcnVudGltZS9cbiAqIFxuICogQ29weXJpZ2h0IDIwMTcgRXJ3YW4gQ2FycmlvdVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogVGhpcyBtb2R1bGUgbWFuYWdlcyBSdW50aW1lIGRhdGFiYXNlLiA8YnI+XG4gKiBSdW50aW1lIGRhdGFiYXNlIGlzIGEgbWljcm8gTm9TUUwgRGF0YWJhc2UgdGhhdCBjb250YWluczogPGJyPlxuICogLSBjb2xsZWN0aW9ucyB0byBzdG9yZSBkb2N1bWVudHMgKHNjaGVtYXMsIHR5cGVzLCBjb21wb25lbnRzLCAuLi4pIGFuZCA8YnI+XG4gKiAtIEFQSXMgdG8gaW1wb3J0IG9yIGV4cG9ydCBkb2N1bWVudHMuIDxicj5cbiAqIFxuICogUnVudGltZSBEYXRhYmFzZSBpcyBjbG9zZWx5IGxpbmtlZCB0byBSdW50aW1lIG1ldGFtb2RlbCBhbmQgUnVudGltZSBjb21wb25lbnRzIGJlY2F1c2U6IDxicj5cbiAqIC0gYWxsIG9wZXJhdGlvbnMgZG9uZSBieSBSdW50aW1lIGRhdGFiYXNlIG11c3QgYmUgY29tcGxpYW50IHdpdGggdGhlIG1vZGVsIGJlZm9yZSBiZWluZyBmaW5pc2hlZCwgPGJyPlxuICogLSBpbnNlcnQgb3BlcmF0aW9uIGF1dG9tYXRpY2FsbHkgY3JlYXRlcyBhIGNvbXBvbmVudCBhbmQgPGJyPlxuICogLSByZW1vdmUgb3BlcmF0aW9uIGF1dG9tYXRpY2FsbHkgZGVzdHJveSBhIGNvbXBvbmVudC5cbiAqICBcbiAqIEBtb2R1bGUgcnVudGltZVxuICogQHN1Ym1vZHVsZSBydW50aW1lLWRiXG4gKiBAcmVxdWlyZXMgcnVudGltZS1jb21wb25lbnRcbiAqIEByZXF1aXJlcyBydW50aW1lLWhlbHBlclxuICogQHJlcXVpcmVzIHJ1bnRpbWUtbG9nXG4gKiBAY2xhc3MgcnVudGltZS1kYlxuICogQHN0YXRpY1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyICRjb21wb25lbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudC5qcycpO1xudmFyICRtZXRhbW9kZWwgPSByZXF1aXJlKCcuL21ldGFtb2RlbC5qcycpO1xudmFyICRoZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlci5qcycpO1xudmFyICRsb2cgPSByZXF1aXJlKCcuL2xvZy5qcycpO1xudmFyICRiZWhhdmlvciA9IHJlcXVpcmUoJy4vYmVoYXZpb3IuanMnKTtcbnZhciAkc3RhdGUgPSByZXF1aXJlKCcuL3N0YXRlLmpzJyk7XG52YXIgJHdvcmtmbG93ID0gcmVxdWlyZSgnLi93b3JrZmxvdy5qcycpO1xuXG5cbi8qIFByaXZhdGUgcHJvcGVydGllcyAqL1xuXG5cbnZhciBzdG9yZSA9IHt9LFxuICAgIGNvbGxlY3Rpb25zID0gW10sXG4gICAgaW50ZXJuYWxEQiA9IFtcbiAgICAgICAgJ1J1bnRpbWUnLFxuICAgICAgICAnUnVudGltZVNjaGVtYScsXG4gICAgICAgICdSdW50aW1lTW9kZWwnLFxuICAgICAgICAnUnVudGltZUdlbmVyYXRlZE1vZGVsJyxcbiAgICAgICAgJ1J1bnRpbWVCZWhhdmlvcicsXG4gICAgICAgICdSdW50aW1lU3RhdGUnLFxuICAgICAgICAnUnVudGltZVR5cGUnLFxuICAgICAgICAnUnVudGltZU1ldGFtb2RlbCcsXG4gICAgICAgICdSdW50aW1lRGF0YWJhc2UnLFxuICAgICAgICAnUnVudGltZVN5c3RlbScsXG4gICAgICAgICdSdW50aW1lQ2xhc3NJbmZvJyxcbiAgICAgICAgJ1J1bnRpbWVNZXNzYWdlJyxcbiAgICAgICAgJ1J1bnRpbWVDaGFubmVsJyxcbiAgICAgICAgJ1J1bnRpbWVMb2dnZXInLFxuICAgICAgICAnUnVudGltZUxvZydcbiAgICBdLFxuICAgIGNvcmVEYiA9IFtcbiAgICAgICAgJ1J1bnRpbWVMb2cnLFxuICAgICAgICAnUnVudGltZVNjaGVtYScsXG4gICAgICAgICdSdW50aW1lTG9nZ2VyJyxcbiAgICAgICAgJ1J1bnRpbWVNb2RlbCcsXG4gICAgICAgICdSdW50aW1lR2VuZXJhdGVkTW9kZWwnLFxuICAgICAgICAnUnVudGltZVN0YXRlJyxcbiAgICAgICAgJ1J1bnRpbWVUeXBlJ1xuICAgIF0sXG4gICAgbG9nT3JkZXIgPSAwO1xuXG5cbi8qIFByaXZhdGUgbWV0aG9kcyAqL1xuXG5cbi8qXG4gKiBJbmNyZW1lbnQgTG9nXG4gKiBAbWV0aG9kIGluY0xvZ09yZGVyXG4gKi9cbmZ1bmN0aW9uIGluY0xvZ09yZGVyKCkge1xuICAgIHJldHVybiBsb2dPcmRlcisrO1xufVxuXG5cbi8qXG4gKiBEdW1wIHRoZSBkYXRhYmFzZS5cbiAqIEBtZXRob2QgZHVtcFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgZHVtcCBvZiB0aGUgZGF0YWJhc2UuIFRoZSBkdW1wIGlzIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zOiA8YnI+XG4gKiB7T2JqZWN0fSBzY2hlbWFzIHRoZSBzY2hlbWFzIHN0b3JlIGluIHRoZSBkYXRhYmFzZSA8YnI+XG4gKiB7T2JqZWN0fSB0eXBlcyB0aGUgdHlwZXMgc3RvcmUgaW4gdGhlIGRhdGFiYXNlIDxicj5cbiAqIHtPYmplY3R9IGJlaGF2aW9ycyB0aGUgYmVoYXZpb3JzIHN0b3JlIGluIHRoZSBkYXRhYmFzZSA8YnI+XG4gKiB7T2JqZWN0fSBjb21wb25lbnRzIHRoZSBjb21wb25lbnRzIHN0b3JlIGluIHRoZSBkYXRhYmFzZVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZHVtcCgpIHtcbiAgICB2YXIgZGJEdW1wID0ge30sXG4gICAgICAgIGNvbGxlY3Rpb25OYW1lID0gJycsXG4gICAgICAgIGJlaGF2aW9ySWQgPSAnJyxcbiAgICAgICAgdHlwZUlkID0gJycsXG4gICAgICAgIHR5cGUgPSBudWxsLFxuICAgICAgICBiZWhhdmlvciA9IG51bGwsXG4gICAgICAgIHNjaGVtYSA9IG51bGwsXG4gICAgICAgIG1vZGVsID0gbnVsbCxcbiAgICAgICAgY29sbGVjdGlvbiA9IG51bGwsXG4gICAgICAgIHNjaGVtYUlkID0gJycsXG4gICAgICAgIG1vZGVsSWQgPSAnJyxcbiAgICAgICAgbGVuZ3RoID0gMCxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIGlkID0gJyc7XG5cbiAgICAvLyBzY2hlbWFzXG4gICAgZGJEdW1wLnNjaGVtYXMgPSB7fTtcbiAgICBpZiAoZXhwb3J0cy5SdW50aW1lU2NoZW1hLmNvdW50KCkpIHtcbiAgICAgICAgZm9yIChzY2hlbWFJZCBpbiBzdG9yZS5SdW50aW1lU2NoZW1hKSB7XG4gICAgICAgICAgICBzY2hlbWEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHN0b3JlLlJ1bnRpbWVTY2hlbWFbc2NoZW1hSWRdKSk7XG4gICAgICAgICAgICBpZiAoIXNjaGVtYS5fY29yZSkge1xuICAgICAgICAgICAgICAgIGRiRHVtcC5zY2hlbWFzW3NjaGVtYUlkXSA9IHNjaGVtYTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIG1vZGVsc1xuICAgIGRiRHVtcC5tb2RlbHMgPSB7fTtcbiAgICBpZiAoZXhwb3J0cy5SdW50aW1lTW9kZWwuY291bnQoKSkge1xuICAgICAgICBmb3IgKG1vZGVsSWQgaW4gc3RvcmUuUnVudGltZU1vZGVsKSB7XG4gICAgICAgICAgICBtb2RlbCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoc3RvcmUuUnVudGltZU1vZGVsW21vZGVsSWRdKSk7XG4gICAgICAgICAgICBpZiAoIW1vZGVsLl9jb3JlKSB7XG4gICAgICAgICAgICAgICAgZGJEdW1wLm1vZGVsc1ttb2RlbElkXSA9IG1vZGVsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gdHlwZXNcbiAgICBkYkR1bXAudHlwZXMgPSB7fTtcbiAgICBpZiAoZXhwb3J0cy5SdW50aW1lVHlwZS5jb3VudCgpKSB7XG4gICAgICAgIGZvciAodHlwZUlkIGluIHN0b3JlLlJ1bnRpbWVUeXBlKSB7XG4gICAgICAgICAgICB0eXBlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzdG9yZS5SdW50aW1lVHlwZVt0eXBlSWRdKSk7XG4gICAgICAgICAgICBpZiAoIXR5cGUuY29yZSkge1xuICAgICAgICAgICAgICAgIGRiRHVtcC50eXBlc1t0eXBlLm5hbWVdID0gdHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGJlaGF2aW9yc1xuICAgIGRiRHVtcC5iZWhhdmlvcnMgPSB7fTtcbiAgICBmb3IgKGJlaGF2aW9ySWQgaW4gc3RvcmUuUnVudGltZUJlaGF2aW9yKSB7XG4gICAgICAgIGJlaGF2aW9yID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzdG9yZS5SdW50aW1lQmVoYXZpb3JbYmVoYXZpb3JJZF0pKTtcbiAgICAgICAgZGVsZXRlIGJlaGF2aW9yLmNsYXNzSW5mbztcblxuICAgICAgICBpZiAoIWJlaGF2aW9yLmNvcmUpIHtcbiAgICAgICAgICAgIGRiRHVtcC5iZWhhdmlvcnNbYmVoYXZpb3JJZF0gPSBiZWhhdmlvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbXBvbmVudHNcbiAgICBkYkR1bXAuY29tcG9uZW50cyA9IHt9O1xuICAgIGxlbmd0aCA9IGNvbGxlY3Rpb25zLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29sbGVjdGlvbk5hbWUgPSBjb2xsZWN0aW9uc1tpXTtcbiAgICAgICAgaWYgKGV4cG9ydHNbY29sbGVjdGlvbk5hbWVdLmNvdW50KCkpIHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHN0b3JlW2NvbGxlY3Rpb25OYW1lXSkpO1xuXG4gICAgICAgICAgICBmb3IgKGlkIGluIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgY29sbGVjdGlvbltpZF0uY2xhc3NJbmZvO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb25baWRdLl9jb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb2xsZWN0aW9uW2lkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhjb2xsZWN0aW9uKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBkYkR1bXAuY29tcG9uZW50c1tjb2xsZWN0aW9uTmFtZV0gPSBjb2xsZWN0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRiRHVtcDtcbn1cblxuXG4vKlxuICogVGVzdCBpZiBhbiBvYmplY3QgY29udGFpbnMgYW5vdGhlciBvbmUuXG4gKiBAbWV0aG9kIGNvbnRhaW5zXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIHNvdXJjZSBvYmplY3QgXG4gKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IHRhcmdldCBvYmplY3QgXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBzb3VyY2Ugb2JqZWN0IGNvbnRhaW5zIHRoZSB0YXJnZXQgb2JqZWN0XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjb250YWlucyhzb3VyY2UsIHRhcmdldCkge1xuICAgIHZhciByZXN1bHQgPSB0cnVlLFxuICAgICAgICBwcm9wZXJ0eSA9ICcnO1xuXG4gICAgZm9yIChwcm9wZXJ0eSBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXRbcHJvcGVydHldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWYgKHNvdXJjZVtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0W3Byb3BlcnR5XS5tYXRjaChzb3VyY2VbcHJvcGVydHldKSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0W3Byb3BlcnR5XSAhPT0gc291cmNlW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qKiBcbiAqIEEgY29sbGVjdGlvbiBvZiBkb2N1bWVudHMgbWFuYWdlZCBieSBSdW50aW1lLiA8YnI+XG4gKiBJbnRlcm5hbCBjb2xsZWN0aW9ucyBtYW5hZ2UgY29yZSBvYmplY3RzIG9mIFJ1bnRpbWUgKHNjaGVtYSwgdHlwZSwgLi4uKS4gPGJyPlxuICogUHVibGljIGNvbGxlY3Rpb25zIG1hbmFnZSBjb21wb25lbnRzIG9mIHRoZSBzYW1lIGNsYXNzLiA8YnI+XG4gKiBcbiAqIEBjbGFzcyBSdW50aW1lRGF0YWJhc2VDb2xsZWN0aW9uXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIG5ldyBjb2xsZWN0aW9uXG4gKi9cbnZhciBSdW50aW1lRGF0YWJhc2VDb2xsZWN0aW9uID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoJG1ldGFtb2RlbC5nZXRTY2hlbWEobmFtZSkgfHwgaW50ZXJuYWxEQi5pbmRleE9mKG5hbWUpICE9PSAtMSkge1xuICAgICAgICBzdG9yZVtuYW1lXSA9IHt9O1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICBpZiAoaW50ZXJuYWxEQi5pbmRleE9mKG5hbWUpID09PSAtMSkge1xuICAgICAgICAgICAgY29sbGVjdGlvbnMucHVzaChuYW1lKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgICRsb2cuaW52YWxpZENvbGxlY3Rpb25OYW1lKG5hbWUpO1xuICAgIH1cbn07XG5cblxuLyoqXG4gKiBGaW5kIGEgZG9jdW1lbnQgaW50byB0aGUgY29sbGVjdGlvbi5cbiAqIEBtZXRob2QgZmluZFxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IHF1ZXJ5XG4gKiBAcmV0dXJuIHtBcnJheX0gQXJyYXkgb2YgZG9jdW1lbnRzIHRoYXQgbWFwIHRoZSBxdWVyeVxuICogXG4gKiBAZXhhbXBsZSBcbiAqICRkYi5QZXJzb24uZmluZCh7XCJuYW1lXCI6IFwibGF1cmVcIn0pOyA8YnI+XG4gKiAkZGIuUGVyc29uLmZpbmQoe1wibmFtZVwiOiBcImxhdXJlXCIsIFwiYWdlXCIgOiAyNH0pOyA8YnI+XG4gKiAkZGIuUGVyc29uLmZpbmQoW3tcIm5hbWVcIjogXCJyZW5lXCJ9LCB7XCJuYW1lXCI6IFwicm9iZXJ0XCJ9XSk7XG4gKi9cblJ1bnRpbWVEYXRhYmFzZUNvbGxlY3Rpb24ucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiAocXVlcnkpIHtcbiAgICB2YXIgcmVzdWx0ID0gW10sXG4gICAgICAgIHJlc3VsdElkID0ge30sXG4gICAgICAgIGlkID0gJycsXG4gICAgICAgIG9iamVjdCA9IHt9O1xuXG4gICAgcXVlcnkgPSBxdWVyeSB8fCBudWxsO1xuXG4gICAgaWYgKHF1ZXJ5ICYmIE9iamVjdC5rZXlzKHF1ZXJ5KS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocXVlcnkpKSB7XG4gICAgICAgICAgICBxdWVyeS5mb3JFYWNoKGZ1bmN0aW9uIG11bHRpX3NlYXJjaChjcml0ZXJpYSkge1xuICAgICAgICAgICAgICAgIGZvciAoaWQgaW4gc3RvcmVbdGhpcy5uYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3QgPSBzdG9yZVt0aGlzLm5hbWVdW2lkXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5zKGNyaXRlcmlhLCBvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdElkW2lkXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChvYmplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdElkW2lkXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChpZCBpbiBzdG9yZVt0aGlzLm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0ID0gc3RvcmVbdGhpcy5uYW1lXVtpZF07XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5zKHF1ZXJ5LCBvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG9iamVjdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpZCBpbiBzdG9yZVt0aGlzLm5hbWVdKSB7XG4gICAgICAgICAgICBvYmplY3QgPSBzdG9yZVt0aGlzLm5hbWVdW2lkXTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG9iamVjdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vKipcbiAqIEluc2VydCBhbiBuZXcgZG9jdW1lbnQgaW50byB0aGUgY29sbGVjdGlvbi4gPGJyPlxuICogQmVmb3JlIGluc2VydGluZyB0aGUgZG9jdW1lbnQsIFJ1bnRpbWUgY2hlY2tzIHRoYXQgdGhlIGRvY3VtZW50IGlzIGNvbXBsaWFudFxuICogd2l0aCBpdHMgY2xhc3MgZGVmaW5pdGlvbi4gPGJyPiBcbiAqIFRoZW4sIGFmdGVyIGluc2VydGluZyBpdCwgd2UgY3JlYXRlIHRoZSBjb21wb25lbnQuXG4gKiBAbWV0aG9kIGluc2VydFxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGRvY3VtZW50IGEgbmV3IG9iamVjdCB0byBhZGRcbiAqIEByZXR1cm4ge0FycmF5fSBhcnJheSBvZiBpZCBjcmVhdGVkXG4gKiBcbiAqIEBleGFtcGxlIFxuICogJGRiLlBlcnNvbi5pbnNlcnQoezxicj5cbiAqICAgICAgXCJuYW1lXCI6IFwiYm9iXCIsIDxicj5cbiAqICAgICAgXCJmaXJzdE5hbWVcIjogXCJTYWludC1DbGFyXCIsIDxicj5cbiAqICAgICAgXCJhZ2VcIjogNDMgPGJyPlxuICogfSk7IDxicj5cbiAqL1xuUnVudGltZURhdGFiYXNlQ29sbGVjdGlvbi5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgdmFyIGRvYyA9IFtdLFxuICAgICAgICBDb21wb25lbnQgPSBudWxsLFxuICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGRvY3VtZW50KSkge1xuICAgICAgICBkb2MgPSBkb2N1bWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBkb2MucHVzaChkb2N1bWVudCk7XG4gICAgfVxuXG4gICAgZG9jLmZvckVhY2goZnVuY3Rpb24gbXVsdGlfaW5zZXJ0KG9iaikge1xuICAgICAgICB2YXIgY29tcG9uZW50ID0gbnVsbCxcbiAgICAgICAgICAgIGNoYW5uZWxzID0gW10sXG4gICAgICAgICAgICBjaGFubmVsID0gbnVsbCxcbiAgICAgICAgICAgIHN5c3RlbXMgPSBbXTtcblxuICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgIGNhc2UgdGhpcy5uYW1lID09PSAnUnVudGltZVNjaGVtYSc6XG4gICAgICAgICAgICBjYXNlIHRoaXMubmFtZSA9PT0gJ1J1bnRpbWVMb2dnZXInOlxuICAgICAgICAgICAgY2FzZSB0aGlzLm5hbWUgPT09ICdSdW50aW1lTW9kZWwnOlxuICAgICAgICAgICAgY2FzZSB0aGlzLm5hbWUgPT09ICdSdW50aW1lVHlwZSc6XG4gICAgICAgICAgICBjYXNlIHRoaXMubmFtZSA9PT0gJ1J1bnRpbWVHZW5lcmF0ZWRNb2RlbCc6XG4gICAgICAgICAgICBjYXNlICRtZXRhbW9kZWwuaXNWYWxpZE9iamVjdChvYmosICRtZXRhbW9kZWwuZ2V0TW9kZWwodGhpcy5uYW1lKSk6XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9iai5faWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iai5faWQgPSAkaGVscGVyLmdlbmVyYXRlSWQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkbWV0YW1vZGVsLnByZXBhcmVPYmplY3Qob2JqLCAkbWV0YW1vZGVsLmdldE1vZGVsKHRoaXMubmFtZSkpO1xuXG4gICAgICAgICAgICAgICAgc3RvcmVbdGhpcy5uYW1lXVtvYmouX2lkXSA9IG9iajtcblxuICAgICAgICAgICAgICAgIENvbXBvbmVudCA9ICRjb21wb25lbnQuZ2V0KHRoaXMubmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgPSBuZXcgQ29tcG9uZW50KG9iaik7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNvbXBvbmVudC5pZCgpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVMb2coJ2luc2VydCcsIHRoaXMubmFtZSwgb2JqLl9pZCwgJycsIG9iaik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCRoZWxwZXIuaXNSdW50aW1lKCkgJiYgJGhlbHBlci5nZXRSdW50aW1lKCkucmVxdWlyZSgnZGInKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGhlbHBlci5nZXRSdW50aW1lKCkucmVxdWlyZSgnZGInKS5pbnNlcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IHRoaXMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudDogb2JqXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm5hbWUgPT09ICdSdW50aW1lTWVzc2FnZScpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRoZWxwZXIuaXNSdW50aW1lKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5uZWxzID0gZXhwb3J0cy5SdW50aW1lQ2hhbm5lbC5maW5kKHt9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsZW5ndGggPSBjaGFubmVscy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbm5lbCA9ICRoZWxwZXIuZ2V0UnVudGltZSgpLnJlcXVpcmUoY2hhbm5lbHNbaV0uX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkd29ya2Zsb3cuc3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBvbmVudFwiOiBjaGFubmVsc1tpXS5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RhdGVcIjogb2JqLmV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGFcIjogb2JqLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAkbG9nLmludmFsaWREb2N1bWVudE9uRGJJbnNlcnQob2JqLCB0aGlzLm5hbWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5cbi8qKlxuICogVXBkYXRlIGRvY3VtZW50cyBpbnRvIGEgY29sbGVjdGlvbi5cbiAqIEBtZXRob2QgdXBkYXRlXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gcXVlcnkgcXVlcnkgdG8gZmluZCB0aGUgZG9jdW1lbnRzIHRvIHVwZGF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHVwZGF0ZSB1cGRhdGUgdG8gbWFrZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgXG4gKiB7Qm9vbGVhbn0gdXBzZXJ0IHRydWUgaWYgd2UgY3JlYXRlIGEgZG9jdW1lbnQgd2hlbiBubyBkb2N1bWVudCBpcyBmb3VuZCBieSB0aGUgcXVlcnlcbiAqIEByZXR1cm4ge051bWJlcn0gTnVtYmVyIG9mIGRvY3VtZW50cyB1cGRhdGVkXG4gKiBcbiAqIEBleGFtcGxlIFxuICogJGRiLkNhcnMudXBkYXRlKHtcImNvZGVcIjogXCJBWkQtNzFcIn0sIHtcInByaWNlXCI6IFwiMTAwMDAkXCJ9KTsgPGJyPlxuICogJGRiLkNhcnMudXBkYXRlKFt7XCJjb2RlXCI6IFwiQVpELTcxXCJ9LCB7XCJjb2RlXCI6IFwiQVpELTY1XCJ9XSwge1wicHJpY2VcIjogXCIxMDAwMCRcIn0pOyA8YnI+XG4gKiAkZGIuQ2Fycy51cGRhdGUoe1wiY29kZVwiOiBcIkFaRC03MVwifSwge1wicHJpY2VcIjogXCIxMDAwMCRcIn0sIHtcInVwc2VydFwiOiB0cnVlfSk7IDxicj5cbiAqL1xuUnVudGltZURhdGFiYXNlQ29sbGVjdGlvbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKHF1ZXJ5LCB1cGRhdGUsIG9wdGlvbnMpIHtcbiAgICB2YXIgZG9jcyA9IHRoaXMuZmluZChxdWVyeSksXG4gICAgICAgIHVwZGF0ZWQgPSAwLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gZG9jcy5sZW5ndGgsXG4gICAgICAgIGF0dHJpYnV0ZU5hbWUgPSAnJyxcbiAgICAgICAgc2NoZW1hID0gJG1ldGFtb2RlbC5nZXRNb2RlbCh0aGlzLm5hbWUpLFxuICAgICAgICB0eXBlID0gJyc7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMudXBzZXJ0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBvcHRpb25zLnVwc2VydCA9IG9wdGlvbnMudXBzZXJ0IHx8IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh1cGRhdGUpIHtcblxuICAgICAgICAvLyB1cHNlcnQgY2FzZVxuICAgICAgICBpZiAobGVuZ3RoID09PSAwICYmIG9wdGlvbnMudXBzZXJ0KSB7XG4gICAgICAgICAgICBpZiAocXVlcnkuX2lkKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlLl9pZCA9IHF1ZXJ5Ll9pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0KHVwZGF0ZSk7XG4gICAgICAgICAgICB1cGRhdGVkID0gdXBkYXRlZCArIDE7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8vIGNhc2Ugb2YgdXBkYXRlIG9mIF9pZFxuICAgICAgICAgICAgaWYgKHR5cGVvZiB1cGRhdGUuX2lkICE9PSAndW5kZWZpbmVkJyAmJiB1cGRhdGUuX2lkICE9PSBkb2NzW2ldLl9pZCkge1xuICAgICAgICAgICAgICAgICRsb2cudXBkYXRlVXVpZChkb2NzW2ldLl9pZCwgdXBkYXRlLl9pZCwgdHlwZW9mICRjb21wb25lbnQuZ2V0KHVwZGF0ZS5faWQpICE9PSAndW5kZWZpbmVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoYXR0cmlidXRlTmFtZSBpbiB1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRvY3NbaV1bYXR0cmlidXRlTmFtZV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5hbWUgIT09ICdSdW50aW1lU2NoZW1hJyAmJiB0aGlzLm5hbWUgIT09ICdSdW50aW1lTW9kZWwnICYmIHRoaXMubmFtZSAhPT0gJ1J1bnRpbWVHZW5lcmF0ZWRNb2RlbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVOYW1lLmluZGV4T2YoJ18nKSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSBzY2hlbWFbYXR0cmlidXRlTmFtZV0udHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRtZXRhbW9kZWwuZ2V0TWV0YURlZigpW2F0dHJpYnV0ZU5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSAkbWV0YW1vZGVsLmdldE1ldGFEZWYoKVthdHRyaWJ1dGVOYW1lXS50eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRtZXRhbW9kZWwuaXNWYWxpZFR5cGUodXBkYXRlW2F0dHJpYnV0ZU5hbWVdLCB0eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2NzW2ldW2F0dHJpYnV0ZU5hbWVdID0gdXBkYXRlW2F0dHJpYnV0ZU5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkID0gdXBkYXRlZCArIDE7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTG9nKCd1cGRhdGUnLCB0aGlzLm5hbWUsIGRvY3NbaV0uX2lkLCBhdHRyaWJ1dGVOYW1lLCB1cGRhdGVbYXR0cmlidXRlTmFtZV0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkaGVscGVyLmlzUnVudGltZSgpICYmICRoZWxwZXIuZ2V0UnVudGltZSgpLnJlcXVpcmUoJ2RiJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRoZWxwZXIuZ2V0UnVudGltZSgpLnJlcXVpcmUoJ2RiJykudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29sbGVjdGlvbic6IHRoaXMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaWQnOiBkb2NzW2ldLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZmllbGQnOiBhdHRyaWJ1dGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHVwZGF0ZVthdHRyaWJ1dGVOYW1lXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHdvcmtmbG93LnN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcG9uZW50XCI6IGRvY3NbaV0uX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdGF0ZVwiOiBhdHRyaWJ1dGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhXCI6IFt1cGRhdGVbYXR0cmlidXRlTmFtZV1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuaW52YWxpZFByb3BlcnR5VHlwZU9uRGJVcGRhdGUodGhpcy5uYW1lLCBkb2NzW2ldLl9pZCwgYXR0cmlidXRlTmFtZSwgdXBkYXRlW2F0dHJpYnV0ZU5hbWVdLCBzY2hlbWFbYXR0cmlidXRlTmFtZV0udHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9nLnVua25vd25Qcm9wZXJ0eU9uRGJVcGRhdGUodGhpcy5uYW1lLCBhdHRyaWJ1dGVOYW1lLCBkb2NzW2ldLl9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIG1vcmUgY2hlY2sgaW4gY2FzZSBvZiBzY2hlbWEgdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2NzW2ldW2F0dHJpYnV0ZU5hbWVdID0gdXBkYXRlW2F0dHJpYnV0ZU5hbWVdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVMb2coJ3VwZGF0ZScsIHRoaXMubmFtZSwgZG9jc1tpXS5faWQsIGF0dHJpYnV0ZU5hbWUsIHVwZGF0ZVthdHRyaWJ1dGVOYW1lXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWQgPSB1cGRhdGVkICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkaGVscGVyLmlzUnVudGltZSgpICYmICRoZWxwZXIuZ2V0UnVudGltZSgpLnJlcXVpcmUoJ2RiJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaGVscGVyLmdldFJ1bnRpbWUoKS5yZXF1aXJlKCdkYicpLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb2xsZWN0aW9uJzogdGhpcy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaWQnOiBkb2NzW2ldLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2ZpZWxkJzogYXR0cmlidXRlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogdXBkYXRlW2F0dHJpYnV0ZU5hbWVdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdXBkYXRlZDtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmUgYSBkb2N1bWVudCBmcm9tIHRoZSBjb2xsbGVjdGlvbi4gPGJyPlxuICogV2hlbiBhIGRvY3VtZW50IGlzIHJlbW92ZWQsIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLlxuICogQG1ldGhvZCByZW1vdmVcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBxdWVyeSBxdWVyeSB0byBmaW5kIHRoZSBkb2N1bWVudHMgdG8gcmVtb3ZlXG4gKiBAcmV0dXJuIHtBcnJheX0gbGlzdCBvZiBkb2N1bWVudHMgaWQgcmVtb3ZlZFxuICogXG4gKiBAZXhhbXBsZSBcbiAqICRkYi5DYXJzLnJlbW92ZSh7XCJjb2RlXCI6IFwiQVpELTcxXCJ9KTsgPGJyPlxuICogJGRiLkNhcnMucmVtb3ZlKFt7XCJjb2RlXCI6IFwiQVpELTcxXCJ9LCB7XCJjb2RlXCI6IFwiQVpELTY1XCJ9XSk7IDxicj5cbiAqL1xuUnVudGltZURhdGFiYXNlQ29sbGVjdGlvbi5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKHF1ZXJ5KSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdLFxuICAgICAgICBpZCA9ICcnLFxuICAgICAgICBjb21wb25lbnQgPSBudWxsLFxuICAgICAgICBvYmplY3QgPSB7fTtcblxuICAgIHF1ZXJ5ID0gcXVlcnkgfHwgbnVsbDtcblxuICAgIGlmIChxdWVyeSAmJiBPYmplY3Qua2V5cyhxdWVyeSkubGVuZ3RoKSB7XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocXVlcnkpKSB7XG4gICAgICAgICAgICBxdWVyeS5mb3JFYWNoKGZ1bmN0aW9uIG11bHRpX3JlbW92ZShjcml0ZXJpYSkge1xuICAgICAgICAgICAgICAgIGZvciAoaWQgaW4gc3RvcmVbdGhpcy5uYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3QgPSBzdG9yZVt0aGlzLm5hbWVdW2lkXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY29udGFpbnMoY3JpdGVyaWEsIG9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdG9yZVt0aGlzLm5hbWVdW2lkXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTG9nKCdyZW1vdmUnLCB0aGlzLm5hbWUsIGlkLCAnJywgJycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgPSAkY29tcG9uZW50LmdldChpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkaGVscGVyLmlzUnVudGltZSgpICYmICRoZWxwZXIuZ2V0UnVudGltZSgpLnJlcXVpcmUoJ2RiJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaGVscGVyLmdldFJ1bnRpbWUoKS5yZXF1aXJlKCdkYicpLnJlbW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb2xsZWN0aW9uJzogdGhpcy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaWQnOiBpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoaWQgaW4gc3RvcmVbdGhpcy5uYW1lXSkge1xuICAgICAgICAgICAgICAgIG9iamVjdCA9IHN0b3JlW3RoaXMubmFtZV1baWRdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5zKHF1ZXJ5LCBvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdG9yZVt0aGlzLm5hbWVdW2lkXTtcblxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVMb2coJ3JlbW92ZScsIHRoaXMubmFtZSwgaWQsICcnLCAnJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ID0gJGNvbXBvbmVudC5nZXQoaWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICgkaGVscGVyLmlzUnVudGltZSgpICYmICRoZWxwZXIuZ2V0UnVudGltZSgpLnJlcXVpcmUoJ2RiJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRoZWxwZXIuZ2V0UnVudGltZSgpLnJlcXVpcmUoJ2RiJykucmVtb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29sbGVjdGlvbic6IHRoaXMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaWQnOiBpZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaWQgaW4gc3RvcmVbdGhpcy5uYW1lXSkge1xuICAgICAgICAgICAgZGVsZXRlIHN0b3JlW3RoaXMubmFtZV1baWRdO1xuXG4gICAgICAgICAgICBjcmVhdGVMb2coJ3JlbW92ZScsIHRoaXMubmFtZSwgaWQsICcnLCAnJyk7XG5cbiAgICAgICAgICAgIGlmIChjb3JlRGIuaW5kZXhPZih0aGlzLm5hbWUpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50ID0gJGNvbXBvbmVudC5nZXQoaWQpO1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJGhlbHBlci5pc1J1bnRpbWUoKSAmJiAkaGVscGVyLmdldFJ1bnRpbWUoKS5yZXF1aXJlKCdkYicpKSB7XG4gICAgICAgICAgICAgICAgJGhlbHBlci5nZXRSdW50aW1lKCkucmVxdWlyZSgnZGInKS5yZW1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAnY29sbGVjdGlvbic6IHRoaXMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgJ2lkJzogaWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5cbi8qKlxuICogQ291bnQgdGhlIG51bWJlciBvZiBkb2N1bWVudHMgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKiBAbWV0aG9kIGNvdW50XG4gKiBAcmV0dXJuIHtOdW1iZXJ9IG51bWJlciBvZiBkb2N1bWVudHMgaW4gdGhlIGNvbGxlY3Rpb25cbiAqL1xuUnVudGltZURhdGFiYXNlQ29sbGVjdGlvbi5wcm90b3R5cGUuY291bnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCA9IDAsXG4gICAgICAgIG9iamVjdElkID0gJyc7XG4gICAgZm9yIChvYmplY3RJZCBpbiBzdG9yZVt0aGlzLm5hbWVdKSB7XG4gICAgICAgIHJlc3VsdCsrO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vKiBQdWJsaWMgbWV0aG9kcyAqL1xuXG5cbi8qXG4gKiBDcmVhdGUgYSBMb2dcbiAqIEBtZXRob2QgY3JlYXRlTG9nXG4gKiBAcGFyYW0ge1N0cmluZ30gYWN0aW9uIENSVUQgYWN0aW9uIHRoYXQgaGFwcGVubmVkXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sbGVjdGlvbiBjb2xsZWN0aW9uIG9mIHRoZSBcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGQgZmllbGQgb2YgdGhlIGNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIHZhbHVlIG9mIHRoZSBmaWVsZCBvZiB0aGUgY29tcG9uZW50XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUxvZyhhY3Rpb24sIGNvbGxlY3Rpb24sIGlkLCBmaWVsZCwgdmFsdWUpIHtcbiAgICB2YXIgbG9nSWQgPSAkaGVscGVyLmdlbmVyYXRlSWQoKTtcblxuICAgIGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uIHx8ICcnO1xuICAgIGlkID0gaWQgfHwgJyc7XG4gICAgZmllbGQgPSBmaWVsZCB8fCAnJztcbiAgICB2YWx1ZSA9IHZhbHVlIHx8ICcnO1xuXG4gICAgLy8gY2xlYW4gbG9nIGV2ZXJ5IDEwMDAgbG9nc1xuICAgIGlmIChPYmplY3Qua2V5cyhzdG9yZS5SdW50aW1lTG9nKS5sZW5ndGggPiAxMDAwKSB7XG4gICAgICAgIHN0b3JlLlJ1bnRpbWVMb2cgPSB7fTtcbiAgICB9XG5cbiAgICBzdG9yZS5SdW50aW1lTG9nW2xvZ0lkXSA9IHtcbiAgICAgICAgX2lkOiBsb2dJZCxcbiAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgIGNvbGxlY3Rpb246IGNvbGxlY3Rpb24sXG4gICAgICAgIGlkOiBpZCxcbiAgICAgICAgZmllbGQ6IGZpZWxkLFxuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIG9yZGVyOiBpbmNMb2dPcmRlcigpXG4gICAgfTtcbn1cblxuXG4vKlxuICogQ3JlYXRlIGEgbmV3IHt7I2Nyb3NzTGluayBcIlJ1bnRpbWVEYXRhYmFzZUNvbGxlY3Rpb25cIn19e3svY3Jvc3NMaW5rfX0uXG4gKiBAbWV0aG9kIGNvbGxlY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG9mIHRoZSBjb2xsZWN0aW9uXG4gKi9cbmZ1bmN0aW9uIGNvbGxlY3Rpb24obmFtZSkge1xuICAgIGV4cG9ydHNbbmFtZV0gPSBuZXcgUnVudGltZURhdGFiYXNlQ29sbGVjdGlvbihuYW1lKTtcbn1cblxuXG4vKlxuICogSW1wb3J0L0V4cG9ydCBhIFJ1bnRpbWUgc3lzdGVtIGludG8vZnJvbSB0aGUgZGF0YWJhc2VcbiAqIEBtZXRob2Qgc3lzdGVtXG4gKiBAcGFyYW0ge0pTT059IGltcG9ydGVkU3lzdGVtIGEgUnVudGltZSBzeXN0ZW0gdG8gaW1wb3J0XG4gKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBpZCBvZiB0aGUgaW1wb3J0ZWQgUnVudGltZSBzeXN0ZW0gb3IgdGhlIGlmIG9mIHRoZSBjdXJyZW50IFJ1bnRpbWUgc3lzdGVtXG4gKi9cbmZ1bmN0aW9uIHN5c3RlbShpbXBvcnRlZFN5c3RlbSkge1xuICAgIHZhciByZXN1bHQgPSAnJyxcbiAgICAgICAgY29sbGVjdGlvbk5hbWUgPSAnJyxcbiAgICAgICAgY29tcG9uZW50SWQgPSAnJyxcbiAgICAgICAgdHlwZU5hbWUgPSAnJyxcbiAgICAgICAgc2NoZW1hTmFtZSA9ICcnLFxuICAgICAgICBtb2RlbE5hbWUgPSAnJyxcbiAgICAgICAgYmVoYXZpb3JJZCA9ICcnLFxuICAgICAgICBzeXN0ZW1zID0gW10sXG4gICAgICAgIGlkID0gbnVsbCxcbiAgICAgICAgZGJEdW1wID0gbnVsbCxcbiAgICAgICAgbWFzdGVyc3lzdGVtID0gbnVsbCxcbiAgICAgICAgYmVoYXZpb3IgPSBudWxsLFxuICAgICAgICBleHBvcnRlZFN5c3RlbSA9IHt9O1xuXG4gICAgaWYgKGltcG9ydGVkU3lzdGVtKSB7IC8vIGltcG9ydFxuXG4gICAgICAgIC8vIGFkZCB0eXBlc1xuICAgICAgICBmb3IgKHR5cGVOYW1lIGluIGltcG9ydGVkU3lzdGVtLnR5cGVzKSB7XG4gICAgICAgICAgICAkbWV0YW1vZGVsLnR5cGUoaW1wb3J0ZWRTeXN0ZW0udHlwZXNbdHlwZU5hbWVdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkZCBzY2hlbWFzXG4gICAgICAgIGZvciAoc2NoZW1hTmFtZSBpbiBpbXBvcnRlZFN5c3RlbS5zY2hlbWFzKSB7XG4gICAgICAgICAgICAkbWV0YW1vZGVsLnNjaGVtYShpbXBvcnRlZFN5c3RlbS5zY2hlbWFzW3NjaGVtYU5hbWVdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkZCBtb2RlbHNcbiAgICAgICAgZm9yIChtb2RlbE5hbWUgaW4gaW1wb3J0ZWRTeXN0ZW0ubW9kZWxzKSB7XG4gICAgICAgICAgICAkbWV0YW1vZGVsLm1vZGVsKGltcG9ydGVkU3lzdGVtLm1vZGVsc1ttb2RlbE5hbWVdKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRtZXRhbW9kZWwuY3JlYXRlKCk7XG5cbiAgICAgICAgLy9hZGQgYmVoYXZpb3JzXG4gICAgICAgIGZvciAoYmVoYXZpb3JJZCBpbiBpbXBvcnRlZFN5c3RlbS5iZWhhdmlvcnMpIHtcbiAgICAgICAgICAgIGV4cG9ydHMuUnVudGltZUJlaGF2aW9yLmluc2VydChpbXBvcnRlZFN5c3RlbS5iZWhhdmlvcnNbYmVoYXZpb3JJZF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIGNvbXBvbmVudHNcbiAgICAgICAgZm9yIChjb2xsZWN0aW9uTmFtZSBpbiBpbXBvcnRlZFN5c3RlbS5jb21wb25lbnRzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbXBvbmVudElkIGluIGltcG9ydGVkU3lzdGVtLmNvbXBvbmVudHNbY29sbGVjdGlvbk5hbWVdKSB7XG4gICAgICAgICAgICAgICAgZXhwb3J0c1tjb2xsZWN0aW9uTmFtZV0uaW5zZXJ0KGltcG9ydGVkU3lzdGVtLmNvbXBvbmVudHNbY29sbGVjdGlvbk5hbWVdW2NvbXBvbmVudElkXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXNldCBpbmZvIGlmIGFscmVhZHkgYSBtYXN0ZXIgc3lzdGVtXG4gICAgICAgIHN5c3RlbXMgPSBleHBvcnRzLlJ1bnRpbWVTeXN0ZW0uZmluZCh7XG4gICAgICAgICAgICAnbWFzdGVyJzogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHN5c3RlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoc3lzdGVtc1swXS5faWQgPT09IGltcG9ydGVkU3lzdGVtLl9pZCkge1xuICAgICAgICAgICAgICAgIGltcG9ydGVkU3lzdGVtLm1hc3RlciA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGltcG9ydGVkU3lzdGVtLm1hc3RlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgc3lzdGVtc1swXS5tYXN0ZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGluc2VydCB0aGUgc3lzdGVtIGluIERCXG4gICAgICAgIGV4cG9ydHMuUnVudGltZVN5c3RlbS5pbnNlcnQoaW1wb3J0ZWRTeXN0ZW0pO1xuXG4gICAgICAgIHJlc3VsdCA9IGltcG9ydGVkU3lzdGVtLl9pZDtcblxuICAgIH0gZWxzZSB7IC8vIGV4cG9ydFxuICAgICAgICAvLyBnZXQgaWQgb2YgdGhlIG1hc3RlciBzeXN0ZW1cbiAgICAgICAgc3lzdGVtcyA9IGV4cG9ydHMuUnVudGltZVN5c3RlbS5maW5kKHtcbiAgICAgICAgICAgICdtYXN0ZXInOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzeXN0ZW1zLmxlbmd0aCkge1xuXG4gICAgICAgICAgICBtYXN0ZXJzeXN0ZW0gPSBzeXN0ZW1zWzBdO1xuICAgICAgICAgICAgaWQgPSBtYXN0ZXJzeXN0ZW0uX2lkO1xuXG4gICAgICAgICAgICAvLyBwcm9wXG4gICAgICAgICAgICBleHBvcnRlZFN5c3RlbS5faWQgPSBpZDtcbiAgICAgICAgICAgIGV4cG9ydGVkU3lzdGVtLm5hbWUgPSBtYXN0ZXJzeXN0ZW0ubmFtZTtcbiAgICAgICAgICAgIGV4cG9ydGVkU3lzdGVtLmRlc2NyaXB0aW9uID0gbWFzdGVyc3lzdGVtLmRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgZXhwb3J0ZWRTeXN0ZW0udmVyc2lvbiA9IG1hc3RlcnN5c3RlbS52ZXJzaW9uO1xuICAgICAgICAgICAgZXhwb3J0ZWRTeXN0ZW0ubWFzdGVyID0gdHJ1ZTtcbiAgICAgICAgICAgIGV4cG9ydGVkU3lzdGVtLnN1YnN5c3RlbSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBkdW1wXG4gICAgICAgICAgICBkYkR1bXAgPSBkdW1wKCk7XG4gICAgICAgICAgICBmb3IgKGNvbGxlY3Rpb25OYW1lIGluIGRiRHVtcCkge1xuICAgICAgICAgICAgICAgIGlmIChkYkR1bXAuaGFzT3duUHJvcGVydHkoY29sbGVjdGlvbk5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydGVkU3lzdGVtW2NvbGxlY3Rpb25OYW1lXSA9IGRiRHVtcFtjb2xsZWN0aW9uTmFtZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGJlaGF2aW9ySWQgaW4gZXhwb3J0ZWRTeXN0ZW0uYmVoYXZpb3JzKSB7XG4gICAgICAgICAgICAgICAgYmVoYXZpb3IgPSBleHBvcnRlZFN5c3RlbS5iZWhhdmlvcnNbYmVoYXZpb3JJZF07XG4gICAgICAgICAgICAgICAgaWYgKGJlaGF2aW9yLnN0YXRlID09PSAnbWFpbicgfHwgYmVoYXZpb3Iuc3RhdGUgPT09ICdzdGFydCcgfHwgYmVoYXZpb3Iuc3RhdGUgPT09ICdzdG9wJykge1xuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvci5jb21wb25lbnQgPSBpZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KGV4cG9ydGVkU3lzdGVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IFwie31cIjtcbiAgICAgICAgICAgICRsb2cubWFzdGVyU3lzdGVtTm90Rm91bmQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qXG4gKiBFeHBvcnQgYSBSdW50aW1lIHN1Yi1zeXN0ZW0uXG4gKiBAbWV0aG9kIHN1YnN5c3RlbVxuICogQHBhcmFtIHtKU09OfSBwYXJhbXMgcGFyYW1ldGVyc1xuICogQHJldHVybiB7U3RyaW5nfSBhIHN0cmluZ2lmaWVkIFJ1bnRpbWUgc3ViLXN5c3RlbVxuICogXG4gKiBAZXhhbXBsZVxuICogJGRiLnN1YnN5c3RlbSh7XCJzY2hlbWFzXCI6e1wibmFtZVwiOlwiUGVyc29uXCJ9fSk7IC8vIGZpbHRlciBleHBvcnQgb24gc2NoZW1hcyA8YnI+XG4gKiAkZGIuc3Vic3lzdGVtKHtcInR5cGVzXCI6e1wibmFtZVwiOlwiYWRkcmVzc1wifX0pOyAvLyBmaWx0ZXIgZXhwb3J0IG9uIHR5cGVzIDxicj5cbiAqICRkYi5zdWJzeXN0ZW0oe1wiYmVoYXZpb3JzXCI6e1wiY29tcG9uZW50XCI6XCJsYXVyZVwifX0pOyAvLyBmaWx0ZXIgZXhwb3J0IG9uIGJlaGF2aW9ycyA8YnI+XG4gKiAkZGIuc3Vic3lzdGVtKHtcImNvbXBvbmVudHNcIjp7XCJQZXJzb25cIjoge1wiY291bnRyeVwiOiBcIkZyYW5jZVwifX19KTsgLy8gZmlsdGVyIGV4cG9ydCBvbiBjb21wb25lbnRzIDxicj5cbiAqICRkYi5zdWJzeXN0ZW0oe1wic2NoZW1hc1wiOntcIm5hbWVcIjpcIlBlcnNvblwifSxcImNvbXBvbmVudHNcIjp7XCJQZXJzb25cIjoge1wiY291bnRyeVwiOiBcIkZyYW5jZVwifX19KTsgLy8gY29tYmluZSBmaWx0ZXJzXG4gKi9cbmZ1bmN0aW9uIHN1YnN5c3RlbShwYXJhbXMpIHtcbiAgICB2YXIgc3lzdGVtID0ge30sXG4gICAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgICBkZWZhdWx0TmFtZSA9ICcnLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gMCxcbiAgICAgICAgc2NoZW1hID0gbnVsbCxcbiAgICAgICAgdHlwZSA9IG51bGwsXG4gICAgICAgIG1vZGVsID0gbnVsbCxcbiAgICAgICAgYmVoYXZpb3IgPSBudWxsLFxuICAgICAgICBjb21wb25lbnQgPSBudWxsLFxuICAgICAgICBjbGFzc05hbWUgPSAnJztcblxuICAgIC8vIGRlZmF1bHQgdmFsdWVzXG4gICAgcmVzdWx0ID0gZXhwb3J0cy5SdW50aW1lU3lzdGVtLmZpbmQoe1xuICAgICAgICAnbWFzdGVyJzogdHJ1ZVxuICAgIH0pO1xuICAgIGlmIChyZXN1bHQubGVuZ3RoKSB7XG4gICAgICAgIGRlZmF1bHROYW1lID0gcmVzdWx0WzBdLm5hbWU7XG4gICAgfVxuXG4gICAgc3lzdGVtLm5hbWUgPSBwYXJhbXMubmFtZSB8fCAnc3ViXycgKyBkZWZhdWx0TmFtZTtcbiAgICBzeXN0ZW0udmVyc2lvbiA9IHBhcmFtcy52ZXJzaW9uIHx8ICcwLjAuMSc7XG4gICAgc3lzdGVtLmRlc2NyaXB0aW9uID0gcGFyYW1zLmRlc2NyaXB0aW9uIHx8ICcnO1xuXG4gICAgc3lzdGVtLnN1YnN5c3RlbSA9IHRydWU7XG5cbiAgICAvLyBzY2hlbWFzXG4gICAgc3lzdGVtLnNjaGVtYXMgPSB7fTtcbiAgICBpZiAocGFyYW1zLnNjaGVtYXMpIHtcbiAgICAgICAgcmVzdWx0ID0gZXhwb3J0cy5SdW50aW1lU2NoZW1hLmZpbmQocGFyYW1zLnNjaGVtYSk7XG5cbiAgICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzY2hlbWEgPSByZXN1bHRbaV07XG4gICAgICAgICAgICBpZiAoIXNjaGVtYS5fY29yZSkge1xuICAgICAgICAgICAgICAgIHN5c3RlbS5zY2hlbWFzW3NjaGVtYS5faWRdID0gc2NoZW1hO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gbW9kZWxzXG4gICAgc3lzdGVtLm1vZGVscyA9IHt9O1xuICAgIGlmIChwYXJhbXMubW9kZWxzKSB7XG4gICAgICAgIHJlc3VsdCA9IGV4cG9ydHMuUnVudGltZU1vZGVsLmZpbmQocGFyYW1zLm1vZGVscyk7XG5cbiAgICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBtb2RlbCA9IHJlc3VsdFtpXTtcbiAgICAgICAgICAgIGlmICghbW9kZWwuX2NvcmUpIHtcbiAgICAgICAgICAgICAgICBzeXN0ZW0ubW9kZWxzW21vZGVsLl9pZF0gPSBtb2RlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHR5cGVzXG4gICAgc3lzdGVtLnR5cGVzID0ge307XG4gICAgaWYgKHBhcmFtcy50eXBlcykge1xuICAgICAgICByZXN1bHQgPSBleHBvcnRzLlJ1bnRpbWVUeXBlLmZpbmQocGFyYW1zLnR5cGVzKTtcblxuICAgICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHR5cGUgPSByZXN1bHRbaV07XG4gICAgICAgICAgICBpZiAoIXR5cGUuX2NvcmUpIHtcbiAgICAgICAgICAgICAgICBzeXN0ZW0udHlwZXNbdHlwZS5faWRdID0gdHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGJlaGF2aW9yc1xuICAgIHN5c3RlbS5iZWhhdmlvcnMgPSB7fTtcbiAgICBpZiAocGFyYW1zLmJlaGF2aW9ycykge1xuICAgICAgICBiZWhhdmlvciA9IGV4cG9ydHMuUnVudGltZUJlaGF2aW9yLmZpbmQocGFyYW1zLmJlaGF2aW9ycyk7XG5cbiAgICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBiZWhhdmlvciA9IHJlc3VsdFtpXTtcbiAgICAgICAgICAgIGlmICghYmVoYXZpb3IuY29yZSkge1xuICAgICAgICAgICAgICAgIHN5c3RlbS5iZWhhdmlvcnNbYmVoYXZpb3IuX2lkXSA9IGJlaGF2aW9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY29tcG9uZW50c1xuICAgIHN5c3RlbS5jb21wb25lbnRzID0ge307XG4gICAgaWYgKHBhcmFtcy5jb21wb25lbnRzKSB7XG4gICAgICAgIGZvciAoY2xhc3NOYW1lIGluIHBhcmFtcy5jb21wb25lbnRzKSB7XG4gICAgICAgICAgICBpZiAoZXhwb3J0c1tjbGFzc05hbWVdKSB7XG4gICAgICAgICAgICAgICAgc3lzdGVtLmNvbXBvbmVudHNbY2xhc3NOYW1lXSA9IHt9O1xuXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZXhwb3J0c1tjbGFzc05hbWVdLmZpbmQocGFyYW1zLmNvbXBvbmVudHNbY2xhc3NOYW1lXSk7XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ID0gcmVzdWx0W2ldO1xuICAgICAgICAgICAgICAgICAgICBzeXN0ZW0uY29tcG9uZW50c1tjbGFzc05hbWVdW2NvbXBvbmVudC5faWRdID0gY29tcG9uZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzeXN0ZW0pO1xufVxuXG5cbi8qXG4gKiBDbGVhciB0aGUgZGF0YWJhc2UuXG4gKiBAbWV0aG9kIGNsZWFyXG4gKi9cbmZ1bmN0aW9uIGNsZWFyKCkge1xuICAgIHZhciBsZW5ndGggPSAwLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgY29sbGVjdGlvbk5hbWUgPSAnJztcblxuICAgIC8vIHJlbW92ZSBjb2xsZWN0aW9uc1xuICAgIGxlbmd0aCA9IGNvbGxlY3Rpb25zLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29sbGVjdGlvbk5hbWUgPSBjb2xsZWN0aW9uc1tpXTtcbiAgICAgICAgZXhwb3J0c1tjb2xsZWN0aW9uTmFtZV0ucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGludGVybmFsIGNvbGxlY3Rpb25zXG4gICAgbGVuZ3RoID0gaW50ZXJuYWxEQi5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbGxlY3Rpb25OYW1lID0gaW50ZXJuYWxEQltpXTtcbiAgICAgICAgZXhwb3J0c1tjb2xsZWN0aW9uTmFtZV0ucmVtb3ZlKCk7XG4gICAgfVxufVxuXG5cbi8qXG4gKiBJbml0IHRoZSBkYXRhYmFzZS5cbiAqIEBtZXRob2QgaW5pdFxuICovXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIHZhciBydW50aW1lU3lzdGVtSWQgPSAnJyxcbiAgICAgICAgcnVudGltZVN5c3RlbSA9IG51bGw7XG5cbiAgICBydW50aW1lU3lzdGVtID0gZXhwb3J0cy5SdW50aW1lU3lzdGVtLmZpbmQoe1xuICAgICAgICAnX2lkJzogJ2U4OWM2MTdiNmIxNWQyNCdcbiAgICB9KVswXTtcblxuICAgIC8vIGNsZWFyIGFsbCB0aGUgZGF0YSBpbiBtZW1vcnlcbiAgICBleHBvcnRzLmNsZWFyKCk7XG4gICAgJGNvbXBvbmVudC5jbGVhcigpO1xuICAgICRtZXRhbW9kZWwuY2xlYXIoKTtcbiAgICAkc3RhdGUuY2xlYXIoKTtcbiAgICAkYmVoYXZpb3IuY2xlYXIoKTtcblxuICAgIC8vIGluaXQgbWV0YW1vZGVsXG4gICAgJG1ldGFtb2RlbC5pbml0KCk7XG5cbiAgICAvLyByZWltcG9ydCBSdW50aW1lIGNvcmUgc3lzdGVtXG4gICAgcnVudGltZVN5c3RlbUlkID0gZXhwb3J0cy5zeXN0ZW0ocnVudGltZVN5c3RlbSk7XG4gICAgJGNvbXBvbmVudC5nZXQocnVudGltZVN5c3RlbUlkKS5tYWluKCk7XG59XG5cblxuLyogZXhwb3J0cyAqL1xuXG5cbi8qKlxuICogVGhpcyBtb2R1bGUgbWFuYWdlcyBSdW50aW1lIGRhdGFiYXNlLiA8YnI+XG4gKiBSdW50aW1lIGRhdGFiYXNlIGlzIGEgbWljcm8gTm9TUUwgRGF0YWJhc2UgdGhhdCBjb250YWluczogPGJyPlxuICogLSBjb2xsZWN0aW9ucyB0byBzdG9yZSBkb2N1bWVudHMgKHNjaGVtYXMsIHR5cGVzLCBjb21wb25lbnRzLCAuLi4pIGFuZCA8YnI+XG4gKiAtIEFQSXMgdG8gaW1wb3J0IG9yIGV4cG9ydCBkb2N1bWVudHMuIDxicj5cbiAqIFxuICogUnVudGltZSBkYXRhYmFzZSBpcyBjbG9zZWx5IGxpbmtlZCB0byBSdW50aW1lIG1ldGFtb2RlbCBiZWNhdXNlOiA8YnI+XG4gKiAtIGFsbCBvcGVyYXRpb25zIGRvbmUgYnkgUnVudGltZSBkYXRhYmFzZSBtdXN0IGJlIGNvbXBsaWFudCB3aXRoIHRoZSBtb2RlbCBiZWZvcmUgYmVpbmcgZmluaXNoZWQsIDxicj5cbiAqIC0gaW5zZXJ0IG9wZXJhdGlvbiBhdXRvbWF0aWNhbGx5IGNyZWF0ZXMgYSBjb21wb25lbnQgYW5kIDxicj5cbiAqIC0gcmVtb3ZlIG9wZXJhdGlvbiBhdXRvbWF0aWNhbGx5IGRlc3Ryb3kgYSBjb21wb25lbnQuXG4gKiAgIFxuICogQG1vZHVsZSBydW50aW1lXG4gKiBAc3VibW9kdWxlIHJ1bnRpbWUtZGJcbiAqIEByZXF1aXJlcyBydW50aW1lLWNvbXBvbmVudFxuICogQHJlcXVpcmVzIHJ1bnRpbWUtaGVscGVyXG4gKiBAcmVxdWlyZXMgcnVudGltZS1sb2dcbiAqIEBjbGFzcyBydW50aW1lLWRiXG4gKiBAc3RhdGljXG4gKi9cblxuXG4vKipcbiAqIENyZWF0ZSBhIExvZ1xuICogQG1ldGhvZCBjcmVhdGVMb2dcbiAqIEBwYXJhbSB7U3RyaW5nfSBhY3Rpb24gQ1JVRCBhY3Rpb24gdGhhdCBoYXBwZW5uZWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb2xsZWN0aW9uIGNvbGxlY3Rpb24gb2YgdGhlIFxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjb21wb25lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZCBmaWVsZCBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgdmFsdWUgb2YgdGhlIGZpZWxkIG9mIHRoZSBjb21wb25lbnRcbiAqL1xuZXhwb3J0cy5jcmVhdGVMb2cgPSBjcmVhdGVMb2c7XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IHt7I2Nyb3NzTGluayBcIlJ1bnRpbWVEYXRhYmFzZUNvbGxlY3Rpb25cIn19e3svY3Jvc3NMaW5rfX0uXG4gKiBAbWV0aG9kIGNvbGxlY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG9mIHRoZSBjb2xsZWN0aW9uXG4gKi9cbmV4cG9ydHMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb247XG5cblxuLyoqXG4gKiBSdW50aW1lIGRhdGFiYXNlIHN0b3JlIHRoYXQgbGlzdHMgYWxsIHRoZSBjb2xsZWN0aW9ucy5cbiAqIEBwcm9wZXJ0eSB7SlNPTn0gc3RvcmVcbiAqL1xuZXhwb3J0cy5zdG9yZSA9IHN0b3JlO1xuXG5cbi8qKlxuICogSW1wb3J0L0V4cG9ydCBhIFJ1bnRpbWUgc3lzdGVtIGludG8vZnJvbSB0aGUgZGF0YWJhc2UuXG4gKiBAbWV0aG9kIHN5c3RlbVxuICogQHBhcmFtIHtKU09OfSBpbXBvcnRlZFN5c3RlbSBhIFJ1bnRpbWUgc3lzdGVtIHRvIGltcG9ydFxuICogQHJldHVybiB7U3RyaW5nfSB0aGUgaWQgb2YgdGhlIGltcG9ydGVkIFJ1bnRpbWUgc3lzdGVtIG9yIHRoZSBjdXJyZW50IFJ1bnRpbWUgc3lzdGVtICBcbiAqL1xuZXhwb3J0cy5zeXN0ZW0gPSBzeXN0ZW07XG5cblxuLyoqXG4gKiBFeHBvcnQgYSBSdW50aW1lIHN1Yi1zeXN0ZW0uXG4gKiBAbWV0aG9kIHN1YnN5c3RlbVxuICogQHBhcmFtIHtKU09OfSBwYXJhbXMgcGFyYW1ldGVyc1xuICogQHJldHVybiB7U3RyaW5nfSBhIHN0cmluZ2lmaWVkIFJ1bnRpbWUgc3ViLXN5c3RlbVxuICogXG4gKiBAZXhhbXBsZVxuICogJGRiLnN1YnN5c3RlbSh7XCJzY2hlbWFzXCI6e1wibmFtZVwiOlwiUGVyc29uXCJ9fSk7IC8vIGZpbHRlciBleHBvcnQgb24gc2NoZW1hcyA8YnI+XG4gKiAkZGIuc3Vic3lzdGVtKHtcInR5cGVzXCI6e1wibmFtZVwiOlwiYWRkcmVzc1wifX0pOyAvLyBmaWx0ZXIgZXhwb3J0IG9uIHR5cGVzIDxicj5cbiAqICRkYi5zdWJzeXN0ZW0oe1wiYmVoYXZpb3JzXCI6e1wiY29tcG9uZW50XCI6XCJsYXVyZVwifX0pOyAvLyBmaWx0ZXIgZXhwb3J0IG9uIGJlaGF2aW9ycyA8YnI+XG4gKiAkZGIuc3Vic3lzdGVtKHtcImNvbXBvbmVudHNcIjp7XCJQZXJzb25cIjoge1wiY291bnRyeVwiOiBcIkZyYW5jZVwifX19KTsgLy8gZmlsdGVyIGV4cG9ydCBvbiBjb21wb25lbnRzIDxicj5cbiAqICRkYi5zdWJzeXN0ZW0oe1wic2NoZW1hc1wiOntcIm5hbWVcIjpcIlBlcnNvblwifSxcImNvbXBvbmVudHNcIjp7XCJQZXJzb25cIjoge1wiY291bnRyeVwiOiBcIkZyYW5jZVwifX19KTsgLy8gY29tYmluZSBmaWx0ZXJzXG4gKi9cbmV4cG9ydHMuc3Vic3lzdGVtID0gc3Vic3lzdGVtO1xuXG5cbi8qKlxuICogQ2xlYXIgdGhlIGRhdGFiYXNlLlxuICogQG1ldGhvZCBjbGVhclxuICovXG5leHBvcnRzLmNsZWFyID0gY2xlYXI7XG5cblxuLyoqXG4gKiBJbml0IHRoZSBkYXRhYmFzZS5cbiAqIEBtZXRob2QgaW5pdFxuICovXG5leHBvcnRzLmluaXQgPSBpbml0OyIsIi8qXG4gKiBTeXN0ZW0gUnVudGltZVxuICogXG4gKiBodHRwczovL2Rlc2lnbmZpcnN0LmlvL3N5c3RlbXJ1bnRpbWUvXG4gKiBcbiAqIENvcHlyaWdodCAyMDE3IEVyd2FuIENhcnJpb3VcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIGFsbCB0aGUgZnVuY3Rpb25zIHVzZWQgYnkgYWxsIHRoZSBtb2R1bGVzLlxuICogXG4gKiBAbW9kdWxlIHJ1bnRpbWVcbiAqIEBzdWJtb2R1bGUgcnVudGltZS1oZWxwZXJcbiAqIEByZXF1aXJlcyBydW50aW1lLWRiXG4gKiBAcmVxdWlyZXMgcnVudGltZS1jb21wb25lbnRcbiAqIEBjbGFzcyBydW50aW1lLWhlbHBlclxuICogQHN0YXRpY1xuICovXG5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgJGRiID0gcmVxdWlyZSgnLi9kYi5qcycpO1xudmFyICRjb21wb25lbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudC5qcycpO1xuXG5cbi8qIFByaXZhdGUgcHJvcGVydHkgKi9cblxuXG52YXIgcnVudGltZVJlZiA9IG51bGw7XG5cblxuLyogUHVibGljIG1ldGhvZCAqL1xuXG5cbi8qXG4gKiBDaGVjayBpZiBhIFJ1bnRpbWUgaW5zdGFuY2UgZXhpc3RzLlxuICogQG1ldGhvZCBpc1J1bnRpbWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgYSBSdW50aW1lIGluc3RhbmNlIGV4aXN0XG4gKi9cbmZ1bmN0aW9uIGlzUnVudGltZSgpIHtcbiAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG5cbiAgICBpZiAoJGRiLlJ1bnRpbWUgJiYgJGRiLlJ1bnRpbWUuZmluZCgpLmxlbmd0aCkge1xuICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cblxuLypcbiAqIEdldCB0aGUgUnVudGltZSBpbnN0YW5jZS5cbiAqIEBtZXRob2QgZ2V0UnVudGltZVxuICogQHJldHVybiB7UnVudGltZX0gUnVudGltZSBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBnZXRSdW50aW1lKCkge1xuICAgIHZhciBydW50aW1lSWQgPSAnJyxcbiAgICAgICAgcmVzdWx0ID0gbnVsbDtcblxuICAgIGlmICghcnVudGltZVJlZikge1xuICAgICAgICBydW50aW1lSWQgPSAkZGIuUnVudGltZS5maW5kKClbMF0uX2lkO1xuICAgICAgICBydW50aW1lUmVmID0gJGNvbXBvbmVudC5nZXQocnVudGltZUlkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcnVudGltZVJlZjtcbn1cblxuXG4vKlxuICogR2VuZXJhdGUgYSB1dWlkLlxuICogQG1ldGhvZCBnZW5lcmF0ZUlkXG4gKiBAcmV0dXJuIHtTdHJpbmd9IGEgdXVpZFxuICovXG5mdW5jdGlvbiBnZW5lcmF0ZUlkKCkge1xuICAgIGZ1bmN0aW9uIGdlbigpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApLnRvU3RyaW5nKDE2KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0UHJlZml4KCkge1xuICAgICAgICB2YXIgdmFsaWRQcmVmaXggPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonO1xuICAgICAgICByZXR1cm4gdmFsaWRQcmVmaXguY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHZhbGlkUHJlZml4Lmxlbmd0aCkpO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gZ2V0UHJlZml4KCkgKyBnZW4oKSArIGdlbigpICsgZ2VuKCk7XG59XG5cblxuLypcbiAqIEFkZCBQb2x5ZmlsbFxuICogQG1ldGhvZCBwb2x5ZmlsbFxuICovXG5mdW5jdGlvbiBwb2x5ZmlsbCgpIHtcblxuICAgIC8vIGZpeGluZyBjb25zdHJ1Y3Rvci5uYW1lIHByb3BlcnR5IGluIElFXG4gICAgLy8gdGFrZW4gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI1MTQwNzIzL2NvbnN0cnVjdG9yLW5hbWUtaXMtdW5kZWZpbmVkLWluLWludGVybmV0LWV4cGxvcmVyXG4gICAgaWYgKEZ1bmN0aW9uLnByb3RvdHlwZS5uYW1lID09PSB1bmRlZmluZWQgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgJ25hbWUnLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBmdW5jTmFtZVJlZ2V4ID0gL2Z1bmN0aW9uXFxzKFteKF17MSx9KVxcKC87XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSAoZnVuY05hbWVSZWdleCkuZXhlYygodGhpcykudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChyZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID4gMSkgPyByZXN1bHRzWzFdLnRyaW0oKSA6IFwiXCI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuXG4vKiBleHBvcnRzICovXG5cblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBjb250YWlucyBhbGwgdGhlIGZ1bmN0aW9ucyB1c2VkIGJ5IGFsbCB0aGUgbW9kdWxlcy5cbiAqIFxuICogQG1vZHVsZSBydW50aW1lXG4gKiBAc3VibW9kdWxlIHJ1bnRpbWUtaGVscGVyXG4gKiBAcmVxdWlyZXMgcnVudGltZS1kYlxuICogQHJlcXVpcmVzIHJ1bnRpbWUtY29tcG9uZW50XG4gKiBAY2xhc3MgcnVudGltZS1oZWxwZXJcbiAqIEBzdGF0aWNcbiAqL1xuXG5cbi8qKlxuICogR2V0IFJ1bnRpbWUgaW5zdGFuY2UuXG4gKiBAbWV0aG9kIGdldFJ1bnRpbWVcbiAqIEByZXR1cm4ge1J1bnRpbWV9IFJ1bnRpbWUgaW5zdGFuY2VcbiAqL1xuZXhwb3J0cy5nZXRSdW50aW1lID0gZ2V0UnVudGltZTtcblxuXG4vKipcbiAqIENoZWNrIGlmIGEgUnVudGltZSBpbnN0YW5jZSBleGlzdHMuXG4gKiBAbWV0aG9kIGlzUnVudGltZVxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBhIFJ1bnRpbWUgaW5zdGFuY2UgZXhpc3RcbiAqL1xuZXhwb3J0cy5pc1J1bnRpbWUgPSBpc1J1bnRpbWU7XG5cblxuLyoqXG4gKiBHZW5lcmF0ZSBhIHV1aWQuXG4gKiBAbWV0aG9kIGdlbmVyYXRlSWRcbiAqIEByZXR1cm4ge1N0cmluZ30gYSB1dWlkXG4gKi9cbmV4cG9ydHMuZ2VuZXJhdGVJZCA9IGdlbmVyYXRlSWQ7XG5cblxuLyoqXG4gKiBBZGQgUG9seWZpbGxcbiAqIEBtZXRob2QgcG9seWZpbGxcbiAqL1xuZXhwb3J0cy5wb2x5ZmlsbCA9IHBvbHlmaWxsOyIsIi8qXG4gKiBTeXN0ZW0gUnVudGltZVxuICogXG4gKiBodHRwczovL2Rlc2lnbmZpcnN0LmlvL3N5c3RlbXJ1bnRpbWUvXG4gKiBcbiAqIENvcHlyaWdodCAyMDE3IEVyd2FuIENhcnJpb3VcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIGFsbCB0aGUgZnVuY3Rpb25zIHRoYXQgd3JpdGUgYSBsb2cuXG4gKiBcbiAqIEBtb2R1bGUgcnVudGltZVxuICogQHN1Ym1vZHVsZSBydW50aW1lLWxvZ1xuICogQHJlcXVpcmVzIHJ1bnRpbWUtaGVscGVyXG4gKiBAY2xhc3MgcnVudGltZS1sb2dcbiAqIEBzdGF0aWNcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cblxudmFyICRoZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlci5qcycpO1xudmFyICR3b3JrZmxvdyA9IHJlcXVpcmUoJy4vd29ya2Zsb3cuanMnKTtcbnZhciAkbWV0YW1vZGVsID0gcmVxdWlyZSgnLi9tZXRhbW9kZWwuanMnKTtcbnZhciAkZGIgPSByZXF1aXJlKCcuL2RiLmpzJyk7XG52YXIgJGNvbXBvbmVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50LmpzJyk7XG5cbi8qIFByaXZhdGUgcHJvcGVydGllcyAqL1xuXG5cbnZhciBJRCA9ICdfaWQnLFxuICAgIE5BTUUgPSAnX25hbWUnLFxuICAgIGN1cnJlbnRMZXZlbCA9ICd3YXJuJyxcbiAgICBsb2dnZXJSZWYgPSBudWxsLFxuICAgIGZha2VMb2dnZXJSZWYgPSB7XG4gICAgICAgIGN1cnJlbnRMZXZlbDogJ3dhcm4nLFxuICAgICAgICBsZXZlbDogZnVuY3Rpb24gZGVidWcobGV2ZWxOYW1lKSB7XG4gICAgICAgICAgICBpZiAobGV2ZWxOYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TGV2ZWwgPSBsZXZlbE5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50TGV2ZWw7XG4gICAgICAgIH0sXG4gICAgICAgIGRlYnVnOiBmdW5jdGlvbiBkZWJ1ZyhtZXNzYWdlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50TGV2ZWwgPT09ICdkZWJ1ZycpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncnVudGltZTogJyArIG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBpbmZvOiBmdW5jdGlvbiBpbmZvKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRMZXZlbCA9PT0gJ2luZm8nIHx8IHRoaXMuY3VycmVudExldmVsID09PSAnZGVidWcnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKCdydW50aW1lOiAnICsgbWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHdhcm46IGZ1bmN0aW9uIHdhcm5pbmcobWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudExldmVsID09PSAnaW5mbycgfHwgdGhpcy5jdXJyZW50TGV2ZWwgPT09ICd3YXJuJyB8fCB0aGlzLmN1cnJlbnRMZXZlbCA9PT0gJ2RlYnVnJykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybigncnVudGltZTogJyArIG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gZXJyb3IobWVzc2FnZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcigncnVudGltZTogJyArIG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfTtcblxuLypcbiAqIEdldCB0aGUgUnVudGltZUxvZ2dlciBpbnN0YW5jZS5cbiAqIEBtZXRob2QgZ2V0TG9nZ2VyXG4gKiBAcmV0dXJuIHtSdW50aW1lTG9nZ2VyfSBSdW50aW1lTG9nZ2VyIGluc3RhbmNlXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBnZXRMb2dnZXIoKSB7XG4gICAgdmFyIGxvZ2dlcklkID0gJycsXG4gICAgICAgIGxvZ2dlcnMgPSBbXSxcbiAgICAgICAgcmVzdWx0ID0gbnVsbDtcblxuICAgIGlmICghJG1ldGFtb2RlbC5nZXRNb2RlbCgnUnVudGltZUxvZ2dlcicpKSB7XG4gICAgICAgIHJlc3VsdCA9IGZha2VMb2dnZXJSZWY7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbG9nZ2VycyA9ICRkYi5SdW50aW1lTG9nZ2VyLmZpbmQoKTtcbiAgICAgICAgaWYgKGxvZ2dlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBsb2dnZXJJZCA9IGxvZ2dlcnNbMF1bSURdO1xuXG4gICAgICAgICAgICBpZiAoJGNvbXBvbmVudC5nZXQobG9nZ2VySWQpKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyUmVmID0gJGNvbXBvbmVudC5nZXQobG9nZ2VySWQpO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGxvZ2dlclJlZjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFrZUxvZ2dlclJlZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZha2VMb2dnZXJSZWY7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qIFB1YmxpYyBtZXRob2RzICovXG5cblxuLypcbiAqIFNldCB0aGUgbGV2ZWwgb2YgdGhlIGxvZy5cbiAqIEBtZXRob2QgbGV2ZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBsZXZlbE5hbWUgbmFtZSBvZiB0aGUgbGV2ZWxcbiAqL1xuZnVuY3Rpb24gbGV2ZWwobGV2ZWxOYW1lKSB7XG4gICAgY3VycmVudExldmVsID0gbGV2ZWxOYW1lO1xufVxuXG5cbi8qXG4gKiBBIHByb3BlcnR5IG9mIGEgc2NoZW1hIGlzIHVua25vd24uXG4gKiBAbWV0aG9kIHVua25vd25Qcm9wZXJ0eVxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5TmFtZSB0aGUgbmFtZSBvZiB0aGUgcHJvcGVydHlcbiAqIEBwYXJhbSB7T2JqZWN0fSBzY2hlbWEgdGhlIHNjaGVtYSBkZWZpbml0aW9uXG4gKi9cbmZ1bmN0aW9uIHVua25vd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIHNjaGVtYSkge1xuICAgIHZhciBtZXNzYWdlID0gJyc7XG5cbiAgICBpZiAoc2NoZW1hW05BTUVdKSB7XG4gICAgICAgIG1lc3NhZ2UgPSBcInVua25vd24gcHJvcGVydHkgJ1wiICsgcHJvcGVydHlOYW1lICsgXCInIGZvciB0aGUgZGVmaW5pdGlvbiBvZiAnXCIgKyBzY2hlbWFbTkFNRV0gKyBcIidcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBtZXNzYWdlID0gXCJ1bmtub3duIHByb3BlcnR5ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJyBmb3IgYSBtb2RlbFwiO1xuICAgIH1cblxuICAgIGdldExvZ2dlcigpLndhcm4obWVzc2FnZSk7XG59XG5cblxuLypcbiAqIEludmFsaWQgdHlwZSBmb3IgYSBwcm9wZXJ0eS5cbiAqIEBtZXRob2QgaW52YWxpZFByb3BlcnR5VHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5TmFtZSBuYW1lIG9mIHRoZSBwZXJvcGV0eVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgdGhlIHR5cGUgZGVmaW5lZCBieSB0aGUgc2NoZW1hXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHkgdGhlIHByb3BlcnR5XG4gKi9cbmZ1bmN0aW9uIGludmFsaWRQcm9wZXJ0eVR5cGUocHJvcGVydHlOYW1lLCB0eXBlLCBwcm9wZXJ0eSkge1xuICAgIGdldExvZ2dlcigpLndhcm4oXCJpbnZhbGlkIHR5cGUgZm9yIHByb3BlcnR5ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJzogZXhwZWN0ZWQgdHlwZSAnXCIgKyB0eXBlICsgXCInIGluc3RlYWQgb2YgdHlwZSAnXCIgKyB0eXBlb2YgcHJvcGVydHkgKyBcIidcIik7XG59XG5cblxuLypcbiAqIEludmFsaWQgdmFsdWUgZm9yIHR5cGUgZW51bS5cbiAqIEBtZXRob2QgaW52YWxpZEVudW1WYWx1ZVxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIHRoZSB2YWx1ZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgdGhlIHR5cGUgZGVmaW5lZCBieSB0aGUgc2NoZW1hXG4gKi9cbmZ1bmN0aW9uIGludmFsaWRFbnVtVmFsdWUodmFsdWUsIHR5cGUpIHtcbiAgICBnZXRMb2dnZXIoKS53YXJuKFwiJ1wiICsgdmFsdWUgKyBcIicgaXMgYW4gaW52YWxpZCB2YWx1ZSBmb3IgdGhlIHR5cGUgZW51bSAnXCIgKyB0eXBlICsgXCInXCIpO1xufVxuXG5cbi8qXG4gKiBJbnZhbGlkIGNsYXNzIG5hbWUgZm9yIGEgY29tcG9uZW50LlxuICogQG1ldGhvZCBpbnZhbGlkQ2xhc3NOYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gY29tcG9uZW50SWQgaWQgb2YgdGhlIGNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgdGhlIHR5cGUgZGVmaW5lZCBieSB0aGUgc2NoZW1hXG4gKiBAcGFyYW0ge1N0cmluZ30gY29uc3RydWN0b3JOYW1lIG5hbWUgb2YgdGhlIGNvbXBvbmVudCBjbGFzc1xuICovXG5mdW5jdGlvbiBpbnZhbGlkQ2xhc3NOYW1lKGNvbXBvbmVudElkLCB0eXBlLCBjb25zdHJ1Y3Rvck5hbWUpIHtcbiAgICBnZXRMb2dnZXIoKS53YXJuKFwiaW52YWxpZCBjbGFzcyBuYW1lIGZvciBjb21wb25lbnQgJ1wiICsgY29tcG9uZW50SWQgKyBcIic6IGV4cGVjdGVkICdcIiArIHR5cGUgKyBcIicgaW5zdGVhZCBvZiAnXCIgKyBjb25zdHJ1Y3Rvck5hbWUgKyBcIidcIik7XG59XG5cblxuLypcbiAqIE1pc3NpbmcgYSBwcm9wZXJ0eS5cbiAqIEBtZXRob2QgbWlzc2luZ1Byb3BlcnR5XG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlOYW1lIG5hbWUgb2YgdGhlIHByb3BlcnR5XG4gKi9cbmZ1bmN0aW9uIG1pc3NpbmdQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpIHtcbiAgICBnZXRMb2dnZXIoKS53YXJuKFwibWlzc2luZyBwcm9wZXJ0eSAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIidcIik7XG59XG5cblxuLypcbiAqIEEgY2xhc3MgZGVmaW5pdGlvbiBpcyBtaXNzaW5nLlxuICogQG1ldGhvZCBtaXNzaW5nSW1wbGVtZW50YXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIG1pc3Npbmcgc2NoZW1hXG4gKi9cbmZ1bmN0aW9uIG1pc3NpbmdJbXBsZW1lbnRhdGlvbihuYW1lKSB7XG4gICAgZ2V0TG9nZ2VyKCkud2FybihcInNjaGVtYSAnXCIgKyBuYW1lICsgXCInIGlzIG1pc3NpbmcuXCIpO1xufVxuXG5cbi8qXG4gKiBJbnZhbGlkIHR5cGUgZm9yIGEgcHJvcGVydHkgb2YgYSBjbGFzcyBkZWZpbml0aW9uLlxuICogQG1ldGhvZCBpbnZhbGlkVHlwZUltcFxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5IGEgcHJvcGVydHlcbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgYSBjbGFzcyBuYW1lXG4gKi9cbmZ1bmN0aW9uIGludmFsaWRUeXBlSW1wKHByb3BlcnR5LCBjbGFzc05hbWUpIHtcbiAgICBnZXRMb2dnZXIoKS5lcnJvcihcInRoZSBwcm9wZXJ0eSAnXCIgKyBwcm9wZXJ0eSArIFwiJyBvZiB0aGUgbW9kZWwgJ1wiICsgY2xhc3NOYW1lICsgXCInIGlzIGludmFsaWRcIik7XG59XG5cblxuLypcbiAqIE1pc3NpbmcgYSBwcm9wZXJ0eSBmb3IgYSBjbGFzcyBkZWZpbml0aW9uLlxuICogQG1ldGhvZCBtaXNzaW5nUHJvcGVydHlJbXBcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eSBhIHByb3BlcnR5XG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lIGEgY2xhc3MgbmFtZVxuICovXG5mdW5jdGlvbiBtaXNzaW5nUHJvcGVydHlJbXAocHJvcGVydHksIGNsYXNzTmFtZSkge1xuICAgIGdldExvZ2dlcigpLndhcm4oXCJtaXNzaW5nIHByb3BlcnR5ICdcIiArIHByb3BlcnR5ICsgXCInIGZvciB0aGUgZGVmaW5pdGlvbiBvZiAnXCIgKyBjbGFzc05hbWUgKyBcIidcIik7XG59XG5cblxuLypcbiAqIFVua293biBwcm9wZXJ0eSBmb3IgYSBjbGFzcyBkZWZpbml0aW9uLlxuICogQG1ldGhvZCB1bmtub3duUHJvcGVydHlJbXBcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eSBhIHByb3BlcnR5XG4gKiBAcGFyYW0ge09iamVjdH0gc2NoZW1hIGEgc2NoZW1hXG4gKi9cbmZ1bmN0aW9uIHVua25vd25Qcm9wZXJ0eUltcChwcm9wZXJ0eSwgc2NoZW1hKSB7XG4gICAgZ2V0TG9nZ2VyKCkuZXJyb3IoXCJ0aGUgbW9kZWwgJ1wiICsgc2NoZW1hICsgXCInIGhhcyBhbiB1bmtub3duIHByb3BlcnR5ICdcIiArIHByb3BlcnR5ICsgXCInXCIpO1xufVxuXG5cbi8qXG4gKiBUcnkgdG8gYWRkIGFuIGludmFsaWQgdHlwZS5cbiAqIEBtZXRob2QgaW52YWxpZFR5cGVEZWZpbml0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBhIHR5cGUgZGVmaW5pdGlvblxuICovXG5mdW5jdGlvbiBpbnZhbGlkVHlwZURlZmluaXRpb24obmFtZSkge1xuICAgIGdldExvZ2dlcigpLndhcm4oXCJ0aGUgdHlwZSAnXCIgKyBuYW1lICsgXCInIGlzIG5vdCB2YWxpZFwiKTtcbn1cblxuXG4vKlxuICogSW52YWxpZCBwcm9wZXJ0eSBuYW1lLlxuICogQG1ldGhvZCBpbnZhbGlkUHJvcGVydHlOYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIGNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZSBjbGFzcyBuYW1lIG9mIHRoZSBjb21wb25lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eU5hbWUgbmFtZSBvZiB0aGUgcHJvcGVydHlcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eVZhbHVlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgdHlwZSBkZWZpbmVkIGJ5IHRoZSBzY2hlbWFcbiAqL1xuZnVuY3Rpb24gaW52YWxpZFByb3BlcnR5TmFtZShpZCwgY2xhc3NOYW1lLCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWUsIHR5cGUpIHtcbiAgICB2YXIgY2xhc3NJbmZvID0gJyc7XG5cbiAgICBpZiAoY2xhc3NOYW1lICE9PSAnRnVuY3Rpb24nKSB7XG4gICAgICAgIGNsYXNzSW5mbyA9IFwiIChjbGFzcyAnXCIgKyBjbGFzc05hbWUgKyBcIicpXCI7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICBnZXRMb2dnZXIoKS53YXJuKFwiaW52YWxpZCB0eXBlIGZvciBwcm9wZXJ0eSAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicgb24gY29tcG9uZW50ICdcIiArIGlkICsgXCInXCIgKyBjbGFzc0luZm8gKyBcIjogZXhwZWN0ZWQgJ1wiICsgdHlwZS5yZXBsYWNlKCdAJywgJycpICsgXCInIGluc3RlYWQgb2YgJ1wiICsgdHlwZW9mIHByb3BlcnR5VmFsdWUgKyBcIidcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2V0TG9nZ2VyKCkud2FybihcImludmFsaWQgdHlwZSBmb3IgcHJvcGVydHkgdHlwZSAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicgb24gY29tcG9uZW50ICdcIiArIGNsYXNzSW5mbyArIFwiOiBleHBlY3RlZCAnc3RyaW5nJyBpbnN0ZWFkIG9mICdcIiArIHR5cGVvZiB0eXBlICsgXCInXCIpO1xuICAgIH1cbn1cblxuXG4vKlxuICogVHJ5aW5nIHRvIHNldCBhIHJlYWQtb25seSBwcm9wZXJ0eS5cbiAqIEBtZXRob2QgcmVhZE9ubHlQcm9wZXJ0eVxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjb21wb25lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgY2xhc3MgbmFtZSBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlOYW1lIG5hbWUgb2YgdGhlIHByb3BlcnR5XG4gKi9cbmZ1bmN0aW9uIHJlYWRPbmx5UHJvcGVydHkoaWQsIGNsYXNzTmFtZSwgcHJvcGVydHlOYW1lKSB7XG4gICAgdmFyIGNsYXNzSW5mbyA9ICcnO1xuXG4gICAgaWYgKGNsYXNzTmFtZSAhPT0gJ0Z1bmN0aW9uJykge1xuICAgICAgICBjbGFzc0luZm8gPSBcIiAoY2xhc3MgJ1wiICsgY2xhc3NOYW1lICsgXCInKVwiO1xuICAgIH1cbiAgICBnZXRMb2dnZXIoKS53YXJuKFwiY2FuIG5vdCBzZXQgcmVhZC1vbmx5IHByb3BlcnR5ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJyBvbiBjb21wb25lbnQgJ1wiICsgaWQgKyBcIidcIiArIGNsYXNzSW5mbyk7XG59XG5cblxuLypcbiAqIEludmFsaWQgZG9jdW1lbnQgb24gYSBSdW50aW1lIGRhdGFiYXNlIGluc2VydCBvcGVyYXRpb24uXG4gKiBAbWV0aG9kIGludmFsaWREb2N1bWVudE9uRGJJbnNlcnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBkb2MgYSBkb2N1bWVudFxuICogQHBhcmFtIHtTdHJpbmd9IGNvbGxlY3Rpb25OYW1lIHRoZSBuYW1lIG9mIHRoZSBjb2xsbGVjdGlvblxuICovXG5mdW5jdGlvbiBpbnZhbGlkRG9jdW1lbnRPbkRiSW5zZXJ0KGRvYywgY29sbGVjdGlvbk5hbWUpIHtcbiAgICBnZXRMb2dnZXIoKS53YXJuKFwiaW52YWxpZCBkb2N1bWVudCAnXCIgKyBKU09OLnN0cmluZ2lmeShkb2MpLnJlcGxhY2UoLywvZywgJywgJykgKyBcIicgb24gYW4gaW5zZXJ0IG9wZXJhdGlvbiBvbiBjb2xsZWN0aW9uICdcIiArIGNvbGxlY3Rpb25OYW1lICsgXCInXCIpO1xufVxuXG5cbi8qXG4gKiBJbnZhbGlkIHByb3BlcnR5IG9uIGEgUnVudGltZSBkYXRhYmFzZSB1cGRhdGUgb3BlcmF0aW9uLlxuICogQG1ldGhvZCBpbnZhbGlkUHJvcGVydHlUeXBlT25EYlVwZGF0ZVxuICogQHBhcmFtIHtTdHJpbmd9IGNvbGxlY3Rpb25OYW1lIHRoZSBuYW1lIG9mIHRoZSBjb2xsbGVjdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjb21wb25lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eU5hbWUgbmFtZSBvZiB0aGUgcHJvcGVydHlcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eVZhbHVlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgZXhwZWN0ZWQgdHlwZSBkZWZpbmVkIGJ5IHRoZSBzY2hlbWFcbiAqL1xuZnVuY3Rpb24gaW52YWxpZFByb3BlcnR5VHlwZU9uRGJVcGRhdGUoY29sbGVjdGlvbk5hbWUsIGlkLCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWUsIHR5cGUpIHtcbiAgICBnZXRMb2dnZXIoKS53YXJuKFwiaW52YWxpZCB0eXBlIHdoZW4gdHJ5aW5nIHRvIHVwZGF0ZSB0aGUgcHJvcGVydHkgJ1wiICsgcHJvcGVydHlOYW1lICsgXCInIG9mIGRvY3VtZW50ICdcIiArIGlkICsgXCInIChjb2xsZWN0aW9uICdcIiArIGNvbGxlY3Rpb25OYW1lICsgXCInKSB3aXRoIHRoZSB2YWx1ZSAnXCIgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0eVZhbHVlKSArIFwiJzogZXhwZWN0ZWQgdHlwZSAnXCIgKyB0eXBlICsgXCInXCIpO1xufVxuXG4vKlxuICogVW5rb253IHByb3BlcnR5IG9uIGEgUnVudGltZSBkYXRhYmFzZSB1cGRhdGUgb3BlcmF0aW9uLlxuICogQG1ldGhvZCB1bmtub3duUHJvcGVydHlPbkRiVXBkYXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sbGVjdGlvbk5hbWUgdGhlIG5hbWUgb2YgdGhlIGNvbGxsZWN0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlOYW1lIG5hbWUgb2YgdGhlIHByb3BlcnR5XG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIGNvbXBvbmVudFxuICovXG5mdW5jdGlvbiB1bmtub3duUHJvcGVydHlPbkRiVXBkYXRlKHByb3BlcnR5TmFtZSwgY29sbGVjdGlvbk5hbWUsIGlkKSB7XG4gICAgZ2V0TG9nZ2VyKCkud2FybihcInVua25vd24gcHJvcGVydHkgJ1wiICsgcHJvcGVydHlOYW1lICsgXCInIG9uIGFuIHVwZGF0ZSBvcGVyYXRpb24gb24gY29sbGVjdGlvbiAnXCIgKyBjb2xsZWN0aW9uTmFtZSArIFwiJyB3aXRoIGNvbXBvbmVudCAnXCIgKyBpZCArIFwiJ1wiKTtcbn1cblxuXG4vKlxuICogQ2FsbCBhbiB1bmtub3duIG1ldGhvZCBvZiBhIGNsYXNzLlxuICogQG1ldGhvZCB1bmtub3duTWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NJZCBpZCBvZiB0aGUgY2xhc3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2ROYW1lIG5hbWUgb2YgdGhlIG1ldGhvZFxuICovXG5mdW5jdGlvbiB1bmtub3duTWV0aG9kKGNsYXNzSWQsIG1ldGhvZE5hbWUpIHtcbiAgICBnZXRMb2dnZXIoKS53YXJuKFwidHJ5IHRvIGNhbGwgYW4gdW5rbm93biBtZXRob2QgJ1wiICsgbWV0aG9kTmFtZSArIFwiJyBmb3IgdGhlIGNsYXNzICdcIiArIGNsYXNzSWQgKyBcIidcIik7XG59XG5cblxuLypcbiAqIFRyeSB0byBjcmVhdGUgYW4gaW52YWxpZCBSdW50aW1lRGF0YWJhc2VDb2xsZWN0aW9uLlxuICogQG1ldGhvZCBpbnZhbGlkQ29sbGVjdGlvbk5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIGNvbGxlY3Rpb25cbiAqL1xuZnVuY3Rpb24gaW52YWxpZENvbGxlY3Rpb25OYW1lKG5hbWUpIHtcbiAgICBnZXRMb2dnZXIoKS53YXJuKFwiaW52YWxpZCBuYW1lIGZvciBjcmVhdGluZyB0aGUgY29sbGVjdGlvbiAnXCIgKyBuYW1lICsgXCInOiB0aGVyZSBpcyBubyBzY2hlbWEgJ1wiICsgbmFtZSArIFwiJyBpbiB0aGUgbWV0YW1vZGVsXCIpO1xufVxuXG5cbi8qXG4gKiBJbnZhbGlkIHR5cGUgcmVzdWx0IG9mIGEgbWV0aG9kLlxuICogQG1ldGhvZCBpbnZhbGlkUmVzdWx0VHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjb21wb25lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgY2xhc3MgbmFtZSBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kTmFtZSBuYW1lIG90IHRoZSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBlY3RlZFR5cGUgZXhwZWN0ZWQgdHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgY3VycmVudCB0eXBlXG4gKi9cbmZ1bmN0aW9uIGludmFsaWRSZXN1bHRUeXBlKGlkLCBjbGFzc05hbWUsIG1ldGhvZE5hbWUsIGV4cGVjdGVkVHlwZSwgdHlwZSkge1xuICAgIHZhciBjbGFzc0luZm8gPSAnJztcblxuICAgIGlmIChjbGFzc05hbWUgIT09ICdGdW5jdGlvbicpIHtcbiAgICAgICAgY2xhc3NJbmZvID0gXCIgKGNsYXNzICdcIiArIGNsYXNzTmFtZSArIFwiJylcIjtcbiAgICB9XG5cbiAgICBpZiAodHlwZSkge1xuICAgICAgICBnZXRMb2dnZXIoKS53YXJuKFwiaW52YWxpZCB0eXBlIGZvciB0aGUgcmVzdWx0IG9mIG1ldGhvZCAnXCIgKyBtZXRob2ROYW1lICsgXCInIG9uIGNvbXBvbmVudCAnXCIgKyBpZCArIFwiJ1wiICsgY2xhc3NJbmZvICsgXCI6IGV4cGVjdGVkIHR5cGUgJ1wiICsgZXhwZWN0ZWRUeXBlLnJlcGxhY2UoJ0AnLCAnJykgKyBcIicgaW5zdGVhZCBvZiB0eXBlICdcIiArIHR5cGUgKyBcIidcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2V0TG9nZ2VyKCkud2FybihcImludmFsaWQgdHlwZSBmb3IgdGhlIHJlc3VsdCBvZiBtZXRob2QgJ1wiICsgbWV0aG9kTmFtZSArIFwiJyBvbiBjb21wb25lbnQgJ1wiICsgaWQgKyBcIidcIiArIGNsYXNzSW5mbyArIFwiOiBleHBlY3RlZCB0eXBlICdcIiArIGV4cGVjdGVkVHlwZS5yZXBsYWNlKCdAJywgJycpICsgXCInXCIpO1xuICAgIH1cbn1cblxuXG4vKlxuICogVW5rbm93biBjbGFzcy5cbiAqIEBtZXRob2QgdW5rbm93bkNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IGNvbXBvbmVudElkIGlmIG9mIHRoZSBjb21wb25lbnRcbiAqL1xuZnVuY3Rpb24gdW5rbm93bkNvbXBvbmVudChjbGFzc05hbWUsIGNvbXBvbmVudElkKSB7XG4gICAgZ2V0TG9nZ2VyKCkud2FybihcInVua293biBjbGFzcyBjb21wb25lbnQgJ1wiICsgY2xhc3NOYW1lICsgXCInIGZvciBjb21wb25lbnQgJ1wiICsgY29tcG9uZW50SWQgKyBcIidcIik7XG59XG5cblxuLypcbiAqIFRoZSBSdW50aW1lIHdvcmtmbG93IGhhcyBiZWVuIHJlc3RhcnRlZC5cbiAqIEBtZXRob2Qgd29ya2Zsb3dSZXN0YXJ0ZWRcbiAqL1xuZnVuY3Rpb24gd29ya2Zsb3dSZXN0YXJ0ZWQoKSB7XG4gICAgZ2V0TG9nZ2VyKCkud2FybigncnVudGltZSBoYXMgYmVlbiByZXN0YXJ0ZWQnKTtcbn1cblxuXG4vKlxuICogaW52YWxpZCBwYXJhbWV0ZXIgbnVtYmVyIGZvciBhIG1ldGhvZC5cbiAqIEBtZXRob2QgaW52YWxpZFBhcmFtTnVtYmVyXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIGNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZSBjbGFzcyBuYW1lIG9mIHRoZSBjb21wb25lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2ROYW1lIG5hbWUgb2YgdGhlIGNvbXBvbmVudFxuICovXG5mdW5jdGlvbiBpbnZhbGlkUGFyYW1OdW1iZXIoaWQsIGNsYXNzTmFtZSwgbWV0aG9kTmFtZSkge1xuICAgIHZhciBjbGFzc0luZm8gPSAnJztcblxuICAgIGlmIChjbGFzc05hbWUgIT09ICdGdW5jdGlvbicpIHtcbiAgICAgICAgY2xhc3NJbmZvID0gXCIgKGNsYXNzICdcIiArIGNsYXNzTmFtZSArIFwiJylcIjtcbiAgICB9XG5cbiAgICBnZXRMb2dnZXIoKS53YXJuKFwiaW52YWxpZCBudW1iZXIgb2YgcGFyYW1ldGVycyB3aGVuIGNhbGxpbmcgdGhlIG1ldGhvZCAnXCIgKyBtZXRob2ROYW1lICsgXCInIG9uIGNvbXBvbmVudCAnXCIgKyBpZCArIFwiJ1wiICsgY2xhc3NJbmZvKTtcbn1cblxuXG4vKlxuICogSW52YWxpZCB0eXBlIHBhcmFtZXRlcnMgZm9yIGEgbWV0aG9kLlxuICogQG1ldGhvZCBpbnZhbGlkUGFyYW1UeXBlXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIGNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZSBjbGFzcyBuYW1lIG9mIHRoZSBjb21wb25lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2ROYW1lIG5hbWUgb2YgdGhlIGNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtTmFtZSBuYW1lIG9mIHRoZSBwYXJhbWV0ZXJcbiAqIFxuICovXG5mdW5jdGlvbiBpbnZhbGlkUGFyYW1UeXBlKGlkLCBjbGFzc05hbWUsIG1ldGhvZE5hbWUsIHBhcmFtTmFtZSkge1xuICAgIHZhciBjbGFzc0luZm8gPSAnJztcblxuICAgIGlmIChjbGFzc05hbWUgIT09ICdGdW5jdGlvbicpIHtcbiAgICAgICAgY2xhc3NJbmZvID0gXCIgKGNsYXNzICdcIiArIGNsYXNzTmFtZSArIFwiJylcIjtcbiAgICB9XG4gICAgZ2V0TG9nZ2VyKCkud2FybihcImludmFsaWQgdHlwZSBmb3IgdGhlIHBhcmFtZXRlciAnXCIgKyBwYXJhbU5hbWUgKyBcIicgd2hlbiBjYWxsaW5nIHRoZSBtZXRob2QgJ1wiICsgbWV0aG9kTmFtZSArIFwiJyBvbiBjb21wb25lbnQgJ1wiICsgaWQgKyBcIidcIiArIGNsYXNzSW5mbyk7XG59XG5cblxuLypcbiAqIEFkZCBhIG1vcmUgdGhhbiBvbmUgYmVoYXZpb3IgdG8gYSBzdGF0ZS5cbiAqIEBtZXRob2QgYmVoYXZpb3JOb3RVbmlxdWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgY2xhc3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdGF0ZU5hbWUgbmFtZSBvZiB0aGUgc3RhdGVcbiAqL1xuZnVuY3Rpb24gYmVoYXZpb3JOb3RVbmlxdWUoaWQsIHN0YXRlTmFtZSkge1xuICAgIGdldExvZ2dlcigpLndhcm4oXCJ0cnkgdG8gYWRkIG1vcmUgdGhhbiBvbmUgYmVoYXZpb3IgZm9yIHRoZSBzdGF0ZSAnXCIgKyBzdGF0ZU5hbWUgKyBcIicgb24gY2xhc3MgJ1wiICsgaWQgKyBcIidcIik7XG59XG5cblxuLypcbiAqIENhbiBub3QgYWRkIGEgYmVoYXZpb3Igd2l0aCBhbiBpbnZhbGlkIHN0YXRlLlxuICogQG1ldGhvZCBpbnZhbGlkU3RhdGVPblxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IHN0YXRlTmFtZSBuYW1lIG9mIHRoZSBzdGF0ZVxuICovXG5mdW5jdGlvbiBpbnZhbGlkU3RhdGVPbihpZCwgc3RhdGVOYW1lKSB7XG4gICAgZ2V0TG9nZ2VyKCkud2FybihcInRyeSB0byBhZGQgYSBiZWhhdmlvciB3aXRoIGFuIHVua3dvd24gc3RhdGUgJ1wiICsgc3RhdGVOYW1lICsgXCInIG9uIGNsYXNzICdcIiArIGlkICsgXCInXCIpO1xufVxuXG5cbi8qXG4gKiBUaGUgY2FsbCB0byBhIHJlbW92ZSBzdGF0ZSBvZiB0aGUgYmVoYXZpb3IgbW9kdWxlIGlzIGludmFsaWQuXG4gKiBAbWV0aG9kIGludmFsaWRTdGF0ZU9mZlxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IHN0YXRlTmFtZSBuYW1lIG9mIHRoZSBzdGF0ZVxuICovXG5mdW5jdGlvbiBpbnZhbGlkU3RhdGVPZmYoaWQsIHN0YXRlTmFtZSkge1xuICAgIGdldExvZ2dlcigpLndhcm4oXCJ0cnkgdG8gcmVtb3ZlIGEgYmVoYXZpb3IgZnJvbSBhbiB1bmt3b3duIHN0YXRlICdcIiArIHN0YXRlTmFtZSArIFwiJyBvbiBjbGFzcyAnXCIgKyBpZCArIFwiJ1wiKTtcbn1cblxuXG4vKlxuICogVGhlIG1hc3RlciBzeXN0ZW0gaXMgbm90IGZvdW5kLlxuICogQG1ldGhvZCBtYXN0ZXJTeXN0ZW1Ob3RGb3VuZFxuICovXG5mdW5jdGlvbiBtYXN0ZXJTeXN0ZW1Ob3RGb3VuZCgpIHtcbiAgICBnZXRMb2dnZXIoKS53YXJuKFwiY2FuIG5vdCBleHBvcnQgdGhlIGRhdGFiYXNlIGJlY2F1c2Ugbm8gc3lzdGVtIHdhcyBkZWZpbmVkXCIpO1xufVxuXG5cbi8qXG4gKiBJbnZhbGlkIHR5cGUuXG4gKiBAbWV0aG9kIGludmFsaWRUeXBlXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWUgdmFsdWUgb2YgdGhlIHR5cGVcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlTmFtZSBleHBlY3RlYyB0eXBlIGRlZmluZWQgYnkgdGhlIHNjaGVtYVxuICovXG5mdW5jdGlvbiBpbnZhbGlkVHlwZSh2YWx1ZSwgdHlwZU5hbWUpIHtcbiAgICBnZXRMb2dnZXIoKS53YXJuKFwiaW52YWxpZCB0eXBlIGZvciB2YWx1ZSAnXCIgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkgKyBcIic6IGV4cGVjdGVkICdcIiArIHR5cGVOYW1lICsgXCInXCIpO1xufVxuXG5cbi8qXG4gKiBVbmtub3duIHR5cGUuXG4gKiBAbWV0aG9kIHVua25vd25UeXBlXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgdmFsdWVcbiAqL1xuZnVuY3Rpb24gdW5rbm93blR5cGUodmFsdWUpIHtcbiAgICBnZXRMb2dnZXIoKS53YXJuKFwidW5rbm93biB0eXBlIGZvciB2YWx1ZSAnXCIgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkgKyBcIidcIik7XG59XG5cblxuLypcbiAqIEEgY29tcG9uZW50IGhhcyBub3QgYmVlbiBhbHJlYXkgY3JlYXRlZC5cbiAqIEBtZXRob2QgY2FuTm90WWV0VmFsaWRhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lIG5hbWUgb2YgdGhlIGNsYXNzXG4gKi9cbmZ1bmN0aW9uIGNhbk5vdFlldFZhbGlkYXRlKGlkLCBjbGFzc05hbWUpIHtcbiAgICBnZXRMb2dnZXIoKS5kZWJ1ZyhcImNhbiBub3QgeWV0IHZhbGlkYXRlIGlmIHRoZSBjb21wb25lbnQgJ1wiICsgaWQgKyBcIicgaXMgYW4gaW5zdGFuY2Ugb2YgJ1wiICsgY2xhc3NOYW1lICsgXCInXCIpO1xufVxuXG5cbi8qKlxuICogQSBtZXNzYWdlIHNlbmQgYnkgdGhlIGNoYW5uZWwgaXMgaW52YWxpZFxuICogQG1ldGhvZCBpbnZhbGlkQ2hhbm5lbEV2ZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBtZXNzYWdlIHNlbmRcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgbmFtZSBvZiB0aGUgZXZlbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIGV4cGVjdGVkIHR5cGVcbiAqL1xuZnVuY3Rpb24gaW52YWxpZENoYW5uZWxFdmVudChtZXNzYWdlLCBldmVudE5hbWUsIHR5cGUpIHtcbiAgICBnZXRMb2dnZXIoKS53YXJuKFwiaW52YWxpZCB0eXBlIGZvciB0aGUgbWVzc2FnZSAnXCIgKyBKU09OLnN0cmluZ2lmeShtZXNzYWdlKSArIFwiJzogZXhwZWN0ZWQgdHlwZSAnXCIgKyB0eXBlICsgXCInIGZvciBldmVudCAnXCIgKyBldmVudE5hbWUgKyBcIidcIik7XG59XG5cblxuLypcbiAqIGludmFsaWQgcGFyYW1ldGVyIG51bWJlciBmb3IgYW4gYWN0aW9uIGFkZCB3aXRoIG9uIG1ldGhvZC5cbiAqIEBtZXRob2QgaW52YWxpZFBhcmFtTnVtYmVyTWV0aG9kT25cbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lIGNsYXNzIG5hbWUgb2YgdGhlIGNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZE5hbWUgbmFtZSBvZiB0aGUgY29tcG9uZW50XG4gKi9cbmZ1bmN0aW9uIGludmFsaWRQYXJhbU51bWJlck1ldGhvZE9uKGlkLCBjbGFzc05hbWUsIG1ldGhvZE5hbWUpIHtcbiAgICB2YXIgY2xhc3NJbmZvID0gJyc7XG5cbiAgICBpZiAoY2xhc3NOYW1lICE9PSAnRnVuY3Rpb24nKSB7XG4gICAgICAgIGNsYXNzSW5mbyA9IFwiIChjbGFzcyAnXCIgKyBjbGFzc05hbWUgKyBcIicpXCI7XG4gICAgfVxuICAgIGdldExvZ2dlcigpLndhcm4oXCJpbnZhbGlkIG51bWJlciBvZiBwYXJhbWV0ZXJzIHdoZW4gYWRkaW5nIGFuIGFjdGlvbiBvbiBtZXRob2QgJ1wiICsgbWV0aG9kTmFtZSArIFwiJyBvbiBjb21wb25lbnQgJ1wiICsgaWQgKyBcIidcIiArIGNsYXNzSW5mbyk7XG59XG5cblxuLypcbiAqIENoYW5nZSB0aGUgaWQgb2YgYSBjb21wb25lbnQuXG4gKiBAbWV0aG9kIHVwZGF0ZVV1aWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBjdXJyZW50SWQgaWQgb2YgdGhlIGNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IG5ld0lkIG9mIHRoZSBjb21wb25lbnRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYWxyZWFkeVVzZWQgbmV3SWQgYWxyZWFkeSB1c2VkXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVV1aWQoY3VycmVudElkLCBuZXdJZCwgYWxyZWFkeVVzZWQpIHtcbiAgICBpZiAoYWxyZWFkeVVzZWQpIHtcbiAgICAgICAgZ2V0TG9nZ2VyKCkud2FybihcInRyeSB0byB1cGRhdGUgYSBjb21wb25lbnQgb2YgaWQgJ1wiICsgY3VycmVudElkICsgXCInIHdpdGggdGhlIG5ldyBpZCAnXCIgKyBuZXdJZCArIFwiJyB0aGF0IGlzIGFscmVhZHkgdXNlZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnZXRMb2dnZXIoKS53YXJuKFwidHJ5IHRvIHVwZGF0ZSBhIGNvbXBvbmVudCBvZiBpZCAnXCIgKyBjdXJyZW50SWQgKyBcIicgd2l0aCB0aGUgbmV3IGlkICdcIiArIG5ld0lkICsgXCInXCIpO1xuICAgIH1cbn1cblxuXG4vKlxuICogVHJ5IHRvIGNoYW5nZSB0aGUgc3RhdGUgb2YgYSBjb21wb25lbnQgdGhhdCBoYXMgYmVlbiBkZXN0cm95ZWQuXG4gKiBAbWV0aG9kIGludmFsaWRVc2VPZkNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjb21wb25lbnRcbiAqL1xuZnVuY3Rpb24gaW52YWxpZFVzZU9mQ29tcG9uZW50KGlkKSB7XG4gICAgZ2V0TG9nZ2VyKCkud2FybihcInRyeSB0byBjaGFuZ2UgdGhlIHN0YXRlIG9mIHRoZSBkZXN0cm95ZWQgY29tcG9uZW50ICdcIiArIGlkICsgXCInXCIpO1xufVxuXG5cbi8qXG4gKiBUcnkgdG8gYWRkIGFuIGludmFsaWQgc2NoZW1hLlxuICogQG1ldGhvZCBpbnZhbGlkU2NoZW1hXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBzY2hlbWFcbiAqL1xuZnVuY3Rpb24gaW52YWxpZFNjaGVtYShuYW1lKSB7XG4gICAgZ2V0TG9nZ2VyKCkud2FybihcInRoZSBzY2hlbWEgJ1wiICsgbmFtZSArIFwiJyBpcyBub3QgdmFsaWRcIik7XG59XG5cblxuLypcbiAqIFRyeSB0byBhZGQgYW4gaW52YWxpZCBtb2RlbC5cbiAqIEBtZXRob2QgaW52YWxpZE1vZGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBtb2RlbFxuICovXG5mdW5jdGlvbiBpbnZhbGlkTW9kZWwobmFtZSkge1xuICAgIGdldExvZ2dlcigpLndhcm4oXCJ0aGUgbW9kZWwgJ1wiICsgbmFtZSArIFwiJyBpcyBub3QgdmFsaWRcIik7XG59XG5cblxuLypcbiAqIEludmFsaWQgcGFyYW1ldGVycyBzZXQgd2hlbiBjcmVhdGluZyBhbiBpbnN0YW5jZSBvZiBhIGNsYXNzLlxuICogQG1ldGhvZCBpbnZhbGlkUGFyYW1ldGVyc1xuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzSWQgY2xhc3MgbmFtZSBvZiB0aGUgY29tcG9uZW50XG4gKi9cbmZ1bmN0aW9uIGludmFsaWRQYXJhbWV0ZXJzKGNsYXNzSWQpIHtcbiAgICBnZXRMb2dnZXIoKS53YXJuKFwidGhlIHBhcmFtZXRlcnMgZm9yIGNyZWF0aW5nIGEgY29tcG9uZW50IG9mIGNsYXNzICdcIiArIGNsYXNzSWQgKyBcIicgYXJlIG5vdCBjb21wbGlhbnQgd2l0aCB0aGUgbW9kZWxcIik7XG59XG5cblxuLypcbiAqIFRyeSB0byBnZXQgdGhlIHByb3BlcnR5IG9mIGEgZGVzdHJveWVkIGNvbXBvbmVudC5cbiAqIEBtZXRob2QgZGVzdHJveWVkQ29tcG9uZW50Q2FsbFxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5TmFtZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eVxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjb21wb25lbnRcbiAqL1xuZnVuY3Rpb24gZGVzdHJveWVkQ29tcG9uZW50Q2FsbChwcm9wZXJ0eU5hbWUsIGlkKSB7XG4gICAgZ2V0TG9nZ2VyKCkud2FybihcInRyeWluZyB0byBnZXQgdGhlIHByb3BlcnR5ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJyBvbiB0aGUgZGVzdHJveWVkIGNvbXBvbmVudCAnXCIgKyBpZCArIFwiJ1wiKTtcbn1cblxuXG4vKlxuICogSW52YWxpZCBwYXJhbWV0ZXIgdHlwZSAgd2hlbiBjcmVhdGluZyBhbiBpbnN0YW5jZSBvZiBhIGNsYXNzLlxuICogQG1ldGhvZCBpbnZhbGlkQ29uY3RydWN0b3JQYXJhbWV0ZXJzXG4gKiBAcGFyYW0ge1N0cmluZ30gb2JqZWN0IGNvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIHNjaGVtYSBuYW1lXG4gKi9cbmZ1bmN0aW9uIGludmFsaWRDb25jdHJ1Y3RvclBhcmFtZXRlcnMob2JqZWN0LCBuYW1lKSB7XG4gICAgZ2V0TG9nZ2VyKCkud2FybihcInRoZSBjb25zdHJ1Y3RvciBwYXJhbWV0ZXIgJ1wiICsgSlNPTi5zdHJpbmdpZnkob2JqZWN0KS5yZXBsYWNlKC8sL2csICcsICcpICsgXCInIGZvciBjcmVhdGluZyBhIGNvbXBvbmVudCBvZiBjbGFzcyAnXCIgKyBuYW1lICsgXCInIGlzIG5vdCBhbiBvYmplY3RcIik7XG59XG5cblxuLypcbiAqIEdldCB0aGUgaW5mb3JtYXRpb24gb2YgYW4gdW5rb3duIG1vZGVsLlxuICogQG1ldGhvZCB1bmtub3duTW9kZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc0lkIGlkIG9mIHRoZSBjbGFzc1xuICovXG5mdW5jdGlvbiB1bmtub3duTW9kZWwoY2xhc3NJZCkge1xuICAgIGdldExvZ2dlcigpLndhcm4oXCJ0cnkgZ2V0IHRoZSBpbmZvcm1hdGlvbiBvZiBhbiB1bmtub3duIG1vZGVsICdcIiArIGNsYXNzSWQgKyBcIidcIik7XG59XG5cblxuLypcbiAqIEEgc2NoZW1hIGlzIG1pc3NpbmcuXG4gKiBAbWV0aG9kIG1pc3NpbmdTY2hlbWFcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIHNjaGVtYVxuICovXG5mdW5jdGlvbiBtaXNzaW5nU2NoZW1hKG5hbWUpIHtcbiAgICBnZXRMb2dnZXIoKS53YXJuKFwidGhlIHNjaGVtYSAnXCIgKyBuYW1lICsgXCInIGlzIG1pc3NpbmdcIik7XG59XG5cblxuLypcbiAqIEEgY3ljbGljIGRlcGVuZGVuY3kgd2FzIGZvdW5kLlxuICogQG1ldGhvZCBtaXNzaW5nU2NoZW1hXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBzY2hlbWEgd2hlcmUgdGhlIGN5Y2xpYyBkZXBlbmRlbmN5IHdhcyBmb3VuZFxuICovXG5mdW5jdGlvbiBjeWNsaWNEZXBlbmRlbmN5KG5hbWUpIHtcbiAgICBpZiAobmFtZSkge1xuICAgICAgICBnZXRMb2dnZXIoKS5lcnJvcignYSBjeWNsaWMgaW5oZXJpdGFuY2UgZGVwZW5kZW5jeSB3aXRoIFxc4oCZJyArIG5hbWUgKyAnXFzigJkgc2NoZW1hIGhhcyBiZWVuIGZvdW5kLCBwbGVhc2UgY2hlY2sgdGhlIFxcJ19pbmhlcml0XFwnIHByb3BlcnRpZXMgb2YgeW91ciBzY2hlbWFzJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2V0TG9nZ2VyKCkuZXJyb3IoJ2EgY3ljbGljIGluaGVyaXRhbmNlIGRlcGVuZGVuY3kgaGFzIGJlZW4gZm91bmQsIHBsZWFzZSBjaGVjayB0aGUgXFwnX2luaGVyaXRcXCcgcHJvcGVydGllcyBvZiB5b3VyIHNjaGVtYXMnKTtcbiAgICB9XG59XG5cblxuLypcbiAqIEludmFsaWQgdHlwZSBmb3IgYSB0eXBlIGVudW0uXG4gKiBAbWV0aG9kIGludmFsaWRFbnVtVHlwZVxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIHRoZSB2YWx1ZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVOYW1lIG5hbWUgb2YgdGhlIHR5cGVcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIHR5cGVOYW1lIG9mIHRoZSB0eXBlXG4gKi9cbmZ1bmN0aW9uIGludmFsaWRFbnVtVHlwZSh2YWx1ZSwgdHlwZU5hbWUsIHR5cGUpIHtcbiAgICBpZiAodHlwZSAhPT0gdHlwZW9mIHZhbHVlKSB7XG4gICAgICAgIGdldExvZ2dlcigpLndhcm4oXCJpbnZhbGlkIHR5cGUgZm9yIGVudW1lcmF0ZWQgdHlwZSAnXCIgKyB0eXBlTmFtZSArIFwiJzogZXhwZWN0ZWQgdHlwZSAnXCIgKyB0eXBlICsgXCInIGluc3RlYWQgb2YgdHlwZSAnXCIgKyB0eXBlb2YgdmFsdWUgKyBcIidcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2V0TG9nZ2VyKCkud2FybihcImludmFsaWQgdHlwZSBmb3IgZW51bWVyYXRlZCB0eXBlICdcIiArIHR5cGVOYW1lICsgXCInXCIpO1xuICAgIH1cbn1cblxuXG4vKlxuICogTG9hZCBzY2hlbWEuXG4gKiBAbWV0aG9kIGxvYWRTY2hlbWFcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIHNjaGVtYVxuICovXG5mdW5jdGlvbiBsb2FkU2NoZW1hKG5hbWUpIHtcbiAgICBnZXRMb2dnZXIoKS5kZWJ1ZyhcImxvYWQgc2NoZW1hICdcIiArIG5hbWUgKyBcIidcIik7XG59XG5cblxuLypcbiAqIExvYWQgbW9kZWwuXG4gKiBAbWV0aG9kIGxvYWRNb2RlbFxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgbW9kZWxcbiAqL1xuZnVuY3Rpb24gbG9hZE1vZGVsKG5hbWUpIHtcbiAgICBnZXRMb2dnZXIoKS5kZWJ1ZyhcImxvYWQgbW9kZWwgJ1wiICsgbmFtZSArIFwiJ1wiKTtcbn1cblxuXG4vKlxuICogTG9hZCB0eXBlLlxuICogQG1ldGhvZCBsb2FkVHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgdHlwZVxuICovXG5mdW5jdGlvbiBsb2FkVHlwZShuYW1lKSB7XG4gICAgZ2V0TG9nZ2VyKCkuZGVidWcoXCJsb2FkIHR5cGUgJ1wiICsgbmFtZSArIFwiJ1wiKTtcbn1cblxuXG4vKlxuICogQ29tcGlsZSBzY2hlbWEuXG4gKiBAbWV0aG9kIGNvbXBpbGVTY2hlbWFcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIHNjaGVtYVxuICovXG5mdW5jdGlvbiBjb21waWxlU2NoZW1hKG5hbWUpIHtcbiAgICBnZXRMb2dnZXIoKS5kZWJ1ZyhcImNvbXBpbGUgc2NoZW1hICdcIiArIG5hbWUgKyBcIicuLi5cIik7XG59XG5cblxuLypcbiAqIEdlbmVyYXRlIG1vZGVsLlxuICogQG1ldGhvZCBnZW5lcmF0ZU1vZGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBtb2RlbFxuICovXG5mdW5jdGlvbiBnZW5lcmF0ZU1vZGVsKG5hbWUpIHtcbiAgICBnZXRMb2dnZXIoKS5kZWJ1ZyhcImdlbmVyYXRlIG1vZGVsICdcIiArIG5hbWUgKyBcIicuLi5cIik7XG59XG5cblxuLypcbiAqIENoZWNrIG1vZGVsLlxuICogQG1ldGhvZCBjaGVja01vZGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBtb2RlbFxuICovXG5mdW5jdGlvbiBjaGVja01vZGVsKG5hbWUpIHtcbiAgICBnZXRMb2dnZXIoKS5kZWJ1ZyhcImFuYWx5emUgbW9kZWwgJ1wiICsgbmFtZSArIFwiJy4uLlwiKTtcbn1cblxuXG4vKlxuICogQ3JlYXRlIGNvbGxlY3Rpb24uXG4gKiBAbWV0aG9kIGNyZWF0ZUNvbGxlY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIGNvbGxlY3Rpb25cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ29sbGVjdGlvbihuYW1lKSB7XG4gICAgZ2V0TG9nZ2VyKCkuZGVidWcoXCJjcmVhdGUgY29sbGVjdGlvbiAnXCIgKyBuYW1lICsgXCInXCIpO1xufVxuXG4vKlxuICogQ3JlYXRlIGNsYXNzLlxuICogQG1ldGhvZCBjcmVhdGVDbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgY2xhc3NcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ2xhc3MobmFtZSkge1xuICAgIGdldExvZ2dlcigpLmRlYnVnKFwiY3JlYXRlIGNsYXNzICdcIiArIG5hbWUgKyBcIidcIik7XG59XG5cblxuLypcbiAqIEJlZ2lucyBtb2RlbCBjcmVhdGlvbi5cbiAqIEBtZXRob2QgbW9kZWxDcmVhdGlvbkJlZ2luXG4gKi9cbmZ1bmN0aW9uIG1vZGVsQ3JlYXRpb25CZWdpbigpIHtcbiAgICBnZXRMb2dnZXIoKS5kZWJ1ZyhcInN0YXJ0aW5nIG1vZGVsIGNyZWF0aW9uLi4uXCIpO1xufVxuXG5cbi8qXG4gKiBFbmQgbW9kZWwgY3JlYXRpb24uXG4gKiBAbWV0aG9kIG1vZGVsQ3JlYXRpb25FbmRcbiAqL1xuZnVuY3Rpb24gbW9kZWxDcmVhdGlvbkVuZCgpIHtcbiAgICBnZXRMb2dnZXIoKS5kZWJ1ZyhcIm1vZGVsIGNyZWF0aW9uIGVuZGVkXCIpO1xufVxuXG5cbi8qXG4gKiBBbiBlcnJvciBoYXBwZW5lZCB3aGVuIGludm9raW5nIGEgYmVoYXZpb3IuXG4gKiBAbWV0aG9kIGFjdGlvbkludm9rZUVycm9yXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RhdGUgc3RhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBjb21wb25lbnQgaWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgY29tcG9uZW50IGNsYXNzIG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIGFjdGlvbkludm9rZUVycm9yKHN0YXRlLCBpZCwgY2xhc3NOYW1lLCBtZXNzYWdlKSB7XG4gICAgaWYgKGNsYXNzTmFtZSAhPT0gJ0Z1bmN0aW9uJykge1xuICAgICAgICBnZXRMb2dnZXIoKS5lcnJvcihcImVycm9yIHdoZW4gdHJ5aW5nIHRvIGNhbGwgdGhlIG1ldGhvZCAnXCIgKyBzdGF0ZSArIFwiJyBvbiBjb21wb25lbnQgJ1wiICsgaWQgKyBcIicgKGNsYXNzICdcIiArIGNsYXNzTmFtZSArIFwiJyk6IFwiICsgbWVzc2FnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2V0TG9nZ2VyKCkuZXJyb3IoXCJlcnJvciB3aGVuIHRyeWluZyB0byBjYWxsIHRoZSBtZXRob2QgJ1wiICsgc3RhdGUgKyBcIicgb24gY29tcG9uZW50ICdcIiArIGlkICsgXCInOiBcIiArIG1lc3NhZ2UpO1xuICAgIH1cbn1cblxuXG4vKlxuICogSW52YWxpZCBuYW1lIGZvciB0aGUgcHJvcGVydHkgb2YgYSBzY2hlbWEuXG4gKiBAbWV0aG9kIGludmFsaWRTY2hlbWFQcm9wZXJ0eVxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgc2NoZW1hXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcE5hbWUgbmFtZSBvZiB0aGUgcHJvcGVydHlcbiAqL1xuZnVuY3Rpb24gaW52YWxpZFNjaGVtYVByb3BlcnR5KG5hbWUsIHByb3BOYW1lKSB7XG4gICAgZ2V0TG9nZ2VyKCkud2FybihcImludmFsaWQgcHJvcGVydHkgJ1wiICsgcHJvcE5hbWUgKyBcIicgZm9yIHNjaGVtYSAnXCIgKyBuYW1lICsgXCInOiBvbmx5ICdwcm9wZXJ0eScsICdsaW5rJywgJ2NvbGxlY3Rpb24nLCAnbWV0aG9kJyBhbmQgJ2V2ZW50JyBhcmUgYWxsb3dlZC5cIik7XG59XG5cblxuLypcbiAqIEludmFsaWQgZm9ybWF0IGZvciB0aGUgZGVmaW5pdGlvbiBvZiBhIHByb3BlcnR5XG4gKiBAbWV0aG9kIGludmFsaWRQcm9wZXJ0eUZvcm1hdFxuICogQHBhcmFtIHtTdHJpbmd9IG9iaiBkZWZpbml0aW9uIG9mIGEgcHJvcGVydHlcbiAqL1xuZnVuY3Rpb24gaW52YWxpZFByb3BlcnR5Rm9ybWF0KG9iaikge1xuICAgIGdldExvZ2dlcigpLndhcm4oXCJpbnZhbGlkIGZvcm1hdCBmb3IgYSBkZWZpbml0aW9uIG9mIGEgcHJvcGVydHknOiAnXCIgKyBvYmogKyBcIicgaXMgbm90IGFuIG9iamVjdFwiKTtcbn1cblxuXG4vKiBleHBvcnRzICovXG5cblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBjb250YWlucyBhbGwgdGhlIGZ1bmN0aW9ucyB0aGF0IHdyaXRlIGEgbG9nLlxuICogXG4gKiBAbW9kdWxlIHJ1bnRpbWVcbiAqIEBzdWJtb2R1bGUgcnVudGltZS1sb2dcbiAqIEByZXF1aXJlcyBydW50aW1lLWhlbHBlclxuICogQGNsYXNzIHJ1bnRpbWUtbG9nXG4gKiBAc3RhdGljXG4gKi9cblxuXG4vKipcbiAqIFNldCB0aGUgbGV2ZWwgb2YgdGhlIGxvZy5cbiAqIEBtZXRob2QgbGV2ZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBsZXZlbE5hbWUgbmFtZSBvZiB0aGUgbGV2ZWxcbiAqL1xuZXhwb3J0cy5sZXZlbCA9IGxldmVsO1xuXG5cbi8qKlxuICogQSBwcm9wZXJ0eSBvZiBhIHNjaGVtYSBpcyB1bmtub3duLlxuICogQG1ldGhvZCB1bmtub3duUHJvcGVydHlcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eU5hbWUgdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5XG4gKiBAcGFyYW0ge09iamVjdH0gc2NoZW1hIHRoZSBzY2hlbWEgZGVmaW5pdGlvblxuICovXG5leHBvcnRzLnVua25vd25Qcm9wZXJ0eSA9IHVua25vd25Qcm9wZXJ0eTtcblxuXG4vKipcbiAqIEludmFsaWQgdHlwZSBmb3IgYSBwcm9wZXJ0eS5cbiAqIEBtZXRob2QgaW52YWxpZFByb3BlcnR5VHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5TmFtZSBuYW1lIG9mIHRoZSBwZXJvcGV0eVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgdGhlIHR5cGUgZGVmaW5lZCBieSB0aGUgc2NoZW1hXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHkgdGhlIHByb3BlcnR5XG4gKi9cbmV4cG9ydHMuaW52YWxpZFByb3BlcnR5VHlwZSA9IGludmFsaWRQcm9wZXJ0eVR5cGU7XG5cblxuLyoqXG4gKiBJbnZhbGlkIHZhbHVlIGZvciBhIHR5cGUgZW51bS5cbiAqIEBtZXRob2QgaW52YWxpZEVudW1WYWx1ZVxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIHRoZSB2YWx1ZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgdGhlIHR5cGUgZGVmaW5lZCBieSB0aGUgc2NoZW1hXG4gKi9cbmV4cG9ydHMuaW52YWxpZEVudW1WYWx1ZSA9IGludmFsaWRFbnVtVmFsdWU7XG5cblxuLyoqXG4gKiBJbnZhbGlkIGNsYXNzIG5hbWUgZm9yIGEgY29tcG9uZW50LlxuICogQG1ldGhvZCBpbnZhbGlkQ2xhc3NOYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gY29tcG9uZW50SWQgaWQgb2YgdGhlIGNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgdGhlIHR5cGUgZGVmaW5lZCBieSB0aGUgc2NoZW1hXG4gKiBAcGFyYW0ge1N0cmluZ30gY29uc3RydWN0b3JOYW1lIG5hbWUgb2YgdGhlIGNvbXBvbmVudCBjbGFzc1xuICovXG5leHBvcnRzLmludmFsaWRDbGFzc05hbWUgPSBpbnZhbGlkQ2xhc3NOYW1lO1xuXG5cbi8qKlxuICogTWlzc2luZyBhIHByb3BlcnR5LlxuICogQG1ldGhvZCBtaXNzaW5nUHJvcGVydHlcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eU5hbWUgbmFtZSBvZiB0aGUgcHJvcGVydHlcbiAqL1xuZXhwb3J0cy5taXNzaW5nUHJvcGVydHkgPSBtaXNzaW5nUHJvcGVydHk7XG5cblxuLyoqXG4gKiBBIGNsYXNzIGRlZmluaXRpb24gaXMgbWlzc2luZy5cbiAqIEBtZXRob2QgbWlzc2luZ0ltcGxlbWVudGF0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBtaXNzaW5nIHNjaGVtYVxuICovXG5leHBvcnRzLm1pc3NpbmdJbXBsZW1lbnRhdGlvbiA9IG1pc3NpbmdJbXBsZW1lbnRhdGlvbjtcblxuXG4vKipcbiAqIEludmFsaWQgdHlwZSBmb3IgYSBwcm9wZXJ0eSBvZiBhIGNsYXNzIGRlZmluaXRpb24uXG4gKiBAbWV0aG9kIGludmFsaWRUeXBlSW1wXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHkgYSBwcm9wZXJ0eVxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZSBhIGNsYXNzIG5hbWVcbiAqL1xuZXhwb3J0cy5pbnZhbGlkVHlwZUltcCA9IGludmFsaWRUeXBlSW1wO1xuXG5cbi8qKlxuICogTWlzc2luZyBhIHByb3BlcnR5IGZvciBhIGNsYXNzIGRlZmluaXRpb24uXG4gKiBAbWV0aG9kIG1pc3NpbmdQcm9wZXJ0eUltcFxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5IGEgcHJvcGVydHlcbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgYSBjbGFzcyBuYW1lXG4gKi9cbmV4cG9ydHMubWlzc2luZ1Byb3BlcnR5SW1wID0gbWlzc2luZ1Byb3BlcnR5SW1wO1xuXG5cbi8qKlxuICogVW5rb3duIHByb3BlcnR5IGZvciBhIGNsYXNzIGRlZmluaXRpb24uXG4gKiBAbWV0aG9kIHVua25vd25Qcm9wZXJ0eUltcFxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5IGEgcHJvcGVydHlcbiAqIEBwYXJhbSB7T2JqZWN0fSBzY2hlbWEgYSBzY2hlbWFcbiAqL1xuZXhwb3J0cy51bmtub3duUHJvcGVydHlJbXAgPSB1bmtub3duUHJvcGVydHlJbXA7XG5cblxuLyoqXG4gKiBUcnkgdG8gYWRkIGFuIGludmFsaWQgdHlwZS5cbiAqIEBtZXRob2QgaW52YWxpZFR5cGVEZWZpbml0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBhIHR5cGUgZGVmaW5pdGlvblxuICovXG5leHBvcnRzLmludmFsaWRUeXBlRGVmaW5pdGlvbiA9IGludmFsaWRUeXBlRGVmaW5pdGlvbjtcblxuXG4vKipcbiAqIEludmFsaWQgcHJvcGVydHkgdHlwZS5cbiAqIEBtZXRob2QgaW52YWxpZFByb3BlcnR5TmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjb21wb25lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgY2xhc3MgbmFtZSBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlOYW1lIG5hbWUgb2YgdGhlIHByb3BlcnR5XG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlWYWx1ZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHlcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIHR5cGUgZGVmaW5lZCBieSB0aGUgc2NoZW1hXG4gKi9cbmV4cG9ydHMuaW52YWxpZFByb3BlcnR5TmFtZSA9IGludmFsaWRQcm9wZXJ0eU5hbWU7XG5cblxuLyoqXG4gKiBUcnlpbmcgdG8gc2V0IGEgcmVhZC1vbmx5IHByb3BlcnR5LlxuICogQG1ldGhvZCByZWFkT25seVByb3BlcnR5XG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIGNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZSBjbGFzcyBuYW1lIG9mIHRoZSBjb21wb25lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eU5hbWUgbmFtZSBvZiB0aGUgcHJvcGVydHlcbiAqL1xuZXhwb3J0cy5yZWFkT25seVByb3BlcnR5ID0gcmVhZE9ubHlQcm9wZXJ0eTtcblxuXG4vKipcbiAqIEludmFsaWQgZG9jdW1lbnQgb24gYSBSdW50aW1lIGRhdGFiYXNlIGluc2VydCBvcGVyYXRpb24uXG4gKiBAbWV0aG9kIGludmFsaWREb2N1bWVudE9uRGJJbnNlcnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBkb2MgYSBkb2N1bWVudFxuICogQHBhcmFtIHtTdHJpbmd9IGNvbGxlY3Rpb25OYW1lIHRoZSBuYW1lIG9mIHRoZSBjb2xsbGVjdGlvblxuICovXG5leHBvcnRzLmludmFsaWREb2N1bWVudE9uRGJJbnNlcnQgPSBpbnZhbGlkRG9jdW1lbnRPbkRiSW5zZXJ0O1xuXG5cbi8qKlxuICogSW52YWxpZCBwcm9wZXJ0eSBvbiBhIFJ1bnRpbWUgZGF0YWJhc2UgdXBkYXRlIG9wZXJhdGlvbi5cbiAqIEBtZXRob2QgaW52YWxpZFByb3BlcnR5VHlwZU9uRGJVcGRhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb2xsZWN0aW9uTmFtZSB0aGUgbmFtZSBvZiB0aGUgY29sbGxlY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlOYW1lIG5hbWUgb2YgdGhlIHByb3BlcnR5XG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlWYWx1ZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHlcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIGV4cGVjdGVkIHR5cGUgZGVmaW5lZCBieSB0aGUgc2NoZW1hXG4gKi9cbmV4cG9ydHMuaW52YWxpZFByb3BlcnR5VHlwZU9uRGJVcGRhdGUgPSBpbnZhbGlkUHJvcGVydHlUeXBlT25EYlVwZGF0ZTtcblxuXG4vKipcbiAqIENhbGwgYW4gdW5rbm93biBtZXRob2Qgb2YgYSBjbGFzcy5cbiAqIEBtZXRob2QgdW5rbm93bk1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzSWQgaWQgb2YgdGhlIGNsYXNzXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kTmFtZSBuYW1lIG9mIHRoZSBtZXRob2RcbiAqL1xuZXhwb3J0cy51bmtub3duTWV0aG9kID0gdW5rbm93bk1ldGhvZDtcblxuXG4vKipcbiAqIFRyeSB0byBjcmVhdGUgYW4gaW52YWxpZCBSdW50aW1lRGF0YWJhc2VDb2xsZWN0aW9uLlxuICogQG1ldGhvZCBpbnZhbGlkQ29sbGVjdGlvbk5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIGNvbGxlY3Rpb25cbiAqL1xuZXhwb3J0cy5pbnZhbGlkQ29sbGVjdGlvbk5hbWUgPSBpbnZhbGlkQ29sbGVjdGlvbk5hbWU7XG5cblxuLyoqXG4gKiBJbnZhbGlkIHR5cGUgcmVzdWx0IG9mIGEgbWV0aG9kLlxuICogQG1ldGhvZCBpbnZhbGlkUmVzdWx0VHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjb21wb25lbnRcbiAqICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgY2xhc3MgbmFtZSBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kTmFtZSBuYW1lIG90IHRoZSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBlY3RlZFR5cGUgZXhwZWN0ZWQgdHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgY3VycmVudCB0eXBlXG4gKi9cbmV4cG9ydHMuaW52YWxpZFJlc3VsdFR5cGUgPSBpbnZhbGlkUmVzdWx0VHlwZTtcblxuXG4vKipcbiAqIFVua25vd24gY2xhc3MuXG4gKiBAbWV0aG9kIHVua25vd25Db21wb25lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgY2xhc3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb21wb25lbnRJZCBpZiBvZiB0aGUgY29tcG9uZW50XG4gKi9cbmV4cG9ydHMudW5rbm93bkNvbXBvbmVudCA9IHVua25vd25Db21wb25lbnQ7XG5cblxuLyoqXG4gKiBUaGUgUnVudGltZSB3b3JrZmxvdyBoYXMgYmVlbiByZXN0YXJ0ZWQuXG4gKiBAbWV0aG9kIHdvcmtmbG93UmVzdGFydGVkXG4gKi9cbmV4cG9ydHMud29ya2Zsb3dSZXN0YXJ0ZWQgPSB3b3JrZmxvd1Jlc3RhcnRlZDtcblxuXG4vKipcbiAqIEludmFsaWQgcGFyYW1ldGVyIG51bWJlciBmb3IgYSBtZXRob2QuXG4gKiBAbWV0aG9kIGludmFsaWRQYXJhbU51bWJlclxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjb21wb25lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgY2xhc3MgbmFtZSBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kTmFtZSBuYW1lIG9mIHRoZSBjb21wb25lbnRcbiAqL1xuZXhwb3J0cy5pbnZhbGlkUGFyYW1OdW1iZXIgPSBpbnZhbGlkUGFyYW1OdW1iZXI7XG5cblxuLyoqXG4gKiBJbnZhbGlkIHR5cGUgcGFyYW1ldGVycyBmb3IgYSBtZXRob2QuXG4gKiBAbWV0aG9kIGludmFsaWRQYXJhbVR5cGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lIGNsYXNzIG5hbWUgb2YgdGhlIGNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZE5hbWUgbmFtZSBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1OYW1lIG5hbWUgb2YgdGhlIHBhcmFtZXRlclxuICogXG4gKi9cbmV4cG9ydHMuaW52YWxpZFBhcmFtVHlwZSA9IGludmFsaWRQYXJhbVR5cGU7XG5cblxuLyoqXG4gKiBBZGQgYSBtb3JlIHRoYW4gb25lIGJlaGF2aW9yIHRvIGEgc3RhdGUuXG4gKiBAbWV0aG9kIGJlaGF2aW9yTm90VW5pcXVlXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIGNsYXNzXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RhdGVOYW1lIG5hbWUgb2YgdGhlIHN0YXRlXG4gKi9cbmV4cG9ydHMuYmVoYXZpb3JOb3RVbmlxdWUgPSBiZWhhdmlvck5vdFVuaXF1ZTtcblxuXG4vKipcbiAqIENhbiBub3QgYWRkIGEgYmVoYXZpb3Igd2l0aCBhbiBpbnZhbGlkIHN0YXRlLlxuICogQG1ldGhvZCBpbnZhbGlkU3RhdGVPblxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IHN0YXRlTmFtZSBuYW1lIG9mIHRoZSBzdGF0ZVxuICovXG5leHBvcnRzLmludmFsaWRTdGF0ZU9uID0gaW52YWxpZFN0YXRlT247XG5cblxuLyoqXG4gKiBUaGUgY2FsbCB0byBhIHJlbW92ZSBzdGF0ZSBvZiB0aGUgYmVoYXZpb3IgbW9kdWxlIGlzIGludmFsaWQuXG4gKiBAbWV0aG9kIGludmFsaWRTdGF0ZU9mZlxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IHN0YXRlTmFtZSBuYW1lIG9mIHRoZSBzdGF0ZVxuICovXG5leHBvcnRzLmludmFsaWRTdGF0ZU9mZiA9IGludmFsaWRTdGF0ZU9mZjtcblxuXG4vKipcbiAqIFRoZSBtYXN0ZXIgc3lzdGVtIGlzIG5vdCBmb3VuZC5cbiAqIEBtZXRob2QgbWFzdGVyU3lzdGVtTm90Rm91bmRcbiAqL1xuZXhwb3J0cy5tYXN0ZXJTeXN0ZW1Ob3RGb3VuZCA9IG1hc3RlclN5c3RlbU5vdEZvdW5kO1xuXG5cbi8qKlxuICogSW52YWxpZCB0eXBlLlxuICogQG1ldGhvZCBpbnZhbGlkVHlwZVxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIHZhbHVlIG9mIHRoZSB0eXBlXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZU5hbWUgZXhwZWN0ZWMgdHlwZSBkZWZpbmVkIGJ5IHRoZSBzY2hlbWFcbiAqL1xuZXhwb3J0cy5pbnZhbGlkVHlwZSA9IGludmFsaWRUeXBlO1xuXG5cbi8qKlxuICogVW5rbm93biB0eXBlLlxuICogQG1ldGhvZCB1bmtub3duVHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIHZhbHVlXG4gKi9cbmV4cG9ydHMudW5rbm93blR5cGUgPSB1bmtub3duVHlwZTtcblxuXG4vKipcbiAqIEEgY29tcG9uZW50IGhhcyBub3QgYmVlbiBhbHJlYXkgY3JlYXRlZC5cbiAqIEBtZXRob2QgY2FuTm90WWV0VmFsaWRhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lIG5hbWUgb2YgdGhlIGNsYXNzXG4gKi9cbmV4cG9ydHMuY2FuTm90WWV0VmFsaWRhdGUgPSBjYW5Ob3RZZXRWYWxpZGF0ZTtcblxuXG4vKipcbiAqIEEgbWVzc2FnZSBzZW5kIGJ5IHRoZSBjaGFubmVsIGlzIGludmFsaWRcbiAqIEBtZXRob2QgaW52YWxpZENoYW5uZWxFdmVudFxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgbWVzc2FnZSBzZW5kXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIG5hbWUgb2YgdGhlIGV2ZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBleHBlY3RlZCB0eXBlXG4gKi9cbmV4cG9ydHMuaW52YWxpZENoYW5uZWxFdmVudCA9IGludmFsaWRDaGFubmVsRXZlbnQ7XG5cblxuLyoqXG4gKiBpbnZhbGlkIHBhcmFtZXRlciBudW1iZXIgZm9yIGFuIGFjdGlvbiBhZGQgd2l0aCBvbiBtZXRob2QuXG4gKiBAbWV0aG9kIGludmFsaWRQYXJhbU51bWJlck1ldGhvZE9uXG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lIGNsYXNzIG5hbWUgb2YgdGhlIGNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjb21wb25lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2ROYW1lIG5hbWUgb2YgdGhlIGNvbXBvbmVudFxuICovXG5leHBvcnRzLmludmFsaWRQYXJhbU51bWJlck1ldGhvZE9uID0gaW52YWxpZFBhcmFtTnVtYmVyTWV0aG9kT247XG5cblxuLyoqXG4gKiBDaGFuZ2UgdGhlIGlkIG9mIGEgY29tcG9uZW50LlxuICogQG1ldGhvZCB1cGRhdGVVdWlkXG4gKiBAcGFyYW0ge1N0cmluZ30gY3VycmVudElkIGlkIG9mIHRoZSBjb21wb25lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBuZXdJZCBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge0Jvb2xlYW59IGFscmVhZHlVc2VkIG5ld0lkIGFscmVhZHkgdXNlZFxuICovXG5leHBvcnRzLnVwZGF0ZVV1aWQgPSB1cGRhdGVVdWlkO1xuXG5cbi8qKlxuICogVW5rb253IHByb3BlcnR5IG9uIGEgUnVudGltZSBkYXRhYmFzZSB1cGRhdGUgb3BlcmF0aW9uLlxuICogQG1ldGhvZCB1bmtub3duUHJvcGVydHlPbkRiVXBkYXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sbGVjdGlvbk5hbWUgdGhlIG5hbWUgb2YgdGhlIGNvbGxsZWN0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlOYW1lIG5hbWUgb2YgdGhlIHByb3BlcnR5XG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIGNvbXBvbmVudFxuICovXG5leHBvcnRzLnVua25vd25Qcm9wZXJ0eU9uRGJVcGRhdGUgPSB1bmtub3duUHJvcGVydHlPbkRiVXBkYXRlO1xuXG5cbi8qKlxuICogVHJ5IHRvIGNoYW5nZSB0aGUgc3RhdGUgb2YgYSBjb21wb25lbnQgdGhhdCBoYXMgYmVlbiBkZXN0cm95ZWRcbiAqIEBtZXRob2QgaW52YWxpZGVVc2VPZkNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjb21wb25lbnRcbiAqL1xuZXhwb3J0cy5pbnZhbGlkVXNlT2ZDb21wb25lbnQgPSBpbnZhbGlkVXNlT2ZDb21wb25lbnQ7XG5cblxuLyoqXG4gKiBUcnkgdG8gYWRkIGFuIGludmFsaWQgc2NoZW1hLlxuICogQG1ldGhvZCBpbnZhbGlkU2NoZW1hXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBzY2hlbWFcbiAqL1xuZXhwb3J0cy5pbnZhbGlkU2NoZW1hID0gaW52YWxpZFNjaGVtYTtcblxuXG4vKipcbiAqIFRyeSB0byBhZGQgYW4gaW52YWxpZCBtb2RlbC5cbiAqIEBtZXRob2QgaW52YWxpZE1vZGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBtb2RlbFxuICovXG5leHBvcnRzLmludmFsaWRNb2RlbCA9IGludmFsaWRNb2RlbDtcblxuXG4vKipcbiAqIEludmFsaWQgcGFyYW1ldGVycyBzZXQgd2hlbiBjcmVhdGluZyBhbiBpbnN0YW5jZSBvZiBhIGNsYXNzLlxuICogQG1ldGhvZCBpbnZhbGlkUGFyYW1ldGVyc1xuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzSWQgY2xhc3MgbmFtZSBvZiB0aGUgY29tcG9uZW50XG4gKi9cbmV4cG9ydHMuaW52YWxpZFBhcmFtZXRlcnMgPSBpbnZhbGlkUGFyYW1ldGVycztcblxuXG4vKipcbiAqIFRyeSB0byBnZXQgdGhlIHByb3BlcnR5IG9mIGEgZGVzdHJveWVkIGNvbXBvbmVudC5cbiAqIEBtZXRob2QgZGVzdHJveWVkQ29tcG9uZW50Q2FsbFxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5TmFtZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eVxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjb21wb25lbnRcbiAqL1xuZXhwb3J0cy5kZXN0cm95ZWRDb21wb25lbnRDYWxsID0gZGVzdHJveWVkQ29tcG9uZW50Q2FsbDtcblxuXG4vKipcbiAqIEludmFsaWQgcGFyYW1ldGVyIHR5cGUgIHdoZW4gY3JlYXRpbmcgYW4gaW5zdGFuY2Ugb2YgYSBjbGFzcy5cbiAqIEBtZXRob2QgaW52YWxpZENvbmN0cnVjdG9yUGFyYW1ldGVyc1xuICogQHBhcmFtIHtTdHJpbmd9IG9iamVjdCBjb25maWd1cmF0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBzY2hlbWEgbmFtZVxuICovXG5leHBvcnRzLmludmFsaWRDb25jdHJ1Y3RvclBhcmFtZXRlcnMgPSBpbnZhbGlkQ29uY3RydWN0b3JQYXJhbWV0ZXJzO1xuXG5cbi8qKlxuICogR2V0IHRoZSBpbmZvcm1hdGlvbiBvZiBhbiB1bmtvd24gbW9kZWwuXG4gKiBAbWV0aG9kIHVua25vd25Nb2RlbFxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzSWQgaWQgb2YgdGhlIGNsYXNzXG4gKi9cbmV4cG9ydHMudW5rbm93bk1vZGVsID0gdW5rbm93bk1vZGVsO1xuXG5cbi8qKlxuICogQSBzY2hlbWEgaXMgbWlzc2luZy5cbiAqIEBtZXRob2QgbWlzc2luZ1NjaGVtYVxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgc2NoZW1hXG4gKi9cbmV4cG9ydHMubWlzc2luZ1NjaGVtYSA9IG1pc3NpbmdTY2hlbWE7XG5cblxuLyoqXG4gKiBBIGN5Y2xpYyBkZXBlbmRlbmN5IHdhcyBmb3VuZC5cbiAqIEBtZXRob2QgbWlzc2luZ1NjaGVtYVxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgc2NoZW1hIHdoZXJlIHRoZSBjeWNsaWMgZGVwZW5kZW5jeSB3YXMgZm91bmRcbiAqL1xuZXhwb3J0cy5jeWNsaWNEZXBlbmRlbmN5ID0gY3ljbGljRGVwZW5kZW5jeTtcblxuXG4vKipcbiAqIEludmFsaWQgdHlwZSBmb3IgYSB0eXBlIGVudW0uXG4gKiBAbWV0aG9kIGludmFsaWRFbnVtVHlwZVxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIHRoZSB2YWx1ZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVOYW1lIG5hbWUgb2YgdGhlIHR5cGVcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIHR5cGVOYW1lIG9mIHRoZSB0eXBlXG4gKi9cbmV4cG9ydHMuaW52YWxpZEVudW1UeXBlID0gaW52YWxpZEVudW1UeXBlO1xuXG5cbi8qKlxuICogTG9hZCBzY2hlbWEuXG4gKiBAbWV0aG9kIGxvYWRTY2hlbWFcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIHNjaGVtYVxuICovXG5leHBvcnRzLmxvYWRTY2hlbWEgPSBsb2FkU2NoZW1hO1xuXG5cbi8qKlxuICogTG9hZCBtb2RlbC5cbiAqIEBtZXRob2QgbG9hZE1vZGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBtb2RlbFxuICovXG5leHBvcnRzLmxvYWRNb2RlbCA9IGxvYWRNb2RlbDtcblxuXG4vKipcbiAqIExvYWQgdHlwZS5cbiAqIEBtZXRob2QgbG9hZFR5cGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIHR5cGVcbiAqL1xuZXhwb3J0cy5sb2FkVHlwZSA9IGxvYWRUeXBlO1xuXG5cbi8qKiBcbiAqIENvbXBpbGUgc2NoZW1hLlxuICogQG1ldGhvZCBjb21waWxlU2NoZW1hXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBzY2hlbWFcbiAqL1xuZXhwb3J0cy5jb21waWxlU2NoZW1hID0gY29tcGlsZVNjaGVtYTtcblxuXG4vKipcbiAqIEdlbmVyYXRlIG1vZGVsLlxuICogQG1ldGhvZCBnZW5lcmF0ZU1vZGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBtb2RlbFxuICovXG5leHBvcnRzLmdlbmVyYXRlTW9kZWwgPSBnZW5lcmF0ZU1vZGVsO1xuXG5cbi8qKlxuICogQ2hlY2sgbW9kZWwuXG4gKiBAbWV0aG9kIGNoZWNrTW9kZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIG1vZGVsXG4gKi9cbmV4cG9ydHMuY2hlY2tNb2RlbCA9IGNoZWNrTW9kZWw7XG5cblxuLyoqXG4gKiBDcmVhdGUgY29sbGVjdGlvbi5cbiAqIEBtZXRob2QgY3JlYXRlQ29sbGVjdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgY29sbGVjdGlvblxuICovXG5leHBvcnRzLmNyZWF0ZUNvbGxlY3Rpb24gPSBjcmVhdGVDb2xsZWN0aW9uO1xuXG5cbi8qKlxuICogQ3JlYXRlIGNsYXNzLlxuICogQG1ldGhvZCBjcmVhdGVDbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgY2xhc3NcbiAqL1xuZXhwb3J0cy5jcmVhdGVDbGFzcyA9IGNyZWF0ZUNsYXNzO1xuXG5cbi8qXG4gKiBCZWdpbnMgbW9kZWwgY3JlYXRpb24uXG4gKiBAbWV0aG9kIG1vZGVsQ3JlYXRpb25CZWdpblxuICovXG5leHBvcnRzLm1vZGVsQ3JlYXRpb25CZWdpbiA9IG1vZGVsQ3JlYXRpb25CZWdpbjtcblxuXG4vKlxuICogRW5kIG1vZGVsIGNyZWF0aW9uLlxuICogQG1ldGhvZCBtb2RlbENyZWF0aW9uRW5kXG4gKi9cbmV4cG9ydHMubW9kZWxDcmVhdGlvbkVuZCA9IG1vZGVsQ3JlYXRpb25FbmQ7XG5cblxuLyoqXG4gKiBBbiBlcnJvciBoYXBwZW5lZCB3aGVuIGludm9raW5nIGEgYmVoYXZpb3IuXG4gKiBAbWV0aG9kIGFjdGlvbkludm9rZUVycm9yXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RhdGUgc3RhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBjb21wb25lbnQgaWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgY29tcG9uZW50IGNsYXNzIG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gKi9cbmV4cG9ydHMuYWN0aW9uSW52b2tlRXJyb3IgPSBhY3Rpb25JbnZva2VFcnJvcjtcblxuXG4vKipcbiAqIEludmFsaWQgbmFtZSBmb3IgdGhlIHByb3BlcnR5IG9mIGEgc2NoZW1hLlxuICogQG1ldGhvZCBpbnZhbGlkU2NoZW1hUHJvcGVydHlcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIHNjaGVtYVxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BOYW1lIG5hbWUgb2YgdGhlIHByb3BlcnR5XG4gKi9cbmV4cG9ydHMuaW52YWxpZFNjaGVtYVByb3BlcnR5ID0gaW52YWxpZFNjaGVtYVByb3BlcnR5O1xuXG5cbi8qKlxuICogSW52YWxpZCBmb3JtYXQgZm9yIHRoZSBkZWZpbml0aW9uIG9mIGEgcHJvcGVydHlcbiAqIEBtZXRob2QgaW52YWxpZFByb3BlcnR5Rm9ybWF0XG4gKiBAcGFyYW0ge1N0cmluZ30gb2JqIGRlZmluaXRpb24gb2YgYSBwcm9wZXJ0eVxuICovXG5leHBvcnRzLmludmFsaWRQcm9wZXJ0eUZvcm1hdCA9IGludmFsaWRQcm9wZXJ0eUZvcm1hdDtcbiIsIi8qXG4gKiBTeXN0ZW0gUnVudGltZVxuICogXG4gKiBodHRwczovL2Rlc2lnbmZpcnN0LmlvL3N5c3RlbXJ1bnRpbWUvXG4gKiBcbiAqIENvcHlyaWdodCAyMDE3IEVyd2FuIENhcnJpb3VcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFRoaXMgbW9kdWxlIG1hbmFnZXMgUnVudGltZSBtZXRhbW9kZWwuIDxicj5cbiAqIFJ1bnRpbWUgbWV0YW1vZGVsIGxvYWRzIHNjaGVtYXMgYW5kIHR5cGVzLCBhbmFseXplcyB0aGVtIGFuZCBjcmVhdGVzIHRoZSBjb21wb25lbnQgY2xhc3NlcyBhbmQgcmVsYXRlZCBSdW50aW1lRGF0YWJhc2VDb2xsZWN0aW9ucy5cbiAqIFxuICogQG1vZHVsZSBydW50aW1lXG4gKiBAc3VibW9kdWxlIHJ1bnRpbWUtbWV0YW1vZGVsXG4gKiBAcmVxdWlyZXMgcnVudGltZS1kYlxuICogQHJlcXVpcmVzIHJ1bnRpbWUtbG9nXG4gKiBAcmVxdWlyZXMgcnVudGltZS1jb21wb25lbnRcbiAqIEByZXF1aXJlcyBydW50aW1lLXdvcmtmbG93XG4gKiBAY2xhc3MgcnVudGltZS1tZXRhbW9kZWxcbiAqIEBzdGF0aWNcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciAkZGIgPSByZXF1aXJlKCcuL2RiLmpzJyk7XG52YXIgJGxvZyA9IHJlcXVpcmUoJy4vbG9nLmpzJyk7XG52YXIgJGNvbXBvbmVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50LmpzJyk7XG52YXIgJHdvcmtmbG93ID0gcmVxdWlyZSgnLi93b3JrZmxvdy5qcycpO1xudmFyICRoZWxwZXIgPSByZXF1aXJlKCcuL2hlbHBlci5qcycpO1xuXG5cbi8qIFByaXZhdGUgcHJvcGVydGllcyAqL1xuXG5cbnZhciBJRCA9ICdfaWQnLFxuICAgIE5BTUUgPSAnX25hbWUnLFxuICAgIERFU0NSSVBUSU9OID0gJ19kZXNjcmlwdGlvbicsXG4gICAgSU5IRVJJVFMgPSAnX2luaGVyaXQnLFxuICAgIENMQVNTID0gJ19jbGFzcycsXG4gICAgQ09SRSA9ICdfY29yZScsXG4gICAgTUVUSE9EX1RZUEUgPSAnbWV0aG9kJyxcbiAgICBFVkVOVF9UWVBFID0gJ2V2ZW50JyxcbiAgICBQUk9QRVJUWV9UWVBFID0gJ3Byb3BlcnR5JyxcbiAgICBMSU5LX1RZUEUgPSAnbGluaycsXG4gICAgQ09MTEVDVElPTl9UWVBFID0gJ2NvbGxlY3Rpb24nLFxuICAgIGludGVybmFsVHlwZXMgPSBbJ3Byb3BlcnR5JywgJ2NvbGxlY3Rpb24nLCAnbGluaycsICdtZXRob2QnLCAnZXZlbnQnXSxcbiAgICBkZWZhdWx0VHlwZXMgPSBbJ2Jvb2xlYW4nLCAnc3RyaW5nJywgJ251bWJlcicsICdvYmplY3QnLCAnZnVuY3Rpb24nLCAnYXJyYXknLCAnZGF0ZScsICdhbnknXSxcbiAgICBzdG9yZSA9IHtcbiAgICAgICAgbWV0YWRlZjoge30sXG4gICAgICAgIGluaGVyaXRhbmNlOiB7fSxcbiAgICAgICAgaW5oZXJpdGFuY2VUcmVlOiB7fSxcbiAgICAgICAgc2NoZW1hczoge30sXG4gICAgICAgIGNvbXBpbGVkU2NoZW1hczoge30sXG4gICAgICAgIG1vZGVsczoge30sXG4gICAgICAgIGdlbmVyYXRlZE1vZGVsczoge30sXG4gICAgICAgIHN0YXRlczoge30sXG4gICAgICAgIHR5cGU6IHt9XG4gICAgfTtcblxuXG4vKiBQcml2YXRlIG1ldGhvZHMgKi9cblxuXG4vKlxuICogR2VuZXJhdGUgdGhlIG1vZGVscy5cbiAqIEBtZXRob2QgZ2VuZXJhdGVNb2RlbHNcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlTW9kZWxzKCkge1xuICAgIHZhciBhdHQgPSAnJyxcbiAgICAgICAgbmFtZSA9ICcnLFxuICAgICAgICBzY2hlbWFOYW1lID0gJycsXG4gICAgICAgIHNjaGVtYSA9IHt9LFxuICAgICAgICBtb2RlbE5hbWUgPSAnJyxcbiAgICAgICAgbW9kZWxQYXJlbnQgPSBudWxsLFxuICAgICAgICBtb2RlbEV4dCA9IG51bGwsXG4gICAgICAgIG1vZGVsRGVmID0gbnVsbCxcbiAgICAgICAgbW9kZWwgPSB7fSxcbiAgICAgICAgbW9kZWxzID0ge30sXG4gICAgICAgIG1lcmdlZE1vZGVsID0ge30sXG4gICAgICAgIHBhcmVudHMgPSBbXSxcbiAgICAgICAgbGVuZ3RoID0gMCxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIGogPSAwLFxuICAgICAgICBuYkFuY2VzdG9ycyA9IDAsXG4gICAgICAgIHNvcnRJbmhlcml0VHJlZSA9IFtdO1xuXG4gICAgLy8gZGVmYXVsdCB2YWx1ZXNcbiAgICBmb3IgKHNjaGVtYU5hbWUgaW4gc3RvcmUuY29tcGlsZWRTY2hlbWFzKSB7XG4gICAgICAgIHNjaGVtYSA9IHN0b3JlLmNvbXBpbGVkU2NoZW1hc1tzY2hlbWFOYW1lXTtcblxuICAgICAgICAvLyBzZXQgbW9kZWwgaW50ZXJuYWwgcHJvcGVydGllc1xuICAgICAgICBtb2RlbCA9IHtcbiAgICAgICAgICAgIFwiX25hbWVcIjogc2NoZW1hLl9uYW1lLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHNldCBfY29yZVxuICAgICAgICBpZiAodHlwZW9mIHNjaGVtYS5fY29yZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG1vZGVsLl9jb3JlID0gc2NoZW1hLl9jb3JlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2V0IGluaGVyaXRcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2NoZW1hLl9pbmhlcml0KSkge1xuICAgICAgICAgICAgbW9kZWwuX2luaGVyaXQgPSBzY2hlbWEuX2luaGVyaXQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzZXQgY2xhc3NcbiAgICAgICAgaWYgKHR5cGVvZiBzY2hlbWEuX2NsYXNzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbW9kZWwuX2NsYXNzID0gc2NoZW1hLl9jbGFzcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNldCBkZXNjcmlwdGlvbiBcbiAgICAgICAgaWYgKHR5cGVvZiBzY2hlbWEuX2Rlc2NyaXB0aW9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbW9kZWwuX2Rlc2NyaXB0aW9uID0gc2NoZW1hLl9kZXNjcmlwdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vICBzZXQgbW9kZWwgZGVmYXVsdCB2YWx1ZXNcbiAgICAgICAgZm9yIChhdHQgaW4gc2NoZW1hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIHNjaGVtYVthdHRdID09PSAncHJvcGVydHknOlxuICAgICAgICAgICAgICAgICAgICBtb2RlbFthdHRdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYW55XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogYXR0LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBhdHRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBzY2hlbWFbYXR0XSA9PT0gJ2xpbmsnOlxuICAgICAgICAgICAgICAgICAgICBtb2RlbFthdHRdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiQFJ1bnRpbWVDb21wb25lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVhZE9ubHlcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBhdHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGF0dFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHNjaGVtYVthdHRdID09PSAnbWV0aG9kJzpcbiAgICAgICAgICAgICAgICAgICAgbW9kZWxbYXR0XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInBhcmFtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImFueVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlc3VsdFwiOiBcImFueVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBhdHRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBzY2hlbWFbYXR0XSA9PT0gJ2V2ZW50JzpcbiAgICAgICAgICAgICAgICAgICAgbW9kZWxbYXR0XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInBhcmFtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImFueVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IGF0dFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHNjaGVtYVthdHRdID09PSAnY29sbGVjdGlvbic6XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsW2F0dF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogW1wiQFJ1bnRpbWVDb21wb25lbnRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlYWRPbmx5XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IGF0dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogYXR0XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHQuaW5kZXhPZignXycpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9nLmludmFsaWRTY2hlbWFQcm9wZXJ0eShzY2hlbWEuX25hbWUsIGF0dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdG9yZS5nZW5lcmF0ZWRNb2RlbHNbbW9kZWwuX25hbWVdID0gbW9kZWw7XG4gICAgfVxuXG4gICAgLy8gbW9kZWxzIHRvIG92ZXJyaWRlXG4gICAgZm9yIChtb2RlbE5hbWUgaW4gc3RvcmUuZ2VuZXJhdGVkTW9kZWxzKSB7XG4gICAgICAgIG1vZGVsID0gc3RvcmUuZ2VuZXJhdGVkTW9kZWxzW21vZGVsTmFtZV07XG4gICAgICAgIG5hbWUgPSBtb2RlbFtOQU1FXTtcbiAgICAgICAgbW9kZWxFeHQgPSBzdG9yZS5tb2RlbHNbbmFtZV07XG4gICAgICAgIGlmIChtb2RlbEV4dCkge1xuICAgICAgICAgICAgbWVyZ2VkTW9kZWwgPSBtZXJnZShtb2RlbEV4dCwgbW9kZWwpO1xuICAgICAgICAgICAgZGVsZXRlIG1lcmdlZE1vZGVsLl9pZDtcbiAgICAgICAgICAgIHN0b3JlLmdlbmVyYXRlZE1vZGVsc1tuYW1lXSA9IG1lcmdlZE1vZGVsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gaW5oZXJpdGFuY2VcbiAgICBzb3J0SW5oZXJpdFRyZWUgPSBzb3J0SW5oZXJpdGFuY2VUcmVlKCk7XG5cbiAgICBuYkFuY2VzdG9ycyA9IHNvcnRJbmhlcml0VHJlZS5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IG5iQW5jZXN0b3JzOyBpKyspIHtcbiAgICAgICAgbW9kZWxOYW1lID0gc29ydEluaGVyaXRUcmVlW2ldO1xuICAgICAgICBtb2RlbCA9IHN0b3JlLmdlbmVyYXRlZE1vZGVsc1ttb2RlbE5hbWVdO1xuXG4gICAgICAgIGlmIChtb2RlbCkge1xuICAgICAgICAgICAgcGFyZW50cyA9IGdldFBhcmVudHMobW9kZWxOYW1lKTtcbiAgICAgICAgICAgIHBhcmVudHMucmV2ZXJzZSgpO1xuXG4gICAgICAgICAgICB2YXIgbW9kZWxUb01lcmdlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShtb2RlbCkpO1xuXG4gICAgICAgICAgICBsZW5ndGggPSBwYXJlbnRzLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBsZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIG5hbWUgPSBwYXJlbnRzW2pdO1xuICAgICAgICAgICAgICAgIG1vZGVsUGFyZW50ID0gc3RvcmUuZ2VuZXJhdGVkTW9kZWxzW25hbWVdO1xuICAgICAgICAgICAgICAgIGlmIChtb2RlbFBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBtZXJnZWRNb2RlbCA9IG1lcmdlKG1vZGVsUGFyZW50LCBtb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBtZXJnZWRNb2RlbC5faWQ7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmdlbmVyYXRlZE1vZGVsc1ttb2RlbE5hbWVdID0gbWVyZ2VkTW9kZWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBsYXN0IGluaGVyaXQgXG4gICAgICAgICAgICAvLyBpcyB0aGUgb3ZlcnJpZGVuIG1vZGVsXG4gICAgICAgICAgICBtb2RlbEV4dCA9IHN0b3JlLm1vZGVsc1ttb2RlbE5hbWVdO1xuICAgICAgICAgICAgaWYgKG1vZGVsRXh0KSB7XG4gICAgICAgICAgICAgICAgbWVyZ2VkTW9kZWwgPSBtZXJnZShtb2RlbEV4dCwgc3RvcmUuZ2VuZXJhdGVkTW9kZWxzW21vZGVsTmFtZV0pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBtZXJnZWRNb2RlbC5faWQ7XG4gICAgICAgICAgICAgICAgc3RvcmUuZ2VuZXJhdGVkTW9kZWxzW21vZGVsTmFtZV0gPSBtZXJnZWRNb2RlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNhdmUgXG4gICAgZm9yIChtb2RlbE5hbWUgaW4gc3RvcmUuZ2VuZXJhdGVkTW9kZWxzKSB7XG4gICAgICAgIG1vZGVsRGVmID0gc3RvcmUuZ2VuZXJhdGVkTW9kZWxzW21vZGVsTmFtZV07XG4gICAgICAgICRkYi5SdW50aW1lR2VuZXJhdGVkTW9kZWwuaW5zZXJ0KG1vZGVsRGVmKTtcblxuICAgICAgICBpZiAoIW1vZGVsRGVmLl9jb3JlKSB7XG4gICAgICAgICAgICAkbG9nLmdlbmVyYXRlTW9kZWwobW9kZWxOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLypcbiAqIExvYWQgc2NoZW1hcyBhbmQgdHlwZXMgaW4gbWVtb3J5LlxuICogQG1ldGhvZCBsb2FkSW5NZW1vcnlcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGxvYWRJbk1lbW9yeSgpIHtcbiAgICB2YXIgc2NoZW1hcyA9IFtdLFxuICAgICAgICB0eXBlcyA9IFtdLFxuICAgICAgICBzY2hlbWEgPSBudWxsLFxuICAgICAgICBtb2RlbCA9IHt9LFxuICAgICAgICBtb2RlbHMgPSBbXSxcbiAgICAgICAgdHlwZSA9IG51bGwsXG4gICAgICAgIGlkID0gJycsXG4gICAgICAgIG5hbWUgPSAnJyxcbiAgICAgICAgaW5oZXJpdCA9ICcnLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gMDtcblxuICAgIC8vIGluaXQgc3RvcmVcbiAgICBzdG9yZS5pbmhlcml0YW5jZSA9IHt9O1xuICAgIHN0b3JlLmluaGVyaXRhbmNlVHJlZSA9IHt9O1xuICAgIHN0b3JlLnNjaGVtYXMgPSB7fTtcbiAgICBzdG9yZS5jb21waWxlZFNjaGVtYXMgPSB7fTtcbiAgICBzdG9yZS5tb2RlbHMgPSB7fTtcbiAgICBzdG9yZS5nZW5lcmF0ZWRNb2RlbHMgPSB7fTtcbiAgICBzdG9yZS5zdGF0ZXMgPSB7fTtcbiAgICBzdG9yZS50eXBlID0ge307XG5cbiAgICAvLyBsb2FkIHNjaGVtYXNcbiAgICBzY2hlbWFzID0gJGRiLlJ1bnRpbWVTY2hlbWEuZmluZCh7fSk7XG5cbiAgICBsZW5ndGggPSBzY2hlbWFzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc2NoZW1hID0gc2NoZW1hc1tpXTtcblxuICAgICAgICBuYW1lID0gc2NoZW1hW05BTUVdO1xuICAgICAgICBpbmhlcml0ID0gc2NoZW1hW0lOSEVSSVRTXTtcblxuICAgICAgICBzdG9yZS5zY2hlbWFzW25hbWVdID0gc2NoZW1hO1xuICAgICAgICBpZiAoaW5oZXJpdCkge1xuICAgICAgICAgICAgc3RvcmUuaW5oZXJpdGFuY2VbbmFtZV0gPSBpbmhlcml0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzY2hlbWEuX2NvcmUpIHtcbiAgICAgICAgICAgICRsb2cubG9hZFNjaGVtYShuYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGxvYWQgbW9kZWxzXG4gICAgbW9kZWxzID0gJGRiLlJ1bnRpbWVNb2RlbC5maW5kKHt9KTtcblxuICAgIGxlbmd0aCA9IG1vZGVscy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG1vZGVsID0gbW9kZWxzW2ldO1xuICAgICAgICBuYW1lID0gbW9kZWxbTkFNRV07XG5cbiAgICAgICAgc3RvcmUubW9kZWxzW25hbWVdID0gbW9kZWw7XG5cbiAgICAgICAgaWYgKCFtb2RlbC5fY29yZSkge1xuICAgICAgICAgICAgJGxvZy5sb2FkTW9kZWwobmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBsb2FkIHR5cGVzXG4gICAgdHlwZXMgPSAkZGIuUnVudGltZVR5cGUuZmluZCh7fSk7XG5cbiAgICBsZW5ndGggPSB0eXBlcy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHR5cGUgPSB0eXBlc1tpXTtcbiAgICAgICAgc3RvcmUudHlwZVt0eXBlLm5hbWVdID0gdHlwZTtcblxuICAgICAgICBpZiAoIXR5cGUuY29yZSkge1xuICAgICAgICAgICAgJGxvZy5sb2FkVHlwZSh0eXBlLm5hbWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8qXG4gKiBDcmVhdGUgdGhlIGluaGVyaXRhbmNlIHRyZWUuXG4gKiBAbWV0aG9kIGNyZWF0ZUluaGVyaXRhbmNlVHJlZVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5oZXJpdGFuY2VUcmVlKCkge1xuICAgIHZhciBuYW1lID0gJycsXG4gICAgICAgIGMzbGluZXJpemF0aW9uID0gW10sXG4gICAgICAgIGFuY2VzdG9ycyA9IFtdO1xuXG4gICAgLypcbiAgICAgKiBDaGVjayBpZiB3ZSBoYXZlIGZpbmlzZWhkIHRvIGxpbmVyaXplLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGVsdHMgYXJyYXkgb2YgZWx0c1xuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgYWxsIHRoZSBhcnJheXMgYXJlIGVtcHR5XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaXNFbXB0eShlbHRzKSB7XG4gICAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICAgIGxlbmd0aCA9IDAsXG4gICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuXG4gICAgICAgIGxlbmd0aCA9IGVsdHMubGVuZ3RoO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChlbHRzW2ldLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZW1vdmUgYW4gZWx0IGZyb20gYWxsIHRoZSBhcnJheXMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGVsdCBlbGVtZW50IHRvIHJlbW92ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGVsdHMgYXJyYXkgb2YgZWx0c1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3JlbW92ZUNhbmRpZGF0ZShlbHQsIGVsdHMpIHtcbiAgICAgICAgdmFyIGkgPSAwLFxuICAgICAgICAgICAgbGVuZ3RoID0gMCxcbiAgICAgICAgICAgIGFyciA9IFtdO1xuXG4gICAgICAgIGxlbmd0aCA9IGVsdHMubGVuZ3RoO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChlbHRzW2ldLmluZGV4T2YoZWx0KSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGFyciA9IGVsdHNbaV07XG4gICAgICAgICAgICAgICAgYXJyLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICBhcnIucG9wKCk7XG4gICAgICAgICAgICAgICAgYXJyLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICBlbHRzW2ldID0gYXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBDaGVjayB0aGUgZWxlbWVudCBpcyBhIGdvb2QgY2FuZGlkYXRlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBlbHQgZWxlbWVudCB0byByZW1vdmVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBlbHRzIGFycmF5IG9mIGVsdHNcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBlbGVtZW50IGlzIGEgZ29vZCBjYW5kaWRhdGUuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaXNDYW5kaWRhdGUoZWx0LCBlbHRzKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB0cnVlLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBsZW5ndGggPSAwO1xuXG4gICAgICAgIGxlbmd0aCA9IGVsdHMubGVuZ3RoO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChlbHRzW2ldLmluZGV4T2YoZWx0KSA+IDApIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBGaW5kIGEgY2FuZGlkYXRlIGFuZCByZXR1cm4gaXQuXG4gICAgICogQHBhcmFtIHtBcnJheX0gZWx0cyBhcnJheSBvZiBlbHRzXG4gICAgICogQHJldHVybiB7QXJyYXl9IGFycmF5IGNvbnRhaW5pbmcgdGhlIGNhbmRpZGF0ZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2ZpbmRDYW5kaWRhdGUoZWx0cykge1xuICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICBsZW5ndGggPSAwLFxuICAgICAgICAgICAgcmVzdWx0ID0gW107XG5cbiAgICAgICAgbGVuZ3RoID0gZWx0cy5sZW5ndGg7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKF9pc0NhbmRpZGF0ZShlbHRzW2ldWzBdLCBlbHRzKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGVsdHNbaV1bMF0pO1xuICAgICAgICAgICAgICAgIF9yZW1vdmVDYW5kaWRhdGUoZWx0c1tpXVswXSwgZWx0cyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE1lcmdlIHRoZSBhcnJheXMuXG4gICAgICogQHBhcmFtIHtBcnJheX0gZWx0cyBhcnJheSBvZiBlbHRzXG4gICAgICogQHJldHVybiB7QXJyYXl9IGxpc3Qgb2YgY2FuZGlkYXRlcyByZXR1cm5lZCBieSB0aGUgbWVyZ2VcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9tZXJnZShlbHRzKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXSxcbiAgICAgICAgICAgIGNhbmRpZGF0ZXMgPSBbXTtcblxuICAgICAgICBjYW5kaWRhdGVzID0gX2ZpbmRDYW5kaWRhdGUoZWx0cyk7XG4gICAgICAgIHdoaWxlIChjYW5kaWRhdGVzWzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQoY2FuZGlkYXRlcyk7XG4gICAgICAgICAgICBjYW5kaWRhdGVzID0gX2ZpbmRDYW5kaWRhdGUoZWx0cyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIV9pc0VtcHR5KGVsdHMpKSB7XG4gICAgICAgICAgICAkbG9nLmN5Y2xpY0RlcGVuZGVuY3koKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qXG4gICAgICogU3RhcnQgdGhlIGxpbmVyaWVhdGlvbiBmcm9tIGFuIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgZWxlbWVudFxuICAgICAqIEByZXR1cm4ge0FycmF5fSBsaXN0IG9mIGNhbmRpZGF0ZXNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9saW5lcml6ZShuYW1lKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXSxcbiAgICAgICAgICAgIHBhcmVudHMgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbGVuZ3RoID0gMDtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBDaGVjayBpZiB0aGVyZSBpcyBhIGN5Y2xpYyBkZXBlbmRlbmN5LiBcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGl0ZW1cbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGVyZSBpcyBhIGN5Y2xpYyBkZXBlbmRlbmN5XG4gICAgICAgICAqIEBwcml2YXRlIFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2NoZWNrQ3ljbGljRGVwKG5hbWUsIGl0ZW0pIHtcbiAgICAgICAgICAgIHZhciBpc0N5Y2xpY0RlYiA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzdG9yZS5pbmhlcml0YW5jZVtpdGVtXSkgJiYgc3RvcmUuaW5oZXJpdGFuY2VbaXRlbV0uaW5kZXhPZihuYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAkbG9nLmN5Y2xpY0RlcGVuZGVuY3kobmFtZSk7XG4gICAgICAgICAgICAgICAgaXNDeWNsaWNEZWIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlzQ3ljbGljRGViO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc3RvcmUuaW5oZXJpdGFuY2VbbmFtZV0pKSB7XG4gICAgICAgICAgICBwYXJlbnRzID0gc3RvcmUuaW5oZXJpdGFuY2VbbmFtZV0uc2xpY2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRsb2cubWlzc2luZ1NjaGVtYShuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxlbmd0aCA9IHBhcmVudHMubGVuZ3RoO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChfY2hlY2tDeWNsaWNEZXAobmFtZSwgcGFyZW50c1tpXSkpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRzID0gW107XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IFtuYW1lXS5jb25jYXQoX21lcmdlKHBhcmVudHMubWFwKF9saW5lcml6ZSkuY29uY2F0KFtwYXJlbnRzXSkpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IFtuYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZvciAobmFtZSBpbiBzdG9yZS5pbmhlcml0YW5jZSkge1xuICAgICAgICBjM2xpbmVyaXphdGlvbiA9IF9saW5lcml6ZShuYW1lKTtcbiAgICAgICAgYW5jZXN0b3JzID0gYzNsaW5lcml6YXRpb24ucmV2ZXJzZSgpO1xuICAgICAgICBhbmNlc3RvcnMucG9wKCk7XG4gICAgICAgIGlmIChhbmNlc3RvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdG9yZS5pbmhlcml0YW5jZVRyZWVbbmFtZV0gPSBhbmNlc3RvcnM7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLypcbiAqIEV4dGVuZCBhIHNjaGVtYSB3aXRoIHRoZSBwcm9wZXJ0aWVzIG9mIGl0cyBwYXJlbnQuXG4gKiBAbWV0aG9kIGV4dGVuZFxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgc2NoZW1hIHRvIGV4dGVuZFxuICogQHJldHVybiB7SlNPTn0gb2JqZWN0IGV4dGVuZGVkIHdpdGggdGhlIHByb3BlcnRpZXMgb2YgaXRzIHBhcmVudFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKG5hbWUpIHtcbiAgICB2YXIgc29uRXh0ZW5kID0ge30sXG4gICAgICAgIHNvbiA9IHN0b3JlLnNjaGVtYXNbbmFtZV0sXG4gICAgICAgIGFuY2VzdG9ycyA9IHN0b3JlLmluaGVyaXRhbmNlVHJlZVtuYW1lXSxcbiAgICAgICAgbGVuZ3RoID0gMCxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIGFuY2VzdG9yID0gbnVsbCxcbiAgICAgICAgcHJvcCA9ICcnO1xuXG4gICAgaWYgKGFuY2VzdG9ycykge1xuICAgICAgICBsZW5ndGggPSBhbmNlc3RvcnMubGVuZ3RoO1xuICAgICAgICBhbmNlc3RvcnMucmV2ZXJzZSgpO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYW5jZXN0b3IgPSBzdG9yZS5zY2hlbWFzW2FuY2VzdG9yc1tpXV07XG4gICAgICAgIGZvciAocHJvcCBpbiBhbmNlc3Rvcikge1xuICAgICAgICAgICAgaWYgKHByb3AuaW5kZXhPZignXycpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgc29uRXh0ZW5kW3Byb3BdID0gYW5jZXN0b3JbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChwcm9wIGluIHNvbikge1xuICAgICAgICBzb25FeHRlbmRbcHJvcF0gPSBzb25bcHJvcF07XG4gICAgfVxuICAgIHJldHVybiBzb25FeHRlbmQ7XG59XG5cblxuLypcbiAqIEdldCBzb3J0ZWQgSW5oZXJpdGFuY2VUcmVlIHN0cnVjdHVyZS5cbiAqIEBtZXRob2Qgc29ydEluaGVyaXRhbmNlVHJlZVxuICogQHJldHVybiB7QXJyYXl9IHNvcnRlZCBJbmhlcml0YW5jZVRyZWUgc3RydWN0dXJlXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBzb3J0SW5oZXJpdGFuY2VUcmVlKCkge1xuICAgIHZhciByZXN1bHQgPSBbXSxcbiAgICAgICAgdGVtcCA9IHt9LFxuICAgICAgICBrZXlzID0gW10sXG4gICAgICAgIG1vZGVsTmFtZSA9ICcnLFxuICAgICAgICBuYkFuY2VzdG9ycyA9IDA7XG5cbiAgICBmb3IgKG1vZGVsTmFtZSBpbiBzdG9yZS5pbmhlcml0YW5jZVRyZWUpIHtcbiAgICAgICAgbmJBbmNlc3RvcnMgPSBzdG9yZS5pbmhlcml0YW5jZVRyZWVbbW9kZWxOYW1lXS5sZW5ndGg7XG4gICAgICAgIGlmICh0eXBlb2YgdGVtcFtuYkFuY2VzdG9yc10gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0ZW1wW25iQW5jZXN0b3JzXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHRlbXBbbmJBbmNlc3RvcnNdLnB1c2gobW9kZWxOYW1lKTtcbiAgICB9XG5cbiAgICBrZXlzID0gT2JqZWN0LmtleXModGVtcCkuc29ydCgpO1xuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgdGVtcFtpbmRleF0uZm9yRWFjaChmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qXG4gKiBBZGQgdGhlIG1vZGVscy5cbiAqIEBtZXRob2QgY29tcGlsZVNjaGVtYXNcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGVTY2hlbWFzKCkge1xuICAgIHZhciBuYW1lID0gJyc7XG4gICAgZm9yIChuYW1lIGluIHN0b3JlLnNjaGVtYXMpIHtcbiAgICAgICAgaWYgKCFzdG9yZS5zY2hlbWFzW25hbWVdLl9jb3JlKSB7XG4gICAgICAgICAgICAkbG9nLmNvbXBpbGVTY2hlbWEobmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9yZS5jb21waWxlZFNjaGVtYXNbbmFtZV0gPSBleHRlbmQobmFtZSk7XG4gICAgfVxufVxuXG5cbi8qXG4gKiBUZXN0IGlmIGFsbCB0aGUgbW9kZWxzIGFyZSBjb21wbGlhbnRzIHdpdGggdGhlaXIgc2NoZW1hcy5cbiAqIEBtZXRob2QgY2hlY2tNb2RlbHNcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNoZWNrTW9kZWxzKCkge1xuICAgIHZhciBuYW1lID0gJycsXG4gICAgICAgIGNsYXNzRGVmID0gbnVsbCxcbiAgICAgICAgc2NoZW1hID0gJyc7XG5cbiAgICBmb3IgKG5hbWUgaW4gc3RvcmUuZ2VuZXJhdGVkTW9kZWxzKSB7XG4gICAgICAgIGNsYXNzRGVmID0gc3RvcmUuZ2VuZXJhdGVkTW9kZWxzW25hbWVdO1xuICAgICAgICBpZiAoY2xhc3NEZWYpIHtcbiAgICAgICAgICAgIHNjaGVtYSA9IHN0b3JlLmNvbXBpbGVkU2NoZW1hc1tuYW1lXTtcbiAgICAgICAgICAgIGlmIChzY2hlbWEpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNsYXNzRGVmLl9jb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgICRsb2cuY2hlY2tNb2RlbChuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hlY2tJbXAoY2xhc3NEZWYsIHNjaGVtYSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRsb2cubWlzc2luZ0ltcGxlbWVudGF0aW9uKG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8qXG4gKiBHZXQgYWxsIHRoZSBzdGF0ZXMgb2YgYSBzY2hlbWEuXG4gKiBAbWV0aG9kIGdldFN0YXRlc1xuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZ2V0U3RhdGVzKCkge1xuICAgIHZhciBuYW1lID0gJycsXG4gICAgICAgIHNjaGVtYSA9IG51bGwsXG4gICAgICAgIHR5cGUgPSAnJyxcbiAgICAgICAgc3RhdGVzID0gW10sXG4gICAgICAgIGF0dHJpYnV0ZSA9ICcnO1xuXG4gICAgZm9yIChuYW1lIGluIHN0b3JlLmNvbXBpbGVkU2NoZW1hcykge1xuICAgICAgICBzdGF0ZXMgPSBbXTtcbiAgICAgICAgc2NoZW1hID0gc3RvcmUuY29tcGlsZWRTY2hlbWFzW25hbWVdO1xuICAgICAgICBpZiAoc2NoZW1hKSB7XG4gICAgICAgICAgICBmb3IgKGF0dHJpYnV0ZSBpbiBzY2hlbWEpIHtcbiAgICAgICAgICAgICAgICB0eXBlID0gc2NoZW1hW2F0dHJpYnV0ZV07XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS5pbmRleE9mKCdfJykgIT09IDAgJiYgaW50ZXJuYWxUeXBlcy5pbmRleE9mKHR5cGUpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZXMucHVzaChhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdG9yZS5zdGF0ZXNbbmFtZV0gPSBzdGF0ZXM7XG4gICAgfVxufVxuXG5cbi8qXG4gKiBUZXN0IGlmIGEgc2NoZW1hIGlzIGNvbXBsaWFudCB3aXRoIGl0cyBzY2hlbWEuXG4gKiBAbWV0aG9kIGNoZWNrSW1wXG4gKiBAcGFyYW0ge0pTT059IGNsYXNzRGVmIHNjaGVtYSB0byB0ZXN0IFxuICogQHBhcmFtIHtKU09OfSBjbGFzc0ltcCBzY2hlbWEgdG8gdmFsaWRhdGVcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNoZWNrSW1wKGNsYXNzRGVmLCBjbGFzc0ltcCkge1xuICAgIHZhciBwcm9wZXJ0eSA9ICcnLFxuICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgZm9yIChwcm9wZXJ0eSBpbiBjbGFzc0ltcCkge1xuICAgICAgICBpZiAocHJvcGVydHkgIT09IElEICYmXG4gICAgICAgICAgICBwcm9wZXJ0eSAhPT0gTkFNRSAmJlxuICAgICAgICAgICAgcHJvcGVydHkgIT09IERFU0NSSVBUSU9OICYmXG4gICAgICAgICAgICBwcm9wZXJ0eSAhPT0gSU5IRVJJVFMgJiZcbiAgICAgICAgICAgIHByb3BlcnR5ICE9PSBDTEFTUyAmJlxuICAgICAgICAgICAgcHJvcGVydHkgIT09IENPUkUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2xhc3NEZWZbcHJvcGVydHldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gY2xhc3NEZWZbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIGlmICghY2hlY2tTY2hlbWEodmFsdWUsIGNsYXNzSW1wW3Byb3BlcnR5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgJGxvZy5pbnZhbGlkVHlwZUltcChwcm9wZXJ0eSwgY2xhc3NEZWZbTkFNRV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGxvZy5taXNzaW5nUHJvcGVydHlJbXAocHJvcGVydHksIGNsYXNzRGVmW05BTUVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBjaGVjayBpZiBhbGwgcHJvcGVydGllcyBhcmUgdGhlcmVcbiAgICBmb3IgKHByb3BlcnR5IGluIGNsYXNzRGVmKSB7XG4gICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gSUQgJiZcbiAgICAgICAgICAgIHByb3BlcnR5ICE9PSBOQU1FICYmXG4gICAgICAgICAgICBwcm9wZXJ0eSAhPT0gREVTQ1JJUFRJT04gJiZcbiAgICAgICAgICAgIHByb3BlcnR5ICE9PSBJTkhFUklUUyAmJlxuICAgICAgICAgICAgcHJvcGVydHkgIT09IENMQVNTICYmXG4gICAgICAgICAgICBwcm9wZXJ0eSAhPT0gQ09SRSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjbGFzc0ltcFtwcm9wZXJ0eV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgJGxvZy51bmtub3duUHJvcGVydHlJbXAocHJvcGVydHksIGNsYXNzRGVmW05BTUVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4vKlxuICogVGVzdCBpZiBhIHZhbHVlIGhhcyB0aGUgY29ycmVjdCB0eXBlLlxuICogQG1ldGhvZCBjaGVja1NjaGVtYVxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIHZhbHVlIHRvIHRlc3RcbiAqIEBwYXJhbSB7T2JqZWN0fSB0eXBlIHR5cGUgdG8gdGVzdFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgdmFsdWUgaGFzIHRoZSBjb3JyZWN0IHR5cGVcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNoZWNrU2NoZW1hKHZhbHVlLCB0eXBlKSB7XG4gICAgdmFyIHJlc3VsdCA9IHRydWU7XG4gICAgaWYgKGhhc1R5cGUodHlwZSwgJ3N0cmluZycpICYmIGRlZmF1bHRUeXBlcy5pbmRleE9mKHR5cGUpICE9PSAtMSkge1xuICAgICAgICByZXN1bHQgPSBoYXNUeXBlKHZhbHVlLCB0eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBjaGVja0N1c3RvbVNjaGVtYSh2YWx1ZSwgdHlwZSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cblxuLypcbiAqIFRlc3QgaWYgYSB2YWx1ZSBoYXMgY29ycmVjdCBjdXN0b20gdHlwZS5cbiAqIEBtZXRob2QgY2hlY2tDdXN0b21TY2hlbWFcbiAqIEBwYXJhbSB7dHlwZX0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVOYW1lIHR5cGUgdG8gdGVzdFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgdmFsdWUgaGFzIHRoZSBjb3JyZWN0IHR5cGVcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ3VzdG9tU2NoZW1hKHZhbHVlLCB0eXBlTmFtZSkge1xuICAgIHZhciByZXN1bHQgPSB0cnVlLFxuICAgICAgICB0eXBlRGVmID0gc3RvcmUudHlwZVt0eXBlTmFtZV0sXG4gICAgICAgIGxlbmd0aCA9IDAsXG4gICAgICAgIGkgPSAwO1xuXG4gICAgaWYgKCFoYXNUeXBlKHR5cGVEZWYsICd1bmRlZmluZWQnKSkge1xuICAgICAgICBpZiAoIWhhc1R5cGUodmFsdWUsICd1bmRlZmluZWQnKSkge1xuICAgICAgICAgICAgaWYgKHR5cGVEZWYudHlwZSA9PT0gJ2FycmF5Jykge1xuICAgICAgICAgICAgICAgIGxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNUeXBlKHR5cGVEZWYuc2NoZW1hLCAndW5kZWZpbmVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGlzVmFsaWRTY2hlbWEodmFsdWVbaV0sIHR5cGVEZWYuc2NoZW1hKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGlzVmFsaWRUeXBlKHZhbHVlW2ldLCB0eXBlRGVmLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNUeXBlKHR5cGVEZWYuc2NoZW1hLCAndW5kZWZpbmVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gaXNWYWxpZFNjaGVtYSh2YWx1ZSwgdHlwZURlZi5zY2hlbWEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGlzVmFsaWRUeXBlKHZhbHVlLCB0eXBlRGVmLnR5cGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKlxuICogSW5pdCB0aGUgRGF0YWJhc2Ugc3R1Y3R1cmUuXG4gKiBAbWV0aG9kIGluaXREYlN0cnVjdHVyZVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gaW5pdERiU3RydWN0dXJlKCkge1xuICAgICRkYi5jb2xsZWN0aW9uKCdSdW50aW1lTG9nZ2VyJyk7XG4gICAgJGRiLmNvbGxlY3Rpb24oJ1J1bnRpbWVTY2hlbWEnKTtcbiAgICAkZGIuY29sbGVjdGlvbignUnVudGltZU1vZGVsJyk7XG4gICAgJGRiLmNvbGxlY3Rpb24oJ1J1bnRpbWVHZW5lcmF0ZWRNb2RlbCcpO1xuICAgICRkYi5jb2xsZWN0aW9uKCdSdW50aW1lQ2xhc3NJbmZvJyk7XG4gICAgJGRiLmNvbGxlY3Rpb24oJ1J1bnRpbWVCZWhhdmlvcicpO1xuICAgICRkYi5jb2xsZWN0aW9uKCdSdW50aW1lU3RhdGUnKTtcbiAgICAkZGIuY29sbGVjdGlvbignUnVudGltZVR5cGUnKTtcbiAgICAkZGIuY29sbGVjdGlvbignUnVudGltZU1lc3NhZ2UnKTtcbiAgICAkZGIuY29sbGVjdGlvbignUnVudGltZUNoYW5uZWwnKTtcbiAgICAkZGIuY29sbGVjdGlvbignUnVudGltZUxvZycpO1xufVxuXG5cbi8qXG4gKiBDcmVhdGUgdGhlIERhdGFiYXNlIHN0cnVjdHVyZSAoaS5lLiBSdW50aW1lRGF0YWJhc2VDb2xsZWN0aW9uKS5cbiAqIEBtZXRob2QgY3JlYXRlRGJTdHJ1Y3R1cmVcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZURiU3RydWN0dXJlKCkge1xuICAgIHZhciBtb2RlbE5hbWUgPSAnJyxcbiAgICAgICAgbW9kZWxEZWYgPSB7fTtcblxuICAgIGZvciAobW9kZWxOYW1lIGluIHN0b3JlLmdlbmVyYXRlZE1vZGVscykge1xuICAgICAgICBtb2RlbERlZiA9IHN0b3JlLmdlbmVyYXRlZE1vZGVsc1ttb2RlbE5hbWVdO1xuICAgICAgICBpZiAodHlwZW9mICRkYlttb2RlbERlZltOQU1FXV0gPT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICBtb2RlbERlZltDTEFTU10gIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAkZGIuY29sbGVjdGlvbihtb2RlbERlZltOQU1FXSk7XG5cbiAgICAgICAgICAgIGlmICghbW9kZWxEZWYuX2NvcmUpIHtcbiAgICAgICAgICAgICAgICAkbG9nLmNyZWF0ZUNvbGxlY3Rpb24obW9kZWxEZWZbTkFNRV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8qXG4gKiBDcmVhdGUgYWxsIHRoZSBjbGFzc2VzIG9mIHRoZSBtb2RlbC5cbiAqIEBtZXRob2QgY3JlYXRlQ2xhc3NcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUNsYXNzKCkge1xuICAgIHZhciBtb2RlbE5hbWUgPSAnJyxcbiAgICAgICAgbW9kZWxEZWYgPSB7fTtcblxuICAgIGZvciAobW9kZWxOYW1lIGluIHN0b3JlLmdlbmVyYXRlZE1vZGVscykge1xuICAgICAgICBtb2RlbERlZiA9IHN0b3JlLmdlbmVyYXRlZE1vZGVsc1ttb2RlbE5hbWVdO1xuICAgICAgICBpZiAobW9kZWxEZWZbQ0xBU1NdICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgJGNvbXBvbmVudC5jcmVhdGUoe1xuICAgICAgICAgICAgICAgIFwibW9kZWxcIjogbW9kZWxOYW1lXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghbW9kZWxEZWYuX2NvcmUpIHtcbiAgICAgICAgICAgICAgICAkbG9nLmNyZWF0ZUNsYXNzKG1vZGVsTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLypcbiAqIENyZWF0ZSBhbGwgdGhlIENsYXNzSW5mbyBvZiB0aGUgbW9kZWwuXG4gKiBAbWV0aG9kIGNyZWF0ZUNsYXNzSW5mb1xuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ2xhc3NJbmZvKCkge1xuICAgIHZhciBtb2RlbE5hbWUgPSAnJyxcbiAgICAgICAgbW9kZWxEZWYgPSB7fSxcbiAgICAgICAgbmFtZSA9ICcnO1xuXG4gICAgZm9yIChtb2RlbE5hbWUgaW4gc3RvcmUuZ2VuZXJhdGVkTW9kZWxzKSB7XG4gICAgICAgIG1vZGVsRGVmID0gc3RvcmUuZ2VuZXJhdGVkTW9kZWxzW21vZGVsTmFtZV07XG4gICAgICAgIG5hbWUgPSBtb2RlbERlZltOQU1FXSArICdJbmZvJztcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBtb2RlbERlZltDTEFTU10gIT09IGZhbHNlICYmXG4gICAgICAgICAgICBpbmhlcml0RnJvbShtb2RlbERlZltOQU1FXSwgJ1J1bnRpbWVDb21wb25lbnQnKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGlmICghJGNvbXBvbmVudC5nZXQobmFtZSkpIHtcbiAgICAgICAgICAgICAgICAkZGIuUnVudGltZUNsYXNzSW5mby5pbnNlcnQoe1xuICAgICAgICAgICAgICAgICAgICBcIl9pZFwiOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICBcInNjaGVtYVwiOiBzdG9yZS5jb21waWxlZFNjaGVtYXNbbW9kZWxOYW1lXSxcbiAgICAgICAgICAgICAgICAgICAgXCJtb2RlbFwiOiBtb2RlbERlZlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkZGIuUnVudGltZUNsYXNzSW5mby51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBcIl9pZFwiOiBuYW1lXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJfaWRcIjogbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2NoZW1hXCI6IHN0b3JlLmNvbXBpbGVkU2NoZW1hc1ttb2RlbE5hbWVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJtb2RlbFwiOiBtb2RlbERlZlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4vKiBcbiAqIEdldCB0aGUgcmVhbCBuYW1lIG9mIHRoZSByZWZlcmVuY2Ugb2JqZWN0IC8gdHlwZS5cbiAqIEBtZXRob2QgZ2V0UmVmZXJlbmNlXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAqIEByZXR1cm4ge1N0cmluZ30gcmVhbCBuYW1lXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBnZXRSZWZlcmVuY2UodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgnQCcsICcnKTtcbn1cblxuXG4vKlxuICogSXMgdGhlIHZhbHVlIGEgY3VzdG9tIHR5cGUuXG4gKiBAbWV0aG9kIGlzQ3VzdG9tVHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gaXNDdXN0b21UeXBlKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGhhc1R5cGUodmFsdWUsICdzdHJpbmcnKSAmJlxuICAgICAgICBkZWZhdWx0VHlwZXMuaW5kZXhPZih2YWx1ZSkgPT09IC0xICYmXG4gICAgICAgICFpc1JlZmVyZW5jZSh2YWx1ZSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qXG4gKiBJcyB0aGUgdmFsdWUgYSByZWZlcmVuY2UuXG4gKiBAbWV0aG9kIGlzUmVmZXJlbmNlXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBpc1JlZmVyZW5jZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5pbmRleE9mKCdAJykgIT09IC0xO1xufVxuXG5cbi8qXG4gKiBHZXQgdGhlIHJlYWwgdHlwZSBvZiBhIHZhbHVlLlxuICogQG1ldGhvZCBnZXRSZWFsVHlwZVxuICogQHBhcmFtIHt0eXBlfSB2YWx1ZVxuICogQHJldHVybiB7U3RyaW5nfSB0eXBlIG9mIHRoZSB2YWx1ZVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZ2V0UmVhbFR5cGUodmFsdWUpIHtcbiAgICB2YXIgdHlwZSA9ICcnO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHR5cGUgPSAnYXJyYXknO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gICAgfVxuICAgIGlmICh2YWx1ZSA9PT0gJ2FueScpIHtcbiAgICAgICAgdHlwZSA9ICdhbnknO1xuICAgIH1cblxuICAgIHJldHVybiB0eXBlO1xufVxuXG5cbi8qXG4gKiBHZXQgdGhlIGNsYXNzIG5hbWUgb2YgYW4gb2JqZWN0LlxuICogQG1ldGhvZCBnZXRDbGFzc05hbWVcbiAqIEBwYXJhbSB7dHlwZX0gb2JqIG9iamVjdFxuICogQHJldHVybiB7U3RyaW5nfSB0aGUgY2xhc3MgbmFtZSBvZiB0aGUgb2JqZWN0XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBnZXRDbGFzc05hbWUob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuXG4gICAgaWYgKG9iaiAmJiBvYmouY29uc3RydWN0b3IpIHtcbiAgICAgICAgcmVzdWx0ID0gb2JqLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cblxuLypcbiAqIENoZWNrIGlmIHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGVudW0gdmFsdWUuXG4gKiBAbWV0aG9kIGlzVmFsaWRFbnVtVmFsdWVcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICogQHBhcmFtIHtBcnJheX0gZW51bVZhbHVlXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0aGUgY2xhc3MgbmFtZSBvZiB0aGUgb2JqZWN0XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBpc1ZhbGlkRW51bVZhbHVlKHZhbHVlLCBlbnVtVmFsdWUpIHtcbiAgICByZXR1cm4gZW51bVZhbHVlLmluZGV4T2YodmFsdWUpICE9PSAtMTtcbn1cblxuXG4vKlxuICogQ2hlY2sgaWYgYSB2YWx1ZSBoYXMgdGhlIHNwZWNpZmllZCB0eXBlLlxuICogQHBhcmFtIHt0eXBlfSB2YWx1ZVxuICogQHBhcmFtIHt0eXBlfSB0eXBlXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gdHJ1ZSBpcyB2YWx1ZSBoYXMgdHlwZSAndHlwZSdcbiAqL1xuZnVuY3Rpb24gaGFzVHlwZSh2YWx1ZSwgdHlwZSkge1xuICAgIHZhciByZXN1bHQgPSB0cnVlLFxuICAgICAgICBkYXRlID0gbnVsbDtcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgICAgICByZXN1bHQgPSBBcnJheS5pc0FycmF5KHZhbHVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAhaXNOYU4oZGF0ZS5nZXREYXRlKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB2YWx1ZSBpbnN0YW5jZW9mIERhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYW55JzpcbiAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJlc3VsdCA9ICh0eXBlID09PSB0eXBlb2YgdmFsdWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKlxuICogQ2hlY2sgaWYgYW4gYXR0cmlidXRlIG9mIHRoZSBzY2hlbWEgaGFzIGEgc3BlY2lmaWMgdHlwZS5cbiAqIEBtZXRob2QgaXNDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGNvbXBvbmVudCBpZFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgdHlwZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgYXR0cmlidXRlIGhhcyBmb3IgdHlwZSB0eXBlXG4gKi9cbmZ1bmN0aW9uIGNoZWNrVHlwZShuYW1lLCBpZCwgdHlwZSkge1xuICAgIHZhciByZXN1bHQgPSBmYWxzZSxcbiAgICAgICAgY29tcG9uZW50U2NoZW1hID0gc3RvcmUuZ2VuZXJhdGVkTW9kZWxzW2lkXSxcbiAgICAgICAgYXR0cmlidXRlVHlwZSA9ICcnO1xuXG4gICAgaWYgKGNvbXBvbmVudFNjaGVtYSAmJiBjb21wb25lbnRTY2hlbWFbTkFNRV0pIHtcbiAgICAgICAgY29tcG9uZW50U2NoZW1hID0gc3RvcmUuY29tcGlsZWRTY2hlbWFzW2NvbXBvbmVudFNjaGVtYVtOQU1FXV07XG4gICAgfVxuXG4gICAgaWYgKGNvbXBvbmVudFNjaGVtYSkge1xuICAgICAgICBhdHRyaWJ1dGVUeXBlID0gY29tcG9uZW50U2NoZW1hW25hbWVdO1xuICAgICAgICBpZiAoYXR0cmlidXRlVHlwZSA9PT0gdHlwZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8qXG4gKiBNZXJnZSB0d28gc2NoZW1hcy5cbiAqIEBtZXRob2QgbWVyZ2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2Ugc291cmNlIHNjaGVtYVxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCB0YXJnZXQgc2NoZW1hXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG1lcmdlIGFsc28gcHJpdmF0ZSBwcm9wZXJ0aWVzXG4gKiBAcmV0dXJuIHtPYmplY3R9IG1lcmdlZCBzY2hlbWFcbiAqL1xuZnVuY3Rpb24gbWVyZ2Uoc291cmNlLCB0YXJnZXQsIGFsbCkge1xuICAgIHZhciBwcm9wTmFtZSA9ICcnLFxuICAgICAgICByZXN1bHQgPSB0YXJnZXQ7XG5cbiAgICBmb3IgKHByb3BOYW1lIGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KHByb3BOYW1lKSAmJiBwcm9wTmFtZS5pbmRleE9mKCdfJykgIT09IDApIHtcbiAgICAgICAgICAgIHJlc3VsdFtwcm9wTmFtZV0gPSBzb3VyY2VbcHJvcE5hbWVdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8qIFB1YmxpYyBtZXRob2RzICovXG5cblxuLypcbiAqIEFkZCBhIG5ldyBzY2hlbWEuXG4gKiBAbWV0aG9kIHNjaGVtYVxuICogQHBhcmFtIHtKU09OfSBpbXBvcnRlZFNjaGVtYSBzY2hlbWEgdG8gYWRkXG4gKi9cbmZ1bmN0aW9uIHNjaGVtYShpbXBvcnRlZFNjaGVtYSkge1xuICAgIHZhciBpZCA9IG51bGwsXG4gICAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgICBzY2hlbWEgPSBudWxsLFxuICAgICAgICBuYW1lID0gJycsXG4gICAgICAgIG1lcmdlZFNjaGVtYSA9IHt9LFxuICAgICAgICBzY2hlbWFzID0gW107XG5cbiAgICBzY2hlbWEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGltcG9ydGVkU2NoZW1hKSk7XG4gICAgbmFtZSA9IHNjaGVtYVtOQU1FXTtcblxuICAgIGlmICh0eXBlb2Ygc2NoZW1hW0lEXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgc2NoZW1hW0lEXSA9ICRoZWxwZXIuZ2VuZXJhdGVJZCgpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHNjaGVtYVtJTkhFUklUU10gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHNjaGVtYVtJTkhFUklUU10gPSBbJ1J1bnRpbWVDb21wb25lbnQnXTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiBzY2hlbWEgaXMgY29tcGxpYW50IHdpdGggdGhlIG1ldGEgbWV0YSBtb2RlbFxuICAgIGlmIChpc1ZhbGlkT2JqZWN0KHNjaGVtYSwgc3RvcmUubWV0YWRlZi5zY2hlbWEsIGZhbHNlKSkge1xuICAgICAgICBzY2hlbWFzID0gJGRiLlJ1bnRpbWVTY2hlbWEuZmluZCh7ICdfbmFtZSc6IG5hbWUgfSk7XG4gICAgICAgIGlmIChzY2hlbWFzLmxlbmd0aCkge1xuICAgICAgICAgICAgbWVyZ2VkU2NoZW1hID0gbWVyZ2Uoc2NoZW1hLCBzY2hlbWFzWzBdKTtcbiAgICAgICAgICAgIGRlbGV0ZSBtZXJnZWRTY2hlbWEuX2lkO1xuICAgICAgICAgICAgJGRiLlJ1bnRpbWVTY2hlbWEudXBkYXRlKHsgJ19uYW1lJzogbmFtZSB9LCBtZXJnZWRTY2hlbWEpO1xuICAgICAgICAgICAgaWQgPSBzY2hlbWFzWzBdLl9pZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9ICRkYi5SdW50aW1lU2NoZW1hLmluc2VydChzY2hlbWEpO1xuICAgICAgICAgICAgaWQgPSByZXN1bHRbMF07XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICAkbG9nLmludmFsaWRTY2hlbWEoc2NoZW1hW05BTUVdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaWQ7XG59XG5cblxuLypcbiAqIEFkZCBhIG5ldyBtb2RlbC5cbiAqIEBtZXRob2QgbW9kZWxcbiAqIEBwYXJhbSB7SlNPTn0gaW1wb3J0ZWRNb2RlbCBtb2RlbCB0byBhZGRcbiAqL1xuZnVuY3Rpb24gbW9kZWwoaW1wb3J0ZWRNb2RlbCkge1xuICAgIHZhciBtb2RlbCA9IG51bGwsXG4gICAgICAgIGlkID0gbnVsbCxcbiAgICAgICAgcmVzdWx0ID0gW10sXG4gICAgICAgIGluaGVyaXQgPSAnJyxcbiAgICAgICAgbmFtZSA9ICcnLFxuICAgICAgICBtZXJnZWRNb2RlbCA9IHt9LFxuICAgICAgICBtb2RlbHMgPSBbXTtcblxuICAgIG1vZGVsID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShpbXBvcnRlZE1vZGVsKSk7XG4gICAgbmFtZSA9IG1vZGVsW05BTUVdO1xuXG4gICAgaWYgKHR5cGVvZiBtb2RlbFtJRF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vZGVsW0lEXSA9ICRoZWxwZXIuZ2VuZXJhdGVJZCgpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIG1vZGVsIGlzIGNvbXBsaWFudCB3aXRoIHRoZSBtZXRhIG1ldGEgbW9kZWxcbiAgICBpZiAoaXNWYWxpZE9iamVjdChtb2RlbCwgc3RvcmUubWV0YWRlZi5tb2RlbCwgZmFsc2UpKSB7XG4gICAgICAgIG1vZGVscyA9ICRkYi5SdW50aW1lTW9kZWwuZmluZCh7ICdfbmFtZSc6IG5hbWUgfSk7XG4gICAgICAgIGlmIChtb2RlbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBtZXJnZWRNb2RlbCA9IG1lcmdlKG1vZGVsLCBtb2RlbHNbMF0pO1xuICAgICAgICAgICAgZGVsZXRlIG1lcmdlZE1vZGVsLl9pZDtcbiAgICAgICAgICAgICRkYi5SdW50aW1lTW9kZWwudXBkYXRlKHsgJ19uYW1lJzogbmFtZSB9LCBtZXJnZWRNb2RlbCk7XG4gICAgICAgICAgICBpZCA9IG1vZGVsc1swXS5faWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSAkZGIuUnVudGltZU1vZGVsLmluc2VydChtb2RlbCk7XG4gICAgICAgICAgICBpZCA9IHJlc3VsdFswXTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgICRsb2cuaW52YWxpZE1vZGVsKG1vZGVsW05BTUVdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaWQ7XG59XG5cbi8qXG4gKiBBZGQgYSBuZXcgdHlwZS5cbiAqIEBtZXRob2QgdHlwZVxuICogQHBhcmFtIHtKU09OfSBpbXBvcnRlZFR5cGUgdHlwZSB0byBhZGRcbiAqL1xuZnVuY3Rpb24gdHlwZShpbXBvcnRlZFR5cGUpIHtcbiAgICB2YXIgaWQgPSBudWxsLFxuICAgICAgICByZXN1bHQgPSBbXSxcbiAgICAgICAgbmFtZSA9IGltcG9ydGVkVHlwZS5uYW1lO1xuXG4gICAgLy8gY2hlY2sgaWYgdHlwZSBpcyBjb21wbGlhbnQgd2l0aCB0aGUgbWV0YSBtZXRhIG1vZGVsXG4gICAgaWYgKGlzVmFsaWRPYmplY3QoaW1wb3J0ZWRUeXBlLCBzdG9yZS5tZXRhZGVmLnR5cGUpKSB7XG4gICAgICAgIHJlc3VsdCA9ICRkYi5SdW50aW1lVHlwZS5pbnNlcnQoaW1wb3J0ZWRUeXBlKTtcbiAgICAgICAgaWQgPSByZXN1bHRbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJGxvZy5pbnZhbGlkVHlwZURlZmluaXRpb24obmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlkO1xufVxuXG5cbi8qXG4gKiBJbml0IHRoZSBtZXRhbW9kZWwuXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjbGVhcigpO1xuICAgIHN0b3JlLm1ldGFkZWYgPSB7XG4gICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgXCJfaWRcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIl9uYW1lXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJfaW5oZXJpdFwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXSxcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIjogW1wiUnVudGltZUNvbXBvbmVudFwiXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiX2NsYXNzXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJib29sZWFuXCIsXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIl9jb3JlXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJib29sZWFuXCIsXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIl9kZXNjcmlwdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJfbmFtZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiX2luaGVyaXRcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl0sXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIl9jbGFzc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYm9vbGVhblwiLFxuICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJfY29yZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYm9vbGVhblwiLFxuICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJfZGVzY3JpcHRpb25cIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIFwibWFuZGF0b3J5XCI6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHR5cGU6IHtcbiAgICAgICAgICAgIFwiX2lkXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwibmFtZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidHlwZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2NoZW1hXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidmFsdWVcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBbXCJhbnlcIl0sXG4gICAgICAgICAgICAgICAgXCJtYW5kYXRvcnlcIjogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImNvcmVcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIixcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiX2Rlc2NyaXB0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICBcIm1hbmRhdG9yeVwiOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9O1xuICAgIGluaXREYlN0cnVjdHVyZSgpO1xufVxuXG5cbi8qXG4gKiBSZW1vdmUgdGhlIGRhdGEgb2YgdGhlIG1ldGFtb2RlbCBmcm9tIHRoZSBtZW1vcnkuXG4gKiBAbWV0aG9kIGNsZWFyXG4gKi9cbmZ1bmN0aW9uIGNsZWFyKCkge1xuICAgIHN0b3JlID0ge1xuICAgICAgICBtZXRhZGVmOiB7fSxcbiAgICAgICAgaW5oZXJpdGFuY2U6IHt9LFxuICAgICAgICBpbmhlcml0YW5jZVRyZWU6IHt9LFxuICAgICAgICBzY2hlbWFzOiB7fSxcbiAgICAgICAgY29tcGlsZWRTY2hlbWFzOiB7fSxcbiAgICAgICAgbW9kZWxzOiB7fSxcbiAgICAgICAgZ2VuZXJhdGVkTW9kZWxzOiB7fSxcbiAgICAgICAgc3RhdGVzOiB7fSxcbiAgICAgICAgdHlwZToge31cbiAgICB9O1xufVxuXG5cbi8qXG4gKiBDcmVhdGUgdGhlIG1ldGFtb2RlbC5cbiAqIEBtZXRob2QgY3JlYXRlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZSgpIHtcbiAgICAkbG9nLm1vZGVsQ3JlYXRpb25CZWdpbigpO1xuICAgIGxvYWRJbk1lbW9yeSgpO1xuICAgIGNyZWF0ZUluaGVyaXRhbmNlVHJlZSgpO1xuICAgIGNvbXBpbGVTY2hlbWFzKCk7XG4gICAgZ2VuZXJhdGVNb2RlbHMoKTtcbiAgICBjaGVja01vZGVscygpO1xuICAgIGdldFN0YXRlcygpO1xuICAgIGNyZWF0ZURiU3RydWN0dXJlKCk7XG4gICAgY3JlYXRlQ2xhc3MoKTtcbiAgICBjcmVhdGVDbGFzc0luZm8oKTtcbiAgICAkbG9nLm1vZGVsQ3JlYXRpb25FbmQoKTtcbn1cblxuXG4vKlxuICogQ2hlY2sgaWYgYW4gYXR0cmlidXRlIG9mIHRoZSBzY2hlbWEgaXMgYW4gZXZlbnQuXG4gKiBAbWV0aG9kIGlzRXZlbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgY29tcG9uZW50IGlkXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBhdHRyaWJ1dGUgaXMgYW4gZXZlbnRcbiAqL1xuZnVuY3Rpb24gaXNFdmVudChuYW1lLCBpZCkge1xuICAgIHJldHVybiBjaGVja1R5cGUobmFtZSwgaWQsIEVWRU5UX1RZUEUpO1xufVxuXG5cbi8qXG4gKiBDaGVjayBpZiBhbiBhdHRyaWJ1dGUgb2YgdGhlIHNjaGVtYSBpcyBhIHByb3BlcnR5LlxuICogQG1ldGhvZCBpc1Byb3BlcnR5XG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eVxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGNvbXBvbmVudCBpZFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgYXR0cmlidXRlIGlzIGEgcHJvcGVydHlcbiAqL1xuZnVuY3Rpb24gaXNQcm9wZXJ0eShuYW1lLCBpZCkge1xuICAgIHJldHVybiBjaGVja1R5cGUobmFtZSwgaWQsIFBST1BFUlRZX1RZUEUpO1xufVxuXG5cbi8qXG4gKiBDaGVjayBpZiBhbiBhdHRyaWJ1dGUgb2YgdGhlIHNjaGVtYSBpcyBhIGxpbmsuXG4gKiBAbWV0aG9kIGlzTGlua1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgcHJvcGVydHlcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBjb21wb25lbnQgaWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIGF0dHJpYnV0ZSBpcyBhIGxpbmtcbiAqL1xuZnVuY3Rpb24gaXNMaW5rKG5hbWUsIGlkKSB7XG4gICAgcmV0dXJuIGNoZWNrVHlwZShuYW1lLCBpZCwgTElOS19UWVBFKTtcbn1cblxuXG4vKlxuICogQ2hlY2sgaWYgYW4gYXR0cmlidXRlIG9mIHRoZSBzY2hlbWEgaXMgYSBjb2xsZWN0aW9uLlxuICogQG1ldGhvZCBpc0NvbGxlY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIGNvbGxlY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBjb21wb25lbnQgaWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIGF0dHJpYnV0ZSBpcyBhIGNvbGxlY3Rpb25cbiAqL1xuZnVuY3Rpb24gaXNDb2xsZWN0aW9uKG5hbWUsIGlkKSB7XG4gICAgcmV0dXJuIGNoZWNrVHlwZShuYW1lLCBpZCwgQ09MTEVDVElPTl9UWVBFKTtcbn1cblxuXG4vKlxuICogQ2hlY2sgaWYgYW4gYXR0cmlidXRlIG9mIHRoZSBzY2hlbWEgaXMgYSBtZXRob2QuXG4gKiBAbWV0aG9kIGlzTWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBjb21wb25lbnQgaWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIGF0dHJpYnV0ZSBpcyBhIG1ldGhvZFxuICovXG5mdW5jdGlvbiBpc01ldGhvZChuYW1lLCBpZCkge1xuICAgIHJldHVybiBjaGVja1R5cGUobmFtZSwgaWQsIE1FVEhPRF9UWVBFKTtcbn1cblxuXG4vKlxuICogQ2hlY2sgaWYgYW4gYXR0cmlidXRlIG9mIHRoZSBzY2hlbWEgaXMgYSBzdHJ1Y3R1cmUuXG4gKiBAbWV0aG9kIGlzU3RydWN0dXJlXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eXNcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBjb21wb25lbnQgaWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIHByb3BlcnR5IGlzIGEgc3RydWN0dXJlXG4gKi9cbmZ1bmN0aW9uIGlzU3RydWN0dXJlKG5hbWUsIGlkKSB7XG4gICAgdmFyIHJlc3VsdCA9IGZhbHNlLFxuICAgICAgICBtb2RlbCA9IHN0b3JlLmdlbmVyYXRlZE1vZGVsc1tpZF0sXG4gICAgICAgIGF0dHJpYnV0ZVR5cGUgPSAnJyxcbiAgICAgICAgdHlwZSA9ICcnO1xuXG4gICAgaWYgKG1vZGVsW25hbWVdKSB7XG4gICAgICAgIHR5cGUgPSBzdG9yZS50eXBlW21vZGVsW25hbWVdLnR5cGVdO1xuICAgIH1cblxuICAgIGlmICh0eXBlICYmIHR5cGUuc2NoZW1hKSB7XG4gICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKlxuICogQ2hlY2sgaWYgdGhlIG5hbWUgaXMgYSBjb3JyZWN0IHN0YXRlIGZvciB0aGUgY29tcG9uZW50LlxuICogQG1ldGhvZCBpc1ZhbGlkU3RhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIHN0YXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgY29tcG9uZW50IGlkXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBuYW1lIGlzIGEgY29ycmVjdCBzdGF0ZSBmb3IgdGhlIGNvbXBvbmVudFxuICovXG5mdW5jdGlvbiBpc1ZhbGlkU3RhdGUobmFtZSwgaWQpIHtcbiAgICB2YXIgcmVzdWx0ID0gZmFsc2UsXG4gICAgICAgIGNvbXBvbmVudFNjaGVtYSA9IHN0b3JlLmdlbmVyYXRlZE1vZGVsc1tpZF0sXG4gICAgICAgIHN0YXRlID0ge307XG5cbiAgICBpZiAoY29tcG9uZW50U2NoZW1hICYmIGNvbXBvbmVudFNjaGVtYVtOQU1FXSkge1xuICAgICAgICBjb21wb25lbnRTY2hlbWEgPSBzdG9yZS5nZW5lcmF0ZWRNb2RlbHNbY29tcG9uZW50U2NoZW1hW05BTUVdXTtcbiAgICB9XG4gICAgc3RhdGUgPSBzdG9yZS5zdGF0ZXNbY29tcG9uZW50U2NoZW1hW05BTUVdXTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHN0YXRlKSkge1xuICAgICAgICByZXN1bHQgPSBzdGF0ZS5pbmRleE9mKG5hbWUpICE9PSAtMTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qXG4gKiBDaGVjayBpZiBhIHZhbHVlIGlzIGNvbXBsaWFudCB3aXRoIGEgdHlwZS5cbiAqIEBtZXRob2QgaXNWYWxpZFR5cGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3Qgb2JqZWN0IHRvIHZhbGlkYXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSB0eXBlIHRvIHVzZSBmb3IgdmFsaWRhdGlvblxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgb2JqZWN0IGlzIGNvbXBsaWFudCB3aXRoIHRoZSB0eXBlXG4gKi9cbmZ1bmN0aW9uIGlzVmFsaWRUeXBlKHZhbHVlLCB0eXBlTmFtZSkge1xuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuXG5cbiAgICBmdW5jdGlvbiBfaXNWYWxpZEN1c3RvbVR5cGUodmFsdWUsIHR5cGVOYW1lKSB7XG4gICAgICAgIHZhciB0eXBlRGVmID0gc3RvcmUudHlwZVt0eXBlTmFtZV0sXG4gICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHR5cGVEZWYudmFsdWUpICYmIHR5cGVEZWYudmFsdWUuaW5kZXhPZih2YWx1ZSkgPT09IC0xKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAkbG9nLmludmFsaWRFbnVtVmFsdWUodmFsdWUsIHR5cGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9jaGVja1JlZmVyZW5jZSh2YWx1ZSwgdHlwZU5hbWUpIHtcbiAgICAgICAgdmFyIGlzVmFsaWQgPSB0cnVlO1xuICAgICAgICB2YXIgdHlwZVJlZiA9IGdldFJlZmVyZW5jZSh0eXBlTmFtZSk7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSB2YWx1ZTtcblxuICAgICAgICBpZiAodmFsdWUgIT09ICcnICYmIHZhbHVlICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoaGFzVHlwZSh2YWx1ZSwgJ3N0cmluZycpKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50ID0gJGNvbXBvbmVudC5nZXQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdldENsYXNzTmFtZShjb21wb25lbnQpICE9PSB0eXBlUmVmICYmIEpTT04uc3RyaW5naWZ5KGNvbXBvbmVudCkgIT09ICd7fScpIHtcbiAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJGxvZy5pbnZhbGlkVHlwZSh2YWx1ZSwgdHlwZU5hbWUucmVwbGFjZSgnQCcsICcnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfVxuXG4gICAgLypcbiAgICAqIENoZWNrIGlmIGFuIG9iamVjdCBpcyBjb21wbGlhbnQgd2l0aCBhIHR5cGUuXG4gICAgKiBAcmV0dXJuIHtCb29sZWFufSB0aGUgb2JqZWN0IGlzIGNvbXBsaWFudCB3aXRoIHRoZSB0eXBlXG4gICAgKiBAcHJpdmF0ZVxuICAgICovXG4gICAgZnVuY3Rpb24gX2lzVmFsaWRUeXBlKHZhbHVlLCB0eXBlTmFtZSkge1xuICAgICAgICB2YXIgaXNWYWxpZCA9IHRydWUsXG4gICAgICAgICAgICByZWFsVHlwZSA9ICcnLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBsZW5ndGggPSAwO1xuXG4gICAgICAgIHJlYWxUeXBlID0gZ2V0UmVhbFR5cGUodHlwZU5hbWUpO1xuICAgICAgICBzd2l0Y2ggKHJlYWxUeXBlKSB7XG4gICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBoYXNUeXBlKHZhbHVlLCB0eXBlTmFtZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgaXNDdXN0b21UeXBlKHR5cGVOYW1lWzBdKTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gY2hlY2tDdXN0b21TY2hlbWEodmFsdWVbaV0sIHR5cGVOYW1lWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgaXNSZWZlcmVuY2UodHlwZU5hbWVbMF0pOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBfY2hlY2tSZWZlcmVuY2UodmFsdWVbaV0sIHR5cGVOYW1lWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGhhc1R5cGUodmFsdWVbaV0sIHR5cGVOYW1lWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfVxuXG4gICAgaWYgKGhhc1R5cGUodHlwZU5hbWUsICdzdHJpbmcnKSkge1xuICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgIGNhc2UgaXNDdXN0b21UeXBlKHR5cGVOYW1lKTpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBjaGVja0N1c3RvbVNjaGVtYSh2YWx1ZSwgdHlwZU5hbWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGxvZy5pbnZhbGlkRW51bVR5cGUodmFsdWUsIHR5cGVOYW1lLCBzdG9yZS50eXBlW3R5cGVOYW1lXS50eXBlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9pc1ZhbGlkQ3VzdG9tVHlwZSh2YWx1ZSwgdHlwZU5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgaXNSZWZlcmVuY2UodHlwZU5hbWUpOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9jaGVja1JlZmVyZW5jZSh2YWx1ZSwgdHlwZU5hbWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfaXNWYWxpZFR5cGUodmFsdWUsIHR5cGVOYW1lKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cblxuLypcbiAqIENoZWNrIGlmIGEgdmFsdWUgaXMgY29tcGxpYW50IHdpdGggYSB0eXBlIGVudW0uXG4gKiBAbWV0aG9kIGlzVmFsaWRFbnVtXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IHZhbHVlIHZhbHVlIHRvIHZhbGlkYXRlXG4gKiBAcGFyYW0ge1NjaGVtYX0gc2NoZW1hIHNjaGVtYSB0byB1c2UgZm9yIHZhbGlkYXRpb25cbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIG9iamVjdCBpcyBjb21wbGlhbnQgd2l0aCB0aGUgZW51bVxuICovXG5mdW5jdGlvbiBpc1ZhbGlkRW51bSh2YWx1ZSwgc2NoZW1hKSB7XG4gICAgdmFyIHJlc3VsdCA9IHRydWU7XG5cbiAgICBmdW5jdGlvbiBfaXNJbnN0YW5jZU9mKGNvbXBvbmVudCwgY2xhc3NOYW1lKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZSxcbiAgICAgICAgICAgIGNvbXBvbmVudENsYXNzTmFtZSA9ICcnO1xuXG4gICAgICAgIGNvbXBvbmVudENsYXNzTmFtZSA9IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5uYW1lO1xuXG4gICAgICAgIGlmIChjb21wb25lbnRDbGFzc05hbWUgPT09ICdGdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudENsYXNzTmFtZSA9IGNvbXBvbmVudC5uYW1lO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IGNvbXBvbmVudENsYXNzTmFtZSA9PT0gY2xhc3NOYW1lO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgaWYgKGlzUmVmZXJlbmNlKHNjaGVtYS50eXBlKSkge1xuICAgICAgICByZXN1bHQgPSBfaXNJbnN0YW5jZU9mKCRjb21wb25lbnQuZ2V0KHZhbHVlKSwgZ2V0UmVmZXJlbmNlKHNjaGVtYS50eXBlKSkgJiYgc2NoZW1hLnZhbHVlLmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICRsb2cuaW52YWxpZEVudW1WYWx1ZSh2YWx1ZSwgc2NoZW1hLnR5cGUpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gKGhhc1R5cGUodmFsdWUsIHNjaGVtYS50eXBlKSkgJiYgc2NoZW1hLnZhbHVlLmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICRsb2cuaW52YWxpZEVudW1WYWx1ZSh2YWx1ZSwgc2NoZW1hLnR5cGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKlxuICogQ2hlY2sgaWYgdGhlIG9iamVjdCBpcyBjb21wbGlhbnQgd2l0aCB0aGUgc2NoZW1hLlxuICogVXNlIGl0IHRvIHRlc3QgaWYgYSBzY2hlbWEgaXMgY29tcGxpYW50IHdpdGggYSBzY2hlbWFcbiAqIGl0IGlzIHN1cHBvc2VkIHRvIHZhbGlkYXRlLlxuICogQG1ldGhvZCBpc1ZhbGlkU2NoZW1hXG4gKiBAcGFyYW0ge0pTT059IG9iamVjdFxuICogQHBhcmFtIHtKU09OfSBzY2hlbWFcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBpc1ZhbGlkU2NoZW1hKG9iamVjdCwgc2NoZW1hKSB7XG4gICAgdmFyIGZpZWxkTmFtZSA9ICcnLFxuICAgICAgICBmaWVsZCA9IG51bGwsXG4gICAgICAgIHJlc3VsdCA9IHRydWUsXG4gICAgICAgIG1hbmRhdG9yeSA9IHRydWUsXG4gICAgICAgIHR5cGVTY2hlbWEgPSAnJyxcbiAgICAgICAgdHlwZVJlZiA9ICcnLFxuICAgICAgICByZWFsVHlwZSA9ICcnLFxuICAgICAgICBsZW5ndGggPSAwLFxuICAgICAgICBpID0gMDtcblxuICAgIC8qXG4gICAgICogQ2hlY2sgaWYgYSBmaWVsZCBpcyBjb21wbGlhbnQgd2l0aCB0aGUgdHlwZSBvZiB0aGUgcmVmZXJlbmNlLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRoZSBmaWVsZCBpcyBjb21wbGlhbnQgd2l0aCB0aGUgdHlwZSBvZiB0aGUgcmVmZXJlbmNlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaXNWYWxpZFJlZmVyZW5jZSgpIHtcbiAgICAgICAgdmFyIGlzVmFsaWQgPSB0cnVlLFxuICAgICAgICAgICAgZW51bVZhbHVlID0gW107XG5cbiAgICAgICAgdHlwZVJlZiA9IGdldFJlZmVyZW5jZSh0eXBlU2NoZW1hKTtcbiAgICAgICAgdHlwZVJlZiA9IG9iamVjdFt0eXBlUmVmXTtcbiAgICAgICAgaWYgKGlzQ3VzdG9tVHlwZSh0eXBlUmVmKSkge1xuICAgICAgICAgICAgaWYgKHN0b3JlLnR5cGVbdHlwZVJlZl0pIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RvcmUudHlwZVt0eXBlUmVmXS5zY2hlbWEpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGlzVmFsaWRTY2hlbWEoZmllbGQsIHN0b3JlLnR5cGVbdHlwZVJlZl0uc2NoZW1hKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayB0eXBlXG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBoYXNUeXBlKGZpZWxkLCBzdG9yZS50eXBlW3R5cGVSZWZdLnR5cGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGVudW1WYWx1ZSA9IHN0b3JlLnR5cGVbdHlwZVJlZl0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbnVtVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBpc1ZhbGlkRW51bVZhbHVlKGZpZWxkLCBlbnVtVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZVJlZiA9PT0gJ2FycmF5Jykge1xuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBBcnJheS5pc0FycmF5KGZpZWxkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzUmVmZXJlbmNlKHR5cGVSZWYpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBoYXNUeXBlKGZpZWxkLCAnb2JqZWN0JykgfHwgaGFzVHlwZShmaWVsZCwgJ3N0cmluZycpO1xuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIG1heWJlIGhhdmUgYSBtb3JlIHN0cmljdCB2YWxpZGF0aW9uIHRoYW4ganVzdCBhIHR5cGUgY2hlY2tpbmdcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gaGFzVHlwZShmaWVsZCwgdHlwZVJlZik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgICAgICAgJGxvZy5pbnZhbGlkUHJvcGVydHlUeXBlKGZpZWxkTmFtZSwgdHlwZVJlZiwgZmllbGQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogQ2hlY2sgaWYgYSBmaWVsZCBpcyBjb21wbGlhbnQgd2l0aCBhIHR5cGUuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gdGhlIGZpZWxkIGlzIGNvbXBsaWFudCB3aXRoIHRoZSB0eXBlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaXNWYWxpZFR5cGUoKSB7XG4gICAgICAgIHZhciBpc1ZhbGlkID0gdHJ1ZTtcblxuICAgICAgICByZWFsVHlwZSA9IGdldFJlYWxUeXBlKHR5cGVTY2hlbWEpO1xuICAgICAgICBzd2l0Y2ggKHJlYWxUeXBlKSB7XG4gICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgICAgIGlmIChpc0N1c3RvbVR5cGUocmVhbFR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBpc1ZhbGlkU2NoZW1hKGZpZWxkLCB0eXBlU2NoZW1hKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWhhc1R5cGUoZmllbGQsIHR5cGVTY2hlbWEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9nLmludmFsaWRQcm9wZXJ0eVR5cGUoZmllbGROYW1lLCB0eXBlU2NoZW1hLCBmaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgICAgICAgICBsZW5ndGggPSBmaWVsZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0N1c3RvbVR5cGUodHlwZVNjaGVtYVswXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBpc1ZhbGlkU2NoZW1hKGZpZWxkW2ldLCBzdG9yZS50eXBlW3R5cGVTY2hlbWFbMF1dLnNjaGVtYSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWhhc1R5cGUoZmllbGRbaV0sIHR5cGVTY2hlbWFbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5pbnZhbGlkUHJvcGVydHlUeXBlKGZpZWxkW2ldLCB0eXBlU2NoZW1hWzBdLCBmaWVsZFtpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNWYWxpZDtcbiAgICB9XG5cbiAgICAvLyB0eXBlXG5cbiAgICBpZiAoaGFzVHlwZShvYmplY3QsICdvYmplY3QnKSkge1xuICAgICAgICBmb3IgKGZpZWxkTmFtZSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIGZpZWxkID0gb2JqZWN0W2ZpZWxkTmFtZV07XG5cbiAgICAgICAgICAgIGlmIChoYXNUeXBlKHNjaGVtYVtmaWVsZE5hbWVdLCAndW5kZWZpbmVkJykpIHtcbiAgICAgICAgICAgICAgICAkbG9nLnVua25vd25Qcm9wZXJ0eShmaWVsZE5hbWUsIHNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0eXBlU2NoZW1hID0gc2NoZW1hW2ZpZWxkTmFtZV0udHlwZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBpc1JlZmVyZW5jZSh0eXBlU2NoZW1hKTpcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gX2lzVmFsaWRSZWZlcmVuY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gX2lzVmFsaWRUeXBlKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1hbmRhdG9yeVxuICAgICAgICBmb3IgKGZpZWxkTmFtZSBpbiBzY2hlbWEpIHtcbiAgICAgICAgICAgIGZpZWxkID0gc2NoZW1hW2ZpZWxkTmFtZV07XG4gICAgICAgICAgICBtYW5kYXRvcnkgPSBmaWVsZC5tYW5kYXRvcnk7XG4gICAgICAgICAgICBpZiAobWFuZGF0b3J5ID09PSB0cnVlICYmIChoYXNUeXBlKG9iamVjdFtmaWVsZE5hbWVdLCAndW5kZWZpbmVkJykgJiYgb2JqZWN0W2ZpZWxkTmFtZV0gIT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAgICAgICAkbG9nLm1pc3NpbmdQcm9wZXJ0eShmaWVsZE5hbWUpO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICRsb2cuaW52YWxpZFByb3BlcnR5Rm9ybWF0KG9iamVjdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKlxuICogQ2hlY2sgaWYgdGhlIG9iamVjdCBpcyBjb21wbGlhbnQgd2l0aCB0aGUgc2NoZW1hLlxuICogVXNlIGl0IHRvIHRlc3QgaWYgdGhlIGNvbnN0cnVjdG9yIG9mIGFuIG9iamVjdCBpcyBjb21wbGlhbnRcbiAqIHdpdGggdGhlIGRlZmluaXRpb24gb2YgdGhlIGNsYXNzLlxuICogQG1ldGhvZCBpc1ZhbGlkT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IG9iamVjdCB0byB2YWxpZGF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNjaGVtYSBzY2hlbWEgdGhhdCB2YWxpZGF0ZXMgdGhlIG9iamVjdFxuICogQHBhcmFtIHtCb29sZWFufSBzdHJpY3QgdHJ1ZSBpZiB2YWxpZGF0aW9uIGlzIHN0cmljdFxuICogQHBhcmFtIHtCb29sZWFufSBjbGVhblJlZiB0cnVlIGlmIHdlIHJlbW92ZSB0aGUgcmVmZXJlbmNlIHRvIHRoZSBvYmplY3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaXMgdGhlIG9iamVjdCBpcyBjb21wbGlhbnQgd2l0aCB0aGUgc2NoZW1hXG4gKi9cbmZ1bmN0aW9uIGlzVmFsaWRPYmplY3Qob2JqZWN0LCBzY2hlbWEsIHN0cmljdCwgY2xlYW5SZWYpIHtcbiAgICB2YXIgZmllbGROYW1lID0gJycsXG4gICAgICAgIGZpZWxkID0gbnVsbCxcbiAgICAgICAgcmVzdWx0ID0gdHJ1ZSxcbiAgICAgICAgbWFuZGF0b3J5ID0gdHJ1ZSxcbiAgICAgICAgdHlwZVNjaGVtYSA9ICcnLFxuICAgICAgICB0eXBlUmVmID0gJycsXG4gICAgICAgIHJlYWxUeXBlID0gJycsXG4gICAgICAgIGxlbmd0aCA9IDAsXG4gICAgICAgIGkgPSAwO1xuXG4gICAgaWYgKGhhc1R5cGUoc3RyaWN0LCAndW5kZWZpbmVkJykpIHtcbiAgICAgICAgc3RyaWN0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoaGFzVHlwZShjbGVhblJlZiwgJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgIHN0cmljdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogQ2hlY2sgaWYgYSBmaWVsZCBpcyBjb21wbGlhbnQgd2l0aCBhIGN1c3RvbSB0eXBlLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRoZSBmaWVsZCBpcyBjb21wbGlhbnQgd2l0aCB0aGUgY3VzdG9tIHR5cGVcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9pc1ZhbGlkQ3VzdG9tVHlwZShmaWVsZCwgdHlwZVNjaGVtYSkge1xuICAgICAgICB2YXIgaXNWYWxpZCA9IHRydWUsXG4gICAgICAgICAgICByZWFsVHlwZSA9ICcnO1xuXG4gICAgICAgIHJlYWxUeXBlID0gc3RvcmUudHlwZVt0eXBlU2NoZW1hXTtcbiAgICAgICAgaWYgKHJlYWxUeXBlKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICFoYXNUeXBlKHJlYWxUeXBlLnNjaGVtYSwgJ3VuZGVmaW5lZCcpOlxuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gaXNWYWxpZE9iamVjdChmaWVsZCwgcmVhbFR5cGUuc2NoZW1hKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAhaGFzVHlwZShyZWFsVHlwZS52YWx1ZSwgJ3VuZGVmaW5lZCcpOlxuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gaXNWYWxpZEVudW0oZmllbGQsIHJlYWxUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGlzVmFsaWRUeXBlKGZpZWxkLCByZWFsVHlwZS50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBDaGVjayBpZiBhIGZpZWxkIGlzIGNvbXBsaWFudCB3aXRoIHRoZSB0eXBlIG9mIHRoZSByZWZlcmVuY2UuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gdGhlIGZpZWxkIGlzIGNvbXBsaWFudCB3aXRoIHRoZSB0eXBlIG9mIHRoZSByZWZlcmVuY2VcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9pc1ZhbGlkUmVmZXJlbmNlKGZpZWxkLCB0eXBlU2NoZW1hKSB7XG4gICAgICAgIHZhciBpc1ZhbGlkID0gdHJ1ZSxcbiAgICAgICAgICAgIGNvbXAgPSBudWxsLFxuICAgICAgICAgICAgaXNDb21wb25lbnQgPSBmYWxzZTtcblxuICAgICAgICB0eXBlUmVmID0gZ2V0UmVmZXJlbmNlKHR5cGVTY2hlbWEpO1xuICAgICAgICBpZiAoZmllbGQgJiYgZmllbGQuaWQpIHtcbiAgICAgICAgICAgIGNvbXAgPSBmaWVsZDtcbiAgICAgICAgICAgIGlzQ29tcG9uZW50ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbXAgPSAkY29tcG9uZW50LmdldChmaWVsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhc1R5cGUoY29tcCwgJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICBpZiAoIWluaGVyaXRGcm9tKGNvbXAuY29uc3RydWN0b3IubmFtZSwgdHlwZVJlZikpIHtcbiAgICAgICAgICAgICAgICAvL2lmIChnZXRDbGFzc05hbWUoY29tcCkgIT09IHR5cGVSZWYpIHsgdW5jb21tZW50IHRoaXMgbGluZSBmb3IgYSBzdHJpY3QgbW9kZVxuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkbG9nLmludmFsaWRUeXBlKGZpZWxkLCB0eXBlUmVmKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQ29tcG9uZW50ICYmIGNsZWFuUmVmKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFtmaWVsZE5hbWVdID0gY29tcC5pZCgpOyAvLyBzdG9yZSB0aGUgaWQgaW5zdGVhZCB0aGUgZnVsbCBvYmplY3QgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGRlZmF1bHQgdmFsdWUgb2YgYW4gb2JqZWN0ICh7fSBvciBudWxsKVxuICAgICAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAoaGFzVHlwZShmaWVsZCwgJ29iamVjdCcpICYmIGZpZWxkICE9PSBudWxsICYmIE9iamVjdC5rZXlzKGZpZWxkKS5sZW5ndGggPiAwKTpcbiAgICAgICAgICAgICAgICBjYXNlIGhhc1R5cGUoZmllbGQsICdzdHJpbmcnKSAmJiBmaWVsZCAhPT0gJyc6XG4gICAgICAgICAgICAgICAgICAgICRsb2cuY2FuTm90WWV0VmFsaWRhdGUoZmllbGQsIHR5cGVSZWYpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNWYWxpZDtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIENoZWNrIGlmIGEgZmllbGQgaXMgY29tcGxpYW50IHdpdGggYSB0eXBlLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRoZSBmaWVsZCBpcyBjb21wbGlhbnQgd2l0aCB0aGUgdHlwZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2lzVmFsaWRUeXBlKGZpZWxkLCB0eXBlU2NoZW1hKSB7XG4gICAgICAgIHZhciBpc1ZhbGlkID0gdHJ1ZSxcbiAgICAgICAgICAgIGRhdGUgPSBudWxsLFxuICAgICAgICAgICAgdHlwZUFycmF5ID0gJyc7XG5cbiAgICAgICAgcmVhbFR5cGUgPSBnZXRSZWFsVHlwZSh0eXBlU2NoZW1hKTtcbiAgICAgICAgc3dpdGNoIChyZWFsVHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnYW55JzpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICAgICAgaWYgKGlzQ3VzdG9tVHlwZShyZWFsVHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGlzVmFsaWRPYmplY3QoZmllbGQsIHR5cGVTY2hlbWEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlU2NoZW1hID09PSAnYXJyYXknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2V0UmVhbFR5cGUoZmllbGQpICE9PSAnYXJyYXknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5pbnZhbGlkUHJvcGVydHlUeXBlKGZpZWxkTmFtZSwgdHlwZVNjaGVtYSwgZmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlU2NoZW1hID09PSAnZGF0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoZmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSAhaXNOYU4oZGF0ZS5nZXREYXRlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9nLmludmFsaWRQcm9wZXJ0eVR5cGUoZmllbGROYW1lLCB0eXBlU2NoZW1hLCBmaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdldFJlYWxUeXBlKGZpZWxkKSAhPT0gdHlwZVNjaGVtYSAmJiBnZXRSZWFsVHlwZShmaWVsZCkgIT09ICdhbnknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuaW52YWxpZFByb3BlcnR5VHlwZShmaWVsZE5hbWUsIHR5cGVTY2hlbWEsIGZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZmllbGQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9IGZpZWxkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgdHlwZUFycmF5ID0gdHlwZVNjaGVtYVswXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNDdXN0b21UeXBlKHR5cGVBcnJheSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gaXNWYWxpZE9iamVjdChmaWVsZFtpXSwgc3RvcmUudHlwZVt0eXBlQXJyYXldLnNjaGVtYSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNSZWZlcmVuY2UodHlwZUFycmF5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2V0UmVhbFR5cGUoZmllbGRbaV0pICE9PSB0eXBlQXJyYXkgJiYgdHlwZUFycmF5ICE9PSAnYW55Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5pbnZhbGlkUHJvcGVydHlUeXBlKGZpZWxkW2ldLCB0eXBlQXJyYXksIGZpZWxkW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdldFJlYWxUeXBlKGZpZWxkW2ldKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENhc2Ugb2YgYW4gaW1wb3J0IG9mIGEgc3lzdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJGNvbXBvbmVudC5nZXQoZmllbGRbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpbmhlcml0RnJvbShnZXRDbGFzc05hbWUoJGNvbXBvbmVudC5nZXQoZmllbGRbaV0pKSwgZ2V0UmVmZXJlbmNlKHR5cGVBcnJheSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuaW52YWxpZENsYXNzTmFtZShKU09OLnN0cmluZ2lmeShmaWVsZFtpXSksIGdldFJlZmVyZW5jZSh0eXBlQXJyYXkpLCBnZXRDbGFzc05hbWUoJGNvbXBvbmVudC5nZXQoZmllbGRbaV0pKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmllbGRbaV0gIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuY2FuTm90WWV0VmFsaWRhdGUoZmllbGRbaV0sIGdldFJlZmVyZW5jZSh0eXBlQXJyYXkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWluaGVyaXRGcm9tKGdldENsYXNzTmFtZShmaWVsZFtpXSksIGdldFJlZmVyZW5jZSh0eXBlQXJyYXkpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuaW52YWxpZENsYXNzTmFtZShKU09OLnN0cmluZ2lmeShmaWVsZFtpXSksIGdldFJlZmVyZW5jZSh0eXBlQXJyYXkpLCBnZXRDbGFzc05hbWUoZmllbGRbaV0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbGVhblJlZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZFtpXSA9IGZpZWxkW2ldLmlkKCk7IC8vIHN0b3JlIHRoZSBpZCBpbnN0ZWFkIHRoZSBmdWxsIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgJGxvZy5pbnZhbGlkVHlwZShmaWVsZCwgJ2FycmF5Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJGxvZy51bmtub3duVHlwZShmaWVsZCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfVxuXG5cbiAgICAvLyB0eXBlXG4gICAgZm9yIChmaWVsZE5hbWUgaW4gb2JqZWN0KSB7XG4gICAgICAgIGZpZWxkID0gb2JqZWN0W2ZpZWxkTmFtZV07XG5cbiAgICAgICAgaWYgKCFoYXNUeXBlKHNjaGVtYVtmaWVsZE5hbWVdLCAndW5kZWZpbmVkJykgfHwgZmllbGROYW1lID09PSAnX2NvcmUnKSB7XG5cbiAgICAgICAgICAgIC8vIGNhc2Ugb2YgX2NvcmVcbiAgICAgICAgICAgIGlmIChmaWVsZE5hbWUgIT09ICdfY29yZScpIHtcbiAgICAgICAgICAgICAgICB0eXBlU2NoZW1hID0gc2NoZW1hW2ZpZWxkTmFtZV0udHlwZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHlwZVNjaGVtYSA9ICdib29sZWFuJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY2FzIG9mIF9pZFxuICAgICAgICAgICAgaWYgKGZpZWxkTmFtZSA9PT0gJ19pZCcpIHtcbiAgICAgICAgICAgICAgICB0eXBlU2NoZW1hID0gJ3N0cmluZyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAkbG9nLnVua25vd25Qcm9wZXJ0eShmaWVsZE5hbWUsIHNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICAgICAgY2FzZSBpc0N1c3RvbVR5cGUodHlwZVNjaGVtYSk6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2lzVmFsaWRDdXN0b21UeXBlKGZpZWxkLCB0eXBlU2NoZW1hKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgaXNSZWZlcmVuY2UodHlwZVNjaGVtYSk6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2lzVmFsaWRSZWZlcmVuY2UoZmllbGQsIHR5cGVTY2hlbWEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfaXNWYWxpZFR5cGUoZmllbGQsIHR5cGVTY2hlbWEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gbWFuZGF0b3J5XG4gICAgZm9yIChmaWVsZE5hbWUgaW4gc2NoZW1hKSB7XG4gICAgICAgIGZpZWxkID0gc2NoZW1hW2ZpZWxkTmFtZV07XG4gICAgICAgIG1hbmRhdG9yeSA9IGZpZWxkLm1hbmRhdG9yeTtcbiAgICAgICAgaWYgKGhhc1R5cGUob2JqZWN0W2ZpZWxkTmFtZV0sICd1bmRlZmluZWQnKSkge1xuICAgICAgICAgICAgaWYgKG1hbmRhdG9yeSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICRsb2cubWlzc2luZ1Byb3BlcnR5KGZpZWxkTmFtZSk7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qXG4gKiBQcmVwYXJlIHRoZSBvYmplY3QgaW4gb3JkZXIgdG8gYmUgY29tcGxpYW50IHdpdGggdGhlIHNjaGVtYS5cbiAqIEBtZXRob2QgcHJlcGFyZU9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBvYmplY3QgdG8gcHJlcGF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNjaGVtYSBzY2hlbWEgdGhhdCB2YWxpZGF0ZXMgdGhlIG9iamVjdFxuICovXG5mdW5jdGlvbiBwcmVwYXJlT2JqZWN0KG9iamVjdCwgc2NoZW1hKSB7XG4gICAgdmFyIGZpZWxkTmFtZSA9ICcnLFxuICAgICAgICBmaWVsZCA9IG51bGwsXG4gICAgICAgIG1hbmRhdG9yeSA9IHRydWUsXG4gICAgICAgIGRlZmF1bHRWYWx1ZSA9ICcnO1xuXG4gICAgLy8gbWFuZGF0b3J5ICYgZGVmYXVsdCB2YWx1ZVxuICAgIGZvciAoZmllbGROYW1lIGluIHNjaGVtYSkge1xuICAgICAgICBmaWVsZCA9IHNjaGVtYVtmaWVsZE5hbWVdO1xuICAgICAgICBtYW5kYXRvcnkgPSBmaWVsZC5tYW5kYXRvcnk7XG4gICAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHQ7XG4gICAgICAgIGlmIChoYXNUeXBlKG9iamVjdFtmaWVsZE5hbWVdLCAndW5kZWZpbmVkJykpIHtcbiAgICAgICAgICAgIGlmIChtYW5kYXRvcnkgPT09IGZhbHNlICYmICFoYXNUeXBlKGRlZmF1bHRWYWx1ZSwgJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0W2ZpZWxkTmFtZV0gPSBkZWZhdWx0VmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLypcbiAqIEdldCBhIHNjaGVtYS5cbiAqIEBtZXRob2QgZ2V0U2NoZW1hXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBvZiB0aGUgc2NoZW1hXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBzY2hlbWFcbiAqL1xuZnVuY3Rpb24gZ2V0U2NoZW1hKG5hbWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICBpZiAoc3RvcmUuY29tcGlsZWRTY2hlbWFzW25hbWVdKSB7XG4gICAgICAgIHJlc3VsdCA9IHN0b3JlLmNvbXBpbGVkU2NoZW1hc1tuYW1lXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKlxuICogR2V0IGEgbW9kZWwuXG4gKiBAbWV0aG9kIGdldE1vZGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBvZiB0aGUgbW9kZWxcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIG1vZGVsXG4gKi9cbmZ1bmN0aW9uIGdldE1vZGVsKG5hbWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICBpZiAoc3RvcmUuZ2VuZXJhdGVkTW9kZWxzW25hbWVdKSB7XG4gICAgICAgIHJlc3VsdCA9IHN0b3JlLmdlbmVyYXRlZE1vZGVsc1tuYW1lXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKlxuICogR2V0IGEgdHlwZS5cbiAqIEBtZXRob2QgZ2V0VHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgb2YgdGhlIHR5cGVcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIHR5cGVcbiAqL1xuZnVuY3Rpb24gZ2V0VHlwZShuYW1lKSB7XG4gICAgdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgaWYgKHN0b3JlLnR5cGVbbmFtZV0gJiYgc3RvcmUudHlwZVtuYW1lXSkge1xuICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHN0b3JlLnR5cGVbbmFtZV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKlxuICogR2V0IHRoZSBkZWZpbml0aW9uIG9mIHRoZSBtZXRhbW9kZWwuXG4gKiBAbWV0aG9kIGdldE1ldGFEZWZcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIG1ldGFkZWZpbml0aW9uIG9mIHRoZSBtZXRhbW9kZWxcbiAqL1xuZnVuY3Rpb24gZ2V0TWV0YURlZigpIHtcbiAgICB2YXIgcmVzdWx0ID0gc3RvcmUubWV0YWRlZi5zY2hlbWE7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKlxuICogR2V0IHBhcmVudHMgb2YgYSBzY2hlbWEgaWYgYW55LlxuICogQG1ldGhvZCBnZXRcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgc2NoZW1hXG4gKiBAcmV0dXJuIHtBcnJheX0gaWQgaWQgb2YgdGhlIHBhcmVudHNcbiAqL1xuZnVuY3Rpb24gZ2V0UGFyZW50cyhpZCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgIGlmICghc3RvcmUuaW5oZXJpdGFuY2VUcmVlW2lkXSkge1xuICAgICAgICByZXN1bHQgPSBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBzdG9yZS5pbmhlcml0YW5jZVRyZWVbaWRdLnNsaWNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLypcbiAqIENoZWNrIGlmIGEgY2xhc3MgaW5oZXJpdHMgZnJvbSBhbm90aGVyIG9uZVxuICogQG1ldGhvZCBpbmhlcml0RnJvbVxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgY2xhc3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXJlbnROYW1lIG5hbWUgb2YgdGhlIHBhcmVudFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgY29tcG9uZW50IGluaGVyaXQgZnJvbSB0aGUgc3BlY2lmaWMgY2xhc3MgbmFtZVxuICovXG5mdW5jdGlvbiBpbmhlcml0RnJvbShuYW1lLCBwYXJlbnROYW1lKSB7XG4gICAgdmFyIHJlc3VsdCA9IGZhbHNlLFxuICAgICAgICBwYXJlbnRzID0gW10sXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSAwO1xuXG4gICAgLypcbiAgICAgKiBcbiAgICAgKiBDaGVjayBpZiBhIGNsYXNzIGluaGVyaXRzIGZyb20gYW5vdGhlciBvbmVcbiAgICAgKiBAbWV0aG9kIF9zZWFyY2hQYXJlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lIG5hbWUgb2YgdGhlIGNsYXNzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGFuY2VzdG9yTmFtZSBvZiB0aGUgcGFyZW50XG4gICAgICogQHJldHVybnMge0Jvb2xlYW59IHRydWUgaWYgdGhlIGNvbXBvbmVudCBpbmhlcml0IGZyb20gdGhlIHNwZWNpZmljIGNsYXNzIG5hbWVcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9zZWFyY2hQYXJlbnQoY2xhc3NOYW1lLCBhbmNlc3Rvck5hbWUpIHtcbiAgICAgICAgdmFyIGlzQW5jZXN0b3IgPSBmYWxzZSxcbiAgICAgICAgICAgIHBhcmVudHMgPSBbXSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbGVuZ3RoID0gMDtcblxuICAgICAgICBwYXJlbnRzID0gZ2V0UGFyZW50cyhjbGFzc05hbWUpO1xuICAgICAgICBpZiAocGFyZW50cy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIGlmIChwYXJlbnRzLmluZGV4T2YoYW5jZXN0b3JOYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpc0FuY2VzdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzQW5jZXN0b3IgPSBfc2VhcmNoUGFyZW50KHBhcmVudHNbaV0sIGFuY2VzdG9yTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0FuY2VzdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNBbmNlc3RvcjtcbiAgICB9XG5cbiAgICBpZiAobmFtZSAhPT0gcGFyZW50TmFtZSkge1xuICAgICAgICBwYXJlbnRzID0gZ2V0UGFyZW50cyhuYW1lKTtcbiAgICAgICAgbGVuZ3RoID0gcGFyZW50cy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKHBhcmVudHMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICBpZiAocGFyZW50cy5pbmRleE9mKHBhcmVudE5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBfc2VhcmNoUGFyZW50KHBhcmVudHNbaV0sIHBhcmVudE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKiBleHBvcnRzICovXG5cblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBtYW5hZ2VzIFJ1bnRpbWUgbWV0YW1vZGVsLiA8YnI+XG4gKiBSdW50aW1lIG1ldGFtb2RlbCBsb2FkcyBzY2hlbWFzIGFuZCB0eXBlcywgYW5hbHl6ZXMgdGhlbSBhbmQgY3JlYXRlcyB0aGUgY29tcG9uZW50IGNsYXNzZXMgYW5kIHJlbGF0ZWQgUnVudGltZURhdGFiYXNlQ29sbGVjdGlvbnMuXG4gKiBcbiAqIEBtb2R1bGUgcnVudGltZVxuICogQHN1Ym1vZHVsZSBydW50aW1lLW1ldGFtb2RlbFxuICogQHJlcXVpcmVzIHJ1bnRpbWUtZGJcbiAqIEByZXF1aXJlcyBydW50aW1lLWxvZ1xuICogQHJlcXVpcmVzIHJ1bnRpbWUtY29tcG9uZW50XG4gKiBAcmVxdWlyZXMgcnVudGltZS13b3JrZmxvd1xuICogQGNsYXNzIHJ1bnRpbWUtbWV0YW1vZGVsXG4gKiBAc3RhdGljXG4gKi9cblxuXG4vKipcbiAqIEluaXQgdGhlIG1ldGFtb2RlbC5cbiAqIEBtZXRob2QgaW5pdFxuICovXG5leHBvcnRzLmluaXQgPSBpbml0O1xuXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBkYXRhIG9mIHRoZSBtZXRhbW9kZWwgZnJvbSB0aGUgbWVtb3J5LlxuICogQG1ldGhvZCBjbGVhclxuICovXG5leHBvcnRzLmNsZWFyID0gY2xlYXI7XG5cblxuLyoqXG4gKiBBZGQgYSBuZXcgc2NoZW1hLlxuICogQG1ldGhvZCBzY2hlbWFcbiAqIEBwYXJhbSB7SlNPTn0gaW1wb3J0ZWRTY2hlbWEgYSBzY2hlbWEgdG8gYWRkXG4gKi9cbmV4cG9ydHMuc2NoZW1hID0gc2NoZW1hO1xuXG5cbi8qKlxuICogQWRkIGEgbmV3IG1vZGVsLlxuICogQG1ldGhvZCBtb2RlbFxuICogQHBhcmFtIHtKU09OfSBpbXBvcnRlZE1vZGVsIGEgbW9kZSB0byBhZGRcbiAqL1xuZXhwb3J0cy5tb2RlbCA9IG1vZGVsO1xuXG5cbi8qKlxuICogQWRkIGEgbmV3IHR5cGUuXG4gKiBAbWV0aG9kIHR5cGVcbiAqIEBwYXJhbSB7SlNPTn0gaW1wb3J0ZWRUeXBlIHR5cGUgdG8gYWRkXG4gKi9cbmV4cG9ydHMudHlwZSA9IHR5cGU7XG5cblxuLyoqXG4gKiBDcmVhdGUgdGhlIG1ldGFtb2RlbC5cbiAqIEBtZXRob2QgY3JlYXRlXG4gKi9cbmV4cG9ydHMuY3JlYXRlID0gY3JlYXRlO1xuXG5cbi8qKlxuICogR2V0IGEgc2NoZW1hLlxuICogQG1ldGhvZCBnZXRTY2hlbWFcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIHNjaGVtYVxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgc2NoZW1hXG4gKi9cbmV4cG9ydHMuZ2V0U2NoZW1hID0gZ2V0U2NoZW1hO1xuXG5cbi8qKlxuICogR2V0IGEgbW9kZWwuXG4gKiBAbWV0aG9kIGdldE1vZGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBtb2RlbFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgbW9kZWxcbiAqL1xuZXhwb3J0cy5nZXRNb2RlbCA9IGdldE1vZGVsO1xuXG5cbi8qKlxuICogR2V0IHRoZSBkZWZpbml0aW9uIG9mIHRoZSBtZXRhbW9kZWwuXG4gKiBAbWV0aG9kIGdldE1ldGFEZWZcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIG1ldGFkZWZpbml0aW9uIG9mIHRoZSBtZXRhbW9kZWxcbiAqL1xuZXhwb3J0cy5nZXRNZXRhRGVmID0gZ2V0TWV0YURlZjtcblxuXG4vKipcbiAqIEdldCBwYXJlbnRzIG9mIGEgc2hlbWEgaWYgYW55LlxuICogQG1ldGhvZCBnZXRQYXJlbnRzXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIHNjaGVtYVxuICogQHJldHVybiB7QXJyYXl9IGlkIGlkIG9mIHRoZSBwYXJlbnRzXG4gKi9cbmV4cG9ydHMuZ2V0UGFyZW50cyA9IGdldFBhcmVudHM7XG5cblxuLyoqXG4gKiBDaGVjayBpZiBhIGNsYXNzIGluaGVyaXRzIGZyb20gYW5vdGhlciBvbmVcbiAqIEBtZXRob2QgaW5oZXJpdEZyb21cbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIGNsYXNzXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFyZW50TmFtZSBuYW1lIG9mIHRoZSBwYXJlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIGNvbXBvbmVudCBpbmhlcml0IGZyb20gdGhlIHNwZWNpZmljIGNsYXNzIG5hbWVcbiAqL1xuZXhwb3J0cy5pbmhlcml0RnJvbSA9IGluaGVyaXRGcm9tO1xuXG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIG9iamVjdCBpcyBjb21wbGlhbnQgd2l0aCB0aGUgc2NoZW1hLlxuICogVXNlIGl0IHRvIHRlc3QgaWYgdGhlIGNvbnN0cnVjdG9yIG9mIGFuIG9iamVjdCBpcyBjb21wbGlhbnRcbiAqIHdpdGggdGhlIGRlZmluaXRpb24gb2YgdGhlIGNsYXNzLlxuICogQG1ldGhvZCBpc1ZhbGlkT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IG9iamVjdCB0byB2YWxpZGF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNjaGVtYSBzY2hlbWEgdGhhdCB2YWxpZGF0ZXMgdGhlIG9iamVjdFxuICogQHBhcmFtIHtCb29sZWFufSBzdHJpY3QgdHJ1ZSBpZiB2YWxpZGF0aW9uIGlzIHN0cmljdFxuICogQHBhcmFtIHtCb29sZWFufSBjbGVhblJlZiB0cnVlIGlmIHdlIHJlbW92ZSB0aGUgcmVmZXJlbmNlIHRvIHRoZSBvYmplY3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaXMgdGhlIG9iamVjdCBpcyBjb21wbGlhbnQgd2l0aCB0aGUgc2NoZW1hXG4gKi9cbmV4cG9ydHMuaXNWYWxpZE9iamVjdCA9IGlzVmFsaWRPYmplY3Q7XG5cblxuLyoqXG4gKiBQcmVwYXJlIHRoZSBvYmplY3QgaW4gb3JkZXIgdG8gYmUgY29tcGxpYW50IHdpdGggdGhlIHNjaGVtYS5cbiAqIEBtZXRob2QgcHJlcGFyZU9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBvYmplY3QgdG8gcHJlcGFyZVxuICogQHBhcmFtIHtPYmplY3R9IHNjaGVtYSBzY2hlbWEgdGhhdCB2YWxpZGF0ZXMgdGhlIG9iamVjdFxuICovXG5leHBvcnRzLnByZXBhcmVPYmplY3QgPSBwcmVwYXJlT2JqZWN0O1xuXG5cbi8qKlxuICogQ2hlY2sgaWYgYSB2YWx1ZSBpcyBjb21wbGlhbnQgd2l0aCBhIHR5cGUuXG4gKiBAbWV0aG9kIGlzVmFsaWRUeXBlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IG9iamVjdCB0byB2YWxpZGF0ZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgdHlwZSB0byB1c2UgZm9yIHZhbGlkYXRpb25cbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIG9iamVjdCBpcyBjb21wbGlhbnQgd2l0aCB0aGUgdHlwZVxuICovXG5leHBvcnRzLmlzVmFsaWRUeXBlID0gaXNWYWxpZFR5cGU7XG5cblxuLyoqXG4gKiBDaGVjayBpZiBhIHZhbHVlIGlzIGNvbXBsaWFudCB3aXRoIGEgdHlwZSBlbnVtLlxuICogQG1ldGhvZCBpc1ZhbGlkRW51bVxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSB2YWx1ZSB2YWx1ZSB0byB2YWxpZGF0ZVxuICogQHBhcmFtIHtTY2hlbWF9IHNjaGVtYSBzY2hlbWEgdG8gdXNlIGZvciB2YWxpZGF0aW9uXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBvYmplY3QgaXMgY29tcGxpYW50IHdpdGggdGhlIGVudW1cbiAqL1xuZXhwb3J0cy5pc1ZhbGlkRW51bSA9IGlzVmFsaWRFbnVtO1xuXG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIG5hbWUgaXMgYSBjb3JyZWN0IHN0YXRlIGZvciB0aGUgY29tcG9uZW50LlxuICogQG1ldGhvZCBpc1ZhbGlkU3RhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIHN0YXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgY29tcG9uZW50IGlkXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBuYW1lIGlzIGEgY29ycmVjdCBzdGF0ZSBmb3IgdGhlIGNvbXBvbmVudFxuICovXG5leHBvcnRzLmlzVmFsaWRTdGF0ZSA9IGlzVmFsaWRTdGF0ZTtcblxuXG4vKipcbiAqIENoZWNrIGlmIGFuIGF0dHJpYnV0ZSBvZiB0aGUgc2NoZW1hIGlzIGFuIGV2ZW50LlxuICogQG1ldGhvZCBpc0V2ZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBjb21wb25lbnQgaWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIGF0dHJpYnV0ZSBpcyBhbiBldmVudFxuICovXG5leHBvcnRzLmlzRXZlbnQgPSBpc0V2ZW50O1xuXG5cbi8qKlxuICogQ2hlY2sgaWYgYW4gYXR0cmlidXRlIG9mIHRoZSBzY2hlbWEgaXMgYSBwcm9wZXJ0eS5cbiAqIEBtZXRob2QgaXNQcm9wZXJ0eVxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgcHJvcGVydHlcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBjb21wb25lbnQgaWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIGF0dHJpYnV0ZSBpcyBhIHByb3BlcnR5XG4gKi9cbmV4cG9ydHMuaXNQcm9wZXJ0eSA9IGlzUHJvcGVydHk7XG5cblxuLyoqXG4gKiBDaGVjayBpZiBhbiBhdHRyaWJ1dGUgb2YgdGhlIHNjaGVtYSBpcyBhIGxpbmsuXG4gKiBAbWV0aG9kIGlzTGlua1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgcHJvcGVydHlcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBjb21wb25lbnQgaWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIGF0dHJpYnV0ZSBpcyBhIGxpbmtcbiAqL1xuZXhwb3J0cy5pc0xpbmsgPSBpc0xpbms7XG5cblxuLyoqXG4gKiBDaGVjayBpZiBhbiBhdHRyaWJ1dGUgb2YgdGhlIHNjaGVtYSBpcyBhIGNvbGxlY3Rpb24uXG4gKiBAbWV0aG9kIGlzQ29sbGVjdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgY29sbGVjdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGNvbXBvbmVudCBpZFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgYXR0cmlidXRlIGlzIGEgY29sbGVjdGlvblxuICovXG5leHBvcnRzLmlzQ29sbGVjdGlvbiA9IGlzQ29sbGVjdGlvbjtcblxuXG4vKipcbiAqIENoZWNrIGlmIGFuIGF0dHJpYnV0ZSBvZiB0aGUgc2NoZW1hIGlzIGEgbWV0aG9kLlxuICogQG1ldGhvZCBpc01ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgY29tcG9uZW50IGlkXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBhdHRyaWJ1dGUgaXMgYSBtZXRob2RcbiAqL1xuZXhwb3J0cy5pc01ldGhvZCA9IGlzTWV0aG9kO1xuXG5cbi8qKlxuICogQ2hlY2sgaWYgYW4gYXR0cmlidXRlIG9mIHRoZSBzY2hlbWEgaXMgYSBzdHJ1Y3R1cmUuXG4gKiBAbWV0aG9kIGlzU3RydWN0dXJlXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eXNcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBjb21wb25lbnQgaWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIHByb3BlcnR5IGlzIGEgc3RydWN0dXJlXG4gKi9cbmV4cG9ydHMuaXNTdHJ1Y3R1cmUgPSBpc1N0cnVjdHVyZTtcblxuXG4vKipcbiAqIEdldCBhIHR5cGUuXG4gKiBAbWV0aG9kIGdldFR5cGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG9mIHRoZSB0eXBlXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSB0eXBlXG4gKi9cbmV4cG9ydHMuZ2V0VHlwZSA9IGdldFR5cGU7IiwiLypcbiAqIFN5c3RlbSBSdW50aW1lXG4gKiBcbiAqIGh0dHBzOi8vZGVzaWduZmlyc3QuaW8vc3lzdGVtcnVudGltZS9cbiAqIFxuICogQ29weXJpZ2h0IDIwMTcgRXJ3YW4gQ2FycmlvdVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogVGhpcyBtb2R1bGUgaXMgdGhlIG1haW4gbW9kdWxlIG9mIFJ1bnRpbWUuIDxicj5cbiAqIEl0IGluaXRzIFJ1bnRpbWUgbWV0YW1vZGVsIGFuZCBsb2FkcyBSdW50aW1lIGNvcmUgc3lzdGVtLlxuICogXG4gKiBAbW9kdWxlIHJ1bnRpbWVcbiAqIEByZXF1aXJlcyBydW50aW1lLWNvbXBvbmVudFxuICogQHJlcXVpcmVzIHJ1bnRpbWUtbWV0YW1vZGVsXG4gKiBAcmVxdWlyZXMgcnVudGltZS1zeXN0ZW1cbiAqIEByZXF1aXJlcyBydW50aW1lLWhlbHBlclxuICogQG1haW4gcnVudGltZVxuICogQGNsYXNzIHJ1bnRpbWVcbiAqIEBzdGF0aWNcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIGFkZCByZXF1aXJlIGF0IGdsb2JhbCBsZXZlbFxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZ2xvYmFsLnJlcXVpcmUgPSByZXF1aXJlO1xufVxuXG52YXIgJGRiID0gcmVxdWlyZSgnLi9kYi5qcycpO1xudmFyICRjb21wb25lbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudC5qcycpO1xudmFyICRtZXRhbW9kZWwgPSByZXF1aXJlKCcuL21ldGFtb2RlbC5qcycpO1xudmFyICRzeXN0ZW0gPSByZXF1aXJlKCcuLi9idWlsZC9zeXN0ZW0vc3lzdGVtLmpzJyk7XG52YXIgJGhlbHBlciA9IHJlcXVpcmUoJy4vaGVscGVyLmpzJyk7XG5cblxuLyogUHJpdmF0ZSBQcm9wZXJ0eSAqL1xuXG52YXIgc3l0ZW1JZCA9ICcnLFxuICAgIHN5c3RlbSA9ICcnLFxuICAgIGNoYW5uZWwgPSBudWxsO1xuXG5cbi8qIFBvbHlmaWxsICovXG4kaGVscGVyLnBvbHlmaWxsKCk7XG5cbi8qIEluaXQgTWV0YW1vZGVsICovXG5cblxuJG1ldGFtb2RlbC5pbml0KCk7XG5cblxuLyogSW5pdCBydW50aW1lIGZyb20gYSBzeXN0ZW0gKi9cblxuXG5zeXRlbUlkID0gJGRiLnN5c3RlbSgkc3lzdGVtLnN5c3RlbSk7XG5cbnN5c3RlbSA9ICRjb21wb25lbnQuZ2V0KHN5dGVtSWQpO1xuY2hhbm5lbCA9ICRjb21wb25lbnQuZ2V0KCdjaGFubmVsJyk7XG5cbnN5c3RlbS5zdGF0ZSgnaW5zdGFsbGVkJyk7XG5jaGFubmVsLiRzeXN0ZW1JbnN0YWxsZWQoc3l0ZW1JZCk7XG5zeXN0ZW0uc3RhdGUoJ3Jlc29sdmVkJyk7XG5jaGFubmVsLiRzeXN0ZW1SZXNvbHZlZChzeXRlbUlkKTtcbnN5c3RlbS5zdGF0ZSgnc3RhcnRpbmcnKTtcbmNoYW5uZWwuJHN5c3RlbVN0YXJ0ZWQoc3l0ZW1JZCk7XG5cbnN5c3RlbS5tYWluKCk7IC8vIGRlcHJlY2F0ZWRcbnN5c3RlbS5zdGFydCgpO1xuXG5zeXN0ZW0uc3RhdGUoJ2FjdGl2ZScpO1xuXG5cbi8qIGV4cG9ydHMgKi9cblxuXG4vKipcbiAqIFRoaXMgbW9kdWxlIGlzIHRoZSBtYWluIG1vZHVsZSBvZiBSdW50aW1lLiA8YnI+XG4gKiBJdCBpbml0cyBSdW50aW1lIG1ldGFtb2RlbCBhbmQgbG9hZHMgUnVudGltZSBjb3JlIHN5c3RlbS5cbiAqIFxuICogQG1vZHVsZSBydW50aW1lXG4gKiBAcmVxdWlyZXMgcnVudGltZS1jb21wb25lbnRcbiAqIEByZXF1aXJlcyBydW50aW1lLW1ldGFtb2RlbFxuICogQHJlcXVpcmVzIHJ1bnRpbWUtc3lzdGVtXG4gKiBAbWFpbiBydW50aW1lXG4gKiBAY2xhc3MgcnVudGltZVxuICogQHN0YXRpY1xuICovXG5cblxuLyoqXG4gKiBSdW50aW1lIGluc3RhbmNlLlxuICogQHByb3BlcnR5IHJ1bnRpbWVcbiAqIEB0eXBlIFJ1bnRpbWVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAkY29tcG9uZW50LmdldCgncnVudGltZScpOyIsIi8qXG4gKiBTeXN0ZW0gUnVudGltZVxuICogXG4gKiBodHRwczovL2Rlc2lnbmZpcnN0LmlvL3N5c3RlbXJ1bnRpbWUvXG4gKiBcbiAqIENvcHlyaWdodCAyMDE3IEVyd2FuIENhcnJpb3VcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5cbi8qKlxuICogVGhpcyBtb2R1bGUgbWFuYWdlcyB0aGUgc3RhdGVzIG9mIGFsbCB0aGVjb21wb25lbnRzLlxuICogXG4gKiBAbW9kdWxlIHJ1bnRpbWVcbiAqIEBzdWJtb2R1bGUgcnVudGltZS1zdGF0ZVxuICogQHJlcXVpcmVzIHJ1bnRpbWUtZGJcbiAqIEBjbGFzcyBydW50aW1lLXN0YXRlXG4gKiBAc3RhdGljXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgJGRiID0gcmVxdWlyZSgnLi9kYi5qcycpO1xuXG5cbi8qIFByaXZhdGUgcHJvcGVydGllcyAqL1xuXG5cbnZhciBzdG9yZSA9IHt9O1xuXG5cbi8qIFB1YmxpYyBtZXRob2RzICovXG5cblxuLypcbiAqIFNldCB0aGUgc3RhdGUgb2YgYSBjb21wb25lbnQuXG4gKiBAbWV0aG9kIHNldFxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGNvbXBvbmVudCBpZCBvbiB3aGljaCBjaGFuZ2UgdGhlIHN0YXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RhdGUgdGhlIG5ldyBzdGF0ZSBvZiB0aGUgY29tcG9uZW50XG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1ldGVycyBwYXJhbWV0ZXJzXG4gKi9cbmZ1bmN0aW9uIHNldChpZCwgc3RhdGUsIHBhcmFtZXRlcnMpIHtcbiAgICBzdG9yZVtpZF0gPSB7XG4gICAgICAgIFwibmFtZVwiOiBzdGF0ZSxcbiAgICAgICAgXCJwYXJhbWV0ZXJzXCI6IHtcbiAgICAgICAgICAgIFwiZGF0YVwiOiBwYXJhbWV0ZXJzXG4gICAgICAgIH1cbiAgICB9O1xuICAgICRkYi5zdG9yZS5SdW50aW1lU3RhdGVbaWRdID0ge1xuICAgICAgICBcIm5hbWVcIjogc3RhdGUsXG4gICAgICAgIFwicGFyYW1ldGVyc1wiOiB7XG4gICAgICAgICAgICBcImRhdGFcIjogcGFyYW1ldGVyc1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuXG4vKlxuICogR2V0IHRoZSBzdGF0ZSBvZiBhIGNvbXBvbmVudC5cbiAqIEBtZXRob2QgZ2V0IFxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjb21wb25lbnRcbiAqIEByZXR1cm4ge1N0cmluZ30gc3RhdGUgb2YgdGhlIGNvbXBvbmVudFxuICovXG5mdW5jdGlvbiBnZXQoaWQpIHtcbiAgICByZXR1cm4gc3RvcmVbaWRdO1xufVxuXG5cbi8qXG4gKiBSZW1vdmUgYWxsIHRoZSBzdGF0ZXMgb2YgdGhlIGNvbXBvbmVudHMgZnJvbSB0aGUgbWVtb3J5LlxuICogQG1ldGhvZCBjbGVhclxuICovXG5mdW5jdGlvbiBjbGVhcigpIHtcbiAgICBzdG9yZSA9IHt9O1xufVxuXG5cbi8qIGV4cG9ydHMgKi9cblxuXG4vKipcbiAqIFRoaXMgbW9kdWxlIG1hbmFnZXMgdGhlIHN0YXRlcyBvZiBhbGwgdGhlIGNvbXBvbmVudHMuXG4gKiBcbiAqIEBtb2R1bGUgcnVudGltZVxuICogQHN1Ym1vZHVsZSBydW50aW1lLXN0YXRlXG4gKiBAcmVxdWlyZXMgcnVudGltZS1kYlxuICogQGNsYXNzIHJ1bnRpbWUtc3RhdGVcbiAqIEBzdGF0aWNcbiAqL1xuXG5cbi8qKlxuICogU2V0IHRoZSBzdGF0ZSBvZiBhIGNvbXBvbmVudC5cbiAqIEBtZXRob2Qgc2V0XG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgY29tcG9uZW50IGlkIG9uIHdoaWNoIGNoYW5nZSB0aGUgc3RhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdGF0ZSB0aGUgbmV3IHN0YXRlIG9mIHRoZSBjb21wb25lbnRcbiAqL1xuZXhwb3J0cy5zZXQgPSBzZXQ7XG5cblxuLyoqXG4gKiBHZXQgdGhlIHN0YXRlIG9mIGEgY29tcG9uZW50LlxuICogQG1ldGhvZCBnZXQgXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIGNvbXBvbmVudFxuICogQHJldHVybiB7U3RyaW5nfSB0aGUgc3RhdGUgb2YgdGhlIGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0cy5nZXQgPSBnZXQ7XG5cblxuLyoqXG4gKiBSZW1vdmUgYWxsIHRoZSBzdGF0ZXMgb2YgdGhlIGNvbXBvbmVudHMgZnJvbSB0aGUgbWVtb3J5LlxuICogQG1ldGhvZCBjbGVhclxuICovXG5leHBvcnRzLmNsZWFyID0gY2xlYXI7IiwiLypcbiAqIFN5c3RlbSBSdW50aW1lXG4gKiBcbiAqIGh0dHBzOi8vZGVzaWduZmlyc3QuaW8vc3lzdGVtcnVudGltZS9cbiAqIFxuICogQ29weXJpZ2h0IDIwMTcgRXJ3YW4gQ2FycmlvdVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogVGhpcyBtb2R1bGUgbWFuYWdlcyB0aGUgd29ya2Zsb3cgb2YgUnVudGltZS4gSXQgYmVoYXZlcyBsaWtlIGEgd29ya2Zsb3cgZW5naW5lLiA8YnI+XG4gKiBJdCBjaGVja3MgaWYgdGhlIGNoYW5nZSBvZiBzdGF0dXMgb2YgYSBjb21wb25lbnQgaXMgdmFsaWQgdG8gYmUgZXhlY3V0ZWQuIEJ5IHZhbGlkLCBpdCBtZWFucyB0aGF0Ojxicj5cbiAqIC0gdGhlIHN0YXRlIGlzIHZhbGlkIGZvciB0aGUgY29tcG9uZW50LCA8YnI+XG4gKiAtIHRoZSBpbnB1dCAoaS5lLiBwYXJhbWV0ZXJzKSBvZiBhbGwgYWN0aW9ucyBmb3IgdGhlIHN0YXRlIGFyZSBjb21wbGlhbnRzIHdpdGggdGhlIG1vZGVsIGFuZCA8YnI+XG4gKiAtIHRoZSBvdXRwdXQgb2YgYWxsIGFjdGlvbnMgYXJlIGNvbXBsaWFudHMgd2l0aCB0aGUgbW9kZWwuIDxicj5cbiAqIFxuICogSWYgYW4gZXJyb3Igb2NjdXJzLCB0aGUgd29ya2Zsb3cgd2lsbCBjYWxsIHRoZSBlcnJvciBzdGF0ZSBvZiB0aGUgY29tcG9uZW50IGFuZCBydW50aW1lLiA8YnI+XG4gKiBJZiB0aGUgZXJyb3IgY2FuIGJyZWFrIHRoZSBjb25zaXN0ZW5jeSBvZiB0aGUgY3VycmVudCBzeXN0ZW0sIHRoZSB3b3JrbG93IHdpbGwgc3RvcC5cbiAqIFxuICogQG1vZHVsZSBydW50aW1lXG4gKiBAc3VibW9kdWxlIHJ1bnRpbWUtd29ya2Zsb3dcbiAqIEByZXF1aXJlcyBydW50aW1lLW1ldGFtb2RlbFxuICogQHJlcXVpcmVzIHJ1bnRpbWUtY29tcG9uZW50XG4gKiBAcmVxdWlyZXMgcnVudGltZS1iZWhhdmlvclxuICogQHJlcXVpcmVzIHJ1bnRpbWUtY2hhbm5lbFxuICogQHJlcXVpcmVzIHJ1bnRpbWUtc3RhdGVcbiAqIEByZXF1aXJlcyBydW50aW1lLWhlbHBlclxuICogQHJlcXVpcmVzIHJ1bnRpbWUtbG9nXG4gKiBAcmVxdWlyZXMgcnVudGltZS1kYlxuICogQGNsYXNzIHJ1bnRpbWUtd29ya2Zsb3cgXG4gKiBAc3RhdGljXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgJG1ldGFtb2RlbCA9IHJlcXVpcmUoJy4vbWV0YW1vZGVsLmpzJyk7XG52YXIgJGNvbXBvbmVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50LmpzJyk7XG52YXIgJGJlaGF2aW9yID0gcmVxdWlyZSgnLi9iZWhhdmlvci5qcycpO1xudmFyICRzdGF0ZSA9IHJlcXVpcmUoJy4vc3RhdGUuanMnKTtcbnZhciAkaGVscGVyID0gcmVxdWlyZSgnLi9oZWxwZXIuanMnKTtcbnZhciAkbG9nID0gcmVxdWlyZSgnLi9sb2cuanMnKTtcbnZhciAkZGIgPSByZXF1aXJlKCcuL2RiLmpzJyk7XG5cblxuLyogUHJpdmF0ZSBtZXRob2RzICovXG5cblxuLyoqXG4gKiBUaGUgUnVudGltZUVycm9yIGNsYXNzLlxuICogQGNsYXNzIFJ1bnRpbWVFcnJvclxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBtZXNzYWdlIG9mIHRoZSBlcnJvclxuICovXG5mdW5jdGlvbiBSdW50aW1lRXJyb3IobWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5uYW1lID0gXCJSdW50aW1lRXJyb3JcIjtcbn1cblJ1bnRpbWVFcnJvci5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblJ1bnRpbWVFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBSdW50aW1lRXJyb3I7XG5cblxuLypcbiAqIEdldCBhbGwgdGhlIG5hbWVzIG9mIHRoZSBwYXJhbWV0ZXIgb2YgYSBtZXRob2QuXG4gKiBAbWV0aG9kIGdldFBhcmFtTmFtZXNcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBpZCBvZiB0aGUgY2xhc3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2ROYW1lIG5hbWUgb2YgdGhlIG1ldGhvZFxuICogQHJldHVybiB7QXJyYXl9IHRoZSBuYW1lcyBvZiBhbGwgcGFyYW1ldGVycyBvZiB0aGUgbWV0aG9kIGZvciB0aGUgY2xhc3NcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGdldFBhcmFtTmFtZXMoaWQsIG1ldGhvZE5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gbnVsbCxcbiAgICAgICAgcGFyYW1zID0gW10sXG4gICAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgICBsZW5ndGggPSAwLFxuICAgICAgICBpID0gMDtcblxuICAgIGlmICgkbWV0YW1vZGVsLmdldE1vZGVsKGlkKSkge1xuICAgICAgICBtZXRob2QgPSAkbWV0YW1vZGVsLmdldE1vZGVsKGlkKVttZXRob2ROYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkbG9nLnVua25vd25Nb2RlbChpZCk7XG4gICAgfVxuXG4gICAgaWYgKG1ldGhvZCkge1xuICAgICAgICBwYXJhbXMgPSBtZXRob2QucGFyYW1zO1xuICAgICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgICAgICBsZW5ndGggPSBwYXJhbXMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFyYW1zW2ldLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJGxvZy51bmtub3duTWV0aG9kKGlkLCBtZXRob2ROYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKiBcbiAqIEdldCB0aGUgbnVtYmVyIG9mIHBhcmFtZXRlcnMgb2YgYSBtZXRob2QuXG4gKiBAbWV0aG9kIGdldFBhcmFtTnVtYmVyXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIGNsYXNzXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kTmFtZSBuYW1lIG9mIHRoZSBtZXRob2RcbiAqIEByZXR1cm4ge0FycmF5fSBudW1iZXIgb2YgcGFyYW1ldGVycyBtaW4gYW5kIG1heCBmb3IgdGhlIG1ldGhvZFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZ2V0UGFyYW1OdW1iZXIoaWQsIG1ldGhvZE5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gbnVsbCxcbiAgICAgICAgcGFyYW1zID0gW10sXG4gICAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgICBsZW5ndGggPSAwLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbWluID0gMCxcbiAgICAgICAgbWF4ID0gMDtcblxuICAgIGlmICgkbWV0YW1vZGVsLmdldE1vZGVsKGlkKSkge1xuICAgICAgICBtZXRob2QgPSAkbWV0YW1vZGVsLmdldE1vZGVsKGlkKVttZXRob2ROYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkbG9nLnVua25vd25Nb2RlbChpZCk7XG4gICAgfVxuXG4gICAgaWYgKG1ldGhvZCkge1xuICAgICAgICBwYXJhbXMgPSBtZXRob2QucGFyYW1zO1xuICAgICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgICAgICBsZW5ndGggPSBwYXJhbXMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXJhbXNbaV0ubWFuZGF0b3J5ID09PSAndW5kZWZpbmVkJyB8fCBwYXJhbXNbaV0ubWFuZGF0b3J5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IG1pbiArIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1heCA9IG1heCArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LnB1c2gobWluKTtcbiAgICAgICAgcmVzdWx0LnB1c2gobWF4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkbG9nLnVua25vd25NZXRob2QoaWQsIG1ldGhvZE5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qIFxuICogU2V0IHRoZSBkZWZhdWx0IHZhbHVlIG9mIHRoZSBub24gbWFuZGF0b3J5IHBhcmFtZXRlcnMgb2YgYSBtZXRob2QuXG4gKiBAbWV0aG9kIHNldERlZmF1bHRWYWx1ZVxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZE5hbWUgbmFtZSBvZiB0aGUgbWV0aG9kXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIGFyZ3VtZW50c1xuICogQHJldHVybiB7QXJyYXl9IGFyZ3VtZW50cyB3aXRoIGRlZmF1bHQgdmFsdWVzXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBzZXREZWZhdWx0VmFsdWUoaWQsIG1ldGhvZE5hbWUsIGFyZ3MpIHtcbiAgICB2YXIgbWV0aG9kID0gbnVsbCxcbiAgICAgICAgcGFyYW1zID0gW10sXG4gICAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgICBsZW5ndGggPSAwLFxuICAgICAgICBpID0gMDtcblxuICAgIG1ldGhvZCA9ICRtZXRhbW9kZWwuZ2V0TW9kZWwoaWQpW21ldGhvZE5hbWVdO1xuICAgIGlmIChtZXRob2QpIHtcbiAgICAgICAgcGFyYW1zID0gbWV0aG9kLnBhcmFtcztcbiAgICAgICAgaWYgKHBhcmFtcykge1xuICAgICAgICAgICAgbGVuZ3RoID0gcGFyYW1zLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChwYXJhbXNbaV0ubWFuZGF0b3J5ID09PSBmYWxzZSAmJiB0eXBlb2YgYXJnc1tpXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFyYW1zW2ldLmRlZmF1bHQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGFyZ3NbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgICRsb2cudW5rbm93bk1ldGhvZChpZCwgbWV0aG9kTmFtZSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cblxuLypcbiAqIEdldCB0aGUgdHlwZSByZXR1cm5lZCBieSBhIG1ldGhvZC5cbiAqIEBtZXRob2QgZ2V0UmV0dXJuVHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IGlkIGlkIG9mIHRoZSBjbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZE5hbWUgbmFtZSBvZiB0aGUgbWV0aG9kXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSB0eXBlIHJldHVybmVkIGJ5IHRoZSBtZXRob2RcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGdldFJldHVyblR5cGUoaWQsIG1ldGhvZE5hbWUpIHtcbiAgICB2YXIgcmVzdWx0VHlwZSA9IG51bGwsXG4gICAgICAgIHJlc3VsdCA9IG51bGw7XG5cbiAgICBpZiAoJG1ldGFtb2RlbC5nZXRNb2RlbChpZCkpIHtcbiAgICAgICAgcmVzdWx0VHlwZSA9ICRtZXRhbW9kZWwuZ2V0TW9kZWwoaWQpW21ldGhvZE5hbWVdLnJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkbG9nLnVua25vd25Nb2RlbChpZCk7XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdFR5cGUpIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0VHlwZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKlxuICogR2V0IGFsbCB0aGUgdHlwZSBvZiB0aGUgcGFyYW1ldGVycyBvZiBhIG1ldGhvZFxuICogQG1ldGhvZCBnZXRQYXJhbVR5cGVzXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgaWQgb2YgdGhlIGNsYXNzXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kTmFtZSBuYW1lIG9mIHRoZSBtZXRob2RcbiAqIEByZXR1cm4ge0FycmF5fSB0aGUgdHlwZXMgb2YgdGhlIHBhcmFtZXRlcnMgb2YgYSBtZXRob2RcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGdldFBhcmFtVHlwZXMoaWQsIG1ldGhvZE5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gbnVsbCxcbiAgICAgICAgcGFyYW1zID0gW10sXG4gICAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgICBsZW5ndGggPSAwLFxuICAgICAgICBpID0gMDtcblxuICAgIGlmICgkbWV0YW1vZGVsLmdldE1vZGVsKGlkKSkge1xuICAgICAgICBtZXRob2QgPSAkbWV0YW1vZGVsLmdldE1vZGVsKGlkKVttZXRob2ROYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkbG9nLnVua25vd25Nb2RlbChpZCk7XG4gICAgfVxuXG4gICAgaWYgKG1ldGhvZCkge1xuICAgICAgICBwYXJhbXMgPSBtZXRob2QucGFyYW1zO1xuICAgICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgICAgICBsZW5ndGggPSBwYXJhbXMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFyYW1zW2ldLnR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJGxvZy51bmtub3duTWV0aG9kKGlkLCBtZXRob2ROYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKlxuICogQ2hlY2sgaWYgY29uZGl0aW9ucyBvbiBvdXRwdXQgYXJlIGNvbXBsaWFudCB3aXRoIHRoZSBtZXRhbW9kZWxcbiAqIEBtZXRob2QgY2hlY2tSZXN1bHRcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgY29uZGl0aW9ucyBvbiBvdXB1dCBhcmUgY29tcGxpYW50IHdpdGggdGhlIG1ldGFtb2RlbFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2hlY2tSZXN1bHQocGFyYW1zKSB7XG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuXG4gICAgdmFyIGNvbXBvbmVudCA9IHBhcmFtcy5jb21wb25lbnQgfHwgbnVsbCxcbiAgICAgICAgbWV0aG9kTmFtZSA9IHBhcmFtcy5tZXRob2ROYW1lIHx8ICcnLFxuICAgICAgICBtZXRob2RSZXN1bHQgPSBudWxsLFxuICAgICAgICBjb21wb25lbnRDbGFzc05hbWUgPSAnJyxcbiAgICAgICAgcmV0dXJuVHlwZSA9IG51bGwsXG4gICAgICAgIHJlc3VsdCA9IHRydWU7XG5cbiAgICBpZiAodHlwZW9mIHBhcmFtcy5tZXRob2RSZXN1bHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1ldGhvZFJlc3VsdCA9IHBhcmFtcy5tZXRob2RSZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbWV0aG9kUmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmIChjb21wb25lbnQuY29uc3RydWN0b3IubmFtZSA9PT0gJ0Z1bmN0aW9uJykge1xuICAgICAgICBjb21wb25lbnRDbGFzc05hbWUgPSBjb21wb25lbnQubmFtZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb21wb25lbnRDbGFzc05hbWUgPSBjb21wb25lbnQuY29uc3RydWN0b3IubmFtZTtcbiAgICB9XG5cbiAgICByZXR1cm5UeXBlID0gZ2V0UmV0dXJuVHlwZShjb21wb25lbnRDbGFzc05hbWUsIG1ldGhvZE5hbWUpO1xuXG4gICAgaWYgKHJldHVyblR5cGUgIT09IG51bGwpIHtcbiAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICBjYXNlIHJldHVyblR5cGUgPT09ICdhbnknOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSByZXR1cm5UeXBlID09PSAnYXJyYXknOlxuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShtZXRob2RSZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAkbG9nLmludmFsaWRSZXN1bHRUeXBlKGNvbXBvbmVudC5pZCgpLCBjb21wb25lbnQuY29uc3RydWN0b3IubmFtZSwgbWV0aG9kTmFtZSwgcmV0dXJuVHlwZSwgbnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1ldGhvZFJlc3VsdCAhPT0gcmV0dXJuVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgJGxvZy5pbnZhbGlkUmVzdWx0VHlwZShjb21wb25lbnQuaWQoKSwgY29tcG9uZW50LmNvbnN0cnVjdG9yLm5hbWUsIG1ldGhvZE5hbWUsIHJldHVyblR5cGUsIHR5cGVvZiBtZXRob2RSZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cblxuLypcbiAqIEdldCB0aGUgYWN0aW9ucyBvZiB0aGUgc3BlY2lmaWVkIHN0YXRlXG4gKiBAbWV0aG9kIGdldEFjdGlvbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnQgYSBSdW50aW1lIGNvbXBvbmVudFxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgc3RhdGVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNFdmVudCB0cnVlIGlmIHRoZSBzdGF0ZSBpcyBhbiBldmVudFxuICogQHJldHVybiB7QXJyYXl9IGxpc3Qgb2YgdGhlIGFjdGlvbnNcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGdldEFjdGlvbnMoY29tcG9uZW50LCBuYW1lLCBpc0V2ZW50KSB7XG4gICAgdmFyIGFjdGlvbiA9ICRiZWhhdmlvci5nZXRBY3Rpb25zKGNvbXBvbmVudC5pZCgpLCBuYW1lKSxcbiAgICAgICAgcGFyZW50cyA9IFtdLFxuICAgICAgICBsZW5ndGggPSAwLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgcGFyZW50ID0gbnVsbDtcblxuICAgIGlmICghYWN0aW9uLmxlbmd0aCB8fCBpc0V2ZW50KSB7XG4gICAgICAgIGlmIChjb21wb25lbnQuY29uc3RydWN0b3IubmFtZSAhPT0gJ0Z1bmN0aW9uJykge1xuICAgICAgICAgICAgYWN0aW9uID0gYWN0aW9uLmNvbmNhdChnZXRBY3Rpb25zKCRjb21wb25lbnQuZ2V0KGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5uYW1lKSwgbmFtZSwgaXNFdmVudCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50cyA9ICRtZXRhbW9kZWwuZ2V0UGFyZW50cyhjb21wb25lbnQubmFtZSk7XG4gICAgICAgICAgICBsZW5ndGggPSBwYXJlbnRzLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHBhcmVudCA9ICRjb21wb25lbnQuZ2V0KHBhcmVudHNbaV0pO1xuICAgICAgICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gYWN0aW9uLmNvbmNhdChnZXRBY3Rpb25zKHBhcmVudCwgbmFtZSwgaXNFdmVudCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRsb2cudW5rbm93bkNvbXBvbmVudChwYXJlbnRzW2ldLCBjb21wb25lbnQubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgIGFjdGlvbi5yZXZlcnNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjdGlvbjtcbn1cblxuXG4vKlxuICogQ2FsbCBhbiBhY3Rpb24gYW5kIG1ha2Ugc29tZSBEZXBlbmRlbmN5IEluamVjdGlvbiBpZiBpdCBpcyBhIGNvcmUgYWN0aW9uXG4gKiBAbWV0aG9kIGNhbGxBY3Rpb25cbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBjb21wb25lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdGF0ZSBuYW1lIG9mIHRoZSBzdGF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGFjdGlvbiBhY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl9IHBhcmFtcyBwYXJhbWV0ZXJzIG9mIHRoZSBhY3Rpb25cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNFdmVudCBpcyB0aGUgYWN0aW9uIGEgY2FsbGJhY2sgb2YgYW4gZXZlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHJlc3VsdCBvZiB0aGUgYWN0aW9uXG4gKi9cbmZ1bmN0aW9uIGNhbGxBY3Rpb24oY29tcG9uZW50LCBzdGF0ZSwgYWN0aW9uLCBwYXJhbXMsIGlzRXZlbnQpIHtcbiAgICB2YXIgcmVzdWx0ID0gbnVsbCxcbiAgICAgICAgaW5qZWN0ZWRQYXJhbXMgPSBbXSxcbiAgICAgICAgY29tcG9uZW50Q2xhc3NOYW1lID0gJycsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSAwO1xuXG4gICAgaWYgKGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5uYW1lID09PSAnRnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbXBvbmVudENsYXNzTmFtZSA9IGNvbXBvbmVudC5uYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBvbmVudENsYXNzTmFtZSA9IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgIH1cblxuICAgIGlmICghJG1ldGFtb2RlbC5pc1Byb3BlcnR5KHN0YXRlLCBjb21wb25lbnRDbGFzc05hbWUpICYmICEkbWV0YW1vZGVsLmlzTGluayhzdGF0ZSwgY29tcG9uZW50Q2xhc3NOYW1lKSAmJiAhJG1ldGFtb2RlbC5pc0NvbGxlY3Rpb24oc3RhdGUsIGNvbXBvbmVudENsYXNzTmFtZSkpIHtcbiAgICAgICAgcGFyYW1zID0gc2V0RGVmYXVsdFZhbHVlKGNvbXBvbmVudENsYXNzTmFtZSwgc3RhdGUsIHBhcmFtcyk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgbGVuZ3RoID0gcGFyYW1zLmxlbmd0aDtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpbmplY3RlZFBhcmFtcy5wdXNoKHBhcmFtc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFjdGlvbi51c2VDb3JlQVBJKSB7XG4gICAgICAgICAgICBpbmplY3RlZFBhcmFtcy5wdXNoKCRjb21wb25lbnQpO1xuICAgICAgICAgICAgaW5qZWN0ZWRQYXJhbXMucHVzaCgkZGIpO1xuICAgICAgICAgICAgaW5qZWN0ZWRQYXJhbXMucHVzaCgkbWV0YW1vZGVsKTtcbiAgICAgICAgICAgIGluamVjdGVkUGFyYW1zLnB1c2goZXhwb3J0cyk7XG4gICAgICAgICAgICBpbmplY3RlZFBhcmFtcy5wdXNoKCRiZWhhdmlvcik7XG4gICAgICAgICAgICBpbmplY3RlZFBhcmFtcy5wdXNoKCRzdGF0ZSk7XG4gICAgICAgICAgICBpbmplY3RlZFBhcmFtcy5wdXNoKCRsb2cpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRXZlbnQpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoYWN0aW9uLmFjdGlvbi5iaW5kLmFwcGx5KGFjdGlvbi5hY3Rpb24sIFtjb21wb25lbnRdLmNvbmNhdChpbmplY3RlZFBhcmFtcykpLCAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGFjdGlvbi5hY3Rpb24uYXBwbHkoY29tcG9uZW50LCBpbmplY3RlZFBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgUnVudGltZUVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgIC8qIGpzaGludCAtVzA1NCAqL1xuICAgICAgICAgICAgaWYgKG5ldyBGdW5jdGlvbigpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAvKiBqc2hpbnQgK1cwNTQgKi8gICAgXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigncnVudGltZTogY2FuIG5vdCBleGVjdXRlIG5ldyBGdW5jdGlvbigpIGluc3RydWN0aW9uIGluIHRoZSBjdXJyZW50IGNvbnRleHQuJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgJiYgY29tcG9uZW50LmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5lcnJvcih7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1lc3NhZ2VcIjogXCJlcnJvciB3aGVuIHRyeWluZyB0byBjYWxsIHRoZSBtZXRob2QgJ1wiICsgc3RhdGUgKyBcIicgb24gY29tcG9uZW50ICdcIiArIGNvbXBvbmVudC5pZCgpICsgXCInXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6IGVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgkaGVscGVyLmdldFJ1bnRpbWUoKSkge1xuICAgICAgICAgICAgICAgICAgICAkaGVscGVyLmdldFJ1bnRpbWUoKS5lcnJvcih7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1lc3NhZ2VcIjogXCJlcnJvciB3aGVuIHRyeWluZyB0byBjYWxsIHRoZSBtZXRob2QgJ1wiICsgc3RhdGUgKyBcIicgb24gY29tcG9uZW50ICdcIiArIGNvbXBvbmVudC5pZCgpICsgXCInXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6IGVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRsb2cuYWN0aW9uSW52b2tlRXJyb3Ioc3RhdGUsIGNvbXBvbmVudC5pZCgpLCBjb21wb25lbnQuY29uc3RydWN0b3IubmFtZSwgZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cblxuLyogUHVibGljIG1ldGhvZHMgKi9cblxuXG4vKlxuICogQ2hlY2sgaWYgYW4gYWN0aW9uIGhhcyB0aGUgdmFsaWQgbnVtYmVyIG9mIHBhcmFtZXRlci5cbiAqIEBtZXRob2QgdmFsaWRQYXJhbU51bWJlcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgbmFtZSB0aGUgY2xhc3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdGF0ZSBzdGF0ZSBvbiB3aGljaCB0aGUgYWN0aW9uIGFwcGxpZWRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFjdGlvbiBhY3Rpb25cbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIGFjdGlvbiBpcyB0aGUgdmFsaWQgbnVtYmVyIG9mIHBhcmFtZXRlcnNcbiAqL1xuZnVuY3Rpb24gdmFsaWRQYXJhbU51bWJlcnMoY2xhc3NOYW1lLCBzdGF0ZSwgYWN0aW9uKSB7XG4gICAgdmFyIGZ1bmMgPSAnJyxcbiAgICAgICAgYmVnaW5Cb2R5ID0gLTEsXG4gICAgICAgIGhlYWRlciA9ICcnLFxuICAgICAgICBmdW5jUGFyYW1zID0gJycsXG4gICAgICAgIHBhcmFtcyA9IFtdLFxuICAgICAgICBwYXJhbU51bWJlciA9IDAsXG4gICAgICAgIG1vZGVsTnVtYmVyUGFyYW0gPSBbXSxcbiAgICAgICAgaXNQcm9wZXJ0eSA9IGZhbHNlLFxuICAgICAgICBpc0xpbmsgPSBmYWxzZSxcbiAgICAgICAgaXNDb2xsZWN0aW9uID0gZmFsc2UsXG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gICAgLy8gY2hlY2sgbnVtYmVyIG9mIHBhcmFtZXRlcnMgb2YgdGhlIGFjdGlvblxuICAgIGZ1bmMgPSBhY3Rpb24udG9TdHJpbmcoKTtcbiAgICBiZWdpbkJvZHkgPSBmdW5jLmluZGV4T2YoJ3snKTtcbiAgICBoZWFkZXIgPSBmdW5jLnN1YnN0cmluZygwLCBiZWdpbkJvZHkpO1xuICAgIGZ1bmNQYXJhbXMgPSBoZWFkZXIuc3BsaXQoJygnKVsxXS5yZXBsYWNlKCcpJywgJycpLnRyaW0oKTtcbiAgICBwYXJhbXMgPSBmdW5jUGFyYW1zLnNwbGl0KCcsJyk7XG4gICAgaWYgKHBhcmFtc1swXSA9PT0gJycpIHtcbiAgICAgICAgcGFyYW1zID0gW107XG4gICAgfVxuICAgIHBhcmFtTnVtYmVyID0gcGFyYW1zLmxlbmd0aDtcblxuICAgIC8vIGdldCB0aGUgbnVtYmVyIG1pbiBhbmQgbWF4IG9mIHZhbGlkIHBhcmFtZXRlcnNcbiAgICBpc1Byb3BlcnR5ID0gJG1ldGFtb2RlbC5pc1Byb3BlcnR5KHN0YXRlLCBjbGFzc05hbWUpO1xuICAgIGlzTGluayA9ICRtZXRhbW9kZWwuaXNMaW5rKHN0YXRlLCBjbGFzc05hbWUpO1xuICAgIGlzQ29sbGVjdGlvbiA9ICRtZXRhbW9kZWwuaXNDb2xsZWN0aW9uKHN0YXRlLCBjbGFzc05hbWUpO1xuXG4gICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgIGNhc2UgaXNDb2xsZWN0aW9uOlxuICAgICAgICAgICAgbW9kZWxOdW1iZXJQYXJhbSA9IFsyLCAyXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGlzUHJvcGVydHk6XG4gICAgICAgICAgICBtb2RlbE51bWJlclBhcmFtID0gWzEsIDFdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgaXNMaW5rOlxuICAgICAgICAgICAgbW9kZWxOdW1iZXJQYXJhbSA9IFsxLCAxXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgbW9kZWxOdW1iZXJQYXJhbSA9IGdldFBhcmFtTnVtYmVyKGNsYXNzTmFtZSwgc3RhdGUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gY29tcGFyZVxuICAgIGlmIChtb2RlbE51bWJlclBhcmFtWzBdIDw9IHBhcmFtTnVtYmVyICYmIHBhcmFtTnVtYmVyIDw9IG1vZGVsTnVtYmVyUGFyYW1bMV0pIHtcbiAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qXG4gKiBDaGVjayBpZiBjb25kaXRpb25zIG9uIGlucHV0IGFyZSBjb21wbGlhbnQgd2l0aCB0aGUgbW9kZWwgYmVmb3JlIGNhbGxpbmcgdGhlIGFjdGlvbi5cbiAqIEBtZXRob2QgY2hlY2tQYXJhbXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgY29uZGl0aW9uIG9uIGlucHV0IGFyZSBjb21wbGlhbnQgd2l0aCB0aGUgbW9kZWxcbiAqL1xuZnVuY3Rpb24gY2hlY2tQYXJhbXMocGFyYW1zKSB7XG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuXG4gICAgdmFyIGNvbXBvbmVudCA9IHBhcmFtcy5jb21wb25lbnQgfHwgbnVsbCxcbiAgICAgICAgbWV0aG9kTmFtZSA9IHBhcmFtcy5tZXRob2ROYW1lIHx8ICcnLFxuICAgICAgICBhcmdzID0gcGFyYW1zLmFyZ3MgfHwgJycsXG4gICAgICAgIHBhcmFtc05hbWUgPSBbXSxcbiAgICAgICAgcGFyYW1zVHlwZSA9IFtdLFxuICAgICAgICBwYXJhbXNOdW1iZXIgPSBbXSxcbiAgICAgICAgY29tcG9uZW50Q2xhc3NOYW1lID0gJycsXG4gICAgICAgIGxlbmd0aCA9IGFyZ3MubGVuZ3RoLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgcGFyYW0gPSBudWxsLFxuICAgICAgICByZXN1bHQgPSB0cnVlLFxuICAgICAgICBpc1Byb3BlcnR5ID0gZmFsc2UsXG4gICAgICAgIGlzTGluayA9IGZhbHNlLFxuICAgICAgICBpc0NvbGxlY3Rpb24gPSBmYWxzZTtcblxuICAgIGlmIChjb21wb25lbnQuY29uc3RydWN0b3IubmFtZSA9PT0gJ0Z1bmN0aW9uJykge1xuICAgICAgICBjb21wb25lbnRDbGFzc05hbWUgPSBjb21wb25lbnQubmFtZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb21wb25lbnRDbGFzc05hbWUgPSBjb21wb25lbnQuY29uc3RydWN0b3IubmFtZTtcbiAgICB9XG5cbiAgICBpc1Byb3BlcnR5ID0gJG1ldGFtb2RlbC5pc1Byb3BlcnR5KG1ldGhvZE5hbWUsIGNvbXBvbmVudENsYXNzTmFtZSk7XG4gICAgaXNMaW5rID0gJG1ldGFtb2RlbC5pc0xpbmsobWV0aG9kTmFtZSwgY29tcG9uZW50Q2xhc3NOYW1lKTtcbiAgICBpc0NvbGxlY3Rpb24gPSAkbWV0YW1vZGVsLmlzQ29sbGVjdGlvbihtZXRob2ROYW1lLCBjb21wb25lbnRDbGFzc05hbWUpO1xuICAgIHBhcmFtc05hbWUgPSBnZXRQYXJhbU5hbWVzKGNvbXBvbmVudENsYXNzTmFtZSwgbWV0aG9kTmFtZSk7XG5cbiAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgY2FzZSBpc0NvbGxlY3Rpb246XG4gICAgICAgICAgICBwYXJhbXNUeXBlID0gWyRtZXRhbW9kZWwuZ2V0TW9kZWwoY29tcG9uZW50Q2xhc3NOYW1lKVttZXRob2ROYW1lXS50eXBlWzBdLCAnc3RyaW5nJ107XG4gICAgICAgICAgICBwYXJhbXNOdW1iZXIgPSBbMiwgMl07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBpc1Byb3BlcnR5OlxuICAgICAgICAgICAgcGFyYW1zVHlwZSA9IFskbWV0YW1vZGVsLmdldE1vZGVsKGNvbXBvbmVudENsYXNzTmFtZSlbbWV0aG9kTmFtZV0udHlwZV07XG4gICAgICAgICAgICBwYXJhbXNOdW1iZXIgPSBbMSwgMV07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBpc0xpbms6XG4gICAgICAgICAgICBwYXJhbXNUeXBlID0gWyRtZXRhbW9kZWwuZ2V0TW9kZWwoY29tcG9uZW50Q2xhc3NOYW1lKVttZXRob2ROYW1lXS50eXBlXTtcbiAgICAgICAgICAgIHBhcmFtc051bWJlciA9IFsxLCAxXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcGFyYW1zVHlwZSA9IGdldFBhcmFtVHlwZXMoY29tcG9uZW50Q2xhc3NOYW1lLCBtZXRob2ROYW1lKTtcbiAgICAgICAgICAgIHBhcmFtc051bWJlciA9IGdldFBhcmFtTnVtYmVyKGNvbXBvbmVudENsYXNzTmFtZSwgbWV0aG9kTmFtZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBjYXNlIG9mIG9iamVjdFxuICAgIGlmICh0eXBlb2YgbGVuZ3RoID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBsZW5ndGggPSAxO1xuICAgIH1cblxuICAgIGlmIChsZW5ndGggPCBwYXJhbXNOdW1iZXJbMF0gfHwgcGFyYW1zTnVtYmVyWzFdIDwgbGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAkbG9nLmludmFsaWRQYXJhbU51bWJlcihjb21wb25lbnQuaWQoKSwgY29tcG9uZW50LmNvbnN0cnVjdG9yLm5hbWUsIG1ldGhvZE5hbWUpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBwYXJhbSA9IGFyZ3NbaV07XG4gICAgICAgIGlmICh0eXBlb2YgcGFyYW0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZiAoaSA8IHBhcmFtc051bWJlclswXSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRsb2cuaW52YWxpZFBhcmFtTnVtYmVyKGNvbXBvbmVudC5pZCgpLCBjb21wb25lbnQuY29uc3RydWN0b3IubmFtZSwgbWV0aG9kTmFtZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCEkbWV0YW1vZGVsLmlzVmFsaWRUeXBlKHBhcmFtLCBwYXJhbXNUeXBlW2ldKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRsb2cuaW52YWxpZFBhcmFtVHlwZShjb21wb25lbnQuaWQoKSwgY29tcG9uZW50LmNvbnN0cnVjdG9yLm5hbWUsIG1ldGhvZE5hbWUsIHBhcmFtc05hbWVbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKlxuICogQ2FsbCBhbiBhY3Rpb24gdGhhdCBjb21lcyBmcm9tIGFuIGV2ZW50LlxuICogQG1ldGhvZCBhY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBiZWhhdmlvcklkIGlkIG9mIHRoZSBiZWhhdmlvclxuICogQHBhcmFtIHtBcnJheX0gcGFyYW1zIHBhcmFtZXRlcnNcbiAqL1xuZnVuY3Rpb24gYWN0aW9uKGJlaGF2aW9ySWQsIHBhcmFtcykge1xuICAgIHZhciBpc0V2ZW50ID0gZmFsc2UsXG4gICAgICAgIGlzUHJvcGVydHkgPSBmYWxzZSxcbiAgICAgICAgaXNMaW5rID0gZmFsc2UsXG4gICAgICAgIGlzQ29sbGVjdGlvbiA9IGZhbHNlLFxuICAgICAgICBiZWhhdmlvcnMgPSBbXSxcbiAgICAgICAgYmVoYXZpb3IgPSBudWxsLFxuICAgICAgICBjb21wb25lbnQgPSBudWxsLFxuICAgICAgICBjb21wb25lbnRDbGFzc05hbWUgPSAnJyxcbiAgICAgICAgYWN0aW9uRnJvbU1lbW9yeSA9IG51bGw7XG5cbiAgICBiZWhhdmlvcnMgPSAkZGIuUnVudGltZUJlaGF2aW9yLmZpbmQoe1xuICAgICAgICBcIl9pZFwiOiBiZWhhdmlvcklkXG4gICAgfSk7XG5cbiAgICBhY3Rpb25Gcm9tTWVtb3J5ID0gJGJlaGF2aW9yLmdldChiZWhhdmlvcklkKTtcblxuICAgIGlmIChiZWhhdmlvcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGJlaGF2aW9yID0gYmVoYXZpb3JzWzBdO1xuXG4gICAgICAgIGNvbXBvbmVudCA9ICRjb21wb25lbnQuZ2V0KGJlaGF2aW9yLmNvbXBvbmVudCk7XG4gICAgICAgIGlmIChjb21wb25lbnQpIHtcblxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5uYW1lID09PSAnRnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50Q2xhc3NOYW1lID0gY29tcG9uZW50Lm5hbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudENsYXNzTmFtZSA9IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpc0V2ZW50ID0gJG1ldGFtb2RlbC5pc0V2ZW50KGJlaGF2aW9yLnN0YXRlLCBjb21wb25lbnRDbGFzc05hbWUpO1xuICAgICAgICAgICAgaXNQcm9wZXJ0eSA9ICRtZXRhbW9kZWwuaXNQcm9wZXJ0eShiZWhhdmlvci5zdGF0ZSwgY29tcG9uZW50Q2xhc3NOYW1lKTtcbiAgICAgICAgICAgIGlzTGluayA9ICRtZXRhbW9kZWwuaXNMaW5rKGJlaGF2aW9yLnN0YXRlLCBjb21wb25lbnRDbGFzc05hbWUpO1xuICAgICAgICAgICAgaXNDb2xsZWN0aW9uID0gJG1ldGFtb2RlbC5pc0NvbGxlY3Rpb24oYmVoYXZpb3Iuc3RhdGUsIGNvbXBvbmVudENsYXNzTmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChpc0V2ZW50IHx8IGlzUHJvcGVydHkgfHwgaXNDb2xsZWN0aW9uIHx8IGlzTGluaykge1xuICAgICAgICAgICAgICAgIGNhbGxBY3Rpb24oY29tcG9uZW50LCBiZWhhdmlvci5zdGF0ZSwge1xuICAgICAgICAgICAgICAgICAgICBcInVzZUNvcmVBUElcIjogYmVoYXZpb3IudXNlQ29yZUFQSSxcbiAgICAgICAgICAgICAgICAgICAgXCJhY3Rpb25cIjogYWN0aW9uRnJvbU1lbW9yeVxuICAgICAgICAgICAgICAgIH0sIHBhcmFtcywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLypcbiAqIENoYW5nZSB0aGUgc3RhdGUgb2YgYSBjb21wb25lbnQuXG4gKiBcbiAqIFdvcmtsb3c6PGJyPlxuICogPGJyPlxuICogMC4gQ2hlY2sgaWYgdGhlIGNvbXBvbmVudCBoYXMgbm90IGJlZW4gZGVzdHJveWVkIDxicj5cbiAqIDEuIENoZWNrIGlmIHRoZSBzdGF0ZSBpcyBhIG1ldGhvZCwgYSBwcm9wZXJ0eSBvciBhbiBldmVudCA8YnI+XG4gKiAyLiBTZWFyY2ggaWYgdGhlcmUgaXMgYSBiZWhhdmlvciB3aXRoIGFjdGlvbnMgZm9yIHRoZSBuZXcgc3RhdGUgPGJyPlxuICogMy4gSWYgc28sIGdldCB0aGUgYWN0aW9uKHMpIDxicj5cbiAqIDQuIENoZWNrIGlmIHRoZSBpbnB1dHMgYXJlIGNvbXBsaWFudHMgd2l0aCB0aGUgbWV0YW1vZGVsIDxicj5cbiAqIDUuIENhbGwgdGhlIGFjdGlvbihzKSA8YnI+XG4gKiA2LiBJZiBhIG1ldGhvZCwgY2hlY2sgaWYgdGhlIG91dHB1dCBhcmUgY29tcGxpYW50cyB3aXRoIHRoZSBtZXRhbW9kZWwgPGJyPlxuICogNy4gSWYgYWxsIGlzIG9rLCB0aGUgc3RhdGUgb2YgdGhlIGNvbXBvbmVudCBpcyB1cGRhdGVkIDxicj5cbiAqIDguIFJldHVybiB0aGUgcmVzdWx0IDxicj5cbiAqIFxuICogQG1ldGhvZCBzdGF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyBwYXJhbXMgdG8gY2hhbmdlIHRoZSBzdGF0ZSA8YnI+XG4gKiB7U3RyaW5nfSBjb21wb25lbnQgaWQgb2YgdGhlIGNvbXBvbmVudCA8YnI+XG4gKiB7U3RyaW5nfSBzdGF0ZSBzdGF0ZSBvZiB0aGUgY29tcG9uZW50IDxicj5cbiAqIHtBcnJheX0gZGF0YSBwYXJhbWV0ZXJzIHRvIHNlbmQgdG8gdGhlIGFjdGlvblxuICovXG5mdW5jdGlvbiBzdGF0ZShwYXJhbXMpIHtcblxuICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICBwYXJhbXMuY29tcG9uZW50ID0gcGFyYW1zLmNvbXBvbmVudCB8fCAnJztcbiAgICBwYXJhbXMuc3RhdGUgPSBwYXJhbXMuc3RhdGUgfHwgJyc7XG4gICAgcGFyYW1zLmRhdGEgPSBwYXJhbXMuZGF0YSB8fCBbXTtcblxuICAgIHZhciBjb21wb25lbnQgPSBudWxsLFxuICAgICAgICBjdXJyZW50U3RhdGUgPSAnJyxcbiAgICAgICAgYWN0aW9ucyA9IFtdLFxuICAgICAgICBhY3Rpb24gPSBudWxsLFxuICAgICAgICByZXN1bHQgPSBudWxsLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gMCxcbiAgICAgICAgY29tcG9uZW50Q2xhc3NOYW1lID0gZmFsc2UsXG4gICAgICAgIGlzUHJvcGVydHkgPSBmYWxzZSxcbiAgICAgICAgaXNMaW5rID0gZmFsc2UsXG4gICAgICAgIGlzQ29sbGVjdGlvbiA9IGZhbHNlLFxuICAgICAgICBpc0V2ZW50ID0gZmFsc2U7XG5cbiAgICBjdXJyZW50U3RhdGUgPSAkc3RhdGUuZ2V0KHBhcmFtcy5jb21wb25lbnQpO1xuXG4gICAgaWYgKGN1cnJlbnRTdGF0ZSA9PT0gJ2Rlc3Ryb3knKSB7XG4gICAgICAgICRsb2cuaW52YWxpZFVzZU9mQ29tcG9uZW50KHBhcmFtcy5jb21wb25lbnQpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudCA9ICRjb21wb25lbnQuZ2V0KHBhcmFtcy5jb21wb25lbnQpO1xuICAgIGlmIChjb21wb25lbnQpIHtcblxuICAgICAgICBpZiAoY29tcG9uZW50LmNvbnN0cnVjdG9yLm5hbWUgPT09ICdGdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudENsYXNzTmFtZSA9IGNvbXBvbmVudC5uYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29tcG9uZW50Q2xhc3NOYW1lID0gY29tcG9uZW50LmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgaXNFdmVudCA9ICRtZXRhbW9kZWwuaXNFdmVudChwYXJhbXMuc3RhdGUsIGNvbXBvbmVudENsYXNzTmFtZSk7XG4gICAgICAgIGlzUHJvcGVydHkgPSAkbWV0YW1vZGVsLmlzUHJvcGVydHkocGFyYW1zLnN0YXRlLCBjb21wb25lbnRDbGFzc05hbWUpO1xuICAgICAgICBpc0xpbmsgPSAkbWV0YW1vZGVsLmlzTGluayhwYXJhbXMuc3RhdGUsIGNvbXBvbmVudENsYXNzTmFtZSk7XG4gICAgICAgIGlzQ29sbGVjdGlvbiA9ICRtZXRhbW9kZWwuaXNDb2xsZWN0aW9uKHBhcmFtcy5zdGF0ZSwgY29tcG9uZW50Q2xhc3NOYW1lKTtcbiAgICAgICAgYWN0aW9ucyA9IGdldEFjdGlvbnMoY29tcG9uZW50LCBwYXJhbXMuc3RhdGUsIGlzRXZlbnQpO1xuICAgIH1cblxuICAgIGlmIChhY3Rpb25zLmxlbmd0aCkge1xuXG4gICAgICAgIGlmIChjaGVja1BhcmFtcyh7XG4gICAgICAgICAgICBcImNvbXBvbmVudFwiOiBjb21wb25lbnQsXG4gICAgICAgICAgICBcIm1ldGhvZE5hbWVcIjogcGFyYW1zLnN0YXRlLFxuICAgICAgICAgICAgXCJhcmdzXCI6IHBhcmFtcy5kYXRhXG4gICAgICAgIH0pKSB7XG5cbiAgICAgICAgICAgIGlmICghaXNFdmVudCAmJlxuICAgICAgICAgICAgICAgICFpc1Byb3BlcnR5ICYmXG4gICAgICAgICAgICAgICAgIWlzTGluayAmJlxuICAgICAgICAgICAgICAgICFpc0NvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBhY3Rpb24gPSBhY3Rpb25zWzBdO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGNhbGxBY3Rpb24oY29tcG9uZW50LCBwYXJhbXMuc3RhdGUsIGFjdGlvbiwgcGFyYW1zLmRhdGEsIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIGNoZWNrUmVzdWx0KHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb21wb25lbnRcIjogY29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgICBcIm1ldGhvZE5hbWVcIjogcGFyYW1zLnN0YXRlLFxuICAgICAgICAgICAgICAgICAgICBcIm1ldGhvZFJlc3VsdFwiOiByZXN1bHRcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGxlbmd0aCA9IGFjdGlvbnMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb24gPSBhY3Rpb25zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjYWxsQWN0aW9uKGNvbXBvbmVudCwgcGFyYW1zLnN0YXRlLCBhY3Rpb24sIHBhcmFtcy5kYXRhLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkc3RhdGUuc2V0KGNvbXBvbmVudC5pZCgpLCBwYXJhbXMuc3RhdGUsIHBhcmFtcy5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjb21wb25lbnQgJiYgKGlzRXZlbnQgfHwgaXNQcm9wZXJ0eSB8fCBpc0xpbmsgfHwgaXNDb2xsZWN0aW9uKSkge1xuICAgICAgICAgICAgJHN0YXRlLnNldChjb21wb25lbnQuaWQoKSwgcGFyYW1zLnN0YXRlLCBwYXJhbXMuZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLypcbiAqIFN0b3AgdGhlIHdvcmtmbG93IGVuZ2luZS5cbiAqIEBtZXRob2Qgc3RvcFxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyBwYXJhbWV0ZXJzIDxicj5cbiAqIHtCb29sZWFufSBlcnJvciB0cnVlIGlmIHRoZSBzdG9wIG9mIHRoZSB3b3JrZmxvdyBpcyBkdWUgdG8gYW4gZXJyb3IgKGRlZmF1bHQgZmFsc2UpIDxicj5cbiAqIHtTdHJpbmd9IG1lc3NhZ2UgZXJyb3IgbWVzc2FnZSB0byBsb2cgKGRlZmF1bHQgJycpXG4gKi9cbmZ1bmN0aW9uIHN0b3AocGFyYW1zKSB7XG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMuZXJyb3IgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBhcmFtcy5lcnJvciA9IGZhbHNlO1xuICAgIH1cbiAgICBwYXJhbXMubWVzc2FnZSA9IHBhcmFtcy5tZXNzYWdlIHx8ICcnO1xuXG4gICAgZXhwb3J0cy5zdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB9O1xuXG4gICAgaWYgKHBhcmFtcy5lcnJvcikge1xuICAgICAgICBpZiAocGFyYW1zLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoJ3J1bnRpbWUgaGFzIGJlZW4gc3RvcHBlZCBiZWNhdXNlICcgKyBwYXJhbXMubWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKCdydW50aW1lIGhhcyBiZWVuIHN0b3BwZWQgYmVjYXVzZSBvZiBhbiB1bmtub3duIGVycm9yJyk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocGFyYW1zLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3J1bnRpbWU6IHJ1bnRpbWUgaGFzIGJlZW4gc3RvcHBlZCBiZWNhdXNlICcgKyBwYXJhbXMubWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdydW50aW1lOiBydW50aW1lIGhhcyBiZWVuIHN0b3BwZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4vKlxuICogUmVzdGFydCB0aGUgd29ya2Zsb3cgZW5naW5lIGZyb20gdGhlIGxhc3Qgc3RhdGUuXG4gKiBAbWV0aG9kIHJlc3RhcnRcbiAqL1xuZnVuY3Rpb24gcmVzdGFydCgpIHtcbiAgICBleHBvcnRzLnN0YXRlID0gc3RhdGU7XG4gICAgJGxvZy53b3JrZmxvd1Jlc3RhcnRlZCgpO1xufVxuXG5cbi8qIGV4cG9ydHMgKi9cblxuXG4vKipcbiAqIFRoaXMgbW9kdWxlIG1hbmFnZXMgdGhlIHdvcmtmbG93IG9mIFJ1bnRpbWUuIEl0IGJlaGF2ZXMgbGlrZSBhIHdvcmtmbG93IGVuZ2luZS4gPGJyPlxuICogSXQgY2hlY2tzIGlmIHRoZSBjaGFuZ2Ugb2Ygc3RhdHVzIG9mIGEgY29tcG9uZW50IGlzIHZhbGlkIHRvIGJlIGV4ZWN1dGVkLiBCeSB2YWxpZCwgaXQgbWVhbnMgdGhhdDo8YnI+XG4gKiAtIHRoZSBzdGF0ZSBpcyB2YWxpZCBmb3IgdGhlIGNvbXBvbmVudCwgPGJyPlxuICogLSB0aGUgaW5wdXQgKGkuZS4gcGFyYW1ldGVycykgb2YgYWxsIGFjdGlvbnMgZm9yIHRoZSBzdGF0ZSBhcmUgY29tcGxpYW50cyB3aXRoIHRoZSBtb2RlbCBhbmQgPGJyPlxuICogLSB0aGUgb3V0cHV0IG9mIGFsbCBhY3Rpb25zIGFyZSBjb21wbGlhbnRzIHdpdGggdGhlIG1vZGVsLiA8YnI+XG4gKiBcbiAqIElmIGFuIGVycm9yIG9jY3VycywgdGhlIHdvcmtmbG93IHdpbGwgY2FsbCB0aGUgZXJyb3Igc3RhdGUgb2YgdGhlIGNvbXBvbmVudCBhbmQgb2YgUnVudGltZSBpbnN0YW5jZS4gPGJyPlxuICogSWYgdGhlIGVycm9yIGNhbiBicmVhayB0aGUgY29uc2lzdGVuY3kgb2YgdGhlIGN1cnJlbnQgc3lzdGVtLCB0aGUgd29ya2xvdyB3aWxsIHN0b3AuXG4gKiBcbiAqIEBtb2R1bGUgcnVudGltZVxuICogQHN1Ym1vZHVsZSBydW50aW1lLXdvcmtmbG93XG4gKiBAcmVxdWlyZXMgcnVudGltZS1tZXRhbW9kZWxcbiAqIEByZXF1aXJlcyBydW50aW1lLWNvbXBvbmVudFxuICogQHJlcXVpcmVzIHJ1bnRpbWUtYmVoYXZpb3JcbiAqIEByZXF1aXJlcyBydW50aW1lLWNoYW5uZWxcbiAqIEByZXF1aXJlcyBydW50aW1lLXN0YXRlXG4gKiBAcmVxdWlyZXMgcnVudGltZS1oZWxwZXJcbiAqIEByZXF1aXJlcyBydW50aW1lLWxvZ1xuICogQHJlcXVpcmVzIHJ1bnRpbWUtZGJcbiAqIEBjbGFzcyBydW50aW1lLXdvcmtmbG93IFxuICogQHN0YXRpY1xuICovXG5cblxuLyoqXG4gKiBDaGFuZ2UgdGhlIHN0YXRlIG9mIGEgY29tcG9uZW50LlxuICogXG4gKiBXb3JrbG93Ojxicj5cbiAqIDxicj5cbiAqIDAuIENoZWNrIGlmIHRoZSBjb21wb25lbnQgaGFzIG5vdCBiZWVuIGRlc3Ryb3llZCA8YnI+XG4gKiAxLiBDaGVjayBpZiB0aGUgc3RhdGUgaXMgYSBtZXRob2Qgb3IgYW4gZXZlbnQgPGJyPlxuICogMi4gU2VhcmNoIGlmIHRoZXJlIGlzIGEgYmVoYXZpb3Igd2l0aCBhbiBhY3Rpb24gZm9yIHRoZSBuZXcgc3RhdGUgPGJyPlxuICogMy4gSWYgc28sIGdldCB0aGUgYWN0aW9uKHMpIDxicj5cbiAqIDQuIENoZWNrIGlmIHRoZSBjb25kaXRvbnMgb24gaW5wdXQgYXJlIGNvbXBsaWFudCB3aXRoIHRoZSBtZXRhbW9kZWwgPGJyPlxuICogNS4gQ2FsbCB0aGUgYWN0aW9uKHMpIDxicj5cbiAqIDYuIElmIG5vdCBhbiBvZiBldmVudCwgY2hlY2sgaWYgdGhlIGNvbmRpdG9ucyBvbiBpbnB1dCBhcmUgY29tcGxpYW50IHdpdGggdGhlIG1ldGFtb2RlbCA8YnI+XG4gKiA3LiBJZiBhbGwgaXMgb2ssIHRoZSBzdGF0ZSBvZiB0aGUgY29tcG9uZW50IGlzIHVwZGF0ZWQgPGJyPlxuICogOC4gUmV0dXJuIHRoZSByZXN1bHQgPGJyPlxuICogXG4gKiBAbWV0aG9kIHN0YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIHBhcmFtcyB0byBjaGFuZ2UgdGhlIHN0YXRlIDxicj5cbiAqIHtTdHJpbmd9IGNvbXBvbmVudCBpZCBvZiB0aGUgY29tcG9uZW50IDxicj5cbiAqIHtTdHJpbmd9IHN0YXRlIHN0YXRlIG9mIHRoZSBjb21wb25lbnQgPGJyPlxuICoge0FycmF5fSBkYXRhIHBhcmFtZXRlcnMgdG8gc2VuZCB0byB0aGUgYWN0aW9uXG4gKi9cbmV4cG9ydHMuc3RhdGUgPSBzdGF0ZTtcblxuXG4vKipcbiAqIFN0b3AgdGhlIHdvcmtmbG93IGVuZ2luZS5cbiAqIEBtZXRob2Qgc3RvcFxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyBwYXJhbWV0ZXJzIDxicj5cbiAqIHtCb29sZWFufSBlcnJvciB0cnVlIGlmIHRoZSBzdG9wIG9mIHRoZSB3b3JrZmxvdyBpcyBkdWUgdG8gYW4gZXJyb3IgKGRlZmF1bHQgZmFsc2UpIDxicj5cbiAqIHtTdHJpbmd9IG1lc3NhZ2UgZXJyb3IgbWVzc2FnZSB0byBsb2cgKGRlZmF1bHQgJycpXG4gKi9cbmV4cG9ydHMuc3RvcCA9IHN0b3A7XG5cblxuLyoqXG4gKiBSZXN0YXJ0IHRoZSB3b3JrZmxvdyBlbmdpbmUgZnJvbSB0aGUgbGFzdCBzdGF0ZS5cbiAqIEBtZXRob2QgcmVzdGFydFxuICovXG5leHBvcnRzLnJlc3RhcnQgPSByZXN0YXJ0O1xuXG5cbi8qKlxuICogQ2hlY2sgaWYgY29uZGl0aW9ucyBvbiBpbnB1dCBhcmUgY29tcGxpYW50IHdpdGggdGhlIG1vZGVsIGJlZm9yZSBjYWxsaW5nIHRoZSBhY3Rpb24uXG4gKiBAbWV0aG9kIGNoZWNrUGFyYW1zXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGNvbmRpdGlvbiBvbiBpbnB1dCBhcmUgY29tcGxpYW50IHdpdGggdGhlIG1vZGVsXG4gKi9cbmV4cG9ydHMuY2hlY2tQYXJhbXMgPSBjaGVja1BhcmFtcztcblxuXG4vKipcbiAqIENoZWNrIGlmIGFuIGFjdGlvbiBoYXMgdGhlIHZhbGlkIG51bWJlciBvZiBwYXJhbWV0ZXIuXG4gKiBAbWV0aG9kIHZhbGlkUGFyYW1OdW1iZXJzXG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lIG5hbWUgdGhlIGNsYXNzXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RhdGUgc3RhdGUgb24gd2hpY2ggdGhlIGFjdGlvbiBhcHBsaWVkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhY3Rpb24gYWN0aW9uXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBhY3Rpb24gaXMgdGhlIHZhbGlkIG51bWJlciBvZiBwYXJhbWV0ZXJzXG4gKi9cbmV4cG9ydHMudmFsaWRQYXJhbU51bWJlcnMgPSB2YWxpZFBhcmFtTnVtYmVycztcblxuXG4vKipcbiAqIENhbGwgYW4gYWN0aW9uIHRoYXQgY29tZXMgZnJvbSBhbiBldmVudC5cbiAqIEBtZXRob2QgYWN0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gYmVoYXZpb3JJZCBpZCBvZiB0aGUgYmVoYXZpb3JcbiAqIEBwYXJhbSB7QXJyYXl9IHBhcmFtcyBwYXJhbWV0ZXJzXG4gKi9cbmV4cG9ydHMuYWN0aW9uID0gYWN0aW9uOyJdfQ==
