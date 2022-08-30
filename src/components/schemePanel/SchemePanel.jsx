import React from 'react'
import ConfirmModal from './ConfirmModal'
import './schemePanel.scss'

const SchemePanel = ({
  schemes,
  setSchemes,
  setActiveSchemeId,
  activeSchemeId,

  setIsAddModalOpen,
  setToEditSchema,
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState(false)

  const setActive = (id) => {
    setActiveSchemeId(id)
    window.localStorage.setItem('active', id)
  }

  const editSchema = (e, schema) => {
    e.stopPropagation()
    setToEditSchema(schema)
    setIsAddModalOpen(true)
  }

  const deleteSchema = (e, id) => {
    e.stopPropagation()
    setDeleteId(id)
    setIsDeleteConfirmOpen(true)
  }

  return (
    <div className="schemePanel">
      <div className="schemePanel__title">Schemes</div>
      <div className="schemePanel__body">
        {schemes.length !== 0 ? (
          schemes.map((schema) => (
            <div
              onClick={() => setActive(schema.id)}
              className={`schemePanel__item ${
                schema.id === activeSchemeId ? 'schemePanel__item--active' : ''
              }`}
              key={schema.id}
            >
              <div className="schemePanel__item__group">
                <svg className="schemePanel__item__icon">
                  <use xlinkHref="./svg/circle.svg#circle"></use>
                </svg>
                <div className="schemePanel__item__name">{schema.name}</div>
              </div>

              <svg
                onClick={(e) => editSchema(e, schema)}
                className="schemePanel__item__oicon schemePanel__item__oicon--edit"
              >
                <use xlinkHref="./svg/edit.svg#edit"></use>
              </svg>

              <svg
                onClick={(e) => deleteSchema(e, schema.id)}
                className="schemePanel__item__oicon schemePanel__item__oicon--trash"
              >
                <use xlinkHref="./svg/trash-alt.svg#trash-alt"></use>
              </svg>
            </div>
          ))
        ) : (
          <div className="schemePanel__empty">click + to get started</div>
        )}
      </div>

      <ConfirmModal
        open={isDeleteConfirmOpen}
        setOpen={setIsDeleteConfirmOpen}
        message="Are you sure you want to delete this schema ?"
        handleConfirm={() => {
          window.localStorage.removeItem(deleteId)
          setSchemes(schemes.filter((schema) => schema.id !== deleteId))
        }}
      />
    </div>
  )
}

export default SchemePanel
