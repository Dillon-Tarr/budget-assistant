import { React, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { setDateToMidday, getShortenedDateString } from '../../helpers/manipulate-dates'
import { getOrderedIncomeAndOutgo, getDataBetweenDates } from '../../helpers/get-occurrences'

import useInputTracking from '../../hooks/useInputTracking';
import useHideOrUnhide from '../../hooks/useHideOrUnhide';

function FutureValueCalculator(props) {
  const income = useSelector(state => state.budget.income);
  const outgo = useSelector(state => state.budget.outgo);
  const orderedIncomeAndOutgo = getOrderedIncomeAndOutgo(income, outgo);
  const [startDate, setStartDate] = useState(new Date());
  const [inclusiveEndDate, setInclusiveEndDate] = useState(new Date(startDate.getTime() + 2592000000));
  const dataBetweenDates = getDataBetweenDates(orderedIncomeAndOutgo, startDate, inclusiveEndDate);
  const { hideState, hideOrUnhide, hide } = useHideOrUnhide({
    incomeAndOutgoTable: true
  });
  const { values, handleChange } = useInputTracking({
    startAmount: "0"
  });

  const renderIncomeAndOutgoBetweenDates = () => {
    const renderedOccurrences = [];
    for (let i = 0; i < dataBetweenDates.incomeAndOutgo.length; i++) {
      let positive = "";
      if (dataBetweenDates.incomeAndOutgo[i].type === "income") positive = "positive"
      renderedOccurrences.push(
        <tr className="rendered-occurrence" key={`dataBetweenDates.incomeAndOutgoIndex${[i]}`}>
          <td>&nbsp;{dataBetweenDates.incomeAndOutgo[i].name}</td>
          <td className={positive}>&nbsp;${dataBetweenDates.incomeAndOutgo[i].amount}</td>
          <td>&nbsp;{getShortenedDateString(setDateToMidday(dataBetweenDates.incomeAndOutgo[i].ms))}</td>
          <td>{dataBetweenDates.incomeAndOutgo[i].category && (<>&nbsp;{dataBetweenDates.incomeAndOutgo[i].category}</>)}</td>
        </tr>
      )
    }
    return renderedOccurrences;
  }
  return (
    <div id="future-value-calculator">
      <h3>Future value calculator:</h3>
      Start date: <DatePicker selected={startDate}
      onChange={date => {
        const endDate = new Date(inclusiveEndDate);
        const difference = endDate.getTime() - startDate.getTime();
        setStartDate(date);
        setInclusiveEndDate(date.getTime() + difference)
      }}
      minDate={new Date()}
      maxDate={new Date(Date.now() + 1262304000000)}
      showDisabledMonthNavigation
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"/><br/>
      End date: <DatePicker selected={inclusiveEndDate}
      onChange={date => setInclusiveEndDate(date)}
      minDate={new Date(startDate.getTime() + 86400000)}
      maxDate={new Date(startDate.getTime() + 378691200000)}
      showDisabledMonthNavigation
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"/><br/>
      <label htmlFor="startAmount">
        Starting amount:<br/>$<input id="startAmount" onChange={handleChange} name="startAmount"
        value={values.startAmount} type="number" min="0" max="1000000000" step="1"/>
      </label><br/>
      <p>Net increase: ${dataBetweenDates.netIncrease}<br/>
      Future value: ${parseInt(values.startAmount) + dataBetweenDates.netIncrease}
      </p>
      <button className="main-button" onClick={() => hideOrUnhide("incomeAndOutgoTable")}>{hideState.incomeAndOutgoTable ? "Show" : "Hide"} income/outgo table</button><br/>
      {!hideState.incomeAndOutgoTable && (<>
        <table name="incomeAndOutgoTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>{renderIncomeAndOutgoBetweenDates()}</tbody>
      </table>
      <br/><br/>
      </>)}
      
    </div>
    )
}

export default connect()(FutureValueCalculator);