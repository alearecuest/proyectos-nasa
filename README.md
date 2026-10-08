# 🚀 Proyectos NASA - Portfolio

Este repositorio centraliza una serie de proyectos Full-Stack e Inteligencia Artificial, desarrollados utilizando modelos fundacionales, APIs y datos abiertos de la NASA y Hugging Face.

El objetivo de este repositorio es demostrar la integración end-to-end de modelos de Machine Learning avanzados (Vision Transformers, NLP, Análisis Geoespacial) en arquitecturas web modernas y escalables.

---

## Área 1: Lunar AI Tools

Esta sección se enfoca en la exploración y análisis de la superficie lunar mediante visión por computadora, consumiendo el **NASA-IBM Lunar Foundation Model**.

### Arquitectura de Microservicios Implementada

El proyecto se dividió en tres componentes principales, comunicados a través de HTTP:

1.  **Microservicio de Inferencia (Python / FastAPI):** 
    *   **Directorio:** `lunar-ai-tools/lunar-models`
    *   **Responsabilidad:** Carga los pesos del modelo `Crater-Detection-NASA-IBM-Lunar-Foundation-Model` (o ejecuta un *Mock Mode* resiliente en caso de fallos de arquitectura local). Recibe imágenes en formato multipart y devuelve las *bounding boxes* de los cráteres detectados.
    *   **Tecnologías:** Python, FastAPI, PyTorch, Hugging Face Hub.

2.  **API Gateway (Node.js / Fastify):**
    *   **Directorio:** `lunar-ai-tools/lunar-api`
    *   **Responsabilidad:** Actúa como el orquestador backend. Recibe las imágenes del cliente, ajusta los límites de subida (configurado a 20MB para imágenes satelitales de alta resolución), maneja el CORS y redirige la carga al microservicio de Python usando `axios`.
    *   **Tecnologías:** Node.js, Fastify, `@fastify/multipart`, `@fastify/cors`.

3.  **Dashboard Visual (React / Vite):**
    *   **Directorio:** `lunar-ai-tools/lunar-frontend`
    *   **Responsabilidad:** Proporciona una interfaz de usuario interactiva (UI). Permite cargar imágenes lunares y utiliza la API Canvas de HTML5 para dibujar la imagen original y superponer dinámicamente los recuadros rojos (`bounding_boxes`) de los cráteres devueltos por el modelo.
    *   **Tecnologías:** React, Vite, JavaScript, HTML5 Canvas.

### Estado Actual del Proyecto
End-to-end completado. La imagen fluye desde el cliente React, atraviesa Fastify, es procesada por Python, y el resultado matemático se renderiza visualmente en el navegador.

---

## Área 2: Space Weather & Heliophysics

Esta sección simula la predicción de eventos climáticos espaciales (llamaradas solares) procesando flujos de datos en tiempo real inspirados en el modelo **Surya Heliophysics** y datos del Solar Dynamics Observatory.

### Arquitectura de Datos en Tiempo Real Implementada

1.  **Motor de Predicción (Python / FastAPI):** 
    *   **Directorio:** `solar-weather-forecaster/solar-models`
    *   **Responsabilidad:** Emula la inferencia de series temporales, generando métricas continuas de velocidad de viento solar y cálculo de probabilidad de llamaradas (Flare Risk).
    *   **Tecnologías:** Python, FastAPI, Uvicorn.
2.  **API Orquestadora (Node.js / Fastify):**
    *   **Directorio:** `solar-weather-forecaster/solar-api`
    *   **Responsabilidad:** Implementa un sistema de *polling* automático (vía `node-cron`) para ingerir los datos del modelo de IA cada 5 segundos, manteniendo un historial en memoria y sirviéndolo al cliente.
    *   **Tecnologías:** Node.js, Fastify, Axios, Node-cron.
3.  **Dashboard Analítico (React / Vite):**
    *   **Directorio:** `solar-weather-forecaster/solar-dashboard`
    *   **Responsabilidad:** Panel de control interactivo que consume la API y visualiza el historial de telemetría en tiempo real mediante gráficos dinámicos y alertas condicionales.
    *   **Tecnologías:** React, Vite, Recharts.

### Estado Actual del Proyecto
End-to-end completado. Flujo de datos continuo y visualización analítica en tiempo real operativa.

## Área 3: Earth Science NLP (Próximamente)
*   **Modelos a utilizar:** Indus-Retriever (`nasa-smd-ibm-st-v2`), `ibm-nasa-geospatial`.
*   **Objetivo:** Construir un motor de búsqueda semántica de documentos científicos de la NASA y APIs de clasificación de observación terrestre (ej. cicatrices de incendios).

---
*Desarrollado por Alejandro Arévalo*