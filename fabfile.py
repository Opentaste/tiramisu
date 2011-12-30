import re
from fabric.api import *
from utils.version import get_version

vers = get_version()
date = get_version(True)
src = 'src'
tiramisu_home = '../tiramisu-home/'

def beautify():
    print 'Beautifying tiramisu.js...'
    print '##########################'
    local('python utils/jsbeautifier.py '+src+'/build/tiramisu.js > '+src+'/build/tiramisu-beautified.js')
    local('mv '+src+'/build/tiramisu-beautified.js '+src+'/build/tiramisu.js')
    local('rm -f '+src+'/build/tiramisu-beautified.js')
    print '\n'

# fab unify:list_modules='ajax'
def unify(list_modules=None):
    print 'Unifying tiramisu.js...'
    print '#######################'
    if list_modules:
        # Unify only selected modules
        modules = list_modules.split(',')
        lista = check_dependency(modules)
        name_version = modules
        modules = [src+'/modules/tiramisu.'+x+'.js' for x in modules]
        if len(lista) > 0:
            modules = set([src+'/modules/tiramisu.'+x+'.js' for x in lista] + modules)
            name_version = set([x for x in lista] + name_version)
        cat = "cat {src}/tiramisu.core.js {modules} > {src}/build/tiramisu_{name_version}.js".format(
            src=src,
            modules=" ".join(modules),
            name_version="_".join(name_version)
        )
    else:
        # Unify all modules
        modules = [ module for module in local("ls -d $(find src/modules) | grep '.*\.js'", capture=True).split()]
        cat = "cat {src}/tiramisu.core.js {modules} > {src}/build/tiramisu.js".format(
            src=src,
            modules=" ".join(modules)
        )
    local(cat)
    print '\n'
    
def check_dependency(url):
    lista = []
    for x in url:
        x = 'src/modules/tiramisu.'+x+'.js'
        try:
            with open(x, "r") as f:
                for line in f:
                    dep = re.search(r"dependencies : \[(.*?)\]", line)
                    if dep:
                        lista += [x.replace("\'","") for x in dep.group(1).split(',')]
        except IOError:
            print "Name modules isn't correct"
            return lista
    return lista
            
def minify():
    print 'Minifying tiramisu.js...'
    print '########################'
    local('yuicompressor -o '+src+'/build/tiramisu-'+vers+'-min.js '+src+'/build/tiramisu.js')
    print '\n'

def docs():
    print 'Generating docs...'
    print '##################'
    local('dox --title Tiramisu '+src+'/modules/tiramisu.*.js '+src+'/tiramisu.core.js --intro utils/docs-intro.md > docs/index.html')
    print '\n'

def all():
    unify()
    beautify()
    minify()
    docs()

def clean():
    print "Cleaning..."
    print '###########'
    local('rm -f src/build/*')
    local('rm -f docs/*')
    
def publish():
    clean()
    all()
    local('git add .')
    local('git commit -am "Released version '+vers+'"')
    local('git tag -f -a '+vers+' -m "'+date+'"')
    local('git checkout stable')
    local('git merge master')
    local('git push origin')
    local('git push origin --tags')
    local('git checkout master')
    local('cd '+tiramisu_home+'')
    clean()
    all()
    local('git add .')
    local('git commit -am "Updated homepage to version '+vers+', '+date+'"')
    local('git push origin gh-pages')
    print "Tiramisu's homepage has been updated to the latest version"
        