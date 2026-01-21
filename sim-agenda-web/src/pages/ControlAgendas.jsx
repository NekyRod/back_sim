// src/pages/ControlAgendas.jsx
import { useState, useMemo } from 'react';
import ModalAbrirHorario from '../components/ModalAbrirHorario';
import ModalModificarHorario from '../components/ModalModificarHorario';
import ModalBloquearRango from '../components/ModalBloquearRango';

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril',
  'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const professionals = [
  'DR RAMON ACEVEDO 1143373795',
  'DRA MACIEL VALENCIA 30238388',
  'DRA ANNY HENRIQUEZ 53106343',
  'DRA SANDY VITOLA 1143447511',
  'DRA MILENA MORA 52427920',
  'DRA JULIANA MENDOZA 1018505450',
  'DRA ELIANA ORTEGON 1053811550',
  'DR DIEGO BECERRA RAMON 1143373795',
];

const holidays = [
  { day: 1, month: 1 },
  { day: 12, month: 1 },
  { day: 24, month: 3 },
  { day: 17, month: 4 },
  { day: 18, month: 4 },
  { day: 1, month: 5 },
  { day: 2, month: 6 },
  { day: 23, month: 6 },
  { day: 30, month: 6 },
  { day: 7, month: 8 },
  { day: 18, month: 8 },
  { day: 13, month: 10 },
  { day: 3, month: 11 },
  { day: 17, month: 11 },
  { day: 8, month: 12 },
  { day: 25, month: 12 },
];

function isHolidayOrSunday(date) {
  if (date.getDay() === 0) return true;
  return holidays.some(
    (h) =>
      date.getDate() === h.day && date.getMonth() + 1 === h.month,
  );
}

function buildCalendar(year, monthIndex, professionalName) {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDay.getDate();

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const rows = [];
  let currentRow = new Array(7).fill(null);
  let startDay = firstDay.getDay();

  for (let i = 0; i < startDay; i++) {
    currentRow[i] = null;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, monthIndex, d);
    const col = (startDay + d - 1) % 7;
    const cell = {
      day: d,
      red: isHolidayOrSunday(date),
    };

    currentRow[col] = cell;

    if (col === 6 || d === daysInMonth) {
      rows.push(currentRow);
      currentRow = new Array(7).fill(null);
    }
  }

  return {
    professional: professionalName,
    dayNames,
    rows,
  };
}

export default function ControlAgendas() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(0); // 0-11
  const [profSel, setProfSel] = useState('Todos');

  const [modalAbrir, setModalAbrir] = useState(false);
  const [modalMod, setModalMod] = useState(false);
  const [modalBloq, setModalBloq] = useState(false);
  const [profModal, setProfModal] = useState('');

  const calendars = useMemo(() => {
    const profList =
      profSel === 'Todos' ? professionals : [profSel];
    return profList.map((p) => buildCalendar(year, month, p));
  }, [year, month, profSel]);

  function openModal(tipo, profesional) {
    setProfModal(profesional);
    if (tipo === 'A') setModalAbrir(true);
    if (tipo === 'M') setModalMod(true);
    if (tipo === 'B') setModalBloq(true);
  }

  return (
    <section id="control-agendas-section">
      <div className="controls">
        <label htmlFor="year-select">Año:</label>
        <select
          id="year-select"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value, 10))}
        >
          {Array.from({ length: currentYear - 2009 }, (_, i) => 2010 + i).map(
            (y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ),
          )}
        </select>

        <label htmlFor="month-select">Mes:</label>
        <select
          id="month-select"
          value={monthNames[month]}
          onChange={(e) =>
            setMonth(monthNames.indexOf(e.target.value))
          }
        >
          {monthNames.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <label htmlFor="professional-select">Profesional:</label>
        <select
          id="professional-select"
          value={profSel}
          onChange={(e) => setProfSel(e.target.value)}
        >
          {professionals.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
          <option value="Todos">Todos</option>
        </select>
      </div>

      <div id="calendars-container" className="calendars">
        {calendars.map((cal) => (
          <div key={cal.professional} className="calendar">
            <h3>{cal.professional}</h3>
            <table>
              <thead>
                <tr>
                  {cal.dayNames.map((d) => (
                    <th key={d}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cal.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => {
                      if (!cell) return <td key={j} />;
                      if (cell.red) {
                        return (
                          <td key={j} className="red-bg">
                            {cell.day}
                          </td>
                        );
                      }
                      return (
                        <td key={j}>
                          <div className="time-header">AM PM</div>
                          <div className="day-num">{cell.day}</div>
                          <div className="badge-row">
                            <span
                              className="badge badge-a"
                              onClick={() =>
                                openModal('A', cal.professional)
                              }
                            >
                              A
                            </span>
                            <span
                              className="badge badge-m"
                              onClick={() =>
                                openModal('M', cal.professional)
                              }
                            >
                              M
                            </span>
                            <span
                              className="badge badge-b"
                              onClick={() =>
                                openModal('B', cal.professional)
                              }
                            >
                              B
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <ModalAbrirHorario
        open={modalAbrir}
        profesional={profModal}
        onClose={() => setModalAbrir(false)}
      />
      <ModalModificarHorario
        open={modalMod}
        profesional={profModal}
        onClose={() => setModalMod(false)}
      />
      <ModalBloquearRango
        open={modalBloq}
        profesional={profModal}
        onClose={() => setModalBloq(false)}
      />
    </section>
  );
}
