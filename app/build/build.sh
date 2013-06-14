r.js -o build/app.build.js
cd ../dist
mv scripts/vendor/requirejs/require.js require.js
rm -rf scripts/vendor/* build scripts/views scripts/models scripts/collections build.txt
mkdir scripts/vendor/requirejs && mv require.js scripts/vendor/requirejs/require.js
mv css/style.css style.css && rm -rf css/* && mv style.css css/style.css
mkdir -p scripts/vendor/bootstrap/docs/assets
cp -r ../app/scripts/vendor/bootstrap/docs/assets/img scripts/vendor/bootstrap/docs/assets 
mkdir -p scripts/vendor/font-awesome/font
cp -r ../app/scripts/vendor/font-awesome/font scripts/vendor/font-awesome/font


