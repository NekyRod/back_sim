from typing import List, Optional, Dict, Any
from app.database.connection import  get_db_connection

class PacientesRepo:
    @staticmethod
    def create(data: Dict[str, Any]) -> Dict[str, Any]:
        sql = """
        INSERT INTO pacientes (
            tipo_identificacion, numero_identificacion, nombre_completo,
            telefono_fijo, telefono_celular, direccion,
            correo_electronico, lugar_residencia, fecha_nacimiento
        ) VALUES (%(tipo_identificacion)s, %(numero_identificacion)s, %(nombre_completo)s,
                  %(telefono_fijo)s, %(telefono_celular)s, %(direccion)s,
                  %(correo_electronico)s, %(lugar_residencia)s, %(fecha_nacimiento)s)
        RETURNING *;
        """
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, data)
                return cur.fetchone()

    @staticmethod
    def get_by_document(numero_identificacion: str) -> Optional[Dict[str, Any]]:
        sql = "SELECT * FROM pacientes WHERE numero_identificacion = %s;"
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, (numero_identificacion,))
                return cur.fetchone()
