# TrustLens

TrustLens adalah platform deteksi fraud transaksi keuangan berbasis AI untuk membantu institusi keuangan memantau transaksi, menganalisis relasi entitas, membuat peringatan risiko, dan mempercepat investigasi fraud.

Project ini dibuat untuk konteks hackathon Bank Indonesia dengan fokus pada alur MVP end-to-end: transaksi -> scoring -> alert -> label -> adaptive learning -> graph intelligence.

## Fitur Utama

- Deteksi fraud transaksi real-time.
- Risk-aware scoring berbasis rule, model tabular, dan sinyal risiko entitas.
- PaySim XGBoost untuk fraud scoring tabular.
- Model adaptif TrustLens dari label analyst.
- Prototype Elliptic GraphSAGE untuk eksperimen graph ML.
- Graph intelligence berbasis Neo4j.
- Cross-border intelligence untuk transaksi lintas negara.
- Labeling analyst untuk feedback loop model.
- Audit log untuk aktivitas penting.
- Dashboard Bahasa Indonesia.
- Light/dark mode.

## Arsitektur Singkat

```text
Browser
  -> Frontend Next.js
  -> Backend FastAPI
  -> PostgreSQL / Neo4j
  -> ML Scoring dan Model Artifacts
```

Komponen utama:

- `frontend/`: aplikasi Next.js App Router.
- `backend/`: API FastAPI, Alembic migration, seeding, dan pipeline ML.
- `postgres`: database utama transaksi, alert, label, user, dan audit log.
- `neo4j`: graph database untuk eksplorasi relasi.
- `docker-compose.yml`: orkestrasi service lokal.

## Menjalankan Dengan Docker

Prasyarat:

- Docker
- Docker Compose

Setup pertama:

```bash
cp .env.example .env
docker compose up --build
```

Akses aplikasi:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger/OpenAPI: http://localhost:8000/docs
- Neo4j Browser: http://localhost:7474

Backend container akan otomatis menunggu PostgreSQL dan Neo4j, menjalankan Alembic migration, menjalankan seed demo jika `AUTO_SEED=true`, lalu start Uvicorn.

## Akun Demo

Jika `AUTO_SEED=true`, seed demo membuat akun berikut:

- Admin: `valen@trustlens.dev` / `password123`
- Analyst: `analyst@trustlens.dev` / `password123`
- Operator: `operator@trustlens.dev` / `password123`

Credential ini hanya untuk demo lokal. Untuk production, buat akun baru dan ganti semua secret/password.

## Command Penting

```bash
docker compose up --build
docker compose down
docker compose down -v
docker compose logs -f backend
docker compose logs -f frontend
docker compose exec backend alembic upgrade head
docker compose exec backend python -m app.db.seeds.seed
docker compose exec backend python -m app.ml.training.train_paysim
docker compose exec backend python -m app.ml.training.train_trustlens
docker compose exec backend python -m app.ml.training.train_elliptic_graphsage
```

Gunakan `docker compose down -v` hanya jika ingin menghapus volume PostgreSQL, Neo4j, dan artifact model lokal.

## ML Training

Training juga bisa dipanggil lewat API:

```bash
curl -X POST "http://localhost:8000/api/v1/ml/train/paysim?model=xgboost&limit_rows=200000"
curl -X POST "http://localhost:8000/api/v1/ml/train/trustlens?min_samples=5"
curl -X POST "http://localhost:8000/api/v1/ml/train/elliptic-graphsage?limit_nodes=20000&epochs=5"
```

Dataset besar tidak disertakan di repository. Jika ingin training ulang dari dataset lokal, letakkan file pada path berikut:

- PaySim: `backend/data/raw/paysim/PS_20174392719_1491204439457_log.csv`
- Elliptic: `backend/data/raw/elliptic/elliptic_txs_classes.csv`
- Elliptic: `backend/data/raw/elliptic/elliptic_txs_edgelist.csv`
- Elliptic: `backend/data/raw/elliptic/elliptic_txs_features.csv`

