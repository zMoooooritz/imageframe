#!/bin/bash

# get new tags from remote
git fetch --tags

# get latest tag name
latestTag=$(git describe --tags "$(git rev-list --tags --max-count=1)")

figlet "imageframe $latestTag"| sudo tee /etc/motd > /dev/null

# checkout latest tag
git checkout $latestTag

# update node dependencies to the once specified in package.lock
npm install

# restart application in order for all changes to take effect
sudo systemctl restart imageframe
