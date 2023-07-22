// Creating out initial map object:
// We set the longitude, latitude, and starting zoom level.
// This gets inserted into the div with an id of "map"
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    console.log(data.features);
    createFeatures(data.features);

  });
  const getDarkerColor =(magnitude) => {
    if(magnitude >= 90) 
       return '#00FF00'
    else if (magnitude >= 70 && magnitude < 90) 
       return '#66FF00'
    else if (magnitude >= 50 && magnitude < 70) 
       return '#99FF00'
    else if (magnitude >= 30 && magnitude < 50) 
       return '#CCFF00'
    else if (magnitude >= 10 && magnitude < 30) 
       return '#FFCC00'
    else if (magnitude >= -10 && magnitude < 10) 
       return '#FF0000'

  }
  function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {

      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    // Define a function that add a circles 
    //that represent magnitude of the earthquake by their size  
    circleToLayer =(feature, latlng) => {
        return L.circleMarker(latlng, {
            radius: feature.properties.mag * 4,
            fillColor: getDarkerColor(feature.geometry.coordinates[2]),
            color:"White",
            weight: 0.5,
            opacity: 0.5,
            fillOpacity: 1
        })
    }
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: circleToLayer

    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);

  }
  
  function createMap(earthquakes) {
  
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    
    // Creating a control with legend 
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(myMap) {

      var div = L.DomUtil.create('div', 'info legend'),
      grades = [-10,10, 30, 50, 70, 90],
      labels = [];
      // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getDarkerColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
      
    };
    legend.addTo(myMap);
  
  }
