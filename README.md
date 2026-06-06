# University Research Data Management API

## Proje Hakkında

University Research Data Management API; üniversite bölümlerini, araştırmacıları ve araştırma projelerini yönetmek için geliştirilmiş bir REST API projesidir.

Proje, ilişkisel PostgreSQL veritabanı tasarımı ile Node.js ve Express.js tabanlı backend geliştirme prensiplerini bir araya getirir. Bölüm, araştırmacı ve proje verileri arasında ilişkiler kurar; SQL JOIN ve aggregate sorguları kullanarak detaylı kayıtlar ve analitik sonuçlar sunar.

Bu çalışma, yazılım mühendisliği staj başvurularında sunulabilecek sade, anlaşılır ve geliştirilebilir bir backend projesi olarak hazırlanmıştır.

## Teknoloji Yığını

- JavaScript
- Node.js
- Express.js
- PostgreSQL
- `pg`
- `dotenv`
- `cors`
- `nodemon`

## Özellikler

- Bölüm listeleme, detay görüntüleme ve oluşturma
- Araştırmacı listeleme, detay görüntüleme ve oluşturma
- Proje listeleme, detay görüntüleme ve oluşturma
- PostgreSQL ilişkisel veritabanı şeması
- Primary key ve foreign key ilişkileri
- İlişkili verileri döndüren SQL JOIN sorguları
- Proje sayısı, bütçe ve aktif proje analizleri
- Parametreli sorgular ile güvenli veritabanı işlemleri
- Ortam değişkenleriyle veritabanı yapılandırması
- Katmanlara ayrılmış route, controller ve veritabanı bağlantı yapısı

## Veritabanı Şeması

### `departments`

Üniversitedeki bölümlerin adını, açıklamasını ve oluşturulma zamanını saklar.

### `researchers`

Araştırmacıların adını, soyadını, benzersiz e-posta adresini ve bağlı oldukları bölümü saklar.

### `projects`

Araştırma projelerinin başlığını, açıklamasını, sorumlu araştırmacısını, durumunu, bütçesini ve tarihlerini saklar.

### İlişkiler

- Bir bölümün birden fazla araştırmacısı olabilir.
- Her araştırmacı bir bölüme bağlıdır.
- Bir araştırmacının birden fazla projesi olabilir.
- Her proje bir araştırmacıya bağlıdır.

```text
departments (1) ──── (*) researchers (1) ──── (*) projects
```

Bu ilişkiler şu foreign key alanlarıyla kurulur:

- `researchers.department_id` → `departments.id`
- `projects.researcher_id` → `researchers.id`

## API Endpoint'leri

Varsayılan temel adres:

```text
http://localhost:3000
```

### Health Check

| Metot | Endpoint | Açıklama |
| --- | --- | --- |
| GET | `/api/health` | API durumunu kontrol eder |
| GET | `/api/health/db` | PostgreSQL bağlantısını kontrol eder |

### Departments

| Metot | Endpoint | Açıklama |
| --- | --- | --- |
| GET | `/api/departments` | Tüm bölümleri listeler |
| GET | `/api/departments/:id` | ID değerine göre bir bölüm getirir |
| POST | `/api/departments` | Yeni bir bölüm oluşturur |

### Researchers

| Metot | Endpoint | Açıklama |
| --- | --- | --- |
| GET | `/api/researchers` | Araştırmacıları bölüm adlarıyla listeler |
| GET | `/api/researchers/:id` | ID değerine göre bir araştırmacı getirir |
| POST | `/api/researchers` | Yeni bir araştırmacı oluşturur |

### Projects

| Metot | Endpoint | Açıklama |
| --- | --- | --- |
| GET | `/api/projects` | Projeleri araştırmacı ve bölüm bilgileriyle listeler |
| GET | `/api/projects/:id` | ID değerine göre bir proje getirir |
| POST | `/api/projects` | Yeni bir proje oluşturur |

### Analytics

| Metot | Endpoint | Açıklama |
| --- | --- | --- |
| GET | `/api/analytics/project-count-by-department` | Bölümlere göre proje sayılarını getirir |
| GET | `/api/analytics/total-budget-by-department` | Bölümlere göre toplam proje bütçelerini getirir |
| GET | `/api/analytics/project-count-by-researcher` | Araştırmacılara göre proje sayılarını getirir |
| GET | `/api/analytics/active-projects` | Aktif projeleri listeler |
| GET | `/api/analytics/projects-above-budget?minBudget=150000` | Belirtilen bütçenin üzerindeki projeleri listeler |

## Ortam Değişkenleri

Uygulama yapılandırması ve veritabanı bilgileri `.env` dosyasında tutulur. Bu dosya parola gibi hassas bilgiler içerdiği için Git deposuna eklenmemelidir.

`.env.example`, gerekli değişkenleri gerçek parola içermeden gösteren örnek yapılandırma dosyasıdır. Bu dosyayı `.env` adıyla oluşturup kendi PostgreSQL bilgilerinizi girin:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=university_research_db
DB_USER=postgres
DB_PASSWORD=your_postgresql_password
```

`DB_PASSWORD` değerini kendi PostgreSQL parolanızla değiştirin.

## Veritabanı Kurulumu

PostgreSQL sunucusunun çalıştığından emin olun ve veritabanını oluşturun:

```sql
CREATE DATABASE university_research_db;
```

Ardından `src/db/sql` dizinindeki dosyaları aşağıdaki sırayla çalıştırın:

1. `001_create_departments.sql`
2. `002_create_researchers.sql`
3. `003_create_projects.sql`
4. `004_seed_data.sql`

`psql` kullanıyorsanız:

```bash
psql -U postgres -d university_research_db -f src/db/sql/001_create_departments.sql
psql -U postgres -d university_research_db -f src/db/sql/002_create_researchers.sql
psql -U postgres -d university_research_db -f src/db/sql/003_create_projects.sql
psql -U postgres -d university_research_db -f src/db/sql/004_seed_data.sql
```

İlk üç dosya tabloları ve ilişkileri oluşturur. Dördüncü dosya örnek bölüm, araştırmacı ve proje kayıtlarını ekler.

## Projeyi Çalıştırma

1. Proje dizinine gidin:

```bash
cd university-research-data-management-api
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. `.env.example` dosyasını temel alarak `.env` dosyanızı hazırlayın.

4. PostgreSQL sunucusunun çalıştığını kontrol edin.

5. Uygulamayı geliştirme modunda başlatın:

```bash
npm run dev
```

Normal çalışma modu için:

```bash
npm start
```

API varsayılan olarak `http://localhost:3000` adresinde çalışır.

## Örnek Proje Oluşturma İsteği

Endpoint:

```http
POST /api/projects
Content-Type: application/json
```

Request body:

```json
{
  "title": "AI Supported Research Assistant",
  "description": "Developing an AI assistant for academic research data analysis.",
  "researcher_id": 1,
  "status": "active",
  "budget": 175000,
  "start_date": "2026-09-01",
  "end_date": "2027-09-01"
}
```

`researcher_id` değerinin veritabanında bulunan bir araştırmacıya ait olması gerekir.