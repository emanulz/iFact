import React from 'react'
import alertify from 'alertifyjs'
import {connect} from 'react-redux'
import Select2 from 'react-select2-wrapper'
import { saveItem, setItem, updateItem, deleteItem, getNextNumericCode } from '../../utils/api'
import { checkClientMovementData } from '../actions'

@connect((store) => {
  return {
    movements: store.receivable.clientmovements,
    movement: store.receivable.clientmovementActive,
    clients: store.clients.clients
  }
})
export default class Fields extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_CLIENT_MOVEMENT', payload: ''})

    if (this.props.update) {
      const code = this.props.location.pathname.split('/').pop()

      const kwargs = {
        db: 'general',
        docType: 'CLIENT_MOVEMENT',
        lookUpField: 'document',
        lookUpValue: parseInt(code),
        lookUpName: 'documento',
        modelName: 'movimentos de clientes',
        dispatchType: 'SET_CLIENT_MOVEMENT'
      }

      this.props.dispatch(setItem(kwargs))
    }
  }

  handleInputChange(event) {

    const target = event.target
    let value

    console.log(target.type)

    switch (target.type) {
      case 'checkbox':
      {
        value = target.checked
        break
      }
      case 'number':
      {
        value = parseFloat(target.value)
          ? parseFloat(target.value)
          : ''
        break
      }
      case 'date':
      {
        const today = new Date()
        const dateInput = target.value.split('-')
        today.setDate(dateInput[2])
        today.setMonth(dateInput[1] - 1)
        today.setYear(dateInput[0])
        value = today
        break
      }
      default:
      {
        value = target.value
      }
    }

    const name = target.name

    const movement = {
      ...this.props.movement
    }

    movement[name] = value

    this.props.dispatch({type: 'SET_CLIENT_MOVEMENT', payload: movement})
  }

  saveBtn() {
    const movement = this.props.movement
    const movements = this.props.movements

    movement.document = getNextNumericCode(movements, 'document')

    const fieldsOk = checkClientMovementData(movement, movements)

    if (fieldsOk) {
      movement.created = new Date()
      const obj = {
        db: 'general',
        item: movement,
        sucessMessage: 'Movimiento creado correctamente',
        errorMessage: 'Hubo un error al crear el Movimiento, intente de nuevo.',
        dispatchType: 'CLEAR_CLIENT_MOVEMENT'
      }

      this.props.dispatch(saveItem(obj))
    }
  }

  updateBtn() {

    const movement = this.props.movement
    const movements = this.props.movements.filter(item => item.department == movement.department)
    const fieldsOk = checkClientMovementData(movement, movements)

    if (fieldsOk) {
      movement.updated = new Date()
      const obj = {
        db: 'general',
        item: movement,
        modelName: 'Movimento de cliente',
        dispatchType: 'SET_CLIENT_MOVEMENT'
      }
      this.props.dispatch(updateItem(obj))
    }
  }

  deleteBtn() {

    const movement = this.props.movement
    const _this = this
    const obj = {
      db: 'general',
      item: movement,
      modelName: 'Movimento de Producto',
      dispatchType: 'CLEAR_CLIENT_MOVEMENT'
    }
    // ALERTIFY CONFIRM
    alertify.confirm('Eliminar', `Desea Eliminar el Movimento de Producto ${movement.document}? Esta acción no se puede deshacer.`, function() {
      _this.props.dispatch(deleteItem(obj))
    }, function() {
      return true
    }).set('labels', {
      ok: 'Si',
      cancel: 'No'
    })
  }

  render() {
    // ********************************************************************
    // BUTTONS
    // ********************************************************************
    const buttons = this.props.update
      ? <div className='col-xs-10 col-sm-offset-1'>
        <div className='col-xs-12'>
          <button onClick={this.updateBtn.bind(this)} className=' form-control btn-success'>
            Actualizar
          </button>
        </div>

        <div className='col-xs-12'>
          <button className='form-control btn-primary'>
            Guardar y agregar otro
          </button>
        </div>

        <div className='col-xs-12'>
          <button onClick={this.deleteBtn.bind(this)} className='form-control btn-danger'>
            Eliminar
          </button>
        </div>
      </div>
      : <div className='col-xs-10 col-sm-offset-1'>
        <div className='col-xs-12'>
          <button onClick={this.saveBtn.bind(this)} className=' form-control btn-success'>
            Guardar
          </button>
        </div>

        <div className='col-xs-12'>
          <button className='form-control btn-primary'>
            Guardar y agregar otro
          </button>
        </div>

        <div className='col-xs-12'>
          <button className='form-control btn-danger'>
            Cancelar
          </button>
        </div>
      </div>

    // ********************************************************************
    // CLIENTS FOR SELECT
    // ********************************************************************
    const clients = this.props.clients

    const clientsWithCredit = clients.length
      ? clients.filter(client => client.has_credit)
      : []

    const clientsSelect = clientsWithCredit.map(client => {
      return {text: `${client.code} - ${client.name} ${client.last_name}`, id: client._id}
    })

    // ********************************************************************
    // DATE TO SET
    // ********************************************************************
    let date = this.props.movement.date
    if (date && this.props.update) {
      const newDate = new Date(date)
      date = `${newDate.getFullYear()}-${('0' + (newDate.getMonth() + 1)).slice(-2)}-${('0' + newDate.getDate()).slice(-2)}`
    }
    if (this.props.create) {
      const newDate = date
      date = `${newDate.getFullYear()}-${('0' + (newDate.getMonth() + 1)).slice(-2)}-${('0' + newDate.getDate()).slice(-2)}`
    }

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 row'>

      <div className='col-xs-6 create-fields-container first'>

        <span>Datos generales</span>
        <hr />

        <div className='form-group row create-input-block'>
          <div className='col-xs-12'>

            <label>Fecha</label>
            <input value={date} name='date' onChange={this.handleInputChange.bind(this)} type='date' className='form-control' />

          </div>
        </div>

        <div className='form-group row create-input-block'>
          <div className='col-xs-12'>

            <label>Cliente</label>
            <Select2
              name='clientId'
              value={this.props.movement.clientId}
              className='form-control'
              onSelect={this.handleInputChange.bind(this)}
              data={clientsSelect}
              options={{
                placeholder: 'Elija un cliente...'
              }}
            />

          </div>
        </div>

        <div className='form-group row create-input-block'>

          <div className='col-xs-12'>

            <label>Departamento</label>
            <select value={this.props.movement.type} name='type' onChange={this.handleInputChange.bind(this)} className='form-control'>
              <option value='DEBIT'> Débito </option>
              <option value='CREDIT'> Crédito </option>
            </select>

          </div>
        </div>

        <div className='form-group row create-input-block'>

          <div className='col-xs-12'>

            <label>Cantidad</label>
            <input value={this.props.movement.amount} name='amount' onChange={this.handleInputChange.bind(this)} type='number' className='form-control' />

          </div>
        </div>

        <div className='form-group row create-input-block'>

          <div className='col-xs-12'>

            <label>Detalle</label>
            <input value={this.props.movement.description} name='description' onChange={this.handleInputChange.bind(this)} type='text' className='form-control' />

          </div>
        </div>

      </div>

      <div className='col-xs-12 col-sm-6 create-fields-container buttons second'>

        <span>Crear</span>
        <hr />
        {buttons}
      </div>

    </div>
  }
}