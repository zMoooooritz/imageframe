#!/bin/sh

# get new tags from remote
git fetch --tags

# get latest tag name
latestTag=$(git describe --tags "$(git rev-list --tags --max-count=1)")

# checkout latest tag
git checkout $latestTag

# update node dependencies
npm install

# restart in order for all changes to take effect
sudo shutdown -r now
