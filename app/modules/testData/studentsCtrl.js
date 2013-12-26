(function () {
  angular.module('testData')
    .controller('testData.studentsCtrl', function ($scope, liveResource) {
      window.debugScope = $scope;

      var liveStudents = liveResource('students');
      var studentsQuery = liveStudents.query({});
      $scope.students = liveStudents.subscribe(studentsQuery);

      $scope.hasStudents = function () {
        return _.keys($scope.students).length ? true : false;
      };

      $scope.addTestData = function () {
        if ($scope.hasStudents()) return;

        addStudents();
      };

      $scope.deleteAll = function () {
        if (!$scope.hasStudents()) return;

        _.each($scope.students, function (student) {
          liveStudents.del(student);
        })
      };

      function addStudents() {
        liveStudents.add({
          "First_Name": "Barry",
          "Last_Name": "Mantello",
          "Teacher_Name": "John Madden",
          "Grade": "11",
          "Portrait": "img/CO/Flash1.jpg",
          "School_Name": "Sunnyside High"
        });

        liveStudents.add({
          "First_Name": "Marcus",
          "Last_Name": "Jordan",
          "Teacher_Name": "John Madden",
          "Grade": "11",
          "Portrait": "img/CO/Flash5.jpg",
          "School_Name": "Sunnyside High"
        });

        liveStudents.add({
          "First_Name": "Steven",
          "Last_Name": "Vang",
          "Teacher_Name": "Sherry Alvirez",
          "Grade": "11",
          "Portrait": "img/CO/Flash7.jpg",
          "School_Name": "Sunnyside High"
        });

        liveStudents.add({
          "First_Name": "Gary",
          "Last_Name": "Anderson",
          "Teacher_Name": "Sherry Alvirez",
          "Grade": "11",
          "Portrait": "img/CO/Flash9.jpg",
          "School_Name": "Sunnyside High"
        });
      }
    });
}());