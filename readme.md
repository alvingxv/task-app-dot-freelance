## Instalasi
1. Clone repository
2. Buka folder repository dalam terminal
```
# Contoh perintah di Linux
cd dot-test-todo
code . # Membuka di vscode
```
3. Install node modules
```
npm install
```
4. Sesuaikan nilai variable pada .env
```
DATABASE_NAME = task_manager_dot
DATABASE_USERNAME = root
DATABASE_PASSWORD = 
DATABASE_HOST = localhost
PORT = 5050
SECRET_KEY = Hyem8kYLK6nHeyOoM58xjbHci1LmvogSVPGDJW5SQ399QaOicFUx6W3WwghhAK7iGMu3RvpDQdFr0UAJsAfrldGJwOsOJOdcNYjk
```
5. Buat db pada localhost/phpmyadmin dengan nama task_manager_dot
6. jalankan perintah dibawah untuk melakukan database migration dan menjalankan server
```
npm run dev
```

## Dokumentasi API
https://documenter.getpostman.com/view/23570053/2s84LLytXo


## Pattern Project
Disini project structure yang saya gunakan yaitu dengan membagi kode sesuai entitas yang ada, hal ini terinspirasi dari folder structure dari NestJS dan juga karena dengan folder structure seperti ini, project akan lebih mudah dimaintain dan scalable. contohnya sebagai berikut:
```
-Task
    -task.controller.js
    -task.model.js
    -task.router.js
```
Lalu untuk middleware dan helper saya juga pisah menjadi folder terpisah