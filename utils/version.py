#!/usr/bin/env python

import sys, os, re
from datetime import date

markdown_intro = """
<img src="http://www.tiramisujs.com/static/tiramisu_logo.png"/>

### [Tiramisu][0] version {version} ###

Tiramisu is a tiny, modular and fast JavaScript Library 
which takes inspiration from the famous [jQuery][1] syntax:

    tiramisu.get('h1').each(function() {{
        alert(h1.html());
    }});

## Here are some highlights:

*  Modular *philosophy*;
*  *Very small* size (16Kb minified);
*  *Chainable* methods;
*  Task management (a.k.a. Callbacks scheduling);

## Who we are

Lovers of the Javascript and the magic web!

The project was created by [Leonardo Zizzamia](http://zizzamia.com/), [Gianluca Bargelli](http://proudlygeek.appspot.com/).

## Resources

*  [Documentation ({version})][2]
*  [Unit Tests][3]
*  [Benchmarks][4]

[0]: http://www.tiramisujs.com
[1]: http://jquery.com/
[2]: http://www.tiramisujs.com/docs
[3]: http://www.tiramisujs.com/test
[4]: http://tiramisu-proudlygeek.dotcloud.com/

## License

* BSD
"""

current_date = date.today().strftime('Released %B %d, %Y') 

def get_version(d=False):
    with open("src/tiramisu.core.js", "r") as f:
        for line in f:
            version = re.search(r"this.version = '([0-9]\.[0-9](?:\.[0-9](?:-b[0-9]{1,2})?)?)';", line)
            if (version is not None):
                
                with open("VERSION", "w") as version_file:
                    version_file.write("""{version}\n{date}""".format(version=version.group(1), date=current_date))
                
                with open("utils/docs-intro.md", "w") as intro:
                    for line in markdown_intro.format(version=version.group(1)):
                        intro.write(line)
                
                with open("utils/readme.js", "w") as intro:
                    intro.write("/*")
                    for line in markdown_intro.format(version=version.group(1)).split('\n'):
                        line = " * "+line+'\n'
                        intro.write(line)
                    intro.write(" */")
                
                if d:
                    return current_date
                else:
                    return version.group(1)