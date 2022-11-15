import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
} from '@material-ui/core';
import { Controller } from 'react-hook-form';
import { FormInputProps } from './FormInputProps';
import axios from 'axios';

export const FormInputMultiCheckbox: React.FC<FormInputProps> = ({
  name,
  control,
  setValue,
  label,
  list = [],
}) => {
  const [data, setData] = React.useState<Record<string, unknown>>({});
  const request_url = '/api/labels/';

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

  const options_list = temp.split(',');

  const options = options_list?.map(function (e) {
    return { label: e, value: e };
  });

  console.log(options);

  // const [selectedItems, setSelectedItems] = useState<string[]>([]);
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
                      />
                    );
                  }}
                  control={control}
                />
              }
              label={option.label}
              key={option.value}
            />
          );
        })}
      </div>
    </FormControl>
  );
};
