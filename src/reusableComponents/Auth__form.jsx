import React from 'react'
import logo from "../assets/logo.webp";
import Auth__image__input from './Auth__image__input';


const Auth__form = ({top__greeting,address,blank_profile,image,handleChange}) => {
  return (
    <form aria-label="Sign Up Form">
    <div className="form__top">
      <img src={logo} alt="dummygram logo" />
      <div className="greetings">
        <h3>Hey, hello 👋</h3>
        <p>{top__greeting}</p>
      </div>
    </div>
    <div className="form__bottom">
     <Auth__image__input address={address} blank_profile={blank_profile} image={image} handleChange={handleChange}/>
    </div>
  </form>

  )
}

export default Auth__form