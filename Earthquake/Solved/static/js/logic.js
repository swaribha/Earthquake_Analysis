// Link to GeoJSON
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grabbing the earthquake data
d3.json(earthquakeUrl, function (data) {
  // console.log(data)
  createMarkers(data.features)
})

//Function to create maps
function createMap(earthquakeMarker) {

  var street = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  })

  var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  })

  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  })

  var baseMaps = {
    "Light Map": lightMap,
    "Satellite":satelliteMap,
    "Street":street

  }

  var overlayMaps = {
    "Earthquake": earthquakeMarker,
    "Fault Lines":tectonicLayer
  }

  // Creating map object
  var myMap = L.map("map", {
    center: [36.16, -115.13],
    zoom: 4,
    layers: [lightMap, earthquakeMarker,tectonicLayer]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  //Adding Legend to map
 // Create legend
 var legend = L.control({position: 'bottomright'});

 legend.onAdd = function () {

   var div = L.DomUtil.create('div', 'info legend'),
             mag = [0, 1, 2, 3, 4, 5],
             labels = [];

 // loop through our density intervals and generate a label with a colored square for each interval
   for (var i = 0; i < mag.length; i++) {
       div.innerHTML +=
       '<i style="background:' + markerColor(mag[i] + 1) + '"></i> ' +
            mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
           
   }
   return div;
 };

 legend.addTo(myMap);

}
//Function to detrmine the color of marker based on magnitude of earthquake
function markerColor(mag) {

  return mag > 5 ? '#d73027' :
    mag > 4 ? '#fc8d59' :
      mag > 3 ? '#fee08b' :
        mag > 2 ? '#d9ef8b' :
          mag > 1 ? '#91cf60' :
            '#1a9850';


}


//Function to create the markers on map
function createMarkers(earthquakeData) {
  // console.log(earthquakeData)


  var earthquakeMarker = L.geoJSON(earthquakeData, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><br>Magnitude: ${feature.properties.mag}`);
    },
    pointToLayer: function (feature, latlng) {
      var geoMarkerOptions = {
        radius: (4 * feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        fillOpacity: .7,
        color: "#000",
        weight: .5
      };
      return L.circleMarker(latlng, geoMarkerOptions);
    }
  })
  // console.log(earthquakeMarker)
  createMap(earthquakeMarker)

}

// Adding Tectonics plate data

var tectonicPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

tectonicLayer=new L.layerGroup();
d3.json(tectonicPlatesUrl,function(tectonicData){
  // console.log(tectonicData)
  L.geoJSON(tectonicData,{style:{color:"blue"}}).addTo(tectonicLayer)

})
 