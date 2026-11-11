/* Kamera: Voraussetzungen prüfen, Berechtigung abfragen, Fehler verständlich erklären.
   Hier steht alles, was sich zwischen den Browsern unterscheidet. */
(function (ARDemo) {
  'use strict';

  var lastError = null;

  /* ---------- Welcher Browser? (nur für passende Hilfetexte) ---------- */
  function browserFamily() {
    var ua = navigator.userAgent || '';
    var isIOS = /iPad|iPhone|iPod/.test(ua) ||
                (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);   // iPadOS meldet sich als Mac
    if (isIOS) { return 'ios'; }
    if (/Firefox\//.test(ua)) { return 'firefox'; }
    if (/Edg\//.test(ua)) { return 'edge'; }
    if (/Chrome\//.test(ua) || /Chromium\//.test(ua)) { return 'chrome'; }
    if (/Safari\//.test(ua)) { return 'safari'; }
    return 'other';
  }

  function hasWebGL() {
    try {
      var canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  /* ---------- Voraussetzungen ----------
     Liefert null, wenn alles passt, sonst einen Schlüssel für die Fehlermeldung. */
  function checkSupport() {
    // Browser geben die Kamera nur auf https-Seiten und auf localhost frei.
    if (window.isSecureContext === false) { return 'insecure'; }
    var md = navigator.mediaDevices;
    if (!md || typeof md.getUserMedia !== 'function' || typeof md.enumerateDevices !== 'function') {
      return 'no-api';
    }
    if (!hasWebGL()) { return 'no-webgl'; }
    return null;
  }

  /* ---------- Berechtigung abfragen ----------
     Ergebnis: 'granted', 'prompt', 'denied' oder 'unknown'.
     Die Permissions API kennt 'camera' nicht in jedem Browser (Firefox und ältere
     Safari-Versionen lehnen die Abfrage ab). Dann gilt 'unknown', und der Browser
     fragt beim Start der Kamera selbst nach. */
  function queryPermission(onChange) {
    if (!navigator.permissions || typeof navigator.permissions.query !== 'function') {
      return Promise.resolve('unknown');
    }
    var request;
    try {
      request = navigator.permissions.query({ name: 'camera' });
    } catch (e) {
      return Promise.resolve('unknown');
    }
    return Promise.resolve(request).then(function (status) {
      if (!status || !status.state) { return 'unknown'; }
      if (typeof onChange === 'function') {
        try {
          status.onchange = function () { onChange(status.state); };
        } catch (e) { /* manche Browser erlauben onchange hier nicht */ }
      }
      return status.state;
    }, function () {
      return 'unknown';
    });
  }

  /* ---------- Fehlerursache merken ----------
     AR.js startet die Kamera selbst, gibt die Fehlerursache aber nicht weiter.
     Darum wird getUserMedia hier dünn umhüllt: Der Aufruf bleibt unverändert,
     ein Fehler wird nur zusätzlich gespeichert. So gibt es genau einen
     Kamerazugriff und genau eine Rückfrage des Browsers. */
  function rememberErrors() {
    var md = navigator.mediaDevices;
    if (!md || md.__arDemoWrapped) { return; }
    try {
      var original = md.getUserMedia.bind(md);
      md.getUserMedia = function (constraints) {
        return original(constraints).catch(function (error) {
          lastError = error;
          throw error;
        });
      };
      md.__arDemoWrapped = true;
    } catch (e) { /* Ohne Umhüllung gibt es nur die allgemeine Fehlermeldung. */ }
  }

  /* ---------- Hilfetexte ---------- */
  function allowHelp() {
    switch (browserFamily()) {
      case 'ios':
        return 'So erlaubst du die Kamera auf iPad und iPhone:\n' +
               'Tippe in der Adressleiste auf das Symbol links neben der Adresse, dann auf „Website-Einstellungen“ und stelle „Kamera“ auf „Erlauben“.\n' +
               'Hilft das nicht: Einstellungen → Apps → Safari → Kamera → „Fragen“ oder „Erlauben“.';
      case 'safari':
        return 'So erlaubst du die Kamera in Safari:\n' +
               'Menü „Safari“ → „Einstellungen für diese Website“ → „Kamera“ auf „Erlauben“ stellen.';
      case 'firefox':
        return 'So erlaubst du die Kamera in Firefox:\n' +
               'Klicke links in der Adressleiste auf das Kamera- oder Schloss-Symbol und entferne die Sperre für die Kamera.';
      case 'chrome':
      case 'edge':
        return 'So erlaubst du die Kamera:\n' +
               'Klicke links in der Adressleiste auf das Symbol neben der Adresse und stelle „Kamera“ auf „Zulassen“.';
      default:
        return 'Erlaube in den Website-Einstellungen deines Browsers den Zugriff auf die Kamera.';
    }
  }

  /* Text für fehlende Voraussetzungen (Schlüssel aus checkSupport). */
  function supportMessage(problem) {
    if (problem === 'insecure') {
      return {
        text: 'Browser geben die Kamera nur auf sicheren Seiten frei.',
        help: 'Öffne die Seite über eine Adresse, die mit https:// beginnt, oder beim Testen am eigenen Rechner über http://localhost.'
      };
    }
    if (problem === 'no-api') {
      return {
        text: 'Dieser Browser kann Webseiten keinen Zugriff auf die Kamera geben.',
        help: 'Öffne die Seite in einer aktuellen Version von Safari, Chrome, Firefox oder Edge. Auf iPad und iPhone am besten direkt in Safari, nicht in der Vorschau einer anderen App.'
      };
    }
    if (problem === 'no-webgl') {
      return {
        text: 'Dieser Browser kann keine 3D-Grafik darstellen (WebGL fehlt oder ist ausgeschaltet).',
        help: 'Öffne die Seite in einem anderen Browser oder auf einem anderen Gerät.'
      };
    }
    return { text: 'Die Seite kann auf diesem Gerät nicht starten.', help: '' };
  }

  /* Text für einen Fehler beim Start der Kamera. */
  function errorMessage(error) {
    var name = (error && error.name) || '';
    var detail = error ? (name + (error.message ? ': ' + error.message : '')) : '';

    if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'SecurityError') {
      return {
        text: 'Der Zugriff auf die Kamera wurde nicht erlaubt.',
        help: allowHelp() + '\nLade die Seite danach neu.',
        detail: detail
      };
    }
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError' || name === 'OverconstrainedError') {
      return {
        text: 'An diesem Gerät wurde keine Kamera gefunden.',
        help: 'Schließe eine Kamera an oder öffne die Seite auf einem Gerät mit Kamera.',
        detail: detail
      };
    }
    if (name === 'NotReadableError' || name === 'TrackStartError' || name === 'AbortError') {
      return {
        text: 'Die Kamera ist gerade nicht verfügbar.',
        help: 'Meist benutzt ein anderes Programm die Kamera, zum Beispiel eine Videokonferenz. Schließe es und lade die Seite neu.',
        detail: detail
      };
    }
    return {
      text: 'Die Kamera konnte nicht gestartet werden.',
      help: 'Lade die Seite neu. Wenn das nicht hilft, probiere einen anderen Browser.',
      detail: detail
    };
  }

  ARDemo.camera = {
    browserFamily: browserFamily,
    checkSupport: checkSupport,
    queryPermission: queryPermission,
    rememberErrors: rememberErrors,
    lastError: function () { return lastError; },
    allowHelp: allowHelp,
    supportMessage: supportMessage,
    errorMessage: errorMessage
  };

})(window.ARDemo);
