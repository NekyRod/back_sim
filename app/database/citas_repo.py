# app/database/citas_repo.py
from datetime import date, time
from app.database.connection import get_db_connection

def existe_cita(paciente_id: int, profesional_id: int,
                fecha_programacion: date, fecha_solicitada: date,
                hora: time):
    conn = get_db_connection()
    try:
        with conn, conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, fecha_programacion, hora
                FROM citas
                WHERE paciente_id = %s
                  AND profesional_id = %s
                  AND fecha_programacion = %s
                  AND fecha_solicitada = %s
                  AND hora = %s;
                """,
                (paciente_id, profesional_id, fecha_programacion,
                 fecha_solicitada, hora),
            )
            return cur.fetchone()
    finally:
        conn.close()


def insertar_cita(data: dict) -> int:
    conn = get_db_connection()
    try:
        with conn, conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO citas (
                  paciente_id, profesional_id, fecha_programacion,
                  fecha_solicitada, hora, tipo_servicio,
                  mas_6_meses, observacion
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
                RETURNING id;
                """,
                (
                    data["paciente_id"],
                    data["profesional_id"],
                    data["fecha_programacion"],
                    data["fecha_solicitada"],
                    data["hora"],
                    data["tipo_servicio"],
                    data["mas_6_meses"],
                    data["observacion"],
                ),
            )
            return cur.fetchone()[0]
    finally:
        conn.close()
