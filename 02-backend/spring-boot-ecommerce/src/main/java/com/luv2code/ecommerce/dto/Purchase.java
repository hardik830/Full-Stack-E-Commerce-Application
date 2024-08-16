package com.luv2code.ecommerce.dto;


import com.luv2code.ecommerce.Entity.Address;
import com.luv2code.ecommerce.Entity.Customer;
import com.luv2code.ecommerce.Entity.Order;
import com.luv2code.ecommerce.Entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}