/* eslint-disable no-mixed-operators */
import { React, useState } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { connect } from 'react-redux';
import $ from 'jquery'

import { convertDaysOfWeek } from "../../helpers/manipulate-dates"
import useInputTracking from '../../hooks/useInputTracking';
import useHideOrUnhide from '../../hooks/useHideOrUnhide';

import { addOutgo } from '../../actions/budgetActions';

function AddOutgoButton(props) {
  const { hideState, hideOrUnhide, hide } = useHideOrUnhide({
    addOutgoForm: true
  });
  const [startDate, setStartDate] = useState(new Date());
  const [inclusiveEndDate, setInclusiveEndDate] = useState(new Date(startDate.getTime() + 157701600000));
  const { values, handleChange, resetInputTracking } = useInputTracking();
  const handleAdd = () => {
    const allValues = {...values};
    allValues.startDate = startDate;
    allValues.inclusiveEndDate = inclusiveEndDate;
    if (values.recurringType === "normal"){
      if (values.referencePeriod === "week") {
        allValues.daysOfWeek = [];
        const daysOfWeek = $(".daysOfWeek:checked");
        for (let i = 0; i < daysOfWeek.length; i++) allValues.daysOfWeek.push(daysOfWeek[i].value);
        if (daysOfWeek.length === 0) allValues.daysOfWeek.push(`${convertDaysOfWeek([startDate.getDay()])}`);
      }
      else if (values.referencePeriod === "month"){
        allValues.daysOfMonth = [];
        const daysOfMonth = $(".daysOfMonth:checked");
        for (let i = 0; i < daysOfMonth.length; i++) allValues.daysOfMonth.push(daysOfMonth[i].value);
        if (daysOfMonth.length === 0) allValues.daysOfMonth.push(`day${startDate.getDate()}`);
      }
    }
    props.addOutgo(props.budgetId, allValues);
    hide("addOutgoForm");
    resetInputTracking();
  }
  return (<>
    <button className="main-button" onClick={() => hideOrUnhide("addOutgoForm")}>Add outgo</button><br/>
    {!hideState.addOutgoForm && (
    <div className="add-income-or-outgo-container">
    <div name="addOutgoForm" className="add-income-or-outgo">
      <label htmlFor="outgoName">
        Enter a name for the outgo:<br/>e.g. Water bill<br/><input id="outgoName" onChange={handleChange} name="outgoName"
        value={values.outgoName || ""} type="text" minLength="1" maxLength="32" size="26" required autoFocus/>
      </label><br/>
      <label htmlFor="dollarsPerOccurrence">
        How many dollars per occurrence?<br/>$<input id="dollarsPerOccurrence" onChange={handleChange} name="dollarsPerOccurrence"
        value={values.dollarsPerOccurrence || ""} type="number" min="1" max="1000000000" step="1" required/>
      </label><br/>
      <label htmlFor="category">Category?<br/>
        <select name="category" id="category" onChange={handleChange} defaultValue="null">
          <option value="null"></option>
          <option value="Food">Food</option>
          <option value="Clothing">Clothing</option>
          <option value="Shelter">Shelter</option>
          <option value="Household needs">Household needs</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Utilities">Utilities</option>
          <option value="Transportation">Transportation</option>
          <option value="Debt">Debt</option>
          <option value="Giving">Giving</option>
          <option value="Insurance">Insurance</option>
          <option value="Fun">Fun</option>
          <option value="custom">custom category</option>
        </select>
      </label><br/>
      {values.category === "custom" && (<><label htmlFor="customCategory">
        Custom category name:<br/><input id="customCategory" onChange={handleChange} name="customCategory"
        value={values.customCategory || ""} type="text" minLength="1" maxLength="32" size="26"/>
      </label><br/></>)}
      <label htmlFor="isRecurring">Is this outgo recurring?<br/>
        <select name="isRecurring" id="isRecurring" onChange={handleChange} defaultValue="null">
          <option value="null"></option>
          <option value="false">No, it just happens once.</option>
          <option value="true">Yes, it happens multiple times.</option>
        </select>
      </label><br/>
      {values.outgoName && values.dollarsPerOccurrence && values.isRecurring === "false" && (<>
      When does it occur?
      <DatePicker selected={startDate}
      onChange={date => setStartDate(date)}
      minDate={new Date()}
      maxDate={new Date(startDate.getTime() + 1262304000000)}
      showDisabledMonthNavigation
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"/><br/>
      </>)}
      {values.outgoName && values.dollarsPerOccurrence && values.isRecurring === "true" && (<>
      When does it start?
      <DatePicker selected={startDate}
      onChange={date => {
        const endDate = new Date(inclusiveEndDate);
        const difference = endDate.getTime() - startDate.getTime();
        setStartDate(date);
        setInclusiveEndDate(date.getTime() + difference)
      }}
      minDate={new Date()}
      maxDate={new Date(new Date().getTime() + 1262304000000)}
      showDisabledMonthNavigation
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"/><br/>
      And when does it end?
      <DatePicker selected={inclusiveEndDate}
      onChange={date => setInclusiveEndDate(date)}
      minDate={startDate}
      maxDate={new Date(startDate.getTime() + 1262304000000)}
      showDisabledMonthNavigation
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"/><br/>
      </>)}
      {values.outgoName && values.dollarsPerOccurrence && values.isRecurring === "true" && (<>
      <label htmlFor="recurringType">What kind of pattern does it follow?<br/>
      A <i>normal</i> pattern like "Every Monday and Friday", "Once a  year", or "The 1st and 15th of every month"<br/>
      <u>or</u> an <i>unusual</i> pattern like "On the last Sunday of every month"?<br/>
        <select name="recurringType" id="recurringType" onChange={handleChange} defaultValue={values.recurringType || "null"}>
          <option value="null"></option>
          <option value="normal">normal</option>
          <option value="unusual">unusual</option>
        </select>
      </label><br/>
      </>)}
      {values.outgoName && values.dollarsPerOccurrence && values.isRecurring === "true" && values.recurringType === "normal" && (<>
      <label htmlFor="referencePeriod">What is the reference period?<br/>
        <select name="referencePeriod" id="referencePeriod" onChange={handleChange} defaultValue={values.referencePeriod || "null"}>
          <option value="null"></option>
          <option value="month">month(s)</option>
          <option value="week">week(s)</option>
          <option value="year">year(s)</option>
          <option value="day">day(s)</option>
        </select>
      </label><br/>
        {values.referencePeriod && (<>
        <label htmlFor="multiplesOfPeriod">Every how many {values.referencePeriod}(s) does this outgo occur? (max 12)<br/>
          <input name="multiplesOfPeriod" id="multiplesOfPeriod" onChange={handleChange}
          value={values.multiplesOfPeriod || ""} type="number" min="1" max="12" step="1" required/>
        </label><br/>
          {values.multiplesOfPeriod && values.referencePeriod === "week" && (<>
          On which day(s) of the week?<br/>
          <label htmlFor="sunday"><input name="sunday" id="sunday" type="checkbox" value="Sunday" className="daysOfWeek"/>Sunday&nbsp;&nbsp;&nbsp;</label>
          <label htmlFor="monday"><input name="monday" id="monday" type="checkbox" value="Monday" className="daysOfWeek"/>Monday&nbsp;&nbsp;&nbsp;</label>
          <label htmlFor="tuesday"><input name="tuesday" id="tuesday" type="checkbox" value="Tuesday" className="daysOfWeek"/>Tuesday&nbsp;&nbsp;&nbsp;</label><br/>
          <label htmlFor="wednesday"><input name="wednesday" id="wednesday" type="checkbox" value="Wednesday" className="daysOfWeek"/>Wednesday&nbsp;&nbsp;&nbsp;</label>
          <label htmlFor="thursday"><input name="thursday" id="thursday" type="checkbox" value="Thursday" className="daysOfWeek"/>Thursday&nbsp;&nbsp;&nbsp;</label><br/>
          <label htmlFor="friday"><input name="friday" id="friday" type="checkbox" value="Friday" className="daysOfWeek"/>Friday&nbsp;&nbsp;&nbsp;</label>
          <label htmlFor="saturday"><input name="saturday" id="saturday" type="checkbox" value="Saturday" className="daysOfWeek"/>Saturday&nbsp;&nbsp;&nbsp;</label><br/>
          </>)}
          {values.multiplesOfPeriod && values.referencePeriod === "month" && (<>
          On which day(s) of the month?<br/>
          <label htmlFor="day1"><input name="day1" id="day1" type="checkbox" value="day1" className="daysOfMonth"/>1&nbsp;&nbsp;</label>
          <label htmlFor="day2"><input name="day2" id="day2" type="checkbox" value="day2" className="daysOfMonth"/>2&nbsp;&nbsp;</label>
          <label htmlFor="day3"><input name="day3" id="day3" type="checkbox" value="day3" className="daysOfMonth"/>3&nbsp;&nbsp;</label>
          <label htmlFor="day4"><input name="day4" id="day4" type="checkbox" value="day4" className="daysOfMonth"/>4&nbsp;&nbsp;</label>
          <label htmlFor="day5"><input name="day5" id="day5" type="checkbox" value="day5" className="daysOfMonth"/>5&nbsp;&nbsp;</label>
          <label htmlFor="day6"><input name="day6" id="day6" type="checkbox" value="day6" className="daysOfMonth"/>6&nbsp;&nbsp;</label><br/>
          <label htmlFor="day7"><input name="day7" id="day7" type="checkbox" value="day7" className="daysOfMonth"/>7&nbsp;&nbsp;</label>
          <label htmlFor="day8"><input name="day8" id="day8" type="checkbox" value="day8" className="daysOfMonth"/>8&nbsp;&nbsp;</label>
          <label htmlFor="day9"><input name="day9" id="day9" type="checkbox" value="day9" className="daysOfMonth"/>9&nbsp;&nbsp;</label>
          <label htmlFor="day10"><input name="day10" id="day10" type="checkbox" value="day10" className="daysOfMonth"/>10&nbsp;&nbsp;</label>
          <label htmlFor="day11"><input name="day11" id="day11" type="checkbox" value="day11" className="daysOfMonth"/>11&nbsp;&nbsp;</label><br/>
          <label htmlFor="day12"><input name="day12" id="day12" type="checkbox" value="day12" className="daysOfMonth"/>12&nbsp;&nbsp;</label>
          <label htmlFor="day13"><input name="day13" id="day13" type="checkbox" value="day13" className="daysOfMonth"/>13&nbsp;&nbsp;</label>
          <label htmlFor="day14"><input name="day14" id="day14" type="checkbox" value="day14" className="daysOfMonth"/>14&nbsp;&nbsp;</label>
          <label htmlFor="day15"><input name="day15" id="day15" type="checkbox" value="day15" className="daysOfMonth"/>15&nbsp;&nbsp;</label>
          <label htmlFor="day16"><input name="day16" id="day16" type="checkbox" value="day16" className="daysOfMonth"/>16&nbsp;&nbsp;</label><br/>
          <label htmlFor="day17"><input name="day17" id="day17" type="checkbox" value="day17" className="daysOfMonth"/>17&nbsp;&nbsp;</label>
          <label htmlFor="day18"><input name="day18" id="day18" type="checkbox" value="day18" className="daysOfMonth"/>18&nbsp;&nbsp;</label>
          <label htmlFor="day19"><input name="day19" id="day19" type="checkbox" value="day19" className="daysOfMonth"/>19&nbsp;&nbsp;</label>
          <label htmlFor="day20"><input name="day20" id="day20" type="checkbox" value="day20" className="daysOfMonth"/>20&nbsp;&nbsp;</label>
          <label htmlFor="day21"><input name="day21" id="day21" type="checkbox" value="day21" className="daysOfMonth"/>21&nbsp;&nbsp;</label><br/>
          <label htmlFor="day22"><input name="day22" id="day22" type="checkbox" value="day22" className="daysOfMonth"/>22&nbsp;&nbsp;</label>
          <label htmlFor="day23"><input name="day23" id="day23" type="checkbox" value="day23" className="daysOfMonth"/>23&nbsp;&nbsp;</label>
          <label htmlFor="day24"><input name="day24" id="day24" type="checkbox" value="day24" className="daysOfMonth"/>24&nbsp;&nbsp;</label>
          <label htmlFor="day25"><input name="day25" id="day25" type="checkbox" value="day25" className="daysOfMonth"/>25&nbsp;&nbsp;</label>
          <label htmlFor="day26"><input name="day26" id="day26" type="checkbox" value="day26" className="daysOfMonth"/>26&nbsp;&nbsp;</label><br/>
          <label htmlFor="day27"><input name="day27" id="day27" type="checkbox" value="day27" className="daysOfMonth"/>27&nbsp;&nbsp;</label>
          <label htmlFor="day28"><input name="day28" id="day28" type="checkbox" value="day28" className="daysOfMonth"/>28&nbsp;&nbsp;</label>
          <label htmlFor="day29"><input name="day29" id="day29" type="checkbox" value="day29" className="daysOfMonth"/>29&nbsp;&nbsp;</label>
          <label htmlFor="day30"><input name="day30" id="day30" type="checkbox" value="day30" className="daysOfMonth"/>30&nbsp;&nbsp;</label>
          <label htmlFor="day31"><input name="day31" id="day31" type="checkbox" value="day31" className="daysOfMonth"/>31&nbsp;&nbsp;</label><br/>
          </>)}
        </>)}
      </>)}
      {values.outgoName && values.dollarsPerOccurrence && values.isRecurring === "true" && values.recurringType === "unusual" && (<>
        <label htmlFor="weekOfMonth">When does the outgo occur?<br/>The&nbsp;
          <select name="weekOfMonth" id="weekOfMonth" onChange={handleChange} defaultValue={values.weekOfMonth || "null"}>
            <option value="null"></option>
            <option value="first">&nbsp;first</option>
            <option value="second">&nbsp;second</option>
            <option value="third">&nbsp;third</option>
            <option value="fourth">&nbsp;fourth</option>
            <option value="last">&nbsp;last</option>
          </select>
        </label>
        <label htmlFor="dayOfWeek">
          <select name="dayOfWeek" id="dayOfWeek" onChange={handleChange} defaultValue={values.dayOfWeek || "null"}>
            <option value="null"></option>
            <option value="Sunday">Sunday</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
          </select>
        </label> of every month.<br/>
      </>)}
      {values.outgoName && values.outgoName.length >= 1 && values.dollarsPerOccurrence && values.dollarsPerOccurrence >= 1 && values.dollarsPerOccurrence <= 1000000000 &&
      (values.isRecurring === "false"
      ||
      (values.isRecurring === "true"
        &&
        (values.recurringType === "normal" && values.referencePeriod && values.referencePeriod !== "null" && values.multiplesOfPeriod && values.multiplesOfPeriod !== "" && values.multiplesOfPeriod >= 1 && values.multiplesOfPeriod <= 12)
        ||
        (values.recurringType === "unusual" && values.weekOfMonth && values.weekOfMonth !== "null" && values.dayOfWeek && values.dayOfWeek !== "null")
      )) && (<>
        <label htmlFor="doRemind">Would you like reminders for this outgo?<br/>
          <select name="doRemind" id="doRemind" onChange={handleChange} defaultValue="null">
            <option value="null"></option>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </label><br/>
      </>)}
      {values.doRemind === "true" && (<>
        <label htmlFor="remindThisManyDaysBefore">
        How many days before?<br/><input id="remindThisManyDaysBefore" onChange={handleChange} name="remindThisManyDaysBefore"
        value={values.remindThisManyDaysBefore || ""} type="number" min="1" max="365" step="1" required/>
        </label><br/></>)}
      {values.outgoName && values.outgoName.length >= 1 && values.dollarsPerOccurrence && values.dollarsPerOccurrence >= 1 && values.dollarsPerOccurrence <= 1000000000 &&
      (values.isRecurring === "false"
      ||
      (values.isRecurring === "true"
        &&
        (values.recurringType === "normal" && values.referencePeriod && values.referencePeriod !== "null" && values.multiplesOfPeriod && values.multiplesOfPeriod !== "" && values.multiplesOfPeriod >= 1 && values.multiplesOfPeriod <= 12)
        ||
        (values.recurringType === "unusual" && values.weekOfMonth && values.weekOfMonth !== "null" && values.dayOfWeek && values.dayOfWeek !== "null")
      ))
      &&
      (values.doRemind === "false" || (values.doRemind === "true" && values.remindThisManyDaysBefore && values.remindThisManyDaysBefore >= 1 && values.remindThisManyDaysBefore <= 365))
      && <button className="main-button" onClick={() => handleAdd()}>Add</button>}
      <br/><br/><br/><br/>
    </div>
    </div>)}
  </>)
}

const mapDispatchToProps = {
  addOutgo
}

AddOutgoButton.propTypes = {
  addOutgo: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(AddOutgoButton);