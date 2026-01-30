// src/pages/config/Especialidades.jsx

import { useState, useEffect } from 'react';
import { FaTags } from 'react-icons/fa';
import { apiFetch } from '../../api/client';
import { showToast, showConfirm } from '../../utils/ui';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Especialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [especialidadEditando, setEspecialidadEditando] = useState(null);

  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  async function cargarEspecialidades() {
    setLoading(true);
    try {
      const resp = await apiFetch(`${BACKEND_URL}/especialidades/`);
      setEspecialidades(resp.data || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar especialidades');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const datos = {
      codigo: codigo.toUpperCase(),
      nombre,
      activo
    };

    try {
      if (modoEdicion && especialidadEditando) {
        await apiFetch(`${BACKEND_URL}/especialidades/${especialidadEditando.id}`, {
          method: 'PUT',
          body: JSON.stringify(datos)
        });
        showToast('Especialidad actualizada correctamente');
      } else {
        await apiFetch(`${BACKEND_URL}/especialidades/`, {
          method: 'POST',
          body: JSON.stringify(datos)
        });
        showToast('Especialidad creada correctamente');
      }

      limpiarFormulario();
      cargarEspecialidades();
    } catch (err) {
      console.error('Error al guardar:', err);
      showToast('Error al guardar la especialidad', 'error');
    }
  }

  function handleEditar(especialidad) {
    setModoEdicion(true);
    setEspecialidadEditando(especialidad);
    setCodigo(especialidad.codigo);
    setNombre(especialidad.nombre);
    setActivo(especialidad.activo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleEliminar(id) {
    const ok = await showConfirm('¿Está seguro de eliminar esta especialidad?');
    if (!ok) return;

    try {
      await apiFetch(`${BACKEND_URL}/especialidades/${id}`, { method: 'DELETE' });
      showToast('Especialidad eliminada correctamente');
      cargarEspecialidades();
    } catch (err) {
      console.error('Error al eliminar:', err);
      showToast('Error al eliminar la especialidad', 'error');
    }
  }

  function limpiarFormulario() {
    setCodigo('');
    setNombre('');
    setActivo(true);
    setModoEdicion(false);
    setEspecialidadEditando(null);
  }

  if (loading) return <div className="cargando">Cargando especialidades...</div>;
  if (error) return <div className="error-mensaje">{error}</div>;

  return (
    <div className="pagina-config">
      <h2>
        <FaTags /> Gestión de Especialidades
      </h2>

      {/* FORMULARIO */}
      <div className="formulario-config">
        <h3>{modoEdicion ? 'Editar Especialidad' : 'Nueva Especialidad'}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Código (ej: ENDO, ORTO) *
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="ENDO"
              required
              maxLength={20}
            />
          </label>

          <label>
            Nombre *
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Endodoncia"
              required
              maxLength={200}
            />
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
            />
            Activo
          </label>

          {modoEdicion ? (
            <div className="botones-form">
              <button type="submit" className="btn-guardar">
                Actualizar
              </button>
              <button type="button" className="btn-cancelar" onClick={limpiarFormulario}>
                Cancelar
              </button>
            </div>
          ) : (
            <button type="submit" className="btn-guardar">
              Guardar
            </button>
          )}
        </form>
      </div>

      {/* TABLA */}
      <div className="tabla-config">
        <h3>Especialidades Registradas</h3>
        {especialidades.length === 0 ? (
          <p>No hay especialidades registradas</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {especialidades.map((especialidad) => (
                <tr key={especialidad.id}>
                  <td>{especialidad.codigo}</td>
                  <td>{especialidad.nombre}</td>
                  <td>
                    {especialidad.activo ? (
                      <span className="badge-activo">Activo</span>
                    ) : (
                      <span className="badge-inactivo">Inactivo</span>
                    )}
                  </td>
                  <td className="acciones">
                    <button className="btn-editar" onClick={() => handleEditar(especialidad)}>
                      Editar
                    </button>
                    <button className="btn-eliminar" onClick={() => handleEliminar(especialidad.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
