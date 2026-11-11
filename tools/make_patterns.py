#!/usr/bin/env python3
"""Erzeugt die Musterdateien (markers/pattern-XX.patt) für die Marker der Arbeitsblätter.

Aufruf im Projektordner:   python3 tools/make_patterns.py

Aufbau eines Markers: 5 x 5 Kästchen, außen ein schwarzer Rahmen, innen 3 x 3 Kästchen.
Die Ecke oben links im Inneren ist weiß (Orientierung), die drei anderen Ecken sind schwarz.
Die fünf übrigen Felder tragen die ID als Binärzahl: schwarz = 0, weiß = 1,
Lesereihenfolge oben Mitte, Mitte links, Mitte, Mitte rechts, unten Mitte.

Format einer .patt-Datei (AR.js / ARToolKit): das innere Muster als 16 x 16 Pixel,
für vier Drehungen (jeweils 90 Grad gegen den Uhrzeigersinn weitergedreht) und drei Farbkanäle.
"""
import os

IDS = [5, 6, 12, 14, 18, 21, 27]
ORDER = [(0, 1), (1, 0), (1, 1), (1, 2), (2, 1)]   # (Zeile, Spalte) der Datenfelder 1 bis 5
SIZE = 16


def inner(marker_id):
    """Inneres 3 x 3 Feld, 1 = weiß."""
    grid = [[0] * 3 for _ in range(3)]
    grid[0][0] = 1
    for i, (row, col) in enumerate(ORDER):
        grid[row][col] = (marker_id >> (4 - i)) & 1
    return grid


def overlap(pixel, cell):
    """Anteil des Pixels (0..15), der im Kästchen (0..2) liegt. Gerechnet in 48stel."""
    start, end = pixel * 3, pixel * 3 + 3
    return max(0, min(end, (cell + 1) * 16) - max(start, cell * 16)) / 3


def image(grid):
    """Skaliert das 3 x 3 Feld auf 16 x 16 Graustufen (0..255)."""
    img = []
    for y in range(SIZE):
        line = []
        for x in range(SIZE):
            value = sum(grid[r][c] * overlap(y, r) * overlap(x, c) for r in range(3) for c in range(3))
            line.append(int(value * 255 + 0.5))
        img.append(line)
    return img


def rotate_ccw(img):
    """Dreht das Bild um 90 Grad gegen den Uhrzeigersinn."""
    return [[img[x][SIZE - 1 - y] for x in range(SIZE)] for y in range(SIZE)]


def patt(marker_id):
    img = image(inner(marker_id))
    blocks = []
    for _ in range(4):
        lines = [' '.join(str(v).rjust(3) for v in row) for _channel in range(3) for row in img]
        blocks.append('\n'.join(lines) + '\n')
        img = rotate_ccw(img)
    return '\n'.join(blocks)


if __name__ == '__main__':
    target = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'markers')
    os.makedirs(target, exist_ok=True)
    for marker_id in IDS:
        path = os.path.join(target, 'pattern-%02d.patt' % marker_id)
        with open(path, 'w') as f:
            f.write(patt(marker_id))
        print('geschrieben:', os.path.normpath(path))
