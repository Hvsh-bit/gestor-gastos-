import { useState } from 'react'

function App() {

  const [tipo, setTipo] = useState('gasto')
  const [monto, setMonto] = useState ('')
  const [categoria, setCategoria] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [transacciones, setTransacciones] = useState([])

  function agregarTransaccion() {

    if (monto === '' || categoria === '' || descripcion === '') {
    alert('Debes completar todos los campos')
    return
    }

  const nuevaTransaccion = {
    
    id: Date.now(),
    tipo: tipo,
    monto: Number(monto),
    categoria: categoria,
    descripcion: descripcion
  }

  setTransacciones([...transacciones, nuevaTransaccion])

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

  return (
        <div>
          <h1>Gestor Personal de Gastos</h1>
          <p>creado para poder administrar tu dinero mensual</p>

          <h2>Resumen</h2>

          <p>Ingresos: ${formatearDinero(totalIngresos)}</p>
          <p>Gastos: ${formatearDinero(totalGastos)}</p>
          <p>Saldo: ${formatearDinero(saldo)}</p>

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
          <option value='gasto'>Gasto</option>
          <option value='ingreso'>Ingreso</option>
          </select>
          <input
            type='number'
            placeholder='monto'
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
            type='text'
            placeholder='Descripción'
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <button onClick={agregarTransaccion}>
          Agregar movimiento
          </button>

          <p>Transacciones guardadas: {transacciones.length}</p>

          <h2>Movimientos</h2>

          {transacciones.map((transaccion) => (
            <div key={transaccion.id}>
              <p>Tipo: {transaccion.tipo}</p>
              <p>Monto: ${formatearDinero(transaccion.monto)}</p>
              <p>Categoría: {transaccion.categoria}</p>
              <p>Descripción: {transaccion.descripcion}</p>
            </div>
          ))}

          <p>Tipo seleccionado: {tipo}</p>
          <p>Monto ingresado: ${monto}</p>
        </div>
  )
}

export default App
