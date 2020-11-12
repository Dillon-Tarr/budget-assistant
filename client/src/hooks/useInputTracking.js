import { useState } from 'react';

export default function useInputTracking(){
  const [values, setValues] = useState({});

  const handleChange = event => {
    event.persist();
    setValues(values => ({...values, [event.target.name]: event.target.value }));
  }

  return { values, handleChange };
}
