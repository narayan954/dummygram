import React, { useState } from 'react';
import App from '../../App';
import Expenses from '../Expenses/Expenses';
import './ExpenseForm.css';


const ExpenseForm = () => {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');
  const [enteredDate, setEnteredDate] = useState('');
  const[expenses,NewExpenses]=useState('');
  const titleChangeHandler = (event) => {
    setEnteredTitle(event.target.value);
  };

  const amountChangeHandler = (event) => {
    setEnteredAmount(event.target.value);

  };

  const dateChangeHandler = (event) => {
    setEnteredDate(event.target.value);

  };
const submitForm=() =>{
    if(enteredAmount!=="" && enteredDate!=="" && enteredTitle!==""){
       const expense={
        id: 'e'+expenses.length,
        title: enteredTitle,
        amount: enteredAmount,
        date: new Date(enteredDate),
      }
        NewExpenses((expenses)=>[...expenses,expense]);
        setEnteredAmount("");
        setEnteredDate("");
        setEnteredTitle("");
    }
}
  return (
    <form>
      <div className='new-expense__controls'>
        <div className='new-expense__control'>
          <label>Title</label>
          <input type='text' onChange={titleChangeHandler} />
        </div>
        <div className='new-expense__control'>
          <label>Amount</label>
          <input
            type='number'
            min='0.01'
            step='0.01'
            onChange={amountChangeHandler}
          />
        </div>
        <div className='new-expense__control'>
          <label>Date</label>
          <input
            type='date'
            min='2019-01-01'
            max='2022-12-31'
            onChange={dateChangeHandler}
          />
        </div>
      </div>
      <div className='new-expense__actions'>
        <button type='submit' onclick={submitForm}>Add Expense</button>
      </div>
    </form>
  )
};

export default ExpenseForm;