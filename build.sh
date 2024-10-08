#!/bin/bash

echo This will set up and copy all required dependencies in your system. Press ENTER to proceed.
read

clear

npm install

chmod -R 754 bin/*
sudo cp -v -R bin/linux/* /bin

echo
echo ⣿⣿⣿⢿⢿⢿⢟⢟⡿⣻⡹⡫⡹⡸⢝⢯⣻⡫⣟⢝⢝⡙⣛⢻⢻⠻⡻⢿⢟⡿⢿⢿⢿⣿⣿
echo ⣿⠯⡳⡱⡱⢨⢢⢓⢕⡳⡊⢎⢺⢸⢸⢸⢸⢸⢪⠪⡓⡎⢖⢕⢅⠕⡨⡊⡇⡇⡫⡣⡕⡜⣿
echo ⡕⢕⠱⡑⢌⠮⡪⡪⡪⡂⢎⢢⠱⡱⡱⡁⢆⢇⠇⣕⡨⠪⡸⢐⢅⠕⢸⢸⢘⠜⢬⢪⢪⡰⢸
echo ⣎⢢⢱⡘⡔⠅⡇⡪⡎⡎⡎⢆⢗⢽⢸⢰⢱⢇⢯⠲⣹⣻⣾⡔⡢⡑⡌⡊⡆⡕⡧⡳⢱⢽⣿
echo ⡗⡌⡎⡪⡪⡨⡪⠨⡂⡇⢌⠢⡱⡹⡸⡸⢪⢣⠣⢁⣞⢎⢟⢘⢆⢪⢂⢢⢑⠸⡑⡂⡞⡣⢽
echo ⡧⡣⠱⡰⢅⢓⠌⢜⢜⢜⢔⢧⢳⢵⢱⠨⠨⡨⡢⢌⢇⢇⠢⡡⡣⠃⠕⡪⢂⠱⡰⡱⡑⡱⣽
echo ⣯⠪⡐⢜⢜⢔⢅⢱⡱⡃⢕⢕⡗⣝⠢⡡⡱⡑⢕⠑⠌⡠⡑⡨⡪⢥⢱⢈⠢⡨⡪⡊⡢⡊⣾
echo ⡧⢡⢙⢜⢜⢕⢜⡜⢜⠸⡌⡪⢪⢦⢣⢑⢜⢜⠔⡡⣑⠄⡊⡎⡎⡎⡎⡆⣇⢳⢨⢢⢱⠨⣿
echo ⣟⢌⢆⠇⢇⢂⠣⢹⢸⢸⢢⢊⠢⡑⠅⡇⡃⡑⠨⡊⡂⢇⢇⢇⠇⠌⢂⣃⡊⠌⡎⢎⢊⢎⣿
echo ⣿⢪⢸⢘⢲⠌⡌⡂⢗⢱⢱⢱⢹⢔⢅⢂⢂⠂⡕⡌⡢⢘⢔⣕⣿⣟⣿⣿⢻⣏⢪⢈⢆⢳⣿
echo ⣿⢱⢡⢣⠪⡣⡪⡪⡪⡣⡪⡺⡸⡕⡕⡀⡂⢅⢣⠱⠱⡑⠝⡺⢛⠭⢩⣩⣲⠘⢜⢐⠡⣹⣿
echo ⣿⡎⢎⢎⠔⡱⡱⡁⡣⡋⢎⢎⢳⠱⡑⡆⡪⡨⠢⡩⠣⡢⡡⡳⣞⣿⢿⢺⠑⠌⢎⠌⡢⢽⣿
echo ⣿⣿⣦⣕⠱⡱⢑⠅⡣⡑⢅⢕⢠⢑⠨⡢⡒⡌⠪⡘⡌⡎⡢⢂⢊⢌⠎⢪⠨⢈⠢⢃⢪⣾⣿
echo ⣿⣿⣿⣿⣿⣮⣜⠔⡨⡪⡸⡜⡱⢱⢱⠨⡘⡌⡇⠕⢔⠱⡘⢌⠎⢆⠪⢨⣨⣢⣮⣾⣿⣿⣿
echo ⣿⣿⣿⣿⣿⣿⣿⣿⣶⣌⡢⢇⢎⢆⠕⡰⠨⠂⢅⢑⢅⣅⣢⣦⣷⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿
echo ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣥⢢⣁⣤⣧⣷⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
echo
echo You did it.
read

exit