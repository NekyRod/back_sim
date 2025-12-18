from fastapi import APIRouter, Depends
from app.control.pacientes_control import PacientesControl
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/pacientes", tags=["pacientes"])

@router.post("/", dependencies=[Depends(get_current_user)])
def crear_paciente(payload: dict):
    return PacientesControl.crear_paciente(payload)

@router.get("/documento/{numero_identificacion}", dependencies=[Depends(get_current_user)])
def obtener_paciente(numero_identificacion: str):
    paciente = PacientesControl.obtener_por_documento(numero_identificacion)
    if not paciente:
        return {"found": False}
    return {"found": True, "paciente": paciente}
