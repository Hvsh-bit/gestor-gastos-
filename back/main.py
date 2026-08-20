import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select

load_dotenv(Path(__file__).with_name(".env"))

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

class Transaccion(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    tipo: str
    monto: float
    categoria: str
    descripcion: str

DATABASE_URL = os.environ["DATABASE_URL"]

engine = create_engine(DATABASE_URL)

def crear_db_y_tablas():
    SQLModel.metadata.create_all(engine)

crear_db_y_tablas()

@app.get("/")
def inicio():
    return {"mensaje": "Backend del gestor funcionando"}

@app.get("/transacciones")
def obtener_transacciones():
    with Session(engine) as session:
        transacciones = session.exec(
            select(Transaccion)
        ).all()

        return transacciones

@app.post("/transacciones")
def crear_transaccion(transaccion: Transaccion):
    with Session(engine) as session:
        session.add(transaccion)
        session.commit()
        session.refresh(transaccion)

        return transaccion

@app.put("/transacciones/{transaccion_id}")
def actualizar_transaccion(
    transaccion_id: int,
    transaccion: Transaccion
):
    with Session(engine) as session:

        transaccion_guardada = session.get(
            Transaccion,
            transaccion_id
        )

        if transaccion_guardada is None:
            raise HTTPException(
                status_code=404,
                detail="Transaccion no encontrada"
            )

        transaccion_guardada.tipo = transaccion.tipo
        transaccion_guardada.monto = transaccion.monto
        transaccion_guardada.categoria = transaccion.categoria
        transaccion_guardada.descripcion = transaccion.descripcion

        session.add(transaccion_guardada)
        session.commit()
        session.refresh(transaccion_guardada)

        return transaccion_guardada

@app.delete("/transacciones/{transaccion_id}")
def eliminar_transaccion(transaccion_id: int):
    with Session(engine) as session:

        transaccion = session.get(
            Transaccion,
            transaccion_id
        )

        if transaccion is None:
            raise HTTPException(
                status_code=404,
                detail="Transaccion no encontrada"
            )

        session.delete(transaccion)
        session.commit()

        return {
            "mensaje": "Transaccion eliminada correctamente"
        }


