import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { Controller } from "react-hook-form";
import { FormInputProps } from "./FormInputProps";


export const FormInputRadio: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  options,

}) => {
 
  const [optionData,setOptionData]=React.useState(options);

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
