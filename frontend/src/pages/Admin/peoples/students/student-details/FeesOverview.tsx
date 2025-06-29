import React, { useState, useEffect } from 'react';
import { Modal, InputNumber, Select } from 'antd';


import { toast, ToastContainer } from 'react-toastify';
import mockApi from './MockApi';

const { Option } = Select;

interface FeeData {
  total: number;
  paid: number;
  due: number;
}

const FeesOverview = () => {
  const [data, setData] = useState<FeeData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

 

  const fetchData = (): Promise<FeeData> => {
    return new Promise((resolve, reject) => {
      try {
        resolve(mockApi.fees);
      } catch (error) {
        reject(error);
      }
    });
  };

  useEffect(() => {
    toast.promise(fetchData(), {
      pending: 'Fetching fee details...',
      success: 'Fee details loaded!',
      error: 'Failed to load fee details.',
    })
      .then((response) => {
        setData(response);
        setPaymentAmount(response.due);
      })
      .catch((error) => console.error(error));
  }, []);

  const handlePay = () => {
    toast.success(`Payment of $${paymentAmount} via ${paymentMethod} processed!`);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    toast('Payment cancelled');
  };

  if (!data) return <div className="text-center dark:text-white">Loading...</div>;

  return (
    <div className="card flex-fill">
  <ToastContainer position="top-center" autoClose={3000} />
      <div className="card-header">
        <h5 className="dark:text-white">Fees Overview</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <p className="font-medium dark:text-white">Total Fees</p>
          <p className="dark:text-white">${data.total}</p>
        </div>
        <div className="mb-3">
          <p className="font-medium dark:text-white">Paid</p>
          <p className="dark:text-white">${data.paid}</p>
        </div>
        <div className="mb-3">
          <p className="font-medium dark:text-white">Due</p>
          <p className="dark:text-white">${data.due}</p>
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
          onClick={() => {
            setIsModalVisible(true);
            toast('Opening payment modal');
          }}
        >
          Pay Now
        </button>
        <Modal
          title="Pay Fees"
          open={isModalVisible}
          onOk={handlePay}
          onCancel={handleCancel}
          okText="Pay"
          cancelText="Cancel"
          okButtonProps={{ className: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700' }}
          cancelButtonProps={{ className: 'bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700' }}
        >
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1 dark:text-white">Amount</label>
            <InputNumber
              min={0}
              value={paymentAmount}
              onChange={(value) => setPaymentAmount(value ?? 0)}
              className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1 dark:text-white">Payment Method</label>
            <Select
              value={paymentMethod}
              onChange={(value) => setPaymentMethod(value)}
              className="w-full dark:bg-gray-800 dark:text-white"
            >
              <Option value="Credit Card">Credit Card</Option>
              <Option value="Debit Card">Debit Card</Option>
              <Option value="Net Banking">Net Banking</Option>
            </Select>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default FeesOverview;