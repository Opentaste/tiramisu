import urllib2

version, date = urllib2.urlopen('https://raw.github.com/OwlStudios/tiramisu/stable/VERSION').read().split('\n')

template = open('template/template.html','r').read()

with open('index.html', 'w') as index:
    index.write(template.format(version=version, date=date))
