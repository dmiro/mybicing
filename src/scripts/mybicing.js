$(document).ready(function() {

	var styleStation = new ol.style.Style({
		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
			anchor: [0.5, 37],
			anchorXUnits: 'fraction',
			anchorYUnits: 'pixels',
			opacity: 0.75,
			src: 'images/cycling_green.png'
			}))
	});
		
	var styleSelectedStation = new ol.style.Style({
		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
			anchor: [0.5, 37],
			anchorXUnits: 'fraction',
			anchorYUnits: 'pixels',
			opacity: 0.75,
			src: 'images/cycling_trans.png'
			}))
	});
		
	var styles = {
		'Point': [styleStation]
	};
		
	var styleFunction = function(feature, resolution) {
		return styles[feature.getGeometry().getType()];
	};
	
	var vectorSource = new ol.source.GeoJSON({
		projection: 'EPSG:3857',
		url: 'data/stations.geojson'
	});

	var selectPointerMove = new ol.interaction.Select({
		condition: ol.events.condition.pointerMove
	});
		
	selectPointerMove.on('select', function(e) {
		
		e.deselected.forEach(function(feature){
			feature.setStyle(styleStation);  
		});
		
		e.selected.forEach(function(feature){
			feature.setStyle(styleSelectedStation);
		});
	});
	
	var map = new ol.Map({
		layers: [
			new ol.layer.Tile({
				source: new ol.source.OSM(),
				opacity: 0.75
				}),
			new ol.layer.Vector({
				source: vectorSource,
				style: styleFunction
				})
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
		interactions: ol.interaction.defaults().extend([
			selectPointerMove
		])
	});
  
});


