#!/bin/sh

PATH=/opt/vc/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

case $1 in
    "on")
        vcgencmd display_power 1
        crontab -l | grep -v "display.sh onf" | sort - | uniq - | crontab -
        ${HOME}/scripts/startup.sh
        ;;
    "off")
        killall -q -KILL fbi
        vcgencmd display_power 0
        minute=$((($(date +"%M") + 30) % 60))
        (crontab -l ; echo "$minute * * * * ${HOME}/scripts/display.sh onf") | grep -v "infoscreen.sh" | sort - | uniq - | crontab -
        ;;
    "onf")
        vcgencmd display_power 1    
        sleep 1
        vcgencmd display_power 0
        ;;
    "schedule")
        if [ -z $2 ] || [ -z $3 ]; then
            echo "Fehlende Start- und Endzeit für Zeitplan"
            exit 0
        fi

        IFS=':' read -ra TIME <<< $2
        start_time_hour=${TIME[0]}
        start_time_min=${TIME[1]}
        if [ -z $start_time_hour ]; then
            start_time_hour=8
        fi
        if [ -z $start_time_min ]; then
            start_time_min=0
        fi
        IFS=':' read -ra TIME <<< $3
        end_time_hour=${TIME[0]}
        end_time_min=${TIME[1]}
        if [ -z $end_time_hour ]; then
            end_time_hour=22
        fi
        if [ -z $end_time_min ]; then
            end_time_min=0
        fi
        crontab -l | grep -v -e "display.sh on" -e "display.sh off" | sort - | uniq - | crontab -
        (crontab -l ; echo "$start_time_min $start_time_hour * * * ${HOME}/scripts/display.sh on") | sort - | uniq - | crontab -
        (crontab -l ; echo "$end_time_min $end_time_hour * * * ${HOME}/scripts/display.sh off") | sort - | uniq - | crontab -
        ;;
    "noschedule")
        crontab -l | grep -v -e "display.sh on" -e "display.sh off" | sort - | uniq - | crontab -
        ;;
    *)
        echo "Es wurde kein Kommando angegeben"
        echo "Folgende Kommandos gibt es: on, off, schedule, noschedule"
        ;;
esac

