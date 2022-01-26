#!/bin/sh

case $1 in
    "software")
        git fetch
        if [ -n "$(git diff origin)" ]; then
            git pull --force
            sudo shutdown -r now
        fi
        ;;
    *)
        ;;
esac

