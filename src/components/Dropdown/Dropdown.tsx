import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import "./Dropdown.scss";

const Dropdown: FunctionComponent<{
  options: string[];
  value: string;
  defaultValue:string
  valueSetter:(val:string)=>void
}> = ({ options, value,defaultValue,valueSetter }) => {

  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const dropdownrRef = useRef<HTMLDivElement>(null);

  const handleClickOutsideDropdown = (event: MouseEvent) => {
    if (dropdownrRef.current && !dropdownrRef.current.contains(event.target as Node)) {
      setOpenPopup(false);
    }
  };

  const handleSelectItem = (newValue:string) => {
    if (value === newValue){
        valueSetter(defaultValue);
    } else {
        valueSetter(newValue);
    }
    setOpenPopup(false);
    
  }

  useEffect(() => {
    // Attacher l'événement lorsque le composant est monté
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
    };
  }, []);

  return (
    <div className="dropdown-wrap" ref={dropdownrRef} >
      <div className="dropdown-wrap-button" onClick={()=>setOpenPopup(!openPopup)}>
        <p>{value}</p>
        <svg
          width="10"
          height="16"
          viewBox="0 0 10 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.0086 0.120117L0.136719 4.992L1.28161 6.13689L5.0086 2.41802L8.73559 6.13689L9.88049 4.992L5.0086 0.120117Z"
            fill="currenColor"
          />
          <path
            d="M5.00898 15.8809L9.88086 11.009L8.73597 9.86408L5.00898 13.583L1.28198 9.86408L0.137092 11.009L5.00898 15.8809Z"
            fill="currenColor"
          />
        </svg>
      </div>
      {openPopup && (<div className="dropdown-wrap-options">
        {options.map((option, index) => (
          <div className={"dropdown-wrap-options-item " + (option === value && ("active"))} key={index} onClick={()=>handleSelectItem(option)}>
            {option}
          </div>
        ))}
      </div>)}
    </div>
  );
};

export default Dropdown;
