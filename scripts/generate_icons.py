import struct
import zlib
import os

def create_png(width, height, color_rgb=(20, 45, 78)):
    # PNG signature
    png = b'\x89PNG\r\n\x1a\n'
    
    # IHDR
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png += struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT (raw RGB image data with filter byte 0 per line)
    raw_lines = []
    r, g, b = color_rgb
    for y in range(height):
        # Line with rounded inner border effect
        line = bytearray([0]) # Filter byte: None
        for x in range(width):
            # Inner badge
            margin = int(min(width, height) * 0.15)
            if margin <= x <= width - margin and margin <= y <= height - margin:
                line.extend((21, 154, 117)) # Secondary emerald
            else:
                line.extend((r, g, b)) # Navy
        raw_lines.append(bytes(line))
        
    raw_data = b''.join(raw_lines)
    compressed = zlib.compress(raw_data)
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    png += struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)
    
    # IEND
    iend_crc = zlib.crc32(b'IEND')
    png += struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    return png

public_dir = os.path.join(os.path.dirname(__file__), '..', 'public')
os.makedirs(public_dir, exist_ok=True)

with open(os.path.join(public_dir, 'pwa-192x192.png'), 'wb') as f:
    f.write(create_png(192, 192))

with open(os.path.join(public_dir, 'pwa-512x512.png'), 'wb') as f:
    f.write(create_png(512, 512))

with open(os.path.join(public_dir, 'apple-touch-icon.png'), 'wb') as f:
    f.write(create_png(180, 180))

with open(os.path.join(public_dir, 'favicon.ico'), 'wb') as f:
    f.write(create_png(32, 32))

print('Successfully generated PWA icon assets.')
