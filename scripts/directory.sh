#!/bin/sh

img_path="${HOME}/images/wallpaper/"

case $1 in
    "create")
        if [ -z $2 ]; then
            echo "Keinen Ordnername zur Verfügung gestellt"
            exit 0
        fi
        mkdir ${img_path}$2
        ;;
    "rename")
        if [ -z $3 ]; then
            echo "Keinen Ziel- und End-Namen Verfügung gestellt"
            exit 0
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
    *)
        ;;
esac

