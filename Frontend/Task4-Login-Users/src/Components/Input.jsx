
function Input(props) {
  return (
    <input
      type={props.type}
      placeholder={props.placeholder}
      className={props.style ? 
          "border border-transparent rounded-sm outline-0 bg-gray-600 focus:border text-white focus:border-emerald-200 box-border p-2 focus:text-white w-5/11" 
        : 
          "border border-transparent rounded-sm outline-0 bg-gray-600 focus:border text-white focus:border-emerald-200 box-border p-2 focus:text-white w-full"}
    />
  );
}

export default Input;
