import json

f0 = open('./src/data/recyclingBins.json')
j0 = json.loads(f0.read())
f0.close()

f1 = open('./src/data/ewaste.json')
j1 = json.loads(f1.read())
f1.close()

# f2 = open()

print(json.dumps(j0 + j1))
