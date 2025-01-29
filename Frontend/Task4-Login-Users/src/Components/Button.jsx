
function Button(props){
  return(
    <button className="bg-emerald-500 rounded-sm p-2 cursor-pointer hover:bg-emerald-600 focus:bg-emerald-600">
      {props.content}
    </button>
  );
}

export default Button;