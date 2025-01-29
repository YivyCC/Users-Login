import axios from "axios";

function BlockBtn({triggerAction}){
  return(
    <button className="border border-blue-500 rounded-sm p-2 cursor-pointer hover:border-blue-600 hover:text-blue-600 focus:border-blue-600 m-0 text-blue-500 flex place-items-center gap-1 h-full"
    onClick={() => triggerAction("block")}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-blue-500 hover:text-blue-600">
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
      </svg>
      <p>Block</p>
    </button>
  );
}

export default BlockBtn;
