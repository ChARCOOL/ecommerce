import React, { useRef, useState } from 'react';
import { Menu, Input, AutoComplete } from 'antd';
import { searchProduct } from '../utils/product';
import { useHistory } from 'react-router-dom';

const { Item } = Menu;
const { Search } = Input;

const SearchBar = (props) => {
  const history = useHistory();

  const timeout = useRef(null);

  const [value, setValue] = useState('');
  const [products, setProducts] = useState([]);

  const handleChange = (value) => {
    setValue(value);

    if (value && value.length > 0) {
      clearTimeout(timeout.current);

      timeout.current = setTimeout(() => {
        searchProduct(value).then(({ data }) => {
          const products = data.products.map((product) => ({
            value: product.slug,
            label: product.title,
          }));

          setProducts(products);
        });
      }, 300);
    }
  };

  const handleSelect = (product) => {
    setValue('');

    history.push(`/product/${product}`);
  };

  return (
    <>
      <Item className="mt-2 float-right search" key="search" {...props}>
        <div className="d-flex align-items-center" style={{ zIndex: '999 !important' }}>
          <AutoComplete
            options={products}
            value={value}
            onChange={handleChange}
            onSelect={handleSelect}
          >
            <Search />
          </AutoComplete>
        </div>
      </Item>
    </>
  );
};

export default SearchBar;
