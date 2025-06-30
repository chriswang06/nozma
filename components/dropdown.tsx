'use client';
import { useState, useEffect, useRef} from 'react';

interface Data {
  _id : string;
  name:   string;
  created_at? : string;
}

interface SearchDropdownProps {
  data: Data[];
  onSelect: (item: Data) => void;
}

const styles = {
  container: "relative w-full max-w-md",
  input: "w-full p-3 border border-gray-300 rounded-lg cursor-pointer",
  dropdown: "absolute top-full mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-50",
  item: "p-3 hover:bg-gray-100 cursor-pointer border-b",
  itemHeader: "font-medium",
  itemSub: "text-sm text-gray-500",
};

function Dropdown( {data, onSelect} : SearchDropdownProps){
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Data | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: Data) => {
    setSelectedItem(item);
    setOpen(false);
    onSelect(item);
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div 
        onClick={() => setOpen(!isOpen)}
        className={styles.input}
      >
        {selectedItem ? selectedItem.name : 'Select an item...'}
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {data.map((item) => (
            <div
              key={item._id}
              onClick={() => handleSelect(item)}
              className={styles.item}
            >
              <div className={styles.itemHeader}>{item.name}</div>
              <div className={styles.itemSub}>{item._id}</div>
              <div className= {styles.itemSub}>{item.created_at}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;