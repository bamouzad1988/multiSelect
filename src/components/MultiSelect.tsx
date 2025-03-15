// react
import { useEffect, useRef, useState } from "react";
// icon
import TickIcon from "@/assets/icons/tick.svg?react";
import ChevronIcon from "@/assets/icons/chevron.svg?react";
// react-hot-toast
import toast from "react-hot-toast";

// import cc from "../assets/images/ball.png"
interface State {
  isOpen: boolean;
  inputValue: string;
  selectedItems: string[];
  uniqList: MultiSelectList[];
}

interface Props {
  onChangeSelectedItem: (selectedItem: string[]) => void;
  list: MultiSelectList[];
}

const MultiSelect = ({ onChangeSelectedItem, list }: Props) => {
  const [state, setState] = useState<State>({
    isOpen: false,
    inputValue: "",
    selectedItems: [],
    uniqList: list?.length
      ? Array.from(new Map(list.map((item) => [item.value, item])).values())
      : [], //prevents to have duplicate item(s)
  });
  //destructure state
  const { isOpen, selectedItems, inputValue, uniqList } = state;
  //keeps main div
  const divRef = useRef<HTMLDivElement | null>(null);
  //keeps main div
  const inputRef = useRef<HTMLInputElement | null>(null);
  // for handle click outside and close list
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // close list
  const handleClickOutside = () => {
    if (divRef.current && divRef.current.contains(event?.target as Node)) {
      return;
    }
    setState((prev) => ({ ...prev, isOpen: false }));
  };
  // change isOpen to true
  const handleClickInput = () => {
    setState((prev) => ({ ...prev, isOpen: true }));
  };
  // change isOpen to true
  const handleClickChevron = () => {
    handleClickInput();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  // add or remove item to selectedItems
  const handleClickItem = (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    const value = e.currentTarget.dataset.value;

    if (!value) {
      return;
    }

    const isInList = selectedItems.includes(value || "");

    if (isInList) {
      const itemIndex = selectedItems.indexOf(value);

      const newArray = selectedItems.toSpliced(itemIndex, 1);

      setState((prev) => ({
        ...prev,
        selectedItems: [...newArray],
      }));

      onChangeSelectedItem([...newArray]);

      return;
    }

    setState((prev) => ({
      ...prev,
      selectedItems: [...prev.selectedItems, value],
    }));
    onChangeSelectedItem([...selectedItems, value]);
  };
  //when user type
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (inputValue) {
        // remove space from start and end of typed item
        const trimedValue = inputValue.trim();
        // check if typed item is duplicate or not
        const isInList = uniqList.find(
          (item) => item.label === trimedValue || item.value === trimedValue
        );

        if (isInList) {
          toast.error("Entered item exist on list!");
          return;
        }
        // create new object to add uniqList
        const newObject: MultiSelectList = {
          iconName: "/assets/images/default.png",
          label: trimedValue,
          value: trimedValue,
        };
        // update uniq list
        if (uniqList) {
          setState((prev) => ({
            ...prev,
            uniqList: [...prev.uniqList, newObject],
            inputValue: "",
          }));
        }
      }
    }
  };
  // update inputValue
  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setState((prev) => ({ ...prev, inputValue: value || "" }));
  };
  // calculate height of ul based on length of uniqList.
  const getListLength = (): number => {
    if (uniqList.length) {
      return uniqList.length * 36 + 16;
    }
    return 0;
  };
  return (
    <div className="multi-select-parent" ref={divRef}>
      {/* input */}
      <div className="input-parent">
        <input
          placeholder="type new item"
          type="text"
          name="multiSelect"
          onFocus={handleClickInput}
          onKeyUp={handleKeyUp}
          value={inputValue}
          onChange={handleChangeInput}
          ref={inputRef}
          className={`${isOpen ? "open" : ""}`}
        />

        <ChevronIcon
          className={`${isOpen ? "chevron-rotate" : "chevron"}`}
          onClick={handleClickChevron}
        />
      </div>
      {/* list */}
      {uniqList.length ? (
        <div
          className={`${isOpen ? "open ul-parent" : "ul-parent"}`}
          style={{ height: isOpen ? getListLength() : 0 }}
        >
          <ul className={`${isOpen ? "open" : ""}`}>
            {uniqList?.map((item, index) => {
              return selectedItems.includes(item.value) ? (
                <li
                  onClick={handleClickItem}
                  key={item.value + index}
                  data-value={item.value}
                  className="selected"
                >
                  <div className="li-image-parent">
                    <span>{item.label}</span>
                    <img src={item.iconName} alt={item.label} />
                  </div>
                  <TickIcon />
                </li>
              ) : (
                <li
                  onClick={handleClickItem}
                  key={item.value + index}
                  data-value={item.value}
                >
                  <div className="li-image-parent">
                    <span>{item.label}</span>
                    <img src={item.iconName} alt={item.label} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <ul className={`${isOpen ? "open no-data" : "no-data"}`}>
          There is no item in list.Type new Item and press Enter on keyboard...
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
