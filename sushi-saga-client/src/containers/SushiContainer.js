import React, { Fragment } from 'react'
import MoreButton from '../components/MoreButton'
import Sushi from '../components/Sushi'

const SushiContainer = (props) => {
  console.log(props.sushi)
  return (
    <Fragment>
      <div className="belt">
        {
          props.sushi.map((sushi, index) => {
            return <Sushi key={index} sushi={sushi} eat={props.eat} />
          })
        }
        <MoreButton more={props.more} />
      </div>
    </Fragment>
  );
}

export default SushiContainer