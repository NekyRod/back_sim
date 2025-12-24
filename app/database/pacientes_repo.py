# app/database/pacientes_repo.py
from app.database.connection import get_db_connection

def obtener_paciente_por_doc(tipo_identificacion: str, numero_identificacion: str):
    conn = get_db_connection()
    try:
        with conn, conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, tipo_identificacion, numero_identificacion
                FROM pacientes
                WHERE tipo_identificacion = %s
                  AND numero_identificacion = %s;
                """,
                (tipo_identificacion, numero_identificacion),
            )
            return cur.fetchone()
    finally:
        conn.close()


def actualizar_paciente(paciente_id: int, data: dict):
    conn = get_db_connection()
    try:
        with conn, conn.cursor() as cur:
            cur.execute(
                """
                UPDATE pacientes
                SET telefono_fijo = %s,
                    telefono_celular = %s,
                    direccion = %s,
                    correo_electronico = %s,
                    lugar_residencia = %s,
                    fecha_nacimiento = %s
                WHERE id = %s;
                """,
                (
                    data["telefono_fijo"],
                    data["telefono_celular"],
                    data["direccion"],
                    data["correo_electronico"],
                    data["lugar_residencia"],
                    data["fecha_nacimiento"],
                    paciente_id,
                ),
            )
    finally:
        conn.close()


def insertar_paciente(data: dict) -> int:
    conn = get_db_connection()
    try:
        with conn, conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO pacientes (
                  tipo_identificacion, numero_identificacion, nombre_completo,
                  telefono_fijo, telefono_celular, direccion,
                  correo_electronico, lugar_residencia, fecha_nacimiento
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
                RETURNING id;
                """,
                (
                    data["tipo_identificacion"],
                    data["numero_identificacion"],
                    data["nombre_paciente"],
                    data["telefono_fijo"],
                    data["telefono_celular"],
                    data["direccion"],
                    data["correo_electronico"],
                    data["lugar_residencia"],
                    data["fecha_nacimiento"],
                ),
            )
            return cur.fetchone()[0]
    finally:
        conn.close()
