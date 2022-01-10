#!/bin/sh

function read_set_get {
    if [ -z $2 ]; then
        exit 0
    fi

    val_name=$1
    def_value=$2
    new_value=$3

    if ! [ -z $new_value ]; then
        value=$new_value
    else
        read value < ${HOME}/settings/${val_name}
    fi
    if [ -z $value ]; then
        value = $def_value
    fi

    echo $value > ${HOME}/settings/${val_name}
    
    echo $value
}

killall -q -KILL fbi

crontab -l | grep -v "infoscreen.sh" | sort - | uniq - | crontab -
echo "slide" > ${HOME}/settings/mode

# If no images available start info mode
imgs=$(ls ${HOME}/images/wallpaper | wc -l)
if (( $imgs == 0 )); then
    ${HOME}/scripts/infoscreen.sh
    exit 0
fi

options=""
path_images="${HOME}/images/wallpaper"
path_imgs="${HOME}/images/walls"
echo -n "" > $path_imgs
images=$(ls $path_images)
for image in $images
do
    echo "${path_images}/${image}" >> $path_imgs
done

random=$(read_set_get "slide_random" 1 $1)
if [[ $random == 0 ]]; then
    options+="-norandom "
else
    options+="-random "
fi

timeout=$(read_set_get "slide_time" 30 $2)
options+="-timeout $timeout "

blend=$(read_set_get "slide_blend" 200 $3)
options+="-blend $blend "

names=$(read_set_get "slide_names" 0 $4)
if [[ $names == 0 ]]; then
    options+="-noverbose "
else
    options+="-verbose "
fi

options+="-list $path_imgs "

fbi -nointeractive -a -T 1 -cachemem 100 $options > /dev/null 2>&1 &

