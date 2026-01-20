// src/components/ModalModificarHorario.jsx
import { useState } from 'react';
import ModalBase from './ModalBase';
import { showToast } from '../utils/ui';

function toAmPm(time) {
  if (!time) return '';
  const [h, m] = time.split(':');
  let hh = parseInt(h, 10);
  const suf = hh >= 12 ? 'p. m.' : 'a. m.';
  if (hh === 0) hh = 12;
  else if (hh > 12) hh -= 12;
  return `${hh}:${m} ${suf}`;
}

export default function ModalModificarHorario({ open, profesional, onClose }) {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [rangos, setRangos] = useState([]);

  function agregarRango() {
    if (!desde || !hasta) {
      showToast('Debe escoger hora desde y hasta.', 'error');
      return;
    }
    const rango = `${toAmPm(desde)} - ${toAmPm(hasta)}`;
    if (rangos.includes(rango)) {
      showToast('Este rango ya existe.', 'error');
      return;
    }
    setRangos((prev) => [...prev, rango]);
  }

  function quitarRango(idx) {
    setRangos((prev) => prev.filter((_, i) => i !== idx));
  }

  function guardar() {
    // Aquí podrías enviar los rangos modificados al backend
    showToast('Horario modificado (simulado).');
    onClose();
  }

  if (!open) return null;

  return (
    <ModalBase open={open} title="Modificar Horario" onClose={onClose}>
      <div className="modal-content-horario">
        <h3 className="modal-title">Modificar Horario</h3>

        <p className="modal-profesional">
          <strong>Profesional:</strong> {profesional || 'N/A'}
        </p>

        <div className="modal-body">
          <div className="rango-inputs">
            <div>
              <label>
                Hora desde
                <input
                  type="time"
                  step="900"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                Hora hasta
                <input
                  type="time"
                  step="900"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                />
              </label>
            </div>
            <button
              type="button"
              className="btn-pequeño"
              onClick={agregarRango}
            >
              Agregar rango
            </button>
          </div>

          <div className="rango-lista-container">
            <div id="lista-modificar-rangos" className="rango-lista">
              {rangos.map((r, idx) => (
                <div key={idx} className="rango-item">
                  <span className="rango-texto">{r}</span>
                  <span
                    className="rango-x"
                    onClick={() => quitarRango(idx)}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-principal"
            onClick={guardar}
          >
            Modificar Horario
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
