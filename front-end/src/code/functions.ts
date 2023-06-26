
export function minDate(){
  let today = new Date();
  if (today.getDay() === 0){
    today.setDate(today.getDate() + 1);
  } else if
  (today.getDay() === 6){
    today.setDate(today.getDate() + 2);
  }
  return today;
}


