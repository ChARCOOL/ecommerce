import React, { useState } from 'react';
import { Menu, Card } from 'antd';

import CreateCategory from './category/CreateCategory';
import FindAndEditCategory from './category/FindAndEditCategory';

import CreateSubCategory from './subCategory/CreateSubCategory';
import FindAndEditSubCategory from './subCategory/FindAndEditSubCategory';

import CreateProduct from './product/CreateProduct';
import FindAndEditProduct from './product/FindAndEditProduct';

const { Item, SubMenu } = Menu;

const AdminDashboard = () => {
  const [selectedKey, setSelectedKey] = useState('createCategory');

  return (
    <>
      <Menu
        selectedKeys={selectedKey}
        onSelect={(e) => setSelectedKey(e.key)}
        mode="inline"
        style={{
          width: '15em',
          margin: '5em 7.5em',
          paddingRight: '2em',
          borderRight: '2px solid #1890FF',
        }}
      >
        <SubMenu key="category" title="Category">
          <Item key="createCategory">Create Category</Item>
          <Item key="findAndEditCategory">Find &amp; Edit Category</Item>
        </SubMenu>
        <SubMenu key="subCategory" title="Sub Category">
          <Item key="createSubCategory">Create Sub Category</Item>
          <Item key="findAndEditSubCategory">Find &amp; Edit Sub Category </Item>
        </SubMenu>
        <SubMenu key="product" title="Product">
          <Item key="createProduct">Create Product</Item>
          <Item key="findandeditproduct">Find &amp; Edit Product</Item>
        </SubMenu>
      </Menu>
      <Card
        className="d-table position-absolute"
        style={{
          top: '8em',
          left: '30em',
          border: '2px solid #1890FF',
          backgroundColor: '#fbfbf8',
        }}
      >
        {(() => {
          switch (selectedKey) {
            case 'createCategory':
              return <CreateCategory />;
            case 'findAndEditCategory':
              return <FindAndEditCategory />;
            case 'createSubCategory':
              return <CreateSubCategory />;
            case 'findAndEditSubCategory':
              return <FindAndEditSubCategory />;
            case 'createProduct':
              return <CreateProduct />;
            case 'findandeditproduct':
              return <FindAndEditProduct />;
            default:
              return null;
          }
        })()}
      </Card>
    </>
  );
};

export default AdminDashboard;
