# UndirectedReading
 This code is part of an installation to present the work of students during their Directed Reading class of 2021. Students are from Bachelor of Design, Bachelor of Fashion Design, Bachelor of Architecture and Bachelor of Communication and Media.

 The concept
 Randomly print a student story on a thermal printer


TODO:
-create a full management REST API with ORM layer
- npm i dotenv 

Raspberry Pi setup

1. flash the SD card with Raspberry PiOS
2. add a 'ssh' file to allow remote ssh access
3. add a wpa_supplicant.conf for wifi setup 

Once connected to the Pi:
```sh
sudo apt update 
sudo apt upgrade
# (password, hostname, gpio...)
sudo raspi-config 
# add source for latest nodejs
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
# install required extra packages
sudo apt-get install build-essential libudev-dev git pigpio nodejs
```

```sh
# (need sudo to access hardware in nodejs)
sudo npm install -g pm2 
git clone https://github.com/gestadieu/UndirectedReading.git
cd UndirectedReading
npm install
sudo pm2 ls
sudo pm2 start index.js
sudo pm2 startup systemd
sudo pm2 save
```

Reference
https://learn.adafruit.com/mini-thermal-receipt-printer 
https://learn.adafruit.com/instant-camera-using-raspberry-pi-and-thermal-printer/system-setup
https://learn.adafruit.com/pi-thermal-printer/raspberry-pi-software-setup 



https://jamesg.blog/2021/06/17/thermal-printer-part-1 
https://www.npmjs.com/package/thermalprinter

FRONTEND:
https://www.snowpack.dev/ 
https://getgrav.org/ 