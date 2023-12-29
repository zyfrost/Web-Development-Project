// src/components/header/Header.js
import React from 'react'


const Header = (props) => {
    const welcome = 'Welcome to my website';
    const title = '30 Days of React';
    const subtitle = 'Supercharge your front-end skills in React';
    const firstName = 'Asabeneh';
    const lastName = 'Yetayeh';
    const date = new Date().toDateString();

    return (
        <header>
            <div className="header-wrapper">
                <h1>{welcome}</h1>
                <h2>{title}</h2>
                <h3>{subtitle}</h3>
                <p>
                    {firstName} {lastName}
                </p>
                <small>{date}</small>
            </div>
        </header>
    )
}

export default Header
