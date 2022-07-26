import React from 'react'
import { Dialog, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'

import TextArea from '../textArea/TextArea'

import './addSchemeModal.scss'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const isJson = (jsonString) => {
  try {
    var o = JSON.parse(jsonString)
    if (o && typeof o === 'object') {
      return o
    }
  } catch (e) {}

  return false
}

const schema = yup
  .object({
    name: yup.string().required(),
    schema: yup
      .string()
      .test('isJson', 'this is not a json', isJson)
      .required(),
    uischema: yup.string().test('isJson', 'this is not a json', isJson),
  })
  .required()

const AddSchemeModal = ({ open, onClose, schemes, setSchemes }) => {
  const {
    register,
    handleSubmit,
    reset,
    // formState: {},
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = handleSubmit((data) => {
    let id = window.crypto.randomUUID()
    window.localStorage.setItem(
      id,
      JSON.stringify({ id, ...data }).replaceAll('\n', '')
    )

    setSchemes([...schemes, { id, ...data }])

    setTimeout(() => {
      reset()
    }, 300)
    onClose()
  })

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={onSubmit} className="addSchemeModal">
        <svg onClick={onClose} className="addSchemeModal__close">
          <use xlinkHref="./svg/close.svg#close"></use>
        </svg>
        <h2 className="addSchemeModal__title">Add Form Schema</h2>

        <TextField
          {...register('name')}
          // className={`login__input ${errors.name && 'input--invalid'}`}
          id="standard-basic"
          label="Name"
          variant="standard"
          style={{ marginLeft: '0.4rem' }}
        />
        <div className="addSchemeModal__textareas">
          <div className="addSchemeModal__textareas__element">
            <div className="addSchemeModal__textareas__title">Schema</div>
            <TextArea {...register('schema')} />
            {/* <TextArea {...register('schema')} /> */}
          </div>
          <div className="addSchemeModal__textareas__element">
            <div className="addSchemeModal__textareas__title">UI Schema</div>
            <TextArea {...register('uischema')} />
          </div>
        </div>
        <button className="addSchemeModal__btn">
          <svg>
            <use xlinkHref="./svg/plus.svg#plus"></use>
          </svg>
        </button>
      </form>
    </Dialog>
  )
}

export default AddSchemeModal
