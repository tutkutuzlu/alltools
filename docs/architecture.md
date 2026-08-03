# Platform Mimarisi

## 1. Mimari özet

Platform; klasör tabanlı içerik, statik site üretimi, plugin tabanlı tool çalışma modeli, merkezi Component Registry ve token tabanlı Theme Engine üzerine kurulacaktır.

Tarayıcıda yalnızca HTML, CSS ve Vanilla JavaScript çalışır. Node.js geliştirme, doğrulama ve statik üretim aşamasında kullanılabilir; yayınlanan site bir uygulama sunucusuna ihtiyaç duymaz.

```text
Tool plugin'leri + kategori verileri + içerikler
                        |
                        v
              Şema ve build doğrulaması
                        |
                        v
                 Statik site üreticisi
                        |
                        v
       HTML + CSS + Vanilla JavaScript çıktısı
                        |
                        v
             GitHub Actions deployment
                        |
                        v
                   GitHub Pages
```

## 2. Sürüm stratejisi

Uygulama iki aşamaya ayrılmıştır.

### V1: çalışan ürünü hızlı çıkarma

V1 yalnızca aşağıdaki aktif sistemleri kapsar:

1. Plugin sistemi
2. Component Registry
3. Theme Engine
4. Build sistemi
5. GitHub Actions
6. İstemci tarafı arama
7. Teknik SEO üretimi
8. İlk tool ailesi

V1'in amacı bütün uzun vadeli altyapıyı uygulamak değil; kabul edilen çekirdek sözleşmelerle çalışan, hızlı ve yayınlanabilir ilk ürünü ortaya çıkarmaktır.

### V2 ve sonrası

Aşağıdaki alanlar için klasör ve genişleme noktaları korunur ancak V1 build veya runtime akışına bağlanmaz:

- AI generation pipeline
- Rakip ve pazar araştırma otomasyonu
- Gelişmiş kalite profilleri
- Risk seviyesine bağlı otomatik yayın
- Gelişmiş analitik tabanlı öneriler
- Çok aşamalı otonom üretim süreçleri

Boş klasörler Git tarafından takip edilmediği için, bu alanların yer tutucuları ileride kısa açıklama dosyalarıyla korunabilir. V1 sırasında bu alanlara işlevsel kod eklenmez.

## 3. Hedef klasör yapısı

V1 hedefi aşağıdaki çekirdek yapıdır:

```text
/
|-- docs/
|-- src/
|   |-- config/
|   |-- core/
|   |-- components/
|   |-- themes/
|   |-- content/
|   |   |-- categories/
|   |   `-- pages/
|   |-- plugins/
|   |   |-- tools/
|   |   `-- families/
|   |-- templates/
|   |-- search/
|   `-- static/
|-- automation/
|   |-- discovery/
|   |-- generation/
|   |-- evaluation/
|   `-- publishing/
|-- research/
|-- scripts/
|-- schemas/
|-- tests/
|-- dist/
`-- .github/workflows/
```

`automation/` ve `research/` V1'de yalnızca gelecekteki sınırları gösterecek; aktif ürün kapsamına dahil olmayacaktır.

`dist/` tamamen üretilmiş çıktıdır ve elle düzenlenmez.

## 4. Tool içerik modeli

Her tool plugin'i makine tarafından işlenen tanım ile editoryal içeriği ayrı tutar:

```text
src/plugins/tools/word-counter/
|-- tool.json
|-- content.md
|-- index.js
|-- style.css       # yalnızca gerekirse
|-- tests/          # tool'a özel test gerekirse
|-- fixtures/       # test verisi gerekirse
`-- assets/         # tool'a özel varlık gerekirse
```

### `tool.json`

Teknik ve katalog kimliğidir. Şu tür alanları taşır:

- Şema sürümü
- Değişmez tool kimliği
- Plugin sürümü
- Tür ve tool ailesi
- Slug
- Yayın durumu
- JavaScript entry point
- Ana kategori ve etiketler
- Gerekli ortak component'ler
- Offline, dosya, network ve worker yetenekleri
- Keşif ve sıralama işaretleri

### `content.md`

Kullanıcıya gösterilen ve SEO sayfasında yer alan editoryal içeriği taşır:

- Görünen başlık ve kısa açıklama
- SEO başlığı ve açıklaması
- Tanıtım
- Kullanım adımları
- Örnekler
- Özellikler
- Gizlilik açıklaması
- Sık sorulan sorular

Teknik bir alan iki dosyada tekrar edilmez. Slug gibi operasyonel bilgi JSON'da; uzun açıklama gibi editoryal bilgi Markdown'da bulunur.

