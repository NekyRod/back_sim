// src/pages/Agendamiento.jsx
import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../api/client';
import { showToast} from '../utils/ui';
import ConfirmacionCitaModal from '../components/ModalConfirmacionCita';

export default function Agendamiento() {
  const [activeTab, setActiveTab] = useState('paciente'); // 'paciente' | 'cita'
  const formRef = useRef(null);

  // Estado de campos
  const [numeroId, setNumeroId] = useState('');
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [celular, setCelular] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [lugar, setLugar] = useState('');
  const [fechaNac, setFechaNac] = useState('');

  const [fechaProg, setFechaProg] = useState('');
  const [fechaSolicitada, setFechaSolicitada] = useState('');
  const [observacion, setObservacion] = useState('');
  const [tipoServicio, setTipoServicio] = useState('');
  const [chk6Meses, setChk6Meses] = useState(false);
  const [motivoCita, setMotivoCita] = useState('');
  const [profesional, setProfesional] = useState('');
  const [horaRecomendada, setHoraRecomendada] = useState('');

  const [motivosOptions, setMotivosOptions] = useState([]);
  const [mostrarTipoPbs, setMostrarTipoPbs] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [datosConfirmacion, setDatosConfirmacion] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


  
  // Autocompletar paciente
  useEffect(() => {
    const cedula = numeroId.trim();
    if (cedula === '79714835') {
      setNombrePaciente('NELSON ARMANDO RODRIGUEZ AREVALO');
      setCelular('3025254441');
      setDireccion('Calle 187 # 35-25 Apto 503');
      setCorreo('nelsonarmandorodri@outlook.com');
      setLugar('Boyacá');
      setFechaNac('1975-09-24');
      showToast('Datos del paciente completados automáticamente');
    }
  }, [numeroId]);

  // Sincronizar fecha programación -> solicitada
  useEffect(() => {
    if (fechaProg) setFechaSolicitada(fechaProg);
  }, [fechaProg]);

  // Motivos según tipo de servicio / 6 meses
  useEffect(() => {
    function llenarMotivosPBS(checkMarcado) {
      if (!checkMarcado) {
        return [
          { v: 'HO', t: 'Higiene Oral' },
          { v: 'OG', t: 'Odontología General' },
          { v: 'CO', t: 'Cirugía Oral' },
          { v: 'PED', t: 'Pediatría' },
          { v: 'PPBS', t: 'Prótesis PBS' },
        ];
      }
      return [{ v: 'OG', t: 'Odontología General' }];
    }

    function llenarMotivosParticular(checkMarcado) {
      if (!checkMarcado) {
        return [
          { v: 'OG', t: 'Odontología General' },
          { v: 'RO', t: 'Rehabilitación Oral' },
          { v: 'EN', t: 'Endodoncia' },
          { v: 'CO', t: 'Cirugía Oral' },
          { v: 'PED', t: 'Pediatría' },
          { v: 'IMP', t: 'Implante' },
          { v: 'ORTO', t: 'Ortodoncia' },
          { v: 'PER', t: 'Periodoncia' },
        ];
      }
      return [{ v: 'OG', t: 'Odontología General' }];
    }

    let opts = [];
    if (tipoServicio === 'PBS') {
      setMostrarTipoPbs(true);
      opts = llenarMotivosPBS(chk6Meses);
    } else if (tipoServicio === 'PARTICULAR') {
      setMostrarTipoPbs(false);
      opts = llenarMotivosParticular(chk6Meses);
    } else {
      setMostrarTipoPbs(false);
      opts = [];
    }
    setMotivosOptions(opts);
    setMotivoCita('');
  }, [tipoServicio, chk6Meses]);

  // Helper para AM/PM
  function toAmPm(time) {
    if (!time) return 'N/A';
    const [hStr, mStr] = time.split(':');
    let h = parseInt(hStr, 10);
    const suf = h >= 12 ? 'p. m.' : 'a. m.';
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return `${h}:${mStr} ${suf}`;
  }

  // Validar solo TAB 1 (campos de paciente) antes de pasar a TAB 2
  function validarTabPaciente() {
    const form = formRef.current;
    if (!form) return false;

    // Creamos una lista de inputs de la TAB 1
    const tab1 = document.getElementById('tab-paciente-main');
    const inputs = tab1.querySelectorAll('input, select, textarea');

    let ok = true;
    inputs.forEach((el) => {
      if (!el.checkValidity()) ok = false;
    });

    if (!ok) {
      showToast('Completa los datos del paciente antes de continuar.', 'error');
      // forzamos que el navegador muestre qué falta
      form.reportValidity();
    }
    return ok;
  }

  // Cambiar de tab con validación
  function handleTabClick(tab) {
    if (tab === 'cita') {
      if (!validarTabPaciente()) return;
    }
    setActiveTab(tab);
  }

  // Envío formulario
  // Envío formulario
  async function handleSubmit(e) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    // Validar todo el formulario HTML5
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!tipoServicio) {
      showToast('Debe seleccionar el tipo de servicio.', 'error');
      return;
    }
    if (!motivoCita) {
      showToast('Debe seleccionar el motivo de la cita.', 'error');
      return;
    }
    if (!profesional) {
      showToast('Debe seleccionar el profesional.', 'error');
      return;
    }
    const mapaProfesionales = {
    'DR RAMON ACEVEDO 1143373795': 1,
    'DRA MACIEL VALENCIA 30238388': 2,
    'DRA ANNY HENRIQUEZ 53106343': 3,
    'DRA SANDY VITOLA 1143447511': 4,
    'DRA MILENA MORA 52427920': 5,
    'DRA JULIANA MENDOZA 1018505450': 6,
    'DRA ELIANA ORTEGON 1053811550': 7,
    'DR DIEGO BECERRA RAMON 1143373795': 8,
  };

  const profesionalId = mapaProfesionales[profesional];
  if (!profesionalId) {
    showToast('Profesional no configurado en el sistema.', 'error');
    return;
  }

    // TODO: si necesitas tipo_identificacion y tipoPBS, léelos del DOM
    const tipoIdentSelect = document.querySelector('#tab-paciente-main select');
    const tipoIdentificacion = tipoIdentSelect ? tipoIdentSelect.value : '';

    const tipoPbsSelect = document.querySelector('#grupo-tipo-pbs select');
    const tipoPbs = tipoPbsSelect ? tipoPbsSelect.value : '';

    // Ojo: aquí profesional es el texto, debes mapearlo al id real del profesional
    
    const payload = {
      tipo_identificacion: tipoIdentificacion,
      numero_identificacion: numeroId,
      nombre_paciente: nombrePaciente,
      telefono_fijo: '',                // si luego guardas el fijo en estado, úsalo aquí
      telefono_celular: celular,
      direccion,
      correo_electronico: correo,
      lugar_residencia: lugar,
      fecha_nacimiento: fechaNac || null,

      profesional_id: profesionalId,
      fecha_programacion: fechaProg,
      fecha_solicitada: fechaSolicitada,
      hora: horaRecomendada,
      tipo_servicio: tipoServicio,
      mas_6_meses: chk6Meses,
      observacion,
    };

    try {
      await apiFetch(`${BACKEND_URL}/citas`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Si el back respondió 201, armamos datos para el modal
      const datos = {
        nombrePaciente: nombrePaciente || 'Paciente',
        docPaciente: numeroId || '',
        fechaProgramacion: fechaProg || '',
        horaRecomendada: toAmPm(horaRecomendada),
        profesional: profesional || '',
        tipoServicio: tipoServicio || '',
      };

      setDatosConfirmacion(datos);
      setOpenConfirm(true);
    } catch (err) {
      // Mensaje del back, incluyendo el caso de cita duplicada
      showToast(err.message, 'error');
      // NO abrimos el modal
    }
  }


  return (
    <section id="agendamiento-section">
      <div className="agendamiento-wrapper">
        <div className="modal-content modal-content-inline">
          {/* Tabs */}
          <div className="modal-tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'paciente' ? 'active' : ''}`}
              onClick={() => handleTabClick('paciente')}
            >
              Datos del Paciente
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'cita' ? 'active' : ''}`}
              onClick={() => handleTabClick('cita')}
            >
              Programación de la Cita
            </button>
          </div>

          <form
            id="appointment-form-main"
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
          >
            {/* TAB 1 */}
            <div
              id="tab-paciente-main"
              className={`tab-section ${activeTab === 'paciente' ? 'active' : 'hidden'}`}
            >
              <label>
                Tipo de Identificación
                <select required>
                  <option value="">Seleccione uno</option>
                  <option value="CC">Cédula de ciudadanía</option>
                  <option value="TI">Tarjeta de identidad</option>
                  <option value="CE">Cédula de extranjería</option>
                  <option value="PA">Pasaporte</option>
                </select>
              </label>

              <label>
                Número de Identificación
                <input
                  id="numero-identificacion"
                  type="number"
                  required
                  min="1"
                  step="1"
                  pattern="\d+"
                  value={numeroId}
                  onChange={(e) => setNumeroId(e.target.value)}
                />
              </label>

              <label>
                Nombre del Paciente
                <input
                  id="nombre-paciente"
                  type="text"
                  maxLength={100}
                  //pattern="[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\\s]+"
                  value={nombrePaciente}
                  onChange={(e) => setNombrePaciente(e.target.value)}
                />
              </label>

              <label>
                Teléfono fijo
                <input
                  id="telefono-fijo"
                  type="text"
                  maxLength={10}
                  //pattern="\\d{10}"
                />
              </label>

              <label>
                Teléfono celular
                <input
                  id="telefono-celular"
                  type="text"
                  maxLength={10}
                  //pattern="\\d{10}"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value.replace(/\s+/g, ''))}
                />
              </label>

              <label>
                Dirección
                <textarea
                  id="direccion"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </label>

              <label>
                Correo electrónico
                <input
                  id="correo-electronico"
                  type="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </label>

              <label>
                Lugar de Residencia
                <select
                  id="lugar-residencia"
                  required
                  value={lugar}
                  onChange={(e) => setLugar(e.target.value)}
                >
                  <option value="">Seleccione uno</option>
                  <option value="Bogotá">Bogotá</option>
                  <option value="Medellín">Medellín</option>
                  <option value="Cali">Cali</option>
                  <option value="Manizales">Manizales</option>
                  <option value="Pereira">Pereira</option>
                  <option value="Cartagena">Cartagena</option>
                  <option value="Santa Marta">Santa Marta</option>
                  <option value="Boyacá">Boyacá</option>
                </select>
              </label>

              <label>
                Fecha de nacimiento
                <input
                  id="fecha-nacimiento"
                  type="date"
                  required
                  value={fechaNac}
                  onChange={(e) => setFechaNac(e.target.value)}
                />
              </label>
            </div>

            {/* TAB 2 */}
            <div
              id="tab-cita-main"
              className={`tab-section ${activeTab === 'cita' ? 'active' : 'hidden'}`}
            >
              <label>
                Fecha de programación
                <input
                  type="date"
                  id="fecha-programacion-main"
                  required
                  value={fechaProg}
                  onChange={(e) => setFechaProg(e.target.value)}
                />
              </label>

              <label>
                Fecha solicitada por el paciente
                <input
                  type="date"
                  id="fecha-solicitada-main"
                  readOnly
                  value={fechaSolicitada}
                />
              </label>

              <label>
                Observación de la cita
                <textarea
                  maxLength={255}
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                />
              </label>

              <label>
                Tipo de servicio
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select
                    id="tipo-servicio"
                    required
                    style={{ flex: 1 }}
                    value={tipoServicio}
                    onChange={(e) => setTipoServicio(e.target.value)}
                  >
                    <option value="">Seleccione uno</option>
                    <option value="PBS">Plan de Beneficios en Salud</option>
                    <option value="PARTICULAR">Particular</option>
                  </select>
                  <label
                    style={{
                      fontWeight: 400,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <input
                      type="checkbox"
                      id="chk-6meses"
                      checked={chk6Meses}
                      onChange={(e) => setChk6Meses(e.target.checked)}
                    />
                    Hace más de 6 meses no asiste a odontología
                  </label>
                </div>
              </label>

              {mostrarTipoPbs && (
                <label id="grupo-tipo-pbs">
                  Tipo PBS
                  <select>
                    <option value="">Seleccione uno</option>
                    <option value="COMPARTIDOS">Compartidos</option>
                    <option value="PBS">PBS</option>
                    <option value="PBS-S">PBS-Subsidiado</option>
                  </select>
                </label>
              )}

              <label>
                Motivo Cita
                <select
                  id="motivo-cita"
                  value={motivoCita}
                  onChange={(e) => setMotivoCita(e.target.value)}
                >
                  <option value="">Seleccione uno</option>
                  {motivosOptions.map((o) => (
                    <option key={o.v} value={o.v}>
                      {o.t}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Profesional
                <select
                  id="profesional-cita"
                  value={profesional}
                  onChange={(e) => setProfesional(e.target.value)}
                >
                  <option value="">Seleccione uno</option>
                  <option>DR RAMON ACEVEDO 1143373795</option>
                  <option>DRA MACIEL VALENCIA 30238388</option>
                  <option>DRA ANNY HENRIQUEZ 53106343</option>
                  <option>DRA SANDY VITOLA 1143447511</option>
                  <option>DRA MILENA MORA 52427920</option>
                  <option>DRA JULIANA MENDOZA 1018505450</option>
                  <option>DRA ELIANA ORTEGON 1053811550</option>
                  <option>DR DIEGO BECERRA RAMON 1143373795</option>
                </select>
              </label>

              <label>
                Hora recomendada
                <input
                  type="time"
                  id="hora-recomendada"
                  value={horaRecomendada}
                  onChange={(e) => setHoraRecomendada(e.target.value)}
                />
              </label>

              <button type="submit" className="confirmar-cita-btn">
                Confirmar Cita
              </button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmacionCitaModal
        open={openConfirm}
        datos={datosConfirmacion}
        onClose={() => setOpenConfirm(false)}
        onDescargarPdf={() => {
          // Aquí puedes seguir usando html2pdf sobre un div oculto,
          // o adaptar tu lógica actual de generación de PDF.
        }}
      />
    </section>
  );
}
