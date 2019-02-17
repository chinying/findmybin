import json

f0 = open('./src/data/recyclingBins.json')
j0 = json.loads(f0.read())
f0.close()

f1 = open('./src/data/ewaste.json')
j1 = json.loads(f1.read())
f1.close()

f2 = open("./src/data/2ndhandgoods.json")
j2 = json.loads(f2.read())
f2.close()

outfile = open("./src/data/combined.json", "w")
outfile.write(json.dumps(j0 + j1 + j2))
outfile.close()
