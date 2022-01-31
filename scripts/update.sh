#!/bin/sh

update_software() {
    git pull --force
    sudo shutdown -r now
}

case $1 in
    "software")
        git fetch
        if [ -n "$(git diff origin)" ]; then
            update_software
        fi
        ;;
    *)
        ;;
esac

