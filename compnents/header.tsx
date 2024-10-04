// components/Header.js
import React from 'react';
import { Alert, Button, Card, Label, TextInput } from "flowbite-react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { DarkThemeToggle } from "flowbite-react";
import { Footer } from "flowbite-react";

import Menu  from "./Menu"
const Header = ({ }) => {
  return (
    <header>
       <Navbar fluid rounded>
      <Navbar.Brand href="/">
        <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React </span>
      </Navbar.Brand>
      
      
   
       <Menu/>
 
      
    </Navbar>

    </header>
    
  );
};

export default Header;