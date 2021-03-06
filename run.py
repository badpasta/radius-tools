#!/usr/bin/env python
#
# Author: Jingyu Wang <badpasta@gmail.com>
# 
# Environment:
# -*- coding: utf-8 -*-
# Python by version 2.7.
# Flask Flask-WTF 

from badchats  import app
from badchats import index
from yaml import load as yamlLoad
from os.path import isdir
from re import match as re_match, search as re_search
import os



# Analysis opts.
def expYaml(d):

    fTmp = open(d)
    yTmp = yamlLoad(fTmp) # select for python dict
    fTmp.close()

    return yTmp

def parseParams(config_path):

    found = filter(lambda x: isdir(x),
                    (config_path, '/etc/secdd/conf'))

    if not found:
        print "configuration directory is not exit!"
        sys.exit(0)

    recipe = found[0]
    trmap = dict()
    for root, dirs, files in os.walk(recipe):
        for filespath in files:
            if re_match('.*ml$', filespath):
                filename = re_search(r'(.*)\..*ml$', filespath).group(1)
                trmap[filename] = expYaml(os.path.join(root, filespath))

    return trmap


def main():

    config_path = 'conf.d'
    app.config.from_object('config')
    app.config['base'] = parseParams(config_path)
    app.run(host='0.0.0.0', port=9001, debug=True)

if  __name__ == '__main__':

    main()
