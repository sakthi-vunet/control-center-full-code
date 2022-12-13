// interface for Radio button option value and
//label to be displayed for that coresponding option value

export interface options {
  label: string;
  value: string;
}

export interface FormInputProps {
  name: string;
  control: any;
  label: string;
  setValue?: any;
  list?: string[];
  options?: options[];
}
