#!/bin/sh

PATH=/opt/vc/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

if [ -n "$SSH_CLIENT" ] || [ -n "$SSH_TTY" ]; then
  exit 0
else
  case $(ps -o comm= -p $PPID) in
    sshd|*/sshd) exit 0;;
  esac
fi

crontab -l | grep -v -e "infoscreen.sh" -e "display.sh onf" | sort - | uniq - | crontab -

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
        echo "Es wurde kein Modus angegeben, deswegen wird nur der Webserver gestartet"
        echo "Folgende Modi gibt es: info, slide"
        ;;
esac

