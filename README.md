# AR-Demo: Marker lesen

Kleine Webseite für den Informatikunterricht. Sie erkennt über die Kamera die Marker der
Arbeitsblätter („Marker lesen“) und blendet das Objekt aus der Objekttabelle über dem Kamerabild ein.

Adresse nach dem Veröffentlichen: https://akingstone.github.io/ar-demo/

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `index.html` | Seitengerüst: Startseite, Statusleiste, Fehlerseite |
| `css/style.css` | Gestaltung |
| `js/config.js` | Einstellungen: Marker-IDs, Objektnamen, Pfade |
| `js/models.js` | Die sieben 3D-Objekte aus einfachen Formen |
| `js/camera.js` | Kamera: Voraussetzungen, Berechtigung, Fehlertexte je Browser |
| `js/app.js` | Ablauf: Start per Klick, AR-Szene aufbauen, Status anzeigen |
| `lib/` | Bibliotheken A-Frame und AR.js, unverändert (siehe `lib/README.md`) |
| `data/camera_para.dat` | Kameraparameter für AR.js |
| `markers/` | Musterdateien der Marker (`pattern-05.patt` …) |
| `tools/make_patterns.py` | Erzeugt die Musterdateien neu |
| `.nojekyll` | Sagt GitHub Pages, dass die Dateien unverändert ausgeliefert werden |

## Lokal testen

Die Kamera funktioniert nur über `https://` oder `http://localhost`, nicht per Doppelklick auf `index.html`.

```
cd AR-Demo
python3 -m http.server 8000
```

Dann im Browser `http://localhost:8000` öffnen.

## Veröffentlichen

Änderungen committen und nach `main` pushen. GitHub Pages liefert den Stand von `main` nach ein bis zwei Minuten aus.

## Kamera und Browser

- Die Kamera startet erst nach einem Klick auf „Kamera starten“.
- Vor dem Start prüft die Seite: sichere Adresse, Kamera-Schnittstelle des Browsers, WebGL.
- Wo der Browser es unterstützt, fragt die Seite den Stand der Kamera-Berechtigung ab
  (erlaubt, gesperrt, noch nicht gefragt). Firefox und ältere Safari-Versionen können das nicht.
  Dann fragt der Browser beim Start selbst nach.
- Schlägt der Start fehl, nennt die Seite den Grund (nicht erlaubt, keine Kamera, Kamera belegt)
  und zeigt, wie man die Kamera im jeweiligen Browser freigibt.

## Marker

5 × 5 Kästchen: außen ein schwarzer Rahmen, innen 3 × 3 Kästchen. Die Ecke oben links im Inneren ist weiß,
die fünf Datenfelder tragen die ID als Binärzahl (schwarz = 0, weiß = 1). Der Marker braucht ringsum einen weißen Rand.

Neue ID ergänzen: in `tools/make_patterns.py` und `js/config.js` eintragen, in `js/models.js` ein Objekt anlegen,
dann `python3 tools/make_patterns.py` ausführen.
