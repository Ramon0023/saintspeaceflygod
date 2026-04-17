import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import Spinner from '../components/ui/Spinner';

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['All']);

  const activeCollection = searchParams.get('collection') || 'All';
  const sort = searchParams.get('sort') || 'newest';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    // Fetch categories
    axios.get('/api/products/collections')
      .then(res => {
        setCategories(['All', ...res.data.map(c => c.name)]);
      })
      .catch(err => console.error('Failed to fetch collections:', err));
  }, []);

  useEffect(() => {
    document.title = 'The Archives | Saintspeaceflygod™';
    let url = `/api/products?sort=${sort}`;
    if (activeCollection !== 'All') {
      url += `&collection=${activeCollection}`;
    }
    if (searchQuery) {
      url += `&search=${searchQuery}`;
    }

    axios.get(url)
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [activeCollection, sort, searchQuery]);

  const updateFilter = (key, value) => {
    setLoading(true);
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="font-serif italic text-5xl md:text-6xl mb-4">The Archives</h1>
        <p className="text-[var(--color-text-muted)] tracking-widest uppercase text-sm">Discover your elevation</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => updateFilter('collection', cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-sans transition-colors ${
                activeCollection === cat 
                  ? 'bg-[var(--color-accent)] text-white' 
                  : 'bg-[rgba(14,0,26,0.5)] text-[var(--color-text-muted)] hover:text-white border border-[rgba(147,51,234,0.2)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 text-sm font-sans">
          <span className="text-[var(--color-text-muted)]">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="bg-transparent text-white border-b border-[var(--color-accent)] py-1 focus:outline-none focus:bg-[var(--color-purple-900)] [&>option]:text-black"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A - Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20"><Spinner size="lg" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-muted)] font-serif italic text-2xl">
          The void is empty here.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
