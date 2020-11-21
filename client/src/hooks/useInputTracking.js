import { useState } from 'react';

export default function useInputTracking(){
  const [values, setValues] = useState({});

  const handleChange = event => {
    event.persist();
    setValues(values => ({...values, [event.target.name]: event.target.value }));
  }
  const resetInputTracking = () => setValues(values => ({}));

  return { values, handleChange, resetInputTracking };
}
