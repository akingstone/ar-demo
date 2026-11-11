/* Ablauf der AR-Demo: Startseite, Kamerastart, AR-Szene, Statusanzeige. */
(function (ARDemo) {
  'use strict';

  var camera = ARDemo.camera;

  var el = {
    bar: document.getElementById('bar'),
    status: document.getElementById('status'),
    start: document.getElementById('start'),
    startButton: document.getElementById('start-button'),
    permissionInfo: document.getElementById('permission-info'),
    error: document.getElementById('error-popup'),
    errorText: document.getElementById('error-text'),
    errorHelp: document.getElementById('error-help'),
    errorDetail: document.getElementById('error-detail'),
    retryButton: document.getElementById('retry-button')
  };

  var state = { started: false, cameraReady: false, failed: false, timer: null };
  var visible = {};   // welche Marker gerade im Bild sind

  /* ---------- Anzeige ---------- */
  function showError(message) {
    state.failed = true;
    if (state.timer) { clearTimeout(state.timer); }
    el.errorText.textContent = message.text || '';
    el.errorHelp.textContent = message.help || '';
    el.errorDetail.textContent = message.detail ? 'Technischer Hinweis: ' + message.detail : '';
    el.start.hidden = true;
    el.bar.hidden = true;
    el.error.hidden = false;
  }

  function showStatus() {
    var found = ARDemo.markers.filter(function (m) { return visible[m.id]; });
    if (found.length === 0) {
      el.status.textContent = 'Kein Marker im Bild';
      el.status.className = '';
      return;
    }
    el.status.textContent = found.map(function (m) {
      return 'Marker erkannt: ID ' + m.id + ' → ' + m.name;
    }).join('   ·   ');
    el.status.className = 'found';
  }

  function showPermission(permission) {
    var text;
    if (permission === 'granted') {
      text = 'Die Kamera ist für diese Seite bereits erlaubt.';
    } else if (permission === 'denied') {
      text = 'Die Kamera ist für diese Seite im Browser gesperrt.\n' + camera.allowHelp();
    } else {
      text = 'Dein Browser fragt gleich, ob diese Seite die Kamera benutzen darf. Wähle „Erlauben“.\n' +
             'Das Kamerabild bleibt auf deinem Gerät und wird nirgendwohin übertragen.';
    }
    el.permissionInfo.textContent = text;
  }

  /* ---------- AR-Szene ---------- */
  function buildScene() {
    var html =
      '<a-scene embedded vr-mode-ui="enabled: false" ' +
      'renderer="logarithmicDepthBuffer: true; antialias: true; alpha: true" ' +
      'arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono; ' +
      'patternRatio: ' + ARDemo.patternRatio + '; cameraParametersUrl: ' + ARDemo.cameraParameters + ';">' +
      '<a-entity light="type: ambient; intensity: 0.75"></a-entity>' +
      '<a-entity light="type: directional; intensity: 0.7" position="1 2 1"></a-entity>';

    ARDemo.markers.forEach(function (m) {
      html += '<a-marker type="pattern" url="' + m.pattern + '" data-id="' + m.id + '" smooth="true" smoothCount="5">' +
              ARDemo.modelHtml(m.id) + '</a-marker>';
    });
    html += '<a-entity camera></a-entity></a-scene>';

    var holder = document.createElement('div');
    holder.innerHTML = html;
    var scene = holder.firstChild;
    document.body.appendChild(scene);

    Array.prototype.forEach.call(scene.querySelectorAll('a-marker'), function (markerEl) {
      var id = markerEl.getAttribute('data-id');
      markerEl.addEventListener('markerFound', function () { visible[id] = true; showStatus(); });
      markerEl.addEventListener('markerLost', function () { visible[id] = false; showStatus(); });
    });
  }

  /* ---------- Start ---------- */
  function start() {
    if (state.started) { return; }
    state.started = true;
    el.startButton.disabled = true;
    el.start.hidden = true;
    el.bar.hidden = false;
    el.status.textContent = 'Kamera wird gestartet …';

    camera.rememberErrors();

    // AR.js meldet Erfolg und Misserfolg über diese beiden Ereignisse.
    window.addEventListener('camera-init', function () {
      state.cameraReady = true;
      if (state.timer) { clearTimeout(state.timer); }
      if (!state.failed) { showStatus(); }
    });
    window.addEventListener('camera-error', function () {
      showError(camera.errorMessage(camera.lastError()));
    });

    // Falls der Browser weder das eine noch das andere meldet.
    state.timer = setTimeout(function () {
      if (!state.cameraReady && !state.failed) {
        showError({
          text: 'Die Kamera hat nicht geantwortet.',
          help: 'Prüfe, ob der Browser nach der Kamera gefragt hat und ob du „Erlauben“ gewählt hast. Lade die Seite dann neu.'
        });
      }
    }, ARDemo.startTimeout);

    try {
      buildScene();
    } catch (e) {
      showError({ text: 'Die AR-Szene konnte nicht aufgebaut werden.', help: 'Lade die Seite neu.', detail: String(e) });
    }
  }

  /* ---------- Beim Laden der Seite ---------- */
  el.retryButton.addEventListener('click', function () { window.location.reload(); });

  if (typeof window.AFRAME === 'undefined') {
    showError({
      text: 'Die 3D-Bibliothek konnte nicht geladen werden.',
      help: 'Prüfe die Internetverbindung und lade die Seite neu.'
    });
    return;
  }

  var problem = camera.checkSupport();
  if (problem) {
    showError(camera.supportMessage(problem));
    return;
  }

  // Die Kamera startet erst nach einem Klick. Das verlangen manche Browser,
  // und so kommt die Rückfrage des Browsers nicht überraschend.
  el.startButton.addEventListener('click', start);

  showPermission('unknown');
  camera.queryPermission(showPermission).then(showPermission);

})(window.ARDemo);
