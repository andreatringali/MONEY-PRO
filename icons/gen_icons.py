#!/usr/bin/env python3
"""Genera le icone PNG di Money Pro (sfondo teal full-bleed + simbolo €).
Encoder PNG in puro Python, senza dipendenze."""
import struct, zlib, math

TOP = (0x14, 0xb8, 0xa6)   # #14b8a6
BOT = (0x0f, 0x76, 0x6e)   # #0f766e
WHITE = (255, 255, 255)


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def euro_coverage(x, y, S):
    """Coverage [0..1] del simbolo € nel punto (x,y) su canvas SxS, con supersampling."""
    cx, cy = S * 0.52, S * 0.50
    R = S * 0.30          # raggio esterno arco
    thick = S * 0.072     # spessore tratto
    r_in = R - thick
    bar_hw = S * 0.05     # semi-altezza barre
    bar_x0 = cx - R * 1.15
    bar_x1 = cx + R * 0.30
    open_deg = 42         # apertura della "C" a destra

    acc = 0
    N = 3
    for sx in range(N):
        for sy in range(N):
            px = x + (sx + 0.5) / N
            py = y + (sy + 0.5) / N
            dx, dy = px - cx, py - cy
            dist = math.hypot(dx, dy)
            hit = False
            # arco a C (aperto a destra)
            if r_in <= dist <= R:
                ang = math.degrees(math.atan2(dy, dx))  # -180..180, 0 = destra
                if abs(ang) > open_deg:
                    hit = True
            # due barre orizzontali
            if not hit and bar_x0 <= px <= bar_x1:
                if abs(py - (cy - S * 0.085)) <= bar_hw:
                    hit = True
                elif abs(py - (cy + S * 0.085)) <= bar_hw:
                    hit = True
            if hit:
                acc += 1
    return acc / (N * N)


def make_png(path, S):
    raw = bytearray()
    for y in range(S):
        raw.append(0)  # filter type 0
        bg = lerp(TOP, BOT, y / (S - 1))
        for x in range(S):
            cov = euro_coverage(x, y, S)
            if cov <= 0:
                px = bg
            elif cov >= 1:
                px = WHITE
            else:
                px = lerp(bg, WHITE, cov)
            raw.extend(px)

    def chunk(tag, data):
        c = struct.pack(">I", len(data)) + tag + data
        return c + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff)

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", S, S, 8, 2, 0, 0, 0)  # 8-bit RGB
    idat = zlib.compress(bytes(raw), 9)
    with open(path, "wb") as f:
        f.write(sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b""))
    print("scritto", path)


make_png("icon-192.png", 192)
make_png("icon-512.png", 512)
