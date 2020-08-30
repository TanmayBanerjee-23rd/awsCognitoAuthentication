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
                
                
Answer to the question 
What problems will your application face when ELB(load balancer) is used to route requests? And solutions to them are as ::
Scenario Based ::


-- A registered target is not in service

If a target is taking longer than expected to enter the InService state, it might be failing health checks. Your target is not in service until it passes one health check.

Verify that your instance is failing health checks and then check for the following:

A security group does not allow traffic
The security group associated with an instance must allow traffic from the load balancer using the health check port and health check protocol. You can add a rule to the instance security group to allow all traffic from the load balancer security group. Also, the security group for your load balancer must allow traffic to the instances.

A network access control list (ACL) does not allow traffic
The network ACL associated with the subnets for your instances must allow inbound traffic on the health check port and outbound traffic on the ephemeral ports (1024-65535). The network ACL associated with the subnets for your load balancer nodes must allow inbound traffic on the ephemeral ports and outbound traffic on the health check and ephemeral ports.

The ping path does not exist
Create a target page for the health check and specify its path as the ping path.

The connection times out
First, verify that you can connect to the target directly from within the network using the private IP address of the target and the health check protocol. If you can't connect, check whether the instance is over-utilized, and add more targets to your target group if it is too busy to respond. If you can connect, it is possible that the target page is not responding before the health check timeout period. Choose a simpler target page for the health check or adjust the health check settings.

The target did not return a successful response code
By default, the success code is 200, but you can optionally specify additional success codes when you configure health checks. Confirm the success codes that the load balancer is expecting and that your application is configured to return these codes on success.


-- Clients cannot connect to an internet-facing load balancer

If the load balancer is not responding to requests, check for the following:

Your internet-facing load balancer is attached to a private subnet
Verify that you specified public subnets for your load balancer. A public subnet has a route to the Internet Gateway for your virtual private cloud (VPC).

A security group or network ACL does not allow traffic
The security group for the load balancer and any network ACLs for the load balancer subnets must allow inbound traffic from the clients and outbound traffic to the clients on the listener ports.

-- The load balancer sends requests to unhealthy targets

If there is at least one healthy target in a target group, the load balancer routes requests only to the healthy targets. If a target group contains only unhealthy targets, the load balancer routes requests to the unhealthy targets.

-- The load balancer sends a response code of 000
With HTTP/2 connections, if the compressed length of any of the headers exceeds 8K, the load balancer sends a GOAWAY frame and closes the connection with a TCP FIN.

-- The load balancer generates an HTTP error
The load balancer sends the HTTP code to the client, saves the request to the access log, and increments the HTTPCode_ELB_4XX_Count or HTTPCode_ELB_5XX_Count metric.

-- A target generates an HTTP error
The load balancer forwards valid HTTP responses from targets to the client, including HTTP errors. The HTTP errors generated by a target are recorded in the HTTPCode_Target_4XX_Count and HTTPCode_Target_5XX_Count metrics.
