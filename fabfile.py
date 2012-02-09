import os, re, fileinput, shutil
from fabric.api import local
from utils.version import get_version

VERSION = get_version()
DATE = get_version(True)
SRC = 'src'
tiramisu_home = '../tiramisu-home/'


def beautify():
    print '\n####### Beautifying tiramisu.js #######'
    local('python utils/jsbeautifier.py %s/build/tiramisu.js > %s/build/tiramisu-beautified.js' % (SRC, SRC))
    local('mv %s/build/tiramisu-beautified.js %s/build/tiramisu.js' % (SRC, SRC))
    
    
def beautify_modules():
    print '\n####### Beautifying modules #######'
    
    # get the names of all .js files
    modules_directory = [ x[:-3] for x in os.listdir('%s/modules/' % SRC) if x.split('.')[-1] == 'js']
    
    for name in modules_directory:
        local('python utils/jsbeautifier.py %s/modules/%s.js > %s/modules/%s-beautified.js' % (SRC, name, SRC, name))
        local('mv %s/modules/%s-beautified.js %s/modules/%s.js' % (SRC, name, SRC, name))


# fab unify:list_modules='ajax'
def unify(list_modules=None):
    print '\n####### Unifying tiramisu.js #######'
    if list_modules:
        # Unify only selected modules
        modules = list_modules.split(',')
        lista = check_dependency(modules)
        name_version = modules
        modules = [SRC+'/modules/tiramisu.'+x+'.js' for x in modules]
        
        if len(lista) > 0:
            modules = set([SRC+'/modules/tiramisu.'+x+'.js' for x in lista] + modules)
            name_version = set([x for x in lista] + name_version)

        # modules in tiramisu
        cat = "cat %s/tiramisu.core.js %s > %s/build/tiramisu_%s.js" % (SRC, ' '.join(modules), SRC, '_'.join(name_version))
        local(cat)
        
    else:
        # Unify all modules
        modules = [ module for module in local("ls -rd $(find src/modules) | grep '.*\.js'", capture=True).split()]
        cat = 'cat %s/tiramisu.core.js %s > %s/build/tiramisu.js' % (SRC, ' '.join(modules), SRC)
        
    local(cat)
    
    
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
    print '\n####### Minifying tiramisu.js #######'
    local('yuicompressor -o %s/build/tiramisu-%s-min.js %s/build/tiramisu.js' % (SRC, VERSION, SRC))


def docs():
    print '\n####### Generating docs #######'
    local('dox --title Tiramisu %s/modules/tiramisu.*.js %s/tiramisu.core.js --intro utils/docs-intro.md > docs/index.html' % (SRC, SRC))


def all():
    unify()
    beautify_modules()
    beautify()
    minify()
    docs()


def clean():
    print '\n####### Cleaning... #######'
    local('rm -f src/build/*')
    local('rm -f docs/*')
    
    
def publish():
    clean()
    all()
    local('git add .')
    local('git commit -am "Released version %s"' % VERSION)
    local('git tag -f -a %s -m "%s"' % (VERSION, DATE))
    local('git checkout stable')
    local('git merge master')
    local('git push origin')
    local('git push origin --tags')
    local('git checkout master')
    local('cd '+tiramisu_home+'')
    clean()
    all()
    local('git add .')
    local('git commit -am "Updated homepage to version %s, %s"' % (VERSION, DATE))
    local('git push origin gh-pages')
    print "Tiramisu's homepage has been updated to the latest version"
        