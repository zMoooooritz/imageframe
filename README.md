# imageframe

This project enables the creation of a slideshow on a display or television. The executing device can be as simple as a Raspberry.

The images are displayed via [fbida](https://github.com/fcarlier/fbida) therefore a desktop environment is _not_ required.
As a result, the lightweight software can be run on small SoC's (the Raspberry Pi Zero W) included.

Displaying images is only half of the functionality provided by this application.
See the section [functionality](#supported-functionality) for more information.

A NodeJS-Server is running on the device in the background (if this can be said about one of the heaviest objects in the universe) and allows for remote control of the image frame.

## Installation
The following steps are required to setup the image frame (using a Raspberry Pi) [detailed instructions](#detailed-installation-instructions) provides a more detailed guide on how to setup the application:
1. Install an OS, I recommend [Arch Linux](https://archlinuxarm.org/)
2. Setup autologin via [getty](https://wiki.archlinux.org/title/Getty)
3. Install `npm` as it is required for the NodeJS server
4. Clone this repository onto the device
5. cd into the cloned repository and run `npm install`
6. Setup autostart for the software (the entry point should is `scripts/startup.sh`)
The frontend should be reachable via the IP of the device (assign a static IP for ease of operation) and Port 3000 (without forwarding the reachability is restricted to the local network)

## Supported functionality
1. Upload and delete images (to and from different directories)
2. Slideshow
   1. Change the duration an image is displayed
   2. Change the blend time between images
   3. Whether or not to show the images in a random order
3. Set a daily schedule at which the screen should be (in)active
4. Set another possibly overlapping schedule for Sundays and holidays
5. Trigger a synchronize / update of the software

## Detailed Installation Instructions

Installation of the Operating System on the SD card `/dev/sdX`
```bash
 # Setup two partitions
 # 1. Boot - W95 FAT32 (LBA) - 200MB
 # 2. Root - remaining Capacity
fdisk /dev/sdX

# Create and mount the filesystems
mkfs.vfat /dev/sdX1; mkdir boot; mount /dev/sdX1 boot
mkfs.ext4 /dev/sdX2; mkdir root; mount /dev/sdX2 root

# Install the OS files
wget http://os.archlinuxarm.org/os/ArchLinuxARM-rpi-armv7-latest.tar.gz
bsdtar -xpf ArchLinuxARM-rpi-armv7-latest.tar.gz -C root
sync
mv root/boot/* boot

# Setup wifi for headless operation
$EDITOR root/ect/systemd/network/wlan0.network
_____________
 [Match]
 Name=wlan0
 
 [Network]
 DHCP=yes
_____________

# Set SSID and PASSWD accordingly
wpa_passphrase "SSID" "PASSWD" > root/etc/wpa_supplicant/wpa_supplicant-wlan0.conf

ln -s root/usr/lib/systemd/system/wpa_supplicant@.service \
      root/etc/systemd/system/multi-user.target.wants/wpa_supplicant@wlan0.service

umount boot root
```

Configuration of the system
```bash
# IP of the device needs to be sourced from the router
ssh alarm@1.2.3.4 # passwd 'alarm'

su # enter the default root pwd 'root'
passwd # change root pwd

# change hostname if wanted
$EDITOR /etc/hostname

# change time zone
ln -sf /usr/share/zoneinfo/Region/City /etc/localtime

# setup package manager
pacman-key --init
pacman-key --populate archlinuxarm
pacman -Sy

# create the user
useradd -m -G wheel,video -s /bin/bash imageframe
passwd imageframe

# configure correct sudo permissions
visudo
_________________________________________________
  %wheel ALL=(ALL:ALL) ALL # uncomment this line
 
 # add those lines
 imageframe ALL=/sbin/shutdown
 imageframe ALL=NOPASSWD: /sbin/shutdown
_________________________________________________

# since the newest hardware acceleration driver is broken
#  the driver needs to be changed
$EDITOR /boot/config.txt
______________________________________________
 dtoverlay=vc4-kms-v3d # remove this line

 dtoverlay=vc4-fkms-v3d # add this line
______________________________________________

# enable automatic login 
$EDITOR /etc/systemd/system/getty@tty1.service.d/autologin.conf
_____________________________________________________________________________________
 [Service]
 ExecStart=
 ExecStart=-/sbin/agetty -o '-p -f -- \\u' --noclear --autologin imageframe %I $TERM
_____________________________________________________________________________________
```

Setup the application
```bash
# install required applications
pacman -Syu
pacman -S fbida git npm figlet ttf-hack # can also choose another monospace font

# only needed if the application should be updated via git
git config --global user.name "User Name"
git config --global user.email "user@mail.com"
ssh-keygen -t rsa -b 4096 -C "user@mail.com"

git clone https://github.com/zMoooooritz/imageframe code
cd code
npm install

npm run start # test if the node server starts up successfully and Ctrl+C afterwards

$EDITOR ~/.bash_profile
_________________________________
 if [ -z "SSH_AUTH_SOCK" ]; then
   eval `ssh-agent -s`
   ssh-add
 fi

 ~/code/scripts/startup.sh
_________________________________
```