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

def unify():
    print 'Unifying tiramisu.js...'
    print '#######################'
    modules = [ module for module in local("ls -d $(find src/modules) | grep '.*\.js'", capture=True).split()]
    cat = "cat {src}/tiramisu.core.js {modules} > {src}/build/tiramisu.js".format(
        src=src,
        modules=" ".join(modules)
    )
    local(cat)
    print '\n'
	
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
        