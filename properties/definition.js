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

    var maxNumberTabs = 5;
    var properties = {
        type: "items",
        component: "accordion",
        uses: "settings",
        items: {}
    };

    for(var i=1; i< maxNumberTabs+1; i++) {
        properties.items['tab' + i] = {
            type: "items",
            label: "Tab " + i,
            items: {}
        }

        properties.items['tab' + i]['items']['tab' + i + 'Title'] = {
            type: 'string',
            label: 'Title',
            ref: 'tab' + i + 'Title',
            defaultValue: '',
            expression: 'optional'
        }

        properties.items['tab' + i]['items']['tab' + i + 'ObjectId'] = {
            type: 'string',
            label: 'Object ID',
            ref: 'tab' + i + 'ObjectId',
            defaultValue: ''
        }

        properties.items['tab' + i]['items']['tab' + i + 'MasterItem'] = {
            label: 'Master Item',
            component: 'dropdown',
            type: 'string',
            ref: 'tab' + i + 'MasterItem',
            defaultValue: '',
            options: function () {
                 return getMasterObjectList();
            }
        }
    }

    properties.items.settings = {
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
                    },
                    showDetailsButtonSwitch: {
                        label: "Hide the details button",
                        component: "switch",
                        ref: "shouldHideDetailsButton",
                        type: "boolean",
                        options: [{
                            value: true,
                            label: "Yes"
                        },
                        {
                            value: false,
                            label: "No"
                        }],
                        defaultValue: true
                    },
                    showExportButtonSwitch: {
                        label: "Hide the export button",
                        component: "switch",
                        ref: "shouldHideExportButton",
                        type: "boolean",
                        options: [{
                            value: true,
                            label: "Yes"
                        },
                        {
                            value: false,
                            label: "No"
                        }],
                        defaultValue: true
                    },
                    exportFormat: {
                        type: 'string',
                        component: 'dropdown',
                        label: 'Format of the exported file',
                        ref: 'exportFormat',
                        defaultValue: '\t',
                        options: function(props) {
                            return props.shouldHideExportButton
                                ? [{ label: '<--Turn off the switch above-->', value: '\t'}]
                                : [{
                                      label: 'Tab Separated', value: '\t'
                                  }, {
                                      label: 'Comma Separated', value: ','
                                  }, {
                                      label: 'Semicolon Separated', value: ';'
                                  }]
                        }
                    }
                }
            }
        }
    }

    return properties;
});
