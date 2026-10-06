# Sono-Server

This acts as a quick little sonolus server

## Prerequisites

- [Node.js](https://nodejs.org)

## Recommended Setup

- [Visual Studio Code](https://code.visualstudio.com)

## Get Started

Run `npm i` in this directory

Run this server by running `node install.js`, which configures first time setup for you.

This server comes pre-bundled with ProSeka Faithful

## Web Interface

The [official Sonolus Server Web client](https://github.com/Sonolus/sonolus-server-web), based on upstream commit `dbed17e`, is served at the server root. It is limited to browsing levels and their required engines, skins, backgrounds, effects, and particles, with keyword search and links to open items in Sonolus.

Install its dependencies with `npm --prefix ./web ci`, then build after changing files in `web/` with `npm run build-web`. The generated `web/dist/` files are served alongside the Sonolus API.

Node.js is required for this server.

## Legal

This code is under the [Nexint TOS](https://nexint.ca/tos)

This code is proprietary and source available.
