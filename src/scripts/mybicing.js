$(document).ready(function() {

/*
  var image = new ol.style.Circle({
    radius: 5,
    fill: null,
    stroke: new ol.style.Stroke({color: 'green', width: 1})
  });
*/

  var image = new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 37],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.75,
        src: 'images/cycling_sport.png'
      }))

  var image2 = new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 37],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.75,
        src: 'images/cycling_trans.png'
      }))

  var styles = {
    'Point': [new ol.style.Style({
      image: image
    })]
  };

  var styleFunction = function(feature, resolution) {
    return styles[feature.getGeometry().getType()];
  };

  var vectorSource = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/stations.geojson'
  });

  var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: styleFunction
  });

  var selectPointerMove = new ol.interaction.Select({
    condition: ol.events.condition.pointerMove
  });

  selectPointerMove.on('select', function(e) {
      e.target.style = new ol.style.Style({
        image: image2
      });
      alert(e);
    });

  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      vectorLayer
    ],
    target: 'map',
    controls: ol.control.defaults({
      attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
        collapsible: false
      })
    }),
    view: new ol.View({
      center: ol.proj.transform([2.1700471, 41.3870154], 'EPSG:4326', 'EPSG:3857'),
      zoom: 15
    }),
    interactions: [
      selectPointerMove
    ]
  });

});