Çoklu dil daha sonra `locales/<dil>.md` yapısıyla eklenebilir. V1 yalnızca seçilen varsayılan dili uygulayabilir; veri modeli genişlemeyi engellemez.

## 5. Plugin sistemi

Her tool bağımsız bir plugin'dir. Plugin'ler build sırasında keşfedilir; tarayıcıda yalnızca mevcut sayfanın modülü yüklenir.

Asgari plugin sözleşmesi:

```text
tool.json
content.md
index.js
```

Standart runtime sözleşmesi kavramsal olarak:

```js
export function mount(root, context) {}
export function unmount() {}
```

Tool, global servislere doğrudan bağlanmak yerine kontrollü bir context kullanır:

```text
context.components
context.events
context.storage
context.theme
context.locale
context.clipboard
context.downloads
```

V1 context'i yalnızca gerçekten gereken servislerle sınırlı tutulur. Gelecekteki varsayımsal servisler sırf mimaride adı geçtiği için uygulanmaz.

Desteklenen üst seviye plugin türleri genişletilebilir:

```text
tool
calculator
converter
generator
formatter
visualizer
game
reference
```

## 6. İlk tool ailesi

İlk tool ailesi ortak runtime, ortak UI kalıbı ve ortak test yaklaşımını paylaşan bir grup olacaktır.

Bir tool ailesi şunları sağlayabilir:

- Ortak hesaplama veya dönüştürme motoru
- Ortak form düzeni
- Ortak component bileşimi
- Ortak test sözleşmesi
- Yeni üye oluşturmak için template
- Aileye özel tanım şeması

İlk aile Text Tools olarak kesinleşmiştir. V1 başlangıç listesi Word Counter, Character Counter, Case Converter, Remove Duplicate Lines, Text Sorter ve Whitespace Cleaner'dır. İlk uçtan uca örnek Word Counter'dır; diğer plugin'ler bu çekirdek doğrulandıktan sonra eklenecektir.

Text Tools ailesi birincil metin girdisi, saf analiz veya dönüşüm fonksiyonu, ortak eylemler ve erişilebilir sonuç alanı paylaşır. Varyantlar `analyzer`, `transformer` ve ileride `line-transformer` olarak genişleyebilir.

## 7. Component Registry

Component Registry, tool'ların aynı form ve sonuç bileşenlerini tekrar üretmesini engeller.

Üç katman bulunur:

1. Primitive: button, input, textarea, select, dialog
2. Composite: file picker, result panel, editor toolbar
3. Pattern: converter layout, calculator form, formatter editor

Her component tanımı aşağıdaki sözleşmeye sahip olabilir:

```text
id
version
props schema
events
factory
styles
accessibility contract
theme tokens
```

Registry component'i oluşturur, props değerlerini doğrular, erişilebilirlik davranışını ve tema bağlantısını sağlar. Uygulama Standart DOM API, template ve event delegation kullanır. Custom Elements yalnızca somut bir yaşam döngüsü avantajı sağladığında tercih edilir.

V1'de yalnızca ilk tool ailesinin ihtiyaç duyduğu component'ler uygulanır. Katalog önceden gereksiz component'lerle doldurulmaz.

## 8. Theme Engine

Tema sistemi CSS custom properties üzerine kurulur.

Token katmanları:

1. Primitive token'lar: ham renk, boşluk, radius ve yazı boyutları
2. Semantic token'lar: surface, text, border, primary, danger
3. Component token'ları: button, input, result panel ve ad slot değerleri

Tool'a özel CSS sabit renk ve ortak tasarım değeri kullanmaz; semantik token tüketir.

V1 tema seçenekleri:

- Light
- Dark
- System

High contrast genişleme noktası korunur; V1 kapsamına alınması erişilebilirlik testleri sırasında ayrıca kararlaştırılır.

Tema önceliği:

1. Kullanıcının seçimi
2. Saklanan tercih
3. Sistem tercihi
4. Site varsayılanı

Theme Engine tema değişimini yayınlar. Canvas veya SVG tabanlı gelecekteki plugin'ler bu değişimi dinleyebilir.

## 9. Build sistemi

Build sistemi aşağıdaki kaynakları otomatik keşfeder:

```text
src/plugins/tools/*/tool.json
src/content/categories/*/category.json
```

Bir tool yalnızca şu koşullarda çıktıya dahil edilir:

- Manifest geçerli
- Slug benzersiz
- Kategori mevcut
- Gerekli dosyalar mevcut
- Yayın durumu `published`
- V1 doğrulama ve testleri başarılı

Build otomatik olarak şunları üretir:

