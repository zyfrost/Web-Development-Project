import React from 'react'

const Footer = (props) => {
  return (
    <footer>
      <div className="footer-wrapper">
        <p>Copyright {props.date.getFullYear()}</p>
      </div>
    </footer>
  )
}
export default Footer
