import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { Controller } from "react-hook-form";
import { FormInputProps } from "./FormInputProps";
import { options } from "./FormInputProps";

// const options = [
//   {
//     label: "Web",
//     value: "Web",
//   },
//   {
//     label: "App",
//     value: "App",

//   },
//   {
//     label: "DB",
//     value: "DB",

//   },
//   {
//     label: "Common",
//     value: "Common",

//   },
  
// ];



export const FormInputRadio: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  options,

}) => {
  // export const generateRadioOptions = () => {
  //   const [optionData,setOptionData]=React.useState<options[]>([]);

    
  //   return options.map((singleOption) => (
  //     <FormControlLabel
  //       value={singleOption.value}
  //       label={singleOption.label}
  //       control={<Radio />}
  //     />
  //   ));
  // };
  const [optionData,setOptionData]=React.useState<any>([]);

  React.useEffect(() => {
    setOptionData(options);
  }, []);



  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, value },
          fieldState: { error },
          formState,
        }) => (
          <RadioGroup row value={value} onChange={onChange}>
                {optionData?.map((singleOption) => (
      <FormControlLabel
        value={singleOption.value}
        label={singleOption.label}
        control={<Radio />}
      />))}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
};
