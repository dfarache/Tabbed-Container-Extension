define(["qlik", 'ng!$q'], function(qlik, $q) {

    var app = qlik.currApp(this);

  	function getMasterObjectList () {
  	     var defer = $q.defer();

         app.getAppObjectList( 'masterobject', function ( data ) {
    		     var masterobject = [];
    			   var sortedData = _.sortBy( data.qAppObjectList.qItems, function ( item ) {
    				     return item.qData.rank;
    			});

    			_.each( sortedData, function ( item ) {
    		      masterobject.push({ value: item.qInfo.qId, label: item.qMeta.title });
    			});

    			return defer.resolve( masterobject );
    		});
    		return defer.promise;
  	};

    return {
        type: "items",
        component: "accordion",
        uses: "settings",
        items: {
            tab1: {
                type: "items",
                label: "Tab 1",

                items: {
                    tab1Title: {
                        type: "string",
                        label: "Title",
                        ref: "tab1Title",
                        defaultValue: "",
                        expression: "optional"
                    },
                    tab1ObjectId: {
                        type: "string",
                        label: "Object ID",
                        ref: "tab1ObjectId",
                        defaultValue: ""
                    },
                    tab1MasterItem: {
                        label: "Master Item",
                        component: "dropdown",
                        type: "string",
                        ref: "tab1MasterItem",
                        options: function () {
			                       return getMasterObjectList();
		                    }
                    }
                }
            },
            tab2: {
                type: "items",
                label: "Tab 2",
                items: {
                    tab2Title: {
                        type: "string",
                        label: "Title",
                        ref: "tab2Title",
                        defaultValue: "",
                        expression: "optional"
                    },
                    tab2ObjectId: {
                        type: "string",
                        label: "Object ID",
                        ref: "tab2ObjectId",
                        defaultValue: ""
                    },
                    tab2MasterItem: {
                        label: "Master Item",
                        component: "dropdown",
                        type: "string",
                        ref: "tab2MasterItem",
                        options: function () {
			                       return getMasterObjectList();
		                    }
                    }
                }
            },
            tab3: {
                type: "items",
                label: "Tab 3",
                items: {
                    tab3Title: {
                        type: "string",
                        label: "Title",
                        ref: "tab3Title",
                        defaultValue: "",
                        expression: "optional"
                    },
                    tab3ObjectId: {
                        type: "string",
                        label: "Object ID",
                        ref: "tab3ObjectId",
                        defaultValue: ""
                    },
                    tab3MasterItem: {
                        label: "Master Item",
                        component: "dropdown",
                        type: "string",
                        ref: "tab3MasterItem",
                        options: function () {
                             return getMasterObjectList();
                        }
                    }
                }
            },
            tab4: {
                type: "items",
                label: "Tab 4",
                items: {
                    tab4Title: {
                        type: "string",
                        label: "Title",
                        ref: "tab4Title",
                        defaultValue: "",
                        expression: "optional"
                    },
                    tab4ObjectId: {
                        type: "string",
                        label: "Object ID",
                        ref: "tab4ObjectId",
                        defaultValue: ""
                    },
                    tab4MasterItem: {
                        label: "Master Item",
                        component: "dropdown",
                        type: "string",
                        ref: "tab4MasterItem",
                        options: function () {
                             return getMasterObjectList();
                        }
                    }
                }
            },
            tab5: {
                type: "items",
                label: "Tab 5",
                items: {
                    tab5Title: {
                        type: "string",
                        label: "Title",
                        ref: "tab5Title",
                        defaultValue: "",
                        expression: "optional"
                    },
                    tab5ObjectId: {
                        type: "string",
                        label: "Object ID",
                        ref: "tab5ObjectId",
                        defaultValue: ""
                    },
                    tab5MasterItem: {
                        label: "Master Item",
                        component: "dropdown",
                        type: "string",
                        ref: "tab5MasterItem",
                        options: function () {
                             return getMasterObjectList();
                        }
                    }
                }
            },
            settings: {
                uses: "settings",
                items: {
						        borderColorPicker: {
							          label: "Border color-picker",
							          component: "color-picker",
							          ref: "borderColor",
							          type: "integer",
							          defaultValue: 8
						        },
                    backgroundColor: {
                        type: "items",
                        label: "Background color",
                        items: {
                            backgroundColorPicker: {
                                label: "background color-picker",
                                component: "color-picker",
                                ref: "backgroundColor",
                                type: "integer",
                                defaultValue: 10
                            },
                            backgroundColorCode: {
                                type: "string",
                                label: "Color code",
                                ref: "backgroundColorCode",
                                defaultValue: ""
                            }
                        }
                    },
                    buttonColorPicker: {
                        label: "Button color-picker",
                        component: "color-picker",
                        ref: "buttonColor",
                        type: "integer",
                        defaultValue: 8
                    },
                    additionalSettings: {
                        type: "items",
                        label: "Additional Settings",
                        items: {
                            showTabsSwitch: {
                                label: "Collapse when there is 1 tab",
                                component: "switch",
                                ref: "shouldCollapseTabs",
                                type: "boolean",
                                options: [{
                                    value: true,
                                    label: "Yes"
                                },
                                {
                                    value: false,
                                    label: "No"
                                }],
                                defaultValue: false
                            }
                        }
                    }
					      }
            }
        },
        link: {
            type: "items",
            label: "Link Details",
            items: {
                linkDetails: {
                    defaultValue: "none",
                    type: "string",
                    component: "dropdown",
                    label: "Type",
                    ref: "linkType",
                    options: [{
                        value: "none",
                        label: "None"
                    }, {
                        value: "sheet",
                        label: "Sheet"
                    }, {
                        value: "url",
                        label: "URL"
                    }]
                },
                linkSheet: {
                    ref: "linkSheetID",
                    label: "Sheet ID",
                    type: "string",
                    defaultValue: "",
                    show: function(data) {
                        return data.linkType === "sheet";
                    }
                },
                linkUrl: {
                    ref: "linkUrl",
                    label: "URL",
                    type: "string",
                    defaultValue: "",
                    show: function(data) {
                        return data.linkType === "url";
                    }
                },
                linkText: {
                    ref: "linkText",
                    label: "Link text",
                    type: "string",
                    defaultValue: "",
                    show: function(data) {
                        return data.linkType === "url" || data.linkType === "sheet";
                    }
                }
            }
        },
        settings: {
            uses: "settings"
        }
    };

});
