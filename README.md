# imageframe

ImageFrame is a lightweight application for creating a slideshow on a display or television. It can run on minimal hardware, such as a Raspberry Pi, making it an efficient choice for embedded systems.

The images are displayed using [fbida](https://github.com/fcarlier/fbida), eliminating the need for a desktop environment. This allows the software to run smoothly even on low-power devices, including the Raspberry Pi Zero W.

However, displaying images is only part of what this application offers. See the [Functionality](#supported-functionality) section for a full overview of its features and a preview in the [Preview](#preview) section.  

A Node.js server runs in the background on the device, enabling remote control of the image frame. (Though calling Node.js a "background process" might be a stretch—after all, it’s one of the heaviest objects in the universe!)

## Installation

The following steps are required to setup the image frame (using a Raspberry Pi) [detailed instructions](#detailed-installation-instructions) provides a more detailed guide on how to setup the application:

1. Install an OS, I recommend [Arch Linux](https://archlinuxarm.org/)
2. Install the required dependencies
3. Clone this repository onto the device
4. Run the `setup.sh` script provided in this repository
The frontend should be reachable via the IP of the device (assign a static IP for ease of operation) and Port 3000 (without forwarding the reachability is restricted to the local network)

## Supported Functionality

1. Upload, manage, and delete images while organizing them into folders.
2. Create custom slideshows using images from multiple folders.
3. Schedule specific slideshows to play during predefined timeframes.
4. Update the software directly from the user interface.

## Preview

| ![Image 1](https://github.com/user-attachments/assets/d32e281d-9585-459e-be0c-06113634185f) | ![Image 2](https://github.com/user-attachments/assets/0451dbf9-e4f1-4ebe-97f0-dcf81d982288) |
|:-------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------:|
| ![Image 3](https://github.com/user-attachments/assets/0ec8c2e3-4583-4668-9cd9-cbae1a32d467) | ![Image 4](https://github.com/user-attachments/assets/f79767ea-603a-4741-b476-9a8a0288305d) |

## Detailed Installation Instructions

### OS Installation

> [!WARNING]
> Installing the Operating System from another Unix-based host onto the SD card (`/dev/sdX`)
>
> Ensure you select the correct drive, as writing to the wrong one can cause data loss. You can list available drives using: `fdisk -l`

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
$EDITOR root/etc/systemd/network/wlan0.network
_____________
 [Match]
 Name=wlan0
 
 [Network]
 DHCP=yes
_____________

# Set SSID and PASSWD accordingly
wpa_passphrase "SSID" "PASSWD" > root/etc/wpa_supplicant/wpa_supplicant-wlan0.conf

# Create symlink for automatic wlan connection
ln -s root/usr/lib/systemd/system/wpa_supplicant@.service \
      root/etc/systemd/system/multi-user.target.wants/wpa_supplicant@wlan0.service

# unmount the newly created and configured filesystems
umount boot root
```

## System Configuration

```bash
# IP of the device needs to be sourced from the router
ssh alarm@1.2.3.4 # passwd 'alarm'

su # Enter the default root pwd 'root'
passwd # Change root pwd

# Change hostname if wanted
$EDITOR /etc/hostname

# Change time zone
ln -sf /usr/share/zoneinfo/Region/City /etc/localtime

# Setup package manager
pacman-key --init
pacman-key --populate archlinuxarm
pacman -Sy

# Create the user
useradd -m -G wheel,video -s /bin/bash imageframe
passwd imageframe

# Configure correct sudo permissions
visudo
_________________________________________________
  %wheel ALL=(ALL:ALL) NOPASSWD:ALL # Uncomment this line
_________________________________________________

# Since the newest hardware acceleration driver is broken
#  the driver needs to be changed
$EDITOR /boot/config.txt
______________________________________________
 dtoverlay=vc4-kms-v3d  # Remove this line

 dtoverlay=vc4-fkms-v3d # Add this line
______________________________________________
```

## Application Configuration

```bash
# Install required applications
pacman -Syu
pacman -S fbida git npm figlet ttf-hack # can also choose another monospace font (instead of ttf-hack)

# Clone repo and setup application
git clone https://github.com/zMoooooritz/imageframe code
bash code/scripts/setup.sh
```
