import React, { useState } from "react";
import { _isNotNumber } from "~/utils/utils";

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

  function _checkChangeValue(e : React.ChangeEvent<HTMLInputElement> | any){
    let sNativeValue = e.nativeEvent.data;
    let sTargetValue = e.target.value;

    if(sNativeValue && _isNotNumber(sNativeValue)){
        alert("최소 주문수량은 1개 입니다.");
        sTargetValue = "1";
    }
    
    if (props.max && parseInt(sTargetValue) > props.max ){
      sTargetValue = String(props.max);
    }
    
    if (props.min && parseInt(sTargetValue) < props.min ){
      sTargetValue = "1";
    }
    
    props.onChange && props.onChange(sTargetValue,props.id)
  }

  function _checkValue(e :any){
    let sTargetValue = e.target.value;
    
    if(!sTargetValue){1
      sTargetValue = props.min || 1
      alert("최소 주문수량은 1개 입니다.");

      props.onChange && props.onChange(sTargetValue,props.id)
    }
  }

  return (
    // focus → keydown → keypress → input → keyup → change → blur
    <input
        inputMode={props.inputMode || "numeric"} // // 모바일환경 숫자키패드 옵션
        className={props.className}
        id={props.id}
        name={props.name||props.id}
        type="number"
        placeholder={props.placeholder}
        required={props.required || false}
        value={props.value}
        onChange={(e)=>{ _checkChangeValue(e)}}
        onBlur={(e)=>{ _checkValue(e)}}
        min={props.min}
        max={props.max}
      />
  )
};