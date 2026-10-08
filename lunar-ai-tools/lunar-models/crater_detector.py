# lunar-ai-tools/lunar-models/crater_detector.py
import torch
from fastapi import FastAPI, UploadFile, File
from PIL import Image
import io
import time
import random

app = FastAPI()

MODELO_CARGADO = False

print("Iniciando servidor de inferencia Lunar...")

try:
    from transformers import AutoModel

    model_id = "nasa-ibm-ai4science/Crater-Detection-NASA-IBM-Lunar-Foundation-Model"
    print(f"Intentando cargar {model_id}...")
    model = AutoModel.from_pretrained(model_id, trust_remote_code=True)
    model.eval()
    MODELO_CARGADO = True
    print("¡Modelo cargado exitosamente!")
except Exception as e:
    print(f"Error cargando el modelo real: {e}")
    print("INICIANDO EN MODO MOCK (Simulación de inferencia para desarrollo de API)")
    MODELO_CARGADO = False


@app.post("/predict-craters")
async def predict_craters(file: UploadFile = File(...)):
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data))
    width, height = image.size

    print(f"Imagen recibida: {width}x{height} - {file.content_type}")

    time.sleep(1.5)

    if MODELO_CARGADO:
        # Aquí iría la inferencia real
        pass

    num_craters = random.randint(3, 8)
    boxes = []

    min_x, max_x = int(width * 0.2), int(width * 0.8)
    min_y, max_y = int(height * 0.2), int(height * 0.8)

    for _ in range(num_craters):
        x1 = random.randint(min_x, max_x - 100)
        y1 = random.randint(min_y, max_y - 100)
        x2 = x1 + random.randint(20, 80)
        y2 = y1 + random.randint(20, 80)
        boxes.append([x1, y1, min(x2, width), min(y2, height)])

    return {
        "status": "success",
        "mock_mode": not MODELO_CARGADO,
        "image_size": f"{width}x{height}",
        "craters_detected": num_craters,
        "bounding_boxes": boxes,
    }
