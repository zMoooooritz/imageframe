# imageframe

This project enables the creation of a slideshow on a display or television. The executing device can be as simple as a Raspberry.

The images are displayed via [fbida](https://github.com/fcarlier/fbida) therefore a desktop environment is _not_ required.
As a result, the lightweight software can be run on small SoC's (the Raspberry Pi Zero W) included.

Displaying images is only half of the functionality provided by this application.

On the device a NodeJS-Server is running in the background (if this can be said about one of the heaviest objects in the universe) and allows for remote control of the image frame:

## Installation
The following steps are required to setup the image frame (using a Raspberry Pi):
1. Install an OS, I recommend [Arch Linux](https://archlinuxarm.org/)
2. Setup autologin via [getty](https://wiki.archlinux.org/title/Getty)
3. Clone this repository into the home directory
4. Install `npm` as we required it for the NodeJS server
5. cd into the `website` directory and run `npm install`
6. Setup autostart for the software (the entry point should be the call `startup.sh`)
7. The frontend should be reachable via the IP of the device and Port 3000 (without port forwarding the reachability is restricted to the local network)

## Supported functionality
1. Upload and delete images (to and from different directories)
2. Slideshow
   1. Change the duration an image is displayed
   2. Change the blend time between images
   3. Whether or not to show the images in a random order
3. Set a daily schedule at which the screen should be (in)active
4. Set another possibly overlapping schedule for Sundays and holidays
5. Trigger a synchronize / update of the software
