// components
import MultiSelect from "./components/MultiSelect";
// utils
import { multiSelectList } from "./utils/constant";
// react-hot-toast
import { Toaster } from "react-hot-toast";

function App() {
  const handleChangeList = (list: string[]) => {
    console.log(list);
  };

  return (
    <div className="multi-select-holder">
      <MultiSelect
        onChangeSelectedItem={handleChangeList}
        list={multiSelectList}
      />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
