#!/bin/sh

if [ -n "$SSH_CLIENT" ] || [ -n "$SSH_TTY" ]; then
  exit 0
else
  case $(ps -o comm= -p $PPID) in
    sshd|*/sshd) exit 0;;
  esac
fi

# create required directories
mkdir -p ${HOME}/images/default
mkdir -p ${HOME}/images/wallpaper
mkdir -p ${HOME}/images/tmp

mkdir -p ${HOME}/settings

# crontab -l | grep -v -e "infoscreen.sh" -e "display.sh onf" | sort - | uniq - | crontab -
crontab -l | grep -v "infoscreen.sh" | sort - | uniq - | crontab -

if [[ $1 == "all" ]]; then
    npm run start --prefix ${HOME}/website &
fi

(read mode < ${HOME}/settings/mode) > /dev/null 2>&1

case $mode in
    "info")
        ${HOME}/scripts/infoscreen.sh
        ;;
    "slide")
        ${HOME}/scripts/slideshow.sh
        ;;
    *)
        ;;
esac
