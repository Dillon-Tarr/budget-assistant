import { React } from 'react';
import { connect } from 'react-redux';
import { Chart } from "react-google-charts";

import { getOutgoBreakdownData } from '../../helpers/get-occurrences'

import useInputTracking from '../../hooks/useInputTracking';
import useHideOrUnhide from '../../hooks/useHideOrUnhide';


function OutgoBreakdownButton(props) {
  const { hideState, hideOrUnhide, hide } = useHideOrUnhide({
    outgoBreakdown: true
  });
  const { values, handleChange } = useInputTracking({
    referencePeriod: "month",
    multiplesOfPeriod: "1",
    includeInfrequentExpenses: "true",
    includeOneTimeExpenses: "true"
  });
  const pieChartData = [["Category", "Amount"]].concat(getOutgoBreakdownData(props.outgo, values.referencePeriod, values.multiplesOfPeriod, values.includeOneTimeExpenses, values.includeInfrequentExpenses));
  const pieOptions = {
    title: "Outgo breakdown by category",
    backgroundColor: "beige",
    slices: [
      {
        color: "#2BB673"
      },
      {
        color: "#d91e48"
      },
      {
        color: "#007fad"
      },
      {
        color: "#e9a227"
      }
    ],
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: "233238",
        fontSize: 14
      }
    },
    tooltip: {
      showColorCode: true
    },
    chartArea: {
      left: 0,
      top: 0,
      width: "100%",
      height: "80%"
    },
    fontName: "Roboto",
    is3D: true
  };
  return (<>
  <button className="main-button" onClick={() => hideOrUnhide("outgoBreakdown")}>Outgo breakdown by category</button><br/>
  {!hideState.outgoBreakdown && (
  <div name="outgoBreakdown" id="outgo-breakdown">
      <Chart
        chartType="PieChart"
        loader={<div>Loading Chart...</div>}
        data={pieChartData}
        options={pieOptions}
        graph_id="PieChart"
        width={"90vw"}
        height={"400px"}
        legend_toggle
      />
      <div id="outgo-breakdown-options">Breakdown for next&nbsp;
      <label htmlFor="multiplesOfPeriod">
          <input name="multiplesOfPeriod" id="multiplesOfPeriod" onChange={handleChange}
          value={values.multiplesOfPeriod || ""} type="number" min="1" max="12" step="1" required/>
        </label>
        <label htmlFor="referencePeriod">
          <select name="referencePeriod" id="referencePeriod" onChange={handleChange} defaultValue={values.referencePeriod}>
            <option value="month">month{values.multiplesOfPeriod !== "1" && "s"}</option>
            <option value="week">week{values.multiplesOfPeriod !== "1" && "s"}</option>
            <option value="year">year{values.multiplesOfPeriod !== "1" && "s"}</option>
          </select>
        </label><br/>
        <label htmlFor="includeInfrequentExpenses">Include infrequent expenses?&nbsp;
        <select name="includeInfrequentExpenses" id="includeInfrequentExpenses" onChange={handleChange} defaultValue={values.includeInfrequentExpenses}>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label><br/>
      {values.includeInfrequentExpenses === "true" && (<><label htmlFor="includeOneTimeExpenses">Include one-time expenses?&nbsp;
        <select name="includeOneTimeExpenses" id="includeOneTimeExpenses" onChange={handleChange} defaultValue={values.includeOneTimeExpenses}>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label><br/></>)}
      </div>
    <button className="main-button" onClick={() => hide("outgoBreakdown")}>Close</button><br/>
  </div>
  )}
    
  </>)
}

export default connect()(OutgoBreakdownButton);