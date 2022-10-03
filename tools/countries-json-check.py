import os
import json

bollards_dir = os.path.join("bollards")

files = []
for (dirpath, dirnames, filenames) in os.walk(bollards_dir):
    files.extend(filenames)
    break

file_codes = [name.replace(".svg", "") for name in files]

country_json = open("countries.json")
bollards = json.load(country_json)
bollards.sort(key=lambda x: x["code"])
country_codes = [bollard["code"] for bollard in bollards]

with open("countries.json", "w") as output:
    json.dump(bollards, output, indent=2, sort_keys=True)

all_good = True

# Check if all files have names
for code in file_codes:
    if code not in country_codes:
        print("Code not found in countries.json:", code)
        all_good = False

# Check if all countries have files
for code in country_codes:
    if code not in file_codes:
        print("Bollard not found for:", code)
        all_good = False


if all_good:
    print("All bollard SVGs and countries.json are in sync.")
    exit(0)
exit(1)
