import React from 'react'
import { Avatar } from '@mui/material'

function Post(prop) {
  return (
    <div className='post'>
        <div className='post__header'>
        <Avatar
            className='post__avatar'
            alt={prop.username}
            src={prop.avatar}
        />
        <h3 className='post__username'>{prop.username}</h3>
        </div>
        <img className='post__img' src={prop.imageUrl} alt="random sq" />
        <h4 className='post__text'><strong>{prop.username} </strong>{prop.caption}</h4>

    </div>
  )
}

export default Post