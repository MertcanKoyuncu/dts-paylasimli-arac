# DTS Paylaşımlı Araç
![1](https://github.com/user-attachments/assets/b0d283f1-ed44-4db5-a5b7-e7a0506df8f9)
![2](https://github.com/user-attachments/assets/15d5fb3b-9e0b-4831-b5e0-e4ec0976d7f8)
![3](https://github.com/user-attachments/assets/760aa22f-10ac-4a28-9dda-760e42c71a24)
![4](https://github.com/user-attachments/assets/9ee8e25c-4693-4a8c-a71a-96a5dfebe497)
![5](https://github.com/user-attachments/assets/f1b1d87d-e5f6-41ad-b8db-d25bcec30a03)
![6](https://github.com/user-attachments/assets/e22c4068-f597-49dc-8aaa-1e8f2350849f)

Bu uygulama, React Native ve Expo ile geliştirilen paylaşımlı araç uygulamasıdır. Uygulamada kullanıcılar konum tabanlı olarak araç çağırabilir, yolculuk detaylarını görüntüleyebilir ve profil bilgilerini yönetebilirler.

## Özellikler

- Kullanıcı kaydı ve girişi
- Gerçek zamanlı konum izleme
- Araç çağırma ve iptal etme
- Farklı araç türleri (Ekonomik, Konfor, Premium)
- Yolculuk detayları ve ücretlendirme
- Kullanıcı profili ve geçmiş yolculuklar
- Bildirim ve ayarlar yönetimi

## Kurulum

Uygulamayı yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1. Bu depoyu bilgisayarınıza klonlayın:
```bash
git clone <repo-url>
cd dts-paylasimli-arac
```

2. Gerekli paketleri yükleyin:
```bash
npm install
```

3. Expo geliştirici araçlarını başlatın:
```bash
npx expo start
```

4. iOS veya Android simülatöründe çalıştırmak için:
```bash
npx expo run:ios
# veya
npx expo run:android
```

## Gereksinimler

- Node.js 14.0 veya üzeri
- npm 6.0 veya üzeri
- iOS için XCode veya Android için Android Studio
- iOS Simülatör veya Android Emülatör

## Görseller

Uygulamanın görselleri `/assets` klasöründe bulunmalıdır. Görselleri eklemek için lütfen `/assets/README.md` dosyasını takip edin.

## Geliştirme

Uygulamayı geliştirmek için aşağıdaki dosya yapısını göz önünde bulundurun:

```
dts-paylasimli-arac/
├── app/                # Expo Router ana dosyası
├── assets/             # Görseller ve resimler
├── src/
│   ├── components/     # Yeniden kullanılabilir bileşenler
│   ├── navigation/     # Navigasyon yapılandırması
│   ├── redux/          # Redux durum yönetimi (Gelecekte eklenebilir)
│   └── screens/        # Uygulama ekranları
```

## Katkıda Bulunma

1. Bu depoyu fork edin
2. Özellik dalınızı oluşturun (`git checkout -b ozellik/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Dalınızı push edin (`git push origin ozellik/yeni-ozellik`)
5. Bir Pull Request oluşturun

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## İletişim

Sorularınız veya önerileriniz için lütfen iletişime geçin.
