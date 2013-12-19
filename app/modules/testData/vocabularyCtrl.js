(function () {

  angular.module('testData')
    .controller('testData.vocabularyCtrl', function ($scope, liveResource) {
      var liveVocabulary = liveResource('vocabulary');
      var vocabularyQuery = liveVocabulary.query({});
      $scope.vocabulary = liveVocabulary.subscribe(vocabularyQuery);

      $scope.hasVocabulary = function () {
        return _.keys($scope.vocabulary).length ? true : false;
      };

      $scope.deleteAll = function() {
        if (!$scope.hasVocabulary()) return;

        angular.forEach($scope.vocabulary, function(item){
          liveVocabulary.delete(item);
        });
      };

      $scope.addTestData = function () {
        if ($scope.hasVocabulary()) return;

        liveVocabulary.add({field: 'Student_ID', type: 'alpha'});
        liveVocabulary.add({field: 'Barcode1', type: 'number_barcode'});
        liveVocabulary.add({field: 'Barcode2', type: 'alpha'});
        liveVocabulary.add({field: 'First_Name', type: 'alpha'});
        liveVocabulary.add({field: 'Last_Name', type: 'alpha'});
        liveVocabulary.add({field: 'Middle', type: 'alpha'});
        liveVocabulary.add({field: 'Address', type: 'alpha'});
        liveVocabulary.add({field: 'City', type: 'alpha'});
        liveVocabulary.add({field: 'State', type: 'alpha'});
        liveVocabulary.add({field: 'Postal_Code', type: 'alpha'});
        liveVocabulary.add({field: 'Courtesy', type: 'alpha'});
        liveVocabulary.add({field: 'Grade', type: 'alpha'});
        liveVocabulary.add({field: 'Date_Of_Birth', type: 'date'});
        liveVocabulary.add({field: 'Homeroom', type: 'alpha'});
        liveVocabulary.add({field: 'Portrait', type: 'imageUrl'});
        liveVocabulary.add({field: 'Locker', type: 'alpha'});
        liveVocabulary.add({field: 'Bus', type: 'alpha'});
        liveVocabulary.add({field: 'Misc1', type: 'alpha'});
        liveVocabulary.add({field: 'Misc2', type: 'alpha'});
        liveVocabulary.add({field: 'Phone', type: 'alpha'});
        liveVocabulary.add({field: 'TeacherNbr', type: 'alpha'});
        liveVocabulary.add({field: 'Track', type: 'alpha'});
      }

    });

}());