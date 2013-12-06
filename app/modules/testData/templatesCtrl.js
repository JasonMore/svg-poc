(function () {
  angular.module('testData')
    .controller('testData.templatesCtrl', function ($scope, liveResource) {
      window.debugScope = $scope;
      var liveTemplateTypes = liveResource('templateTypes');
      var templateTypesQuery = liveTemplateTypes.query({});
      $scope.templateTypes = liveTemplateTypes.subscribe(templateTypesQuery);

      var liveTemplates = liveResource('templates');
      var allTemplatesQuery = liveTemplates.query({});
      $scope.templates = liveTemplates.subscribe(allTemplatesQuery);

//      $scope.groupedTemplates = function() {
//        return _.groupBy($scope.templates, 'templateType');
//      }

      $scope.deleteTemplate = function (template) {
        liveTemplates.delete(template);
      };

      $scope.groupedTemplates = [];

      $scope.$watch('templates', templateWatch, true);
      function templateWatch(templates, oldValue) {
        if (templates === oldValue) return;

        var templatesByType = _.groupBy($scope.templates, 'templateType');
        $scope.groupedTemplates = _.map($scope.templateTypes, function (type) {
          return {
            type: type,
            templates: templatesByType[type.id]
          }
        });
      }

      $scope.addTestData = function () {
        addStudentOfTheMonth();
        addIdCard();
      };

      function addIdCard() {
        var templateTypeId = liveTemplateTypes.add({
          name: 'Id Card',
          requiredFields: ["Student_Name", "Student_Picture"],
          optionFields: ["Student_Grade", "Student_Teacher", "School_Name"],
          mockData: {
            "Student_Name": "Johnny Appleseed",
            "Student_Picture": "img/CO/Flash1.jpg",
            "Student_Grade": "11",
            "Student_Teacher": "Mr. Krum",
            "School_Name": "Sunnyside Elementary"
          }
        });

        liveTemplates.add({
          "width": "428",
          "height": "234",
          "templateType": "fe6c88cd-f0de-4ba5-bae0-008833154e30",
          "name": "Landscape",
          "shapes": {
            "b694df81-413f-4c31-9b7b-8e6c805f9712": {
              "top": 6,
              "left": 6.5,
              "width": 411,
              "height": 221,
              "rotation": 0,
              "path": "M0,0L411.385,0L411.385,221.311L0,221.311z",
              "backgroundColor": "yellow",
              "borderColor": "black",
              "borderWidth": 2,
              "image": {
                "url": null,
                "top": 0,
                "left": 0,
                "width": 0,
                "height": 0,
                "rotation": 0
              },
              "id": "b694df81-413f-4c31-9b7b-8e6c805f9712",
              "order": 3,
              "text": "",
              "font": "Verdana",
              "fontSize": "12.0",
              "fontColor": "black",
              "wrapTextAround": true,
              "transparency": 1,
              "templateId": "b694df81-413f-4c31-9b7b-8e6c805f9712",
              "shadow": {
                "enabled": false,
                "offsetX": 20,
                "offsetY": 20,
                "density": 10
              }
            },
            "9f9ce0a1-8d7b-4c07-83ce-3efad3372919": {
              "top": 23.00000762939453,
              "left": 24.5,
              "width": 126,
              "height": 167,
              "rotation": 0,
              "path": "M0,0L126.63,0L126.63,167.553L0,167.553z",
              "backgroundColor": "white",
              "borderColor": "black",
              "borderWidth": 2,
              "image": {
                "url": "img/CO/Flash1.jpg",
                "top": -0.5185185185185184,
                "left": 0,
                "width": 125.89565217391302,
                "height": 167.42048674938718,
                "rotation": 0
              },
              "id": "9f9ce0a1-8d7b-4c07-83ce-3efad3372919",
              "order": 4,
              "text": "",
              "font": "Verdana",
              "fontSize": "12.0",
              "fontColor": "black",
              "wrapTextAround": true,
              "transparency": 1,
              "templateId": "Student_Picture",
              "shadow": {
                "enabled": true,
                "offsetX": "7",
                "offsetY": "5",
                "density": 10
              }
            },
            "80752dc6-3b78-4206-b4a2-69860b4a242c": {
              "top": 92,
              "left": 180.5,
              "width": 207,
              "height": 26,
              "rotation": 0,
              "path": "M0,0L207.481,0L207.481,26.857L0,26.857z",
              "backgroundColor": "white",
              "borderColor": "black",
              "borderWidth": 2,
              "image": {
                "url": null,
                "top": 0,
                "left": 0,
                "width": 0,
                "height": 0,
                "rotation": 0
              },
              "id": "80752dc6-3b78-4206-b4a2-69860b4a242c",
              "order": 4,
              "text": "test name",
              "font": "Verdana",
              "fontSize": "12.0",
              "fontColor": "black",
              "wrapTextAround": true,
              "transparency": 1,
              "templateId": "Student_Name",
              "shadow": {
                "enabled": false,
                "offsetX": 20,
                "offsetY": 20,
                "density": 10
              }
            },
            "fbddc1ab-e074-4f74-9c99-d2979a6087d2": {
              "top": 24,
              "left": 176,
              "width": 207.5,
              "height": 39,
              "rotation": 0,
              "path": "M0,0L207.414,0L207.414,39.323L0,39.323z",
              "backgroundColor": "yellow",
              "borderColor": "black",
              "borderWidth": 2,
              "image": {
                "url": null,
                "top": 0,
                "left": 0,
                "width": 0,
                "height": 0,
                "rotation": 0
              },
              "id": "fbddc1ab-e074-4f74-9c99-d2979a6087d2",
              "order": 6,
              "text": "School Name",
              "font": "Cambria",
              "fontSize": 20,
              "fontColor": "black",
              "wrapTextAround": true,
              "transparency": 1,
              "templateId": "School_Name",
              "shadow": {
                "enabled": true,
                "offsetX": "1",
                "offsetY": "0",
                "density": "47"
              }
            },
            "588d2eaf-13dd-4f3d-bc83-71493187dd43": {
              "top": 174.48631286621094,
              "left": 282.82733154296875,
              "width": 49.389747619628906,
              "height": 53.13072535395622,
              "rotation": 0,
              "path": "M0,0L49.417,0L49.417,53.077L0,53.077z",
              "backgroundColor": "none",
              "borderColor": "none",
              "borderWidth": "0",
              "image": {
                "url": "img/Prior%20Lake%20Logo.png",
                "top": 4.8395195481998625,
                "left": -6.636212423431878,
                "width": 65.32259095912941,
                "height": 44.01609534113285,
                "rotation": 0
              },
              "id": "588d2eaf-13dd-4f3d-bc83-71493187dd43",
              "order": 5,
              "text": "",
              "font": "Verdana",
              "fontSize": "12.0",
              "fontColor": "black",
              "wrapTextAround": true,
              "transparency": 1,
              "shadow": {
                "enabled": false,
                "offsetX": "6",
                "offsetY": "11",
                "density": "60"
              },
              "templateId": "588d2eaf-13dd-4f3d-bc83-71493187dd43"
            },
            "43593473-72c0-49fa-ba0a-a196ed1443f6": {
              "top": 204.0660400390625,
              "left": 359.5,
              "width": 57.95540237426758,
              "height": 20.9339599609375,
              "rotation": 0,
              "path": "M0,0L58.151,0L58.151,21.353L0,21.353z",
              "backgroundColor": "gray",
              "borderColor": "none",
              "borderWidth": 2,
              "image": {
                "url": null,
                "top": 0,
                "left": 0,
                "width": 0,
                "height": 0,
                "rotation": 0
              },
              "id": "43593473-72c0-49fa-ba0a-a196ed1443f6",
              "order": 5,
              "text": "2013-14",
              "font": "Verdana",
              "fontSize": "12.0",
              "fontColor": "white",
              "wrapTextAround": true,
              "transparency": "0.42",
              "shadow": {
                "enabled": false,
                "offsetX": 20,
                "offsetY": 20,
                "density": 10
              },
              "templateId": "43593473-72c0-49fa-ba0a-a196ed1443f6"
            },
            "7d1cd536-65bd-4bd3-ac46-007e82505451": {
              "top": -1,
              "left": -0.5,
              "width": 427,
              "height": 236,
              "rotation": 0,
              "path": "M0,0L426.986,0L426.986,235.941L0,235.941z",
              "backgroundColor": "blue",
              "borderColor": "black",
              "borderWidth": 2,
              "image": {
                "url": null,
                "top": 0,
                "left": 0,
                "width": 0,
                "height": 0,
                "rotation": 0
              },
              "id": "7d1cd536-65bd-4bd3-ac46-007e82505451",
              "order": 0,
              "text": "",
              "font": "Verdana",
              "fontSize": "12.0",
              "fontColor": "black",
              "wrapTextAround": true,
              "transparency": 1,
              "shadow": {
                "enabled": false,
                "offsetX": 20,
                "offsetY": 20,
                "density": 10
              },
              "templateId": "7d1cd536-65bd-4bd3-ac46-007e82505451"
            },
            "24fa2247-f255-4ce2-afbd-bcc082a1c8be": {
              "top": 146,
              "left": 181.5,
              "width": 206,
              "height": 30,
              "rotation": 0,
              "path": "M0,0L205.97,0L205.97,30L0,30z",
              "backgroundColor": "gray",
              "borderColor": "black",
              "borderWidth": 2,
              "image": {
                "url": null,
                "top": 0,
                "left": 0,
                "width": 0,
                "height": 0,
                "rotation": 0
              },
              "id": "24fa2247-f255-4ce2-afbd-bcc082a1c8be",
              "order": 7,
              "text": "BARCODE",
              "font": "Verdana",
              "fontSize": "12.0",
              "fontColor": "black",
              "wrapTextAround": true,
              "transparency": 1,
              "shadow": {
                "enabled": false,
                "offsetX": 20,
                "offsetY": 20,
                "density": 10
              },
              "templateId": "24fa2247-f255-4ce2-afbd-bcc082a1c8be"
            },
            "d293502b-0b66-451a-9fec-99e597dc1c75": {
              "top": 195,
              "left": 155.5,
              "width": 66,
              "height": 23,
              "rotation": 0,
              "path": "M0,0L66,0L66,23L0,23z",
              "backgroundColor": "yellow",
              "borderColor": "black",
              "borderWidth": 2,
              "image": {
                "url": null,
                "top": 0,
                "left": 0,
                "width": 0,
                "height": 0,
                "rotation": 0
              },
              "id": "d293502b-0b66-451a-9fec-99e597dc1c75",
              "order": 8,
              "text": "Bus",
              "font": "Verdana",
              "fontSize": "12.0",
              "fontColor": "black",
              "wrapTextAround": true,
              "transparency": 1,
              "shadow": {
                "enabled": false,
                "offsetX": 20,
                "offsetY": 20,
                "density": 10
              },
              "templateId": "Bus_ID"
            }
          },
          "id": "9222aa66-ee36-4cf7-ac8e-128312e14c05"
        });
      }

      function addStudentOfTheMonth() {
        var templateTypeId = liveTemplateTypes.add({
          id: "559641b7-66ec-4828-b6b9-77a4dabd0180",
          name: 'Student of the Month',
          requiredFields: ["Student_Name", "Student_Picture"],
          optionalFields: ["Student_Grade", "Student_Teacher", "School_Name"],
          mockData: {
            "Student_Name": "Johnny Appleseed",
            "Student_Picture": "",
            "Student_Grade": "11",
            "Student_Teacher": "Mr. Krum",
            "School_Name": "Sunnyside Elementary"
          }
        });

        liveTemplates.add({
          "id": "07e4f709-d1cf-4f1d-aaf4-c5fb842e6a76",
          templateType: templateTypeId,
          "width": "846",
          "height": "988",
          "name": "Top 1",
          "shapes": {
            "28554da8-f252-4421-b5ec-ec62d74a605c": {
              "top": 5,
              "left": 4.5,
              "width": 831,
              "height": 193,
              "rotation": 0,
              "path": "M0,0L831,0L831,193L0,193z",
              "backgroundColor": "white",
              "borderColor": "none",
              "borderWidth": 2,
              "image": {
                "url": null,
                "top": 0,
                "left": 0,
                "width": 0,
                "height": 0,
                "rotation": 0
              },
              "id": "28554da8-f252-4421-b5ec-ec62d74a605c",
              "order": 0,
              "text": "#Student_Name",
              "font": "Verdana",
              "fontSize": "47",
              "fontColor": "black",
              "wrapTextAround": true,
              "transparency": 1,
              "templateId": "Student_Name"
            },
            "d2856c29-5b8a-4742-b064-9a77ae611518": {
              "top": 136,
              "left": 13,
              "width": 804,
              "height": 786,
              "rotation": 0,
              "path": "M0,0L803.996,0L803.996,785.852L0,785.852z",
              "backgroundColor": "gray",
              "borderColor": "black",
              "borderWidth": 2,
              "image": {
                "url": null,
                "top": 0,
                "left": 0,
                "width": 0,
                "height": 0,
                "rotation": 0
              },
              "id": "d2856c29-5b8a-4742-b064-9a77ae611518",
              "order": 1,
              "text": "",
              "font": "Verdana",
              "fontSize": "12.0",
              "fontColor": "black",
              "wrapTextAround": true,
              "transparency": 1,
              "templateId": "Student_Picture"
            }
          }
        });

        liveTemplates.add({
          "id": "852bc9be-c837-444a-b3e8-98f59d9f1674",
          templateType: templateTypeId,
          "width": "846",
          "height": "978",
          "name": "Left 1",
          "shapes": {
            "327bfef7-ebe5-49b7-94d0-9d6a5cc49d3e": {
              "top": 405,
              "left": -324.5,
              "width": 843,
              "height": 143,
              "rotation": -90,
              "path": "M0,0L843,0L843,143L0,143z",
              "backgroundColor": "white",
              "borderColor": "none",
              "borderWidth": 2,
              "image": {
                "url": null,
                "top": 0,
                "left": 0,
                "width": 0,
                "height": 0,
                "rotation": 0
              },
              "id": "327bfef7-ebe5-49b7-94d0-9d6a5cc49d3e",
              "order": 0,
              "text": "#Student_Name",
              "font": "Verdana",
              "fontSize": "35",
              "fontColor": "black",
              "wrapTextAround": true,
              "transparency": 1,
              "templateId": "Student_Name"
            },
            "c45d0147-4d07-4c9e-b76b-cce1b5dada55": {
              "top": 122,
              "left": 146.5,
              "width": 660,
              "height": 772,
              "rotation": 0,
              "path": "M0,0L660,0L660,772L0,772z",
              "backgroundColor": "gray",
              "borderColor": "black",
              "borderWidth": 2,
              "image": {
                "url": null,
                "top": 0,
                "left": 0,
                "width": 0,
                "height": 0,
                "rotation": 0
              },
              "id": "c45d0147-4d07-4c9e-b76b-cce1b5dada55",
              "order": 1,
              "text": "",
              "font": "Verdana",
              "fontSize": "12.0",
              "fontColor": "black",
              "wrapTextAround": true,
              "transparency": 1,
              "templateId": "Student_Picture"
            }
          }
        });

//        liveTemplateTypes.add({
//          name: 'Student ID Card'
//        });
//
//        liveTemplateTypes.add({
//          name: 'Seating Chart'
//        });
      }

//      $scope.addTemplateTypes = function() {
//        liveTemplateTypes
//      };
    });
}());