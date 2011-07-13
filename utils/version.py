#!/usr/bin/env python

import os, re

with open("src/tiramisu.js", "r") as f:
    for line in f:
        version = re.search(r"this.version = '([0-9\.]+)';", line)
        if (version is not None):
            print(version.group(1))
            break
