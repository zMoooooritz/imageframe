# imageframe

The software in this repository can be used to display a slideshow of images or a [MagicMirror](https://github.com/MichMich/MagicMirror)-like info on a monitor or tv.

The images are displayed via [fbida](https://github.com/fcarlier/fbida) therefore a desktop environment is _not_ required.
As result the lightweight software can be run on small SoC's (the Raspberry Pi Zero W) included.

But displaying images is only half of the required functionality a picture frame should have.

Therefore a NodeJS-Server does run on the device in the background and allow for remote control of the image frame:

## Supported functions
1. Upload and delete images
2. Toggle between slideshow and info-mode
3. Slideshow
   1. Change the time an image is displayed
   2. Change the blend time between images
   3. Whether or not to show the images in a random order
4. Info-mode
   1. Multiple switchable modules i.e. date, weather, ...
   2. Screen is refreshed automatically at certain intervals
5. Set a daily schedule at which the screen should be (in)active

## Setup
The following steps are required to setup the image frame (using a Raspberry Pi):
1. Install a Unix-based OS, I recommend [Arch Linux](https://archlinuxarm.org/platforms/armv6/raspberry-pi)
2. Setup autologin via getty
3. Clone this repository into the home directory
5. Setup autostart for software (the entry point is the script startup.sh)
7. The frontend should be reachable via the IP of the device and Port 3000

## TODO
Currently the info-mode is relativly rigid and does not support many modules. -> More modules and better configurability
Since the Index-page of the Server does become cluttered a clean-up would be nice -> move settings into different sub-routes