- Ana sayfa
- Tool sayfaları
- Kategori sayfaları
- Arama indeksleri
- Sitemap
- Robots ve canonical bilgileri
- Breadcrumb ve structured data
- İlgili tool bağlantıları
- Statik asset çıktıları

Tool veya kategori eklenirken `index.html`, kategori HTML'i, arama indeksi veya sitemap elle değiştirilmez.

## 10. Arama

Arama indeksi build sırasında üretilir ve gerektiğinde tarayıcı tarafından yüklenir.

İndeks yalnızca gerekli alanları taşır:

```text
id
title
slug
short description
category
tags
aliases
ranking signals
```

V1 araması:

- Büyük/küçük harf normalizasyonu
- Başlık önceliği
- Prefix ve kelime eşleşmesi
- Kategori filtresi
- Klavye ile kullanım
- Erişilebilir sonuç duyuruları
- Sonuç bulunamadığında yönlendirme

Uzun Markdown içeriğinin tamamı arama payload'ına eklenmez.

## 11. SEO

Her önemli URL build sırasında gerçek statik HTML sayfasına dönüşür.

V1 SEO çıktıları:

- Benzersiz title
- Meta description
- Canonical URL
- Open Graph metadata
- Tek ve anlamlı H1
- Breadcrumb
- Uygun JSON-LD
- İlgili tool bağlantıları
- Sitemap
- Robots.txt
- 404 sayfası

Tool'un açıklayıcı içeriği JavaScript beklemeden HTML içinde bulunur. Etkileşimli tool alanı JavaScript ile başlatılır.

## 12. GitHub Actions ve deployment

V1 iki temel workflow kullanır:

### Validation

Push ve pull request sırasında:

- Veri ve manifest doğrulaması
- Testler
- Build denemesi
- Temel SEO kontrolleri
- Kırık iç bağlantı kontrolleri

### Deployment

Ana branch başarılı olduğunda:

- Temiz statik build
- Deployment artifact'i
- GitHub Pages yayını
- Temel deployment smoke kontrolü

GitHub Pages'e yalnızca üretilmiş statik çıktı gönderilir. Node.js veya build araçları runtime'ın parçası değildir.

## 13. Gelecekteki sistem sınırları

AI generation ve research otomasyonunun ileride çekirdeği bozmasını önlemek için bugünden aşağıdaki sınırlar tanımlanır:

- Üretim sistemi yeni bir plugin klasörü üretir; build internallerini doğrudan değiştirmez.
- AI önce yapılandırılmış tool spesifikasyonu üretir.
- Üretilen tool aynı plugin ve content sözleşmelerine uyar.
- Araştırma çıktısı yayınlanmış tool değil, aday kaydıdır.
- Otomatik üretilen içerik aynı validation akışından geçer.
- Otomasyon klasörleri V1 runtime paketine dahil edilmez.

Bu sınırlar V1'de çalışan AI sistemi gerektirmez; yalnızca gelecekte kırıcı mimari değişikliği önler.

## 14. Tek komut hedefi

V1 tamamlandığında yeni tool oluşturma deneyiminin hedefi:

```text
npm run tool:new
```

Komut:

1. Ad, slug, tür ve kategori bilgilerini alır.
2. Uygun tool family/template seçer.
3. Plugin klasörünü oluşturur.
4. `tool.json`, `content.md` ve `index.js` taslaklarını üretir.
5. Gerekli test iskeletini hazırlar.
6. Şema doğrulamasını çalıştırır.

Tool tamamlandıktan sonra tek kontrol komutu hedeflenir:

```text
npm run check
```

Ana sayfa, kategori ve SEO dosyaları bu süreçte elle değiştirilmez.

## 15. Kabul edilmiş temel kararlar

| Alan | Karar |
|---|---|
| Yayın modeli | Statik, çok sayfalı site |
| Browser runtime | HTML, CSS, Vanilla JavaScript |
| Build ortamı | Node.js tabanlı hafif özel üretici |
| Tool modeli | Build sırasında keşfedilen plugin |
| İçerik modeli | `tool.json` + `content.md` |
| Ortak UI | Sürümlü Component Registry |
| Tema | CSS custom properties tabanlı Theme Engine |
| Kod tekrarı | Tool family ve ortak component kalıpları |
| Ana sayfa | Tool ve kategori verilerinden otomatik |
| Kategoriler | Manifestlerden otomatik |
| Arama | Build sırasında oluşturulan kompakt indeks |
| SEO | Her önemli URL için statik HTML |
| Deployment | GitHub Actions üzerinden GitHub Pages |
| Yeni tool | Tek CLI komutu hedefi |
| AI ve research | Klasör ve sözleşme hazır, V1'de pasif |
