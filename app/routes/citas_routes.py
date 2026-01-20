# app/routes/citas_routes.py
from fastapi import APIRouter, status,Depends
from pydantic import BaseModel
from datetime import date, time
from app.control.citas_control import crear_cita_control
from app.config.security import get_current_user_token

router = APIRouter(
    prefix="/citas", 
    tags=["citas"],
    dependencies=[Depends(get_current_user_token)],  # ← protege TODO el router
)

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
