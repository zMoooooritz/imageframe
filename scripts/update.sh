#!/bin/bash

# get new tags from remote
git fetch --tags

# get latest tag
latestTag=$(git describe --tags "$(git rev-list --tags --max-count=1)" | xargs)

# get current tag
currentTag=$(git describe --tags --abbrev=0 | xargs)

if [[ "$latestTag" != "$currentTag" ]]; then
    # checkout latest tag
    git checkout "$latestTag"

    # relaunch the script with the new code after checkout
    exec "$0"
fi

# update the greeter
figlet "imageframe $latestTag"| sudo tee /etc/greeter > /dev/null

# update node dependencies to the once specified in package-lock.json
npm ci

# restart application in order for all changes to take effect
sudo systemctl restart imageframe
