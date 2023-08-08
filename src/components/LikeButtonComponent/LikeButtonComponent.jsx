import React from 'react'

const LikeButtonComponent = (props) => {
    const { dataHref } = props
  return (
    <div class="fb-like" data-href={dataHref}
     data-width="" data-layout="" data-action="" data-size="" data-share="true"></div>
  )
}

export default LikeButtonComponent