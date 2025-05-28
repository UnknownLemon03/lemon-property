'use client'
import React from 'react'
import { Slider } from '../ui/slider'

export default function FilterRange() {
  return (
    <>
      <div className='w-full justify-between border-0 h-full py-3 px-3'>
        <span className='text-[.9rem] font-medium'>Select Range</span>
        <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        className={"w-full mt-1"}
        />
      </div>
    </>
  )
}
