# UndirectedReading
 Randomly print a student story on a thermal printer




Raspberry Pi setup
ssh file
wpa_.conf for wifi setup 

```sh
sudo apt update 
sudo apt upgrade
### (password, hostname, gpio...)
sudo raspi-config 
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt-get install build-essential libudev-dev git pigpio nodejs
```

```sh
### (need sudo to access hardware in nodejs)
sudo npm install -g pm2 
git clone https://github.com/gestadieu/UndirectedReading.git
cd UndirectedReading
sudo pm2 ls
sudo pm2 start index.js
sudo pm2 startup systemd
sudo pm2 save
```

