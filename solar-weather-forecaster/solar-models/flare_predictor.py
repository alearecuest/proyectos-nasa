from fastapi import FastAPI
import random
import datetime

app = FastAPI()

print("Iniciando Motor de Predicción Heliocéntrica (Surya Model)...")


@app.get("/forecast/solar-flare")
def get_flare_forecast():
    # Simulamos el procesamiento de datos tabulares del dataset surya-bench-flare-forecasting
    # En un escenario de producción, aquí se cargan los pesos del modelo de Hugging Face
    # para predecir sobre datos en vivo del Solar Dynamics Observatory (SDO).

    risk_probability = round(random.uniform(5.0, 95.0), 2)
    wind_speed = random.randint(350, 750)  # km/s

    status = "NORMAL"
    if risk_probability > 75:
        status = "ALERTA_CRITICA"
    elif risk_probability > 50:
        status = "ADVERTENCIA"

    return {
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "model_source": "NASA/IBM Surya Heliophysics",
        "metrics": {
            "solar_wind_speed_km_s": wind_speed,
            "flare_risk_probability": risk_probability,
            "status": status,
        },
    }
