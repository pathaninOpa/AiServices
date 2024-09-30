import React, { useState } from "react";
import { Dropdown } from 'react-bootstrap';

const CustomDropDown = ({data, order=0, variant, value, onSelect}) => {
    return (<>
    <Dropdown>
        <Dropdown.Toggle variant={variant} id="dropdown-basic">
            {value}
        </Dropdown.Toggle>
        <Dropdown.Menu>
            {data.length > 0 ? (
                data.map((record) => (
                    <Dropdown.Item key={record._id} href="#" onClick={() => {
                        onSelect(order, record.name, record.email)
                    }}>
                        {record.name}
                    </Dropdown.Item>
                ))
            ) : (
                <Dropdown.Item disabled>No users available</Dropdown.Item>
            )}
        </Dropdown.Menu>
    </Dropdown>
    </>)
}

export default CustomDropDown