#!/bin/sh

img_tmp="${HOME}/images/tmp/"
img_path="${HOME}/images/wallpaper/"

case $1 in
    "del")
        if [ -z $2 ]; then
            echo "Keinen Dateinamen zur Verfügung gestellt"
            exit 0
        fi
        shift
        for file in "$@"; do
            rm ${img_path}$file
        done
        ;;
    "dela")
        rm ${img_path}*
        ;;
    "load")
        ls $img_path
        ;;
    "fixmv")
        cd $img_tmp
        exiftran -ai *.jpg
        exiftran -ai *.JPG
        exiftran -ai *.jpeg
        exiftran -ai *.JPEG
        mv -f ${img_tmp}* $img_path
        ;;
    *)
        ;;
esac

