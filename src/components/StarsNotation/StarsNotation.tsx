import { FunctionComponent } from "react";
import './StarsNotation.scss'

const StarsNotation:FunctionComponent<{note:number}> = ({note}) => {

  return (
    <div className="stars-notation-wrap">
     
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 16" fill="none">
  <g clip-path="url(#clip0_523_1442)">
    <path d="M7.48834 1.93945L9.36107 5.73339L13.5489 6.34551L10.5186 9.29703L11.2338 13.4667L7.48834 11.497L3.74289 13.4667L4.45804 9.29703L1.42773 6.34551L5.61561 5.73339L7.48834 1.93945Z" stroke="currentColor" stroke-width="1.21212" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_523_1442">
      <rect width="14.5455" height="14.5455" fill="white" transform="translate(0.214844 0.726562)"/>
    </clipPath>
  </defs>
</svg>
<p>{(note/2).toString().split('.').join(',')}</p>
          
    </div>
    
  );
};

export default StarsNotation;
