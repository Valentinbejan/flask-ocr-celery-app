# Aplicație OCR cu Flask, Celery și Docker

Aceasta este o aplicație web simplă care permite utilizatorilor să încarce imagini. Aplicația efectuează Recunoașterea Optică a Caracterelor (OCR) folosind Tesseract pentru a extrage textul din imagini. Procesarea OCR se realizează în fundal folosind Celery (cu Redis ca broker) pentru a menține interfața web responsivă. Întreaga aplicație este containerizată folosind Docker și Docker Compose pentru o configurare și rulare ușoară.

## Caracteristici

*   Încărcarea uneia sau mai multor imagini simultan.
*   Afișarea previzualizărilor pentru imaginile selectate.
*   Procesare OCR asincronă în fundal cu Celery.
*   Afișarea textului extras pentru fiecare imagine procesată.
*   Buton "Copy" pentru copierea ușoară a textului extras.
*   Utilizează Redis ca message broker și result backend pentru Celery.
*   Containerizată cu Docker și Docker Compose.

## Tehnologii Utilizate

*   **Backend:** Flask (Python)
*   **Task Queue:** Celery
*   **Broker / Result Backend:** Redis
*   **Motor OCR:** Tesseract (prin biblioteca `pytesseract`)
*   **Procesare Imagini:** Pillow
*   **Frontend:** HTML, CSS, JavaScript
*   **Containerizare:** Docker, Docker Compose

## Prerechizite

*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/) (de obicei inclus cu Docker Desktop)

## Cum se rulează aplicația

1.  **Clonează repository-ul:**
    ```bash
    git clone https://github.com/Valentinbejan/flask-ocr-celery-app.git
    ```
2.  **Navighează în directorul proiectului:**
    ```bash
    cd flask-ocr-celery-app
    ```
3.  **Construiește și pornește serviciile folosind Docker Compose:**
    ```bash
    docker-compose up --build
    ```
    *(Opțiunea `--build` este recomandată la prima rulare sau după modificări la `Dockerfile` sau `requirements.txt`)*

4.  **Accesează aplicația:** Deschide browserul web și navighează la `http://localhost:5000`.

## Cum se oprește aplicația

*   Apasă `Ctrl + C` în terminalul unde rulează `docker-compose up`.
*   Dacă ai rulat în modul detached (`-d`), folosește comanda: `docker-compose down`