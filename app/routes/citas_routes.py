# app/routes/citas_routes.py
from fastapi import APIRouter, status
from pydantic import BaseModel
from datetime import date, time
from app.control.citas_control import crear_cita_control

router = APIRouter(prefix="/citas", tags=["citas"])

class CitaRequest(BaseModel):
    tipo_identificacion: str
    numero_identificacion: str
    nombre_paciente: str
    telefono_fijo: str | None = None
    telefono_celular: str | None = None
    direccion: str | None = None
    correo_electronico: str | None = None
    lugar_residencia: str | None = None
    fecha_nacimiento: date | None = None

    profesional_id: int
    fecha_programacion: date
    fecha_solicitada: date
    hora: time
    tipo_servicio: str
    mas_6_meses: bool = False
    observacion: str | None = None

@router.post("/", status_code=status.HTTP_201_CREATED)
def crear_cita(body: CitaRequest):
    return crear_cita_control(body)
