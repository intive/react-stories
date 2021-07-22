import React, { useEffect, useState } from 'react'


export const customRenderer = {
  renderer: ({ story, action, isPaused, config, messageHandler }) => {
    useEffect(() => {
      action('play')
    }, [story])
    return <p style={{color: 'white', backgroundColor: 'red'}}>
      <h2>{story.title}</h2>
    </p>
  },
  tester: (story) => {
    return {
      condition: story.type === 'hcVideo',
      priority: 999
    }
  }
}
