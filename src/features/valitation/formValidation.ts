import React, {useCallback, useEffect, useState} from 'react';

export interface UseFormResult {
  isValid: boolean;
  isSubmited: boolean;
  setIsSubmited: (val: boolean) => void;
  errors: Array<string>;
  setErrors: (params: Array<string>) => void;
  isValidating: boolean;
  validate: () => Promise<boolean>;
}

export const useForm = (
  validateFunc: () => Promise<boolean>,
): UseFormResult => {
  const [isFormValid, setFormIsValid] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [errors, setErrors] = useState<Array<string>>([]);

  const validate = useCallback(async (): Promise<boolean> => {
    setIsSubmited(true);
    setIsValidating(true);
    let isValid = false;
    try {
      isValid = await Promise.resolve(validateFunc());
    } catch (err) {
      isValid = false;
    } finally {
      setIsValidating(false);
    }
    setFormIsValid(isValid);
    return isValid;
  }, [validateFunc]);

  // Validate form again on any change
  useEffect(() => {
    if (isSubmited) {
      validate();
    }
  }, [isSubmited, validate]);

  return {
    isValid: isFormValid,
    isSubmited,
    setIsSubmited,
    errors,
    setErrors,
    isValidating,
    validate,
  };
};

export interface UseFieldResult<T> {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  errorText: string;
  hasError: boolean;
  setErrorText: React.Dispatch<React.SetStateAction<string>>;
  onChange: (value: T) => void;
}
export const useField = <T>(defaultValue: T): UseFieldResult<T> => {
  const [value, setValue] = useState(defaultValue);
  const [errorText, setErrorText] = useState('');
  const handleChange = (v: T) => {
    setValue(v);
  };
  const hasError = !!errorText;
  return {
    value,
    setValue,
    errorText,
    hasError,
    setErrorText,
    onChange: handleChange,
  };
};

export const valReq = (field: UseFieldResult<any>, errorText: string) => {
  if (
    typeof field.value === 'string' &&
    field.value &&
    field.value.trim() === ''
  ) {
    field.setErrorText(errorText);
    return false;
  }

  if (field.value) {
    field.setErrorText('');
    return true;
  }

  field.setErrorText(errorText);
  return false;
};

export const sameValue = (
  fields: Array<UseFieldResult<any>>,
  errorText: string,
) => {
  const firstVal = fields[0].value;
  for (let i = 1; i < fields.length; i++) {
    if (firstVal !== fields[i].value) {
      fields.forEach((x) => x.setErrorText(errorText));
      return false;
    }
  }

  fields.forEach((x) => x.setErrorText(''));
  return true;
};

const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const emailVal = (field: UseFieldResult<any>, errorText: string) => {
  if (emailRegex.test(field.value)) {
    field.setErrorText('');
    return true;
  }

  field.setErrorText(errorText);
  return false;
};
