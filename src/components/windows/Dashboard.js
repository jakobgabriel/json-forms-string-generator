import React, { useEffect, useState, useMemo } from "react"
import { connect } from "react-redux"

import { ipcRenderer } from "electron"

import MainPanel from "../main/MainPanel"
import Master from "../master/Master"
import ConfirmModal from "../modals/ConfirmModal"

import { updateIsOpen, saveUni } from "../../actions"

const save = saveUni

import { getActives } from "../../Funtions"

import debounce from "lodash.debounce"

const Dashboard = ({ isMasterExpanded, updateIsOpen, saveUni, isUniOpened, unis }) => {
  const changeHandler = (event) => {
    // console.log("changed")
    // saveUni()
    // save()
  }

  // useEffect(() => {
  //   debouncedChangeHandler()
  // }, [unis])

  const debouncedChangeHandler = useMemo(() => debounce(changeHandler, 1000), [])

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    setIsOpen: (value) => setConfirmModal({ ...confirmModal, open: value }),
    title: "",
    message: "",
    icon: "",
    isOpen: false,
    btns: [],
  })

  useEffect(() => {
    let listener = () => {
      if (isUniOpened) {
        setConfirmModal({
          ...confirmModal,
          title: "Opening new file",
          message: "Do you want to save the current file ?",
          icon: "delete",
          isOpen: true,
          btns: [
            {
              name: "Save",
              action: () => {
                saveUni()
                setTimeout(() => {
                  ipcRenderer.send("close")
                }, 250)
              },
            },
            {
              name: "Don't Save",
              action: () => ipcRenderer.send("close"),
            },
            {
              name: "Cancel",
              action: () => {},
            },
          ],
        })
      } else ipcRenderer.send("close")
    }

    ipcRenderer.on("closeApp", listener)

    return () => ipcRenderer.removeListener("closeApp", listener)
  }, [isUniOpened])

  useEffect(() => {
    let listener = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "m" || e.key === "M")) {
        updateIsOpen({ isMasterExpanded: !isMasterExpanded })
      }
    }
    document.body.addEventListener("keydown", listener)

    return () => document.body.removeEventListener("keydown", listener)
  }, [isMasterExpanded])

  return (
    <div className="dashboard">
      {isMasterExpanded ? null : <MainPanel />}
      <Master />
      <ConfirmModal {...confirmModal} />
    </div>
  )
}

const mapStateToProps = (state) => {
  let { isUniOpened } = getActives(state)

  return {
    activeMasterSession: state.unis.activeMasterSession,
    isMasterExpanded: state.isOpen.isMasterExpanded,
    isUniOpened,
    unis: state.unis,
  }
}

export default connect(mapStateToProps, { updateIsOpen, saveUni })(Dashboard)
