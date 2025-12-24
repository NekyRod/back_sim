# app/control/citas_control.py
from fastapi import HTTPException
#from .schemas import CitaRequest  # opcional
from app.control.pacientes_control import upsert_paciente_desde_cita
from app.database import citas_repo

def crear_cita_control(body) -> dict:
    # 1. Upsert paciente
    paciente_id = upsert_paciente_desde_cita(body)

    # 2. Validar cita duplicada
    existente = citas_repo.existe_cita(
        paciente_id,
        body.profesional_id,
        body.fecha_programacion,
        body.fecha_solicitada,
        body.hora,
    )
    if existente:
        fecha_prog = existente[1]
        hora_prog = existente[2]
        detalle = (
            f"Ya existe una cita para este paciente en la fecha y hora: "
            f"{fecha_prog} {hora_prog}"
        )
        raise HTTPException(status_code=400, detail=detalle)

    # 3. Insertar cita
    cita_id = citas_repo.insertar_cita(
        {
            "paciente_id": paciente_id,
            "profesional_id": body.profesional_id,
            "fecha_programacion": body.fecha_programacion,
            "fecha_solicitada": body.fecha_solicitada,
            "hora": body.hora,
            "tipo_servicio": body.tipo_servicio,
            "mas_6_meses": body.mas_6_meses,
            "observacion": body.observacion,
        }
    )

    return {"cita_id": cita_id, "paciente_id": paciente_id}
