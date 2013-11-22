(function(){
  angular.module('testData.controllers')
    .controller('templatesCtrl', function($scope, liveResource) {
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

      $scope.deleteTemplate = function(template){
        liveTemplates.delete(template);
      }

      $scope.groupedTemplates = [];

      $scope.$watch('templates', templateWatch, true);
      function templateWatch(templates, oldValue) {
        if(templates === oldValue) return;

        var templatesByType = _.groupBy($scope.templates, 'templateType');
        $scope.groupedTemplates = _.map($scope.templateTypes, function(type){
          return {
            type: type,
            templates: templatesByType[type.id]
          }
        });
      }

      $scope.addTestData = function() {
        addStudentOfTheMonth();
      };

      function addIdCard(){

      }

      function addStudentOfTheMonth(){
        var templateTypeId = liveTemplateTypes.add({
          id: "559641b7-66ec-4828-b6b9-77a4dabd0180",
          name: 'Student of the Month',
          requiredFields: ["Student_Name", "Student_Picture"],
          optionFields: ["Student_Grade", "Student_Teacher", "School_Name"],
          mockData: {
            "Student_Name": "Johnny Appleseed",
            "Student_Picture":"",
            "Student_Grade":"11",
            "Student_Teacher":"Mr. Krum",
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