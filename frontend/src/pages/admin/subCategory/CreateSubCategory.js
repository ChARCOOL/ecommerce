import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { getCategories, getCategory } from '../../../utils/category';
import { createSubCategory } from '../../../utils/subCategory';

const { Item } = Form;
const { Option } = Select;

const CreateSubCategory = () => {
  const { user } = useSelector((state) => state);

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  if (isLoading !== true && data === null) setIsLoading(true);
  else if (isLoading === true && data !== null) setIsLoading(false);

  useEffect(() => {
    getCategories()
      .then(({ data }) => setData(data.categories))
      .catch(({ response: { data } }) => toast.error(data.message));
  }, []);

  const handleSubmit = ({ name, category }) => {
    if (user) {
      return getCategory(category)
        .then(({ data }) => {
          createSubCategory(name, data.category._id, user.token)
            .then(({ data }) => toast.success(data.message))
            .catch(({ response: { data } }) => toast.error(data.message));
        })
        .catch(({ response: { data } }) => toast.error(data.message));
    }
    return toast.error('User token is invalid or does not exist');
  };

  let container;
  if (isLoading === false) {
    container = data.map((category) => (
      <Option key={category.slug} value={category.slug}>
        {category.name}
      </Option>
    ));
  }

  return (
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
      <Form
        onFinish={handleSubmit}
        layout="vertical"
        requiredMark="optional"
        style={{ width: '300px' }}
      >
        <Item
          name="category"
          label="Chose: "
          rules={[{ required: true, message: 'Category name cannot be blank' }]}
        >
          {isLoading === true ? (
            <Select
              showSearch
              listHeight={128}
              placeholder="Select category"
              disabled={isLoading}
            />
          ) : (
            <Select showSearch listHeight={128} placeholder="Select category">
              {container}
            </Select>
          )}
        </Item>
        <Item
          name="name"
          label="Name: "
          rules={[{ required: true, message: 'Sub category name cannot be blank' }]}
        >
          <Input type="text" placeholder="Enter sub category name..." disabled={isLoading} />
        </Item>
        <Button type="primary" htmlType="submit" className="mt-2" disabled={isLoading}>
          Create Sub Category
        </Button>
      </Form>
    </Spin>
  );
};

export default CreateSubCategory;
