import json
from html.parser import HTMLParser
from itertools import tee

class MyHTMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.is_tr = False
        self.trows = []

    def cleanup(self):
        self.trows = []
        self.is_tr = False

    def handle_starttag(self, tag, attrs):
        if tag == 'td':
            # print('td', tag)
            self.is_tr = True

    def handle_endtag(self, tag):
        pass

    def handle_data(self, data):
        if self.is_tr:
            self.trows.append(data)
        self.is_tr = False

def pairwise(iterable):
    a, b = tee(iterable)
    next(b, None)
    return zip(a, b)

def form_kv_from_tr(rows):
    whitelist = set(['ADDRESSBLOCKHOUSENUMBER', 'ADDRESSBUILDINGNAME', 'ADDRESSFLOORNUMBER', 'ADDRESSPOSTALCODE', 'ADDRESSSTREETNAME', 'NAME', 'X_ADDR', 'Y_ADDR'])

    _map = {}
    for pair in pairwise(rows):
        if pair[0] in whitelist:
            _map[pair[0]] = pair[1]
    return _map

if __name__ == "__main__":
    f = open('recyclingBins.json')
    geojson = json.loads(f.read())
    f.close()

    locations = geojson['features']

    parser = MyHTMLParser()
    new_json_obj = []

    for location in locations:
        parser.feed(location['properties']['description'])
        obj = {}
        obj['geometry'] = location['geometry']
        obj['properties'] = form_kv_from_tr(parser.trows)
        new_json_obj.append(obj)
        parser.cleanup()

    print(json.dumps(new_json_obj))
