import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'

import './confirmDelete.scss'

export default function AlertDialog({
  open,
  setOpen,
  deleteId,
  setSchemes,
  schemes,
}) {
  const handleClose = () => {
    setOpen(false)
  }

  const handleDelete = () => {
    window.localStorage.removeItem(deleteId)
    setSchemes(schemes.filter((schema) => schema.id !== deleteId))
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <div className='confirmDelete'>
        Are you sure you want to delete this schema ?
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Confrim
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  )
}
