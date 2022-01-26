#!/bin/sh

path_images="${HOME}/images/wallpaper"
path_img_list="${HOME}/images/list"
read_set_get="${HOME}/scripts/read_set_get.sh"

killall -q -KILL fbi

crontab -l | grep -v "infoscreen.sh" | sort - | uniq - | crontab -
echo "slide" > ${HOME}/settings/mode

for ARGUMENT in "$@"; do
   KEY=$(echo $ARGUMENT | cut -f1 -d=)

   KEY_LENGTH=${#KEY}
   VALUE="${ARGUMENT:$KEY_LENGTH+1}"

   export "$KEY"="$VALUE"
done

options=""

random=$(read_set_get "slide_random" 1 $RANDOM)
if [[ $random == 0 ]]; then
    options+="-norandom "
else
    options+="-random "
fi

timeout=$(read_set_get "slide_time" 30 $STIME)
options+="-timeout $timeout "

blend=$(read_set_get "slide_blend" 200 $BTIME)
options+="-blend $blend "

names=$(read_set_get "slide_names" 0 $NAMES)
if [[ $names == 0 ]]; then
    options+="-noverbose "
else
    options+="-verbose "
fi

echo -n "" > $path_imgs
sdirs=$(read_set_get "slide_dirs" "" $DIRS)
IFS=';' read -ra ndirs <<< $sdirs
for ndir in $ndirs; do
    images=$(ls ${path_images}/${ndir})
    for image in $images; do
        echo "${path_images}/${ndir}/${image}" >> $path_img_list
    done
done
options+="-list $path_img_list"

fbi -nointeractive -a -T 1 -cachemem 100 $options > /dev/null 2>&1 &

