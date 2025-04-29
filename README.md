# AoC Discord

Simple Discord bot for connecting with Advent of Code leaderboards and getting
puzzle alerts.

## Docker Image
TODO: update this section

## Systemd Unit
Conceptual
```systemd
[Unit]
Description=Discord Advent of Code Bot
After=network-online.target

[Service]
Type=simple
User=aocbot
Group=aocbot
WorkingDirectory=/usr/share/aocbot
ExecStart=/bin/node index.js
Restart=on-success

[Install]
WantedBy=multi-user.target
```
