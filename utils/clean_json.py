#!/usr/bin/env python

import os, json

LIST_JSON_FILES = [x[:-5] for x in os.listdir('docs_json') if x[-5:] == '.json']

for name in LIST_JSON_FILES:
    with open("docs_json/{}.json".format(name), "r") as f:
        json_text = json.load(f)
    
    with open("docs_json/{}.json".format(name), "w") as f:
        f.write(json.dumps(json_text))