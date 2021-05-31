# UndirectedReading
 Randomly print a student story on a thermal printer




Raspberry Pi setup
ssh file
wpa_.conf for wifi setup 
sudo apt update 
sudo apt upgrade
sudo raspi-config (password, gpio...)
curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt-get install build-essential libudev-dev git nodejs 

sudo npm install -g pm2 (need sudo to access hardware in nodejs)
git clone https://github.com/gestadieu/UndirectedReading.git

cd ~/UndirectedReading
sudo pm2 ls
sudo pm2 start index.js
sudo pm2 startup systemd
sudo pm2 save


