# Sürüm Planı

## V1 — Çalışan ürün

### Hedef

En kısa sürede hızlı, mobil öncelikli, SEO uyumlu ve GitHub Pages üzerinde yayımlanabilir bir ürün ortaya çıkarmak.

### Aktif kapsam

- Plugin sistemi
- İlk plugin sözleşmesi
- Component Registry
- İlk tool ailesinin gerektirdiği ortak component'ler
- Light, dark ve system destekli Theme Engine
- Tool ve kategori keşfi yapan build sistemi
- Statik ana sayfa, kategori ve tool sayfaları
- İstemci tarafı arama
- Sitemap ve temel teknik SEO çıktıları
- GitHub Actions doğrulama workflow'u
- GitHub Pages deployment workflow'u
- İlk tool ailesi
- Yeni tool için tek komutlu scaffold workflow'u
- Temel dokümantasyon

### Kapsam dışı

- Çalışan AI generation pipeline
- Otomatik rakip taraması
- Otomatik fırsat puanlama
- Otomatik tool yayınlama
- Gelişmiş ve risk tabanlı kalite profilleri
- Çok aşamalı otonom agent süreçleri
- Gelişmiş analitik ve kişiselleştirme
- Gereksiz sayıda hazır component veya tool family

### V1 tamamlanma ölçütleri

V1 aşağıdaki koşullarda tamamlanmış sayılır:

1. Yeni bir tool yalnızca kendi plugin klasörü eklenerek kataloğa dahil edilebilir.
2. Ana sayfa, kategori, arama ve sitemap elle güncellenmez.
3. İlk tool ailesi çalışan birden fazla gerçek tool içerir.
4. Tool sayfaları mobil cihazlarda kullanılabilir ve statik SEO içeriği sunar.
5. Tema tercihi light, dark ve system arasında çalışır.
6. Build hatalı manifest, eksik kategori ve çakışan slug durumunda başarısız olur.
7. GitHub Actions başarılı build'i GitHub Pages'e yayımlar.
8. Yeni tool iskeleti tek komutla üretilebilir.
9. Yayınlanan sitede build aracı veya uygulama framework'ü bulunmaz.

## V2 — Akıllı büyüme altyapısı

V1 kararlı hale geldikten sonra değerlendirilecek kapsam:

- Rakip ve pazar kaynaklarını izleme
- Aday tool kayıtları
- Fırsat puanlama
- Yapılandırılmış generation specification
- Family tabanlı AI tool üretimi
- AI provenance kayıtları
- Gelişmiş içerik benzerliği ve özgünlük kontrolleri
- Risk seviyesine göre değerlendirme profilleri
- Kontrollü otomatik değişiklik önerileri

## V3 — Ölçekli otomasyon

Yeterli üretim ve kalite verisi oluştuktan sonra değerlendirilecek kapsam:

- Düşük riskli tool ailelerinde otomatik üretim
- Otomatik regression ve görsel değerlendirme
- Analitik sinyallerle katalog optimizasyonu
- Kontrollü otomatik yayın
- Çoklu dil üretim ve güncelleme akışları
- Gelişmiş öneri ve iç bağlantı modelleri

## Uygulamadan önce açık kararlar

V1 uygulamasına başlamadan önce aşağıdaki ürün kararları kesinleştirilmelidir:

1. Site adı ve geçici/kalıcı domain modeli
2. V1 görsel yönü ve marka karakteri
3. Desteklenecek minimum tarayıcı seviyesi

Bu kararlar V1'in mimari sınırlarını değiştirmez; içerik, tasarım ve ilk ürün sıralamasını belirler.

## Kesinleşen V1 ürün kararları

- İlk yayın dili İngilizcedir; altyapı çok dile hazır kalır.
- İlk tool ailesi Text Tools'tur.
- Başlangıç listesi Word Counter, Character Counter, Case Converter, Remove Duplicate Lines, Text Sorter ve Whitespace Cleaner'dır.
- İlk uçtan uca uygulama Word Counter'dır. Diğer beş plugin, Word Counter altyapıyı doğrulamadan oluşturulmaz.
