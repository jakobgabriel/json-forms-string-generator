import React from 'react'
import AlertDialog from './ConfirmDelete'
import './schemePanel.scss'

const SchemePanel = ({
  schemes,
  setSchemes,
  setActiveSchemeId,
  activeSchemeId,
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState(false)

  const setActive = (id) => {
    setActiveSchemeId(id)
    window.localStorage.setItem('active', id)
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
                {schema.name}
              </div>

              <svg
                onClick={(e) => deleteSchema(e, schema.id)}
                className="schemePanel__item__trash"
              >
                <use xlinkHref="./svg/trash-alt.svg#trash-alt"></use>
              </svg>
            </div>
          ))
        ) : (
          <div className="schemePanel__empty">click + to get started</div>
        )}
      </div>
      <AlertDialog
        open={isDeleteConfirmOpen}
        setOpen={setIsDeleteConfirmOpen}
        deleteId={deleteId}
        schemes={schemes}
        setSchemes={setSchemes}
      />
    </div>
  )
}

export default SchemePanel
