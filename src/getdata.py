import urllib2
import xml.etree.ElementTree as ET

URL = 'http://wservice.viabicing.cat/v1/getstations.php?v=1'
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; rv:24.0) Gecko/20140129 \
Firefox/24.0'}

req = urllib2.Request(url=URL, headers=HEADERS)
par = urllib2.urlopen(req)

tree = ET.parse(par)
root = tree.getroot()

stations = {}
for station in root.findall('station'):
    id = int(station.find('id').text)
    stations[id] = {
        'id': id,
        'type': station.find('type').text,
        'lat': station.find('lat').text,
        'long': station.find('long').text,
        'street': station.find('street').text,
        'height': station.find('height').text,
        'streetNumber': station.find('streetNumber').text,
        'nearbyStationList': [int(near) for near in station.find('nearbyStationList').text.split(',')],
        'status': station.find('status').text,
        'slots': int(station.find('slots').text),
        'bikes': int(station.find('bikes').text)
    }

print stations