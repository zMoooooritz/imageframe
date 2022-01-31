#!/bin/sh

img_tmp="${HOME}/images/tmp/"
img_path="${HOME}/images/wallpaper/"

case $1 in
    "del")
        if [ -z $3 ]; then
            echo "Keinen Dateinamen zur Verfügung gestellt"
            exit 0
        fi
        dir=$2
        shift
        shift
        for file in "$@"; do
            rm ${img_path}${dir}/${file}
        done
        ;;
    "load")
        cd ${img_path}
        sdirs=$(ls -d */)
        files=""
        for sdir in $sdirs; do
            if [[ $(ls ./${sdir} | wc -l) -eq 0 ]]; then
                files+="_;"
                continue;
            fi
            curr_files=$(ls ./${sdir} | tr "\n" ";" | head -c -1)
            files+=$curr_files
            files+=";_;"
        done
        echo $files | head -c -4
        ;;
    "fixmv")
        if [ -z $2 ]; then
            echo "Keinen Ordnername zur Verfügung gestellt"
            exit 0
        fi
        cd $img_tmp
        exiftran -ai *.jpg
        exiftran -ai *.JPG
        exiftran -ai *.jpeg
        exiftran -ai *.JPEG
        mv -f ${img_tmp}* ${img_path}$2/
        ;;
    *)
        ;;
esac

