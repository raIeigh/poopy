@echo off

echo This will install all required tools (except G'MIC) to your system using WinGet. Press any key to proceed.
pause > nul

cls

winget install -e --id OpenJS.NodeJS.LTS
winget install -e --id Oracle.JavaRuntimeEnvironment
winget install -e --id Gyan.FFmpeg
winget install -e --id ImageMagick.ImageMagick
winget install -e --id gerardog.gsudo

echo:
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
echo:
echo You did it.
pause > nul

exit