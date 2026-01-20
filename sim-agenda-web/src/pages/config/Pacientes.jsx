// src/pages/config/Pacientes.jsx
import { useState } from 'react';

const initForm = {
  id: null,
  tipo_identificacion: '',
  numero_identificacion: '',
  nombre_completo: '',
  telefono_fijo: '',
  telefono_celular: '',
  direccion: '',
  correo_electronico: '',
  lugar_residencia: '',
  fecha_nacimiento: '',
};

export default function Pacientes() {
  const [form, setForm] = useState(initForm);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleGuardar(e) {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);
    setError(null);

    try {
      const metodo = form.id ? 'PUT' : 'POST';
      const url = form.id
        ? `/api/pacientes/${form.id}`
        : '/api/pacientes';

      const resp = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || 'Error guardando paciente');
      }

      const data = await resp.json();
      setForm(prev => ({ ...prev, id: data.id }));
      setMensaje('Paciente guardado correctamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  function handleNuevo() {
    setForm(initForm);
    setMensaje(null);
    setError(null);
  }

  return (
    <div className="config-page">
      <h2>Pacientes</h2>

      <div className="card">
        <div className="card-header">Datos del Paciente</div>
        <div className="card-body">
          <form onSubmit={handleGuardar}>
            <div className="form-row">
              <label>Tipo de Identificación</label>
              <select
                name="tipo_identificacion"
                value={form.tipo_identificacion}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione uno</option>
                <option value="CC">Cédula de ciudadanía</option>
                <option value="TI">Tarjeta de identidad</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="PA">Pasaporte</option>
              </select>
            </div>

            <div className="form-row">
              <label>Número de Identificación</label>
              <input
                type="text"
                name="numero_identificacion"
                value={form.numero_identificacion}
                onChange={handleChange}
                maxLength={50}
                required
              />
            </div>

            <div className="form-row">
              <label>Nombre completo</label>
              <input
                type="text"
                name="nombre_completo"
                value={form.nombre_completo}
                onChange={handleChange}
                maxLength={150}
                required
              />
            </div>

            <div className="form-row">
              <label>Teléfono fijo</label>
              <input
                type="text"
                name="telefono_fijo"
                value={form.telefono_fijo}
                onChange={handleChange}
                maxLength={20}
              />
            </div>

            <div className="form-row">
              <label>Teléfono celular</label>
              <input
                type="text"
                name="telefono_celular"
                value={form.telefono_celular}
                onChange={handleChange}
                maxLength={20}
              />
            </div>

            <div className="form-row">
              <label>Dirección</label>
              <textarea
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                rows={2}
              />
            </div>

            <div className="form-row">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="correo_electronico"
                value={form.correo_electronico}
                onChange={handleChange}
                maxLength={150}
                required
              />
            </div>

            <div className="form-row">
              <label>Lugar de Residencia</label>
              <input
                type="text"
                name="lugar_residencia"
                value={form.lugar_residencia}
                onChange={handleChange}
                maxLength={100}
              />
            </div>

            <div className="form-row">
              <label>Fecha de nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={form.fecha_nacimiento || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleNuevo}>
                Nuevo
              </button>
              <button type="submit" disabled={cargando}>
                {cargando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>

            {mensaje && <div className="alert success">{mensaje}</div>}
            {error && <div className="alert error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
