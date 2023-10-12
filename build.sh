# Build 
yarn build
cd build || exit 

# Package for Chrome
zip -r -FS ../wh-chrome.zip .

# Package for Firefox
cp -f ../static/manifest_firefox.json ./manifest.json
zip -r -FS ../wh-firefox.zip .
