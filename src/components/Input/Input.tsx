import React, { ChangeEvent, FunctionComponent } from "react";

import "./Input.scss";
interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  setValue?: (val: string) => void;
  defaultValue?: string;
  state?: string[];
  validator?: (state:string) => void;
  setState?: (state:string[]) => void;
  placeholder?: string;
  disable?:boolean
  onClick?:()=>void;
}

const Input: FunctionComponent<FormInputProps> = ({
  id,
  label,
  type = "text",
  value,
  setValue,
  defaultValue,
  state,
  validator,
  placeholder,
  setState,
  disable,
  onClick
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState && (setState([]));
    setValue && (setValue(event.target.value));
    validator!(event.target.value);
  };

  return (
    <div className={`input ${state ? state[0] : ""} ${id}`}>
      {label !== "" && <p>{label}</p>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoCapitalize="off"
        onClick={onClick}
        autoComplete={disable ? "off":"on"}
        className={
          (type === "date" && value === "") ? "empty-date" : "" 
        }
      />
      {state?.length! > 0  && <p className="error-message">{state![1]}</p>}
    </div>
  );
};

export default Input;
