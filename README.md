## 🚀 Services Status

The following services are **currently running in the background**:

| Service  | URL                                            |
| -------- | ---------------------------------------------- |
| Frontend | [http://localhost:3000](http://localhost:3000) |
| Backend  | [http://localhost:3001](http://localhost:3001) |

---

## ▶️ Run Services Manually

### 🔧 Backend

```bash
cd backend
npm install
npm run dev
```

---

### 🎨 Frontend

```bash
cd frontend
npm install --cache /tmp/npm-cache
npm run dev
```

---

## 📌 Notes

* Ensure **Node.js** is installed (recommended: LTS version).
* Frontend depends on the backend being available at `http://localhost:3001`.
* Ports can be changed via environment variables if needed.
