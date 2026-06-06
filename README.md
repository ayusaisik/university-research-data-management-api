# University Research Data Management API

Üniversite araştırma verilerini yönetmek için geliştirilen, başlangıç seviyesine uygun bir REST API projesidir.

## Teknoloji Yığını

- JavaScript
- Node.js
- Express.js
- PostgreSQL
- pg
- dotenv
- cors
- nodemon

## Kurulum

Proje dizininde bağımlılıkları yükleyin:

```bash
npm install
```

İsteğe bağlı olarak `.env.example` dosyasını `.env` adıyla kopyalayabilir ve uygulama portunu değiştirebilirsiniz.

## Geliştirme Modunda Çalıştırma

```bash
npm run dev
```

Uygulamayı normal modda çalıştırmak için:

```bash
npm start
```

Varsayılan olarak API `http://localhost:3000` adresinde çalışır.

## Health Check

API'nin çalıştığını kontrol etmek için:

```http
GET /api/health
```

Tam adres:

```text
http://localhost:3000/api/health
```

Beklenen yanıt:

```json
{
  "success": true,
  "message": "University Research Data Management API is running"
}
```
