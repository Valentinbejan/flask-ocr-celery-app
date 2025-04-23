# app/tasks.py
import os
import pytesseract
from PIL import Image
from .celery_utils import celery

@celery.task()
def perform_ocr(image_path):
    try:
        text = pytesseract.image_to_string(Image.open(image_path))
        os.remove(image_path)  # Clean up the temporary file

        # Check if extracted text is empty
        if not text.strip():
            return "No text found in the image."
        else:
            return text
    except Exception as e:
        return str(e)