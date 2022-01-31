#!/bin/sh

read_set_get="${HOME}/scripts/read_set_get.sh"
wall_path=$(find ${HOME}/images/default -name "wallpaper.*" | head -n 1)
back_path="${HOME}/images/default/background.${wall_path##*.}"

killall -q -KILL fbi

minute=$((($(date +"%M") + 59) % 60))
crontab -l | grep -v "infoscreen.sh" | sort - | uniq - | crontab -
(crontab -l ; echo "$minute * * * * ${HOME}/scripts/infoscreen.sh") | sort - | uniq - | crontab -
echo "info" > ${HOME}/settings/mode

for ARGUMENT in "$@"; do
   KEY=$(echo $ARGUMENT | cut -f1 -d=)

   KEY_LENGTH=${#KEY}
   VALUE="${ARGUMENT:$KEY_LENGTH+1}"

   export "$KEY"="$VALUE"
done

if [ -z $wall_path ]; then
    back_path="${HOME}/images/default/background.jpg"
    convert -size 1920x1080 xc:white $back_path
else
    cp $wall_path $back_path
    convert $back_path -resize 1920x1080 $back_path
fi

dat=$(read_set_get "info_date" 1 $DATE)
if [[ $dat == 1 ]]; then
    dat="$(date +"%A"),\n$(date +"%e"). $(date +"%B") $(date +"%Y")"
    echo -e $dat | convert $back_path -font "/usr/share/fonts/liberation/LiberationSans-Regular.ttf" -size 750x -stroke black -fill white -background "#171717AA" label:@- -geometry +50+100 -composite $back_path
fi

joke=$(read_set_get "info_joke" 1 $JOKE)
if [[ $joke == 1 ]]; then
    ${HOME}/scripts/scrapjoke.sh | convert $back_path -font "/usr/share/fonts/liberation/LiberationSans-Regular.ttf" -size 1820x380 -stroke black -fill white -background "#171717AA" label:@- -geometry +50+700 -composite $back_path
fi

wttr=$(read_set_get "info_wttr" 1 $WTTR)
case $wttr in
    "0")
        ;;
    "1")
        wttr_path="${HOME}/images/default/wttr.png"
        curl wttr.in/Moessingen_transparency=220_tqp0_lang=de.png -s > $wttr_path
        convert $wttr_path -resize 1000x1000 $wttr_path
        convert $back_path $wttr_path -geometry +870+100 -composite $back_path
        ;;
    "3")
        convert $back_path <( curl wttr.in/Moessingen_transparency=220_tqp_lang=de.png -s ) -geometry +838+100 -composite $back_path
        ;;
    *)
        ;;
esac

fbi -noverbose -nointeractive -a -T 1 $back_path > /dev/null 2>&1 &

