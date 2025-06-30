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


export default function Page() {
  const [selectedItem, setSelectedItem] = useState<Data | null>(null);
  const [data, setData] = useState<Data[]>([])
  const [fullData, setFullData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

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
    setSearchTerm('');

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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  }
  return (
    <div className="p-6">
      { fullData && !loading ?  
      <div>
        <Dropdown data={data} onSelect={handleSelect} />
      </div>
      :
      <div className = "min-h-screen flex justify-center items-center">
          <Dropdown data={data} onSelect={handleSelect} />
      </div>
    }
      
      {loading && <div className="mt-4">Loading...</div>}

      {fullData && !loading && (
        <div className="mt-4">
          <SearchBar onSearch={handleSearch} placeholder = "Search Document"></SearchBar>
          <Card data={fullData}
            title={selectedItem?._id}
            searchTerm={searchTerm} />
        </div>
      )}
    </div>
  )
}