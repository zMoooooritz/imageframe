#!/bin/sh

separator="class=\"entry\">"
line=$(curl -L http://www.witz-des-tages.de/witz-des-tages -s | grep $separator)
line=${line#*$separator}
separator="<div"
line=${line%%$separator*}
line=${line//<p>/}
line=${line//<\/p>/\\n}
line=${line//\&#8220;/\"}
line=${line//\&#8221;/\"\\n}
line=${line//\&#8230;/...}
line=${line//<br\ \/>\ /\\n}
line=${line%\\n}
line=${line%\\n}

echo -e $line

