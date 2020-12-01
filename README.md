# Chat-App

## What is this app

This is a socket.io based chat application.

## How it works

1. Open [http://localhost:3000](http://localhost:3000) for one user.
2. Each user can send image url and messages.
3. Number of users connected at the same time can have a conversation like a group chat.
4. On clicking settings, user can change username, clock format, ctrl/cmd + enter to send option On/Off.
5. On clicking save, changes are saved.
6. On clicking reset to default, changes are reverted to original state.
7. Close (X) button to exit settings.

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all the dependencies.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Features

- [x] Input field where user can type and send messages
- [x] Users can send pictures via URL. When sent, this URL is rendered on the
      message box as an image
- [x] Next to the input field there is a button to send the message
- [x] All the settings should be consumed and saved on the LocalStorage
- [x] Change username input field
- [x] Change clock display radio inputs
- [x] Send messages with Ctrl/Cmd + ENTER toggle
- [x] Have a text/link to reset all the settings back to its defaults
- [x] Images can be sent alongwith text messages
- [x] Security to avoid XSS attacks
