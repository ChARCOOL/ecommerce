import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Spin, Form, Select, List, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import './_findandeditsubcategory.less';

import { getCategories } from '../../../utils/category';
import { getSubCategories, updateSubCategory, removeSubCategory } from '../../../utils/subCategory';

const { Option } = Select;
const { Item } = Form;

const FindAndEditSubCategory = () => {
  const { user } = useSelector((state) => state);

  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategories] = useState(null);
  const [filteredSubCategories, setFilteredSubCategories] = useState(null);

  const [isLoading, setIsLoading] = useState(null);
  if (
    isLoading !== true &&
    categories === null &&
    subCategories === null &&
    filteredSubCategories === null
  )
    setIsLoading(true);
  else if (
    isLoading === true &&
    categories !== null &&
    subCategories !== null &&
    filteredSubCategories !== null
  )
    setIsLoading(false);

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data.categories))
      .catch(({ response: { data } }) => toast.error(data.message));

    getSubCategories()
      .then(({ data }) => {
        setSubCategories(data.subCategories);
        setFilteredSubCategories(data.subCategories);
      })
      .catch(({ response: { data } }) => toast.error(data.message));
  }, []);

  const handleSelect = (category) => {
    setFilteredSubCategories(
      subCategories.filter((subCategories) => subCategories.parent.name === category)
    );
  };

  const _updateSubCategory = (slug) => {
    if (user) {
      // eslint-disable-next-line
      while (true) {
        const name = window.prompt('Enter new name: ');

        if (name === null) break;
        else if (name.length >= 2) {
          updateSubCategory(slug, name, user.token)
            .then(() =>
              getSubCategories().then(({ data }) => setFilteredSubCategories(data.subCategories))
            )
            .catch(({ response: { data } }) => toast.error(data.message));

          break;
        } else alert('Name must have minimum length of 2 and maximum of 32 characters');
      }
    }
  };

  const _removeSubCategory = (slug) => {
    if (user) {
      if (window.confirm('Are you sure ?')) {
        removeSubCategory(slug, user.token)
          .then(() =>
            getSubCategories().then(({ data }) => setFilteredSubCategories(data.subCategories))
          )
          .catch(({ response: { data } }) => toast.error(data.message));
      }
    }
  };

  let selectContainer;
  if (isLoading === false) {
    selectContainer = categories.map((category) => (
      <Option key={category._id} value={category.name}>
        {category.name}
      </Option>
    ));
  }

  let listContainer;
  if (isLoading === false) {
    listContainer = (
      <List
        dataSource={filteredSubCategories}
        pagination={{ pageSize: 7 }}
        renderItem={(item) => (
          <List.Item className="sub-category-list">
            <span
              style={{
                width: '100%',
                display: 'flex',
              }}
            >
              <p style={{ width: '30%', textAlign: 'start' }}>
                Category:&nbsp; <b>{item.parent.name}</b>
              </p>
              <p style={{ width: '30%', textAlign: 'start' }}>
                Sub Category:&nbsp; <b>{item.name}</b>
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
                onClick={() => _updateSubCategory(item.slug)}
              />
              <Button
                type="primary"
                danger
                htmlType="button"
                icon={<DeleteOutlined />}
                onClick={() => _removeSubCategory(item.slug)}
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
        <Item
          name="selectCategory"
          label="Select: "
          className="find-and-update"
          style={{ width: '30em' }}
        >
          {isLoading === true ? (
            <Select showSearch listHeight={128} placeholder="Category" disabled={true} />
          ) : (
            <Select showSearch listHeight={128} placeholder="Category" onSelect={handleSelect}>
              {selectContainer}
            </Select>
          )}
        </Item>
      </Form>
      <hr className="mb-0" />
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
        {listContainer}
      </Spin>
    </>
  );
};

export default FindAndEditSubCategory;
