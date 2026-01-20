// src/pages/AgendaDiaria.jsx
export default function AgendaDiaria() {
  return (
    <section id="agenda-diaria-section">
      <div className="agenda-diaria-container">
        <h2>Agenda diaria</h2>

        <div className="agenda-diaria-filtros">
          <label>
            Fecha
            <input type="date" id="agenda-diaria-fecha" />
          </label>

          <label>
            Profesional
            <select id="agenda-diaria-profesional">
              <option>Todos</option>
            </select>
          </label>
        </div>

        <div className="agenda-diaria-tabla-wrapper">
          <table className="agenda-diaria-tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Tipo Doc</th>
                <th>No Doc</th>
                <th>Nombre Paciente</th>
                <th>Especialidad</th>
                <th>Servicio</th>
                <th>SIES PBS</th>
                <th>Teléfono 1</th>
                <th>Teléfono 2</th>
                <th>Dato Teléfono 2</th>
                <th>Prof. Cita</th>
                <th>Motivo</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody id="agenda-diaria-body">
              {/* filas se llenarán por JS/React más adelante */}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
