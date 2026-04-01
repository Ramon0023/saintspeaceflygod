import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    // Direct users to collections page, we can assume the query is handled there or visually apparent
    navigate(`/collections?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search the Vault">
      <form onSubmit={handleSearch} className="flex gap-4 items-end mt-4">
        <div className="flex-1 mb-[-16px]">
          <Input 
            placeholder="Search for garments, collections..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <Button type="submit" className="mb-[22px] h-[42px] px-4">
          <Search size={20} />
        </Button>
      </form>
    </Modal>
  );
}
