import axios from "axios";

function UnblockBtn({triggerAction}){
  return(
    <button className="border border-blue-500 rounded-sm cursor-pointer hover:border-blue-600 focus:border-blue-600 w-10 flex place-content-center place-items-center" title="Unblock"
    onClick={() => triggerAction("unblock")}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-blue-500 hover:text-blue-600">
        <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 0 1-1.5 0V6.75a3.75 3.75 0 1 0-7.5 0v3a3 3 0 0 1 3 3v6.75a3 3 0 0 1-3 3H3.75a3 3 0 0 1-3-3v-6.75a3 3 0 0 1 3-3h9v-3c0-2.9 2.35-5.25 5.25-5.25Z" />
      </svg>
    </button>
  );
}

export default UnblockBtn;
