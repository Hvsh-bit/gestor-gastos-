from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origenes = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origenes,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Transaccion(BaseModel):
    tipo: str
    monto: float
    categoria: str
    descripcion: str

transacciones = []

@app.get("/")
def inicio():
    return {"mensaje": "Backend del gestor funcionando"}


@app.get("/transacciones")
def obtener_transacciones():
    return transacciones


@app.post("/transacciones")
def crear_transaccion(transaccion: Transaccion):
    nueva_transaccion = {
        "id": len(transacciones) + 1,
        "tipo": transaccion.tipo,
        "monto": transaccion.monto,
        "categoria": transaccion.categoria,
        "descripcion": transaccion.descripcion
    }

    transacciones.append(nueva_transaccion)

    return nueva_transaccion

@app.put("/transacciones/{transaccion_id}")
def actualizar_transaccion(transaccion_id: int, transaccion: Transaccion):

    for indice, transaccion_guardada in enumerate(transacciones):

        if transaccion_guardada["id"] == transaccion_id:

            transaccion_actualizada = {
                "id": transaccion_id,
                "tipo": transaccion.tipo,
                "monto": transaccion.monto,
                "categoria": transaccion.categoria,
                "descripcion": transaccion.descripcion
            }

            transacciones[indice] = transaccion_actualizada

            return transaccion_actualizada

    return {"error": "Transaccion no encontrada"}

@app.delete("/transacciones/{transaccion_id}")
def eliminar_transaccion(transaccion_id: int):

    for indice, transaccion in enumerate(transacciones):

        if transaccion["id"] == transaccion_id:
            transaccion_eliminada = transacciones.pop(indice)

            return transaccion_eliminada

    return {"error": "Transaccion no encontrada"}