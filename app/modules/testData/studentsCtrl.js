(function () {
  angular.module('testData.controllers')
    .controller('studentsCtrl', function ($scope, liveResource) {
      var liveStudents = liveResource('students');
      var studentsQuery = liveStudents.query({});
      $scope.students = liveStudents.subscribe(studentsQuery);

      $scope.addTestData = function () {
        addStudents();
      };

      function addStudents(){
        liveStudents.add({
          "Student_First_Name":"Barry",
          "Student_Last_Name":"Mantello",
          "Student_Teacher":"John Madden",
          "Student_Grade":"11",
          "Student_Picture":"img/CO/Flash1.jpg",
          "School_Name":"Sunnyside Elementary"
        });

        liveStudents.add({
          "Student_First_Name":"Marcus",
          "Student_Last_Name":"Jordan",
          "Student_Teacher":"John Madden",
          "Student_Grade":"11",
          "Student_Picture":"img/CO/Flash5.jpg",
          "School_Name":"Sunnyside Elementary"
        });

        liveStudents.add({
          "Student_First_Name":"Steven",
          "Student_Last_Name":"Vang",
          "Student_Teacher":"Sherry Alvirez",
          "Student_Grade":"11",
          "Student_Picture":"img/CO/Flash7.jpg",
          "School_Name":"Sunnyside Elementary"
        });

        liveStudents.add({
          "Student_First_Name":"Gary",
          "Student_Last_Name":"Anderson",
          "Student_Teacher":"Sherry Alvirez",
          "Student_Grade":"11",
          "Student_Picture":"img/CO/Flash9.jpg",
          "School_Name":"Sunnyside Elementary"
        });
      }
    });
}());