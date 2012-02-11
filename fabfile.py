import os, re, fileinput, shutil, urllib2
import simplejson as json 
from fabric.api import local
from utils.version import get_version
from itertools import combinations

VERSION = get_version()
DATE = get_version(True)
SRC = 'src'
tiramisu_home = '../tiramisu-home/'

# Lists all the names of the modules of Tiramisu, 
# each module has an identification number (also called "cups_of_coffee")
official_dictionary_names = [
    '',
    'selector',
    'browserdetect',
    'selector.dom',
    'ajax',
    'selector.event',
    'taskengine'
]

# all the cups_of_coffee of Tiramisu
ALL_CUPS_OF_COFFEE = '123456'


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
    # list of all dependencies of own Tiramisu
    list_dependency = []
    
    # read tiramisu.json
    f = open('tiramisu.json', 'r')
    tiramisu_json = json.load(f)
    f.close()
    
    # list_modules contains modules chosen to create their own tiramisu
    if list_modules:
        # Unify only selected modules
        print '\n####### Unifying custom Tiramisu #######'
        check_dependency(list_dependency, list_modules)
        list_modules = sorted(set(list_modules + ''.join(list_dependency)))
        modules = [SRC+'/modules/tiramisu.'+official_dictionary_names[int(x)]+'.js' for x in list_modules]
        
        modules.sort() # sorts normally by alphabetical order
        modules.sort(key=len) # sorts by length
        
        # modules in tiramisu
        name_custom = ''.join(list_modules)
        
        # unify modules with cat command
        cat = "cat %s/tiramisu.core.js %s > %s/custom/tiramisu-%s.js" % (SRC, ' '.join(modules), SRC, name_custom)
        local(cat)
        
        # minify tiramisy with yuicompressor 
        local('yuicompressor -o %s/custom/tiramisu-%s-min.js %s/custom/tiramisu-%s.js' % (SRC, name_custom, SRC, name_custom))
        
        # Get size Tiramisu in KiloBytes
        bytes = os.path.getsize('%s/custom/tiramisu-%s-min.js' % (SRC, name_custom))
        size = round(bytes / 1024.0, 2)
        
        tiramisu_json['custom'][name_custom] = size
        
    else:
        # Unify all modules
        print '\n####### Unifying all modules in tiramisu.js #######'
        modules = [ module for module in local("ls -rd $(find src/modules) | grep '.*\.js'", capture=True).split()]
        
        # unify modules with cat command
        cat = 'cat %s/tiramisu.core.js %s > %s/build/tiramisu.js' % (SRC, ' '.join(modules), SRC)
        local(cat)
        
        # minify tiramisy with yuicompressor 
        local('yuicompressor -o %s/build/tiramisu-%s-min.js %s/build/tiramisu.js' % (SRC, VERSION, SRC))
        
        # Get size Tiramisu in KiloBytes
        bytes = os.path.getsize('%s/build/tiramisu-%s-min.js' % (SRC, VERSION))
        size = round(bytes / 1024.0, 2)
        
        tiramisu_json['tiramisu_size'] = size
        
    
    # write tiramisu.json
    outfile = open("tiramisu.json", "w")
    outfile.write(json.dumps(tiramisu_json))
    outfile.close()
    
    
def check_dependency(list_dependency, list_modules):
    for cups_of_coffee in list_modules:
        try:
            # For each module is looking for its dependencies, and if not already on the list are added
            url = 'src/modules/tiramisu.%s.js' % official_dictionary_names[int(cups_of_coffee)]
            with open(url, "r") as f:
                for line in f:
                    find = False
                    dependency = []
                    dep = re.search(r"ingredients = \[(.*?)\]", line)
                    dep_two = re.search(r"'ingredients': \[(.*?)\]", line)
                    if dep:
                        find = True
                        dependency = [x.replace("\'","") for x in dep.group(1).split(',')]
                    elif dep_two:
                        find = True
                        dependency = [x.replace("\'","") for x in dep_two.group(1).split(',')] 
                    # For each dependency is looking for its dependencies
                    for x in dependency:
                        if not x in list_dependency and len(x):
                            list_dependency.append(x)
                            check_dependency(list_dependency, x)
                    if find:
                        break
                                
        except IOError:
            print 'Error, there is no module with id ' + cups_of_coffee
        
            
def minify():
    print '\n####### Minifying tiramisu.js #######'
    local('yuicompressor -o %s/build/tiramisu-%s-min.js %s/build/tiramisu.js' % (SRC, VERSION, SRC))


def docs():
    print '\n####### Generating docs #######'
    local('dox --title Tiramisu %s/modules/tiramisu.*.js %s/tiramisu.core.js --intro utils/docs-intro.md > docs/index.html' % (SRC, SRC))


def all():
    beautify_modules()
    unify()
    beautify()
    docs()
    
    
def cook_all_tiramisu():
    local('rm src/custom/* ')
    f = open('tiramisu.json', 'r')
    tiramisu_json = json.load(f)
    f.close()
    for i in range(1,6):
        for cups_of_coffee in [x for x in combinations(ALL_CUPS_OF_COFFEE,i)]:
            cups_of_coffee = ''.join(cups_of_coffee)
            if cups_of_coffee != ALL_CUPS_OF_COFFEE:
                unify(cups_of_coffee)


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
        