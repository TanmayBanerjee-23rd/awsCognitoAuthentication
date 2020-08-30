Please do perform the mandatory steps before running the application ::

Step 1 : Make sure you are logged into the server being a sudo user who's privileged to access nginx log files / root user .
            And you are able to get
             "X.XX.X
             X.XX.X " as a result in CLI after firing the command "node -v;npm -v" .

Step 2 : Place all the 8 files in a directory and change you present working directory(pwd) to the currently created directory.

Step 3 : Run the command "npm i" (to install package dependencies to run the application)

Step 4 : Edit file controller.js and populate values for variables "userPoolId" and "clientId" with AWS cognito User pool ID and App Client ID respectively.

Step 5 : Make sure port "20200" is open or you may edit appServer.js and modify HOST_PORT variable to your desired one.

Step 6 : Fire the command "node appServer.js";
            This should give you a log as "info :: -->', '*********** Application Server is listening on Port 20200 ***********"
            And by now the application should be running and
            ready to respond the API "/api/user/login" POST request with body as JSON object i. e.
            {
                "email": "<aws-cognito-user-pool-registered-mailID>"
                "password": "<aws-cognito-user-pool-registered-password>"
                "filterKey": "<string to filter nginx logs. It can be IP, date (Nginx Format ex "30/Aug/2020"), time (Nginx Format ex "08:59:36"), or any other string>"
            }

Step 7 : The API "/api/user/login" will respond as
            {
                        success: false,
                        data: {},
                        error: {
                            message: err.message
            }, on authentication failure and err.message will be default aws cognito error message for unsuccessful login

            or

            It will respond as
            {
                        success: true,
                        data: data
            }, on successful authentication and the data will be
                {
                        loginSuccessMessage : "Logged In Successfully!",
                        sessionToken : "<Token provided by AWS cognito>",
                        logsMessage : "Filter key matching nginx logs not found!"
                }, if no matching logs found as per filterKey provided by the user,

                or

                {
                        loginSuccessMessage : "Logged In Successfully!",
                        sessionToken : "<Token provided by AWS cognito>",
                        logs : [...],
                }
                logs will be an array of matching strings from nginx logs as per filterKey provided.
                * It might take a longer time to fetch response if there are too many matching strings found.