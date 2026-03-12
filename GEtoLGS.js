async function GEtoLGS(file) {
    try {
        const degDec = await processKml(file);
        const dmsArray = degDec.map(coord => degDecToDMS(coord.lat, coord.lon));

        textArea.innerHTML = dmsArray.join(' - ');
        showPopup("Copied to clipboard!");
        await navigator.clipboard.writeText(dmsArray.join(' '));
    } catch (error) {
        console.error(error);
    }
}

//Reads file and extract coordinates into array of objects
function processKml(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(e) {
            const kmlText = e.target.result;

            //finds everything between coordinates tags
            const regex = /<coordinates>([^]*?)<\/coordinates>/;
            const match = kmlText.match(regex);

            if (match && match[1]) {
                const coordinates = match[1]
                    .trim()
                    .split(/\s+/)
                    .filter(row => row.length > 0)
                    .map(row => {
                        //split in parts
                        const parts = row.split(',').map(Number);
                        return {
                            lat: parts[1],
                            lon: parts[0],
                            alt: parts[2] || 0
                        };
                });

                resolve(coordinates);

            } else {
                reject("No coordinates found");
            }
        }
        reader.onerror = () => reject("File reading failed");
        reader.readAsText(file);
});
}

function degDecToDMS(lat, lon){
    function transform(value, type){
        let hemisphere
        const isLat = (type === 'lat');
        if(isLat) {
            hemisphere = value >= 0 ? 'N' : 'S';
        } else {
            hemisphere = value >= 0 ? 'E' : 'W';
        }

        const absValue = Math.abs(value);
        const degrees = Math.floor(absValue);
        const minutes = Math.floor((absValue - degrees) * 60);
        const seconds = ((absValue - degrees - minutes / 60) * 3600).toFixed(2);

        const padDeg = degrees.toString().padStart(isLat ? 2 : 3, '0');
        const padMin = minutes.toString().padStart(2, '0');
        const padSec = seconds.padStart(5, '0');

        return `${padDeg}${padMin}${padSec}${hemisphere}`;
    }

    const latPart = transform(lat, 'lat');
    const lonPart = transform(lon, 'lon');

    return latPart+lonPart;
}

function showPopup(message) {
    let popup = document.getElementById('popup-container');

    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'popup-container';
        document.body.appendChild(popup);
    }

    popup.innerText = message;
    popup.classList.add('show');

    // Hide it after 2.5 seconds
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2500);
}

