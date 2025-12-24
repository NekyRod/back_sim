# app/routes/pacientes_routes.py
from fastapi import APIRouter, status
from pydantic import BaseModel
from datetime import date
from app.control import pacientes_control

router = APIRouter(prefix="/pacientes", tags=["pacientes"])


class PacienteCreate(BaseModel):
    tipo_identificacion: str
    numero_identificacion: str
    nombre_paciente: str
    telefono_fijo: str | None = None
    telefono_celular: str | None = None
    direccion: str | None = None
    correo_electronico: str
    lugar_residencia: str | None = None
    fecha_nacimiento: date | None = None


class PacienteResponse(BaseModel):
    id: int
    tipo_identificacion: str
    numero_identificacion: str
    nombre_completo: str
    telefono_fijo: str | None
    telefono_celular: str | None
    direccion: str | None
    correo_electronico: str
    lugar_residencia: str | None
    fecha_nacimiento: date | None


@router.post("/", status_code=status.HTTP_201_CREATED)
def crear_paciente(body: PacienteCreate):
    """
    Crear paciente manualmente (no desde cita).
    """
    paciente_id = pacientes_control.crear_paciente(body)
    return {"id": paciente_id}


@router.get("/{tipo_identificacion}/{numero_identificacion}",
            response_model=PacienteResponse | None)
def obtener_paciente(tipo_identificacion: str, numero_identificacion: str):
    """
    Consultar paciente por tipo y número de identificación.
    """
    return pacientes_control.obtener_paciente(tipo_identificacion, numero_identificacion)
