import React, { useState, useMemo, useEffect } from 'react'
import './addSchemeModal.scss'

import { Dialog, TextField } from '@mui/material'

import { useForm } from 'react-hook-form'
import { ipcRenderer } from 'electron'
import debounce from 'lodash.debounce'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import JsonInput from '../jsonInput/JsonInput'
import ConfirmModal from '../schemePanel/ConfirmModal'

import {
  isJson,
  isJsonEmpty,
  isValidAjvScheme,
  isJsonWithElements,
  returnElements,
} from '../../functions'

var ReactOverflowTooltip = require('react-overflow-tooltip')

import OverflowTip from '../overflowTip/OverflowTip'

const schema = yup
  .object({
    name: yup.string().required(),
    seperator: yup.string().required(),
    schema: yup
      .object()
      .test('isJson', 'schema is not in a json form', isJson)
      .test('isJsonEmpty', 'schema json is empty', isJsonEmpty)
      .test({
        name: 'isAjvValid',
        skipAbsent: true,
        test(value, ctx) {
          return isValidAjvScheme(value, ctx)
        },
      })
      .required(),
    uischema: yup
      .object()
      .test('isJson', 'ui schema is not in a json form', isJson)
      .test('isJsonEmpty', 'ui schema json is empty', isJsonEmpty)
      .test('isJsonWithElements', 'ui schema is invalid', isJsonWithElements),
  })
  .required()

let updatedData = {}

const AddSchemeModal = ({
  open,
  onClose,
  schemes,
  setSchemes,
  toEditSchema,
}) => {
  const [isOpeningURL, setIsOpeningURL] = useState(false)
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = React.useState(false)

  const openURL = useMemo(
    (e) =>
      debounce(
        () => {
          setIsOpeningURL(true)
          ipcRenderer.send('open-link', 'https://jsonforms.io/examples/basic')
          setTimeout(() => {
            setIsOpeningURL(false)
          }, 1000)
        },
        1000,
        { leading: true, trailing: false }
      ),
    []
  )

  const defaultValues = {
    name: '',
    seperator: '',
    schema: {},
    uischema: {},
  }

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  })

  useEffect(() => {
    reset(toEditSchema ? toEditSchema : defaultValues)
  }, [toEditSchema])

  const onSubmit = handleSubmit((data) => {
    if (toEditSchema) {
      updatedData = data
      setIsUpdateConfirmOpen(true)
    } else {
      let id = window.crypto.randomUUID()
      let dataOrder = returnElements(data.uischema)
      window.localStorage.setItem(
        id,
        JSON.stringify({ id, dataOrder, ...data }).replaceAll('\n', '')
      )
      setSchemes([...schemes, { id, dataOrder, ...data }])
      setTimeout(() => {
        reset()
      }, 300)
      onClose()
    }
  })

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={onSubmit} className="addSchemeModal">
        <svg onClick={onClose} className="addSchemeModal__close">
          <use xlinkHref="./svg/close.svg#close"></use>
        </svg>

        <div className="addSchemeModal__title__group">
          <h2 className="addSchemeModal__title">
            {toEditSchema ? `Edit ${toEditSchema.name}` : 'Add Form Schema'}
          </h2>
          <div className="addSchemeModal__error">
            <OverflowTip
              someLongText={
                Object.keys(errors).length
                  ? Object.values(errors)[0].message
                  : ''
              }
              value={
                Object.keys(errors).length
                  ? Object.values(errors)[0].message
                  : ''
              }
            />
          </div>

          {/* <ReactOverflowTooltip title="Error">
              {

                
            </div>
            <div className="addSchemeModal__error">
              too lond adsf asdf asdf d fasdf asdf asdf df asdf sadf sadf fasd
              fasd fasdfasdf dfas dfas fdf asdf asdf asdf asdadsf asdf sadf sdf
              asdf asdfg text
            </div>
          </ReactOverflowTooltip> */}
        </div>

        <div className="addSchemeModal__fields">
          <div>
            <TextField
              {...register('name')}
              // className={`login__input ${errors.name && 'input--invalid'}`}
              id="standard-basic"
              label="Name"
              variant="standard"
              style={{ marginLeft: '0.4rem' }}
            />
          </div>

          <div>
            <TextField
              {...register('seperator')}
              // className={`login__input ${errors.name && 'input--invalid'}`}
              id="standard-basic"
              label="Seperator"
              variant="standard"
              style={{ marginLeft: '0.4rem' }}
            />
          </div>
        </div>

        <div className="addSchemeModal__textareas">
          <div className="addSchemeModal__textareas__element">
            <div className="addSchemeModal__textareas__title">Schema</div>
            {/* <TextArea {...register('schema')} /> */}

            <JsonInput
              id="json1"
              name="schema"
              setValue={setValue}
              error={errors.schema}
              value={getValues('schema')}
              // {...register('schema')}?
            />

            {/* <TextArea {...register('schema')} /> */}
          </div>
          <div className="addSchemeModal__textareas__element">
            <div className="addSchemeModal__textareas__title">UI Schema</div>
            <JsonInput
              id="json2"
              name="uischema"
              setValue={setValue}
              error={errors.uischema}
              value={getValues('uischema')}
            />
          </div>
        </div>
        <div
          onClick={openURL}
          className="addSchemeModal__btn addSchemeModal__btn--info"
        >
          {isOpeningURL ? (
            <svg>
              <use xlinkHref="./svg/globe.svg#globe"></use>
            </svg>
          ) : (
            <svg>
              <use xlinkHref="./svg/info-circle.svg#info-circle"></use>
            </svg>
          )}
        </div>

        <button className="addSchemeModal__btn">
          {toEditSchema ? (
            <svg>
              <use xlinkHref="./svg/save.svg#save"></use>
            </svg>
          ) : (
            <svg>
              <use xlinkHref="./svg/plus.svg#plus"></use>
            </svg>
          )}
        </button>
      </form>

      <ConfirmModal
        open={isUpdateConfirmOpen}
        setOpen={setIsUpdateConfirmOpen}
        message="Are you sure you want to update this schema ?"
        handleConfirm={() => {
          let dataOrder = returnElements(updatedData.uischema)

          window.localStorage.setItem(
            toEditSchema.id,
            JSON.stringify({ ...updatedData, dataOrder }).replaceAll('\n', '')
          )
          setSchemes(
            schemes.map((scheme) => {
              if (scheme.id === toEditSchema.id)
                return { ...updatedData, dataOrder }
              return scheme
            })
          )

          setTimeout(() => {
            reset()
          }, 300)
          onClose()
        }}
      />
    </Dialog>
  )
}

export default AddSchemeModal
