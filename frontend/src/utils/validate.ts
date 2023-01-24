import { RegisterOptions } from 'react-hook-form';

const emailOptions: RegisterOptions = {
  required: {
    value: true,
    message: 'Enter a email',
  },
  maxLength: {
    value: 100,
    message: 'Please enter the correct email with no more than 100 characters',
  },
  pattern: {
    value:
      /\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/g,
    message: 'Please enter the correct email',
  },
};

const nameOptions: RegisterOptions = {
  required: {
    value: true,
    message: 'Name is required',
  },
  maxLength: {
    value: 20,
    message: 'Please enter the name with no more than 20 characters',
  },
};

const passwordOptions: RegisterOptions = {
  required: {
    value: true,
    message: 'Enter a password',
  },
  maxLength: {
    value: 50,
    message: 'Please enter 4 to 50 characters of English letters and numbers',
  },
  minLength: {
    value: 4,
    message: 'Please enter 4 to 50 characters of English letters and numbers',
  },
  pattern: /[.*a-zA-Z\d]{4,50}/g,
};

const projectNameOptions: RegisterOptions = {
  required: {
    value: true,
    message: 'Project name is required',
  },
  maxLength: {
    value: 20,
    message: 'Please enter the name with no more than 20 characters',
  },
};

export { emailOptions, nameOptions, passwordOptions, projectNameOptions };
