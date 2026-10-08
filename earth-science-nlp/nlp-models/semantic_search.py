from fastapi import FastAPI
from pydantic import BaseModel
import random
import time

app = FastAPI()

print("Iniciando Motor de Búsqueda Semántica (Indus-Retriever)...")

NASA_DOCS = [
    {
        "id": "NASA-001",
        "title": "Wildfire Scar Detection using Landsat in South America",
        "domain": "Earth Science",
        "year": 2023,
    },
    {
        "id": "NASA-002",
        "title": "Aerosol Optical Depth analysis in Urban Areas",
        "domain": "Atmosphere",
        "year": 2022,
    },
    {
        "id": "NASA-003",
        "title": "Glacier mass balance in the Andes Mountains",
        "domain": "Cryosphere",
        "year": 2024,
    },
    {
        "id": "NASA-004",
        "title": "Phytoplankton blooms dynamics in the South Atlantic Ocean",
        "domain": "Oceans",
        "year": 2023,
    },
    {
        "id": "NASA-005",
        "title": "Machine Learning for Space Weather Forecasting",
        "domain": "Heliophysics",
        "year": 2025,
    },
]


class Query(BaseModel):
    text: str


@app.post("/search")
def semantic_search(query: Query):
    time.sleep(0.8)

    # En un caso real:
    # 1. Pasaríamos `query.text` por el modelo nasa-smd-ibm-st-v2 para obtener un vector (embedding).
    # 2. Compararíamos ese vector matemáticamente (similitud del coseno) contra los vectores de nuestra BD.

    results = []
    for doc in NASA_DOCS:
        # Simulamos la puntuación de similitud semántica (entre 0.1 y 0.99)
        score = round(random.uniform(0.1, 0.99), 3)
        results.append({"document": doc, "similarity_score": score})

    # Ordenamos de mayor a menor similitud (los más relevantes primero)
    results.sort(key=lambda x: x["similarity_score"], reverse=True)

    return {
        "status": "success",
        "query_received": query.text,
        "model_used": "nasa-smd-ibm-st-v2 (Mock Embedding)",
        "results": results[:3],  # Devolvemos solo el Top 3
    }
