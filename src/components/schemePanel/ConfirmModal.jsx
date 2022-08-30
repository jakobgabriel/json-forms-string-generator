import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'

import './confirmModal.scss'

export default function ConfirmModal({
  open,
  setOpen,
  message,
  handleConfirm,
}) {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div className="confirmModal">
        {message}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              handleConfirm()
              setOpen(false)
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  )
}
