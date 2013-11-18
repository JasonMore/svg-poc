(function(){
  angular.module('testData.controllers')
    .controller('templatesCtrl', function($scope, liveData) {

      var liveTemplateTypes = liveData('templateTypes');
      var liveTemplates = liveData('templates');

      function addStudentOfTheMonth(){
        var templateType = liveTemplateTypes.add({
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
          name: 'Top 1',
          templateType: templateType.id
        })

        templateType

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