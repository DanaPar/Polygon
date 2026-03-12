function LGStoGE(input) {
    let DMS = processString(input);
    const degDecArr = DMS.map(coord => {
        return DMStoDegDec(coord.lat, coord.lon)
    });

    createKML(degDecArr);
}

function processString(input) {
    const coordPattern = /(\d+\.\d+N)(\d+\.\d+E)/g;
    const matches = [...input.matchAll(coordPattern)];

    return matches.map(match => ({
        lat: match[1],
        lon: match[2]
    }));
}

function DMStoDegDec(lat, lon) {
    const format = (value, isLat) => {
        const direction = value.slice(-1);
        const numPart = value.slice(0, -1);

        const degLen = isLat ? 2 : 3;

        const deg = parseFloat(numPart.substring(0, degLen));
        const min = parseFloat(numPart.substring(degLen, degLen + 2));
        const sec = parseFloat(numPart.substring(degLen + 2));

        let decimal = deg + (min / 60) + (sec / 3600);

        if(direction === 'S' || direction === 'W') {
            decimal *= -1;
        }

        return parseFloat(decimal.toFixed(7));
    };

    return {
        lat: format(lat, true),
        lon: format(lon, false),
    }
}

function createKML(degDec) {
    const coordinates = degDec.map(coord => `${coord.lon},${coord.lat},0`).join(' ');

    const template = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Exported Polygon</name>
    <Style id="polyStyle">
      <LineStyle>
        <color>ff0000ff</color>
        <width>2</width>
      </LineStyle>
      <PolyStyle>
        <color>4d00ffff</color>
      </PolyStyle>
    </Style>
    <Placemark>
      <name>My Area</name>
      <styleUrl>#polyStyle</styleUrl>
      <Polygon>
        <tessellate>1</tessellate>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              ${coordinates}
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`;

    downloadKML(template, "FlightArea.kml");
}

function downloadKML(content, fileName) {
    const blob = new Blob([content], { type: 'application/vnd.google-earth.kml+xml' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}