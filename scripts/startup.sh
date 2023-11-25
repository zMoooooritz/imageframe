#!/bin/sh

if [ -n "$SSH_CLIENT" ] || [ -n "$SSH_TTY" ]; then
  exit 0
else
  case $(ps -o comm= -p $PPID) in
    sshd|*/sshd) exit 0;;
  esac
fi

npm run start --prefix $(dirname $(dirname $(realpath $0))) &
