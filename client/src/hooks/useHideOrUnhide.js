import { useState } from 'react';

export default function useHideOrUnhide(namesAndHideStates){
  // namesAndHideStates: { nameOfSomeHtmlElement: booleanForWhetherItShouldStartHidden, anotherElementName, anotherBoolean } true to hide, false to NOT hide
  const [hideState, changeHideState] = useState(namesAndHideStates);

  const hideOrUnhide = name => { // Switch from true (hidden) to false (NOT hidden) or vice versa, given the name of the HTML element.
    changeHideState(hideState => ({...hideState, [name]: !hideState[name] }));
  }

  return { hideState, hideOrUnhide };
}
