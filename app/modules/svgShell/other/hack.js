(function() {
  angular.module('svgShell')
    .controller('svgShellCtrl', function ($scope){

      //hack


      $('#svgDiv').svg({
        onLoad: drawIntro,
        settings: { height: 600, width: 600}
      });

      $scope.btnTest = function () {
        var tgt = document.getElementById(event.srcElement.getAttribute('targetNode'));
        recalcText(tgt);
      };

      $scope.btnEdit = function() {

        var svg = $('#svgDiv').svg('get');

        var svgText = document.getElementById(event.srcElement.getAttribute('targetNode'));

        var g = svgText.parentElement.id;

        svgText.parentElement.removeChild(svgText);
        var newText = prompt('Enter Sample Text', svgText.textContent);

        var textSpans = svg.createText();
        textSpans.string(newText);

        var text = svg.text($('#' + g), 0,0, textSpans,
          {
            id: svgText.id,
            container:svgText.getAttribute('container'),
            opacity: 0.7,
            fontFamily: 'Verdana',
            fontSize: '20.0',
            fill: 'blue'
          });

        recalcText(text);
      };

    })
  ;

})();