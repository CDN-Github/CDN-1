reset="\e[0m"

green="\e[32m"
yellow="\e[33m"
magenta="\e[35m"
cyan="\e[36m"
cyanBG="\e[46m"
white="\e[97m"

bd=""

echo -e "${magenta}Checking NodeJS version...${reset}"
nver=$(node.exe --version)

if [ "$nver" = v[14-999].* ]; then
    echo -e "${yellow}The recommended version is NodeJS >= v14.x${reset}"
else
    echo -e "${green}You meet the NodeJS requirements${reset}"
fi

echo ""

echo -e "${magenta}Downloading dependencies...${reset}"
npm i node-fetch --save

echo ""

echo -e "${magenta}Choose a build (stable/beta): ${cyan}"
read bd

if [ "$bd" = "stable" ]; then
    bd=""
elif [ "$bd" = "beta" ]; then
    bd="-beta"
else
    bd=""
fi

echo ""

echo -e "${magenta}Searching Powercord...${reset}"
cd src/Powercord/plugins

echo ""

echo -e "${magenta}Downloading build...${reset}"
curl "https://raw.githubusercontent.com/CDN-Github/CDN-1/main/powercord/plugins/pc-bypassreport/builds/latest${bd}.zip" -O -J -L

echo ""

echo -e "${magenta}Exracting build...${reset}"
unzip -o latest$bd.zip

echo ""

echo -e "${magenta}Removing temp files...${reset}"
rm latest$bd.zip

echo ""

echo -e "${green}Success${reset}"
echo -e "${cyanBG}${white}Don't forget to set your password!${reset}"
read