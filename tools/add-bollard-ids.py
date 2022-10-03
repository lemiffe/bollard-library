import os
import json

'''
Adds IDs to the HTML tags with the bollard country code
'''

dir_bollards = os.path.join("bollards")

files = []
for (dirpath, dirnames, filenames) in os.walk(dir_bollards):
    files.extend(filenames)
    break


def add_ids(directory):
    for f in files:
        filename = os.path.join(directory, f)
        update = False
        bollard_id = "bollard-%s" % (f.replace(".svg", ""))
        print(bollard_id)
        with open(filename, "r") as bollard:
            lines = bollard.readlines()
            if lines[0].find(" id") == -1 and lines[0].find("viewBox") > 0:
                lines[0] = lines[0].replace(
                    "viewBox", 'id="%s" viewBox' % bollard_id)
                update = True

        if update:
            print("Adding ID to", filename)
            with open(filename, "w") as bollard:
                bollard.writelines(lines)


add_ids(dir_bollards)
