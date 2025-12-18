from typing import Optional, Dict, Any
from app.database.pacientes_repo import PacientesRepo

class PacientesControl:

    @staticmethod
    def crear_paciente(payload: Dict[str, Any]) -> Dict[str, Any]:
        # aquí puedes validar campos, reglas de negocio, etc.
        return PacientesRepo.create(payload)

    @staticmethod
    def obtener_por_documento(numero_identificacion: str) -> Optional[Dict[str, Any]]:
        return PacientesRepo.get_by_document(numero_identificacion)
