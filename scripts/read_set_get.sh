#!/bin/sh

settings_path="${HOME}/settings/"

if [ -z $2 ]; then
    exit 0
fi

val_name=$1
def_value=$2
new_value=$3

if ! [ -z $new_value ]; then
    value=$new_value
else
    read value < ${settings_path}${val_name}
fi
if [ -z $value ]; then
    value = $def_value
fi

echo $value > ${settings_path}${val_name}

echo $value

