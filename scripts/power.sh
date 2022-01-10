#!/bin/sh

case $1 in
    "shutdown")
        sudo shutdown now 
        ;;
    "reboot")
        sudo shutdown -r now
        ;;
    *)
        echo "Keine zulässige Operation angegeben"
        echo "Die Operationen sind: shutdown, reboot"
        ;;
esac

