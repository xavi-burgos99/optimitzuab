# Instructions to Run the Backend Server

## Prerequisites
- Node.js (if not installed)

## Step 1: Install Node.js

1. **Download and install Node.js**:
    - Visit the official [Node.js](https://nodejs.org) website and download the recommended (LTS) version.
    - Follow the installer instructions to complete the installation.

2. **Verify the installation**:
    - Open a terminal and run:
       ```bash
       node -v
       ```
    - You should see the installed version of Node.js.

## Step 2: Install dependencies

1. Open the terminal in the project’s root directory.

2. Run the following command to install all the dependencies defined in `package.json`:
   ```bash
   npm install
   ```

## Step 3: Start the server

1. Run the following command in the terminal to start the server:
   ```bash
   node app.js
   ```

2. The server will be running on `http://localhost:3000`.

## Step 4: Run with nodemon (optional)

If you want the server to automatically restart after each code change:

1. Install `nodemon` globally by running:
   ```bash
   npm install -g nodemon
   ```

2. Start the server using:
   ```bash
   nodemon app.js
   ```
