import React from 'react';
import { Controller } from 'react-hook-form';

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import { FormInputProps } from './FormInputProps';

// component for radio button input type

export const FormInputRadio: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  options,
}) => {
  // set optionData with props passed
  const [optionData, setOptionData] = React.useState(options);

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
              // options have value and label
              // label is the data that is displayed near the radio button
              <FormControlLabel
                value={singleOption.value}
                label={singleOption.label}
                control={<Radio />}
              />
            ))}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
};
