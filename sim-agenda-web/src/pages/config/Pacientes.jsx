// src/pages/config/Pacientes.jsx

import { useState, useEffect } from 'react';
import { apiFetch } from '../../api/client';
import { showToast, showConfirm } from '../../utils/ui';
import '../../styles/estilos.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const initForm = {
  id: null,
  tipo_identificacion: '',
  numero_identificacion: '',
  nombre_completo: '',
  telefono_fijo: '',
  telefono_celular: '',
  segundo_telefono_celular: '',
  titular_segundo_celular: '', // ← NUEVO
  correo_electronico: '',
  direccion: '',
  lugar_residencia: '',
  fecha_nacimiento: '',
  // Campos del acompañante
  tipo_doc_acompanante: '',
  nombre_acompanante: '',
  parentesco_acompanante: '',
};

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [form, setForm] = useState(initForm);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState('');
  const [edad, setEdad] = useState(null);
  const [mostrarCamposAcompanante, setMostrarCamposAcompanante] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (form.fecha_nacimiento) {
      const edadCalculada = calcularEdad(form.fecha_nacimiento);
      setEdad(edadCalculada);
    } else {
      setEdad(null);
    }
  }, [form.fecha_nacimiento]);

  useEffect(() => {
    if (form.tipo_identificacion === 'RC' || form.tipo_identificacion === 'TI') {
      setMostrarCamposAcompanante(true);
    } else {
      setMostrarCamposAcompanante(false);
      setForm(prev => ({
        ...prev,
        tipo_doc_acompanante: '',
        nombre_acompanante: '',
        parentesco_acompanante: ''
      }));
    }
  }, [form.tipo_identificacion]);

  async function cargarDatos() {
    try {
      setCargando(true);
      await Promise.all([
        cargarPacientes(),
        cargarTiposIdentificacion(),
        cargarCiudades()
      ]);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function cargarPacientes() {
    try {
      const resp = await apiFetch(`${BACKEND_URL}/pacientes`);
      setPacientes(resp.data || []);
    } catch (err) {
      showToast('Error cargando pacientes: ' + err.message, 'error');
    }
  }

  async function cargarTiposIdentificacion() {
    try {
      const resp = await apiFetch(`${BACKEND_URL}/tiposidentificacion`);
      setTiposIdentificacion(resp.data || []);
    } catch (err) {
      console.error('Error cargando tipos de identificación:', err);
    }
  }

  async function cargarCiudades() {
    try {
      const resp = await apiFetch(`${BACKEND_URL}/ciudadesresidencia`);
      setCiudades(resp.data || []);
    } catch (err) {
      console.error('Error cargando ciudades:', err);
    }
  }

  function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }

  function validarEdadYTipoDocumento() {
    if (!form.fecha_nacimiento || !form.tipo_identificacion) {
      return true;
    }

    const edadPaciente = calcularEdad(form.fecha_nacimiento);

    if (edadPaciente >= 0 && edadPaciente <= 6) {
      if (form.tipo_identificacion !== 'RC') {
        showToast('Los menores de 6 años deben tener Registro Civil de nacimiento (RC) como tipo de documento', 'error');
        return false;
      }
    }

    if (edadPaciente >= 7 && edadPaciente <= 17) {
      if (form.tipo_identificacion !== 'TI') {
        showToast('Los menores entre 7 y 17 años deben tener Tarjeta de Identidad (TI) como tipo de documento', 'error');
        return false;
      }
    }

    return true;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.tipo_identificacion || !form.numero_identificacion || !form.nombre_completo) {
      showToast('Tipo de identificación, número y nombre son obligatorios', 'error');
      return;
    }

    if (!validarEdadYTipoDocumento()) {
      return;
    }

    if (mostrarCamposAcompanante) {
      if (!form.tipo_doc_acompanante || !form.nombre_acompanante || !form.parentesco_acompanante) {
        showToast('Los datos del acompañante son obligatorios para menores de edad', 'error');
        return;
      }
    }

    try {
      if (editando && form.id) {
        await apiFetch(`${BACKEND_URL}/pacientes/${form.id}`, {
          method: 'PUT',
          body: JSON.stringify(form)
        });
        showToast('Paciente actualizado correctamente');
      } else {
        await apiFetch(`${BACKEND_URL}/pacientes`, {
          method: 'POST',
          body: JSON.stringify(form)
        });
        showToast('Paciente creado correctamente');
      }
      limpiarForm();
      cargarPacientes();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function handleEditar(paciente) {
    setForm(paciente);
    setEditando(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleEliminar(id) {
    const confirmado = await showConfirm('¿Está seguro de eliminar este paciente?');
    if (!confirmado) return;

    try {
      await apiFetch(`${BACKEND_URL}/pacientes/${id}`, { method: 'DELETE' });
      showToast('Paciente eliminado correctamente');
      cargarPacientes();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function limpiarForm() {
    setForm(initForm);
    setEditando(false);
    setEdad(null);
  }

  if (cargando) return <div className="cargando">Cargando pacientes...</div>;

  return (
    <section className="pagina-config">
      <h2>👥 Gestión de Pacientes</h2>

      {error && <div className="error-mensaje">{error}</div>}

      <div className="formulario-config">
        <h3>{editando ? 'Editar Paciente' : 'Nuevo Paciente'}</h3>
        <form onSubmit={handleSubmit}>
          
          <h4 style={{ margin: '0 0 15px 0', color: '#2c5f8d', fontSize: '16px' }}>
            Datos del Paciente
          </h4>

          <label>
            Tipo de Identificación *
            <select
              name="tipo_identificacion"
              value={form.tipo_identificacion}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione uno</option>
              {tiposIdentificacion.map((tipo) => (
                <option key={tipo.id} value={tipo.codigo}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Número de Identificación *
            <input
              type="text"
              name="numero_identificacion"
              value={form.numero_identificacion}
              onChange={handleChange}
              placeholder="1234567890"
              required
            />
          </label>

          <label>
            Nombre del Paciente *
            <input
              type="text"
              name="nombre_completo"
              value={form.nombre_completo}
              onChange={handleChange}
              placeholder="Nombre completo"
              required
            />
          </label>

          <label>
            Teléfono fijo
            <input
              type="tel"
              name="telefono_fijo"
              value={form.telefono_fijo}
              onChange={handleChange}
              placeholder="6012345678"
            />
          </label>

          <label>
            Teléfono celular
            <input
              type="tel"
              name="telefono_celular"
              value={form.telefono_celular}
              onChange={handleChange}
              placeholder="3001234567"
            />
          </label>

          <label>
            Segundo número de celular
            <input
              type="tel"
              name="segundo_telefono_celular"
              value={form.segundo_telefono_celular}
              onChange={handleChange}
              placeholder="3009876543"
            />
          </label>

          <label>
            ¿A quién pertenece el segundo celular?
            <input
              type="text"
              name="titular_segundo_celular"
              value={form.titular_segundo_celular}
              onChange={handleChange}
              placeholder="Ej: Esposa, Hijo, Familiar"
              maxLength={60}
            />
          </label>

          <label>
            Dirección
            <textarea
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Calle 123 # 45-67"
              rows="3"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                marginTop: '6px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </label>

          <label>
            Correo electrónico
            <input
              type="email"
              name="correo_electronico"
              value={form.correo_electronico}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
            />
          </label>

          <label>
            Lugar de Residencia
            <select
              name="lugar_residencia"
              value={form.lugar_residencia}
              onChange={handleChange}
            >
              <option value="">Seleccione uno</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad.id} value={ciudad.nombre}>
                  {ciudad.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fecha de nacimiento
            <input
              type="date"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
            />
            {edad !== null && (
              <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                Edad: {edad} años
              </small>
            )}
          </label>

          {mostrarCamposAcompanante && (
            <>
              <h4 style={{ margin: '20px 0 15px 0', color: '#2c5f8d', fontSize: '16px', borderTop: '2px solid #e0e0e0', paddingTop: '20px' }}>
                Datos del Acompañante (Obligatorio para menores)
              </h4>

              <label>
                Tipo de documento del acompañante *
                <select
                  name="tipo_doc_acompanante"
                  value={form.tipo_doc_acompanante}
                  onChange={handleChange}
                  required={mostrarCamposAcompanante}
                >
                  <option value="">Seleccione uno</option>
                  {tiposIdentificacion
                    .filter(tipo => tipo.codigo !== 'RC' && tipo.codigo !== 'TI')
                    .map((tipo) => (
                      <option key={tipo.id} value={tipo.codigo}>
                        {tipo.nombre}
                      </option>
                    ))
                  }
                </select>
              </label>

              <label>
                Nombre del acompañante *
                <input
                  type="text"
                  name="nombre_acompanante"
                  value={form.nombre_acompanante}
                  onChange={handleChange}
                  placeholder="Nombre completo del acompañante"
                  maxLength={100}
                  required={mostrarCamposAcompanante}
                />
              </label>

              <label>
                Parentesco del acompañante *
                <input
                  type="text"
                  name="parentesco_acompanante"
                  value={form.parentesco_acompanante}
                  onChange={handleChange}
                  placeholder="Ej: Madre, Padre, Tutor legal"
                  maxLength={60}
                  required={mostrarCamposAcompanante}
                />
              </label>
            </>
          )}

          <div className="botones-form" style={{ marginTop: '25px' }}>
            <button type="submit" className="btn-guardar">
              {editando ? 'Actualizar' : 'Guardar'}
            </button>
            {editando && (
              <button type="button" onClick={limpiarForm} className="btn-cancelar">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="tabla-config">
        <h3>Pacientes Registrados</h3>
        {pacientes.length === 0 ? (
          <p>No hay pacientes registrados</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tipo ID</th>
                <th>Número ID</th>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Teléfono</th>
                <th>Ciudad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente) => (
                <tr key={paciente.id}>
                  <td><strong>{paciente.tipo_identificacion}</strong></td>
                  <td>{paciente.numero_identificacion}</td>
                  <td>{paciente.nombre_completo}</td>
                  <td>
                    {paciente.fecha_nacimiento 
                      ? `${calcularEdad(paciente.fecha_nacimiento)} años`
                      : 'N/A'
                    }
                  </td>
                  <td>
                    {paciente.telefono_celular || paciente.telefono_fijo || 'N/A'}
                  </td>
                  <td>{paciente.lugar_residencia || 'N/A'}</td>
                  <td>
                    <div className="acciones">
                      <button className="btn-editar" onClick={() => handleEditar(paciente)}>
                        Editar
                      </button>
                      <button className="btn-eliminar" onClick={() => handleEliminar(paciente.id)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
