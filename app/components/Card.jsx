import React from 'react'
import styles from './components.module.css'

const Card = ({title, iconName, children}) => {
  return (
    <div className={styles.cardContainer}>
        <div className={styles.cardTop}>
           <p>{title}</p>
           <span>{`<${iconName}/>`}</span>
        </div>
        <div className={styles.cardBottom}>
            {children}
        </div>
    </div>
  )
}

export default Card 