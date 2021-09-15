# UndirectedReading
 This code is part of an installation to present the work of students during their Directed Reading class of 2021. Students are from Bachelor of Design, Bachelor of Fashion Design, Bachelor of Architecture and Bachelor of Communication and Media.

 The concept
 Randomly print an extract of a student's story on a thermal printer as well as
 a QR code to scan and read online the full story with some illustrations.


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
sudo apt-get install git cups wiringpi build-essential libcups2-dev libcupsimage2-dev
git clone https://github.com/adafruit/zj-58
cd zj-58
make
sudo ./install

(or ttyAMA0)
sudo lpadmin -p ZJ-58 -E -v serial:/dev/ttyUSB0?baud=9600 -m zjiang/ZJ-58.ppd
sudo lpoptions -d ZJ-58


https://learn.adafruit.com/pi-thermal-printer/raspberry-pi-software-setup 

sudo apt-get install git cups wiringpi build-essential libcups2-dev libcupsimage2-dev python-serial python-pil python-unidecode

git clone https://github.com/adafruit/zj-58
cd zj-58
make
sudo ./install

sudo lpadmin -p ZJ-58 -E -v serial:/dev/serial0?baud=9600 -m zjiang/ZJ-58.ppd
sudo lpoptions -d ZJ-58

https://www.npmjs.com/package/thermalprinter

FRONTEND:
https://www.snowpack.dev/ 
https://getgrav.org/ 