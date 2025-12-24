# app/control/pacientes_control.py
from app.database import pacientes_repo

def upsert_paciente_desde_cita(body) -> int:
    """
    Recibe el body de la cita y devuelve paciente_id.
    """
    paciente = pacientes_repo.obtener_paciente_por_doc(
        body.tipo_identificacion, body.numero_identificacion
    )

    if paciente:
        paciente_id = paciente[0]
        pacientes_repo.actualizar_paciente(
            paciente_id,
            {
                "telefono_fijo": body.telefono_fijo,
                "telefono_celular": body.telefono_celular,
                "direccion": body.direccion,
                "correo_electronico": body.correo_electronico,
                "lugar_residencia": body.lugar_residencia,
                "fecha_nacimiento": body.fecha_nacimiento,
            },
        )
    else:
        paciente_id = pacientes_repo.insertar_paciente(
            {
                "tipo_identificacion": body.tipo_identificacion,
                "numero_identificacion": body.numero_identificacion,
                "nombre_paciente": body.nombre_paciente,
                "telefono_fijo": body.telefono_fijo,
                "telefono_celular": body.telefono_celular,
                "direccion": body.direccion,
                "correo_electronico": body.correo_electronico,
                "lugar_residencia": body.lugar_residencia,
                "fecha_nacimiento": body.fecha_nacimiento,
            }
        )

    return paciente_id

def crear_paciente(body) -> int:
    return pacientes_repo.insertar_paciente(
        {
            "tipo_identificacion": body.tipo_identificacion,
            "numero_identificacion": body.numero_identificacion,
            "nombre_paciente": body.nombre_paciente,
            "telefono_fijo": body.telefono_fijo,
            "telefono_celular": body.telefono_celular,
            "direccion": body.direccion,
            "correo_electronico": body.correo_electronico,
            "lugar_residencia": body.lugar_residencia,
            "fecha_nacimiento": body.fecha_nacimiento,
        }
    )


def obtener_paciente(tipo_identificacion: str, numero_identificacion: str):
    row = pacientes_repo.obtener_paciente_por_doc(
        tipo_identificacion, numero_identificacion
    )
    if not row:
        return None

    # adapta índices/columnas según tu SELECT real en repo
    return {
        "id": row[0],
        "tipo_identificacion": row[1],
        "numero_identificacion": row[2],
        "nombre_completo": row[3],
        "telefono_fijo": row[4],
        "telefono_celular": row[5],
        "direccion": row[6],
        "correo_electronico": row[7],
        "lugar_residencia": row[8],
        "fecha_nacimiento": row[9],
    }