# 2048 Oyunu - iPadOS ve iPhone

Bu proje, 2048 oyununu iPad ve iPhone icin internet olmadan calisan gercek bir `.ipa` uygulamasina paketler. Onceki Mayin Tarlasi projesindeki basarili XcodeGen + GitHub Actions + Sideloadly yontemini kullanir.

## Ozellikler

- 4 x 4 oyun alani, kaydirma hareketi ve yon tuslari
- Skor, en yuksek skor ve son hamleyi geri alma
- Yeni oyun, 2048 kazandiniz bildirimi, oyun bitti bildirimi
- iPad ve iPhone uyumu, internet gerektirmeyen arayuz
- Oyun durumu ve rekoru cihazda saklama (WebKit depolamasina izin verildiginde)

## Windows uzerinden IPA olusturma

1. https://github.com/new sayfasinda `Oyun2048-iPadOS` adiyla **yeni** bir repository olusturun; README ve .gitignore eklemeyin.
2. Bu ZIP'i ayiklayin, icindeki `project.yml`, `README.md`, `Oyun2048` ve `.github` klasorlerini GitHub'a yukleyin. ZIP dosyasinin kendisini yuklemeyin.
3. **Cok onemli**: GitHub'da `ipados.yml` dosyasinin konumu `.github/workflows/ipados.yml` olmali. Kok dizinde olmamali.
4. Commit changes'e basin. `Actions` sekmesinde `2048 iPadOS IPA` workflowunu acin.
5. Yesil tikli basarili derlemenin `Artifacts` bolumunden `Oyun2048-iPadOS-IPA` isimli ZIP'i indirin ve ayiklayin.
6. ZIP icindeki `Oyun2048-unsigned.ipa` dosyasini Sideloadly'de secin. iPad/iPhone'u USB ile baglayin, Apple hesabinizla imzalayip yukleyin.
7. iPad'de gerekirse Ayarlar > Genel > VPN ve Aygit Yonetimi bolumunden imzalayan gelistirici hesabina guven verin. Gerekiyorsa Gizlilik ve Guvenlik > Gelistirici Modu ayarini acin.

Uyari: IPA imzasiz uretilir; dogrudan iPad'e yuklenmez. Ucretsiz Apple hesabi ile imzalanan uygulamalar genellikle 7 gun sonra yeniden imzalanmalidir. Sirket cihazinda kurumsal kurulum kurallarina uyun.

## Gelistirme

- `Oyun2048/Web/index.html`: arayuz ve iPad dokunmatik kontrolleri
- `Oyun2048/Web/engine.js`: test edilebilir 2048 oyun motoru
- `Oyun2048/Sources/Oyun2048App.swift`: iOS/iPadOS WebKit uygulama kabugu
- `project.yml`: XcodeGen proje ayarlari
- `.github/workflows/ipados.yml`: imzasiz IPA derlemesi

## Test

Node.js varsa `node tests/engine.test.js` komutuyla oyun mantigini test edebilirsiniz.

Gerekli iOS SDK ve kod imzalama ortami bu calisma bilgisayarinda bulunmadigindan son IPA derlemesi GitHub Actions'ta macOS runner uzerinde yapilir.
