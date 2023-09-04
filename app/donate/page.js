import React from 'react'
import DonateForm from '../components/DonateForm'
const Page = ({searchParams}) => {
  return (
    <>
    <DonateForm amount={searchParams.amount}/>
    </>
  )
}

export default Page  