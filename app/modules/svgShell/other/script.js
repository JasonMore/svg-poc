function drawIntro(svg) {

  var parentGroup = svg.group({
    id: 'parentGroup',
    transform: 'translate(5, 5) rotate(0, 100, 100)'
  });

  var rect = svg.rect(parentGroup, 0, 0, 300, 225, {
    id: 'rect',
    fillOpacity: 0.9,
    fill: 'white',
    stroke: 'blue',
    strokeWidth: 2
  });

  var textSpans = svg.createText();

  textSpans.string('SVG jg abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc')
    .span(' up ', {fill: 'red'})
    .string('SVG jg abc abc abc abc abc abc abc SVG jg abc abc abc abc abc abc abc SVG jg abc abc abc abc abc abc abc SVG jg abc abc abc abc abc abc abc SVG jg abc abc abc abc abc abc abc SVG jg abc abc abc abc abc abc abc SVG jg abc abc abc abc abc abc abc SVG jg abc abc abc abc abc abc abc abc abc abc');

  var text = svg.text(parentGroup, 0, 520, textSpans, {
    id: 'textBlock',
    container: 'rect',
    opacity: 0.7,
    fontFamily: 'Verdana',
    fontSize: '10.0',
    fill: 'blue'
  });


  var g2 = svg.group({
    id: 'parentGroup2',
    transform: 'translate(5, 250) rotate(0, 100, 100)'
  });

  svg.circle(g2, 150, 150, 150, {
    id: 'circle3',
    fillOpacity: 0.9,
    fill: 'white',
    stroke: 'blue',
    strokeWidth: 2
  });

  textSpans = svg.createText();
  textSpans.string('SVG jg abc abc abc abc abc abc abc abc abc abc abc')
    .span(' up ', {fontSize: '20.0', fill: 'red'})
    .string('SVG jg abc abc abc abc abc abc abc abc abc abc');


  var text2 = svg.text(g2, 0, 0, textSpans, {
    id: 'textBlock2',
    container: 'circle3',
    opacity: 0.7,
    fontFamily: 'Verdana',
    fontSize: '20.0',
    fill: 'blue'
  });

  svg.circle(240, 60, 100, {
    id: 'circle',
    class: 'svgdrag',
    fillOpacity: 0.9,
    fill: 'white',
    stroke: 'red',
    strokeWidth: 2
  });

  svg.circle(-140, 180, 200, {
    id: 'circle2',
    class: 'svgdrag',
    fillOpacity: 0.9,
    fill: 'white',
    stroke: 'red',
    strokeWidth: 2
  });

  recalcText(text);
  recalcText(text2);

}