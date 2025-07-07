'use client';
import Card from "@/components/card";
import Dropdown from "@/components/dropdown"
import SearchBar from "@/components/searchbar"
import { useState, useEffect } from 'react';


interface Data {
  _id: string;
  name: string;
  created_at?: string;
}
const styles = {
  container: "flex gap-2 mb-4",
  button: "w-27 px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-150 hover:bg-gray-50",
}

export default function Page() {
  const [selectedItem, setSelectedItem] = useState<Data | null>(null);
  const [data, setData] = useState<Data[]>([])
  const [fullData, setFullData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchTermKey, setSearchTermKey] = useState<string>('');
  const [searchTermValue, setSearchTermValue] = useState<string>('');
  const [expandAll, setExpandAll] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/shutterfly/ids')
      .then(res => res.json())
      .then(data => {
        setData(data);
      })
      .catch(err => {
        console.error('Error:', err);
      });
  }, []);

  const handleSelect = async (item: Data) => {
    setSelectedItem(item);
    setLoading(true);
    setSearchTermKey('');
    setSearchTermValue('')

    try {
      const response = await fetch(`/api/shutterfly/${item._id}`);
      const fullData = await response.json();
      setFullData(fullData);
    } catch (err) {
      console.error('Error fetching full document:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKey = (searchTermKey: string) => {
    setSearchTermKey(searchTermKey);
    setExpandAll(null);
  }
  const handleSearchValue = (searchTermValue: string) => {
    setSearchTermValue(searchTermValue);
    setExpandAll(null);
  }
  const expandAllFunc = () => {
    setExpandAll(true);
    setSearchTermValue('');
    setSearchTermKey('');

  }
  const hideAllFunc = () => {
    setExpandAll(false);
    setSearchTermValue('');
    setSearchTermKey('');
  }
  return (
    <div className="p-6">
      {fullData && !loading ?
        <div>
          <Dropdown data={data} onSelect={handleSelect} />
        </div>
        :
        <div className="min-h-screen flex justify-center items-center">
          <Dropdown data={data} onSelect={handleSelect} />
        </div>
      }

      {loading && <div className="mt-4">Loading...</div>}

      {fullData && !loading && (
        <div className={"mt-4"}>
          <div className={styles.container}>
            <SearchBar onSearch={handleSearchKey} placeholder="Search Keys"></SearchBar>
            <SearchBar onSearch={handleSearchValue} placeholder="Search Values"></SearchBar>
          </div>
          <div className={styles.container}>
            <button
              className={styles.button}
              onClick={expandAllFunc}>Expand All</button>
            <button
              className={styles.button}
              onClick={hideAllFunc}> Hide All</button>
          </div>
          <Card data={fullData}
            title={selectedItem?._id}
            searchTermKey={searchTermKey}
            searchTermValue={searchTermValue}
            expandAll={expandAll} />
        </div>
      )}
    </div>
  )
}