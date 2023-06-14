import React, { useState } from "react";

export default function Numericinput(
  props : {
    inputMode? : "search" | "text" | "numeric" | "none" | "tel" | "url" | "email" | "decimal" | undefined,
    className? : string,
    id : string,
    name? : string,
    placeholder? : string,
    value : string | number,
    required? : boolean,
    onChange? : Function,
    min? : number,
    max? : number
  },
) {

  return (
    // focus → keydown → keypress → input → keyup → change → blur
    <input
        inputMode={props.inputMode || undefined}
        className={props.className}
        id={props.id}
        name={props.name||props.id}
        type="number"
        placeholder={props.placeholder}
        required={props.required || false}
        value={props.value}
        onChange={(e)=>{ props.onChange && props.onChange(e)}}
        min={props.min}
        max={props.max}
      />
  )
};