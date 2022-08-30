import React, { useRef, useEffect, useState } from 'react'
import Tooltip from '@material-ui/core/Tooltip'

import './overflowTip.scss'

const OverflowTip = (props) => {
  // Create Ref
  const textElementRef = useRef()

  const compareSize = () => {
    const compare =
      textElementRef.current.scrollWidth > textElementRef.current.clientWidth
    setHover(compare)
  }

  // compare once and add resize listener on "componentDidMount"
  useEffect(() => {
    compareSize()
    textElementRef.current.addEventListener('mouseover', compareSize)
    window.addEventListener('resize', compareSize)
  }, [])

  // remove resize listener again on "componentWillUnmount"
  useEffect(
    () => () => {
      window.removeEventListener('resize', compareSize)
      if (textElementRef.current)
        textElementRef.current.removeEventListener('mouseover', compareSize)
    },
    []
  )

  // Define state and function to update the value
  const [hoverStatus, setHover] = useState(false)

  return (
    <Tooltip
      title={props.value}
      interactive
      disableHoverListener={!hoverStatus}
      style={{ fontSize: '2em' }}
    >
      <div
        ref={textElementRef}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {props.someLongText}
      </div>
    </Tooltip>
  )
}

export default OverflowTip
