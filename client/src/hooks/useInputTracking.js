import { useState } from 'react';

export default function useInputTracking(initialState = {}){
  const [values, setValues] = useState(initialState);

  const handleChange = event => {
    event.persist();
    setValues(values => ({...values, [event.target.name]: event.target.value }));
  }
  const resetInputTracking = () => setValues(values => initialState);

  return { values, handleChange, resetInputTracking };
}
