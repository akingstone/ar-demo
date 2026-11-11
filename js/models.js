/* 3D-Objekte der AR-Demo, zusammengesetzt aus einfachen A-Frame-Formen.
   Koordinaten: Der Marker liegt in der x-z-Ebene, y zeigt nach oben, die Markerbreite ist 1. */
(function (ARDemo) {
  'use strict';

  function spin(duration) {
    return 'animation="property: rotation; to: 0 360 0; dur: ' + duration + '; easing: linear; loop: true"';
  }

  ARDemo.models = {

    /* Würfel */
    5: [
      '<a-entity position="0 0.45 0" ' + spin(6000) + '>',
      '  <a-box width="0.7" height="0.7" depth="0.7" color="#E8A33D"></a-box>',
      '</a-entity>'
    ],

    /* Auto */
    6: [
      '<a-entity position="0 0.12 0" ' + spin(8000) + '>',
      '  <a-box position="0 0.2 0" width="1" height="0.25" depth="0.5" color="#D7263D"></a-box>',
      '  <a-box position="-0.05 0.43 0" width="0.5" height="0.22" depth="0.44" color="#9AD1F5"></a-box>',
      '  <a-cylinder position="-0.3 0.08 0.26" radius="0.13" height="0.08" rotation="90 0 0" color="#222222"></a-cylinder>',
      '  <a-cylinder position="0.3 0.08 0.26" radius="0.13" height="0.08" rotation="90 0 0" color="#222222"></a-cylinder>',
      '  <a-cylinder position="-0.3 0.08 -0.26" radius="0.13" height="0.08" rotation="90 0 0" color="#222222"></a-cylinder>',
      '  <a-cylinder position="0.3 0.08 -0.26" radius="0.13" height="0.08" rotation="90 0 0" color="#222222"></a-cylinder>',
      '</a-entity>'
    ],

    /* Rakete */
    12: [
      '<a-entity animation="property: position; from: 0 0.05 0; to: 0 0.35 0; dir: alternate; dur: 1500; easing: easeInOutSine; loop: true">',
      '  <a-cylinder position="0 0.55 0" radius="0.18" height="0.7" color="#F2F2F2"></a-cylinder>',
      '  <a-cone position="0 1.08 0" radius-bottom="0.18" radius-top="0" height="0.36" color="#D7263D"></a-cone>',
      '  <a-box position="0.22 0.3 0" width="0.14" height="0.3" depth="0.04" color="#D7263D"></a-box>',
      '  <a-box position="-0.22 0.3 0" width="0.14" height="0.3" depth="0.04" color="#D7263D"></a-box>',
      '  <a-box position="0 0.3 0.22" width="0.04" height="0.3" depth="0.14" color="#D7263D"></a-box>',
      '  <a-box position="0 0.3 -0.22" width="0.04" height="0.3" depth="0.14" color="#D7263D"></a-box>',
      '  <a-sphere position="0 0.7 0.17" radius="0.07" color="#2E86DE"></a-sphere>',
      '  <a-cone position="0 0.1 0" radius-bottom="0" radius-top="0.12" height="0.22" color="#F5A623"></a-cone>',
      '</a-entity>'
    ],

    /* Baum */
    14: [
      '<a-cylinder position="0 0.25 0" radius="0.09" height="0.5" color="#7B4B2A"></a-cylinder>',
      '<a-cone position="0 0.65 0" radius-bottom="0.42" radius-top="0" height="0.55" color="#2E8B57"></a-cone>',
      '<a-cone position="0 0.95 0" radius-bottom="0.32" radius-top="0" height="0.45" color="#37A169"></a-cone>',
      '<a-cone position="0 1.2 0" radius-bottom="0.22" radius-top="0" height="0.35" color="#48BB78"></a-cone>'
    ],

    /* Erdkugel */
    18: [
      '<a-entity position="0 0.6 0" ' + spin(9000) + '>',
      '  <a-sphere radius="0.45" color="#2E86DE"></a-sphere>',
      '  <a-sphere position="0.25 0.2 0.25" radius="0.2" scale="1 1 0.6" color="#3CB371"></a-sphere>',
      '  <a-sphere position="-0.3 -0.05 0.2" radius="0.18" scale="0.6 1.2 1" color="#3CB371"></a-sphere>',
      '  <a-sphere position="0.05 -0.2 -0.36" radius="0.2" scale="1.3 1 0.5" color="#3CB371"></a-sphere>',
      '  <a-sphere position="-0.1 0.38 -0.1" radius="0.14" scale="1.4 0.5 1.2" color="#F2F2F2"></a-sphere>',
      '</a-entity>'
    ],

    /* Dinosaurier */
    21: [
      '<a-entity scale="0.75 0.75 0.75" ' + spin(10000) + '>',
      '  <a-sphere position="0 0.5 0" radius="0.28" scale="1.6 1 1" color="#4CAF50"></a-sphere>',
      '  <a-cylinder position="0.42 0.78 0" radius="0.09" height="0.5" rotation="0 0 -30" color="#4CAF50"></a-cylinder>',
      '  <a-sphere position="0.58 1.02 0" radius="0.14" scale="1.4 0.9 0.9" color="#4CAF50"></a-sphere>',
      '  <a-sphere position="0.66 1.07 0.1" radius="0.03" color="#111111"></a-sphere>',
      '  <a-sphere position="0.66 1.07 -0.1" radius="0.03" color="#111111"></a-sphere>',
      '  <a-cone position="-0.62 0.45 0" radius-bottom="0.14" radius-top="0" height="0.6" rotation="0 0 80" color="#4CAF50"></a-cone>',
      '  <a-cylinder position="0.2 0.15 0.15" radius="0.07" height="0.3" color="#388E3C"></a-cylinder>',
      '  <a-cylinder position="0.2 0.15 -0.15" radius="0.07" height="0.3" color="#388E3C"></a-cylinder>',
      '  <a-cylinder position="-0.2 0.15 0.15" radius="0.07" height="0.3" color="#388E3C"></a-cylinder>',
      '  <a-cylinder position="-0.2 0.15 -0.15" radius="0.07" height="0.3" color="#388E3C"></a-cylinder>',
      '</a-entity>'
    ],

    /* Herz */
    27: [
      '<a-entity position="0 0.2 0" animation="property: scale; from: 1 1 1; to: 1.15 1.15 1.15; dir: alternate; dur: 600; easing: easeInOutSine; loop: true">',
      '  <a-entity ' + spin(7000) + '>',
      '    <a-sphere position="-0.2 0.62 0" radius="0.25" color="#E0245E"></a-sphere>',
      '    <a-sphere position="0.2 0.62 0" radius="0.25" color="#E0245E"></a-sphere>',
      '    <a-cone position="0 0.3 0" radius-bottom="0" radius-top="0.43" height="0.6" scale="1 1 0.58" color="#E0245E"></a-cone>',
      '  </a-entity>',
      '</a-entity>'
    ]
  };

  /* Liefert das HTML eines Objekts als eine Zeichenkette. */
  ARDemo.modelHtml = function (id) {
    return (ARDemo.models[id] || []).join('');
  };

})(window.ARDemo);
