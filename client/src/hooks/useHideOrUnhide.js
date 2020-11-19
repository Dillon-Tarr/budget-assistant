import { useState } from 'react';

export default function useHideOrUnhide(namesAndHideStates){
  // namesAndHideStates: { nameOfSomeHtmlElement: booleanForWhetherItShouldStartHidden, anotherElementName, anotherBoolean } true to hide, false to NOT hide
  const [hideState, changeHideState] = useState(namesAndHideStates);

  const hideOrUnhide = name => { // Switch from true (hidden) to false (NOT hidden) or vice versa, given the name of the HTML element.
    changeHideState(hideState => ({...hideState, [name]: !hideState[name] }));
  }
  const unhide = name => { // Switch to false (NOT hidden), given the name of the HTML element.
    changeHideState(hideState => ({...hideState, [name]: false }));
  }
  const hide = name => { // Switch to true (hidden), given the name of the HTML element.
    changeHideState(hideState => ({...hideState, [name]: true }));
  }
  
  return { hideState, hideOrUnhide, unhide, hide };
}
