# app/database/citas_repo.py

from datetime import date, time
from app.database.connection import get_db_connection

def existe_cita(
    paciente_id: int,
    profesional_id: int,
    fecha_programacion: date,
    fecha_solicitada: date,
    hora: time
):
    """
    Verificar si ya existe una cita con los mismos datos.
    Retorna la fila si existe, None si no existe.
    """
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
                  AND hora = %s
                  AND activo = TRUE;
                """,
                (paciente_id, profesional_id, fecha_programacion, fecha_solicitada, hora),
            )
            return cur.fetchone()
    finally:
        conn.close()

def insertar_cita(data: dict) -> int:
    """
    Insertar una nueva cita en la base de datos.
    Retorna el ID de la cita creada.
    """
    conn = get_db_connection()
    try:
        with conn, conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO citas (
                    paciente_id, profesional_id, fecha_programacion,
                    fecha_solicitada, hora, tipo_servicio, tipo_pbs,
                    mas_6_meses, motivo_cita, observacion, activo
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (
                    data["paciente_id"],
                    data["profesional_id"],
                    data["fecha_programacion"],
                    data["fecha_solicitada"],
                    data["hora"],
                    data["tipo_servicio"],
                    data.get("tipo_pbs"),
                    data["mas_6_meses"],
                    data.get("motivo_cita"),
                    data.get("observacion"),
                    True  # activo por defecto
                ),
            )
            return cur.fetchone()[0]
    finally:
        conn.close()

def get_all_citas():
    """
    Obtener todas las citas activas con información del paciente y profesional.
    """
    conn = get_db_connection()
    try:
        with conn, conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    c.id,
                    c.paciente_id,
                    p.nombre_completo AS nombre_paciente,
                    p.numero_identificacion,
                    c.profesional_id,
                    c.fecha_programacion,
                    c.fecha_solicitada,
                    c.hora,
                    c.tipo_servicio,
                    c.tipo_pbs,
                    c.mas_6_meses,
                    c.motivo_cita,
                    c.observacion,
                    c.estado,
                    c.created_at
                FROM citas c
                INNER JOIN pacientes p ON c.paciente_id = p.id
                WHERE c.activo = TRUE
                ORDER BY c.fecha_programacion DESC, c.hora DESC
            """)
            rows = cur.fetchall()
            return [
                {
                    "id": r[0],
                    "paciente_id": r[1],
                    "nombre_paciente": r[2],
                    "numero_identificacion": r[3],
                    "profesional_id": r[4],
                    "fecha_programacion": str(r[5]) if r[5] else None,
                    "fecha_solicitada": str(r[6]) if r[6] else None,
                    "hora": str(r[7]) if r[7] else None,
                    "tipo_servicio": r[8],
                    "tipo_pbs": r[9],
                    "mas_6_meses": r[10],
                    "motivo_cita": r[11],
                    "observacion": r[12],
                    "estado": r[13],
                    "created_at": str(r[14]) if r[14] else None
                }
                for r in rows
            ]
    finally:
        conn.close()

def get_cita_by_id(cita_id: int):
    """
    Obtener una cita específica por su ID.
    """
    conn = get_db_connection()
    try:
        with conn, conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    c.id,
                    c.paciente_id,
                    p.nombre_completo AS nombre_paciente,
                    p.numero_identificacion,
                    c.profesional_id,
                    c.fecha_programacion,
                    c.fecha_solicitada,
                    c.hora,
                    c.tipo_servicio,
                    c.tipo_pbs,
                    c.mas_6_meses,
                    c.motivo_cita,
                    c.observacion,
                    c.estado,
                    c.activo
                FROM citas c
                INNER JOIN pacientes p ON c.paciente_id = p.id
                WHERE c.id = %s
            """, (cita_id,))
            row = cur.fetchone()
            if not row:
                return None
            return {
                "id": row[0],
                "paciente_id": row[1],
                "nombre_paciente": row[2],
                "numero_identificacion": row[3],
                "profesional_id": row[4],
                "fecha_programacion": str(row[5]) if row[5] else None,
                "fecha_solicitada": str(row[6]) if row[6] else None,
                "hora": str(row[7]) if row[7] else None,
                "tipo_servicio": row[8],
                "tipo_pbs": row[9],
                "mas_6_meses": row[10],
                "motivo_cita": row[11],
                "observacion": row[12],
                "estado": row[13],
                "activo": row[14]
            }
    finally:
        conn.close()

def update_cita_estado(cita_id: int, nuevo_estado: str) -> int:
    """
    Actualizar el estado de una cita.
    Estados posibles: 'PROGRAMADA', 'CONFIRMADA', 'ATENDIDA', 'CANCELADA', etc.
    """
    conn = get_db_connection()
    try:
        with conn, conn.cursor() as cur:
            cur.execute("""
                UPDATE citas
                SET estado = %s, updated_at = NOW()
                WHERE id = %s
            """, (nuevo_estado, cita_id))
            return cur.rowcount
    finally:
        conn.close()

def delete_cita(cita_id: int) -> int:
    """
    Eliminar una cita (soft delete).
    """
    conn = get_db_connection()
    try:
        with conn, conn.cursor() as cur:
            cur.execute("""
                UPDATE citas
                SET activo = FALSE, updated_at = NOW()
                WHERE id = %s
            """, (cita_id,))
            return cur.rowcount
    finally:
        conn.close()
