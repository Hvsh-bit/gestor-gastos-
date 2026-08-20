import { useState, useEffect } from 'react'
import './App.css'

function App() {

const [tipo, setTipo] = useState('gasto')
const [monto, setMonto] = useState('')
const [categoria, setCategoria] = useState('')
const [descripcion, setDescripcion] = useState('')
const [transacciones, setTransacciones] = useState([])
const [idEditando, setIdEditando] = useState(null)

useEffect(() => {
  fetch('http://127.0.0.1:8000/transacciones')
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      setTransacciones(datos)
    })
    .catch((error) => {
      console.error('Error al obtener transacciones:', error)
    })
}, [])

async function agregarTransaccion() {

    if (monto === '' || categoria === '' || descripcion === '') {
      alert('Debes completar todos los campos')
      return
    }

    if (idEditando !== null) {
      const transaccionActualizada = {
        tipo: tipo,
        monto: Number(monto),
        categoria: categoria,
        descripcion: descripcion
      }

      try {
        const respuesta = await fetch(
          `http://127.0.0.1:8000/transacciones/${idEditando}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaccionActualizada)
          }
        )

        if (!respuesta.ok) {
          throw new Error('Error al actualizar la transacción')
        }

        const datosActualizados = await respuesta.json()

        const transaccionesActualizadas = transacciones.map((transaccion) =>
          transaccion.id === idEditando
            ? datosActualizados
            : transaccion
        )

        setTransacciones(transaccionesActualizadas)
        setIdEditando(null)

      } catch (error) {
        console.error('Error:', error)
        alert('No se pudo actualizar la transacción')
        return
      }

    } else {

    const nuevaTransaccion = {
      tipo: tipo,
      monto: Number(monto),
      categoria: categoria,
      descripcion: descripcion
    }

    try {
      const respuesta = await fetch(
        'http://127.0.0.1:8000/transacciones',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(nuevaTransaccion)
        }
      )

      if (!respuesta.ok) {
        throw new Error('Error al crear la transacción')
      }

      const transaccionCreada = await respuesta.json()

      setTransacciones([
        ...transacciones,
        transaccionCreada
      ])

    } catch (error) {
      console.error('Error:', error)
      alert('No se pudo guardar la transacción')
      return
    }
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

  async function eliminarTransaccion(id) {
    try {
      const respuesta = await fetch(
        `http://127.0.0.1:8000/transacciones/${id}`,
        {
          method: 'DELETE'
        }
      )

      if (!respuesta.ok) {
        throw new Error('Error al eliminar la transacción')
      }

      const nuevasTransacciones = transacciones.filter(
        (transaccion) => transaccion.id !== id
      )

      setTransacciones(nuevasTransacciones)

      if (idEditando === id) {
        cancelarEdicion()
      }

    } catch (error) {
      console.error('Error:', error)
      alert('No se pudo eliminar la transacción')
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
