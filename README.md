# imageframe

ImageFrame is a lightweight application for creating slideshows on displays or televisions. It runs efficiently on minimal hardware, such as a Raspberry Pi, making it an ideal choice for embedded systems.

Images are displayed using [fbida](https://github.com/fcarlier/fbida), eliminating the need for a desktop environment. This allows the software to run smoothly even on low-power devices, including the Raspberry Pi Zero W.

Beyond simple image display, this application offers comprehensive slideshow management. See the [Features](#features) section for a complete overview and the [Preview](#preview) section for screenshots.

A Node.js server runs in the background, enabling remote control of the image frame through a web interface. (Though calling Node.js a "background process" might be generous - it's one of the heaviest objects in the universe!)

## Features

1. **Image Management**: Upload, organize, and delete images with folder-based organization
2. **Custom Slideshows**: Create personalized slideshows using images from multiple folders
3. **Scheduling**: Schedule specific slideshows to play during predefined timeframes
4. **Remote Updates**: Update the software directly from the web interface

## Preview

| ![Image 1](https://github.com/user-attachments/assets/d32e281d-9585-459e-be0c-06113634185f) | ![Image 2](https://github.com/user-attachments/assets/0451dbf9-e4f1-4ebe-97f0-dcf81d982288) |
|:-------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------:|
| ![Image 3](https://github.com/user-attachments/assets/0ec8c2e3-4583-4668-9cd9-cbae1a32d467) | ![Image 4](https://github.com/user-attachments/assets/f79767ea-603a-4741-b476-9a8a0288305d) |

## Installation

Follow these steps to set up your imageframe:

### 1. Operating System Installation

Install a Debian-based Linux distribution suitable for your hardware. For Raspberry Pi devices, we recommend [Raspberry Pi OS](https://www.raspberrypi.com/software/).

**Installation Steps:**

1. Download and use the official Raspberry Pi Imager (available for Windows, macOS, and Linux)
2. The official imager simplifies headless setup configuration
3. Configure SSH, Wi-Fi, and user account during the imaging process

> [!WARNING]
> Ensure you select the correct storage device during installation to prevent data loss.

### 2. System Configuration

Connect to your device and configure the system:

```bash
# Connect via SSH (replace with your device's IP address)
ssh imageframe@192.168.1.100

# Switch to root user
sudo su

# Update the system
apt update && apt upgrade -y

# Set timezone (if not configured during imaging)
timedatectl set-timezone Region/City

# Configure passwordless sudo for convenience
visudo
```

Edit the sudoers file to uncomment this line:

```bash
%sudo ALL=(ALL:ALL) NOPASSWD:ALL
```

**Fix Hardware Acceleration (Raspberry Pi specific):**

Edit the boot configuration:

```bash
sudo nano /boot/config.txt
```

Make these changes:

```bash
# Comment out or remove this line:
dtoverlay=vc4-kms-v3d

# Add this line instead:
dtoverlay=vc4-fkms-v3d
```

Reboot after making these changes:

```bash
sudo reboot
```

### 3. Application Setup

Install dependencies and set up the imageframe application:

```bash
# Install required packages
sudo apt install fbida git npm figlet -y

# Clone the repository
git clone https://github.com/zMoooooritz/imageframe ~/imageframe

# Run the setup script
cd ~/imageframe
bash scripts/setup.sh
```

## Advanced Features

### Enhanced Status Display

For users who want additional status information, a modified version of fbida is available in my [fork](https://github.com/zMoooooritz/fbida). This enhancement allows the imageframe Web UI to display advanced state information about currently displayed images.

**Note:** This feature is optional and requires manual compilation. No pre-compiled binaries are provided, so users must:

1. Compile the application for their specific hardware
2. Install the necessary dependencies
3. Replace the system fbida with the enhanced version

This modification provides a richer user experience but is not required for basic functionality.

## Getting Started

After installation, access the web interface by navigating to your device's IP address in a web browser. From there, you can:

- Upload and organize your images
- Create custom slideshows
- Set up scheduling
- Monitor system status
- Update the application

Enjoy your new imageframe!
