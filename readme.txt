To setup the client and server, please make sure you have the .env file set up correctly. 
Please ensure you have the latest version of node.js and mongodb installed.
Please also ensure you have an instance of mongodb running on your computer.
The .env file is in the zipped submission folder.

To get the server to run, please open a new command prompt window either in vscode, or in a separate window.
Make sure you have navigated to the proper top-level directory.
Run npm install to ensure all dependencies are correctly installed.
For your convenience, the node-modules folder will be included in the zipped submission.

To create an initial admin account, run the command 'npm run seed'.
This will create an initial admin account to allow you to create other users and courses, as long as there is not already one.
To login with this admin account, use:
email: 'admin@gmail.com'
password: 'admin123'

Once all of this is done, run the command 'npm start,' which will create an instance of the server on the port 5001.
Open a browser, and navigate to localhost:5001.

This will bring you to the home page, and you can navigate the website freely. 