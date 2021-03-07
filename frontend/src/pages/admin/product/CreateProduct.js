import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Button, Select, Spin, Avatar, Badge } from 'antd';
import { toast } from 'react-toastify';

import { getCategories } from '../../../utils/category';
import { getSubCategories } from '../../../utils/subCategory';
import { createProduct, uploadImage, removeImage } from '../../../utils/product';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

const colors = ['Black', 'Brown', 'Silver', 'White', 'Blue'];
const brands = ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'];

const CreateProduct = () => {
  const { user } = useSelector((state) => state);

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategories] = useState(null);

  const [isLoading, setIsLoading] = useState(null);

  if (isLoading !== true && categories === null) setIsLoading(true);
  else if (isLoading === true && categories !== null) setIsLoading(false);

  useEffect(() => getCategories().then(({ data }) => setCategories(data.categories)), []);

  let categoriesContainer;
  if (isLoading === false) {
    categoriesContainer = categories.map((category) => (
      <Option key={category.name} value={category._id}>
        {category.name}
      </Option>
    ));
  }

  let subCategoriesContainer;
  if (subCategories !== null) {
    subCategoriesContainer = subCategories.map((subCategory) => (
      <Option key={subCategory.name} value={subCategory._id}>
        {subCategory.name}
      </Option>
    ));
  }

  const handleSelect = (value) => {
    getSubCategories().then(({ data }) =>
      setSubCategories(data.subCategories.filter((subCategory) => subCategory.parent._id === value))
    );
  };

  const handleSubmit = (values) => {
    values.images = images.map((image) => ({ url: image.url, public_id: image.public_id }));

    if (user) {
      createProduct(values, user.token)
        .then(({ data }) => toast.success(data.message))
        .catch(({ response: { data } }) => toast.error(data.message));
    }
  };

  const handleImgUpload = ({ target: { files } }) => {
    if (user) {
      for (const file of files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = ({ target: { result } }) =>
          uploadImage(result, user.token)
            .then(({ data }) => setImages((images) => [...images, data]))
            .catch(({ response: { data } }) => toast.error(data.message));
      }
    }
  };

  const handleImgRemove = (public_id) => {
    if (user) {
      removeImage(public_id, user.token)
        .then(() => setImages((images) => images.filter((image) => image.public_id !== public_id)))
        .catch(({ response: { data } }) => toast.error(data.message));
    }
  };

  const [form] = Form.useForm();

  const imagesRef = useRef();

  const resetFields = () => {
    setTimeout(() => {
      imagesRef.current.style.display = 'none';
      imagesRef.current.innerHTML = null;

      form.resetFields();
    }, 500);
  };

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
        style={{ width: '400px', height: '600px', overflow: 'auto' }}
        form={form}
      >
        <Item
          name="images"
          label="Images: "
          rules={[{ required: true, message: 'This field is required' }]}
        >
          <Input type="file" accept="image/jpeg" multiple onChange={handleImgUpload} />
        </Item>
        {images[0] && (
          <div
            ref={imagesRef}
            style={{
              marginBottom: '24px',
              display: 'inline-flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {images.map((image, idx) => (
              <Badge
                count="X"
                key={idx}
                offset={[-20, 0]}
                style={{ cursor: 'pointer' }}
                onClick={() => handleImgRemove(image.public_id)}
              >
                <Avatar
                  size={150}
                  src={image.url}
                  shape="square"
                  style={{
                    marginRight: '20px',
                    borderRadius: '15px',
                    border: '1px solid grey',
                  }}
                />
              </Badge>
            ))}
          </div>
        )}
        <Item
          name="title"
          label="Title: "
          rules={[
            { required: true, message: 'This field is required' },
            { min: 2, message: 'Title must be minimum 2 characters long' },
            { max: 50, message: 'Title must be maximum 50 characters long' },
          ]}
        >
          <Input type="text" />
        </Item>
        <Item
          name="description"
          label="Description: "
          rules={[
            { required: true, message: 'This field is required' },
            { max: 3000, message: 'Description must be maximum 3000 characters long' },
          ]}
          className="mt-2"
        >
          <TextArea />
        </Item>
        <Item
          name="price"
          label="Price: "
          rules={[
            { required: true, message: 'This field is required' },
            { max: 32, message: 'Price must be maximum 32 characters long' },
          ]}
          className="mt-2"
        >
          <Input type="number" />
        </Item>
        <Item name="category" label="Category: " className="mt-2">
          {isLoading === true ? (
            <Select listHeight={128} disabled={isLoading} />
          ) : (
            <Select listHeight={128} onSelect={handleSelect}>
              {categoriesContainer}
            </Select>
          )}
        </Item>
        <Item name="subCategory" label="Sub Category: " className="mt-2">
          <Select mode="multiple" allowClear listHeight={128} disabled={!subCategories}>
            {subCategoriesContainer}
          </Select>
        </Item>
        <Item
          name="quantity"
          label="Quantity: "
          rules={[{ required: true, message: 'This field is required' }]}
          className="mt-2"
        >
          <Input type="number" />
        </Item>
        <Item
          name="shipping"
          label="Shipping: "
          rules={[{ required: true, message: 'This field is required' }]}
          className="mt-2"
        >
          <Select>
            <Option value="Yes">Yes</Option>
            <Option value="No">No</Option>
          </Select>
        </Item>
        <Item
          name="color"
          label="Color: "
          rules={[{ required: true, message: 'This field is required' }]}
          className="mt-2"
        >
          <Select>
            {colors.map((color) => (
              <Option key={color} value={color}>
                {color}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          name="brand"
          label="Brand: "
          rules={[{ required: true, message: 'This field is required' }]}
          className="mt-2"
        >
          <Select>
            {brands.map((brand) => (
              <Option key={brand} value={brand}>
                {brand}
              </Option>
            ))}
          </Select>
        </Item>
        <Button type="primary" htmlType="submit" className="mt-3" onClick={resetFields}>
          Create Product
        </Button>
      </Form>
    </Spin>
  );
};

export default CreateProduct;
