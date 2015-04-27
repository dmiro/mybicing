$(document).ready(function() {
		
	var stationIconStatus = {
    'CLOSED': 'images/cycling_gray.png',
    'EMPTY': 'images/cycling_red.png',
    'FEW': 'images/cycling_yellow.png',
    'OPEN': 'images/cycling_green.png'
	};
		
	var stationStyle = function(feature, resolution) {
    icon = stationIconStatus[feature.get('status')];
		return [new ol.style.Style({
      image: new ol.style.Icon(({
        anchor: [0.5, 37],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.75,
        src: icon
      }))
    })];
	};

  var selectedStationStyle = function(feature, resolution) {
    icon = stationIconStatus[feature.get('status')];
    return [new ol.style.Style({
      image: new ol.style.Icon(({
        anchor: [0.5, 37],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 1,
        src: icon
      }))
    })];
  };
	
	var selectPointerMove = new ol.interaction.Select({
		condition: ol.events.condition.pointerMove,
    style: function(feature, res) { return selectedStationStyle(feature, res); }
	});

	var map = new ol.Map({
    target: 'map',
		layers: [
      // tiles
			new ol.layer.Tile({
				source: new ol.source.OSM(),
				opacity: 0.75
      }),
      // stations
			new ol.layer.Vector({
				source: new ol.source.GeoJSON({
          projection: 'EPSG:3857',
          url: 'data/stations.geojson'
        }),
				style: function(feature, res) { return stationStyle(feature, res); }
      })
		],
		controls: ol.control.defaults({
			attributionOptions: ({
				collapsible: false
			})
		}),
		view: new ol.View({
			center: ol.proj.transform([2.1700471, 41.3870154], 'EPSG:4326', 'EPSG:3857'),
			zoom: 15
		}),
		interactions: ol.interaction.defaults().extend([
			selectPointerMove
		])
	});

  var element = document.getElementById('popup');

  var popup = new ol.Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false
  });
  map.addOverlay(popup);

  // change mouse cursor when over marker
  map.on('pointermove', function(e) {
    if (e.dragging) {
      $(element).popover('destroy');
      return;
    }
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    $('#map').css('cursor', hit ? 'pointer' : '');
  });

  // display info when you click on the mouse
  map.on('click', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature, layer) {
          return feature;
        });
    if (feature) {
      var geometry = feature.getGeometry();
      var coord = geometry.getCoordinates();
      popup.setPosition(coord);
      $(element).attr('data-placement', 'top');
      $(element).attr('data-original-title', feature.get('name'));
      $(element).attr('data-content', '<strong>bikes:</strong>'+feature.get('bikes'));
      $(element).attr('data-html', true);
      $(element).attr('data-max-width', '600px');
      $(element).attr('data-container', 'body');
      $(element).popover('show');
    } else {
      $(element).popover('destroy');
    }
  });

  map.on('moveend', function(e){
    $(element).popover('destroy');
  });




});

/* docs.
 http://oobrien.com/2015/01/openlayers-3-and-vector-data/
 http://openlayers.org/en/v3.4.0/examples/custom-controls.html
 http://openlayers.org/en/v3.4.0/examples/icon.html
*/




