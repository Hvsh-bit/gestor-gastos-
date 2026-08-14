import { useState, useEffect } from 'react'
import './App.css'

function App() {

const [tipo, setTipo] = useState('gasto')
const [monto, setMonto] = useState('')
const [categoria, setCategoria] = useState('')
const [descripcion, setDescripcion] = useState('')

const [transacciones, setTransacciones] = useState(() => {
  const transaccionesGuardadas = localStorage.getItem('transacciones')

  return transaccionesGuardadas
    ? JSON.parse(transaccionesGuardadas)
    : []
})

const [idEditando, setIdEditando] = useState(null)

useEffect(() => {
  localStorage.setItem(
    'transacciones',
    JSON.stringify(transacciones)
  )
}, [transacciones])

function agregarTransaccion() {

    if (monto === '' || categoria === '' || descripcion === '') {
      alert('Debes completar todos los campos')
      return
    }

    if (idEditando !== null) {
    const transaccionesActualizadas = transacciones.map((transaccion) =>
        transaccion.id === idEditando
          ? {
              ...transaccion,
              tipo: tipo,
              monto: Number(monto),
              categoria: categoria,
              descripcion: descripcion
            }
          : transaccion
      )

      setTransacciones(transaccionesActualizadas)
      setIdEditando(null)

    } else {
      const nuevaTransaccion = {
        id: Date.now(),
        tipo: tipo,
        monto: Number(monto),
        categoria: categoria,
        descripcion: descripcion
      }

      setTransacciones([...transacciones, nuevaTransaccion])
    }

  setMonto('')
  setCategoria('')
  setDescripcion('')

}

  const totalIngresos = transacciones
    .filter((transaccion) => transaccion.tipo === 'ingreso')
    .reduce((total, transaccion) => total + transaccion.monto, 0)

  const totalGastos = transacciones
    .filter((transaccion) => transaccion.tipo === 'gasto')
    .reduce((total, transaccion) => total + transaccion.monto, 0)

  const saldo = totalIngresos - totalGastos

  function formatearDinero(valor) {
    return valor.toLocaleString('es-CL')
  }

  function eliminarTransaccion(id) {
    const nuevasTransacciones = transacciones.filter(
      (transaccion) => transaccion.id !== id
    )

    setTransacciones(nuevasTransacciones)

    if (idEditando === id) {
      cancelarEdicion()
    }
  }

  function editarTransaccion(transaccion) {
  setTipo(transaccion.tipo)
  setMonto(transaccion.monto)
  setCategoria(transaccion.categoria)
  setDescripcion(transaccion.descripcion)
  setIdEditando(transaccion.id)
  }

  function cancelarEdicion() {
  setIdEditando(null)
  setTipo('gasto')
  setMonto('')
  setCategoria('')
  setDescripcion('')
  }

  return (
        <div>
          <h1>Gestor personal de gastos</h1>
          <p>creado para poder administrar dinero mensual</p>

          <h2>Resumen</h2>

          <div className="resumen">
            <div className="resumen-card">
              <p>Ingresos</p>
              <strong>+${formatearDinero(totalIngresos)}</strong>
            </div>

            <div className="resumen-card">
              <p>Gastos</p>
              <strong>-${formatearDinero(totalGastos)}</strong>
            </div>

            <div className="resumen-card">
              <p>Saldo</p>
              <strong>${formatearDinero(saldo)}</strong>
            </div>
          </div>
          <div className="formulario">

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="gasto">Gasto</option>
              <option value="ingreso">Ingreso</option>
            </select>

            <input
              type="number"
              placeholder="Monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />

            <input
              type="text"
              placeholder="Categoría"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />

            <input
              type="text"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />

            <button onClick={agregarTransaccion}>
              {idEditando !== null ? 'Guardar cambios' : 'Agregar movimiento'}
            </button>

            {idEditando !== null && (
              <button onClick={cancelarEdicion}>
                Cancelar
              </button>
            )}
          </div>
          
          <p>Transacciones guardadas: {transacciones.length}</p>

          <h2>Movimientos</h2>

          <div className="lista-movimientos">

            {transacciones.map((transaccion) => (
              <div
                key={transaccion.id}
                className={`tarjeta ${transaccion.tipo}`}
              >

                <div>
                  <h3>{transaccion.categoria}</h3>
                  <p>{transaccion.descripcion}</p>
                </div>

                <div>
                  <strong>
                    {transaccion.tipo === 'gasto' ? '-' : '+'}
                    ${formatearDinero(transaccion.monto)}
                  </strong>

                  <div className="acciones">
                    <button onClick={() => editarTransaccion(transaccion)}>
                      Editar
                    </button>

                    <button onClick={() => eliminarTransaccion(transaccion.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  )
}

export default App
