// src/pages/AgendaSemanal.jsx
export default function AgendaSemanal() {
  return (
    <section id="agenda-semanal-section">
      <div className="agenda-semanal-container">
        <h2>Agenda semanal</h2>

        <div className="agenda-semanal-filtros">
          <label>
            Semana a partir de
            <input type="date" id="agenda-semanal-fecha-inicio" />
          </label>

          <label>
            Profesional
            <select id="agenda-semanal-profesional">
              <option>Todos</option>
            </select>
          </label>
        </div>

        <div className="agenda-semanal-tabla-wrapper">
          <table className="agenda-semanal-tabla">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
                <th>Sábado</th>
              </tr>
            </thead>
            <tbody id="agenda-semanal-body">
              {/* se llenará dinámicamente */}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
