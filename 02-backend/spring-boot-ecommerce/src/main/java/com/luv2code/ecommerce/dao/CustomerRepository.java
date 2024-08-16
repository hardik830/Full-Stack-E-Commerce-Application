package com.luv2code.ecommerce.dao;

import com.luv2code.ecommerce.Entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface CustomerRepository extends JpaRepository<Customer, Long>
{
    //it returns null if dont find anything
    Customer findByEmail(String theEmail);

}
