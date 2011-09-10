#!/usr/bin/env python

import sys, os, re
from datetime import date

markdown_intro = """
### version {version} ###

Tiramisu is a tiny, modular and fast JavaScript framework 
which takes inspiration from the famous [jQuery][1] syntax:

    tiramisu.get('h1').each(function() {{
        alert(h1.html());
    }});

Here are some highlights:

*  Modular *philosophy*;
*  *Very small* size (7,1Kb minified);
*  *Chainable* methods;
*  Task management (a.k.a. Callbacks scheduling);

Resources
---------

*  [Documentation ({version})][2]
*  [Unit Tests][3]

[1]: http://jquery.com/
[2]: http://dl.dropbox.com/u/2060843/tiramisu/docs/index.html
[3]: http://dl.dropbox.com/u/2060843/tiramisu/test/runtests.html
"""

current_date = date.today().strftime('Released %B %d, %Y') 

def get_version(d=False):
    with open("src/tiramisu.js", "r") as f:
        for line in f:
            version = re.search(r"this.version = '([0-9]\.[0-9](?:\.[0-9](?:-b[0-9]{1,2})?)?)';", line)
            if (version is not None):
                print(version.group(1)) if not d else current_date

                with open("VERSION", "w") as version_file:
                    version_file.write("""{version}\n{date}""".format(version=version.group(1), date=current_date))


                with open("utils/docs-intro.md", "w") as intro:
                    for line in markdown_intro.format(version=version.group(1)):
                        intro.write(line)

                break

if __name__=='__main__':
    get_version(sys.argv[1]) if len(sys.argv) > 1 else get_version()
