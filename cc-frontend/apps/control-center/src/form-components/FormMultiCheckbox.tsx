import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Typography,
} from '@mui/material';
import axios from 'axios';

import url_backend from '../configs/url';
import { FormInputProps } from './FormInputProps';

// component for multicheckbox
export const FormInputMultiCheckbox: React.FC<FormInputProps> = ({
  name,
  control,
  setValue,
  label,
  list = [],
}) => {
  const [data, setData] = React.useState<Record<string, unknown>>({});

  // label data passed
  const request_url = url_backend + '/api/labels/';

  const getAPIData = async () => {
    try {
      const data = await axios.get<Record<string, unknown>>(request_url);

      setData(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    getAPIData();
  }, []);

  let temp = String(data[0]);
  temp = temp.slice(1, -2);

  //  options have both label(display data) and value
  const options_list = temp.split(',');

  const options = options_list?.map(function (e) {
    return { label: e, value: e };
  });

  const [selectedItems, setSelectedItems] = useState<string[]>(list);

  const handleSelect = (value: string) => {
    if (selectedItems !== undefined) {
      const isPresent = selectedItems.indexOf(value);
      if (isPresent !== -1) {
        const remaining = selectedItems.filter((item) => item !== value);
        setSelectedItems(remaining);
      } else {
        setSelectedItems((prevItems) => [...prevItems, value]);
      }
    }
  };
  // to check the previously selected items
  useEffect(() => {
    setValue(name, selectedItems);
  }, [selectedItems]);

  return (
    <FormControl size={'small'} variant={'outlined'}>
      <FormLabel component="legend">{label}</FormLabel>

      <div>
        {options?.map((option) => {
          return (
            <FormControlLabel
              control={
                <Controller
                  name={name}
                  render={() => {
                    return (
                      <Checkbox
                        checked={selectedItems?.includes(option.value)}
                        onChange={() => handleSelect(option.value)}
                        size="small"
                      />
                    );
                  }}
                  control={control}
                />
              }
              label={<Typography variant="body2"> {option.label}</Typography>}
              key={option.value}
            />
          );
        })}
      </div>
    </FormControl>
  );
};
