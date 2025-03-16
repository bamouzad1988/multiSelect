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
  uniqList: MultiSelectList[];
  lastSelectItemIndex: number | null;
}

interface Props {
  onChangeSelectedItem: (selectedItem: MultiSelectList[]) => void;
  list: MultiSelectList[];
}

const MultiSelect = ({ onChangeSelectedItem, list }: Props) => {
  const [state, setState] = useState<State>({
    isOpen: false,
    inputValue: "",
    lastSelectItemIndex: null,
    uniqList: list?.length
      ? Array.from(new Map(list.map((item) => [item.value, item])).values())
      : [], //prevents to have duplicate items
  });
  //destructure state
  const { isOpen, inputValue, uniqList, lastSelectItemIndex } = state;
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
    const index = e.currentTarget.dataset.index;

    if (!value) {
      return;
    }

    if (index) {
      const currentItem = uniqList[+index];

      const newArray = uniqList.toSpliced(+index, 1, {
        ...currentItem,
        isChecked: !currentItem.isChecked,
      });

      setState((prev) => ({
        ...prev,
        uniqList: [...newArray],
        lastSelectItemIndex: currentItem.isChecked ? null : +index,
        inputValue: currentItem.isChecked ? "" : currentItem.label,
      }));

      onChangeSelectedItem([...newArray]);

      return;
    }
  };
  //when user type
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const trimedValue = inputValue.trim();
      if (trimedValue) {
        // update uniq list
        if (uniqList && lastSelectItemIndex !== null) {
          const newItem: MultiSelectList = {
            ...uniqList[lastSelectItemIndex],
            label: trimedValue,
          };

          const newArray = uniqList.toSpliced(lastSelectItemIndex, 1, {
            ...newItem,
            label: trimedValue,
          });

          setState((prev) => ({
            ...prev,
            uniqList: [...newArray],
            inputValue: "",
          }));
          onChangeSelectedItem([...newArray]);
        } else {
          toast.error("Please select an item");
        }
      } else {
        toast.error("Input is Empty!");
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
          placeholder="Select an item and edit..."
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
              return item.isChecked ? (
                <li
                  onClick={handleClickItem}
                  key={item.value}
                  data-value={item.value}
                  data-index={index}
                  className="selected"
                >
                  <div className="li-image-parent">
                    <span title={item.label}>{item.label}</span>
                    <img src={item.iconName} alt={item.label} />
                  </div>
                  <TickIcon className="icon" />
                </li>
              ) : (
                <li
                  onClick={handleClickItem}
                  key={item.value}
                  data-index={index}
                  data-value={item.value}
                >
                  <div className="li-image-parent">
                    <span title={item.label}>{item.label}</span>
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
