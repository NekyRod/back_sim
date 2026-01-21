# app/routes/citas_routes.py

from fastapi import APIRouter, status, Depends
from pydantic import BaseModel
from datetime import date, time
from typing import Optional
from app.control.citas_control import crear_cita_control
from app.config.security import get_current_user_token

router = APIRouter(
    prefix="/citas",
    tags=["citas"],
    dependencies=[Depends(get_current_user_token)],
)

class CitaRequest(BaseModel):
    tipo_identificacion: str
    numero_identificacion: str
    nombre_paciente: str
    telefono_fijo: Optional[str] = None
    telefono_celular: Optional[str] = None
    segundo_telefono_celular: Optional[str] = None  # ← NUEVO
    titular_segundo_celular: Optional[str] = None  # ← NUEVO
    direccion: Optional[str] = None
    correo_electronico: Optional[str] = None
    lugar_residencia: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    tipo_doc_acompanante: Optional[str] = None  # ← NUEVO
    nombre_acompanante: Optional[str] = None  # ← NUEVO
    parentesco_acompanante: Optional[str] = None  # ← NUEVO
    profesional_id: int
    fecha_programacion: date
    fecha_solicitada: date
    hora: time
    tipo_servicio: str
    tipo_pbs: Optional[str] = None
    mas_6_meses: bool = False
    motivo_cita: Optional[str] = None
    observacion: Optional[str] = None

@router.post("/", status_code=status.HTTP_201_CREATED)
def crear_cita(body: CitaRequest):
    return crear_cita_control(body)
