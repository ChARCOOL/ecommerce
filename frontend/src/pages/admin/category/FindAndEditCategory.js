import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Button, List, Spin } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import './_findandeditcategory.less';

import { getCategories, removeCategory, updateCategory } from '../../../utils/category';

const { Item } = Form;

const FindAndEditCategory = () => {
  const { user } = useSelector((state) => state);

  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  const [isLoading, setIsLoading] = useState(null);

  if (isLoading !== true && data === null && filteredData === null) setIsLoading(true);
  else if (isLoading === true && data !== null && filteredData !== null) setIsLoading(false);

  useEffect(() => {
    getCategories().then(({ data }) => {
      setData(data.categories);
      setFilteredData(data.categories);
    });
  }, []);

  const findCategory = ({ target: { value } }) =>
    setFilteredData(data.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase())));

  const _updateCategory = (slug) => {
    if (user) {
      // eslint-disable-next-line
      while (true) {
        const name = window.prompt('Enter new name: ');

        if (name === null) break;
        else if (name.length >= 2) {
          updateCategory(slug, name, user.token)
            .then(() => getCategories().then(({ data }) => setFilteredData(data.categories)))
            .catch(({ response: { data } }) => toast.error(data.message));

          break;
        } else alert('Name must have minimum length of 2 and maximum of 32 characters');
      }
    }
  };

  const _removeCategory = (slug) => {
    if (user) {
      if (window.confirm('Are you sure ?')) {
        removeCategory(slug, user.token)
          .then(() => getCategories().then(({ data }) => setFilteredData(data.categories)))
          .catch(({ response: { data } }) => toast.error(data.message));
      }
    }
  };

  let container;
  if (isLoading === false) {
    container = (
      <List
        dataSource={filteredData}
        pagination={{ pageSize: 7 }}
        renderItem={(item) => (
          <List.Item className="category-list">
            <span
              style={{
                width: '100%',
                display: 'flex',
              }}
            >
              <p style={{ width: '30%', textAlign: 'start' }}>
                Name:&nbsp; <b>{item.name}</b>
              </p>
              <p style={{ width: '30%', textAlign: 'start' }}>
                Slug:&nbsp; <b>{item.slug}</b>
              </p>
              <p style={{ width: '40%', textAlign: 'end' }}>
                Updated At:&nbsp; <b>{item.updatedAt}</b>
              </p>
            </span>
            <span
              style={{
                marginLeft: '20px',
                width: '80px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button
                type="primary"
                htmlType="button"
                icon={<EditOutlined />}
                onClick={() => _updateCategory(item.slug)}
              />
              <Button
                type="primary"
                danger
                htmlType="button"
                icon={<DeleteOutlined />}
                onClick={() => _removeCategory(item.slug)}
              />
            </span>
          </List.Item>
        )}
      />
    );
  }

  return (
    <>
      <Form
        layout="inline"
        style={{
          width: '60em',
          justifyContent: 'center',
        }}
      >
        <Item name="findName" label="Find: " className="find-and-update" style={{ width: '30em' }}>
          <Input
            type="text"
            placeholder="Enter category name.."
            onChange={findCategory}
            disabled={isLoading}
          />
        </Item>
      </Form>
      <hr style={{ marginBottom: '0' }} />
      <Spin
        spinning={isLoading}
        className="text-center m-auto position-absolute"
        size="large"
        style={{
          width: 10,
          height: 10,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        {container}
      </Spin>
    </>
  );
};

export default FindAndEditCategory;
