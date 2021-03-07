import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { createCategory } from '../../../utils/category';

const { Item } = Form;

const CreateCategory = () => {
  const { user } = useSelector((state) => state);

  const [isLoading, setIsLoading] = useState(null);

  const handleSubmit = ({ name }) => {
    setIsLoading(true);

    if (user) {
      return createCategory(name, user.token)
        .then(({ data }) => {
          toast.success(data.message);
          return setIsLoading(false);
        })
        .catch(({ response: { data } }) => {
          toast.error(data.message);
          return setIsLoading(false);
        });
    } else {
      toast.error('User token is invalid or does not exist');
      return setIsLoading(false);
    }
  };

  return (
    <Form
      onFinish={handleSubmit}
      layout="vertical"
      requiredMark="optional"
      style={{ width: '300px' }}
    >
      <Item
        name="name"
        label="Name: "
        rules={[
          { required: true, message: 'Category name cannot be blank' },
          { min: 2, message: 'Category name must have minimum 2 characters' },
          { max: 32, message: 'Category name must have maximum 32 characters' },
        ]}
      >
        <Input type="text" placeholder="Enter category name.." />
      </Item>
      <Button type="primary" htmlType="submit" className="mt-2" disabled={isLoading}>
        Create category
      </Button>
    </Form>
  );
};

export default CreateCategory;
