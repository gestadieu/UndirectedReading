# UndirectedReading
 Randomly print a student story on a thermal printer




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

