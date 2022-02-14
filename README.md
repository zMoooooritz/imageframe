# imageframe

The software in this repository can be used to display a slideshow of images or a [MagicMirror](https://github.com/MichMich/MagicMirror)-like info on a monitor or tv.

The images are displayed via [fbida](https://github.com/fcarlier/fbida) therefore a desktop environment is _not_ required.
As result, the lightweight software can be run on small SoC's (the Raspberry Pi Zero W) included.

But displaying images is only half of the required functionality a picture frame should have.

Therefore a NodeJS-Server does run on the device in the background and allow for remote control of the image frame:

## Supported functionality
1. Upload and delete images (to and from different directories)
2. Toggle between slideshow and info-mode
3. Slideshow
   1. Change the time an image is displayed
   2. Change the blend time between images
   3. Whether or not to show the images in a random order
4. Info-mode
   1. Multiple switchable modules i.e. date, weather, ...
   2. Screen is refreshed automatically at certain intervals
5. Set a daily schedule at which the screen should be (in)active
6. Trigger a synchronize / update of the software

## Setup
The following steps are required to setup the image frame (using a Raspberry Pi):
1. Install an OS, I recommend [Arch Linux](https://archlinuxarm.org/platforms/armv6/raspberry-pi)
2. Setup autologin via [getty](https://wiki.archlinux.org/title/Getty)
3. Clone this repository into the home directory
5. Setup autostart for the software (the entry point should be the call `startup.sh all`)
7. The frontend should be reachable via the IP of the device and Port 3000 (without port forwarding the reachability is restricted to the local network)

## TODO
Currently the info-mode is relatively rigid and does not support many modules.

   -> More modules and better configurability
