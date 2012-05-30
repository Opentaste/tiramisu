import os, re, fileinput, shutil, urllib2
import simplejson as json 
from fabric.api import local
from utils.version import get_version
from itertools import combinations

VERSION = get_version()
DATE = get_version(True)

# Lists all the names of the modules of Tiramisu, 
# each module has an identification number (also called "cups_of_coffee")
official_dictionary_names = [
    '',
    'selector',
    'browserdetect',
    'selector.dom',
    'ajax',
    'selector.event',
    'taskengine',
    'json'
]

# all the cups_of_coffee of Tiramisu
ALL_CUPS_OF_COFFEE = '1234567'


def beautify():
    print '\n####### Beautifying tiramisu.js #######'
    local('python utils/jsbeautifier.py src/build/tiramisu.js > src/build/tiramisu-beautified.js')
    local('mv src/build/tiramisu-beautified.js src/build/tiramisu.js')


def beautify_modules():
    print '\n####### Beautifying modules #######'
    
    # get the names of all .js files
    modules_directory = [ x[:-3] for x in os.listdir('src/modules/') if x.split('.')[-1] == 'js']
    
    for name in modules_directory:
        local('python utils/jsbeautifier.py src/modules/{0}.js > src/modules/{0}-beautified.js'.format(name))
        local('mv src/modules/{0}-beautified.js src/modules/{0}.js'.format(name))


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
        modules_chosen = ''.join(list_modules)
        check_dependency(list_dependency, list_modules)
        list_dependency = map(lambda x: x.strip(), list_dependency)
        list_modules = sorted(set(list_modules + ''.join(list_dependency)))
        modules = ['src/modules/tiramisu.'+official_dictionary_names[int(x)]+'.js' for x in list_modules]
        
        modules.sort() # sorts normally by alphabetical order
        modules.sort(key=len) # sorts by length
        
        # modules in tiramisu
        name_custom = ''.join(list_modules)
        
        # unify modules with cat command
        cat = "cat src/tiramisu.core.js {0} > src/custom/tiramisu-{1}.js".format(' '.join(modules), name_custom)
        local(cat)
        
        # minify tiramisy with yuicompressor 
        local('yuicompressor -o src/custom/tiramisu-{0}-min.js src/custom/tiramisu-{0}.js'.format(name_custom))
        
        # Get size Tiramisu in KiloBytes
        bytes = os.path.getsize('src/custom/tiramisu-{0}-min.js'.format(name_custom))
        size = round(bytes / 1024.0, 2)
        
        # Saves for each combination as tiramisu needs, and the weight of tiramisu created
        tiramisu_json['custom'][modules_chosen] = name_custom
        tiramisu_json['custom_size'][name_custom] = size
        
    else:
        # Unify all modules
        print '\n####### Unifying all modules in tiramisu.js #######'
        modules = [ module for module in local("ls -rd $(find src/modules) | grep '.*\.js'", capture=True).split()]
        
        # unify modules with cat command
        cat = 'cat src/tiramisu.core.js {0} > src/build/tiramisu.js'.format(' '.join(modules))
        local(cat)
        
        # minify tiramisy with yuicompressor 
        local('yuicompressor -o src/build/tiramisu-{0}-min.js src/build/tiramisu.js'.format(VERSION))
        
        # Get size Tiramisu in KiloBytes
        bytes = os.path.getsize('src/build/tiramisu-{0}-min.js'.format(VERSION))
        size = round(bytes / 1024.0, 2)
        
        # Saves the weight of tiramisu created
        tiramisu_json['tiramisu_size'] = size
        
    
    # write tiramisu.json
    outfile = open("tiramisu.json", "w")
    outfile.write(json.dumps(tiramisu_json))
    outfile.close()


def check_dependency(list_dependency, list_modules):
    """  """
    for cups_of_coffee in list_modules:
        try:
            # For each module is looking for its dependencies, and if not already on the list are added
            dependencies = official_dictionary_names[int(cups_of_coffee)]
            url = 'src/modules/tiramisu.{0}.js'.format(dependencies)
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
        except:
            print 'Error, there is no module with id ' + cups_of_coffee


def minify():
    print '\n####### Minifying tiramisu.js #######'
    local('yuicompressor -o src/build/tiramisu-{0}-min.js src/build/tiramisu.js'.format(VERSION))


def docs():
    print '\n####### Generating docs #######'
    local('dox < utils/readme.js > docs_json/readme.json')
    for name in official_dictionary_names:
        if len(name) < 2:
            local('dox < src/tiramisu.core.js > docs_json/tmp.json')
            local('python utils/jsbeautifier.py docs_json/tmp.json > docs_json/core.json')
        else:
            local('dox < src/modules/tiramisu.{}.js > docs_json/tmp.json'.format(name))
            local('python utils/jsbeautifier.py docs_json/tmp.json > docs_json/{}.json'.format(name))
            
    local('python utils/clean_json.py')


def all():
    """ """
    clean()
    beautify_modules()
    unify()
    beautify()
    docs()


def cook_all_tiramisu():
    """ """
    print '\n#######  Cool all tiramisu... #######'
    try:
        local('rm src/custom/* ')
    except:
        pass
    f = open('tiramisu.json', 'r')
    tiramisu_json = json.load(f)
    f.close()
    for i in range(1,7):
        for cups_of_coffee in [x for x in combinations(ALL_CUPS_OF_COFFEE,i)]:
            cups_of_coffee = ''.join(cups_of_coffee)
            if cups_of_coffee != ALL_CUPS_OF_COFFEE:
                unify(cups_of_coffee)


def clean():
    """ """
    print '\n####### Cleaning... #######'
    local('rm -f src/build/*')
    
    
def publish():
    """ """
    print '\n####### Publish... #######'
    all()
    local('git add .')
    local('git commit -am "Released version {}"'.format(VERSION))
    local('git tag -f -a {} -m "{}"'.format(VERSION, DATE))
    local('git checkout stable')
    local('git merge master')
    local('git push origin')
    local('git push origin --tags')
    local('git checkout master')
        