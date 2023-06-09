# How-to-host-a-web-server-on-an-orange-pi-5

## Summary

This tutorial will show you how to host your own website or webserver as well as hosting your own MongoDB database, on the recently released orange pi 5.
We will use docker to easily create and manage our server and database. Furthermore we will be setting up and use Cloudflare's _free_ tunnel system to safely expose your server on the internet.
First question though before we get started: Why the orangepi 5? Well we can actually use anything that can run an os preferrably a linux server os. But we chose the orangepi 5 because of this reasons:

1. Price: TLDR - They are freakin' cheap. The point of this tutorial is to be able to host a website for your projects and maybe test one of your multimillion dollar startup apps, at minimal cost and here we are only going to be paying for the domain name (yes! that's it) to make everying work, everything else is completely free!
2. Performance: Specwise it is significantly much faster than the latest version of raspberry pi which is the rpi 4. And with it's m.2 slot it enables us to run an os much faster than the rpi4 can.
3. Availability: The past few years has been tough for rpi manufacturer to serve the demand of the rpi 4 leading it's prices to go up.<br/><br/>

## Content

-   [What you'll need](#prerequisites)
-   [Installing linux server os](#installing-os)
-   [Installing Docker](#installing-docker-containers)
-   [Connecting to Cloudflare tunnel](#cloudflare-tunneling)
-   [Setting up free MongoDB database](#setting-up-free-mongodb-database)<br/><br/><br/>

## What you'll need

<a name="prerequisites"></a>

1. Orange pi 5
2. Sd Card
3. Nvme SSD (Optional, but IMO you should use one because this will significantly improve performance, for example on an SD card for me it takes at least 40s-1m to boot, while booting from an SSD boots anywhere around 10-15s.)
4. USB-C power adapter<br/><br/><br/>

## Installing Linux (Debian) Server OS

<a name="installing-os"></a>

1. Download the server os built for the Orangepi 5 [here](https://drive.google.com/drive/folders/1F2uc8v_EQnvsNrevDihwoymOJlFgM-dZ), or go to their [site](http://www.orangepi.org/html/hardWare/computerAndMicrocontrollers/service-and-support/Orange-pi-5.html) and go to Downloads section and download the latest version of the _bullseye_server_linux_ version
2. Unzip the file and use something like balena etcher to flash the .iso file to your SD card. This will take a few minutes to flash
3. Insert the sd card to the board, then plug in your USB-C power to the appropriate port. (Note: there are two USB-C port and only one is intended for power, go to their site and look for photos with labels to find the correct port)
4. Once powered up, you can connect the device to a monitor to see it's installation progress. When it finishes installing connect to your wifi via ethernet, but if you don't have access to that, you can also get a wifi dongle, if you go with the dongle, here's how you connect to your wifi:

    - List all available wifi networks
        ```
        nmcli dev wifi list
        ```
    - Cnnect to your local network
        ```
        sudo nmcli dev wifi connect wifi-name password <wifi-passwor>
        ```
    - Get ip address (we'll need this later)
        ```
        ip a
        ```
        or
        ```
        ifconfig
        ```

5. Now you can proceed to the rest of the tutorial, but to improve your servers performance, you need to boot off of an SSD. You can follow [this tutorial](https://www.youtube.com/watch?v=cBqV4QWj0lE) to do just that.
6. At this point you can just plugin your keyboard and monitor to manage your server, but a more efficient way to do this is to ssh to your server, and much better, use vscode and install the extension Remote - SSH by Microsoft to manage your server's file system, inside of vscode! Here's how to do that:
    - Install Remote - SSH in vscode (I assume you already know how to do this). Go to the new tab (Remote Explorer) and click add new remote, then enter your server's ip address we got earlier. It will ask for your password and that's it, you can open folders from your orangepi and manage it from there<br/><br/><br/>

<a name="installing-docker-containers"></a>

## Installing Docker, Setup basic Nodejs Server

Before proceeding to this section, although you can just follow this and have a working server, I highly recommend watching a few docker intro to at least gain some knowledge of how everything works on the surface (you don't need to go in depth, but learn just enough to know why use docker at all)

1. Follow this [link](https://docs.docker.com/engine/install/debian/) from official Docker docs to install docker to your orangepi 5
2. Once installed, cd create/open a folder in vscode and pull the included source code for a basic nodejs server from this repo. You will notice I separated the server from db folder, this is not required but for this tutorial this is how I did it
   Create directory
    ```
    cd /home/orangepi
    mkdir server
    cd server
    git pull <copy the link of this repo>
    ```
3. Go to the server folder and install node packages by:
    ```
    cd server
    npm install
    ```
4. Build the image for your server:
    ```
    docker build -t <image_name> .
    ```
5. Run the server
   You can use this command. (If you use your own nodejs project, change the <your_nodejs_port> to the port you are running it on localhost, if you used the provided files, set it to 3500)
    ```
    docker run -it -p 3500:<your_nodejs_port> -v $(pwd):/app <image_name>
    ```
    or use docker-compose
    ```
    docker compose up
    ```
    That's it! you have a dockerized nodejs server. Access the server by going to localhost:3500. Note we set 3500 as the port number, if you used you're project you can set it to a different port.
6. ### A few keynotes:
    - if you look in the package.json, you'll see the start script is using nodemon, this is for development purposes and will enable us automatically see updates when we save our files. Once you deploy this, replace that with "node server", or you could leave it like that, but keep in mind nodejs server will auto update when you make a change, which in some cases you may or may not want.<br/><br/><br/>

<a name="cloudflare-tunneling"></a>

## Serve to the Internet with Cloudflare tunnel

Now you have a working local server, CONGRATS!🎉🎉🎉. Now it's time to serve your site to the INTERNET. We wil use Cloudflare tunneling to do this

1. Follow [this tutorial](https://www.youtube.com/watch?v=eojWaJQvqiw&t=542s) to create a free account and setup a tunnel on cloudflare, and also for some explanation as well.
2. Once you've created an account and a tunnel, click the tunnel and click Configure, you'll find a command, select Docker and copy the command. Before you paste that to the command line though, first pull the cloudflare image from docker hub, then paste that command from cloudflare
    ```
    docker run cloudflare/cloudflared:latest tunnel --no-autoupdate run --token <your-token>
    ```
3. If everything went successful you should see in the cloudflare dashboard in tunnels tab, the Status will update to "Healthy"
4. In the youtube vidoe I linked above, you should also find in that video how to create a Public Hostname, follow that as well, then in the URL field, enter:
   For the <your_ip>, use the ip address of your orangepi you got before
    ```
    <your_ip>:3500
    ```
    and that's it, you can go to the domain/subdomain you provided in cloudflare and see your website alive!

<a name="setting-up-free-mongodb-database"></a>

## Hosting a MongoDB database for FREE!<br/><br/><br/>

At this point, you now have a working server, but you know what's better, having a database you don't have to pay for!

1. Open the terminal on Vscode, then run this command to get an image of mongodb:
    ```
    docker pull mongo:latest
    ```
2. Go to the db folder and run docker container for the MongoDb database:
   if you're on the server folder and want to run docker compose, go to the db foler first
    ```
    cd db
    docker compose up
    ```
    or
    ```
    docker run --name <container_name> -it mongo:latest
    ```
3. Now you have a working MongoDB database, you can get then use that in your server container

## Conclusion

Hosting a web server on an Orange Pi offers a cost-effective and customizable solution for individual developers and small businesses looking to establish an online presence. While the Orange Pi's compact size and affordable price make it an attractive option, it does have limitations in terms of hardware constraints and scalability. However, by carefully considering specific needs and growth potential, users can leverage the Orange Pi's capabilities to create a reliable and functional web server that can handle moderate traffic loads and provide a satisfactory online experience.
