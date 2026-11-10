var productionTasks = require('@config/prod/tasks.json');
var productionCustomerInformation = require('@config/prod/customer.json');
var productionPaymentInformation = require('@config/prod/payment.json');
var productionNotificationsInformation = require('@config/prod/notifications.json');

export interface CustomerInformation {
  address: string;
  addressSecondLine?: string;
  budget: number;
  city: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  state: string;
  zipcode: string;
}

export interface PaymentInformation {
  creditCardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
  address: string;
  city: string;
  firstName: string;
  lastName: string;
  state: string;
  zipcode: string;
}

const getTasks = function () {
  return productionTasks;
};

const getCustomerInformation = (): function CustomerInformation {
  return productionCustomerInformation;
};

const getPaymentInformation = (): function PaymentInformation {
  return productionPaymentInformation;
};

const getNotificationsInformation = (): function any {
  return productionNotificationsInformation;
};
