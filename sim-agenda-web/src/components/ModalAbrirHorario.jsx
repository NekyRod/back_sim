// src/components/ModalAbrirHorario.jsx
// src/components/ModalAbrirHorario.jsx
import ModalBase from './ModalBase';
import { showToast } from '../utils/ui';

export default function ModalAbrirHorario({ open, profesional, onClose }) {
  if (!open) return null;
    function guardar() {
        // Aquí podrías enviar los rangos modificados al backend
        showToast('Horario Abierto (simulado).');
        onClose();
      }
  return (
    <ModalBase open={open} onClose={onClose}>
      <div className="modal-content-horario">
        <h3 className="modal-title">Abrir Horario</h3>

        <p className="modal-profesional">
          <strong>Profesional:</strong> {profesional || 'N/A'}
        </p>

        <div className="modal-body">
          <ul className="lista-rangos-fijos">
            <li>08:00 a. m. - 12:00 m</li>
            <li>02:00 p. m. - 05:40 p. m.</li>
          </ul>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-principal"
            onClick={guardar}
          >
            Cerrar Horario
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
