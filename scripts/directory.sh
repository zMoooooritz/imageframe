#!/bin/sh

img_path="${HOME}/images/wallpaper/"

case $1 in
    "create")
        if [ -z $2 ]; then
            echo "Keinen Ordnername zur Verfügung gestellt"
            exit 0
        fi
        mkdir -p ${img_path}$2
        ;;
    "rename")
        if [ -z $3 ]; then
            echo "Keinen Ziel- und End-Namen Verfügung gestellt"
            exit 0
        fi
        if [ -d ${img_path}$3 ]; then
            echo "Der Ordner $3 existiert bereits"
        fi
        mv -f ${img_path}$2 ${img_path}$3
        ;;
    "delete")
        if [ -z $2 ]; then
            echo "Keinen Ordnername zur Verfügung gestellt"
            exit 0
        fi
        if [[ $2 == *"/"* ]] || [[ $2 == "."* ]]; then
            echo "Ungültiger Ordnername"
        fi
        rm -rf ${img_path}$2
        ;;
    "load")
        cd ${img_path}
        ls -d */ | tr -d "/" | tr "\n" ";" | head -c -1
        ;;
    *)
        ;;
esac

