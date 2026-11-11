/* Einstellungen der AR-Demo. Alle anderen Skripte lesen aus window.ARDemo. */
window.ARDemo = {

  /* Die Marker der Arbeitsblätter: ID, Name des Objekts und zugehörige Musterdatei.
     Die Musterdateien erzeugt tools/make_patterns.py. */
  markers: [
    { id: 5,  name: 'Würfel',      pattern: 'markers/pattern-05.patt' },
    { id: 6,  name: 'Auto',        pattern: 'markers/pattern-06.patt' },
    { id: 12, name: 'Rakete',      pattern: 'markers/pattern-12.patt' },
    { id: 14, name: 'Baum',        pattern: 'markers/pattern-14.patt' },
    { id: 18, name: 'Erdkugel',    pattern: 'markers/pattern-18.patt' },
    { id: 21, name: 'Dinosaurier', pattern: 'markers/pattern-21.patt' },
    { id: 27, name: 'Herz',        pattern: 'markers/pattern-27.patt' }
  ],

  /* Anteil des inneren Musters an der Markerbreite.
     Unsere Marker: 5 Kästchen breit, davon 3 innen, also 3/5 = 0.6. */
  patternRatio: 0.6,

  /* Kameraparameter, die AR.js für die Lageberechnung braucht. */
  cameraParameters: 'data/camera_para.dat',

  /* So lange wartet die Seite auf die Kamera, bevor sie einen Hinweis zeigt (Millisekunden). */
  startTimeout: 20000
};
