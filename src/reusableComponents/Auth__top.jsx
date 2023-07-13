import React from 'react'

const Auth__top = ({logo,heading,top__greeting}) => {
  return (
    <div className="form__top">
    <img src={logo} alt="dummygram logo" />
    <div className="greetings">
      <h3>{heading}</h3>
      <p>{top__greeting}</p>
    </div>
  </div>
)
}

export default Auth__top