import React, { FunctionComponent, useRef } from "react";
import "./EditorTab.scss";
import { updateDataToSend } from "../../utils/Functions/FunctionsEditArticle";
import { DataToSend } from "../../utils/Types";

interface EditorTabProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  cursorPosition: number[];
  setterCursorPosition: (position: number[]) => void;
  setterDataToSend: React.Dispatch<React.SetStateAction<DataToSend>>
  countImages: number;
}
const EditorTab: FunctionComponent<EditorTabProps> = ({
  textareaRef,
  cursorPosition,
  setterCursorPosition,
  setterDataToSend,
  countImages,
}) => {
  const editorBarRef = useRef<HTMLDivElement>(null);

  const insertSymbols = (
    patternLeft: string,
    patternRight: string,
    gapStr: number,
    inline: boolean = true
  ) => {
    const textarea = textareaRef.current!;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

      const countBreaksIntoLeftPattern = patternLeft.split("\n").length - 1;
      const countBreaksIntoRightPattern = patternRight.split("\n").length - 1;

      const previousString = textarea.value.substring(
        start - countBreaksIntoLeftPattern,
        start
      );
      const countBreaksIntoPreviousString =
        previousString.split("\n").length - 1;

      const nextString = textarea.value.substring(
        end,
        end + countBreaksIntoRightPattern
      );
      const countBreaksIntoNextString = nextString.split("\n").length - 1;

      const before = textarea.value.substring(
        0,
        start - countBreaksIntoPreviousString
      );
      const selectedText = textarea.value.substring(
        start - countBreaksIntoPreviousString,
        end + countBreaksIntoNextString
      );
      const after = textarea.value.substring(end + countBreaksIntoNextString);

      
      if (start === end){
        updateDataToSend(setterDataToSend,'article-data','content',undefined,`${before}${patternLeft}${patternRight}${after}`);
      } else{
        updateDataToSend(setterDataToSend,'article-data','content',undefined,`${before}${patternLeft}${selectedText}${patternRight}${after}`);
      }

    const newPosition = [start + gapStr, end + gapStr];
    setterCursorPosition(newPosition);
    

    textarea.focus();
    textarea.setSelectionRange(newPosition[0], newPosition[1]);
  };

  return (
    <div className={`editor-tab-wrap textTools`} ref={editorBarRef}>
      <div
        className="editor-tab-wrap-item"
        onClick={() =>
          insertSymbols(`\n\n{image:here${countImages + 1}}`, "\n\n", 15, false)
        }
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 27" fill="none">
          <path d="M20.9213 6.02899V5.97001H20.8623H5.92157H5.86259V6.02899V20.9422V21.0846L5.96327 20.9839L16.3687 10.5785C16.7263 10.221 17.2113 10.0202 17.7169 10.0202C18.2225 10.0202 18.7075 10.221 19.0651 10.5785L20.8206 12.334L20.9213 12.4347V12.2923V6.02899ZM9.18846 20.928L9.08778 21.0287H9.23016H20.8623H20.9213V20.9697V15.6284V15.604L20.904 15.5867L17.7586 12.4413L17.7169 12.3996L17.6752 12.4413L9.18846 20.928ZM5.52839 3.7289H21.2555C21.7612 3.7289 22.2463 3.9298 22.6039 4.28742C22.9615 4.64504 23.1624 5.13007 23.1624 5.63581V21.3629C23.1624 21.8687 22.9615 22.3537 22.6039 22.7113C22.2463 23.0689 21.7612 23.2698 21.2555 23.2698H5.52839C5.02264 23.2698 4.53761 23.0689 4.18 22.7113C3.82238 22.3537 3.62148 21.8687 3.62148 21.3629V5.63581C3.62148 5.13007 3.82238 4.64504 4.18 4.28742C4.53761 3.9298 5.02264 3.7289 5.52839 3.7289ZM8.33961 10.3539C8.33961 9.97679 8.45145 9.60811 8.66098 9.29452C8.87052 8.98093 9.16834 8.73652 9.51678 8.59219C9.86522 8.44786 10.2486 8.4101 10.6185 8.48367C10.9884 8.55725 11.3282 8.73887 11.5949 9.00556C11.8616 9.27224 12.0432 9.61202 12.1168 9.98193C12.1904 10.3518 12.1526 10.7352 12.0083 11.0837C11.864 11.4321 11.6195 11.73 11.3059 11.9395C10.9924 12.149 10.6237 12.2609 10.2465 12.2609C9.74078 12.2609 9.25575 12.06 8.89813 11.7023C8.54052 11.3447 8.33961 10.8597 8.33961 10.3539Z" fill="#F9FAFB" stroke="#F9FAFB" stroke-width="0.117953"/>
        </svg>
        <p>Insérer une image</p>
      </div>
    <div className="editor-tab-wrap-text-tools text-tools">
      <div
        className="text-tools-item"
        
        onClick={() => insertSymbols("\n\n[", "]\n\n", 3,false)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 27" fill="none">
          <path d="M23.6875 11.9271V11.9272V21.3635C23.6875 21.6606 23.5695 21.9457 23.3593 22.1558C23.1492 22.366 22.8642 22.484 22.567 22.484C22.2698 22.484 21.9848 22.366 21.7746 22.1558C21.5645 21.9457 21.4464 21.6606 21.4464 21.3635V14.1309V14.0204L21.3546 14.082L20.8299 14.4338C20.7072 14.5154 20.5697 14.5722 20.4252 14.6007C20.2806 14.6292 20.1318 14.629 19.9874 14.6C19.8429 14.5711 19.7055 14.5139 19.5832 14.4319C19.4608 14.3498 19.3557 14.2445 19.2741 14.1219C19.1924 13.9992 19.1357 13.8617 19.1071 13.7171C19.0786 13.5726 19.0788 13.4238 19.1078 13.2793C19.1368 13.1349 19.1939 12.9975 19.2759 12.8751C19.358 12.7527 19.4633 12.6477 19.586 12.566L19.586 12.566L21.9451 10.9933L21.9451 10.9933C22.1139 10.8806 22.3102 10.816 22.513 10.8062C22.7158 10.7964 22.9174 10.8419 23.0963 10.9378C23.2752 11.0337 23.4247 11.1763 23.5289 11.3506C23.633 11.5248 23.6878 11.7241 23.6875 11.9271ZM13.5239 11.1998H13.5829V11.1408V6.4227C13.5829 6.12551 13.7009 5.84049 13.9111 5.63034C14.1212 5.4202 14.4062 5.30214 14.7034 5.30214C15.0006 5.30214 15.2856 5.4202 15.4958 5.63034C15.7059 5.84049 15.824 6.12551 15.824 6.4227V18.218C15.824 18.5152 15.7059 18.8002 15.4958 19.0104C15.2856 19.2205 15.0006 19.3386 14.7034 19.3386C14.4062 19.3386 14.1212 19.2205 13.9111 19.0104C13.7009 18.8002 13.5829 18.5152 13.5829 18.218V13.4999V13.4409H13.5239H5.66034H5.60136V13.4999V18.218C5.60136 18.5152 5.4833 18.8002 5.27316 19.0104C5.06301 19.2205 4.77799 19.3386 4.4808 19.3386C4.18361 19.3386 3.8986 19.2205 3.68845 19.0104C3.4783 18.8002 3.36025 18.5152 3.36025 18.218V6.4227C3.36025 6.12551 3.4783 5.84049 3.68845 5.63034C3.8986 5.4202 4.18361 5.30214 4.4808 5.30214C4.77799 5.30214 5.06301 5.4202 5.27316 5.63034C5.4833 5.84049 5.60136 6.12551 5.60136 6.4227V11.1408V11.1998H5.66034H13.5239Z" fill="#F9FAFB" stroke="#F9FAFB" stroke-width="0.117953"/>
        </svg>
        <p>Titre</p>
      </div>
      
      <div
        className="text-tools-item"
        onClick={() => insertSymbols("**", "**", 2)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 27" fill="none">
          <path d="M18.2186 12.1318L18.1736 12.1866L18.2357 12.2209C19.2171 12.7618 19.9908 13.6137 20.4351 14.6424C20.8793 15.6712 20.969 16.8184 20.69 17.9037C20.4109 18.989 19.779 19.9507 18.8936 20.6376C18.0081 21.3244 16.9195 21.6974 15.799 21.6979H7.93539C7.6382 21.6979 7.35318 21.5798 7.14304 21.3697C6.93289 21.1595 6.81484 20.8745 6.81484 20.5773V5.63656C6.81484 5.33937 6.93289 5.05436 7.14304 4.84421C7.35318 4.63407 7.6382 4.51601 7.93539 4.51601L14.6194 4.51601C14.6194 4.51601 14.6194 4.51601 14.6194 4.51601C15.5019 4.51632 16.3662 4.76728 17.1117 5.23968C17.8571 5.71207 18.4531 6.38647 18.8302 7.18438C19.2073 7.98229 19.35 8.8709 19.2417 9.74676C19.1334 10.6226 18.7786 11.4497 18.2186 12.1318ZM9.11493 6.75712H9.05595V6.8161V11.5342V11.5932H9.11493H14.6194C15.2607 11.5932 15.8758 11.3385 16.3292 10.885C16.7827 10.4315 17.0375 9.81647 17.0375 9.17517C17.0375 8.53386 16.7827 7.91882 16.3292 7.46535C15.8758 7.01188 15.2607 6.75712 14.6194 6.75712H9.11493ZM9.05595 19.3978V19.4568H9.11493H15.799C16.5445 19.4568 17.2596 19.1606 17.7868 18.6334C18.314 18.1062 18.6102 17.3911 18.6102 16.6455C18.6102 15.9 18.314 15.1849 17.7868 14.6577C17.2596 14.1305 16.5445 13.8343 15.799 13.8343H9.11493H9.05595V13.8933V19.3978Z" fill="#F9FAFB" stroke="#F9FAFB" stroke-width="0.117953"/>
        </svg>
        <p>Gras</p>
      </div>
      
      <div
        className="text-tools-item"
        onClick={() => insertSymbols("*", "*", 1)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 27" fill="none">
          <path d="M16.124 7.54325H16.0815L16.0681 7.58358L12.1363 19.3789L12.1104 19.4565H12.1923H14.4874C14.7846 19.4565 15.0696 19.5746 15.2798 19.7847C15.4899 19.9949 15.608 20.2799 15.608 20.5771C15.608 20.8743 15.4899 21.1593 15.2798 21.3695C15.0696 21.5796 14.7846 21.6977 14.4874 21.6977H6.62387C6.32668 21.6977 6.04166 21.5796 5.83152 21.3695C5.62137 21.1593 5.50331 20.8743 5.50331 20.5771C5.50331 20.2799 5.62137 19.9949 5.83152 19.7847C6.04166 19.5746 6.32668 19.4565 6.62387 19.4565H9.7054H9.74791L9.76135 19.4162L13.6931 7.62088L13.719 7.54325H13.6372H11.342C11.0448 7.54325 10.7598 7.4252 10.5497 7.21505C10.3395 7.00491 10.2214 6.71989 10.2214 6.4227C10.2214 6.12551 10.3395 5.84049 10.5497 5.63034C10.7598 5.4202 11.0448 5.30214 11.342 5.30214H19.2056C19.5028 5.30214 19.7878 5.4202 19.9979 5.63034C20.2081 5.84049 20.3261 6.12551 20.3261 6.4227C20.3261 6.71989 20.2081 7.00491 19.9979 7.21505C19.7878 7.4252 19.5028 7.54325 19.2056 7.54325H16.124Z" fill="#F9FAFB" stroke="#F9FAFB" stroke-width="0.117953"/>
        </svg>
        <p>Italique</p>
      </div>
      
    </div>
    </div>

  );
};

export default EditorTab;

// cursorPosition[0] !== cursorPosition[1] ? (
