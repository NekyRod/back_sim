// src/pages/CrearDisponibilidad.jsx
export default function CrearDisponibilidad() {
  return (
    <section id="crear-disponibilidad-section">
      <div className="crear-disponibilidad-container">
        <h2>Crear Disponibilidad</h2>

        <div className="crear-disponibilidad-prof">
          <label>
            Profesional
            <select id="crear-disponibilidad-profesional">
              <option>Seleccione uno</option>
            </select>
          </label>
        </div>

        <div className="crear-disponibilidad-tabla-wrapper">
          <table className="crear-disponibilidad-tabla">
            <thead>
              <tr>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
                <th>Sábado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td id="lunes-rangos">Agregar rango Desde Hasta</td>
                <td id="martes-rangos">Agregar rango Desde Hasta</td>
                <td id="miercoles-rangos">Agregar rango Desde Hasta</td>
                <td id="jueves-rangos">Agregar rango Desde Hasta</td>
                <td id="viernes-rangos">Agregar rango Desde Hasta</td>
                <td id="sabado-rangos">Agregar rango Desde Hasta</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