Model artifact hasil training disimpan di `backend/app/ml/artifacts/` saat berjalan lokal, atau di volume `backend_ml_artifacts` saat berjalan via Docker. Artifact `.joblib`, `.pkl`, dan metrics tidak boleh di-commit.

## Demo Flow

1. Buka landing page di http://localhost:3000.
2. Login dengan akun demo atau register akun baru.
3. Buka Dasbor.
4. Buka Monitor AI untuk melihat status model.
5. Jalankan Simulasi transaksi.
6. Lihat Peringatan fraud yang dibuat.
7. Buka Eksplorasi Relasi untuk graph intelligence.
8. Beri Label pada transaksi/alert.
9. Cek Adaptive Learning setelah label tersedia.
10. Cek Log Audit.

Endpoint demo options untuk halaman simulasi:

```bash
curl http://localhost:8000/api/v1/transactions/demo/options
```

## Struktur Folder

```text
.
├── backend/
├── frontend/
├── docker-compose.yml
├── .env.example
└── README.md
```

## Environment

Gunakan `.env.example` sebagai template:

```bash
cp .env.example .env
```

Jangan gunakan nilai demo untuk production. Minimal ganti:

- `JWT_SECRET_KEY`
- `POSTGRES_PASSWORD`
- `NEO4J_PASSWORD`
- semua credential yang dipakai deployment

Frontend membaca API dari `NEXT_PUBLIC_API_URL` atau `NEXT_PUBLIC_API_BASE_URL`. Default Docker memakai `http://localhost:8000/api/v1` agar browser di host bisa mengakses backend.

## Catatan Keamanan

- Jangan commit `.env`, `.env.local`, dataset, atau model artifact.
- Jangan gunakan `.env.example` untuk production tanpa mengganti secret.
- Jangan commit file di `backend/data/`.
- Jangan commit file `.joblib`, `.pkl`, `.pt`, `.pth`, `.onnx`, atau `*_metrics.json`.
- Federated learning dan GraphSAGE pada MVP masih prototype/eksperimental.

Jika artifact sudah terlanjur tracked oleh Git, untrack tanpa menghapus file lokal:

```bash
git rm --cached <path>
```

## Troubleshooting

Port sudah dipakai:

- Ubah `HOST_FRONTEND_PORT`, `HOST_BACKEND_PORT`, `HOST_POSTGRES_PORT`, `HOST_NEO4J_HTTP_PORT`, atau `HOST_NEO4J_BOLT_PORT` di `.env`.

Database belum siap:

- Cek log: `docker compose logs -f postgres`
- Restart backend: `docker compose restart backend`

Migration gagal:

- Cek koneksi database dan log backend: `docker compose logs -f backend`
- Jalankan manual: `docker compose exec backend alembic upgrade head`

Frontend tidak bisa akses API:

- Pastikan backend berjalan di http://localhost:8000.
- Pastikan `.env` berisi `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`.
- Rebuild frontend setelah mengubah env publik: `docker compose up --build frontend`.

Model artifact belum tersedia:

- Endpoint scoring tetap memakai rule-based guard jika model belum ada.
- Jalankan training lewat API atau command Docker setelah dataset tersedia.

Dataset tidak ditemukan:

- Pastikan dataset lokal berada di `backend/data/raw/...`.
- Dataset besar sengaja tidak disertakan di repository.

Neo4j belum siap:

- Cek log: `docker compose logs -f neo4j`
- Pastikan password di `.env` sama dengan volume Neo4j yang sedang dipakai. Jika mengganti password setelah volume dibuat, hapus volume dengan `docker compose down -v`.

## Status MVP

MVP ini memvalidasi workflow end-to-end:

```text
transaksi -> scoring -> alert -> label -> adaptive learning -> graph intelligence
```

Fokus project adalah demo fungsional dan eksperimen AI yang bisa dijalankan lokal dengan Docker Compose.
