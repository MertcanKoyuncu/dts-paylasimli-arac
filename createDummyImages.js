const fs = require('fs');
const path = require('path');

// Base64 encoded 1x1 pixel PNG image (transparent)
const emptyPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Gerekli görsellerin listesi
const images = [
  'logo.png',
  'driver.png',
  'profile.png',
  'economy-car.png',
  'comfort-car.png',
  'premium-car.png'
];

// Assets dizini
const assetsDir = path.join(__dirname, 'assets');

// Dizinin var olduğundan emin olalım
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Her bir görsel için dummy görsel oluştur
images.forEach(image => {
  const filePath = path.join(assetsDir, image);
  const buffer = Buffer.from(emptyPng, 'base64');
  fs.writeFileSync(filePath, buffer);
  console.log(`${image} oluşturuldu.`);
});

console.log('Tüm dummy görseller başarıyla oluşturuldu!'); 