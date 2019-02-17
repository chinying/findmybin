import json
from html.parser import HTMLParser

def pairwise(ls):
    while True:
        yield (next(ls), next(ls))

class MyHTMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.is_tr = False
        self.trows = []

    def cleanup(self):
        self.trows = []
        self.is_tr = False

    def handle_starttag(self, tag, attrs):
        if tag == 'th' or tag == 'td':
            # print('td', tag)
            self.is_tr = True

    def handle_endtag(self, tag):
        pass

    def handle_data(self, data):
        if self.is_tr:
            self.trows.append(data)
        self.is_tr = False

def form_kv_from_tr(rows):
    whitelist = {
        'ADDRESSBLOCKHOUSENUMBER': 'blk',
        'ADDRESSBUILDINGNAME': 'building',
        'ADDRESSFLOORNUMBER': 'floor',
        'ADDRESSPOSTALCODE': 'postal',
        'ADDRESSSTREETNAME': 'road',
        'NAME': 'name',
        'X_ADDR': 'x',
        'Y_ADDR': 'y',
        'DESCRIPTION': 'private'
    }

    _map = {}
    for pair in pairwise(iter(rows)):
        if pair[0] in whitelist:
            _map[whitelist[pair[0]]] = pair[1]
    return _map

if __name__ == "__main__":
    f = open('e-waste-recycling.geojson')
    geojson = json.loads(f.read())
    f.close()

    locations = geojson['features']

    parser = MyHTMLParser()
    new_json_obj = []

    for location in locations:
        # print(location['properties']['Description'])
        parser.feed(location['properties']['Description'])
        obj = {}
        obj['waste_type'] = 'E-waste'
        obj['geometry'] = location['geometry']
        obj['properties'] = form_kv_from_tr(parser.trows[1:])
        new_json_obj.append(obj)
        parser.cleanup()

    f = open('ewaste.json', 'w')
    f.write(json.dumps(new_json_obj))
    f.close()
