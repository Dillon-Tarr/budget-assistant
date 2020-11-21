import React from 'react';
import { connect, useSelector } from 'react-redux';
import AddOutgoButton from './buttons/AddOutgoButton';

import { getOccurrenceString } from '../helpers/string-generators';
import { setDateToMidday } from '../helpers/manipulate-dates'
import RemoveOutgoButton from './buttons/RemoveOutgoButton';


function Outgo(props) {
  const budget = useSelector(state => state.budget);

  const renderOutgo = () => {
    if (budget.outgo.length === 0) return <p>None yet.</p>;
    const outgo = [];
    for (let i = 0; i < budget.outgo.length; i++) {
      const occurrenceString = getOccurrenceString(budget.outgo[i]);
      let startDate = new Date(budget.outgo[i].startDate);
      startDate = startDate.toDateString();
      if (budget.outgo[i].isRecurring) {
        var inclusiveEndDate = new Date(budget.outgo[i].inclusiveEndDate);
        inclusiveEndDate = inclusiveEndDate.toDateString();
      }
      if (budget.outgo[i].doRemind) {
        var muteRemindersUntil = new Date(budget.outgo[i].muteRemindersUntil);
        muteRemindersUntil = setDateToMidday(muteRemindersUntil.getTime());
        const today = setDateToMidday(Date.now());
        if (muteRemindersUntil.getTime() < today.getTime()) var muteDateIsInPast = true;
        muteRemindersUntil = muteRemindersUntil.toDateString();
      }
      outgo.push(
        <div className="income-or-outgo" key={budget.outgo[i]._id}>
          <p>
          <u>{budget.outgo[i].name}</u> {budget.outgo[i].category !== "Uncategorized" && (<>- {budget.outgo[i].category}</>)}<br/>
          {occurrenceString}<br/>
          {budget.outgo[i].isRecurring && (<>starting </>)}
          {!budget.outgo[i].isRecurring && (<>on </>)}
          {(<>{startDate},<br/></>)}
          {budget.outgo[i].isRecurring && (<>
          ending {inclusiveEndDate};<br/></>)}
          {budget.outgo[i].doRemind && muteDateIsInPast && (<>Reminding {budget.outgo[i].remindThisManyDaysBefore} days before<br/></>)}
          {budget.outgo[i].doRemind && !muteDateIsInPast && (<>Reminders muted until {muteRemindersUntil}</>)}</p>
          <div className="income-or-outgo-buttons">
            {/*<button className="main-button" onClick={() => modifyOutgo(budget.outgo[i]._id)}>Modify</button><br/>*/}
            <RemoveOutgoButton budgetId={budget._id} outgoId={budget.outgo[i]._id}/>
          </div>
        </div>
      )
    }
    return outgo;
  }
  
  return (
    <div id="all-outgo">
      <h3>Budgeted outgo:</h3>
      <div>
        {renderOutgo()}
        <AddOutgoButton budgetId={budget._id}/>
      </div>
    </div>
  )
}

export default connect()(Outgo);