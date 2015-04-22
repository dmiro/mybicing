import urllib2
import xml.etree.ElementTree as ET
    
def get_stations_from_file(filename):
    tree = ET.parse(filename)
    root = tree.getroot()
    stations = {}
    for station in root.findall('station'):
        _id = int(station.find('id').text)
        stations[_id] = {
            'id': _id,
            'type': station.find('type').text,
            'lat': float(station.find('lat').text),
            'long': float(station.find('long').text),
            'street': station.find('street').text,
            'height': int(station.find('height').text),
            'streetNumber': station.find('streetNumber').text,
            'nearbyStationList': [int(near) for near in station.find('nearbyStationList').text.split(',')],
            'status': station.find('status').text,
            'slots': int(station.find('slots').text),
            'bikes': int(station.find('bikes').text)
            }
    return stations

def get_stations():
    URL = 'http://wservice.viabicing.cat/v1/getstations.php?v=1'
    HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; rv:24.0) Gecko/20140129 Firefox/24.0'}
    request = urllib2.Request(url=URL, headers=HEADERS)
    filename = urllib2.urlopen(request)
    return get_stations_from_file(filename)

def get_geojson(stations):
    FEATURE = '{"type":"Feature","id":"%d","properties":{"name":"%s %s"},"geometry": {"type": "Point","coordinates": [%f, %f]}}'
    COLLECTION = '{"type":"FeatureCollection","features":[%s]}'
    features = []
    for station in stations.itervalues():
        features.append(FEATURE % (station['id'], station['street'], station['streetNumber'], station['long'], station['lat']))
    return COLLECTION % ','.join(features)


# Demo

stations = get_stations()

with open('data/stations.geojson', 'w') as f:
    geojson = get_geojson(stations)
    f.write(geojson)

"""
stations = get_stations()

print 'closed stations:'
for station in stations.itervalues():
    if station['status'] != 'OPN':
        print station['long'], station['lat'], station['id'], station['status'], station['street'], station['streetNumber'], station['nearbyStationList']

print 'type stations:'
tp = []
for station in stations.itervalues():
    if not station['type'] in tp:
        tp.append(station['type'])
        print station['type']

print get_geojson(stations)
"""
