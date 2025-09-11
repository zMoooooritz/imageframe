#!/bin/bash

echo "Requesting sudo access..."
sudo -v

SCRIPTDIR="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
MAINDIR=$(dirname $SCRIPTDIR)

echo "Enabling automatic login..."

sudo mkdir -p /etc/systemd/system/getty@tty1.service.d/
sudo cp ${SCRIPTDIR}/autologin.conf /etc/systemd/system/getty@tty1.service.d/

echo "Configuring login..."
git -C $MAINDIR fetch --tags
latestTag=$(git -C $MAINDIR describe --tags "$(git -C $MAINDIR rev-list --tags --max-count=1)")
figlet "imageframe $latestTag"| sudo tee /etc/greeter > /dev/null
sudo tee /etc/motd > /dev/null <<< ""
sudo tee /etc/issue > /dev/null <<< ""
sudo tee /etc/issue.net > /dev/null <<< ""

BASH_PROFILE="$HOME/.bash_profile"
INJECTION=$(cat <<EOF

# Auto-injected MOTD setup (do not modify manually)
if [[ -z "\$SSH_TTY" ]]; then
    clear
    cat /etc/greeter
    exec sleep infinity  # Prevents shell prompt only for TTY users
fi

EOF
)

if [[ -f $BASH_PROFILE ]]; then
	if ! grep -q "exec sleep infinity" "$BASH_PROFILE"; then
		echo "$INJECTION" >> "$BASH_PROFILE"
	fi
else
	echo "$INJECTION" > "$BASH_PROFILE"
fi

echo "Installing node dependencies..."
npm install --prefix "$MAINDIR"

echo "Installing imageframe systemd service..."

sudo cp ${SCRIPTDIR}/imageframe.service /etc/systemd/system/

sudo systemctl daemon-reload
sudo systemctl enable imageframe
sudo systemctl restart imageframe
