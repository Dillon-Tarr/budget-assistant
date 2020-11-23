import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import useHideOrUnhide from '../../hooks/useHideOrUnhide';

import { goToPage } from '../../actions/viewActions';

function Learn(props) {
  const { hideState, hideOrUnhide } = useHideOrUnhide({
    whyBudget: true,
    whatIf: true,
    whyThisApp: true
  });

  return (<>
    <div className="learn">
      <h3>A note from me</h3>
      <p>My opinion about budgeting doesn't matter all too much, but 
      something that does matter is that one of these two things, for most people, is true — either:</p>
      <ol>
        <li>You are the master (or steward) of your money.<br/><i>or</i></li>
        <li>Money is your master.</li>
      </ol>
      <p>
      If the former is true, and you want to keep it that way, then budgeting is a good step you can take to prevent case two.</p>
      <p>If you're not sure who is the master in your relationship with finances, or if it is readily apparent to you that 
      something needs to change with regard to money and you, it would be wise for you to tally up where all those dollars are actually going.</p>
      <p>And that's essentially what budgeting is: marked awareness of the money that is coming into and going out of your possession.</p>
      <h3>Answers to some questions you may have</h3>
      <button className="main-button" onClick={() => hideOrUnhide("whyBudget")}>Why budget?</button><br/>
      {!hideState.whyBudget && (
      <div name="whyBudget">
        <p>That's simple. Make a budget because the act of doing so helps you keep <i>you</i> from getting in the way of your goals.</p>
      </div>)}
      <button className="main-button" onClick={() => hideOrUnhide("whatIf")}>What if I don't have a list of all my expenses?</button><br/>
      {!hideState.whatIf && (
      <div name="whatIf">
        <p>That's okay! An estimate (even a rough one) of the amount you're spending can at least help you see where some of your money is going and help you check if it's going where you want it to go.</p>
      </div>)}
      <br/><p>Warning, somewhat long answer ahead.</p>
      <button className="main-button" onClick={() => hideOrUnhide("whyThisApp")}>How should I use this app?</button><br/>
      {!hideState.whyThisApp && (
      <div name="whyThisApp">
        Here goes:
        <h3>What this app does NOT do:</h3>
        <ul>
          <li>This app does not track or represent the value of any of your accounts.</li>
          <li>This app does not act as a log of your financial transactions.</li>
          <li>This app does not manage money. Rather, it is a tool to help YOU manage money.</li>
        </ul>

        <h3>Intended use:</h3>
        The purpose of this app is to help you...
        <ol>
          <li>track and view your income and/or expenses <b>generallly</b>, <i>as you record/list them</i>.</li>
          <li><i>quickly</i> calculate how much money would be in an account on a certain date given:
            <ol>
              <li>the start date you select,</li>
              <li>the start amount you enter, and</li>
              <li>the income and expenses expected between the start and end dates.</li>
            </ol>
          </li>
          <li>categorize your monthly expenses and view the breakdown of your expenses by category.</li>
          <li>list financial or general goals and mark them as completed so you can see the progress you have made.</li>
        </ol>
        
        <h3>Some suggestions:</h3>
        <p>If you're new to budgeting, you should consider keeping a log of every dollar that comes into your account(s) and every dollar that leaves your account(s) over a certain time period (you can start with a day, week or month).</p>
        <p>If it isn't your habit to check your income against your expenses, this might reveal money habits you didn't know you had and help you start using your money the way you *want* to use your money.</p>
        <p>Occasionally check that the categories and items you have listed in your budget closely align with your actual expenditures and income. The more frequently your expenditures or income change, the more important it is that you check <b>expected</b> income/outgo against <b>actual</b> income/outgo.</p>
        <p>Estimating with relative accuracy the amount of money to expect in your account on a future date is what makes it possible to plan reasonably for future expenses large and small.</p>
      </div>)}
      <h3>Helpful links</h3>
      <ul>
        <li><a href="https://www.everydollar.com/blog/how-to-create-a-monthly-budget">Every Dollar</a></li>
        <li><a href="https://www.daveramsey.com/blog/the-truth-about-budgeting/">Rachel Cruze</a></li>
        <li><a href="https://www.forbes.com/advisor/personal-finance/how-to-budget-simple-steps/">Forbes</a></li>
        <li><a href="https://www.incharge.org/financial-literacy/budgeting-saving/how-to-make-a-budget/">InCharge Debt Solutions</a></li>  
        <li><a href="https://www.consumer.gov/sites/www.consumer.gov/files/pdf-1020-make-budget-worksheet_form.pdf">Printable budget form</a></li>  
      </ul><br/><br/><br/>
    </div>
  </>)
}

const mapDispatchToProps = {
  goToPage
}

Learn.propTypes = {
  goToPage: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Learn);